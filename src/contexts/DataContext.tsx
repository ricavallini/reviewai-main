import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMercadoLivre } from '../hooks/useMercadoLivre';
import { MercadoLivreProduct, MercadoLivreReview } from '../services/mercadolivre';
import { analyticsService } from '../services/analytics';
import { alertService } from '../services/alerts';
import { reportService } from '../services/reports';

export interface Review {
  id: string;
  productId: string;
  rating: number;
  comment: string;
  author: string;
  date: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
  keywords: string[];
  aiResponse?: string;
  isUrgent?: boolean;
  marketplace?: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  marketplaceUrl: string;
  avgRating: number;
  totalReviews: number;
  recentReviews: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  price: number;
  lastAnalysis: Date;
  marketplace?: string;
  description?: string;
  availableQuantity?: number;
  soldQuantity?: number;
  condition?: string;
  sellerId?: number;
  categoryName?: string;
}

export interface NewProductData {
  name: string;
  category: string;
  price: number;
  marketplaceUrl: string;
  marketplace?: string;
  image?: string;
  description?: string;
}

interface DataContextType {
  products: Product[];
  reviews: Review[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  getProductReviews: (productId: string) => Review[];
  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  addProduct: (productData: NewProductData) => Promise<Product>;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  searchProducts: (query: string) => Promise<Product[]>;
  loadProductFromMercadoLivre: (productId: string) => Promise<Product | null>;
  syncMercadoLivreData: (productIds: string[]) => Promise<void>;
  isLoading: boolean;
  analytics: any;
  alerts: any;
  reports: any;
  mercadoLivreProducts: MercadoLivreProduct[];
  mercadoLivreReviews: MercadoLivreReview[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Função para converter MercadoLivreProduct para Product
const convertMercadoLivreProduct = (mlProduct: MercadoLivreProduct): Product => {
  return {
    id: mlProduct.id,
    name: mlProduct.title,
    image: mlProduct.thumbnail,
    marketplaceUrl: mlProduct.permalink,
    avgRating: 0, // Será calculado quando carregar os reviews
    totalReviews: 0, // Será calculado quando carregar os reviews
    recentReviews: 0, // Será calculado quando carregar os reviews
    trend: 'stable', // Será calculado baseado nos dados
    category: mlProduct.category_name || 'Sem categoria',
    price: mlProduct.price,
    lastAnalysis: new Date(),
    marketplace: 'mercadolivre',
    description: mlProduct.description,
    availableQuantity: mlProduct.available_quantity,
    soldQuantity: mlProduct.sold_quantity,
    condition: mlProduct.condition,
    sellerId: mlProduct.seller_id,
    categoryName: mlProduct.category_name
  };
};

// Função para converter MercadoLivreReview para Review
const convertMercadoLivreReview = (mlReview: MercadoLivreReview): Review => {
  return {
    id: mlReview.id,
    productId: mlReview.item_id,
    rating: mlReview.rating,
    comment: mlReview.comment,
    author: mlReview.author.name,
    date: new Date(mlReview.date),
    sentiment: 'neutral', // Será analisado pelo serviço
    category: 'Geral',
    keywords: [],
    isUrgent: false,
    marketplace: 'mercadolivre'
  };
};

// Função para gerar ID único
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Função para simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para calcular estatísticas de reviews
const calculateReviewStats = (reviews: Review[], productId: string) => {
  const productReviews = reviews.filter(r => r.productId === productId);
  const totalReviews = productReviews.length;
  const avgRating = totalReviews > 0 
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
    : 0;
  
  const recentReviews = productReviews.filter(r => {
    const daysDiff = (Date.now() - r.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  return { totalReviews, avgRating, recentReviews };
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook do Mercado Livre
  const mercadoLivre = useMercadoLivre();

  // Carregar dados do Mercado Livre quando conectar
  useEffect(() => {
    if (mercadoLivre.isConnected && mercadoLivre.products.length > 0) {
      const convertedProducts = mercadoLivre.products.map(convertMercadoLivreProduct);
      setProducts(convertedProducts);
    }
  }, [mercadoLivre.isConnected, mercadoLivre.products]);

  // Carregar reviews do Mercado Livre
  useEffect(() => {
    if (mercadoLivre.reviews.length > 0) {
      const convertedReviews = mercadoLivre.reviews.map(convertMercadoLivreReview);
      setReviews(convertedReviews);
    }
  }, [mercadoLivre.reviews]);

  // Configurar serviços com dados reais
  useEffect(() => {
    analyticsService.setData(reviews, products);
    reportService.setData(products, reviews);
    
    // Processar alertas para novas reviews
    reviews.forEach(review => {
      const product = products.find(p => p.id === review.productId);
      if (product) {
        alertService.processReview(review, product);
      }
    });
  }, [reviews, products]);

  const getProductReviews = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const updateReview = (reviewId: string, updates: Partial<Review>) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, ...updates } : review
    ));
  };

  const addProduct = async (productData: NewProductData): Promise<Product> => {
    setIsLoading(true);
    
    try {
      // Simular validação da URL
      if (!productData.marketplaceUrl || !productData.marketplaceUrl.startsWith('http')) {
        throw new Error('URL do produto inválida');
      }

      // Se for do Mercado Livre, tentar carregar dados reais
      if (productData.marketplace === 'mercadolivre' && mercadoLivre.isConnected) {
        // Extrair ID do produto da URL do Mercado Livre
        const urlMatch = productData.marketplaceUrl.match(/\/produto\/([^/?]+)/);
        if (urlMatch) {
          const productId = urlMatch[1];
          const mlProduct = await mercadoLivre.getProductDetails(productId);
          if (mlProduct) {
            const product = convertMercadoLivreProduct(mlProduct);
            setProducts(prev => [...prev, product]);
            setIsLoading(false);
            return product;
          }
        }
      }

      // Criar produto com dados básicos
      const newProduct: Product = {
        id: generateId(),
        name: productData.name,
        category: productData.category,
        price: productData.price,
        image: productData.image || 'https://via.placeholder.com/300x300?text=Produto',
        marketplaceUrl: productData.marketplaceUrl,
        marketplace: productData.marketplace,
        description: productData.description,
        avgRating: 0,
        totalReviews: 0,
        recentReviews: 0,
        trend: 'stable',
        lastAnalysis: new Date()
      };

      setProducts(prev => [...prev, newProduct]);
      setIsLoading(false);
      return newProduct;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    setReviews(prev => prev.filter(review => review.productId !== productId));
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    if (!mercadoLivre.isConnected) {
      // Busca local se não estiver conectado
      return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const searchResponse = await mercadoLivre.searchProducts(query, 20);
      return searchResponse.results.map(convertMercadoLivreProduct);
    } catch (error) {
      console.error('Erro na busca de produtos:', error);
      return [];
    }
  };

  const loadProductFromMercadoLivre = async (productId: string): Promise<Product | null> => {
    if (!mercadoLivre.isConnected) {
      return null;
    }

    try {
      const mlProduct = await mercadoLivre.getProductDetails(productId);
      if (mlProduct) {
        return convertMercadoLivreProduct(mlProduct);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar produto do Mercado Livre:', error);
      return null;
    }
  };

  const syncMercadoLivreData = async (productIds: string[]) => {
    if (!mercadoLivre.isConnected) {
      throw new Error('Não conectado ao Mercado Livre');
    }

    setIsLoading(true);
    try {
      // Sincronizar produtos
      for (const productId of productIds) {
        const mlProduct = await mercadoLivre.getProductDetails(productId);
        if (mlProduct) {
          const product = convertMercadoLivreProduct(mlProduct);
          updateProduct(productId, product);
        }
      }

      // Sincronizar reviews - usar reviews já carregadas
      const convertedReviews = mercadoLivre.reviews.map(convertMercadoLivreReview);
      setReviews(convertedReviews);
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Serviços integrados
  const analytics = {
    getSentimentDistribution: () => analyticsService.getSentimentDistribution(),
    getRatingDistribution: () => analyticsService.getRatingDistribution(),
    getTrends: (period: '7d' | '30d' | '90d' | '1y') => analyticsService.getTrends(period),
    getKeywords: () => analyticsService.getKeywords(),
    generateInsights: () => analyticsService.generateInsights(),
    getMetrics: () => analyticsService.getMetrics(),
    generateReport: (period: '7d' | '30d' | '90d' | '1y') => analyticsService.generateReport(period),
    exportReport: (options: any) => analyticsService.exportReport(options),
    sendReportByEmail: (options: any) => analyticsService.sendReportByEmail(options)
  };

  const alerts = {
    getAlerts: () => alertService.getAlerts(),
    getFilteredAlerts: (filters: any) => alertService.getFilteredAlerts(filters),
    getAlertStats: () => alertService.getAlertStats(),
    getConfig: () => alertService.getConfig(),
    setConfig: (config: any) => alertService.setConfig(config),
    getRules: () => alertService.getRules(),
    addRule: (rule: any) => alertService.addRule(rule),
    removeRule: (ruleId: string) => alertService.removeRule(ruleId),
    markAsRead: (alertId: string) => alertService.markAsRead(alertId),
    markAsResolved: (alertId: string) => alertService.markAsResolved(alertId),
    markAllAsRead: () => alertService.markAllAsRead(),
    deleteAlert: (alertId: string) => alertService.deleteAlert(alertId),
    addListener: (listener: any) => alertService.addListener(listener),
    removeListener: (listener: any) => alertService.removeListener(listener)
  };

  const reports = {
    getTemplates: () => reportService.getTemplates(),
    getTemplate: (templateId: string) => reportService.getTemplate(templateId),
    generateReport: (templateId: string, period: any, customFields?: any) => 
      reportService.generateReport(templateId, period, customFields),
    getReports: () => reportService.getReports(),
    getReport: (reportId: string) => reportService.getReport(reportId),
    deleteReport: (reportId: string) => reportService.deleteReport(reportId),
    exportReport: (reportId: string, format: any) => reportService.exportReport(reportId, format)
  };

  return (
    <DataContext.Provider value={{
      products,
      reviews,
      selectedProduct,
      setSelectedProduct,
      getProductReviews,
      updateReview,
      addProduct,
      updateProduct,
      deleteProduct,
      searchProducts,
      loadProductFromMercadoLivre,
      syncMercadoLivreData,
      isLoading,
      analytics,
      alerts,
      reports,
      mercadoLivreProducts: mercadoLivre.products,
      mercadoLivreReviews: mercadoLivre.reviews
    }}>
      {children}
    </DataContext.Provider>
  );
};