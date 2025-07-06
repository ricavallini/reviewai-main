import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Loader2,
  Info,
  Database,
  TrendingUp,
  Star,
  MessageSquare
} from 'lucide-react';
import { useMercadoLivre } from '../../hooks/useMercadoLivre';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const MercadoLivreConfig: React.FC = () => {
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const mercadoLivre = useMercadoLivre();

  // Carregar dados quando conectar
  useEffect(() => {
    if (mercadoLivre.isConnected && mercadoLivre.products.length === 0) {
      mercadoLivre.loadProducts();
    }
  }, [mercadoLivre.isConnected, mercadoLivre.products.length, mercadoLivre.loadProducts]);

  const handleSaveCredentials = async () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return;
    }

    setSaveStatus('idle');
    
    try {
      await mercadoLivre.connect(clientId, clientSecret);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleTestConnection = async () => {
    await mercadoLivre.testConnection();
  };

  const handleDisconnect = () => {
    mercadoLivre.disconnect();
  };

  const handleSyncData = async () => {
    if (mercadoLivre.products.length > 0) {
      const productIds = mercadoLivre.products.map(p => p.id);
      await mercadoLivre.syncData(productIds);
    }
  };

  const handleLoadFeaturedProducts = async () => {
    await mercadoLivre.loadProducts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <ShoppingCart className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Configuração do Mercado Livre
          </h3>
          <p className="text-sm text-gray-600">
            Configure suas credenciais para acessar a API do Mercado Livre
          </p>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        mercadoLivre.isConnected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-3">
          {mercadoLivre.isConnected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          <div>
            <p className="font-medium text-gray-900">
              Status: {mercadoLivre.isConnected ? 'Conectado' : 'Desconectado'}
            </p>
            <p className="text-sm text-gray-600">
              {mercadoLivre.isConnected 
                ? 'Sua conta está conectada e sincronizada com o Mercado Livre'
                : 'Configure suas credenciais para conectar ao Mercado Livre'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Form */}
      {!mercadoLivre.isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Credenciais da API
          </h4>
          
          <div className="space-y-4">
            {/* Client ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <div className="relative">
                <input
                  type={showClientId ? 'text' : 'password'}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Digite seu Client ID"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowClientId(!showClientId)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showClientId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Client Secret */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  type={showClientSecret ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Digite seu Client Secret"
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowClientSecret(!showClientSecret)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveCredentials}
                disabled={mercadoLivre.isLoading || !clientId.trim() || !clientSecret.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mercadoLivre.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Credenciais
              </button>
              
              {saveStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Salvo com sucesso!</span>
                </div>
              )}
              
              {saveStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Erro ao salvar</span>
                </div>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Como obter suas credenciais:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Acesse o <a href="https://developers.mercadolivre.com.br" target="_blank" rel="noopener noreferrer" className="underline">Portal de Desenvolvedores</a></li>
                  <li>Crie uma nova aplicação</li>
                  <li>Copie o Client ID e Client Secret</li>
                  <li>Cole as credenciais nos campos acima</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connected Actions */}
      {mercadoLivre.isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* User Info */}
          {mercadoLivre.userInfo && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Informações da Conta
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nickname</p>
                  <p className="font-medium text-gray-900">{mercadoLivre.userInfo.nickname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{mercadoLivre.userInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">País</p>
                  <p className="font-medium text-gray-900">{mercadoLivre.userInfo.country_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Site</p>
                  <p className="font-medium text-gray-900">{mercadoLivre.userInfo.site_id}</p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Estatísticas da Sincronização
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{mercadoLivre.stats.totalProducts}</p>
                <p className="text-sm text-gray-600">Produtos</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{formatNumber(mercadoLivre.stats.totalReviews)}</p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{mercadoLivre.stats.averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avaliação Média</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{mercadoLivre.stats.positiveReviews}</p>
                <p className="text-sm text-gray-600">Positivos</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Ações
            </h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTestConnection}
                disabled={mercadoLivre.isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mercadoLivre.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Testar Conexão
              </button>
              
              <button
                onClick={handleLoadFeaturedProducts}
                disabled={mercadoLivre.isLoading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mercadoLivre.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Carregar Produtos
              </button>
              
              <button
                onClick={handleSyncData}
                disabled={mercadoLivre.isLoading || mercadoLivre.products.length === 0}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mercadoLivre.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sincronizar Dados
              </button>
              
              <button
                onClick={handleDisconnect}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Desconectar
              </button>
            </div>
          </div>

          {/* Error Display */}
          {mercadoLivre.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Erro</p>
                  <p className="text-sm text-red-700">{mercadoLivre.error}</p>
                </div>
                <button
                  onClick={mercadoLivre.clearError}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default MercadoLivreConfig; 