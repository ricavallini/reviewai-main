import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import marketplaceSync from '../services/marketplaceSync';
import MercadoLivreAPI, { MercadoLivreCredentials } from '../services/mercadolivre';

export interface MercadoLivreIntegration {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  stats: {
    totalProducts: number;
    totalReviews: number;
    lastSync: Date | null;
  };
  credentials: MercadoLivreCredentials | null;
}

export interface SyncOptions {
  syncProducts?: boolean;
  syncReviews?: boolean;
  forceFullSync?: boolean;
  maxProducts?: number;
  maxReviews?: number;
}

export const useMercadoLivre = () => {
  const { user } = useAuth();
  const [integration, setIntegration] = useState<MercadoLivreIntegration>({
    isConnected: false,
    isLoading: false,
    error: null,
    stats: {
      totalProducts: 0,
      totalReviews: 0,
      lastSync: null,
    },
    credentials: null,
  });

  // Carregar estado inicial
  useEffect(() => {
    if (user) {
      loadIntegrationState();
    }
  }, [user]);

  const loadIntegrationState = useCallback(async () => {
    if (!user) return;

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Carregar credenciais
      const credentials = await marketplaceSync.getCredentials(user.id, 'mercadolivre');
      
      // Carregar estatísticas
      const stats = await marketplaceSync.getSyncStats(user.id, 'mercadolivre');

      setIntegration({
        isConnected: stats.isConnected && !!credentials,
        isLoading: false,
        error: null,
        stats,
        credentials,
      });
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar integração',
      }));
    }
  }, [user]);

  // Configurar credenciais
  const setupCredentials = useCallback(async (accessToken: string, refreshToken?: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const credentials: MercadoLivreCredentials = {
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 horas
      };

      const success = await marketplaceSync.setupMercadoLivreCredentials(user.id, credentials);

      if (success) {
        await loadIntegrationState();
      } else {
        throw new Error('Falha ao configurar credenciais');
      }
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao configurar credenciais',
      }));
      throw error;
    }
  }, [user, loadIntegrationState]);

  // Testar conexão
  const testConnection = useCallback(async () => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const isConnected = await marketplaceSync.testConnection(user.id, 'mercadolivre');
      
      setIntegration(prev => ({
        ...prev,
        isConnected,
        isLoading: false,
        error: isConnected ? null : 'Falha na conexão com o Mercado Livre',
      }));

      return isConnected;
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro no teste de conexão',
      }));
      return false;
    }
  }, [user]);

  // Sincronizar produtos
  const syncProducts = useCallback(async (options: SyncOptions = {}) => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await marketplaceSync.syncMercadoLivreProducts(user.id, {
        syncProducts: true,
        ...options,
      });

      if (result.success) {
        // Recarregar estatísticas
        const stats = await marketplaceSync.getSyncStats(user.id, 'mercadolivre');
        
        setIntegration(prev => ({
          ...prev,
          isLoading: false,
          stats,
          error: null,
        }));

        return result;
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro na sincronização',
      }));
      throw error;
    }
  }, [user]);

  // Sincronizar reviews
  const syncReviews = useCallback(async (options: SyncOptions = {}) => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await marketplaceSync.syncMercadoLivreReviews(user.id, {
        syncReviews: true,
        ...options,
      });

      if (result.success) {
        // Recarregar estatísticas
        const stats = await marketplaceSync.getSyncStats(user.id, 'mercadolivre');
        
        setIntegration(prev => ({
          ...prev,
          isLoading: false,
          stats,
          error: null,
        }));

        return result;
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro na sincronização de reviews',
      }));
      throw error;
    }
  }, [user]);

  // Sincronização completa
  const syncAll = useCallback(async (options: SyncOptions = {}) => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await marketplaceSync.syncMercadoLivreProducts(user.id, {
        syncProducts: true,
        syncReviews: true,
        ...options,
      });

      if (result.success) {
        // Recarregar estatísticas
        const stats = await marketplaceSync.getSyncStats(user.id, 'mercadolivre');
        
        setIntegration(prev => ({
          ...prev,
          isLoading: false,
          stats,
          error: null,
        }));

        return result;
      } else {
        throw new Error(result.errors.join(', '));
      }
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro na sincronização completa',
      }));
      throw error;
    }
  }, [user]);

  // Desconectar integração
  const disconnect = useCallback(async () => {
    if (!user) throw new Error('Usuário não autenticado');

    setIntegration(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Marcar como inativo no banco
      const { error } = await import('../lib/supabase').then(({ supabase }) =>
        supabase
          .from('marketplace_credentials')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('marketplace', 'mercadolivre')
      );

      if (error) throw error;

      setIntegration({
        isConnected: false,
        isLoading: false,
        error: null,
        stats: {
          totalProducts: 0,
          totalReviews: 0,
          lastSync: null,
        },
        credentials: null,
      });
    } catch (error) {
      setIntegration(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro ao desconectar',
      }));
      throw error;
    }
  }, [user]);

  // Limpar erro
  const clearError = useCallback(() => {
    setIntegration(prev => ({ ...prev, error: null }));
  }, []);

  // Renovar token (se necessário)
  const refreshToken = useCallback(async (clientId: string, clientSecret: string) => {
    if (!integration.credentials?.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    try {
      const mlAPI = new MercadoLivreAPI(integration.credentials);
      const newCredentials = await mlAPI.refreshAccessToken(clientId, clientSecret);
      
      // Atualizar no banco
      if (user) {
        await marketplaceSync.setupMercadoLivreCredentials(user.id, newCredentials);
      }

      setIntegration(prev => ({
        ...prev,
        credentials: newCredentials,
      }));

      return newCredentials;
    } catch (error) {
      throw new Error('Erro ao renovar token: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  }, [integration.credentials, user]);

  return {
    ...integration,
    setupCredentials,
    testConnection,
    syncProducts,
    syncReviews,
    syncAll,
    disconnect,
    clearError,
    refreshToken,
    reload: loadIntegrationState,
  };
}; 