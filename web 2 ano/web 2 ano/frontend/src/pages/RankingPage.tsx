import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { analyticsApi } from '../services/api';
import { LEVEL_ICONS, LEVEL_LABELS, ROLE_LABELS } from '../types';

const rankIcons = [Trophy, Medal, Award];

export default function RankingPage() {
  const { data: ranking, isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: () => analyticsApi.ranking().then((r) => r.data),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-gray-900">Ranking Solidário</h1>
          <p className="text-gray-500">Os heróis que mais impactam vidas</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {ranking?.slice(0, 3).map((user, i) => {
                const Icon = rankIcons[i];
                const colors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];
                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`card text-center ${i === 0 ? 'ring-2 ring-amber-300 md:order-2' : i === 1 ? 'md:order-1' : 'md:order-3'}`}
                  >
                    <Icon className={`mx-auto h-10 w-10 ${colors[i]}`} />
                    <div className="mx-auto mt-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
                      {user.name.charAt(0)}
                    </div>
                    <h3 className="mt-3 font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">{ROLE_LABELS[user.role]}</p>
                    <p className="mt-2 font-display text-2xl font-bold text-primary-600">{user.points} pts</p>
                    <p className="text-sm">{LEVEL_ICONS[user.level]} {LEVEL_LABELS[user.level]}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="card overflow-hidden p-0">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nível</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Kg Salvos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Pontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ranking?.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-gray-400">{user.rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{LEVEL_ICONS[user.level]} {LEVEL_LABELS[user.level]}</td>
                      <td className="px-6 py-4 text-sm">{user.totalKgSaved} kg</td>
                      <td className="px-6 py-4 font-semibold text-primary-600">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
