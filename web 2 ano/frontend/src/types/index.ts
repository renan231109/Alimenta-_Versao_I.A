export type UserRole = 'DOADOR' | 'ONG' | 'FAMILIA' | 'VOLUNTARIO' | 'ADMIN';

export type DonationCategory =
  | 'FRUTAS'
  | 'VERDURAS'
  | 'LEGUMES'
  | 'PADARIA'
  | 'LATICINIOS'
  | 'REFEICOES_PRONTAS'
  | 'NAO_PERECIVEIS'
  | 'OUTROS';

export type DonationStatus =
  | 'DISPONIVEL'
  | 'SOLICITADA'
  | 'APROVADA'
  | 'AGENDADA'
  | 'EM_ENTREGA'
  | 'ENTREGUE'
  | 'CANCELADA'
  | 'EXPIRADA';

export type UrgencyLevel = 'ALTA' | 'MEDIA' | 'BAIXA';

export type GamificationLevel = 'SEMENTE' | 'BROTO' | 'ARVORE' | 'FLORESTA_SOLIDARIA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  emailVerified: boolean;
  points: number;
  level: GamificationLevel;
  totalKgSaved: number;
  peopleImpacted: number;
  createdAt?: string;
  achievements?: UserAchievement[];
}

export interface UserAchievement {
  id: string;
  earnedAt: string;
  achievement: Achievement;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  earned?: boolean;
  earnedAt?: string | null;
}

export interface Donation {
  id: string;
  name: string;
  category: DonationCategory;
  quantity: string;
  weightKg: number;
  expiryDate: string;
  photo?: string;
  address: string;
  latitude: number;
  longitude: number;
  availableFrom: string;
  availableUntil: string;
  notes?: string;
  status: DonationStatus;
  urgency: UrgencyLevel;
  donorId: string;
  donor?: { id: string; name: string; avatar?: string; city?: string; phone?: string };
  requests?: { id: string; status: string }[];
  delivery?: Delivery;
  createdAt: string;
  distanceKm?: number;
  priorityScore?: number;
}

export interface Delivery {
  id: string;
  status: string;
  volunteer?: { id: string; name: string; avatar?: string; phone?: string };
}

export interface PlatformStats {
  totalKgSaved: number;
  familiesBenefited: number;
  mealsGenerated: number;
  activeVolunteers: number;
  partnerEstablishments: number;
  totalDonations: number;
  co2AvoidedKg: number;
  wasteReductionPercent: number;
  recentDonations?: number;
  monthlyData?: { month: string; kgSaved: number; families: number; donations: number }[];
  cityImpact?: CityImpact;
}

export interface CityImpact {
  city: string;
  weeklyKgRecovered: number;
  yearlyPeopleHelped: number;
  weeklyMeals: number;
  description: string;
}

export interface ImpactCalculation {
  inputKg: number;
  mealsGenerated: number;
  peopleHelped: number;
  wasteAvoidedKg: number;
  co2AvoidedKg: number;
}

export interface RankingUser {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  points: number;
  level: GamificationLevel;
  totalKgSaved: number;
  peopleImpacted: number;
  rank: number;
  levelProgress: {
    currentLevel: GamificationLevel;
    label: string;
    progress: number;
    pointsToNext: number;
  };
}

export const CATEGORY_LABELS: Record<DonationCategory, string> = {
  FRUTAS: 'Frutas',
  VERDURAS: 'Verduras',
  LEGUMES: 'Legumes',
  PADARIA: 'Padaria',
  LATICINIOS: 'Laticínios',
  REFEICOES_PRONTAS: 'Refeições Prontas',
  NAO_PERECIVEIS: 'Não Perecíveis',
  OUTROS: 'Outros',
};

export const STATUS_LABELS: Record<DonationStatus, string> = {
  DISPONIVEL: 'Disponível',
  SOLICITADA: 'Solicitada',
  APROVADA: 'Aprovada',
  AGENDADA: 'Agendada',
  EM_ENTREGA: 'Em Entrega',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
  EXPIRADA: 'Expirada',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  DOADOR: 'Doador',
  ONG: 'ONG',
  FAMILIA: 'Família Beneficiária',
  VOLUNTARIO: 'Voluntário',
  ADMIN: 'Administrador',
};

export const LEVEL_LABELS: Record<GamificationLevel, string> = {
  SEMENTE: 'Semente',
  BROTO: 'Broto',
  ARVORE: 'Árvore',
  FLORESTA_SOLIDARIA: 'Floresta Solidária',
};

export const LEVEL_ICONS: Record<GamificationLevel, string> = {
  SEMENTE: '🌱',
  BROTO: '🌿',
  ARVORE: '🌳',
  FLORESTA_SOLIDARIA: '🌲',
};
