import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Award, Download } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { authApi, analyticsApi } from '../services/api';
import { LEVEL_ICONS, LEVEL_LABELS, ROLE_LABELS } from '../types';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile().then((r) => {
      updateUser(r.data);
      return r.data;
    }),
  });

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => analyticsApi.achievements().then((r) => r.data),
  });

  const p = profile || user;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="card">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-100 text-3xl font-bold text-primary-700">
              {p?.avatar ? (
                <img src={p.avatar} alt="" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                p?.name?.charAt(0)
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">{p?.name}</h1>
              <p className="text-gray-500">{ROLE_LABELS[p?.role || 'DOADOR']}</p>
              <p className="text-sm text-gray-400">{p?.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-primary-50 p-4 text-center">
              <p className="text-2xl font-bold text-primary-700">{p?.points || 0}</p>
              <p className="text-xs text-primary-600">Pontos Solidários</p>
            </div>
            <div className="rounded-xl bg-trust-50 p-4 text-center">
              <p className="text-2xl font-bold text-trust-700">{p?.totalKgSaved || 0} kg</p>
              <p className="text-xs text-trust-600">Alimentos Salvos</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-2xl font-bold text-amber-700">{p?.peopleImpacted || 0}</p>
              <p className="text-xs text-amber-600">Pessoas Impactadas</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl">{LEVEL_ICONS[p?.level || 'SEMENTE']}</span>
            <span className="font-semibold">Nível {LEVEL_LABELS[p?.level || 'SEMENTE']}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-bold">Conquistas</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {achievements?.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  a.earned ? 'border-primary-200 bg-primary-50' : 'border-gray-200 opacity-50'
                }`}
              >
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
                {a.earned && (
                  <button className="rounded-lg p-2 text-primary-600 hover:bg-primary-100" title="Certificado">
                    <Download className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary-600" />
            Informações
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Telefone</dt><dd>{p?.phone || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Cidade</dt><dd>{p?.city || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Endereço</dt><dd>{p?.address || '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">E-mail verificado</dt><dd>{p?.emailVerified ? '✅ Sim' : '❌ Não'}</dd></div>
          </dl>
        </div>
      </div>
    </DashboardLayout>
  );
}
