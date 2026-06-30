import { GamificationLevel } from '@prisma/client';

export const LEVEL_THRESHOLDS: Record<GamificationLevel, { min: number; max: number; label: string }> = {
  SEMENTE: { min: 0, max: 99, label: 'Semente' },
  BROTO: { min: 100, max: 499, label: 'Broto' },
  ARVORE: { min: 500, max: 1499, label: 'Árvore' },
  FLORESTA_SOLIDARIA: { min: 1500, max: Infinity, label: 'Floresta Solidária' },
};

export function calculateLevel(points: number): GamificationLevel {
  if (points >= 1500) return GamificationLevel.FLORESTA_SOLIDARIA;
  if (points >= 500) return GamificationLevel.ARVORE;
  if (points >= 100) return GamificationLevel.BROTO;
  return GamificationLevel.SEMENTE;
}

/** Pontos por doação: base + bônus por peso e urgência */
export function calculateDonationPoints(weightKg: number, urgency: string): number {
  let points = 10;
  points += Math.floor(weightKg * 2);
  if (urgency === 'ALTA') points += 20;
  else if (urgency === 'MEDIA') points += 10;
  return points;
}

export function getLevelProgress(points: number): {
  currentLevel: GamificationLevel;
  label: string;
  progress: number;
  pointsToNext: number;
} {
  const level = calculateLevel(points);
  const threshold = LEVEL_THRESHOLDS[level];
  const progress =
    threshold.max === Infinity
      ? 100
      : Math.min(100, ((points - threshold.min) / (threshold.max - threshold.min + 1)) * 100);

  const nextLevelPoints =
    level === GamificationLevel.FLORESTA_SOLIDARIA
      ? 0
      : threshold.max + 1 - points;

  return {
    currentLevel: level,
    label: threshold.label,
    progress: Math.round(progress),
    pointsToNext: Math.max(0, nextLevelPoints),
  };
}

export function generateCertificate(userName: string, achievementName: string, date: Date): {
  title: string;
  recipient: string;
  achievement: string;
  issuedAt: string;
  certificateId: string;
} {
  return {
    title: 'Certificado Digital Alimenta+',
    recipient: userName,
    achievement: achievementName,
    issuedAt: date.toLocaleDateString('pt-BR'),
    certificateId: `ALM-${Date.now().toString(36).toUpperCase()}`,
  };
}
