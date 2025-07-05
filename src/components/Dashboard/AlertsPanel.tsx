import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, Clock, ArrowRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const AlertsPanel: React.FC = () => {
  const { reviews } = useData();

  const urgentReviews = reviews.filter(review => review.isUrgent);
  const negativeReviews = reviews.filter(review => review.sentiment === 'negative').length;
  const totalReviews = reviews.length;

  const alerts = [
    {
      id: 1,
      type: 'urgent',
      title: 'Avaliações Urgentes',
      count: urgentReviews.length,
      description: 'Requerem resposta imediata',
      color: 'red',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'negative',
      title: 'Feedback Negativo',
      count: negativeReviews,
      description: `${((negativeReviews / totalReviews) * 100).toFixed(1)}% do total`,
      color: 'orange',
      icon: Bell
    },
    {
      id: 3,
      type: 'pending',
      title: 'Respostas Pendentes',
      count: 12,
      description: 'Aguardando sua resposta',
      color: 'blue',
      icon: Clock
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas & Notificações
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Ver todos
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const colorClasses = {
            red: 'bg-red-50 text-red-600 border-red-200',
            orange: 'bg-orange-50 text-orange-600 border-orange-200',
            blue: 'bg-blue-50 text-blue-600 border-blue-200'
          };

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all ${colorClasses[alert.color]}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <alert.icon className="h-5 w-5" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">
                    {alert.count}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">
              Automação IA
            </h4>
            <p className="text-sm text-gray-600">
              85% das respostas sendo geradas automaticamente
            </p>
          </div>
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertsPanel;