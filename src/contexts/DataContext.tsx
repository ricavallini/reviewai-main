import React, { createContext, useContext, useState } from 'react';

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
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Galaxy Pro Max',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
    marketplaceUrl: 'https://mercadolivre.com.br/produto/1',
    avgRating: 4.2,
    totalReviews: 1250,
    recentReviews: 89,
    trend: 'up',
    category: 'Eletrônicos',
    price: 1899.99,
    lastAnalysis: new Date(),
    marketplace: 'mercadolivre',
    description: 'Smartphone premium com câmera avançada'
  },
  {
    id: '2',
    name: 'Fone Bluetooth Premium',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    marketplaceUrl: 'https://mercadolivre.com.br/produto/2',
    avgRating: 3.8,
    totalReviews: 456,
    recentReviews: 23,
    trend: 'down',
    category: 'Áudio',
    price: 299.99,
    lastAnalysis: new Date(),
    marketplace: 'mercadolivre',
    description: 'Fone sem fio com cancelamento de ruído'
  },
  {
    id: '3',
    name: 'Notebook Gaming Ultra',
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=300',
    marketplaceUrl: 'https://mercadolivre.com.br/produto/3',
    avgRating: 4.7,
    totalReviews: 789,
    recentReviews: 45,
    trend: 'up',
    category: 'Computadores',
    price: 3499.99,
    lastAnalysis: new Date(),
    marketplace: 'mercadolivre',
    description: 'Notebook para jogos com placa de vídeo dedicada'
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    rating: 5,
    comment: 'Produto incrível! Chegou muito rápido e a qualidade é excelente. Recomendo!',
    author: 'Maria Santos',
    date: new Date('2024-01-15'),
    sentiment: 'positive',
    category: 'Qualidade',
    keywords: ['qualidade', 'rápido', 'excelente'],
    aiResponse: 'Olá Maria! Muito obrigado pelo seu feedback positivo! Ficamos felizes que tenha gostado da qualidade do produto e da rapidez na entrega. Sua recomendação é muito importante para nós! 😊'
  },
  {
    id: '2',
    productId: '1',
    rating: 2,
    comment: 'A embalagem chegou danificada e o produto tinha riscos. Decepcionado com a compra.',
    author: 'João Oliveira',
    date: new Date('2024-01-14'),
    sentiment: 'negative',
    category: 'Embalagem',
    keywords: ['embalagem', 'danificada', 'riscos'],
    isUrgent: true,
    aiResponse: 'Olá João, sentimos muito pelo problema com a embalagem e os riscos no produto. Isso não condiz com nossos padrões de qualidade. Vamos entrar em contato para resolver esta situação rapidamente. Pode nos enviar fotos pelo chat? Faremos a troca imediatamente!'
  }
];

// Função para gerar ID único
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Função para simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para extrair dados do produto da URL (simulação)
const extractProductDataFromUrl = async (url: string): Promise<Partial<Product>> => {
  // Simular extração de dados da URL
  await delay(1000);
  
  // Dados simulados baseados na URL
  const mockData: Partial<Product> = {
    avgRating: 4.0 + Math.random() * 1, // Rating entre 4.0 e 5.0
    totalReviews: Math.floor(Math.random() * 1000) + 100, // Entre 100 e 1100 reviews
    recentReviews: Math.floor(Math.random() * 50) + 10, // Entre 10 e 60 reviews recentes
    trend: Math.random() > 0.5 ? 'up' : 'down',
    lastAnalysis: new Date()
  };

  return mockData;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      // Simular extração de dados do marketplace
      const extractedData = await extractProductDataFromUrl(productData.marketplaceUrl);
      
      // Criar novo produto
      const newProduct: Product = {
        id: generateId(),
        name: productData.name,
        category: productData.category,
        price: productData.price,
        marketplaceUrl: productData.marketplaceUrl,
        marketplace: productData.marketplace,
        image: productData.image || 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300',
        description: productData.description,
        ...extractedData,
        avgRating: extractedData.avgRating || 0,
        totalReviews: extractedData.totalReviews || 0,
        recentReviews: extractedData.recentReviews || 0,
        trend: extractedData.trend || 'stable',
        lastAnalysis: new Date()
      };

      // Adicionar produto à lista
      setProducts(prev => [...prev, newProduct]);

      // Simular geração de reviews iniciais
      await delay(500);
      const initialReviews = generateInitialReviews(newProduct.id, newProduct.totalReviews);
      setReviews(prev => [...prev, ...initialReviews]);

      return newProduct;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    } finally {
      setIsLoading(false);
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
    
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  // Função para gerar reviews iniciais simuladas
  const generateInitialReviews = (productId: string, totalCount: number): Review[] => {
    const sampleComments = [
      { comment: 'Produto excelente, recomendo!', sentiment: 'positive', rating: 5, author: 'Ana Silva' },
      { comment: 'Boa qualidade pelo preço.', sentiment: 'positive', rating: 4, author: 'Carlos Santos' },
      { comment: 'Produto ok, nada excepcional.', sentiment: 'neutral', rating: 3, author: 'Maria Oliveira' },
      { comment: 'Chegou com defeito, tive que trocar.', sentiment: 'negative', rating: 2, author: 'João Costa' },
      { comment: 'Entrega rápida e produto conforme descrito.', sentiment: 'positive', rating: 5, author: 'Paula Lima' }
    ];

    const reviewsToGenerate = Math.min(5, Math.floor(totalCount * 0.1)); // Gerar até 5 reviews ou 10% do total
    const generatedReviews: Review[] = [];

    for (let i = 0; i < reviewsToGenerate; i++) {
      const sample = sampleComments[i % sampleComments.length];
      const review: Review = {
        id: generateId(),
        productId,
        rating: sample.rating,
        comment: sample.comment,
        author: sample.author,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
        sentiment: sample.sentiment as 'positive' | 'negative' | 'neutral',
        category: 'Geral',
        keywords: sample.comment.toLowerCase().split(' ').filter(word => word.length > 3).slice(0, 3),
        isUrgent: sample.sentiment === 'negative' && sample.rating <= 2
      };

      generatedReviews.push(review);
    }

    return generatedReviews;
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
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};