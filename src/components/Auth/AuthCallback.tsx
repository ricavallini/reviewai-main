import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeCodeForToken } from '../../services/mercadolivre';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const redirectUri = `${window.location.origin}/auth/callback`;

    if (!code) {
      setStatus('error');
      setError('Código de autorização não encontrado.');
      return;
    }

    exchangeCodeForToken(code, redirectUri)
      .then(tokens => {
        localStorage.setItem('ml_oauth_tokens', JSON.stringify(tokens));
        localStorage.setItem('ml_oauth_tokens_expires', (Date.now() + tokens.expires_in * 1000).toString());
        setStatus('success');
        setTimeout(() => {
          navigate(state || '/');
        }, 1200);
      })
      .catch(err => {
        setStatus('error');
        setError('Erro ao autenticar com Mercado Livre.');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {status === 'loading' && (
        <>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700">Autenticando com Mercado Livre...</p>
        </>
      )}
      {status === 'success' && (
        <p className="text-green-600 font-medium">Autenticação realizada com sucesso! Redirecionando...</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default AuthCallback; 