import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import DonationsListPage from './pages/DonationsListPage';
import NewDonationPage from './pages/NewDonationPage';
import DonationDetailPage from './pages/DonationDetailPage';
import MapPage from './pages/MapPage';
import RankingPage from './pages/RankingPage';
import ProfilePage from './pages/ProfilePage';
import AIPage from './pages/AIPage';
import ImpactPage from './pages/ImpactPage';
import VolunteersPage from './pages/VolunteersPage';
import StatisticsPage from './pages/StatisticsPage';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/doacoes" element={<ProtectedRoute><DonationsListPage /></ProtectedRoute>} />
            <Route path="/doacoes/nova" element={<ProtectedRoute roles={['DOADOR', 'ONG', 'ADMIN']}><NewDonationPage /></ProtectedRoute>} />
            <Route path="/doacoes/:id" element={<ProtectedRoute><DonationDetailPage /></ProtectedRoute>} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/ia" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
            <Route path="/impacto" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
            <Route path="/voluntarios" element={<ProtectedRoute roles={['VOLUNTARIO', 'ADMIN']}><VolunteersPage /></ProtectedRoute>} />
            <Route path="/estatisticas" element={<ProtectedRoute><StatisticsPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
