// Serviço de integração com a API do Mercado Livre
export interface MercadoLivreCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface MercadoLivreProduct {
  id: string;
  title: string;
  category_id: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  sold_quantity: number;
  condition: string;
  permalink: string;
  thumbnail: string;
  pictures: Array<{
    id: string;
    url: string;
    secure_url: string;
  }>;
  attributes: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
  listing_type_id: string;
  status: string;
  created: string;
  last_updated: string;
}

export interface MercadoLivreReview {
  id: string;
  rating: number;
  comment: string;
  author: {
    id: string;
    name: string;
  };
  date_created: string;
  status: string;
  product_id: string;
}

export interface MercadoLivreUser {
  id: number;
  nickname: string;
  email: string;
  first_name: string;
  last_name: string;
  country_id: string;
  site_id: string;
  permalink: string;
  seller_reputation: {
    level_id: string;
    power_seller_status: string;
    transactions: {
      canceled: number;
      completed: number;
      period: string;
      ratings: {
        negative: number;
        neutral: number;
        positive: number;
      };
      total: number;
    };
  };
}

class MercadoLivreAPI {
  private baseURL = 'https://api.mercadolibre.com';
  private credentials: MercadoLivreCredentials | null = null;

  constructor(credentials?: MercadoLivreCredentials) {
    if (credentials) {
      this.credentials = credentials;
    }
  }

  setCredentials(credentials: MercadoLivreCredentials) {
    this.credentials = credentials;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.credentials?.accessToken) {
      throw new Error('Access token não configurado');
    }

    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('MercadoLivre API Error:', error);
      throw error;
    }
  }

  // Autenticação OAuth
  async authenticate(clientId: string, clientSecret: string, authorizationCode: string, redirectUri: string) {
    const url = `${this.baseURL}/oauth/token`;
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: authorizationCode,
      redirect_uri: redirectUri,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.credentials = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };

      return this.credentials;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Renovar token
  async refreshAccessToken(clientId: string, clientSecret: string) {
    if (!this.credentials?.refreshToken) {
      throw new Error('Refresh token não disponível');
    }

    const url = `${this.baseURL}/oauth/token`;
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: this.credentials.refreshToken,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.credentials = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || this.credentials.refreshToken,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      };

      return this.credentials;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Obter informações do usuário
  async getCurrentUser(): Promise<MercadoLivreUser> {
    return this.makeRequest('/users/me');
  }

  // Listar produtos do usuário
  async getUserProducts(userId: string, limit = 50, offset = 0): Promise<{
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
    results: MercadoLivreProduct[];
  }> {
    return this.makeRequest(`/users/${userId}/items/search?limit=${limit}&offset=${offset}`);
  }

  // Obter detalhes de um produto
  async getProduct(productId: string): Promise<MercadoLivreProduct> {
    return this.makeRequest(`/items/${productId}`);
  }

  // Obter avaliações de um produto
  async getProductReviews(productId: string): Promise<{
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
    reviews: MercadoLivreReview[];
  }> {
    return this.makeRequest(`/items/${productId}/reviews`);
  }

  // Obter todas as avaliações de um usuário
  async getUserReviews(userId: string, limit = 50, offset = 0): Promise<{
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
    reviews: MercadoLivreReview[];
  }> {
    return this.makeRequest(`/users/${userId}/reviews?limit=${limit}&offset=${offset}`);
  }

  // Buscar produtos por categoria
  async searchProducts(query: string, categoryId?: string, limit = 50, offset = 0): Promise<{
    paging: {
      total: number;
      offset: number;
      limit: number;
    };
    results: MercadoLivreProduct[];
  }> {
    let endpoint = `/sites/MLB/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`;
    if (categoryId) {
      endpoint += `&category=${categoryId}`;
    }
    return this.makeRequest(endpoint);
  }

  // Obter categorias
  async getCategories(siteId = 'MLB'): Promise<Array<{
    id: string;
    name: string;
    picture: string;
    permalink: string;
    total_items_in_this_category: number;
    path_from_root: Array<{
      id: string;
      name: string;
    }>;
  }>> {
    return this.makeRequest(`/sites/${siteId}/categories`);
  }

  // Obter subcategorias
  async getSubcategories(categoryId: string): Promise<Array<{
    id: string;
    name: string;
    picture: string;
    permalink: string;
    total_items_in_this_category: number;
    path_from_root: Array<{
      id: string;
      name: string;
    }>;
  }>> {
    return this.makeRequest(`/categories/${categoryId}`);
  }

  // Testar conexão
  async testConnection(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Obter estatísticas do usuário
  async getUserStats(userId: string): Promise<{
    total_products: number;
    total_sales: number;
    total_reviews: number;
    average_rating: number;
  }> {
    try {
      const [userProducts, userReviews] = await Promise.all([
        this.getUserProducts(userId, 1, 0), // Apenas para obter o total
        this.getUserReviews(userId, 1, 0), // Apenas para obter o total
      ]);

      // Calcular rating médio das reviews
      const allReviews = await this.getAllUserReviews(userId);
      const averageRating = allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
        : 0;

      return {
        total_products: userProducts.paging.total,
        total_sales: 0, // Não disponível na API pública
        total_reviews: userReviews.paging.total,
        average_rating: averageRating,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  // Obter todas as reviews de um usuário (com paginação)
  private async getAllUserReviews(userId: string): Promise<MercadoLivreReview[]> {
    const allReviews: MercadoLivreReview[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await this.getUserReviews(userId, limit, offset);
        allReviews.push(...response.reviews);
        
        if (response.reviews.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        hasMore = false;
      }
    }

    return allReviews;
  }
}

export default MercadoLivreAPI; 