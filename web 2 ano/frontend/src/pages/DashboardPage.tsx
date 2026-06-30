import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  Utensils,
  Leaf,
  PlusCircle,
  Map,
  Trophy,
  Brain,
  ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { DonationCard } from '../components/ui/DonationCard';
import { useAuth } from '../context/AuthContext';
import { analyticsApi, donationsApi } from '../services/api';
import { LEVEL_ICONS, LEVEL_LABELS } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
  });

  const { data: donations } = useQuery({
    queryKey: ['recentDonations'],
    queryFn: () => donationsApi.list({ status: 'DISPONIVEL' }).then((r) => r.data.slice(0, 4)),
  });

  const s = stats || {
    totalKgSaved: 2847,
    familiesBenefited: 1324,
    mealsGenerated: 8542,
    activeVolunteers: 412,
    totalDonations: 1893,
    co2AvoidedKg: 5694,
    monthlyData: [],
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-bold text-gray-900 lg:text-3xl"
          >
            Olá, {user?.name?.split(' ')[0]}! {LEVEL_ICONS[user?.level || 'SEMENTE']}
          </motion.h1>
          <p className="mt-1 text-gray-500">
            Nível: {LEVEL_LABELS[user?.level || 'SEMENTE']} • {user?.points || 0} pontos solidários
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Alimentos Salvos" value={`${s.totalKgSaved.toLocaleString('pt-BR')} kg`} icon={Package} delay={0} />
          <StatCard title="Famílias Beneficiadas" value={s.familiesBenefited.toLocaleString('pt-BR')} icon={Users} color="blue" delay={0.1} />
          <StatCard title="Refeições Geradas" value={s.mealsGenerated.toLocaleString('pt-BR')} icon={Utensils} color="amber" delay={0.2} />
          <StatCard title="CO₂ Evitado" value={`${s.co2AvoidedKg.toLocaleString('pt-BR')} kg`} icon={Leaf} color="purple" delay={0.3} />
        </div>

        {s.monthlyData && s.monthlyData.length > 0 && (
          <div className="card">
            <h2 className="font-display text-lg font-bold">Evolução do Impacto</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="kgSaved" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Kg Salvos" />
                  <Area type="monotone" dataKey="families" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Famílias" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Doações Disponíveis</h2>
              <Link to="/doacoes" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Ver todas
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {donations?.map((d) => <DonationCard key={d.id} donation={d} />)}
              {!donations?.length && (
                <p className="text-gray-500">Nenhuma doação disponível no momento.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold">Ações Rápidas</h2>
            {[
              { to: '/doacoes/nova', label: 'Nova Doação', icon: PlusCircle, color: 'bg-primary-600' },
              { to: '/mapa', label: 'Ver Mapa', icon: Map, color: 'bg-trust-600' },
              { to: '/ranking', label: 'Ranking Solidário', icon: Trophy, color: 'bg-amber-500' },
              { to: '/ia', label: 'Food Rescue AI', icon: Brain, color: 'bg-purple-600' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="card flex items-center gap-4 hover:border-primary-200"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="flex-1 font-medium">{action.label}</span>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
