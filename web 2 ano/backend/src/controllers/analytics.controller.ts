import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import {
  prioritizeDonations,
  predictWaste,
  suggestDeliveryRoute,
  calculateSocialImpact,
  getCityImpactProjection,
  getUrgencyLabel,
  getDaysUntilExpiry,
} from '../services/ai.service';
import { getLevelProgress, generateCertificate } from '../services/gamification.service';

export async function getAiInsights(req: AuthRequest, res: Response) {
  try {
    const donations = await prisma.donation.findMany({
      where: { status: { in: ['DISPONIVEL', 'SOLICITADA', 'APROVADA'] } },
    });

    const wastePrediction = predictWaste(donations);

    const highUrgency = donations
      .filter((d) => d.urgency === 'ALTA')
      .map((d) => ({
        id: d.id,
        name: d.name,
        daysLeft: getDaysUntilExpiry(d.expiryDate),
        label: getUrgencyLabel(d.urgency),
        weightKg: d.weightKg,
      }));

    return res.json({
      module: 'Food Rescue AI',
      wastePrediction,
      highUrgencyAlerts: highUrgency,
      totalMonitored: donations.length,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar insights de IA' });
  }
}

export async function getPrioritizedDonations(req: AuthRequest, res: Response) {
  try {
    const lat = parseFloat(req.query.lat as string) || -20.8197;
    const lng = parseFloat(req.query.lng as string) || -49.3794;

    const donations = await prisma.donation.findMany({
      where: { status: 'DISPONIVEL' },
      include: { donor: { select: { id: true, name: true } } },
    });

    const prioritized = prioritizeDonations(donations, lat, lng);
    return res.json(prioritized);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao priorizar doações' });
  }
}

export async function getSuggestedRoute(req: AuthRequest, res: Response) {
  try {
    const lat = parseFloat(req.query.lat as string) || -20.8197;
    const lng = parseFloat(req.query.lng as string) || -49.3794;

    const donations = await prisma.donation.findMany({
      where: { status: { in: ['APROVADA', 'AGENDADA', 'EM_ENTREGA'] } },
    });

    const route = suggestDeliveryRoute(
      { lat, lng },
      donations.map((d) => ({
        id: d.id,
        lat: d.latitude,
        lng: d.longitude,
        urgency: d.urgency,
      }))
    );

    return res.json(route);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao sugerir rota' });
  }
}

export async function calculateImpact(req: AuthRequest, res: Response) {
  try {
    const foodKg = parseFloat(req.body.foodKg) || parseFloat(req.query.foodKg as string) || 0;
    if (foodKg <= 0) {
      return res.status(400).json({ error: 'Informe uma quantidade válida de alimento (kg)' });
    }

    const impact = calculateSocialImpact(foodKg);
    return res.json({ inputKg: foodKg, ...impact });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao calcular impacto' });
  }
}

export async function getCityImpact(req: AuthRequest, res: Response) {
  return res.json(getCityImpactProjection());
}

export async function getDashboardStats(req: AuthRequest, res: Response) {
  try {
    let stats = await prisma.platformStats.findUnique({ where: { id: 'platform-stats' } });

    if (!stats) {
      stats = await prisma.platformStats.create({ data: { id: 'platform-stats' } });
    }

    const recentDonations = await prisma.donation.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    });

    const monthlyData = await getMonthlyChartData();

    return res.json({
      ...stats,
      recentDonations,
      monthlyData,
      cityImpact: getCityImpactProjection(),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
}

export async function getRanking(req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ['DOADOR', 'ONG', 'VOLUNTARIO'] }, isActive: true },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        points: true,
        level: true,
        totalKgSaved: true,
        peopleImpacted: true,
      },
      orderBy: { points: 'desc' },
      take: 50,
    });

    const ranked = users.map((u, index) => ({
      ...u,
      rank: index + 1,
      levelProgress: getLevelProgress(u.points),
    }));

    return res.json(ranked);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
}

export async function getAchievements(req: AuthRequest, res: Response) {
  try {
    const achievements = await prisma.achievement.findMany({
      include: {
        users: {
          where: { userId: req.user!.id },
        },
      },
    });

    const formatted = achievements.map((a) => ({
      ...a,
      earned: a.users.length > 0,
      earnedAt: a.users[0]?.earnedAt || null,
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar conquistas' });
  }
}

export async function getCertificate(req: AuthRequest, res: Response) {
  try {
    const { achievementId } = req.params;

    const userAchievement = await prisma.userAchievement.findFirst({
      where: { userId: req.user!.id, achievementId },
      include: { achievement: true, user: true },
    });

    if (!userAchievement) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }

    const certificate = generateCertificate(
      userAchievement.user.name,
      userAchievement.achievement.name,
      userAchievement.earnedAt
    );

    return res.json(certificate);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao gerar certificado' });
  }
}

export async function getAdminStats(req: AuthRequest, res: Response) {
  try {
    const [users, donations, deliveries, requests] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: true }),
      prisma.donation.groupBy({ by: ['status'], _count: true }),
      prisma.delivery.count(),
      prisma.donationRequest.count(),
    ]);

    const stats = await prisma.platformStats.findUnique({ where: { id: 'platform-stats' } });

    return res.json({
      usersByRole: users,
      donationsByStatus: donations,
      totalDeliveries: deliveries,
      totalRequests: requests,
      platformStats: stats,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar dados administrativos' });
  }
}

async function getMonthlyChartData() {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  return months.map((month, i) => ({
    month,
    kgSaved: Math.round(180 + i * 45 + Math.random() * 30),
    families: Math.round(80 + i * 25 + Math.random() * 15),
    donations: Math.round(120 + i * 35 + Math.random() * 20),
  }));
}

export async function createReview(req: AuthRequest, res: Response) {
  try {
    const { reviewedId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        reviewerId: req.user!.id,
        reviewedId,
        rating: parseInt(rating),
        comment,
      },
    });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
}

export async function getPublicStats(_req: AuthRequest, res: Response) {
  try {
    const stats = await prisma.platformStats.findUnique({ where: { id: 'platform-stats' } });
    return res.json(stats || {
      totalKgSaved: 2847,
      familiesBenefited: 1324,
      mealsGenerated: 8542,
      activeVolunteers: 412,
      partnerEstablishments: 327,
      totalDonations: 1893,
      co2AvoidedKg: 5694,
      wasteReductionPercent: 34.5,
    });
  } catch {
    return res.json({
      totalKgSaved: 2847,
      familiesBenefited: 1324,
      mealsGenerated: 8542,
      activeVolunteers: 412,
      partnerEstablishments: 327,
      totalDonations: 1893,
      co2AvoidedKg: 5694,
      wasteReductionPercent: 34.5,
    });
  }
}
