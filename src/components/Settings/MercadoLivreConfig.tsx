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

interface MercadoLivreConfigProps {
  onClose: () => void;
}

const MercadoLivreConfig: React.FC<MercadoLivreConfigProps> = ({ onClose }) => {
  const [showCredentials, setShowCredentials] = useState<{ [key: string]: boolean }>({});
  const [credentials, setCredentials] = useState({
    accessToken: '',
    refreshToken: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const mercadoLivre = useMercadoLivre();

  const toggleCredentialVisibility = (field: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const updateCredential = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!credentials.accessToken.trim()) {
      setError('Access Token é obrigatório');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSaveStatus('idle');

    try {
      await mercadoLivre.setupCredentials(
        credentials.accessToken,
        credentials.refreshToken || undefined
      );

      const isConnected = await mercadoLivre.testConnection();
      
      if (isConnected) {
        setSaveStatus('success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error('Falha na conexão com o Mercado Livre');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao configurar integração');
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!mercadoLivre.isConnected) {
      setError('Configure as credenciais primeiro');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isConnected = await mercadoLivre.testConnection();
      if (!isConnected) {
        setError('Falha na conexão com o Mercado Livre');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no teste de conexão');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!mercadoLivre.isConnected) {
      setError('Configure as credenciais primeiro');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await mercadoLivre.syncAll({
        syncProducts: true,
        syncReviews: true,
        maxProducts: 100,
        maxReviews: 500,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na sincronização');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl p-6 w-full max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-yellow-50 rounded-lg flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mercado Livre</h2>
            <p className="text-sm text-gray-600">Configure sua integração</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <AlertCircle className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              mercadoLivre.isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium text-gray-900">
              Status: {mercadoLivre.isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {mercadoLivre.stats.lastSync && (
            <span className="text-xs text-gray-500">
              Última sincronização: {mercadoLivre.stats.lastSync.toLocaleString('pt-BR')}
            </span>
          )}
        </div>
        
        {mercadoLivre.isConnected && (
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="text-lg font-bold text-blue-900">{mercadoLivre.stats.totalProducts}</p>
              <p className="text-xs text-blue-600">Produtos</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-900">{mercadoLivre.stats.totalReviews}</p>
              <p className="text-xs text-green-600">Reviews</p>
            </div>
          </div>
        )}
      </div>

      {/* Credenciais */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Credenciais da API</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Token *
          </label>
          <div className="relative">
            <input
              type={showCredentials.accessToken ? 'text' : 'password'}
              value={credentials.accessToken}
              onChange={(e) => updateCredential('accessToken', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Insira seu Access Token"
            />
            <button
              type="button"
              onClick={() => toggleCredentialVisibility('accessToken')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCredentials.accessToken ? 
                <EyeOff className="h-4 w-4" /> : 
                <Eye className="h-4 w-4" />
              }
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refresh Token (opcional)
          </label>
          <div className="relative">
            <input
              type={showCredentials.refreshToken ? 'text' : 'password'}
              value={credentials.refreshToken}
              onChange={(e) => updateCredential('refreshToken', e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Insira seu Refresh Token"
            />
            <button
              type="button"
              onClick={() => toggleCredentialVisibility('refreshToken')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCredentials.refreshToken ? 
                <EyeOff className="h-4 w-4" /> : 
                <Eye className="h-4 w-4" />
              }
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Como obter suas credenciais:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Acesse o <a href="https://developers.mercadolivre.com.br" target="_blank" rel="noopener noreferrer" className="underline">Portal de Desenvolvedores</a> do Mercado Livre</li>
                <li>Crie uma nova aplicação ou use uma existente</li>
                <li>Configure as permissões necessárias (read_products, read_reviews)</li>
                <li>Obtenha o Access Token através do fluxo OAuth</li>
                <li>Cole as credenciais nos campos acima</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {saveStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Integração configurada com sucesso!</span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {mercadoLivre.isConnected && (
            <>
              <button
                onClick={handleTestConnection}
                disabled={isLoading}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Testar Conexão</span>
              </button>

              <button
                onClick={handleSync}
                disabled={isLoading}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Sincronizar</span>
              </button>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !credentials.accessToken.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
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
    </motion.div>
  );
};

export default MercadoLivreConfig; 