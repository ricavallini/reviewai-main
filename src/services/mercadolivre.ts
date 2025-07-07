import { MERCADO_LIVRE_CONFIG } from '../config/mercadolivre';
import { supabase } from '../lib/supabase';

// Interface para tokens
interface MercadoLivreTokens {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

// Interface para produtos do Mercado Livre
export interface MercadoLivreProduct {
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
  seller_id?: number;
  category_name?: string;
  description?: string;
}

// Interface para reviews do Mercado Livre
export interface MercadoLivreReview {
  id: string;
  rating: number;
  comment: string;
  author: {
    name: string;
    id: string;
  };
  date: string;
  status: string;
  item_id: string;
}

// Interface para usuário do Mercado Livre
export interface MercadoLivreUser {
  id: number;
  nickname: string;
  email: string;
  country_id: string;
  permalink: string;
  site_id: string;
}

// Interface para busca de produtos
export interface SearchResponse {
  results: MercadoLivreProduct[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
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
      const errorText = await response.text();
      throw new Error(`Erro ao obter token: ${response.status} ${response.statusText} - ${errorText}`);
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
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Obter informações do usuário (usando o Client ID como referência)
export async function getUserInfo(): Promise<MercadoLivreUser> {
  // Para Client Credentials, retornamos informações básicas
  return {
    id: parseInt(MERCADO_LIVRE_CONFIG.CLIENT_ID) || 0,
    nickname: 'ReviewAI App',
    email: 'app@reviewai.com',
    country_id: 'BR',
    permalink: 'https://reviewai.com',
    site_id: 'MLB'
  };
}

// Buscar produtos por termo de busca
export async function searchProducts(query: string, limit: number = 20, offset: number = 0): Promise<SearchResponse> {
  try {
    const response = await makeAuthenticatedRequest(`/sites/MLB/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
    
    return {
      results: response.results.map((item: any) => ({
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
        last_updated: item.last_updated,
        seller_id: item.seller?.id,
        category_name: item.category_name
      })),
      paging: response.paging
    };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
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
      last_updated: response.last_updated,
      seller_id: response.seller_id,
      category_name: response.category_name,
      description: response.description
    };
  } catch (error) {
    console.error(`Erro ao obter detalhes do produto ${itemId}:`, error);
    return null;
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

// Buscar produtos por categoria
export async function searchProductsByCategory(categoryId: string, limit: number = 20): Promise<SearchResponse> {
  try {
    const response = await makeAuthenticatedRequest(`/sites/MLB/search?category=${categoryId}&limit=${limit}`);
    
    return {
      results: response.results.map((item: any) => ({
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
        last_updated: item.last_updated,
        seller_id: item.seller?.id,
        category_name: item.category_name
      })),
      paging: response.paging
    };
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    throw error;
  }
}

// Obter categorias populares
export async function getPopularCategories(): Promise<any[]> {
  try {
    const response = await makeAuthenticatedRequest('/sites/MLB/categories');
    return response.slice(0, 10); // Retorna as 10 primeiras categorias
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    return [];
  }
}

// Buscar produtos em destaque
export async function getFeaturedProducts(limit: number = 20): Promise<SearchResponse> {
  try {
    // Buscar produtos com mais vendas
    const response = await makeAuthenticatedRequest(`/sites/MLB/search?sort=sold_quantity_desc&limit=${limit}`);
    
    return {
      results: response.results.map((item: any) => ({
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
        last_updated: item.last_updated,
        seller_id: item.seller?.id,
        category_name: item.category_name
      })),
      paging: response.paging
    };
  } catch (error) {
    console.error('Erro ao obter produtos em destaque:', error);
    throw error;
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

// Sincronizar dados de produtos
export async function syncProductData(productIds: string[]): Promise<{
  products: MercadoLivreProduct[];
  reviews: MercadoLivreReview[];
}> {
  const products: MercadoLivreProduct[] = [];
  const allReviews: MercadoLivreReview[] = [];

  try {
    // Obter detalhes de cada produto
    for (const productId of productIds) {
      const product = await getProductDetails(productId);
      if (product) {
        products.push(product);
        
        // Obter reviews do produto
        const reviews = await getProductReviews(productId);
        allReviews.push(...reviews);
      }
    }

    return { products, reviews: allReviews };
  } catch (error) {
    console.error('Erro na sincronização:', error);
    throw error;
  }
}

// Analisar sentimento de um comentário (simulação)
export function analyzeSentiment(comment: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['bom', 'ótimo', 'excelente', 'maravilhoso', 'perfeito', 'recomendo', 'gostei', 'satisfeito'];
  const negativeWords = ['ruim', 'péssimo', 'terrível', 'decepcionado', 'não recomendo', 'problema', 'defeito', 'insatisfeito'];
  
  const lowerComment = comment.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Gerar resposta automática baseada no sentimento
export function generateAutoResponse(review: MercadoLivreReview, sentiment: 'positive' | 'negative' | 'neutral'): string {
  const responses = {
    positive: [
      'Muito obrigado pelo seu feedback positivo! Ficamos felizes que tenha gostado do produto! 😊',
      'Que ótimo que você gostou! Sua satisfação é nossa prioridade! 👍',
      'Obrigado pela avaliação! Ficamos muito felizes com seu feedback! 🌟'
    ],
    negative: [
      'Sentimos muito pelo problema. Vamos resolver isso rapidamente! Pode nos contatar pelo chat?',
      'Lamentamos pela experiência negativa. Vamos entrar em contato para resolver!',
      'Peço desculpas pelo inconveniente. Vamos corrigir isso imediatamente!'
    ],
    neutral: [
      'Obrigado pelo seu feedback! Estamos sempre trabalhando para melhorar!',
      'Agradecemos sua avaliação! Sua opinião é muito importante para nós!',
      'Obrigado pelo comentário! Continuamos melhorando nossos produtos!'
    ]
  };

  const responseArray = responses[sentiment];
  return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Geração da URL de autorização OAuth
export function getAuthorizationUrl(clientId: string, redirectUri: string, state: string = ''): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state
  });
  return `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
}

// Trocar code por access_token
export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<MercadoLivreTokens & { refresh_token: string }> {
  const response = await fetch(MERCADO_LIVRE_CONFIG.TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
      client_secret: MERCADO_LIVRE_CONFIG.CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao trocar code por token: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

// Refresh do access_token
export async function refreshAccessToken(refreshToken: string): Promise<MercadoLivreTokens & { refresh_token: string }> {
  const response = await fetch(MERCADO_LIVRE_CONFIG.TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: MERCADO_LIVRE_CONFIG.CLIENT_ID,
      client_secret: MERCADO_LIVRE_CONFIG.CLIENT_SECRET,
      refresh_token: refreshToken
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao renovar token: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return response.json();
}

// Salvar tokens OAuth (incluindo refresh_token)
function saveOAuthTokens(tokens: MercadoLivreTokens & { refresh_token: string }): void {
  localStorage.setItem('ml_oauth_tokens', JSON.stringify(tokens));
  localStorage.setItem('ml_oauth_tokens_expires', (Date.now() + tokens.expires_in * 1000).toString());
}

function getOAuthTokens(): (MercadoLivreTokens & { refresh_token: string }) | null {
  const tokens = localStorage.getItem('ml_oauth_tokens');
  const expires = localStorage.getItem('ml_oauth_tokens_expires');
  if (!tokens || !expires) return null;
  const expirationTime = parseInt(expires);
  if (Date.now() > expirationTime) {
    return null;
  }
  return JSON.parse(tokens);
}

function clearOAuthTokens(): void {
  localStorage.removeItem('ml_oauth_tokens');
  localStorage.removeItem('ml_oauth_tokens_expires');
}

// Fazer requisição autenticada usando OAuth
async function makeOAuthRequest(endpoint: string): Promise<any> {
  let tokens = getOAuthTokens();
  if (!tokens) throw new Error('Não autenticado via OAuth. Faça login.');
  const response = await fetch(`${MERCADO_LIVRE_CONFIG.API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    if (response.status === 401 && tokens.refresh_token) {
      // Tentar refresh
      try {
        const newTokens = await refreshAccessToken(tokens.refresh_token);
        saveOAuthTokens(newTokens);
        return makeOAuthRequest(endpoint); // Retry
      } catch (refreshError) {
        clearOAuthTokens();
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Exportar funções para login/logout
export function isOAuthAuthenticated(): boolean {
  return !!getOAuthTokens();
}

export function logoutOAuth(): void {
  clearOAuthTokens();
}

// Funções para integração com Supabase
export async function getMLCredentialsFromSupabase(userId: string) {
  const { data, error } = await supabase
    .from('mercado_livre_credentials')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertMLCredentialsToSupabase(userId: string, creds: {
  client_id: string;
  client_secret: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
}) {
  const { error } = await supabase
    .from('mercado_livre_credentials')
    .upsert({
      user_id: userId,
      ...creds,
      updated_at: new Date().toISOString(),
    });
  if (error) throw error;
} 