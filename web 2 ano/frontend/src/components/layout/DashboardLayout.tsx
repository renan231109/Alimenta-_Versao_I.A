import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  List,
  Map,
  Trophy,
  User,
  BarChart3,
  Users,
  Heart,
  Settings,
  LogOut,
  Leaf,
  Menu,
  X,
  Brain,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

const navItems: { to: string; label: string; icon: typeof LayoutDashboard; roles?: UserRole[] }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doacoes/nova', label: 'Nova Doação', icon: PlusCircle, roles: ['DOADOR', 'ONG', 'ADMIN'] },
  { to: '/doacoes', label: 'Doações', icon: List },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/impacto', label: 'Impacto Social', icon: Heart },
  { to: '/voluntarios', label: 'Voluntários', icon: Users, roles: ['VOLUNTARIO', 'ADMIN'] },
  { to: '/estatisticas', label: 'Estatísticas', icon: BarChart3 },
  { to: '/ia', label: 'Food Rescue AI', icon: Brain },
  { to: '/admin', label: 'Administração', icon: Settings, roles: ['ADMIN'] },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b px-6 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold">
              Alimenta<span className="text-primary-600">+</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <div className="mb-3 rounded-xl bg-primary-50 p-3">
              <p className="text-xs font-medium text-primary-600">Pontos Solidários</p>
              <p className="text-lg font-bold text-primary-800">{user?.points || 0} pts</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-4 py-4 lg:px-8">
          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 lg:ml-0" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
