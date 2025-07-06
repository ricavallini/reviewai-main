import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Globe,
  Smartphone,
  Plus,
  Trash2,
  Settings as SettingsIcon,
  Loader2
} from 'lucide-react';

interface MarketplaceCredentials {
  apiKey: string;
  secretKey: string;
  accessToken: string;
  storeId: string;
  webhookUrl: string;
}

interface MarketplaceConfig {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  isConnected: boolean;
  credentials: MarketplaceCredentials;
  lastSync?: Date;
  productsCount?: number;
  reviewsCount?: number;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
}

const MarketplaceSettings: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'success' | 'error' }>({});
  
  const [marketplaces, setMarketplaces] = useState<MarketplaceConfig[]>([
    {
      id: 'mercadolivre',
      name: 'Mercado Livre',
      icon: ShoppingCart,
      color: 'yellow',
      isConnected: true,
      status: 'connected',
      lastSync: new Date(),
      productsCount: 15,
      reviewsCount: 1250,
      credentials: {
        apiKey: 'ML_API_KEY_123456789',
        secretKey: 'ML_SECRET_987654321',
        accessToken: 'ML_ACCESS_TOKEN_456789123',
        storeId: 'STORE_ID_123',
        webhookUrl: 'https://api.reviewai.com/webhooks/mercadolivre'
      }
    },
    {
      id: 'amazon',
      name: 'Amazon Brasil',
      icon: Globe,
      color: 'orange',
      isConnected: false,
      status: 'disconnected',
      credentials: {
        apiKey: '',
        secretKey: '',
        accessToken: '',
        storeId: '',
        webhookUrl: 'https://api.reviewai.com/webhooks/amazon'
      }
    },
    {
      id: 'shopee',
      name: 'Shopee',
      icon: Smartphone,
      color: 'red',
      isConnected: false,
      status: 'disconnected',
      credentials: {
        apiKey: '',
        secretKey: '',
        accessToken: '',
        storeId: '',
        webhookUrl: 'https://api.reviewai.com/webhooks/shopee'
      }
    }
  ]);

  const getColorClasses = (color: string) => {
    const colors = {
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50 border-yellow-200',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50 border-orange-200',
      red: 'bg-red-500 text-red-600 bg-red-50 border-red-200',
      blue: 'bg-blue-500 text-blue-600 bg-blue-50 border-blue-200',
      green: 'bg-green-500 text-green-600 bg-green-50 border-green-200'
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100 border-green-200';
      case 'disconnected': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'syncing': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'disconnected': return 'Desconectado';
      case 'error': return 'Erro';
      case 'syncing': return 'Sincronizando';
      default: return 'Desconhecido';
    }
  };

  const toggleCredentialVisibility = (marketplaceId: string, field: string) => {
    const key = `${marketplaceId}-${field}`;
    setShowCredentials(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateCredential = (marketplaceId: string, field: keyof MarketplaceCredentials, value: string) => {
    setMarketplaces(prev => prev.map(marketplace => 
      marketplace.id === marketplaceId 
        ? {
            ...marketplace,
            credentials: {
              ...marketplace.credentials,
              [field]: value
            }
          }
        : marketplace
    ));
  };

  const saveMarketplaceConfig = async (marketplaceId: string) => {
    setIsLoading(prev => ({ ...prev, [marketplaceId]: true }));
    setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));

    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status
      setMarketplaces(prev => prev.map(marketplace => 
        marketplace.id === marketplaceId 
          ? {
              ...marketplace,
              isConnected: true,
              status: 'connected',
              lastSync: new Date(),
              productsCount: Math.floor(Math.random() * 50) + 10,
              reviewsCount: Math.floor(Math.random() * 2000) + 500
            }
          : marketplace
      ));

      setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'success' }));
      
      // Reset status após 3 segundos
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));
      }, 3000);

    } catch (error) {
      setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'error' }));
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));
      }, 3000);
    } finally {
      setIsLoading(prev => ({ ...prev, [marketplaceId]: false }));
    }
  };

  const testConnection = async (marketplaceId: string) => {
    setMarketplaces(prev => prev.map(marketplace => 
      marketplace.id === marketplaceId 
        ? { ...marketplace, status: 'syncing' }
        : marketplace
    ));

    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMarketplaces(prev => prev.map(marketplace => 
        marketplace.id === marketplaceId 
          ? { 
              ...marketplace, 
              status: 'connected',
              lastSync: new Date()
            }
          : marketplace
      ));
    } catch (error) {
      setMarketplaces(prev => prev.map(marketplace => 
        marketplace.id === marketplaceId 
          ? { ...marketplace, status: 'error' }
          : marketplace
      ));
    }
  };

  const disconnectMarketplace = (marketplaceId: string) => {
    setMarketplaces(prev => prev.map(marketplace => 
      marketplace.id === marketplaceId 
        ? { 
            ...marketplace, 
            isConnected: false,
            status: 'disconnected',
            lastSync: undefined,
            productsCount: undefined,
            reviewsCount: undefined
          }
        : marketplace
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            <span>Configurações de Marketplace</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure suas credenciais para sincronizar produtos e avaliações
          </p>
        </div>
      </div>

      {/* Marketplaces List */}
      <div className="space-y-6">
        {marketplaces.map((marketplace, index) => {
          const [bgColor, textColor, lightBg, borderColor] = getColorClasses(marketplace.color).split(' ');
          
          return (
            <motion.div
              key={marketplace.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* Marketplace Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 ${lightBg} rounded-xl flex items-center justify-center`}>
                      <marketplace.icon className={`h-6 w-6 ${textColor}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {marketplace.name}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(marketplace.status)}`}>
                          {marketplace.status === 'syncing' && (
                            <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
                          )}
                          {getStatusText(marketplace.status)}
                        </span>
                        {marketplace.lastSync && (
                          <span className="text-xs text-gray-500">
                            Última sincronização: {marketplace.lastSync.toLocaleString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {marketplace.isConnected && (
                      <>
                        <button
                          onClick={() => testConnection(marketplace.id)}
                          disabled={marketplace.status === 'syncing'}
                          className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 flex items-center space-x-1"
                        >
                          <RefreshCw className={`h-4 w-4 ${marketplace.status === 'syncing' ? 'animate-spin' : ''}`} />
                          <span>Testar</span>
                        </button>
                        <button
                          onClick={() => disconnectMarketplace(marketplace.id)}
                          className="bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Desconectar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                {marketplace.isConnected && marketplace.productsCount && marketplace.reviewsCount && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-900">{marketplace.productsCount}</p>
                      <p className="text-xs text-blue-600">Produtos Sincronizados</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-900">{marketplace.reviewsCount}</p>
                      <p className="text-xs text-green-600">Avaliações Coletadas</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Configuration Form */}
              <div className="p-6 space-y-4">
                <h5 className="font-medium text-gray-900 mb-4">Credenciais da API</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* API Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showCredentials[`${marketplace.id}-apiKey`] ? 'text' : 'password'}
                        value={marketplace.credentials.apiKey}
                        onChange={(e) => updateCredential(marketplace.id, 'apiKey', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Insira sua API Key"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(marketplace.id, 'apiKey')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCredentials[`${marketplace.id}-apiKey`] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Secret Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showCredentials[`${marketplace.id}-secretKey`] ? 'text' : 'password'}
                        value={marketplace.credentials.secretKey}
                        onChange={(e) => updateCredential(marketplace.id, 'secretKey', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Insira sua Secret Key"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(marketplace.id, 'secretKey')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCredentials[`${marketplace.id}-secretKey`] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Access Token */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Token
                    </label>
                    <div className="relative">
                      <input
                        type={showCredentials[`${marketplace.id}-accessToken`] ? 'text' : 'password'}
                        value={marketplace.credentials.accessToken}
                        onChange={(e) => updateCredential(marketplace.id, 'accessToken', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Token de acesso (opcional)"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(marketplace.id, 'accessToken')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCredentials[`${marketplace.id}-accessToken`] ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {/* Store ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store ID
                    </label>
                    <input
                      type="text"
                      value={marketplace.credentials.storeId}
                      onChange={(e) => updateCredential(marketplace.id, 'storeId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID da sua loja (opcional)"
                    />
                  </div>
                </div>

                {/* Webhook URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={marketplace.credentials.webhookUrl}
                      onChange={(e) => updateCredential(marketplace.id, 'webhookUrl', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      readOnly
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(marketplace.credentials.webhookUrl)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Configure esta URL no painel do {marketplace.name} para receber notificações em tempo real
                  </p>
                </div>

                {/* Setup Instructions */}
                <div className={`p-4 rounded-lg border ${borderColor} ${lightBg}`}>
                  <h6 className={`font-medium ${textColor.replace('text-', 'text-')} mb-2`}>
                    Como obter suas credenciais:
                  </h6>
                  <ol className={`text-sm ${textColor.replace('text-', 'text-')} space-y-1 list-decimal list-inside`}>
                    <li>Acesse o painel de desenvolvedor do {marketplace.name}</li>
                    <li>Crie uma nova aplicação ou use uma existente</li>
                    <li>Copie a API Key e Secret Key</li>
                    <li>Configure as permissões necessárias</li>
                    <li>Cole as credenciais nos campos acima</li>
                  </ol>
                  <div className="mt-3">
                    <a
                      href={`https://developers.${marketplace.id}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-medium hover:underline flex items-center space-x-1 ${textColor}`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Documentação da API</span>
                    </a>
                  </div>
                </div>

                {/* Save Status Messages */}
                <AnimatePresence>
                  {saveStatus[marketplace.id] === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Configurações salvas com sucesso!
                      </span>
                    </motion.div>
                  )}

                  {saveStatus[marketplace.id] === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                    >
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-800">
                        Erro ao salvar configurações. Verifique as credenciais.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    * Campos obrigatórios
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => saveMarketplaceConfig(marketplace.id)}
                      disabled={isLoading[marketplace.id] || !marketplace.credentials.apiKey || !marketplace.credentials.secretKey}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading[marketplace.id] ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Salvando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Salvar Configurações</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Marketplace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Adicionar Novo Marketplace</span>
            </h4>
            <p className="text-sm text-gray-600">
              Precisa conectar outro marketplace? Entre em contato conosco para adicionar suporte.
            </p>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Solicitar</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketplaceSettings;