import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DonationCard } from '../components/ui/DonationCard';
import { donationsApi } from '../services/api';
import { CATEGORY_LABELS } from '../types';
import type { DonationCategory, UrgencyLevel } from '../types';

export default function DonationsListPage() {
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');
  const [status, setStatus] = useState('');

  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations', category, urgency, status],
    queryFn: () =>
      donationsApi
        .list({
          ...(category && { category }),
          ...(urgency && { urgency }),
          ...(status && { status }),
        })
        .then((r) => r.data),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Lista de Doações</h1>
          <p className="text-gray-500">Encontre alimentos disponíveis perto de você</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todas categorias</option>
            {(Object.keys(CATEGORY_LABELS) as DonationCategory[]).map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>

          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todas urgências</option>
            <option value="ALTA">Urgência Alta</option>
            <option value="MEDIA">Urgência Média</option>
            <option value="BAIXA">Urgência Baixa</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field w-auto"
          >
            <option value="">Todos status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="SOLICITADA">Solicitada</option>
            <option value="APROVADA">Aprovada</option>
            <option value="ENTREGUE">Entregue</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {donations?.map((d) => <DonationCard key={d.id} donation={d} />)}
            {!donations?.length && (
              <p className="col-span-2 text-center text-gray-500 py-12">Nenhuma doação encontrada.</p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
