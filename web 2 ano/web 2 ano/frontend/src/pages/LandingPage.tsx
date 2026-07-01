import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  MapPin,
  Heart,
  Users,
  Leaf,
  Shield,
  Zap,
  TrendingUp,
  Star,
  ChevronDown,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ImpactCalculator } from '../components/ui/ImpactCalculator';
import { analyticsApi } from '../services/api';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  const { data: stats } = useQuery({
    queryKey: ['publicStats'],
    queryFn: () => analyticsApi.publicStats().then((r) => r.data),
  });

  const s = stats || {
    totalKgSaved: 2847,
    familiesBenefited: 1324,
    mealsGenerated: 8542,
    activeVolunteers: 412,
    partnerEstablishments: 327,
    totalDonations: 1893,
    co2AvoidedKg: 5694,
    wasteReductionPercent: 34.5,
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-trust-800 pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              Tecnologia a favor da sustentabilidade
            </span>
            <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Conectando alimentos
              <br />
              <span className="text-primary-200">a quem precisa.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100 sm:text-xl">
              Transformando desperdício em esperança através da tecnologia.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/cadastro" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                Começar a Doar
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/mapa" className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                <MapPin className="h-5 w-5" />
                Ver Mapa de Doações
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { value: s.totalKgSaved.toLocaleString('pt-BR'), label: 'kg salvos' },
              { value: s.familiesBenefited.toLocaleString('pt-BR'), label: 'famílias' },
              { value: s.mealsGenerated.toLocaleString('pt-BR'), label: 'refeições' },
              { value: s.activeVolunteers.toLocaleString('pt-BR'), label: 'voluntários' },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                <p className="text-sm text-primary-200">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">Como Funciona</h2>
            <p className="mt-4 text-lg text-gray-500">Simples, rápido e com impacto real</p>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Cadastre-se', desc: 'Crie sua conta como doador, ONG, família ou voluntário.', icon: Users },
              { step: '02', title: 'Publique ou Busque', desc: 'Doadores registram alimentos. Beneficiários encontram no mapa.', icon: MapPin },
              { step: '03', title: 'Conecte-se', desc: 'Solicite, aprove e agende a retirada com segurança.', icon: Heart },
              { step: '04', title: 'Impacte', desc: 'Acompanhe seu impacto social e ganhe pontos solidários.', icon: TrendingUp },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="relative card text-center"
              >
                <span className="font-display text-5xl font-bold text-primary-100">{item.step}</span>
                <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacto em Tempo Real */}
      <section id="impacto" className="bg-gray-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <span className="rounded-full bg-primary-600/20 px-4 py-1 text-sm font-medium text-primary-400">
              Impacto em Tempo Real
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              São José do Rio Preto
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-400">
              Se este sistema estivesse funcionando em São José do Rio Preto, poderia recuperar
              <strong className="text-primary-400"> centenas de quilos de alimentos por semana </strong>
              e ajudar <strong className="text-primary-400">milhares de pessoas por ano</strong>.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { value: '487 kg', label: 'Recuperados por semana' },
              { value: '4.200', label: 'Pessoas ajudadas/ano' },
              { value: '1.461', label: 'Refeições/semana' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm"
              >
                <p className="font-display text-4xl font-bold text-primary-400">{item.value}</p>
                <p className="mt-2 text-gray-400">{item.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <ImpactCalculator />
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Benefícios para todos
              </h2>
              <div className="mt-8 space-y-6">
                {[
                  { icon: Leaf, title: 'Sustentabilidade', desc: 'Reduza o desperdício e a emissão de CO₂.' },
                  { icon: Shield, title: 'Segurança', desc: 'Verificação de usuários e rastreamento completo.' },
                  { icon: Zap, title: 'Food Rescue AI', desc: 'IA prioriza doações urgentes e sugere rotas.' },
                  { icon: Heart, title: 'Gamificação', desc: 'Pontos, níveis e certificados digitais.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { value: `${s.wasteReductionPercent}%`, label: 'Redução de desperdício' },
                { value: `${s.co2AvoidedKg.toLocaleString('pt-BR')} kg`, label: 'CO₂ evitado' },
                { value: s.partnerEstablishments, label: 'Estabelecimentos parceiros' },
                { value: s.totalDonations.toLocaleString('pt-BR'), label: 'Doações realizadas' },
              ].map((item, i) => (
                <div key={i} className="card text-center">
                  <p className="font-display text-2xl font-bold text-primary-600">{item.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="bg-primary-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900">Depoimentos</h2>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Maria Oliveira', role: 'Doadora — Padaria Pão Quente', text: 'Antes jogávamos fora dezenas de pães por dia. Agora alimentamos famílias da nossa região.' },
              { name: 'João Pereira', role: 'Família Beneficiária', text: 'O Alimenta+ nos ajudou em momentos difíceis. Recebemos alimentos frescos toda semana.' },
              { name: 'Ana Costa', role: 'Voluntária', text: 'Entregar alimentos e ver o sorriso das famílias é a melhor recompensa. A plataforma facilita tudo.' },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="card">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 border-t pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900">Perguntas Frequentes</h2>
          </motion.div>
          <div className="mt-12 space-y-4">
            {[
              { q: 'Quem pode usar o Alimenta+?', a: 'Doadores (mercados, restaurantes, padarias), ONGs, famílias beneficiárias, voluntários e administradores.' },
              { q: 'Como funciona a Food Rescue AI?', a: 'A IA analisa datas de validade, prioriza doações urgentes, sugere rotas de entrega e previne desperdícios.' },
              { q: 'É gratuito?', a: 'Sim! A plataforma é 100% gratuita para todos os usuários.' },
              { q: 'Como ganho pontos solidários?', a: 'Cada doação, entrega e ação solidária gera pontos que elevam seu nível de Semente até Floresta Solidária.' },
            ].map((item, i) => (
              <motion.details key={i} {...fadeUp} className="group card">
                <summary className="cursor-pointer font-semibold text-gray-900">{item.q}</summary>
                <p className="mt-3 text-gray-500">{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-trust-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Faça parte da revolução contra a fome
          </h2>
          <p className="mt-4 text-lg text-primary-100">
            Junte-se a milhares de pessoas que já estão transformando vidas.
          </p>
          <Link to="/cadastro" className="btn-primary mt-8 bg-white text-primary-700 hover:bg-primary-50">
            Criar Conta Gratuita
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
