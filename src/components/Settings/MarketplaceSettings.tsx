import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
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
  Loader2
} from 'lucide-react';
import { useMercadoLivre } from '../../hooks/useMercadoLivre';

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
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: 'idle' | 'success' | 'error' }>({});
  
  // Hook da integração com Mercado Livre
  const { isConnected, login, logout, isLoading, error } = useMercadoLivre();
  
  const [marketplaces, setMarketplaces] = useState<MarketplaceConfig[]>([
    {
      id: 'mercadolivre',
      name: 'Mercado Livre',
      icon: ShoppingCart,
      color: 'yellow',
      isConnected: isConnected,
      status: isLoading ? 'syncing' : isConnected ? 'connected' : 'disconnected',
      lastSync: undefined,
      productsCount: undefined,
      reviewsCount: undefined,
      credentials: {
        apiKey: '',
        secretKey: '',
        accessToken: '',
        storeId: '',
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

  // Atualizar estado do Mercado Livre quando a integração mudar
  useEffect(() => {
    setMarketplaces(prev => prev.map(marketplace => 
      marketplace.id === 'mercadolivre' 
        ? {
            ...marketplace,
            isConnected: isConnected,
            status: isLoading ? 'syncing' : isConnected ? 'connected' : 'disconnected',
            lastSync: undefined,
            productsCount: undefined,
            reviewsCount: undefined,
          }
        : marketplace
    ));
  }, [isConnected, isLoading]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
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
    setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));

    try {
      if (marketplaceId === 'mercadolivre') {
        const marketplace = marketplaces.find(m => m.id === marketplaceId);
        if (!marketplace) throw new Error('Marketplace não encontrado');

        // Configurar credenciais do Mercado Livre
        await login();

        // Testar conexão
        await login();
        
        if (isConnected) {
          setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'success' }));
          
          // Reset status após 3 segundos
          setTimeout(() => {
            setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));
          }, 3000);
        } else {
          throw new Error('Falha na conexão com o Mercado Livre');
        }
      } else {
        // Simular salvamento para outros marketplaces
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setMarketplaces(prev => prev.map(marketplace => 
          marketplace.id === marketplaceId 
            ? { ...marketplace, isConnected: true, status: 'connected' }
            : marketplace
        ));
        
        setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'success' }));
        
        // Reset status após 3 segundos
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));
        }, 3000);
      }
    } catch (error) {
      setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'error' }));
      
      // Reset status após 3 segundos
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, [marketplaceId]: 'idle' }));
      }, 3000);
    }
  };

  const testConnection = async (marketplaceId: string) => {
    try {
      if (marketplaceId === 'mercadolivre') {
        await login();
        
        if (isConnected) {
          // Atualizar status
          setMarketplaces(prev => prev.map(marketplace => 
            marketplace.id === marketplaceId 
              ? { ...marketplace, status: 'connected', isConnected: true }
              : marketplace
          ));
        } else {
          throw new Error('Falha na conexão');
        }
      } else {
        // Simular teste para outros marketplaces
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMarketplaces(prev => prev.map(marketplace => 
          marketplace.id === marketplaceId 
            ? { ...marketplace, status: 'connected', isConnected: true }
            : marketplace
        ));
      }
    } catch (error) {
      setMarketplaces(prev => prev.map(marketplace => 
        marketplace.id === marketplaceId 
          ? { ...marketplace, status: 'error', isConnected: false }
          : marketplace
      ));
    }
  };

  const disconnectMarketplace = (marketplaceId: string) => {
    if (marketplaceId === 'mercadolivre') {
      logout();
    }
    
    setMarketplaces(prev => prev.map(marketplace => 
      marketplace.id === marketplaceId 
        ? { 
            ...marketplace, 
            isConnected: false, 
            status: 'disconnected',
            lastSync: undefined,
            productsCount: 0,
            reviewsCount: 0
          }
        : marketplace
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Configurações de Marketplaces</h3>
          <p className="text-sm text-gray-600">
            Conecte suas contas de marketplace para sincronizar produtos e avaliações
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Adicionar Marketplace</span>
        </button>
      </div>

      {/* Marketplaces List */}
      <div className="space-y-4">
        {marketplaces.map((marketplace) => (
          <motion.div
            key={marketplace.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClasses(marketplace.color)}`}>
                  <marketplace.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{marketplace.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(marketplace.status)}`}>
                      {marketplace.status === 'syncing' && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      {getStatusText(marketplace.status)}
                    </span>
                    {marketplace.isConnected && (
                      <>
                        <span className="text-sm text-gray-500">
                          {marketplace.productsCount} produtos
                        </span>
                        <span className="text-sm text-gray-500">
                          {marketplace.reviewsCount} avaliações
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {marketplace.isConnected ? (
                  <>
                    <button
                      onClick={() => testConnection(marketplace.id)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Testar conexão"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => disconnectMarketplace(marketplace.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Desconectar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => saveMarketplaceConfig(marketplace.id)}
                    disabled={saveStatus[marketplace.id] === 'success'}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {saveStatus[marketplace.id] === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      'Conectar'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Credentials Form */}
            {!marketplace.isConnected && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client ID
                    </label>
                    <div className="relative">
                      <input
                        type={showCredentials[`${marketplace.id}-apiKey`] ? 'text' : 'password'}
                        value={marketplace.credentials.apiKey}
                        onChange={(e) => updateCredential(marketplace.id, 'apiKey', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                        placeholder="Digite seu Client ID"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(marketplace.id, 'apiKey')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCredentials[`${marketplace.id}-apiKey`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showCredentials[`${marketplace.id}-secretKey`] ? 'text' : 'password'}
                        value={marketplace.credentials.secretKey}
                        onChange={(e) => updateCredential(marketplace.id, 'secretKey', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                        placeholder="Digite seu Client Secret"
                      />
                      <button
                        type="button"
                        onClick={() => toggleCredentialVisibility(marketplace.id, 'secretKey')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCredentials[`${marketplace.id}-secretKey`] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                    <a
                      href="https://developers.mercadolivre.com.br/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Obter credenciais no Portal de Desenvolvedores
                    </a>
                  </div>
                  
                  <button
                    onClick={() => saveMarketplaceConfig(marketplace.id)}
                    disabled={saveStatus[marketplace.id] === 'success'}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {saveStatus[marketplace.id] === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Conectado</span>
                      </>
                    ) : saveStatus[marketplace.id] === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <span>Erro</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Salvar e Conectar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Connection Info */}
            {marketplace.isConnected && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Última sincronização</p>
                    <p className="text-sm text-gray-600">
                      {marketplace.lastSync 
                        ? new Date(marketplace.lastSync).toLocaleString('pt-BR')
                        : 'Nunca sincronizado'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => testConnection(marketplace.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Sincronizar Agora
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mercado Livre</h3>
        {isConnected ? (
          <div className="flex items-center space-x-4">
            <span className="text-green-600 font-medium">Conectado ao Mercado Livre</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Não conectado</span>
            <button
              onClick={login}
              disabled={isLoading}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Conectando...' : 'Conectar Mercado Livre'}
            </button>
          </div>
        )}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default MarketplaceSettings;