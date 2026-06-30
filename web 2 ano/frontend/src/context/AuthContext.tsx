import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('alimenta_token');
    const savedUser = localStorage.getItem('alimenta_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      authApi.getProfile().then(({ data }) => {
        setUser(data);
        localStorage.setItem('alimenta_user', JSON.stringify(data));
      }).catch(() => {
        localStorage.removeItem('alimenta_token');
        localStorage.removeItem('alimenta_user');
        setToken(null);
        setUser(null);
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('alimenta_token', data.token);
    localStorage.setItem('alimenta_user', JSON.stringify(data.user));
  };

  const register = async (data: Record<string, unknown>) => {
    const { data: res } = await authApi.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('alimenta_token', res.token);
    localStorage.setItem('alimenta_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('alimenta_token');
    localStorage.removeItem('alimenta_user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('alimenta_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
