import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Scale,
  Calendar,
  User,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { donationsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_LABELS, STATUS_LABELS } from '../types';

export default function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: donation, isLoading } = useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationsApi.get(id!).then((r) => r.data),
    enabled: !!id,
  });

  const requestMutation = useMutation({
    mutationFn: () => donationsApi.request(id!, 'Gostaria de solicitar esta doação.'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['donation', id] }),
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => donationsApi.approveRequest(requestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['donation', id] }),
  });

  const deliveryMutation = useMutation({
    mutationFn: () => donationsApi.acceptDelivery(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['donation', id] }),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!donation) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-500">Doação não encontrada.</p>
      </DashboardLayout>
    );
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(donation.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const urgencyClass = {
    ALTA: 'badge-urgency-alta',
    MEDIA: 'badge-urgency-media',
    BAIXA: 'badge-urgency-baixa',
  }[donation.urgency];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-6">
        <div className="card overflow-hidden p-0">
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-6xl">
            {donation.photo ? (
              <img src={donation.photo} alt={donation.name} className="h-full w-full object-cover" />
            ) : (
              '🥗'
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">{donation.name}</h1>
                <p className="text-gray-500">{CATEGORY_LABELS[donation.category]}</p>
              </div>
              <span className={urgencyClass}>{donation.urgency.replace('_', ' ')}</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Scale className="h-5 w-5 text-primary-600" />
                {donation.weightKg} kg — {donation.quantity}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-5 w-5 text-primary-600" />
                Validade: {new Date(donation.expiryDate).toLocaleDateString('pt-BR')} ({daysLeft} dias)
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="h-5 w-5 text-primary-600" />
                {donation.availableFrom} — {donation.availableUntil}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-5 w-5 text-primary-600" />
                {donation.address}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User className="h-5 w-5 text-primary-600" />
                {donation.donor?.name}
              </div>
            </div>

            {donation.notes && (
              <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">{donation.notes}</p>
            )}

            <div className="mt-4">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
                Status: {STATUS_LABELS[donation.status]}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {user?.role === 'FAMILIA' && donation.status === 'DISPONIVEL' && (
                <button
                  onClick={() => requestMutation.mutate()}
                  disabled={requestMutation.isPending}
                  className="btn-primary"
                >
                  <CheckCircle className="h-5 w-5" />
                  Solicitar Doação
                </button>
              )}

              {user?.id === donation.donorId && donation.requests?.map((req) => (
                req.status === 'PENDENTE' && (
                  <div key={req.id} className="flex gap-2">
                    <button
                      onClick={() => approveMutation.mutate(req.id)}
                      className="btn-primary"
                    >
                      Aprovar Solicitação
                    </button>
                  </div>
                )
              ))}

              {user?.role === 'VOLUNTARIO' && ['APROVADA', 'AGENDADA'].includes(donation.status) && (
                <button
                  onClick={() => deliveryMutation.mutate()}
                  disabled={deliveryMutation.isPending}
                  className="btn-trust"
                >
                  <Truck className="h-5 w-5" />
                  Aceitar Entrega
                </button>
              )}

              <button onClick={() => navigate('/doacoes')} className="btn-secondary">
                Voltar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
