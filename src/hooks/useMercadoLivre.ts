import { useState, useEffect, useCallback } from 'react';
import {
  setupCredentials,
  getUserInfo,
  getUserProducts,
  getProductReviews,
  isAuthenticated,
  logout,
  testConnection,
  searchProducts,
  getProductDetails
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

  // Configurar credenciais e conectar
  const connect = useCallback(async (clientId: string, clientSecret: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await setupCredentials(clientId, clientSecret);
      if (success) {
        await checkConnectionStatus();
      } else {
        setState(prev => ({
          ...prev,
          error: 'Falha na configuração das credenciais',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao configurar credenciais',
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
    loadProducts,
    testConnection: testConnectionStatus,
    syncData,
    clearError,
    checkConnectionStatus,
    searchProducts,
    getProductDetails
  };
}; 