import { useQuery } from '@tanstack/react-query';
import { Settings, Users, Package, Shield } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { analyticsApi } from '../services/api';
import { ROLE_LABELS } from '../types';

export default function AdminPage() {
  const { data: adminData, isLoading } = useQuery({
    queryKey: ['admin'],
    queryFn: () => analyticsApi.admin().then((r) => r.data),
  });

  const stats = adminData?.platformStats;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-7 w-7 text-gray-600" />
            Painel Administrativo
          </h1>
          <p className="text-gray-500">Gestão e monitoramento da plataforma</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Doações" value={stats?.totalDonations?.toLocaleString('pt-BR') || '0'} icon={Package} />
              <StatCard title="Entregas" value={adminData?.totalDeliveries || 0} icon={Shield} color="blue" />
              <StatCard title="Solicitações" value={adminData?.totalRequests || 0} icon={Users} color="amber" />
              <StatCard title="Voluntários" value={stats?.activeVolunteers || 0} icon={Users} color="purple" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h2 className="font-display text-lg font-bold">Usuários por Perfil</h2>
                <div className="mt-4 space-y-3">
                  {adminData?.usersByRole?.map((item: { role: string; _count: number }) => (
                    <div key={item.role} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                      <span className="font-medium">{ROLE_LABELS[item.role as keyof typeof ROLE_LABELS] || item.role}</span>
                      <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-bold text-primary-700">
                        {item._count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="font-display text-lg font-bold">Doações por Status</h2>
                <div className="mt-4 space-y-3">
                  {adminData?.donationsByStatus?.map((item: { status: string; _count: number }) => (
                    <div key={item.status} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                      <span className="font-medium">{item.status.replace('_', ' ')}</span>
                      <span className="rounded-full bg-trust-100 px-3 py-1 text-sm font-bold text-trust-700">
                        {item._count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
