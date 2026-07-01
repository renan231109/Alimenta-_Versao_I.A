import {
  PrismaClient,
  UserRole,
  DonationCategory,
  DonationStatus,
  UrgencyLevel,
  GamificationLevel,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SJRP_CENTER = { lat: -20.8197, lng: -49.3794 };

const locations = [
  { address: 'Av. Alberto Andaló, 1200 - Redentora', lat: -20.8123, lng: -49.3845 },
  { address: 'Rua Bernardino de Campos, 850 - Centro', lat: -20.8197, lng: -49.3794 },
  { address: 'Av. José Munia, 4500 - Jardim Redentor', lat: -20.8056, lng: -49.3712 },
  { address: 'Rua General Glicério, 320 - Vila Imperial', lat: -20.8289, lng: -49.3912 },
  { address: 'Av. Philadelpho Manoel Gouveia, 2100 - Jardim San Marco', lat: -20.8345, lng: -49.3656 },
  { address: 'Rua José Bonifácio, 567 - Centro', lat: -20.8178, lng: -49.3812 },
  { address: 'Av. Brigadeiro Faria Lima, 1800 - Eldorado', lat: -20.8412, lng: -49.3789 },
  { address: 'Rua XV de Novembro, 234 - Centro', lat: -20.8201, lng: -49.3778 },
];

const foodItems = [
  { name: 'Cestas de Frutas Variadas', category: DonationCategory.FRUTAS, qty: '15 cestas', weight: 45 },
  { name: 'Verduras Frescas do Dia', category: DonationCategory.VERDURAS, qty: '30 maços', weight: 22 },
  { name: 'Legumes Orgânicos', category: DonationCategory.LEGUMES, qty: '20 kg', weight: 20 },
  { name: 'Pães e Bolos do Dia', category: DonationCategory.PADARIA, qty: '50 unidades', weight: 18 },
  { name: 'Queijos e Iogurtes', category: DonationCategory.LATICINIOS, qty: '40 unidades', weight: 12 },
  { name: 'Marmitas Prontas', category: DonationCategory.REFEICOES_PRONTAS, qty: '80 refeições', weight: 35 },
  { name: 'Arroz, Feijão e Macarrão', category: DonationCategory.NAO_PERECIVEIS, qty: '100 pacotes', weight: 55 },
  { name: 'Sobras de Buffet', category: DonationCategory.REFEICOES_PRONTAS, qty: '25 kg', weight: 25 },
  { name: 'Bananas e Maçãs', category: DonationCategory.FRUTAS, qty: '40 kg', weight: 40 },
  { name: 'Alface, Rúcula e Agrião', category: DonationCategory.VERDURAS, qty: '25 maços', weight: 8 },
  { name: 'Cenoura, Batata e Cebola', category: DonationCategory.LEGUMES, qty: '35 kg', weight: 35 },
  { name: 'Salgados Assados', category: DonationCategory.PADARIA, qty: '120 unidades', weight: 15 },
];

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function getUrgency(days: number): UrgencyLevel {
  if (days <= 1) return UrgencyLevel.ALTA;
  if (days <= 3) return UrgencyLevel.MEDIA;
  return UrgencyLevel.BAIXA;
}

async function main() {
  console.log('🌱 Populando banco de dados Alimenta+...');

  await prisma.userAchievement.deleteMany();
  await prisma.review.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.donationRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformStats.deleteMany();

  const password = await bcrypt.hash('123456', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Alimenta+',
      email: 'admin@alimenta.com',
      password,
      role: UserRole.ADMIN,
      emailVerified: true,
      city: 'São José do Rio Preto',
      points: 2000,
      level: GamificationLevel.FLORESTA_SOLIDARIA,
      totalKgSaved: 520,
      peopleImpacted: 890,
    },
  });

  const donors = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Supermercado Bom Preço',
        email: 'bompreco@alimenta.com',
        password,
        role: UserRole.DOADOR,
        emailVerified: true,
        address: locations[0].address,
        latitude: locations[0].lat,
        longitude: locations[0].lng,
        city: 'São José do Rio Preto',
        points: 890,
        level: GamificationLevel.ARVORE,
        totalKgSaved: 340,
        peopleImpacted: 520,
        bio: 'Rede de supermercados comprometida com sustentabilidade.',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Padaria Pão Quente',
        email: 'paquente@alimenta.com',
        password,
        role: UserRole.DOADOR,
        emailVerified: true,
        address: locations[1].address,
        latitude: locations[1].lat,
        longitude: locations[1].lng,
        points: 650,
        level: GamificationLevel.ARVORE,
        totalKgSaved: 280,
        peopleImpacted: 410,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Restaurante Sabor & Cia',
        email: 'sabor@alimenta.com',
        password,
        role: UserRole.DOADOR,
        emailVerified: true,
        address: locations[2].address,
        latitude: locations[2].lat,
        longitude: locations[2].lng,
        points: 420,
        level: GamificationLevel.BROTO,
        totalKgSaved: 195,
        peopleImpacted: 280,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Feira Orgânica Central',
        email: 'feira@alimenta.com',
        password,
        role: UserRole.DOADOR,
        emailVerified: true,
        address: locations[3].address,
        latitude: locations[3].lat,
        longitude: locations[3].lng,
        points: 1100,
        level: GamificationLevel.FLORESTA_SOLIDARIA,
        totalKgSaved: 480,
        peopleImpacted: 720,
      },
    }),
  ]);

  const ong = await prisma.user.create({
    data: {
      name: 'Instituto Mesa Solidária',
      email: 'ong@alimenta.com',
      password,
      role: UserRole.ONG,
      emailVerified: true,
      address: locations[4].address,
      latitude: locations[4].lat,
      longitude: locations[4].lng,
      points: 780,
      level: GamificationLevel.ARVORE,
      bio: 'ONG dedicada à distribuição de alimentos para famílias em vulnerabilidade.',
    },
  });

  const families = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Família Silva',
        email: 'familia.silva@alimenta.com',
        password,
        role: UserRole.FAMILIA,
        emailVerified: true,
        address: locations[5].address,
        latitude: locations[5].lat,
        longitude: locations[5].lng,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Família Santos',
        email: 'familia.santos@alimenta.com',
        password,
        role: UserRole.FAMILIA,
        emailVerified: true,
        address: locations[6].address,
        latitude: locations[6].lat,
        longitude: locations[6].lng,
      },
    }),
  ]);

  const volunteers = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Carlos Voluntário',
        email: 'carlos@alimenta.com',
        password,
        role: UserRole.VOLUNTARIO,
        emailVerified: true,
        points: 340,
        level: GamificationLevel.BROTO,
        totalKgSaved: 120,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Entregadora',
        email: 'ana@alimenta.com',
        password,
        role: UserRole.VOLUNTARIO,
        emailVerified: true,
        points: 520,
        level: GamificationLevel.ARVORE,
        totalKgSaved: 210,
      },
    }),
  ]);

  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        code: 'FIRST_DONATION',
        name: 'Primeira Doação',
        description: 'Realizou sua primeira doação de alimentos',
        icon: '🌱',
        points: 50,
      },
    }),
    prisma.achievement.create({
      data: {
        code: '100KG_SAVED',
        name: '100 kg Salvos',
        description: 'Salvou 100 kg de alimentos do desperdício',
        icon: '⚖️',
        points: 100,
        threshold: 100,
      },
    }),
    prisma.achievement.create({
      data: {
        code: '500_PEOPLE',
        name: '500 Pessoas Impactadas',
        description: 'Impactou positivamente 500 pessoas',
        icon: '👥',
        points: 200,
        threshold: 500,
      },
    }),
    prisma.achievement.create({
      data: {
        code: 'HUNGER_HERO',
        name: 'Herói Contra a Fome',
        description: 'Demonstrou compromisso excepcional no combate à fome',
        icon: '🦸',
        points: 500,
      },
    }),
  ]);

  for (const donor of donors.slice(0, 2)) {
    await prisma.userAchievement.create({
      data: { userId: donor.id, achievementId: achievements[0].id },
    });
    await prisma.userAchievement.create({
      data: { userId: donor.id, achievementId: achievements[1].id },
    });
  }

  await prisma.userAchievement.create({
    data: { userId: donors[3].id, achievementId: achievements[2].id },
  });
  await prisma.userAchievement.create({
    data: { userId: donors[3].id, achievementId: achievements[3].id },
  });

  const statuses: DonationStatus[] = [
    DonationStatus.DISPONIVEL,
    DonationStatus.DISPONIVEL,
    DonationStatus.DISPONIVEL,
    DonationStatus.SOLICITADA,
    DonationStatus.APROVADA,
    DonationStatus.EM_ENTREGA,
    DonationStatus.ENTREGUE,
    DonationStatus.ENTREGUE,
    DonationStatus.DISPONIVEL,
    DonationStatus.DISPONIVEL,
    DonationStatus.DISPONIVEL,
    DonationStatus.DISPONIVEL,
  ];

  const expiryDays = [1, 2, 3, 5, 7, 1, 10, 15, 2, 4, 6, 8];

  for (let i = 0; i < foodItems.length; i++) {
    const item = foodItems[i];
    const loc = locations[i % locations.length];
    const donor = donors[i % donors.length];
    const days = expiryDays[i];

    await prisma.donation.create({
      data: {
        name: item.name,
        category: item.category,
        quantity: item.qty,
        weightKg: item.weight,
        expiryDate: addDays(days),
        address: loc.address,
        latitude: loc.lat + (Math.random() - 0.5) * 0.01,
        longitude: loc.lng + (Math.random() - 0.5) * 0.01,
        availableFrom: '08:00',
        availableUntil: '18:00',
        notes: i % 3 === 0 ? 'Retirar na área de estacionamento.' : undefined,
        status: statuses[i],
        urgency: getUrgency(days),
        donorId: donor.id,
      },
    });
  }

  const deliveredDonation = await prisma.donation.findFirst({
    where: { status: DonationStatus.EM_ENTREGA },
  });

  if (deliveredDonation) {
    await prisma.delivery.create({
      data: {
        donationId: deliveredDonation.id,
        volunteerId: volunteers[0].id,
        status: 'ACEITA',
        pickupTime: new Date(),
      },
    });
  }

  const availableDonation = await prisma.donation.findFirst({
    where: { status: DonationStatus.DISPONIVEL },
  });

  if (availableDonation) {
    await prisma.donationRequest.create({
      data: {
        donationId: availableDonation.id,
        beneficiaryId: families[0].id,
        status: 'PENDENTE',
        message: 'Precisamos muito destes alimentos para nossa família de 5 pessoas.',
      },
    });
    await prisma.donation.update({
      where: { id: availableDonation.id },
      data: { status: DonationStatus.SOLICITADA },
    });
  }

  await prisma.review.create({
    data: {
      reviewerId: families[0].id,
      reviewedId: volunteers[0].id,
      rating: 5,
      comment: 'Entrega rápida e muito atenciosa. Obrigada!',
    },
  });

  await prisma.platformStats.create({
    data: {
      id: 'platform-stats',
      totalKgSaved: 2847,
      familiesBenefited: 1324,
      mealsGenerated: 8542,
      activeVolunteers: 412,
      partnerEstablishments: 327,
      totalDonations: 1893,
      co2AvoidedKg: 5694,
      wasteReductionPercent: 34.5,
    },
  });

  console.log('✅ Seed concluído!');
  console.log('\n📋 Contas de demonstração (senha: 123456):');
  console.log('  Admin:     admin@alimenta.com');
  console.log('  Doador:    bompreco@alimenta.com');
  console.log('  ONG:       ong@alimenta.com');
  console.log('  Família:   familia.silva@alimenta.com');
  console.log('  Voluntário: carlos@alimenta.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
