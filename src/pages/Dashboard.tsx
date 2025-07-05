import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Star, MessageSquare, Clock, Users, Target } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentReviews from '../components/Dashboard/RecentReviews';
import SentimentChart from '../components/Dashboard/SentimentChart';
import TopProducts from '../components/Dashboard/TopProducts';
import AlertsPanel from '../components/Dashboard/AlertsPanel';

const Dashboard: React.FC = () => {
  const { products, reviews } = useData();

  const totalReviews = products.reduce((sum, product) => sum + product.totalReviews, 0);
  const avgRating = products.reduce((sum, product) => sum + product.avgRating, 0) / products.length;
  const urgentAlerts = reviews.filter(review => review.isUrgent).length;
  const recentReviews = reviews.filter(review => {
    const daysDiff = (Date.now() - review.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const statsCards = [
    {
      title: 'Total de Avaliações',
      value: totalReviews.toLocaleString(),
      change: '+12.5%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Avaliação Média',
      value: avgRating.toFixed(1),
      change: '+0.3',
      trend: 'up' as const,
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'Alertas Urgentes',
      value: urgentAlerts.toString(),
      change: '-2',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Reviews (7 dias)',
      value: recentReviews.toString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: Clock,
      color: 'green'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Visão geral dos seus produtos e avaliações
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 mt-4 sm:mt-0"
        >
          <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>Últimos 30 dias</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 90 dias</option>
          </select>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts and Data */}
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
    </motion.div>
  );
};

export default Dashboard;