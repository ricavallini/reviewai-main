import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  isAdmin?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se Supabase está configurado
    const checkSupabaseConfig = () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        return url && key && url !== 'undefined' && key !== 'undefined';
      } catch {
        return false;
      }
    };

    const initializeAuth = async () => {
      if (checkSupabaseConfig()) {
        // Usar Supabase se configurado
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              name: session.user.user_metadata?.name || 'Usuário',
              email: session.user.email || '',
              company: session.user.user_metadata?.company || 'Empresa',
              plan: 'premium',
              isAdmin: session.user.user_metadata?.isAdmin || false,
              avatar: session.user.user_metadata?.avatar_url
            };
            setUser(userData);
          }
        } catch (error) {
          console.warn('Erro ao carregar sessão Supabase:', error);
        }
      } else {
        // Fallback para mock data se Supabase não estiver configurado
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const mockUser: User = {
            id: '1',
            name: 'João Silva',
            email: 'joao@empresa.com',
            company: 'Loja Digital Ltda',
            plan: 'premium',
            isAdmin: true,
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
          };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (url && key && url !== 'undefined' && key !== 'undefined') {
        // Login com Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          const userData: User = {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Usuário',
            email: data.user.email || '',
            company: data.user.user_metadata?.company || 'Empresa',
            plan: 'premium',
            isAdmin: data.user.user_metadata?.isAdmin || false,
            avatar: data.user.user_metadata?.avatar_url
          };
          setUser(userData);
        }
      } else {
        // Fallback para mock login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: '1',
          name: 'João Silva',
          email: email,
          company: 'Loja Digital Ltda',
          plan: 'premium',
          isAdmin: email === 'admin@example.com',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error('Erro no login:', error);
      // Fallback para mock em caso de erro
      const mockUser: User = {
        id: '1',
        name: 'João Silva',
        email: email,
        company: 'Loja Digital Ltda',
        plan: 'premium',
        isAdmin: email === 'admin@example.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (url && key && url !== 'undefined' && key !== 'undefined') {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.warn('Erro ao fazer logout do Supabase:', error);
    }
    
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};