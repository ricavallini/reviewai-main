import { MERCADO_LIVRE_CONFIG } from '../config/mercadolivre';

// Interface para tokens
interface MercadoLivreTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user_id: number;
}

// Interface para produtos
interface MercadoLivreProduct {
  id: string;
  title: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  sold_quantity: number;
  condition: string;
  permalink: string;
  thumbnail: string;
  pictures: Array<{ url: string }>;
  category_id: string;
  listing_type_id: string;
  status: string;
  date_created: string;
  last_updated: string;
}

// Interface para reviews
interface MercadoLivreReview {
  id: string;
  rating: number;
  comment: string;
  author: {
    name: string;
    id: string;
  };
  date: string;
  status: string;
}

// Gerar code verifier para PKCE
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Gerar code challenge para PKCE
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Gerar state para segurança
function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Salvar tokens no localStorage (em produção, use um backend seguro)
function saveTokens(tokens: MercadoLivreTokens): void {
  localStorage.setItem('ml_tokens', JSON.stringify(tokens));
  localStorage.setItem('ml_tokens_expires', (Date.now() + tokens.expires_in * 1000).toString());
}

// Obter tokens do localStorage
function getTokens(): MercadoLivreTokens | null {
  const tokens = localStorage.getItem('ml_tokens');
  const expires = localStorage.getItem('ml_tokens_expires');
  
  if (!tokens || !expires) return null;
  
  const expirationTime = parseInt(expires);
  if (Date.now() > expirationTime) {
    // Token expirado, tentar renovar
    return null;
  }
  
  return JSON.parse(tokens);
}

// Limpar tokens
function clearTokens(): void {
  localStorage.removeItem('ml_tokens');
  localStorage.removeItem('ml_tokens_expires');
  localStorage.removeItem('ml_code_verifier');
  localStorage.removeItem('ml_state');
}

// Iniciar processo de autenticação OAuth
export async function initiateAuth(): Promise<string> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();
  
  // Salvar para uso posterior
  localStorage.setItem('ml_code_verifier', codeVerifier);
  localStorage.setItem('ml_state', state);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
    redirect_uri: MERCADO_LIVRE_CONFIG.REDIRECT_URI,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state
  });
  
  return `${MERCADO_LIVRE_CONFIG.AUTH_URL}?${params.toString()}`;
}

// Processar callback da autenticação
export async function handleAuthCallback(code: string, state: string): Promise<boolean> {
  const savedState = localStorage.getItem('ml_state');
  const codeVerifier = localStorage.getItem('ml_code_verifier');
  
  if (state !== savedState || !codeVerifier) {
    throw new Error('Estado inválido ou code verifier não encontrado');
  }
  
  try {
    const response = await fetch(MERCADO_LIVRE_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
        code: code,
        redirect_uri: MERCADO_LIVRE_CONFIG.REDIRECT_URI,
        code_verifier: codeVerifier
      })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter token de acesso');
    }
    
    const tokens: MercadoLivreTokens = await response.json();
    saveTokens(tokens);
    
    // Limpar dados temporários
    localStorage.removeItem('ml_code_verifier');
    localStorage.removeItem('ml_state');
    
    return true;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return false;
  }
}

// Renovar token de acesso
async function refreshAccessToken(): Promise<boolean> {
  const tokens = getTokens();
  if (!tokens?.refresh_token) return false;
  
  try {
    const response = await fetch(MERCADO_LIVRE_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
        refresh_token: tokens.refresh_token
      })
    });
    
    if (!response.ok) {
      clearTokens();
      return false;
    }
    
    const newTokens: MercadoLivreTokens = await response.json();
    saveTokens(newTokens);
    return true;
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    clearTokens();
    return false;
  }
}

// Fazer requisição autenticada para a API
async function makeAuthenticatedRequest(endpoint: string): Promise<any> {
  let tokens = getTokens();
  
  if (!tokens) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      throw new Error('Não autenticado');
    }
    tokens = getTokens();
  }
  
  const response = await fetch(`${MERCADO_LIVRE_CONFIG.API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${tokens!.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado, tentar renovar
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        tokens = getTokens();
        const retryResponse = await fetch(`${MERCADO_LIVRE_CONFIG.API_BASE}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${tokens!.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Erro na API: ${retryResponse.status}`);
        }
        
        return retryResponse.json();
      } else {
        throw new Error('Falha na autenticação');
      }
    }
    throw new Error(`Erro na API: ${response.status}`);
  }
  
  return response.json();
}

// Obter informações do usuário
export async function getUserInfo(): Promise<any> {
  return makeAuthenticatedRequest('/users/me');
}

// Obter produtos do usuário
export async function getUserProducts(): Promise<MercadoLivreProduct[]> {
  const userInfo = await getUserInfo();
  const response = await makeAuthenticatedRequest(`/users/${userInfo.id}/items/search?limit=50`);
  
  if (response.results && response.results.length > 0) {
    // Obter detalhes completos de cada produto
    const productsWithDetails = await Promise.all(
      response.results.map(async (itemId: string) => {
        try {
          return await makeAuthenticatedRequest(`/items/${itemId}`);
        } catch (error) {
          console.error(`Erro ao obter detalhes do produto ${itemId}:`, error);
          return null;
        }
      })
    );
    
    return productsWithDetails.filter(Boolean);
  }
  
  return [];
}

// Obter reviews de um produto
export async function getProductReviews(itemId: string): Promise<MercadoLivreReview[]> {
  try {
    const response = await makeAuthenticatedRequest(`/reviews/item/${itemId}`);
    return response.reviews || [];
  } catch (error) {
    console.error(`Erro ao obter reviews do produto ${itemId}:`, error);
    return [];
  }
}

// Verificar se está autenticado
export function isAuthenticated(): boolean {
  return getTokens() !== null;
}

// Fazer logout
export function logout(): void {
  clearTokens();
}

// Testar conexão
export async function testConnection(): Promise<boolean> {
  try {
    await getUserInfo();
    return true;
  } catch (error) {
    console.error('Erro no teste de conexão:', error);
    return false;
  }
}

// Configurar credenciais (para desenvolvimento)
export function setupCredentials(clientId: string): void {
  MERCADO_LIVRE_CONFIG.CLIENT_ID = clientId;
} 