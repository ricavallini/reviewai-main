import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Clock, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RecentReviews: React.FC = () => {
  const { reviews } = useData();

  const recentReviews = [...reviews]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Avaliações Recentes
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {recentReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {review.author}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(review.sentiment)}`}>
                  {getSentimentText(review.sentiment)}
                </span>
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

            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {review.comment}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(review.date, { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>
                {review.isUrgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                    Urgente
                  </span>
                )}
              </div>
              
              {review.aiResponse && (
                <div className="flex items-center space-x-1 text-green-600">
                  <MessageSquare className="h-3 w-3" />
                  <span>IA Respondeu</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentReviews;