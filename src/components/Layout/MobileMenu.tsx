import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, BarChart3, Package, AlertTriangle, FileText, Settings, Zap, CreditCard, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Produtos', href: '/produtos', icon: Package },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Alertas', href: '/alertas', icon: AlertTriangle },
    { name: 'Relatórios', href: '/relatorios', icon: FileText },
    { name: 'Integrações', href: '/integracoes', icon: Zap },
    { name: 'Planos', href: '/planos', icon: CreditCard },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
  ];

  if (user?.isAdmin) {
    navigationItems.push({ name: 'Admin', href: '/admin', icon: Shield });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50"
      />

      {/* Menu */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ReviewAI
                </h1>
                <p className="text-xs text-gray-500">Análise Inteligente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Plan Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Plano {user?.plan === 'free' ? 'Gratuito' : 
                        user?.plan === 'basic' ? 'Básico' : 
                        user?.plan === 'premium' ? 'Premium' : 'Enterprise'}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {user?.plan === 'free' ? '500/500 análises utilizadas' : 'Análises ilimitadas'}
                </p>
              </div>
              <CreditCard className="h-5 w-5 text-orange-600" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileMenu;