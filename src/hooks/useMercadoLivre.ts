import { useState, useEffect, useCallback } from 'react';
import {
  setupCredentials,
  getUserInfo,
  getProductReviews,
  isAuthenticated,
  logout,
  testConnection,
  searchProducts,
  getProductDetails,
  searchProductsByCategory,
  getPopularCategories,
  getFeaturedProducts,
  syncProductData,
  analyzeSentiment,
  generateAutoResponse,
  MercadoLivreProduct,
  MercadoLivreReview,
  MercadoLivreUser,
  SearchResponse,
  getAuthorizationUrl,
  exchangeCodeForToken,
  isOAuthAuthenticated,
  logoutOAuth,
  getMLCredentialsFromSupabase,
  upsertMLCredentialsToSupabase,
  saveMLTokensToSupabase,
  upsertMLUserInfoToSupabase,
  upsertMLProductsToSupabase,
  upsertMLReviewsToSupabase
} from '../services/mercadolivre';
import { useSupabaseUser } from './useSupabase';

interface MercadoLivreStats {
  totalProducts: number;
  totalReviews: number;
  lastSync: Date | null;
  averageRating: number;
  positiveReviews: number;
  negativeReviews: number;
  neutralReviews: number;
}

interface MercadoLivreState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: MercadoLivreUser | null;
  products: MercadoLivreProduct[];
  reviews: MercadoLivreReview[];
  stats: MercadoLivreStats;
  searchResults: SearchResponse | null;
  categories: Array<{ id: string; name: string }>;
}

const initialState: MercadoLivreState = {
  isConnected: false,
  isLoading: false,
  error: null,
  userInfo: null,
  products: [],
  reviews: [],
  stats: {
    totalProducts: 0,
    totalReviews: 0,
    lastSync: null,
    averageRating: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    neutralReviews: 0
  },
  searchResults: null,
  categories: []
};

export const useMercadoLivre = () => {
  const [state, setState] = useState<MercadoLivreState>(initialState);
  const user = useSupabaseUser();

  // Verificar status da conexão ao inicializar
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // Verificar status da conexão
  const checkConnectionStatus = useCallback(() => {
    const connected = isOAuthAuthenticated();
    setState(prev => ({ ...prev, isConnected: connected }));
    // Opcional: carregar userInfo se conectado
  }, []);

  // Iniciar login OAuth
  const login = useCallback((clientId: string) => {
    // Sempre usar a URL de produção para o redirectUri
    const redirectUri = 'https://reviewai-main.netlify.app/auth/callback';
    const state = window.location.pathname;
    window.location.href = getAuthorizationUrl(clientId, redirectUri, state);
  }, []);

  // Logout
  const logout = useCallback(() => {
    logoutOAuth();
    setState(initialState);
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

  // Testar conexão
  const testConnectionStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const isConnected = await testConnection();
      setState(prev => ({ 
        ...prev, 
        isConnected,
        isLoading: false 
      }));
      
      if (isConnected) {
        await checkConnectionStatus();
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro no teste de conexão',
        isLoading: false
      }));
    }
  }, [checkConnectionStatus]);

  // Carregar produtos
  const loadProducts = useCallback(async (query?: string, categoryId?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let searchResponse: SearchResponse;
      
      if (categoryId) {
        searchResponse = await searchProductsByCategory(categoryId, 50);
      } else if (query) {
        searchResponse = await searchProducts(query, 50);
      } else {
        searchResponse = await getFeaturedProducts(50);
      }
      
      setState(prev => ({
        ...prev,
        products: searchResponse.results,
        searchResults: searchResponse,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar produtos',
        isLoading: false
      }));
    }
  }, []);

  // Buscar produtos
  const searchProductsHandler = useCallback(async (query: string, limit: number = 20, offset: number = 0) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const searchResponse = await searchProducts(query, limit, offset);
      setState(prev => ({
        ...prev,
        searchResults: searchResponse,
        isLoading: false
      }));
      return searchResponse;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro na busca de produtos',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  // Obter detalhes de um produto
  const getProductDetailsHandler = useCallback(async (productId: string) => {
    try {
      const product = await getProductDetails(productId);
      return product;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao obter detalhes do produto'
      }));
      return null;
    }
  }, []);

  // Carregar reviews de um produto
  const loadProductReviews = useCallback(async (productId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const reviews = await getProductReviews(productId);
      
      // Analisar sentimento dos reviews
      const reviewsWithSentiment = reviews.map(review => ({
        ...review,
        sentiment: analyzeSentiment(review.comment),
        aiResponse: generateAutoResponse(review, analyzeSentiment(review.comment))
      }));
      
      setState(prev => ({
        ...prev,
        reviews: reviewsWithSentiment,
        isLoading: false
      }));
      
      return reviewsWithSentiment;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar reviews',
        isLoading: false
      }));
      return [];
    }
  }, []);

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    try {
      const categories = await getPopularCategories();
      setState(prev => ({ ...prev, categories }));
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }, []);

  // Sincronizar dados
  const syncData = useCallback(async (productIds: string[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { products, reviews } = await syncProductData(productIds);
      
      // Analisar sentimento dos reviews
      const reviewsWithSentiment = reviews.map(review => ({
        ...review,
        sentiment: analyzeSentiment(review.comment),
        aiResponse: generateAutoResponse(review, analyzeSentiment(review.comment))
      }));
      
      // Calcular estatísticas
      const totalReviews = reviewsWithSentiment.length;
      const positiveReviews = reviewsWithSentiment.filter(r => r.sentiment === 'positive').length;
      const negativeReviews = reviewsWithSentiment.filter(r => r.sentiment === 'negative').length;
      const neutralReviews = reviewsWithSentiment.filter(r => r.sentiment === 'neutral').length;
      const averageRating = totalReviews > 0 
        ? reviewsWithSentiment.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      const stats: MercadoLivreStats = {
        totalProducts: products.length,
        totalReviews,
        lastSync: new Date(),
        averageRating,
        positiveReviews,
        negativeReviews,
        neutralReviews
      };
      
      setState(prev => ({
        ...prev,
        products,
        reviews: reviewsWithSentiment,
        stats,
        isLoading: false
      }));

      // Exemplo: ao sincronizar produtos/reviews, salvar no Supabase
      await syncDataToSupabase(products, reviewsWithSentiment);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro na sincronização',
        isLoading: false
      }));
    }
  }, []);

  // Exemplo: ao autenticar, salvar tokens e perfil no Supabase
  const handleOAuthCallback = useCallback(async (code: string) => {
    if (!user || !user.id) return;
    const redirectUri = 'https://reviewai-main.netlify.app/auth/callback';
    const tokens = await exchangeCodeForToken(code, redirectUri);
    await saveMLTokensToSupabase(user.id, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    });
    const userInfo = await getUserInfo();
    await upsertMLUserInfoToSupabase(user.id, userInfo);
    setState(prev => ({ ...prev, isConnected: true, userInfo }));
  }, [user]);

  // Exemplo: ao sincronizar produtos/reviews, salvar no Supabase
  const syncDataToSupabase = useCallback(async (products: any[], reviews: any[]) => {
    if (!user || !user.id) return;
    await upsertMLProductsToSupabase(user.id, products);
    await upsertMLReviewsToSupabase(user.id, reviews);
  }, [user]);

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
    reviews: state.reviews,
    stats: state.stats,
    searchResults: state.searchResults,
    categories: state.categories,
    
    // Ações
    connect,
    logout,
    loadProducts,
    searchProducts: searchProductsHandler,
    getProductDetails: getProductDetailsHandler,
    loadProductReviews,
    loadCategories,
    testConnection: testConnectionStatus,
    syncData,
    clearError,
    checkConnectionStatus,
    login,
    handleOAuthCallback
  };
}; 