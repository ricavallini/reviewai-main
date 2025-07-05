import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const TopProducts: React.FC = () => {
  const { products } = useData();

  const sortedProducts = [...products]
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Top Produtos
        </h3>
        <div className="text-sm text-gray-500">
          Por avaliação média
        </div>
      </div>

      <div className="space-y-4">
        {sortedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {product.avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({product.totalReviews} avaliações)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {product.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : product.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span className="text-xs font-medium text-gray-500">
                #{index + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopProducts;