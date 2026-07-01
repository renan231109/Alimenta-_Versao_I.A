import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { signToken, generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, role, phone, address, city, latitude, longitude } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = generateToken();

    const validRoles: UserRole[] = ['DOADOR', 'ONG', 'FAMILIA', 'VOLUNTARIO'];
    const userRole: UserRole = validRoles.includes(role) ? role : UserRole.DOADOR;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone,
        address,
        city: city || 'São José do Rio Preto',
        latitude: latitude ? parseFloat(latitude) : -20.8197,
        longitude: longitude ? parseFloat(longitude) : -49.3794,
        verifyToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        city: true,
        points: true,
        level: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      user,
      token,
      message: 'Cadastro realizado! Verifique seu e-mail para ativar a conta.',
      verifyToken, // Demo: retorna token para simular verificação
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

export async function forgotPassword(req: AuthRequest, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.json({ message: 'Se o e-mail existir, enviaremos instruções de recuperação.' });
    }

    const resetToken = generateToken();
    const resetTokenExp = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    return res.json({
      message: 'Se o e-mail existir, enviaremos instruções de recuperação.',
      resetToken, // Demo
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
}

export async function resetPassword(req: AuthRequest, res: Response) {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExp: { gt: new Date() } },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
}

export async function verifyEmail(req: AuthRequest, res: Response) {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({ where: { verifyToken: token } });
    if (!user) {
      return res.status(400).json({ error: 'Token de verificação inválido' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verifyToken: null },
    });

    return res.json({ message: 'E-mail verificado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar e-mail' });
  }
}

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        bio: true,
        address: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        emailVerified: true,
        points: true,
        level: true,
        totalKgSaved: true,
        peopleImpacted: true,
        createdAt: true,
        achievements: {
          include: { achievement: true },
          orderBy: { earnedAt: 'desc' },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, phone, bio, address, city, latitude, longitude } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(address !== undefined && { address }),
        ...(city && { city }),
        ...(latitude && { latitude: parseFloat(latitude) }),
        ...(longitude && { longitude: parseFloat(longitude) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        bio: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        points: true,
        level: true,
      },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
}

export async function uploadAvatar(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatar: avatarUrl },
      select: { id: true, avatar: true },
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao enviar avatar' });
  }
}
