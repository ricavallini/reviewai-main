import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { useMercadoLivre } from '../../hooks/useMercadoLivre';

const MercadoLivreConfig: React.FC = () => {
  const [showClientId, setShowClientId] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const mercadoLivre = useMercadoLivre();

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
    await mercadoLivre.syncData();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mercado Livre</h3>
          <p className="text-sm text-gray-600">Configure sua integração com o Mercado Livre</p>
        </div>
      </div>

      {/* Status da conexão */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              mercadoLivre.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-700">
              {mercadoLivre.isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          {mercadoLivre.isConnected && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{mercadoLivre.stats.totalProducts} produtos</span>
              <span>•</span>
              <span>{mercadoLivre.stats.totalReviews} reviews</span>
              {mercadoLivre.stats.lastSync && (
                <>
                  <span>•</span>
                  <span>Última sincronização: {mercadoLivre.stats.lastSync.toLocaleDateString()}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Configuração de credenciais */}
      {!mercadoLivre.isConnected && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Configurar Credenciais</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <div className="relative">
                <input
                  type={showClientId ? 'text' : 'password'}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu Client ID do Mercado Livre"
                />
                <button
                  type="button"
                  onClick={() => setShowClientId(!showClientId)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showClientId ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
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
                  type={showClientSecret ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu Client Secret do Mercado Livre"
                />
                <button
                  type="button"
                  onClick={() => setShowClientSecret(!showClientSecret)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showClientSecret ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como obter as credenciais:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Acesse o <a href="https://developers.mercadolivre.com.br/" target="_blank" rel="noopener noreferrer" className="underline">Portal de Desenvolvedores</a></li>
                    <li>Crie um novo aplicativo</li>
                    <li>Copie o Client ID e Client Secret gerados</li>
                    <li>Configure o tipo de aplicativo como "Server-to-Server"</li>
                    <li>Não é necessário configurar URLs de redirecionamento</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSaveCredentials}
                disabled={mercadoLivre.isLoading || !clientId.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mercadoLivre.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Conectar</span>
              </button>

              {saveStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Conectado com sucesso!</span>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Erro na conexão</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ações quando conectado */}
      {mercadoLivre.isConnected && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Gerenciar Integração</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleTestConnection}
              disabled={mercadoLivre.isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {mercadoLivre.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>Testar Conexão</span>
            </button>

            <button
              onClick={handleSyncData}
              disabled={mercadoLivre.isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {mercadoLivre.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Sincronizar Dados</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Desconectar</span>
            </button>
          </div>
        </div>
      )}

      {/* Informações do usuário */}
      {mercadoLivre.isConnected && mercadoLivre.userInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Informações da Conta</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <p className="text-sm text-gray-900">{mercadoLivre.userInfo.nickname}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID do Usuário</label>
              <p className="text-sm text-gray-900">{mercadoLivre.userInfo.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{mercadoLivre.userInfo.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <p className="text-sm text-gray-900">{mercadoLivre.userInfo.country_id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {mercadoLivre.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Erro na integração</p>
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
  );
};

export default MercadoLivreConfig; 