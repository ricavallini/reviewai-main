import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  AlertTriangle,
  ExternalLink,
  Calendar,
  Filter,
  Bot,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, getProductReviews } = useData();
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <Navigate to="/produtos" replace />;
  }

  const reviews = getProductReviews(product.id);
  
  const filteredReviews = reviews.filter(review => {
    if (selectedSentiment === 'all') return true;
    return review.sentiment === selectedSentiment;
  });

  const sentimentCounts = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-200';
      case 'negative': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
  };

  const getSentimentText = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Positivo';
      case 'negative': return 'Negativo';
      default: return 'Neutro';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Link
          to="/produtos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="text-gray-600">
            Análise detalhada das avaliações
          </p>
        </div>
      </motion.div>

      {/* Product Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Product Image & Info */}
          <div className="lg:col-span-1">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 lg:h-32 object-cover rounded-lg mb-4"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categoria:</span>
                <span className="text-sm font-medium">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Preço:</span>
                <span className="text-sm font-medium">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <a
                href={product.marketplaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver no Marketplace</span>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{product.avgRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{product.totalReviews}</p>
              <p className="text-sm text-gray-600">Total de Reviews</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{product.recentReviews}</p>
              <p className="text-sm text-gray-600">Reviews Recentes</p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {product.trend === 'up' ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {product.trend === 'up' ? '+12%' : '-8%'}
              </p>
              <p className="text-sm text-gray-600">Tendência</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análise de Sentimento
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{sentimentCounts.positive}</p>
            <p className="text-sm text-green-700">Positivos</p>
            <p className="text-xs text-green-600 mt-1">
              {((sentimentCounts.positive / reviews.length) * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{sentimentCounts.neutral}</p>
            <p className="text-sm text-yellow-700">Neutros</p>
            <p className="text-xs text-yellow-600 mt-1">
              {((sentimentCounts.neutral / reviews.length) * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{sentimentCounts.negative}</p>
            <p className="text-sm text-red-700">Negativos</p>
            <p className="text-xs text-red-600 mt-1">
              {((sentimentCounts.negative / reviews.length) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
            Avaliações ({filteredReviews.length})
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            >
              <option value="all">Todos os sentimentos</option>
              <option value="positive">Positivos</option>
              <option value="neutral">Neutros</option>
              <option value="negative">Negativos</option>
            </select>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="all">Todos os períodos</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-100 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-gray-900">{review.author}</p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(review.date, { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(review.sentiment)}`}>
                    {getSentimentText(review.sentiment)}
                  </span>
                  {review.isUrgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Urgente</span>
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              {review.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {review.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {review.aiResponse && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Resposta IA</span>
                  </div>
                  <p className="text-sm text-gray-700">{review.aiResponse}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">Gerado automaticamente</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <Send className="h-3 w-3" />
                      <span>Enviar Resposta</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma avaliação encontrada com os filtros selecionados</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;