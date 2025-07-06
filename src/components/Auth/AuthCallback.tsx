import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useMercadoLivre } from '../../hooks/useMercadoLivre';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  const mercadoLivre = useMercadoLivre();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Erro na autorização: ' + error);
          setTimeout(() => navigate('/configuracoes'), 3000);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Parâmetros de autorização inválidos');
          setTimeout(() => navigate('/configuracoes'), 3000);
          return;
        }

        setMessage('Processando autorização...');
        
        await mercadoLivre.processAuthCallback(code, state);
        
        if (mercadoLivre.isConnected) {
          setStatus('success');
          setMessage('Autenticação realizada com sucesso! Redirecionando...');
          setTimeout(() => navigate('/configuracoes'), 2000);
        } else {
          setStatus('error');
          setMessage('Falha na autenticação');
          setTimeout(() => navigate('/configuracoes'), 3000);
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        setStatus('error');
        setMessage('Erro inesperado durante a autenticação');
        setTimeout(() => navigate('/configuracoes'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, mercadoLivre]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processando Autenticação
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Autenticação Concluída
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Erro na Autenticação
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={() => navigate('/configuracoes')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Voltar às Configurações
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallback; 