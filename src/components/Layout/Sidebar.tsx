import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Package,
  AlertTriangle,
  FileText,
  Settings,
  Zap,
  CreditCard,
  Shield,
  TrendingUp,
  Bot
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
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
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`bg-white/90 backdrop-blur-lg border-r border-gray-200 h-full transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ReviewAI
              </h1>
              <p className="text-xs text-gray-500">Análise Inteligente</p>
            </motion.div>
          )}
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
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
                {!isOpen && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Plan Badge */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg border border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Plano {user?.plan === 'free' ? 'Gratuito' : 
                        user?.plan === 'basic' ? 'Básico' : 
                        user?.plan === 'premium' ? 'Premium' : 'Enterprise'}
                </p>
                <p className="text-xs text-orange-600">
                  {user?.plan === 'free' ? '500/500 análises' : 'Ilimitado'}
                </p>
              </div>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;