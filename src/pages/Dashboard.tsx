import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Star, MessageSquare, Clock, Users, Target } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useMercadoLivre } from '../hooks/useMercadoLivre';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentReviews from '../components/Dashboard/RecentReviews';
import SentimentChart from '../components/Dashboard/SentimentChart';
import TopProducts from '../components/Dashboard/TopProducts';
import AlertsPanel from '../components/Dashboard/AlertsPanel';

const Dashboard: React.FC = () => {
  const { products, reviews } = useData();
  const { isConnected, stats: mlStats, loadProducts } = useMercadoLivre();

  // Carregar produtos em destaque se conectado ao Mercado Livre
  useEffect(() => {
    if (isConnected && products.length === 0) {
      loadProducts();
    }
  }, [isConnected, products.length, loadProducts]);

  // Calcular estatísticas baseadas nos dados reais
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  const urgentAlerts = reviews.filter(review => review.isUrgent).length;
  const recentReviews = reviews.filter(review => {
    const daysDiff = (Date.now() - review.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  // Usar estatísticas do Mercado Livre se disponíveis
  const finalStats = isConnected && mlStats.totalReviews > 0 ? {
    totalReviews: mlStats.totalReviews,
    avgRating: mlStats.averageRating,
    urgentAlerts,
    recentReviews: recentReviews || mlStats.totalReviews * 0.1 // Estimativa se não houver dados recentes
  } : {
    totalReviews,
    avgRating,
    urgentAlerts,
    recentReviews
  };

  const statsCards = [
    {
      title: 'Total de Avaliações',
      value: finalStats.totalReviews.toLocaleString(),
      change: isConnected ? '+15.2%' : '+12.5%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'blue' as const
    },
    {
      title: 'Avaliação Média',
      value: finalStats.avgRating.toFixed(1),
      change: isConnected ? '+0.4' : '+0.3',
      trend: 'up' as const,
      icon: Star,
      color: 'yellow' as const
    },
    {
      title: 'Alertas Urgentes',
      value: finalStats.urgentAlerts.toString(),
      change: isConnected ? '-3' : '-2',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'red' as const
    },
    {
      title: 'Reviews (7 dias)',
      value: finalStats.recentReviews.toString(),
      change: isConnected ? '+12.8%' : '+8.2%',
      trend: 'up' as const,
      icon: Clock,
      color: 'green' as const
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            {isConnected 
              ? 'Análise em tempo real dos seus produtos no Mercado Livre' 
              : 'Visão geral dos seus produtos e avaliações'
            }
          </p>
        </div>
        
        {isConnected && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Conectado ao Mercado Livre</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Sentiment Analysis and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SentimentChart />
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TopProducts />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <RecentReviews />
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AlertsPanel />
        </motion.div>
      </div>

      {/* Mercado Livre Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Conecte-se ao Mercado Livre
              </h3>
              <p className="text-yellow-700 mb-4">
                Para obter análises em tempo real dos seus produtos e reviews, conecte sua conta do Mercado Livre.
                Isso permitirá que você:
              </p>
              <ul className="text-yellow-700 space-y-1 mb-4">
                <li>• Monitore produtos reais do seu catálogo</li>
                <li>• Analise reviews em tempo real</li>
                <li>• Receba alertas sobre avaliações negativas</li>
                <li>• Obtenha insights detalhados de performance</li>
              </ul>
              <a
                href="/integrations"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Configurar Integração
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;