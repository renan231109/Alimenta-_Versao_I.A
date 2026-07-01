import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { donationsApi } from '../services/api';
import { CATEGORY_LABELS } from '../types';
import type { DonationCategory } from '../types';

export default function NewDonationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    category: 'FRUTAS' as DonationCategory,
    quantity: '',
    weightKg: '',
    expiryDate: '',
    address: '',
    latitude: '-20.8197',
    longitude: '-49.3794',
    availableFrom: '08:00',
    availableUntil: '18:00',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (photo) data.append('photo', photo);

      await donationsApi.create(data);
      navigate('/doacoes');
    } catch {
      setError('Erro ao criar doação. Verifique os campos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Nova Doação</h1>
          <p className="text-gray-500">Registre alimentos para doação</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do alimento</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field mt-1"
              placeholder="Ex: Cestas de frutas variadas"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as DonationCategory })}
                className="input-field mt-1"
              >
                {(Object.keys(CATEGORY_LABELS) as DonationCategory[]).map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="input-field mt-1"
                placeholder="Ex: 15 cestas"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Peso estimado (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                className="input-field mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de validade</label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="input-field mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field mt-1"
              placeholder="Rua, número, bairro"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário disponível (de)</label>
              <input
                type="time"
                value={form.availableFrom}
                onChange={(e) => setForm({ ...form, availableFrom: e.target.value })}
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horário disponível (até)</label>
              <input
                type="time"
                value={form.availableUntil}
                onChange={(e) => setForm({ ...form, availableUntil: e.target.value })}
                className="input-field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-field mt-1"
              rows={3}
              placeholder="Informações adicionais sobre a doação"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Publicando...' : 'Publicar Doação'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
