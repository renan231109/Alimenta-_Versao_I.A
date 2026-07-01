import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
    } catch {
      // Silencioso por segurança
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary-600" />
            <span className="font-display text-xl font-bold">Alimenta+</span>
          </div>

          <h2 className="mt-6 font-display text-2xl font-bold">Recuperar Senha</h2>

          {sent ? (
            <div className="mt-6 rounded-xl bg-primary-50 p-4 text-sm text-primary-700">
              Se o e-mail existir em nossa base, enviaremos instruções de recuperação.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          )}

          <Link to="/login" className="mt-6 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
