import React, { useState } from 'react';
import { Bell, Menu, Search, Settings, LogOut, User, X, Check, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  onMenuToggle: () => void;
  onSidebarToggle: () => void;
}

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  actionUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Avaliação Crítica Recebida',
      message: 'Produto "Smartphone Galaxy Pro Max" recebeu avaliação 1 estrela',
      time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      read: false,
      actionUrl: '/produtos/1'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Tendência Negativa Detectada',
      message: 'Aumento de 15% em reclamações sobre entrega',
      time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      read: false,
      actionUrl: '/analytics'
    },
    {
      id: '3',
      type: 'info',
      title: 'Relatório Mensal Disponível',
      message: 'Seu relatório de janeiro está pronto para download',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: true,
      actionUrl: '/relatorios'
    },
    {
      id: '4',
      type: 'success',
      title: 'Integração Concluída',
      message: 'WhatsApp Business foi conectado com sucesso',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
      read: true,
      actionUrl: '/integracoes'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como lida
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    // Navegar para a URL se existir
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    // Fechar menu
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/configuracoes');
    setShowUserMenu(false);
  };

  const handleProfileClick = () => {
    navigate('/configuracoes');
    setShowUserMenu(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 px-4 lg:px-6 py-4 relative z-40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={onSidebarToggle}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos, avaliações..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowNotifications(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] max-h-96 overflow-hidden"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notificações
                        </h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Marcar todas como lidas
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                                !notification.read ? 'bg-blue-50/30' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDistanceToNow(notification.time, { addSuffix: true, locale: ptBR })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhuma notificação</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={clearAllNotifications}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Limpar todas
                          </button>
                          <button
                            onClick={() => {
                              navigate('/alertas');
                              setShowNotifications(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Ver todas
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.company}</p>
              </div>
              
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full border-2 border-gray-200"
                />
              </button>
            </div>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowUserMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] overflow-hidden"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
                          alt={user?.name}
                          className="h-12 w-12 rounded-full border-2 border-white"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          <p className="text-xs text-gray-500">{user?.company}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Meu Perfil</span>
                      </button>
                      
                      <button
                        onClick={handleSettingsClick}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Configurações</span>
                      </button>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>

                    {/* Plan Info */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900">
                            Plano {user?.plan === 'free' ? 'Gratuito' : 
                                  user?.plan === 'basic' ? 'Básico' : 
                                  user?.plan === 'premium' ? 'Premium' : 'Enterprise'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user?.plan === 'free' ? '500/500 análises' : 'Análises ilimitadas'}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate('/planos');
                            setShowUserMenu(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;