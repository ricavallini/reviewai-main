import React, { useState, useEffect } from 'react';
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
  Send,
  Download,
  Share2,
  Eye,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Flag,
  Reply,
  MoreHorizontal,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar } from 'recharts';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, getProductReviews, analytics, alerts } = useData();
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('30d');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [showAIResponse, setShowAIResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const product = products.find(p => p.id === id);
  
  if (!product) {
    return <Navigate to="/produtos" replace />;
  }

  const reviews = getProductReviews(product.id);
  
  // Carregar dados de analytics do produto
  useEffect(() => {
    const loadProductAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = analytics.generateReport(selectedTimeframe as '7d' | '30d' | '90d' | '1y');
        setAnalyticsData(data);
      } catch (error) {
        console.error('Erro ao carregar analytics do produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductAnalytics();
  }, [selectedTimeframe, analytics]);

  const filteredReviews = reviews.filter(review => {
    const matchesSentiment = selectedSentiment === 'all' || review.sentiment === selectedSentiment;
    const matchesRating = selectedRating === 'all' || review.rating.toString() === selectedRating;
    return matchesSentiment && matchesRating;
  });

  const sentimentCounts = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length
  };

  const ratingDistribution = {
    '5': reviews.filter(r => r.rating === 5).length,
    '4': reviews.filter(r => r.rating === 4).length,
    '3': reviews.filter(r => r.rating === 3).length,
    '2': reviews.filter(r => r.rating === 2).length,
    '1': reviews.filter(r => r.rating === 1).length
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

  const handleGenerateAIResponse = async (reviewId: string) => {
    setShowAIResponse(reviewId);
    // Simular geração de resposta IA
    setTimeout(() => {
      setShowAIResponse(null);
    }, 2000);
  };

  const handleExportReviews = () => {
    const data = filteredReviews.map(review => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      sentiment: review.sentiment,
      date: review.date.toISOString(),
      hasResponse: !!review.aiResponse
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-${product.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira as análises do produto: ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  // Dados para gráficos
  const sentimentData = analyticsData?.trends || [];
  const pieData = [
    { name: 'Positivo', value: sentimentCounts.positive, color: '#10B981' },
    { name: 'Neutro', value: sentimentCounts.neutral, color: '#F59E0B' },
    { name: 'Negativo', value: sentimentCounts.negative, color: '#EF4444' }
  ];

  const ratingData = Object.entries(ratingDistribution).map(([rating, count]) => ({
    rating: `${rating} estrelas`,
    count,
    percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
  }));

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
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
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
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportReviews}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Exportar reviews"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handleShareProduct}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            title="Compartilhar produto"
          >
            <Share2 className="h-5 w-5" />
          </button>
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

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tendência de Sentimento
            </h3>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="7d">7 dias</option>
              <option value="30d">30 dias</option>
              <option value="90d">90 dias</option>
            </select>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Distribuição de Sentimento
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Quantidade']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Distribuição de Avaliações
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="rating" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Quantidade']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Sentiment Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="all">Todos os sentimentos</option>
            <option value="positive">Positivos</option>
            <option value="neutral">Neutros</option>
            <option value="negative">Negativos</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="all">Todas as avaliações</option>
            <option value="5">5 estrelas</option>
            <option value="4">4 estrelas</option>
            <option value="3">3 estrelas</option>
            <option value="2">2 estrelas</option>
            <option value="1">1 estrela</option>
          </select>

          <div className="text-sm text-gray-600">
            {filteredReviews.length} de {reviews.length} reviews
          </div>
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Reviews ({filteredReviews.length})
        </h3>
        
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
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
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSentimentColor(review.sentiment)}`}>
                    {getSentimentText(review.sentiment)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(review.date, { addSuffix: true, locale: ptBR })}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {review.author}
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
              
              {review.aiResponse && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Resposta IA</span>
                  </div>
                  <p className="text-sm text-blue-800">{review.aiResponse}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Útil</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-red-600 transition-colors">
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">Não útil</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-green-600 transition-colors">
                    <Reply className="h-4 w-4" />
                    <span className="text-sm">Responder</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!review.aiResponse && (
                    <button
                      onClick={() => handleGenerateAIResponse(review.id)}
                      disabled={showAIResponse === review.id}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                    >
                      {showAIResponse === review.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-sm">
                        {showAIResponse === review.id ? 'Gerando...' : 'Gerar Resposta IA'}
                      </span>
                    </button>
                  )}
                  
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-red-600 transition-colors">
                    <Flag className="h-4 w-4" />
                    <span className="text-sm">Reportar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum review encontrado com os filtros selecionados</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ProductDetails;