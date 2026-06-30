import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { DonationMap } from '../components/ui/DonationMap';
import { donationsApi } from '../services/api';
import { CATEGORY_LABELS } from '../types';
import type { Donation, DonationCategory } from '../types';

const DEMO_DONATIONS: Donation[] = [
  { id: '1', name: 'Cestas de Frutas Variadas', category: 'FRUTAS', quantity: '15 cestas', weightKg: 45, expiryDate: new Date(Date.now() + 86400000).toISOString(), address: 'Av. Alberto Andaló, 1200', latitude: -20.8123, longitude: -49.3845, availableFrom: '08:00', availableUntil: '18:00', status: 'DISPONIVEL', urgency: 'ALTA', donorId: '1', createdAt: new Date().toISOString(), donor: { id: '1', name: 'Supermercado Bom Preço' } },
  { id: '2', name: 'Pães e Bolos do Dia', category: 'PADARIA', quantity: '50 unidades', weightKg: 18, expiryDate: new Date(Date.now() + 172800000).toISOString(), address: 'Rua Bernardino de Campos, 850', latitude: -20.8197, longitude: -49.3794, availableFrom: '08:00', availableUntil: '18:00', status: 'DISPONIVEL', urgency: 'MEDIA', donorId: '2', createdAt: new Date().toISOString(), donor: { id: '2', name: 'Padaria Pão Quente' } },
  { id: '3', name: 'Verduras Frescas', category: 'VERDURAS', quantity: '30 maços', weightKg: 22, expiryDate: new Date(Date.now() + 259200000).toISOString(), address: 'Av. José Munia, 4500', latitude: -20.8056, longitude: -49.3712, availableFrom: '08:00', availableUntil: '18:00', status: 'DISPONIVEL', urgency: 'BAIXA', donorId: '3', createdAt: new Date().toISOString(), donor: { id: '3', name: 'Feira Orgânica' } },
];

function MapContent() {
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<Donation | null>(null);

  const { data: donations } = useQuery({
    queryKey: ['mapDonations', category],
    queryFn: () =>
      donationsApi
        .list({ ...(category && { category }), status: 'DISPONIVEL' })
        .then((r) => r.data),
    retry: false,
  });

  const items = donations?.length ? donations : DEMO_DONATIONS;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Mapa de Doações</h1>
          <p className="text-gray-500">Encontre alimentos disponíveis perto de você</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
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
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DonationMap donations={items} height="600px" onDonationClick={setSelected} />
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          <p className="text-sm font-medium text-gray-500">{items.length} doações no mapa</p>
          {items.map((d) => (
            <Link
              key={d.id}
              to={`/doacoes/${d.id}`}
              className={`block rounded-xl border p-4 transition-colors hover:border-primary-300 ${
                selected?.id === d.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
              }`}
            >
              <p className="font-semibold text-gray-900">{d.name}</p>
              <p className="text-sm text-gray-500">{d.weightKg} kg • {CATEGORY_LABELS[d.category]}</p>
              <p className="mt-1 text-xs text-gray-400">{d.address}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> Urgência Alta</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> Urgência Média</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500" /> Urgência Baixa</span>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { user } = useAuth();

  if (user) {
    return (
      <DashboardLayout>
        <MapContent />
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <MapContent />
      </div>
      <Footer />
    </div>
  );
}
