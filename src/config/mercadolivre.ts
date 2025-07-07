// Configurações da API Mercado Livre
// IMPORTANTE: Em produção, essas credenciais devem vir de variáveis de ambiente
// e nunca devem ser expostas no frontend

function getClientId() {
  return (typeof window !== 'undefined' && localStorage.getItem('ml_client_id')) || process.env.VITE_MERCADO_LIVRE_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
}
function getClientSecret() {
  return (typeof window !== 'undefined' && localStorage.getItem('ml_client_secret')) || process.env.VITE_MERCADO_LIVRE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE';
}

export const MERCADO_LIVRE_CONFIG = {
  get CLIENT_ID() { return getClientId(); },
  get CLIENT_SECRET() { return getClientSecret(); },
  
  // URLs da API
  TOKEN_URL: 'https://api.mercadolibre.com/oauth/token',
  API_BASE: 'https://api.mercadolibre.com',
  
  // Escopo das permissões solicitadas
  SCOPE: 'read write'
};

// Instruções para configurar:
// 1. Acesse: https://developers.mercadolivre.com.br/
// 2. Crie um novo aplicativo
// 3. Configure a URL de redirecionamento como: http://localhost:5173/auth/callback (desenvolvimento)
// 4. Copie o Client ID e cole aqui ou configure a variável de ambiente VITE_MERCADO_LIVRE_CLIENT_ID
// 5. Para produção, configure a URL de redirecionamento como: https://seudominio.com/auth/callback 