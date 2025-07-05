import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, CheckCircle, AlertCircle, Clock, ExternalLink, Zap, ShoppingCart, Globe, Smartphone, Mail, MessageCircle, Key, RefreshCw as Refresh, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'marketplace' | 'notification' | 'analytics';
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  icon: React.ComponentType<any>;
  description: string;
  lastSync?: Date;
  productsCount?: number;
  reviewsCount?: number;
  color: string;
  credentials?: {
    apiKey?: string;
    secretKey?: string;
    accessToken?: string;
    storeId?: string;
  };
}

interface NewIntegrationModal {
  isOpen: boolean;
  type: 'marketplace' | 'notification' | 'analytics' | null;
}

interface ConfigModal {
  isOpen: boolean;
  integration: Integration | null;
}

const Integrations: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'marketplace' | 'notification' | 'analytics'>('all');
  const [newIntegrationModal, setNewIntegrationModal] = useState<NewIntegrationModal>({ isOpen: false, type: null });
  const [configModal, setConfigModal] = useState<ConfigModal>({ isOpen: false, integration: null });
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Mercado Livre',
      type: 'marketplace',
      status: 'connected',
      icon: ShoppingCart,
      description: 'Sincronize produtos e avaliações do Mercado Livre',
      lastSync: new Date(),
      productsCount: 15,
      reviewsCount: 1250,
      color: 'yellow',
      credentials: {
        apiKey: 'ML_API_KEY_123456789',
        secretKey: 'ML_SECRET_987654321',
        accessToken: 'ML_ACCESS_TOKEN_456789123'
      }
    },
    {
      id: '2',
      name: 'Amazon Brasil',
      type: 'marketplace',
      status: 'disconnected',
      icon: Globe,
      description: 'Conecte sua loja Amazon para análise completa',
      color: 'orange'
    },
    {
      id: '3',
      name: 'Shopee',
      type: 'marketplace',
      status: 'pending',
      icon: Smartphone,
      description: 'Integração com marketplace Shopee',
      color: 'red'
    },
    {
      id: '4',
      name: 'WhatsApp Business',
      type: 'notification',
      status: 'connected',
      icon: MessageCircle,
      description: 'Receba alertas via WhatsApp',
      lastSync: new Date(),
      color: 'green',
      credentials: {
        apiKey: 'WA_API_KEY_789123456'
      }
    },
    {
      id: '5',
      name: 'E-mail Notifications',
      type: 'notification',
      status: 'connected',
      icon: Mail,
      description: 'Alertas por e-mail para avaliações críticas',
      lastSync: new Date(),
      color: 'blue'
    },
    {
      id: '6',
      name: 'Google Analytics',
      type: 'analytics',
      status: 'error',
      icon: Zap,
      description: 'Conecte com Google Analytics para insights avançados',
      color: 'purple'
    }
  ]);

  const availableIntegrations = {
    marketplace: [
      { id: 'mercadolivre', name: 'Mercado Livre', icon: ShoppingCart, color: 'yellow', description: 'Maior marketplace da América Latina' },
      { id: 'amazon', name: 'Amazon Brasil', icon: Globe, color: 'orange', description: 'Marketplace global da Amazon' },
      { id: 'shopee', name: 'Shopee', icon: Smartphone, color: 'red', description: 'Marketplace mobile-first' },
      { id: 'magazineluiza', name: 'Magazine Luiza', icon: ShoppingCart, color: 'blue', description: 'Marketplace brasileiro' },
      { id: 'americanas', name: 'Americanas', icon: ShoppingCart, color: 'red', description: 'Marketplace das Lojas Americanas' }
    ],
    notification: [
      { id: 'whatsapp', name: 'WhatsApp Business', icon: MessageCircle, color: 'green', description: 'Notificações via WhatsApp' },
      { id: 'email', name: 'E-mail', icon: Mail, color: 'blue', description: 'Notificações por e-mail' },
      { id: 'slack', name: 'Slack', icon: MessageCircle, color: 'purple', description: 'Notificações no Slack' },
      { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'blue', description: 'Notificações via Telegram' }
    ],
    analytics: [
      { id: 'googleanalytics', name: 'Google Analytics', icon: Zap, color: 'purple', description: 'Analytics do Google' },
      { id: 'mixpanel', name: 'Mixpanel', icon: Zap, color: 'blue', description: 'Analytics avançado' },
      { id: 'hotjar', name: 'Hotjar', icon: Zap, color: 'orange', description: 'Heatmaps e gravações' }
    ]
  };

  const filteredIntegrations = integrations.filter(integration => 
    selectedTab === 'all' || integration.type === selectedTab
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 border-green-200';
      case 'disconnected': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50',
      red: 'bg-red-500 text-red-600 bg-red-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  const handleNewIntegration = (type: 'marketplace' | 'notification' | 'analytics') => {
    setNewIntegrationModal({ isOpen: true, type });
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setConfigModal({ isOpen: true, integration });
  };

  const handleConnectIntegration = (availableIntegration: any) => {
    const newIntegration: Integration = {
      id: Date.now().toString(),
      name: availableIntegration.name,
      type: newIntegrationModal.type!,
      status: 'pending',
      icon: availableIntegration.icon,
      description: availableIntegration.description,
      color: availableIntegration.color
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setNewIntegrationModal({ isOpen: false, type: null });

    // Simular processo de conexão
    setTimeout(() => {
      setIntegrations(prev => prev.map(integration => 
        integration.id === newIntegration.id 
          ? { ...integration, status: 'connected', lastSync: new Date() }
          : integration
      ));
    }, 3000);
  };

  const handleSaveConfiguration = (updatedIntegration: Integration) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === updatedIntegration.id ? updatedIntegration : integration
    ));
    setConfigModal({ isOpen: false, integration: null });
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected', lastSync: undefined, productsCount: undefined, reviewsCount: undefined }
        : integration
    ));
  };

  const handleDeleteIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
  };

  const toggleCredentialVisibility = (field: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'all', name: 'Todas', count: integrations.length },
    { id: 'marketplace', name: 'Marketplaces', count: integrations.filter(i => i.type === 'marketplace').length },
    { id: 'notification', name: 'Notificações', count: integrations.filter(i => i.type === 'notification').length },
    { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.type === 'analytics').length }
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
            Integrações
          </h1>
          <p className="text-gray-600">
            Conecte suas contas e configure notificações
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setNewIntegrationModal({ isOpen: true, type: null })}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Integração</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                selectedTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration, index) => {
          const [bgColor, textColor, lightBg] = getColorClasses(integration.color).split(' ');
          
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-12 w-12 ${lightBg} rounded-lg flex items-center justify-center`}>
                      <integration.icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {integration.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {integration.type === 'marketplace' ? 'Marketplace' :
                         integration.type === 'notification' ? 'Notificação' : 'Analytics'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(integration.status)}`}>
                      {getStatusIcon(integration.status)}
                      <span>{getStatusText(integration.status)}</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {integration.description}
                </p>

                {/* Stats */}
                {integration.status === 'connected' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {integration.productsCount && (
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-900">{integration.productsCount}</p>
                        <p className="text-xs text-blue-600">Produtos</p>
                      </div>
                    )}
                    {integration.reviewsCount && (
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-900">{integration.reviewsCount}</p>
                        <p className="text-xs text-green-600">Reviews</p>
                      </div>
                    )}
                  </div>
                )}

                {integration.lastSync && (
                  <p className="text-xs text-gray-500 mb-4">
                    Última sincronização: {integration.lastSync.toLocaleString('pt-BR')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <button 
                        onClick={() => handleConfigureIntegration(integration)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Configurar</span>
                      </button>
                      <button className="bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                        <Refresh className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDisconnectIntegration(integration.id)}
                        className="bg-red-100 text-red-700 py-2 px-3 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : integration.status === 'error' ? (
                    <>
                      <button className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>Reconectar</span>
                      </button>
                      <button 
                        onClick={() => handleConfigureIntegration(integration)}
                        className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </>
                  ) : integration.status === 'pending' ? (
                    <button className="w-full bg-yellow-500 text-white py-2 px-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Aguardando Aprovação</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConfigureIntegration(integration)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Conectar</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Setup Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-start space-x-4">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Key className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Como configurar suas integrações
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Marketplaces:</strong> Conecte suas contas para sincronizar produtos e avaliações automaticamente</p>
              <p>• <strong>Notificações:</strong> Configure alertas via WhatsApp e e-mail para avaliações críticas</p>
              <p>• <strong>Analytics:</strong> Integre com ferramentas de análise para insights mais profundos</p>
            </div>
            <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>Ver documentação completa</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* New Integration Modal */}
      <AnimatePresence>
        {newIntegrationModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setNewIntegrationModal({ isOpen: false, type: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {newIntegrationModal.type ? `Adicionar ${
                    newIntegrationModal.type === 'marketplace' ? 'Marketplace' :
                    newIntegrationModal.type === 'notification' ? 'Notificação' : 'Analytics'
                  }` : 'Nova Integração'}
                </h2>
                <button
                  onClick={() => setNewIntegrationModal({ isOpen: false, type: null })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {!newIntegrationModal.type ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    onClick={() => handleNewIntegration('marketplace')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketplaces</h3>
                    <p className="text-sm text-gray-600">Conecte lojas online para sincronizar produtos e avaliações</p>
                  </button>

                  <button
                    onClick={() => handleNewIntegration('notification')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-center"
                  >
                    <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notificações</h3>
                    <p className="text-sm text-gray-600">Configure alertas via WhatsApp, e-mail e outros canais</p>
                  </button>

                  <button
                    onClick={() => handleNewIntegration('analytics')}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-center"
                  >
                    <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600">Integre com ferramentas de análise para insights avançados</p>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableIntegrations[newIntegrationModal.type].map((integration) => {
                    const isAlreadyAdded = integrations.some(existing => 
                      existing.name === integration.name
                    );

                    return (
                      <div
                        key={integration.id}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                          isAlreadyAdded 
                            ? 'border-gray-200 bg-gray-50 opacity-50' 
                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                        }`}
                        onClick={() => !isAlreadyAdded && handleConnectIntegration(integration)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`h-10 w-10 bg-${integration.color}-50 rounded-lg flex items-center justify-center`}>
                            <integration.icon className={`h-6 w-6 text-${integration.color}-600`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                            {isAlreadyAdded && (
                              <span className="text-xs text-gray-500">Já adicionado</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Modal */}
      <AnimatePresence>
        {configModal.isOpen && configModal.integration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfigModal({ isOpen: false, integration: null })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Configurar {configModal.integration.name}
                </h2>
                <button
                  onClick={() => setConfigModal({ isOpen: false, integration: null })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <configModal.integration.icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Status da Integração</p>
                      <p className="text-sm text-gray-600">{configModal.integration.description}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(configModal.integration.status)}`}>
                    {getStatusText(configModal.integration.status)}
                  </span>
                </div>

                {/* Marketplace Configuration */}
                {configModal.integration.type === 'marketplace' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Credenciais da API</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showCredentials.apiKey ? 'text' : 'password'}
                          defaultValue={configModal.integration.credentials?.apiKey || ''}
                          className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Insira sua API Key"
                        />
                        <button
                          type="button"
                          onClick={() => toggleCredentialVisibility('apiKey')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCredentials.apiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secret Key
                      </label>
                      <div className="relative">
                        <input
                          type={showCredentials.secretKey ? 'text' : 'password'}
                          defaultValue={configModal.integration.credentials?.secretKey || ''}
                          className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Insira sua Secret Key"
                        />
                        <button
                          type="button"
                          onClick={() => toggleCredentialVisibility('secretKey')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCredentials.secretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store ID (opcional)
                      </label>
                      <input
                        type="text"
                        defaultValue={configModal.integration.credentials?.storeId || ''}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ID da sua loja"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Como obter suas credenciais:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Acesse o painel de desenvolvedor do {configModal.integration.name}</li>
                        <li>Crie uma nova aplicação ou use uma existente</li>
                        <li>Copie a API Key e Secret Key</li>
                        <li>Cole as credenciais nos campos acima</li>
                      </ol>
                    </div>
                  </div>
                )}

                {/* Notification Configuration */}
                {configModal.integration.type === 'notification' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificação</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Alertas Críticos</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Relatórios Semanais</span>
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Tendências Negativas</span>
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </label>
                    </div>

                    {configModal.integration.name === 'WhatsApp Business' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número do WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="+55 (11) 99999-9999"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Sync Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Configurações de Sincronização</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequência de Sincronização
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="realtime">Tempo Real</option>
                      <option value="hourly">A cada hora</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sincronizar Produtos</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sincronizar Avaliações</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Respostas Automáticas IA</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleDeleteIntegration(configModal.integration!.id)}
                    className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Remover Integração</span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setConfigModal({ isOpen: false, integration: null })}
                      className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleSaveConfiguration(configModal.integration!)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredIntegrations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma integração encontrada
          </h3>
          <p className="text-gray-600">
            Tente selecionar uma categoria diferente
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Integrations;