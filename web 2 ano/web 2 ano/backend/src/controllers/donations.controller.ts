import { Response } from 'express';
import { DonationStatus, RequestStatus, DeliveryStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { calculateUrgency } from '../services/ai.service';
import { calculateDonationPoints, calculateLevel } from '../services/gamification.service';

export async function createDonation(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      category,
      quantity,
      weightKg,
      expiryDate,
      address,
      latitude,
      longitude,
      availableFrom,
      availableUntil,
      notes,
    } = req.body;

    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const expiry = new Date(expiryDate);
    const urgency = calculateUrgency(expiry);

    const donation = await prisma.donation.create({
      data: {
        name,
        category,
        quantity,
        weightKg: parseFloat(weightKg),
        expiryDate: expiry,
        photo,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        availableFrom,
        availableUntil,
        notes,
        urgency,
        donorId: req.user!.id,
      },
      include: {
        donor: { select: { id: true, name: true, avatar: true } },
      },
    });

    return res.status(201).json(donation);
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({ error: 'Erro ao criar doação' });
  }
}

export async function listDonations(req: AuthRequest, res: Response) {
  try {
    const { status, category, urgency, lat, lng, radius = 10 } = req.query;

    const where: Record<string, unknown> = {};
    if (status) where.status = status as DonationStatus;
    if (category) where.category = category;
    if (urgency) where.urgency = urgency;

    let donations = await prisma.donation.findMany({
      where,
      include: {
        donor: { select: { id: true, name: true, avatar: true, city: true } },
        requests: { select: { id: true, status: true } },
      },
      orderBy: [{ urgency: 'asc' }, { expiryDate: 'asc' }],
    });

    if (lat && lng) {
      const userLat = parseFloat(lat as string);
      const userLng = parseFloat(lng as string);
      const maxRadius = parseFloat(radius as string);

      donations = donations.filter((d) => {
        const dist = haversine(userLat, userLng, d.latitude, d.longitude);
        return dist <= maxRadius;
      });
    }

    return res.json(donations);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar doações' });
  }
}

export async function getDonation(req: AuthRequest, res: Response) {
  try {
    const donation = await prisma.donation.findUnique({
      where: { id: req.params.id },
      include: {
        donor: { select: { id: true, name: true, avatar: true, phone: true, city: true } },
        requests: {
          include: {
            beneficiary: { select: { id: true, name: true, avatar: true } },
          },
        },
        delivery: {
          include: {
            volunteer: { select: { id: true, name: true, avatar: true, phone: true } },
          },
        },
      },
    });

    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });
    return res.json(donation);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar doação' });
  }
}

export async function updateDonationStatus(req: AuthRequest, res: Response) {
  try {
    const { status } = req.body;
    const donation = await prisma.donation.findUnique({ where: { id: req.params.id } });

    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });
    if (donation.donorId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const updated = await prisma.donation.update({
      where: { id: req.params.id },
      data: { status: status as DonationStatus },
    });

    if (status === 'ENTREGUE') {
      const points = calculateDonationPoints(donation.weightKg, donation.urgency);
      const user = await prisma.user.findUnique({ where: { id: donation.donorId } });
      if (user) {
        const newPoints = user.points + points;
        await prisma.user.update({
          where: { id: donation.donorId },
          data: {
            points: newPoints,
            level: calculateLevel(newPoints),
            totalKgSaved: user.totalKgSaved + donation.weightKg,
            peopleImpacted: user.peopleImpacted + Math.round(donation.weightKg * 3 / 2.5),
          },
        });
      }
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar status' });
  }
}

export async function requestDonation(req: AuthRequest, res: Response) {
  try {
    const { message, pickupAddress } = req.body;
    const donationId = req.params.id;

    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });
    if (donation.status !== 'DISPONIVEL') {
      return res.status(400).json({ error: 'Doação não está disponível' });
    }

    const request = await prisma.donationRequest.create({
      data: {
        donationId,
        beneficiaryId: req.user!.id,
        message,
        pickupAddress,
        status: RequestStatus.PENDENTE,
      },
      include: {
        beneficiary: { select: { id: true, name: true } },
        donation: true,
      },
    });

    await prisma.donation.update({
      where: { id: donationId },
      data: { status: DonationStatus.SOLICITADA },
    });

    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao solicitar doação' });
  }
}

export async function approveRequest(req: AuthRequest, res: Response) {
  try {
    const { scheduledAt } = req.body;
    const requestId = req.params.requestId;

    const request = await prisma.donationRequest.findUnique({
      where: { id: requestId },
      include: { donation: true },
    });

    if (!request) return res.status(404).json({ error: 'Solicitação não encontrada' });
    if (request.donation.donorId !== req.user!.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const updated = await prisma.donationRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APROVADA,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(Date.now() + 86400000),
      },
    });

    await prisma.donation.update({
      where: { id: request.donationId },
      data: { status: DonationStatus.APROVADA },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao aprovar solicitação' });
  }
}

export async function rejectRequest(req: AuthRequest, res: Response) {
  try {
    const request = await prisma.donationRequest.findUnique({
      where: { id: req.params.requestId },
      include: { donation: true },
    });

    if (!request) return res.status(404).json({ error: 'Solicitação não encontrada' });
    if (request.donation.donorId !== req.user!.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await prisma.donationRequest.update({
      where: { id: req.params.requestId },
      data: { status: RequestStatus.REJEITADA },
    });

    await prisma.donation.update({
      where: { id: request.donationId },
      data: { status: DonationStatus.DISPONIVEL },
    });

    return res.json({ message: 'Solicitação rejeitada' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao rejeitar solicitação' });
  }
}

export async function acceptDelivery(req: AuthRequest, res: Response) {
  try {
    const donationId = req.params.id;

    const donation = await prisma.donation.findUnique({ where: { id: donationId } });
    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });

    const existing = await prisma.delivery.findUnique({ where: { donationId } });
    if (existing) return res.status(400).json({ error: 'Entrega já possui voluntário' });

    const delivery = await prisma.delivery.create({
      data: {
        donationId,
        volunteerId: req.user!.id,
        status: DeliveryStatus.ACEITA,
      },
      include: {
        donation: true,
        volunteer: { select: { id: true, name: true, avatar: true } },
      },
    });

    await prisma.donation.update({
      where: { id: donationId },
      data: { status: DonationStatus.EM_ENTREGA },
    });

    return res.status(201).json(delivery);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao aceitar entrega' });
  }
}

export async function completeDelivery(req: AuthRequest, res: Response) {
  try {
    const delivery = await prisma.delivery.findUnique({
      where: { id: req.params.deliveryId },
      include: { donation: true },
    });

    if (!delivery) return res.status(404).json({ error: 'Entrega não encontrada' });
    if (delivery.volunteerId !== req.user!.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const updated = await prisma.delivery.update({
      where: { id: req.params.deliveryId },
      data: {
        status: DeliveryStatus.ENTREGUE,
        deliveryTime: new Date(),
      },
    });

    await prisma.donation.update({
      where: { id: delivery.donationId },
      data: { status: DonationStatus.ENTREGUE },
    });

    const volunteer = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (volunteer) {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { points: volunteer.points + 15 },
      });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao concluir entrega' });
  }
}

export async function listVolunteerDeliveries(req: AuthRequest, res: Response) {
  try {
    const deliveries = await prisma.delivery.findMany({
      where: { volunteerId: req.user!.id },
      include: {
        donation: {
          include: { donor: { select: { id: true, name: true, address: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(deliveries);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar entregas' });
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
