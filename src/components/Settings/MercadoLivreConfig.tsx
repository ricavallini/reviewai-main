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
  Loader2,
  Info
} from 'lucide-react';
import { useMercadoLivre } from '../../hooks/useMercadoLivre';
import { formatCurrency } from '../../utils/formatters';

interface MercadoLivreConfigProps {
  onClose?: () => void;
}

const MercadoLivreConfig: React.FC<MercadoLivreConfigProps> = ({ onClose }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const mercadoLivre = useMercadoLivre();

  // Carregar credenciais salvas
  useEffect(() => {
    const savedClientId = localStorage.getItem('ml_client_id');
    const savedClientSecret = localStorage.getItem('ml_client_secret');
    
    if (savedClientId) setClientId(savedClientId);
    if (savedClientSecret) setClientSecret(savedClientSecret);
  }, []);

  const handleSave = async () => {
    if (!clientId || !clientSecret) {
      setSaveStatus('error');
      return;
    }

    setIsLoading(true);
    setSaveStatus('idle');

    try {
      // Salvar credenciais
      localStorage.setItem('ml_client_id', clientId);
      localStorage.setItem('ml_client_secret', clientSecret);

      // Iniciar login OAuth imediatamente após salvar
      mercadoLivre.login(clientId);
      // Não precisa aguardar connect, pois o login redireciona
    } catch (error) {
      console.error('Erro ao configurar Mercado Livre:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      await mercadoLivre.testConnection();
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    mercadoLivre.disconnect();
    localStorage.removeItem('ml_client_id');
    localStorage.removeItem('ml_client_secret');
    setClientId('');
    setClientSecret('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <ShoppingCart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mercado Livre</h3>
          <p className="text-sm text-gray-600">Configure sua integração com o Mercado Livre</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              mercadoLivre.isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm font-medium text-gray-900">
              {mercadoLivre.isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {mercadoLivre.isConnected ? (
              <>
                <button
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Testar'}
                </button>
                <button
                  onClick={handleDisconnect}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Desconectar
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">Configure as credenciais abaixo</span>
            )}
          </div>
        </div>

        {mercadoLivre.isConnected && mercadoLivre.userInfo && (
          <div className="mt-3 p-3 bg-white rounded border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {mercadoLivre.userInfo.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {mercadoLivre.userInfo.nickname}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {mercadoLivre.userInfo.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Credentials Form */}
      {!mercadoLivre.isConnected && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client ID
            </label>
            <div className="relative">
              <input
                type={showCredentials ? 'text' : 'password'}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu Client ID"
              />
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Secret
            </label>
            <div className="relative">
              <input
                type={showCredentials ? 'text' : 'password'}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu Client Secret"
              />
              <button
                type="button"
                onClick={() => setShowCredentials(!showCredentials)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Como obter suas credenciais:
                </h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Acesse o <a href="https://developers.mercadolivre.com.br/" target="_blank" rel="noopener noreferrer" className="underline">Portal de Desenvolvedores</a></li>
                  <li>Crie uma nova aplicação ou use uma existente</li>
                  <li>Copie o Client ID e Client Secret</li>
                  <li>Configure as permissões necessárias</li>
                  <li>Cole as credenciais nos campos acima</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading || !clientId || !clientSecret}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Conectando...</span>
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Conectado!</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <span>Erro</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Conectar</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {mercadoLivre.isConnected && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Estatísticas</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{mercadoLivre.stats.totalProducts}</p>
              <p className="text-xs text-gray-500">Produtos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{mercadoLivre.stats.totalReviews}</p>
              <p className="text-xs text-gray-500">Avaliações</p>
            </div>
          </div>
          
          {mercadoLivre.stats.lastSync && (
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Última sincronização: {new Date(mercadoLivre.stats.lastSync).toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MercadoLivreConfig; 