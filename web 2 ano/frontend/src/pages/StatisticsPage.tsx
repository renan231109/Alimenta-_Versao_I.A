import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Package, FileText } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { analyticsApi } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function StatisticsPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then((r) => r.data),
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
          <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-trust-600" />
            Estatísticas
          </h1>
          <p className="text-gray-500">Relatórios e métricas detalhadas</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total de Doações" value={s.totalDonations?.toLocaleString('pt-BR') || '0'} icon={Package} />
          <StatCard title="Kg Distribuídos" value={`${s.totalKgSaved?.toLocaleString('pt-BR')} kg`} icon={FileText} color="blue" />
          <StatCard title="Famílias Atendidas" value={s.familiesBenefited?.toLocaleString('pt-BR') || '0'} icon={Users} color="amber" />
          <StatCard title="CO₂ Evitado" value={`${s.co2AvoidedKg?.toLocaleString('pt-BR')} kg`} icon={BarChart3} color="purple" />
        </div>

        {s.monthlyData && s.monthlyData.length > 0 && (
          <div className="card">
            <h2 className="font-display text-lg font-bold">Tendência de Impacto</h2>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="kgSaved" stroke="#10b981" strokeWidth={2} name="Kg Salvos" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="families" stroke="#3b82f6" strokeWidth={2} name="Famílias" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="donations" stroke="#f59e0b" strokeWidth={2} name="Doações" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="font-display text-lg font-bold">Relatório de Impacto Ambiental</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-green-50 p-6">
              <p className="text-sm font-medium text-green-700">Desperdício Evitado</p>
              <p className="mt-2 font-display text-3xl font-bold text-green-800">
                {Math.round((s.totalKgSaved || 0) * 0.95).toLocaleString('pt-BR')} kg
              </p>
              <p className="mt-1 text-xs text-green-600">Equivalente a {Math.round((s.totalKgSaved || 0) / 50)} caminhões de lixo orgânico</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-6">
              <p className="text-sm font-medium text-blue-700">Emissão de CO₂ Evitada</p>
              <p className="mt-2 font-display text-3xl font-bold text-blue-800">
                {s.co2AvoidedKg?.toLocaleString('pt-BR')} kg
              </p>
              <p className="mt-1 text-xs text-blue-600">Equivalente a {Math.round((s.co2AvoidedKg || 0) / 4.6)} árvores plantadas</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
