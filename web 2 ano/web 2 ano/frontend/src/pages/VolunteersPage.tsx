import { useQuery } from '@tanstack/react-query';
import { Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { donationsApi } from '../services/api';

export default function VolunteersPage() {
  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['volunteerDeliveries'],
    queryFn: () => donationsApi.volunteerDeliveries().then((r) => r.data),
  });

  const { data: availableDonations } = useQuery({
    queryKey: ['availableForDelivery'],
    queryFn: () =>
      donationsApi.list({ status: 'APROVADA' }).then((r) => r.data),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-7 w-7 text-trust-600" />
            Voluntários
          </h1>
          <p className="text-gray-500">Gerencie entregas e histórico</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-lg font-bold">Entregas Disponíveis</h2>
            <div className="mt-4 space-y-3">
              {availableDonations?.length ? (
                availableDonations.map((d) => (
                  <div key={d.id} className="card flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {d.address}
                      </p>
                      <p className="text-sm">{d.weightKg} kg</p>
                    </div>
                    <a href={`/doacoes/${d.id}`} className="btn-trust py-2 text-sm">
                      Aceitar
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma entrega disponível.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Minhas Entregas</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {deliveries?.length ? (
                  deliveries.map((delivery: { id: string; status: string; donation: { name: string; address: string; weightKg: number; donor?: { name: string } } }) => (
                    <div key={delivery.id} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{delivery.donation.name}</p>
                          <p className="text-sm text-gray-500">{delivery.donation.donor?.name}</p>
                          <p className="text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" /> {delivery.donation.address}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          delivery.status === 'ENTREGUE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {delivery.status === 'ENTREGUE' ? (
                            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Entregue</span>
                          ) : (
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {delivery.status}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Você ainda não possui entregas.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
