import { MERCADO_LIVRE_CONFIG } from '../config/mercadolivre';

// Interface para tokens
interface MercadoLivreTokens {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
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

// Função para obter access token usando Client Credentials
async function getAccessToken(clientId: string, clientSecret: string): Promise<MercadoLivreTokens> {
  try {
    const response = await fetch(MERCADO_LIVRE_CONFIG.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter token: ${response.status} ${response.statusText}`);
    }

    const tokens: MercadoLivreTokens = await response.json();
    return tokens;
  } catch (error) {
    console.error('Erro ao obter access token:', error);
    throw error;
  }
}

// Salvar tokens no localStorage
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
    // Token expirado
    return null;
  }
  
  return JSON.parse(tokens);
}

// Limpar tokens
function clearTokens(): void {
  localStorage.removeItem('ml_tokens');
  localStorage.removeItem('ml_tokens_expires');
}

// Configurar credenciais e obter token
export async function setupCredentials(clientId: string, clientSecret: string): Promise<boolean> {
  try {
    const tokens = await getAccessToken(clientId, clientSecret);
    saveTokens(tokens);
    return true;
  } catch (error) {
    console.error('Erro ao configurar credenciais:', error);
    return false;
  }
}

// Fazer requisição autenticada para a API
async function makeAuthenticatedRequest(endpoint: string): Promise<any> {
  let tokens = getTokens();
  
  if (!tokens) {
    throw new Error('Não autenticado. Configure as credenciais primeiro.');
  }
  
  const response = await fetch(`${MERCADO_LIVRE_CONFIG.API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado, limpar e solicitar nova configuração
      clearTokens();
      throw new Error('Token expirado. Configure as credenciais novamente.');
    }
    throw new Error(`Erro na API: ${response.status}`);
  }
  
  return response.json();
}

// Obter informações do usuário (usando o Client ID como referência)
export async function getUserInfo(): Promise<any> {
  // Para Client Credentials, retornamos informações básicas
  return {
    id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
    nickname: 'ReviewAI App',
    email: 'app@reviewai.com',
    country_id: 'BR'
  };
}

// Obter produtos (exemplo - você precisará ajustar para sua necessidade específica)
export async function getUserProducts(): Promise<MercadoLivreProduct[]> {
  try {
    // Exemplo: buscar produtos por categoria ou termo de busca
    const response = await makeAuthenticatedRequest('/sites/MLB/search?q=smartphone&limit=20');
    
    if (response.results && response.results.length > 0) {
      return response.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        currency_id: item.currency_id,
        available_quantity: item.available_quantity,
        sold_quantity: item.sold_quantity,
        condition: item.condition,
        permalink: item.permalink,
        thumbnail: item.thumbnail,
        pictures: item.pictures || [],
        category_id: item.category_id,
        listing_type_id: item.listing_type_id,
        status: item.status,
        date_created: item.date_created,
        last_updated: item.last_updated
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return [];
  }
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
    const tokens = getTokens();
    if (!tokens) return false;
    
    // Testar com uma requisição simples
    await makeAuthenticatedRequest('/sites/MLB');
    return true;
  } catch (error) {
    console.error('Erro no teste de conexão:', error);
    return false;
  }
}

// Buscar produtos por termo
export async function searchProducts(query: string, limit: number = 20): Promise<MercadoLivreProduct[]> {
  try {
    const response = await makeAuthenticatedRequest(`/sites/MLB/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (response.results && response.results.length > 0) {
      return response.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        currency_id: item.currency_id,
        available_quantity: item.available_quantity,
        sold_quantity: item.sold_quantity,
        condition: item.condition,
        permalink: item.permalink,
        thumbnail: item.thumbnail,
        pictures: item.pictures || [],
        category_id: item.category_id,
        listing_type_id: item.listing_type_id,
        status: item.status,
        date_created: item.date_created,
        last_updated: item.last_updated
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// Obter detalhes de um produto específico
export async function getProductDetails(itemId: string): Promise<MercadoLivreProduct | null> {
  try {
    const response = await makeAuthenticatedRequest(`/items/${itemId}`);
    
    return {
      id: response.id,
      title: response.title,
      price: response.price,
      currency_id: response.currency_id,
      available_quantity: response.available_quantity,
      sold_quantity: response.sold_quantity,
      condition: response.condition,
      permalink: response.permalink,
      thumbnail: response.thumbnail,
      pictures: response.pictures || [],
      category_id: response.category_id,
      listing_type_id: response.listing_type_id,
      status: response.status,
      date_created: response.date_created,
      last_updated: response.last_updated
    };
  } catch (error) {
    console.error(`Erro ao obter detalhes do produto ${itemId}:`, error);
    return null;
  }
} 