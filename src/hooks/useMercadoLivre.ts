import { useState, useEffect, useCallback } from 'react';
import {
  initiateAuth,
  handleAuthCallback,
  getUserInfo,
  getUserProducts,
  getProductReviews,
  isAuthenticated,
  logout,
  testConnection,
  setupCredentials
} from '../services/mercadolivre';

interface MercadoLivreStats {
  totalProducts: number;
  totalReviews: number;
  lastSync: Date | null;
}

interface MercadoLivreState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: any | null;
  products: any[];
  stats: MercadoLivreStats;
}

export const useMercadoLivre = () => {
  const [state, setState] = useState<MercadoLivreState>({
    isConnected: false,
    isLoading: false,
    error: null,
    userInfo: null,
    products: [],
    stats: {
      totalProducts: 0,
      totalReviews: 0,
      lastSync: null
    }
  });

  // Verificar status da conexão ao inicializar
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Verificar se está conectado
  const checkConnectionStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const connected = isAuthenticated();
      if (connected) {
        const userInfo = await getUserInfo();
        setState(prev => ({
          ...prev,
          isConnected: true,
          userInfo,
          isLoading: false
        }));
        
        // Carregar produtos automaticamente
        await loadProducts();
      } else {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Erro ao verificar conexão',
        isLoading: false
      }));
    }
  }, []);

  // Iniciar processo de autenticação
  const connect = useCallback(async (clientId?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (clientId) {
        setupCredentials(clientId);
      }
      
      const authUrl = await initiateAuth();
      window.location.href = authUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao iniciar autenticação',
        isLoading: false
      }));
    }
  }, []);

  // Processar callback da autenticação
  const processAuthCallback = useCallback(async (code: string, state: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await handleAuthCallback(code, state);
      if (success) {
        await checkConnectionStatus();
      } else {
        setState(prev => ({
          ...prev,
          error: 'Falha na autenticação',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao processar autenticação',
        isLoading: false
      }));
    }
  }, [checkConnectionStatus]);

  // Carregar produtos do usuário
  const loadProducts = useCallback(async () => {
    if (!state.isConnected) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const products = await getUserProducts();
      let totalReviews = 0;
      
      // Carregar reviews para cada produto
      const productsWithReviews = await Promise.all(
        products.map(async (product) => {
          try {
            const reviews = await getProductReviews(product.id);
            totalReviews += reviews.length;
            return {
              ...product,
              reviews,
              reviewCount: reviews.length
            };
          } catch (error) {
            console.error(`Erro ao carregar reviews do produto ${product.id}:`, error);
            return {
              ...product,
              reviews: [],
              reviewCount: 0
            };
          }
        })
      );
      
      setState(prev => ({
        ...prev,
        products: productsWithReviews,
        stats: {
          totalProducts: productsWithReviews.length,
          totalReviews,
          lastSync: new Date()
        },
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar produtos',
        isLoading: false
      }));
    }
  }, [state.isConnected]);

  // Testar conexão
  const testConnectionStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const connected = await testConnection();
      setState(prev => ({
        ...prev,
        isConnected: connected,
        isLoading: false
      }));
      
      if (connected) {
        await loadProducts();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro no teste de conexão',
        isLoading: false
      }));
    }
  }, [loadProducts]);

  // Desconectar
  const disconnect = useCallback(() => {
    logout();
    setState({
      isConnected: false,
      isLoading: false,
      error: null,
      userInfo: null,
      products: [],
      stats: {
        totalProducts: 0,
        totalReviews: 0,
        lastSync: null
      }
    });
  }, []);

  // Sincronizar dados
  const syncData = useCallback(async () => {
    if (!state.isConnected) return;
    
    await loadProducts();
  }, [state.isConnected, loadProducts]);

  // Limpar erro
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Estado
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    error: state.error,
    userInfo: state.userInfo,
    products: state.products,
    stats: state.stats,
    
    // Ações
    connect,
    disconnect,
    processAuthCallback,
    loadProducts,
    testConnection: testConnectionStatus,
    syncData,
    clearError,
    checkConnectionStatus
  };
}; 