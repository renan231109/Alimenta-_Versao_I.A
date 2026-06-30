import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, MapPin, Radio } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { ImpactCalculator } from '../components/ui/ImpactCalculator';
import { analyticsApi } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Package, Users, Utensils, Leaf } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function ImpactPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
  });

  const { data: cityImpact } = useQuery({
    queryKey: ['cityImpact'],
    queryFn: () => analyticsApi.cityImpact().then((r) => r.data),
  });

  const s = stats || {
    totalKgSaved: 2847,
    familiesBenefited: 1324,
    mealsGenerated: 8542,
    activeVolunteers: 412,
    partnerEstablishments: 327,
    co2AvoidedKg: 5694,
    wasteReductionPercent: 34.5,
    monthlyData: [],
  };

  const pieData = [
    { name: 'Frutas e Verduras', value: 35 },
    { name: 'Padaria', value: 25 },
    { name: 'Refeições Prontas', value: 20 },
    { name: 'Não Perecíveis', value: 20 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-7 w-7 text-red-500" />
            Impacto Social
          </h1>
          <p className="text-gray-500">Acompanhe a transformação que estamos gerando</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Alimentos Salvos" value={`${s.totalKgSaved.toLocaleString('pt-BR')} kg`} icon={Package} />
          <StatCard title="Famílias Atendidas" value={s.familiesBenefited.toLocaleString('pt-BR')} icon={Users} color="blue" />
          <StatCard title="Refeições Geradas" value={s.mealsGenerated.toLocaleString('pt-BR')} icon={Utensils} color="amber" />
          <StatCard title="Voluntários Ativos" value={s.activeVolunteers} icon={Leaf} color="purple" />
        </div>

        {/* Impacto em Tempo Real */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-gray-900 to-primary-900 text-white"
        >
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-400 animate-pulse" />
            <span className="text-sm font-medium text-primary-300">Impacto em Tempo Real</span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            {cityImpact?.city || 'São José do Rio Preto'}
          </h2>
          <p className="mt-3 max-w-2xl text-primary-100">
            {cityImpact?.description}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-display text-3xl font-bold text-primary-300">{cityImpact?.weeklyKgRecovered || 487} kg</p>
              <p className="text-sm text-primary-200">por semana</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-display text-3xl font-bold text-primary-300">{(cityImpact?.yearlyPeopleHelped || 4200).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-primary-200">pessoas/ano</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="font-display text-3xl font-bold text-primary-300">{(cityImpact?.weeklyMeals || 1461).toLocaleString('pt-BR')}</p>
              <p className="text-sm text-primary-200">refeições/semana</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {s.monthlyData && s.monthlyData.length > 0 && (
            <div className="card">
              <h2 className="font-display text-lg font-bold">Evolução Mensal</h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="kgSaved" fill="#10b981" name="Kg Salvos" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="donations" fill="#3b82f6" name="Doações" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="font-display text-lg font-bold">Distribuição por Categoria</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <ImpactCalculator />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-primary-600">{s.co2AvoidedKg?.toLocaleString('pt-BR')} kg</p>
            <p className="text-sm text-gray-500">CO₂ evitado</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-trust-600">{s.wasteReductionPercent}%</p>
            <p className="text-sm text-gray-500">Redução de desperdício</p>
          </div>
          <div className="card text-center">
            <p className="font-display text-3xl font-bold text-amber-600">{s.partnerEstablishments}</p>
            <p className="text-sm text-gray-500">Estabelecimentos parceiros</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
