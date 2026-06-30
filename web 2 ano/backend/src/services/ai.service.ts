import { UrgencyLevel } from '@prisma/client';

/** Calcula urgência com base na data de validade — módulo Food Rescue AI */
export function calculateUrgency(expiryDate: Date): UrgencyLevel {
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return UrgencyLevel.ALTA;
  if (diffDays <= 3) return UrgencyLevel.MEDIA;
  return UrgencyLevel.BAIXA;
}

export function getUrgencyLabel(urgency: UrgencyLevel): string {
  const labels: Record<UrgencyLevel, string> = {
    ALTA: 'Urgência Alta — Validade em 1 dia ou menos',
    MEDIA: 'Urgência Média — Validade em até 3 dias',
    BAIXA: 'Urgência Baixa — Validade em 7 dias ou mais',
  };
  return labels[urgency];
}

export function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  return Math.max(0, Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Prioriza doações por urgência e proximidade */
export function prioritizeDonations<T extends { urgency: UrgencyLevel; latitude: number; longitude: number }>(
  donations: T[],
  userLat: number,
  userLng: number
): (T & { priorityScore: number; distanceKm: number })[] {
  const urgencyWeight: Record<UrgencyLevel, number> = {
    ALTA: 100,
    MEDIA: 60,
    BAIXA: 30,
  };

  return donations
    .map((d) => {
      const distanceKm = haversineDistance(userLat, userLng, d.latitude, d.longitude);
      const priorityScore = urgencyWeight[d.urgency] - distanceKm * 2;
      return { ...d, priorityScore, distanceKm: Math.round(distanceKm * 10) / 10 };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Sugere rota otimizada entre pontos (algoritmo nearest-neighbor simplificado) */
export function suggestDeliveryRoute(
  start: { lat: number; lng: number },
  stops: { id: string; lat: number; lng: number; urgency: UrgencyLevel }[]
): { orderedStops: string[]; totalDistanceKm: number; estimatedMinutes: number } {
  if (stops.length === 0) {
    return { orderedStops: [], totalDistanceKm: 0, estimatedMinutes: 0 };
  }

  const remaining = [...stops];
  const ordered: typeof stops = [];
  let current = start;
  let totalDistance = 0;

  while (remaining.length > 0) {
    remaining.sort((a, b) => {
      const distA = haversineDistance(current.lat, current.lng, a.lat, a.lng);
      const distB = haversineDistance(current.lat, current.lng, b.lat, b.lng);
      const urgencyBonus = { ALTA: -5, MEDIA: -2, BAIXA: 0 };
      return distA + urgencyBonus[a.urgency] - (distB + urgencyBonus[b.urgency]);
    });

    const next = remaining.shift()!;
    totalDistance += haversineDistance(current.lat, current.lng, next.lat, next.lng);
    ordered.push(next);
    current = { lat: next.lat, lng: next.lng };
  }

  return {
    orderedStops: ordered.map((s) => s.id),
    totalDistanceKm: Math.round(totalDistance * 10) / 10,
    estimatedMinutes: Math.round(totalDistance * 3 + ordered.length * 5),
  };
}

/** Previsão de desperdício baseada em padrões históricos */
export function predictWaste(donations: { weightKg: number; expiryDate: Date; status: string }[]): {
  atRiskKg: number;
  predictedWasteKg: number;
  alertCount: number;
  recommendations: string[];
} {
  const now = new Date();
  const atRisk = donations.filter((d) => {
    const days = getDaysUntilExpiry(d.expiryDate);
    return days <= 2 && d.status === 'DISPONIVEL';
  });

  const atRiskKg = atRisk.reduce((sum, d) => sum + d.weightKg, 0);
  const predictedWasteKg = Math.round(atRiskKg * 0.35 * 10) / 10;

  const recommendations: string[] = [];
  if (atRiskKg > 50) {
    recommendations.push('Priorizar doações de alta urgência nas próximas 24 horas');
  }
  if (atRisk.length > 5) {
    recommendations.push('Acionar voluntários disponíveis para entregas expressas');
  }
  if (predictedWasteKg > 20) {
    recommendations.push('Notificar ONGs parceiras sobre alimentos próximos ao vencimento');
  }
  if (recommendations.length === 0) {
    recommendations.push('Situação estável — manter monitoramento regular');
  }

  return {
    atRiskKg: Math.round(atRiskKg * 10) / 10,
    predictedWasteKg,
    alertCount: atRisk.length,
    recommendations,
  };
}

/** Calculadora de impacto social */
export function calculateSocialImpact(foodKg: number): {
  mealsGenerated: number;
  peopleHelped: number;
  wasteAvoidedKg: number;
  co2AvoidedKg: number;
} {
  const mealsGenerated = Math.round(foodKg * 3);
  const peopleHelped = Math.round(mealsGenerated / 2.5);
  const wasteAvoidedKg = Math.round(foodKg * 0.95 * 10) / 10;
  const co2AvoidedKg = Math.round(foodKg * 2 * 10) / 10;

  return { mealsGenerated, peopleHelped, wasteAvoidedKg, co2AvoidedKg };
}

/** Impacto estimado para São José do Rio Preto */
export function getCityImpactProjection(): {
  city: string;
  weeklyKgRecovered: number;
  yearlyPeopleHelped: number;
  weeklyMeals: number;
  description: string;
} {
  return {
    city: 'São José do Rio Preto',
    weeklyKgRecovered: 487,
    yearlyPeopleHelped: 4200,
    weeklyMeals: 1461,
    description:
      'Se este sistema estivesse funcionando em São José do Rio Preto, poderia recuperar centenas de quilos de alimentos por semana e ajudar milhares de pessoas por ano.',
  };
}
