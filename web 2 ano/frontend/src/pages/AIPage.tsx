import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import {
  Brain,
  AlertTriangle,
  Route,
  TrendingDown,
  Lightbulb,
  Send,
  RotateCcw
} from 'lucide-react';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { analyticsApi } from '../services/api';

export default function AIPage() {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { data: insights, isLoading } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: async () => {
      try {
        const r = await analyticsApi.aiInsights();
        return r.data;
      } catch {
        return null;
      }
    }
  });

  const { data: route } = useQuery({
    queryKey: ['aiRoute'],
    queryFn: async () => {
      try {
        const r = await analyticsApi.aiRoute(
          -20.8197,
          -49.3794
        );

        return r.data;
      } catch {
        return null;
      }
    }
  });

  async function enviar() {
    try {
      setErro('');
      setResposta('');
      setCarregando(true);

      const req = await fetch(
        'http://localhost:3333/assistente/triagem',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mensagem
          })
        }
      );

      const data = await req.json();

      if (!req.ok) {
        throw new Error(
          data.erro || 'Erro ao consultar IA'
        );
      }

      setResposta(data.resposta);

    } catch (e: any) {
      setErro(
        e.message ||
        'Erro ao conectar'
      );

    } finally {
      setCarregando(false);
    }
  }

  function limpar() {
    setMensagem('');
    setResposta('');
    setErro('');
  }

  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-blue-600 p-4 text-white">
            <Brain size={34} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Food Rescue AI
            </h1>

            <p className="text-gray-500">
              Inteligência Artificial
            </p>
          </div>

        </div>

        {!isLoading && (

          <>

            <div className="grid gap-5 md:grid-cols-3">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl bg-red-50 p-6 shadow"
              >

                <AlertTriangle
                  className="text-red-500"
                  size={34}
                />

                <h2 className="mt-3 text-4xl font-bold">
                  {insights?.wastePrediction?.alertCount ?? 0}
                </h2>

                <p>
                  Alertas ativos
                </p>

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-yellow-50 p-6 shadow"
              >

                <TrendingDown
                  className="text-yellow-600"
                  size={34}
                />

                <h2 className="mt-3 text-4xl font-bold">
                  {insights?.wastePrediction?.atRiskKg ?? 0}
                  kg
                </h2>

                <p>
                  Em risco
                </p>

              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-cyan-50 p-6 shadow"
              >

                <Route
                  className="text-cyan-600"
                  size={34}
                />

                <h2 className="mt-3 text-4xl font-bold">
                  {route?.totalDistanceKm ?? 0}
                  km
                </h2>

                <p>
                  {route?.estimatedMinutes ?? 0}
                  min
                </p>

              </motion.div>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow">

              <h2 className="text-xl font-bold mb-4">
                Pergunte para IA
              </h2>

              <textarea
                rows={5}
                className="w-full rounded-xl border p-4"
                value={mensagem}
                onChange={(e) =>
                  setMensagem(
                    e.target.value
                  )
                }
              />

              <div className="mt-4 flex gap-3">

                <button
                  onClick={enviar}
                  disabled={carregando}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-white"
                >
                  <div className="flex items-center gap-2">

                    <Send size={18} />

                    {
                      carregando
                        ? 'Gerando...'
                        : 'Enviar'
                    }

                  </div>

                </button>

                <button
                  onClick={limpar}
                  className="rounded-xl bg-gray-200 px-6 py-3"
                >

                  <div className="flex items-center gap-2">

                    <RotateCcw size={18} />

                    Limpar

                  </div>

                </button>

              </div>

              {erro && (

                <div className="mt-5 rounded-xl bg-red-100 p-4">

                  {erro}

                </div>

              )}

              {resposta && (

                <div className="mt-5 rounded-xl bg-green-50 p-5">

                  <h3 className="font-bold mb-2">

                    Resposta

                  </h3>

                  <div className="whitespace-pre-wrap">

                    {resposta}

                  </div>

                </div>

              )}

            </div>

            <div className="rounded-2xl bg-orange-50 p-6 shadow">

              <h2 className="flex items-center gap-2 text-xl font-bold">

                <Lightbulb />

                Recomendações

              </h2>

              <div className="mt-4 space-y-2">

                {insights?.wastePrediction?.recommendations?.map(
                  (
                    rec: string,
                    i: number
                  ) => (

                    <div
                      key={i}
                      className="rounded-xl bg-white p-4"
                    >
                      {i + 1}. {rec}
                    </div>

                  )
                )}

              </div>

            </div>

          </>

        )}

      </div>

    </DashboardLayout>
  );
}