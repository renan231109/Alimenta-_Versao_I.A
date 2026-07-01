import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'bompreco@alimenta.com', role: 'Doador' },
    { email: 'familia.silva@alimenta.com', role: 'Família' },
    { email: 'carlos@alimenta.com', role: 'Voluntário' },
    { email: 'admin@alimenta.com', role: 'Admin' },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-primary-600 to-trust-800 lg:flex lg:flex-col lg:justify-center lg:p-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white">
              <Leaf className="h-7 w-7" />
            </div>
            <span className="font-display text-2xl font-bold text-white">
              Alimenta<span className="text-primary-200">+</span>
            </span>
          </div>
          <h1 className="mt-12 font-display text-4xl font-bold text-white">
            Bem-vindo de volta
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Continue transformando desperdício em esperança.
          </p>
        </motion.div>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
          <h2 className="font-display text-2xl font-bold text-gray-900 lg:hidden">
            Entrar no Alimenta+
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/recuperar-senha" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                Esqueceu a senha?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-semibold text-primary-600 hover:text-primary-700">
              Cadastre-se
            </Link>
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">Contas demo (senha: 123456)</p>
            <div className="mt-2 space-y-1">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword('123456'); }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium">{acc.role}</span>
                  <span className="text-gray-400"> — {acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
