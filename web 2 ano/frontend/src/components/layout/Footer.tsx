import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white">
                <Leaf className="h-6 w-6" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Alimenta<span className="text-primary-400">+</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-400">
              Plataforma tecnológica que conecta doadores a pessoas que necessitam de ajuda,
              reduzindo o desperdício de alimentos e combatendo a insegurança alimentar.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Plataforma</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/cadastro" className="hover:text-primary-400">Cadastrar</Link></li>
              <li><Link to="/login" className="hover:text-primary-400">Login</Link></li>
              <li><Link to="/mapa" className="hover:text-primary-400">Mapa de Doações</Link></li>
              <li><Link to="/ranking" className="hover:text-primary-400">Ranking Solidário</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Contato</h4>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>São José do Rio Preto, SP</li>
              <li>contato@alimenta.com.br</li>
              <li>(17) 3000-0000</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Alimenta+. Todos os direitos reservados. Feira de Ciências 2026.
        </div>
      </div>
    </footer>
  );
}
