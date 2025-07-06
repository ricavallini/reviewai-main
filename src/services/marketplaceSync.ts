import { supabase } from '../lib/supabase';
import MercadoLivreAPI, { MercadoLivreCredentials, MercadoLivreProduct, MercadoLivreReview } from './mercadolivre';

export interface SyncResult {
  success: boolean;
  productsSynced: number;
  reviewsSynced: number;
  errors: string[];
  lastSync: Date;
}

export interface SyncOptions {
  syncProducts?: boolean;
  syncReviews?: boolean;
  forceFullSync?: boolean;
  maxProducts?: number;
  maxReviews?: number;
}

class MarketplaceSyncService {
  private mlAPI: MercadoLivreAPI;

  constructor() {
    this.mlAPI = new MercadoLivreAPI();
  }

  // Configurar credenciais do Mercado Livre
  async setupMercadoLivreCredentials(userId: string, credentials: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }): Promise<boolean> {
    try {
      // Salvar credenciais no Supabase
      const { error } = await supabase
        .from('marketplace_credentials')
        .upsert({
          user_id: userId,
          marketplace: 'mercadolivre',
          access_token: credentials.accessToken,
          secret_key: credentials.refreshToken, // Usar secret_key para refresh_token
          is_active: true,
          last_sync: new Date().toISOString(),
        }, {
          onConflict: 'user_id,marketplace'
        });

      if (error) throw error;

      // Configurar API
      this.mlAPI.setCredentials(credentials);

      // Testar conexão
      const isConnected = await this.mlAPI.testConnection();
      if (!isConnected) {
        throw new Error('Falha na conexão com a API do Mercado Livre');
      }

      return true;
    } catch (error) {
      console.error('Erro ao configurar credenciais:', error);
      throw error;
    }
  }

  // Obter credenciais salvas
  async getCredentials(userId: string, marketplace: string): Promise<MercadoLivreCredentials | null> {
    try {
      const { data, error } = await supabase
        .from('marketplace_credentials')
        .select('*')
        .eq('user_id', userId)
        .eq('marketplace', marketplace)
        .single();

      if (error || !data) return null;

      return {
        accessToken: data.access_token || '',
        refreshToken: data.secret_key || undefined,
        expiresAt: data.last_sync ? new Date(data.last_sync) : undefined,
      };
    } catch (error) {
      console.error('Erro ao obter credenciais:', error);
      return null;
    }
  }

  // Sincronizar produtos do Mercado Livre
  async syncMercadoLivreProducts(userId: string, options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      productsSynced: 0,
      reviewsSynced: 0,
      errors: [],
      lastSync: new Date(),
    };

    try {
      // Obter credenciais
      const credentials = await this.getCredentials(userId, 'mercadolivre');
      if (!credentials) {
        throw new Error('Credenciais do Mercado Livre não encontradas');
      }

      this.mlAPI.setCredentials(credentials);

      // Obter informações do usuário
      const user = await this.mlAPI.getCurrentUser();
      
      // Obter produtos do usuário
      const productsResponse = await this.mlAPI.getUserProducts(
        user.id.toString(),
        options.maxProducts || 50,
        0
      );

      // Sincronizar cada produto
      for (const mlProduct of productsResponse.results) {
        try {
          await this.syncProduct(userId, mlProduct);
          result.productsSynced++;
        } catch (error) {
          result.errors.push(`Erro ao sincronizar produto ${mlProduct.id}: ${error}`);
        }
      }

      // Sincronizar reviews se solicitado
      if (options.syncReviews) {
        const reviewsResult = await this.syncMercadoLivreReviews(userId, options);
        result.reviewsSynced = reviewsResult.reviewsSynced;
        result.errors.push(...reviewsResult.errors);
      }

      // Atualizar timestamp de sincronização
      await this.updateLastSync(userId, 'mercadolivre');

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Erro geral na sincronização: ${error}`);
      return result;
    }
  }

  // Sincronizar um produto específico
  private async syncProduct(userId: string, mlProduct: MercadoLivreProduct): Promise<void> {
    try {
      // Verificar se o produto já existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', userId)
        .eq('marketplace_url', mlProduct.permalink)
        .single();

      const productData = {
        user_id: userId,
        name: mlProduct.title,
        category: await this.getCategoryName(mlProduct.category_id),
        price: mlProduct.price,
        marketplace_url: mlProduct.permalink,
        marketplace: 'mercadolivre',
        image_url: mlProduct.thumbnail,
        description: this.extractDescription(mlProduct),
        avg_rating: 0, // Será calculado com as reviews
        total_reviews: 0, // Será atualizado com as reviews
        recent_reviews: 0,
        trend: 'stable' as const,
        last_analysis: new Date().toISOString(),
      };

      if (existingProduct) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', existingProduct.id);

        if (error) throw error;
      } else {
        // Inserir novo produto
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao sincronizar produto:', error);
      throw error;
    }
  }

  // Sincronizar reviews do Mercado Livre
  async syncMercadoLivreReviews(userId: string, options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      productsSynced: 0,
      reviewsSynced: 0,
      errors: [],
      lastSync: new Date(),
    };

    try {
      // Obter credenciais
      const credentials = await this.getCredentials(userId, 'mercadolivre');
      if (!credentials) {
        throw new Error('Credenciais do Mercado Livre não encontradas');
      }

      this.mlAPI.setCredentials(credentials);

      // Obter produtos do usuário
      const { data: userProducts } = await supabase
        .from('products')
        .select('id, marketplace_url')
        .eq('user_id', userId)
        .eq('marketplace', 'mercadolivre');

      if (!userProducts) {
        throw new Error('Nenhum produto encontrado para sincronizar reviews');
      }

      // Sincronizar reviews de cada produto
      for (const product of userProducts) {
        try {
          const productId = this.extractProductIdFromUrl(product.marketplace_url);
          if (!productId) continue;

          const reviewsResponse = await this.mlAPI.getProductReviews(productId);
          
          for (const mlReview of reviewsResponse.reviews) {
            try {
              await this.syncReview(product.id, mlReview);
              result.reviewsSynced++;
            } catch (error) {
              result.errors.push(`Erro ao sincronizar review ${mlReview.id}: ${error}`);
            }
          }
        } catch (error) {
          result.errors.push(`Erro ao sincronizar reviews do produto ${product.id}: ${error}`);
        }
      }

      // Atualizar estatísticas dos produtos
      await this.updateProductStats(userId);

      result.success = true;
      return result;

    } catch (error) {
      result.errors.push(`Erro geral na sincronização de reviews: ${error}`);
      return result;
    }
  }

  // Sincronizar uma review específica
  private async syncReview(productId: string, mlReview: MercadoLivreReview): Promise<void> {
    try {
      // Verificar se a review já existe
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('marketplace_review_id', mlReview.id)
        .single();

      const reviewData = {
        product_id: productId,
        rating: mlReview.rating,
        comment: mlReview.comment,
        author: mlReview.author.name,
        review_date: new Date(mlReview.date_created).toISOString(),
        sentiment: this.analyzeSentiment(mlReview.comment),
        category: this.categorizeReview(mlReview.comment),
        keywords: this.extractKeywords(mlReview.comment),
        ai_response: null, // Será gerado posteriormente
        is_urgent: mlReview.rating <= 2,
        marketplace_review_id: mlReview.id,
      };

      if (existingReview) {
        // Atualizar review existente
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', existingReview.id);

        if (error) throw error;
      } else {
        // Inserir nova review
        const { error } = await supabase
          .from('reviews')
          .insert(reviewData);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao sincronizar review:', error);
      throw error;
    }
  }

  // Atualizar estatísticas dos produtos
  private async updateProductStats(userId: string): Promise<void> {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', userId)
        .eq('marketplace', 'mercadolivre');

      if (!products) return;

      for (const product of products) {
        // Calcular estatísticas das reviews
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating, review_date')
          .eq('product_id', product.id);

        if (reviews && reviews.length > 0) {
          const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
          const totalReviews = reviews.length;
          
          // Calcular reviews recentes (últimos 30 dias)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentReviews = reviews.filter(review => 
            new Date(review.review_date) > thirtyDaysAgo
          ).length;

          // Atualizar produto
          await supabase
            .from('products')
            .update({
              avg_rating: Math.round(avgRating * 100) / 100,
              total_reviews: totalReviews,
              recent_reviews: recentReviews,
              last_analysis: new Date().toISOString(),
            })
            .eq('id', product.id);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar estatísticas dos produtos:', error);
      throw error;
    }
  }

  // Atualizar timestamp de sincronização
  private async updateLastSync(userId: string, marketplace: string): Promise<void> {
    try {
      await supabase
        .from('marketplace_credentials')
        .update({
          last_sync: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('marketplace', marketplace);
    } catch (error) {
      console.error('Erro ao atualizar timestamp de sincronização:', error);
    }
  }

  // Métodos auxiliares
  private async getCategoryName(categoryId: string): Promise<string> {
    try {
      const category = await this.mlAPI.getSubcategories(categoryId);
      return category.name || 'Categoria não encontrada';
    } catch (error) {
      return 'Categoria não encontrada';
    }
  }

  private extractDescription(product: MercadoLivreProduct): string {
    const descriptionAttr = product.attributes.find(attr => 
      attr.name.toLowerCase().includes('descrição') || 
      attr.name.toLowerCase().includes('description')
    );
    return descriptionAttr?.value_name || product.title;
  }

  private extractProductIdFromUrl(url: string): string | null {
    const match = url.match(/\/produto\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  private analyzeSentiment(comment: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['bom', 'ótimo', 'excelente', 'perfeito', 'recomendo', 'gostei', 'satisfeito'];
    const negativeWords = ['ruim', 'péssimo', 'horrível', 'decepcionado', 'não recomendo', 'problema', 'defeito'];
    
    const lowerComment = comment.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private categorizeReview(comment: string): string {
    const categories = {
      'Qualidade': ['qualidade', 'material', 'durabilidade'],
      'Entrega': ['entrega', 'frete', 'rápido', 'lento'],
      'Atendimento': ['atendimento', 'vendedor', 'suporte'],
      'Preço': ['preço', 'valor', 'caro', 'barato'],
      'Embalagem': ['embalagem', 'pacote', 'caixa'],
    };

    const lowerComment = comment.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerComment.includes(keyword))) {
        return category;
      }
    }
    return 'Geral';
  }

  private extractKeywords(comment: string): string[] {
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'e', 'é', 'de', 'do', 'da', 'em', 'no', 'na', 'com', 'para', 'por', 'que', 'se', 'não', 'muito', 'mais', 'menos', 'bem', 'mal'];
    const words = comment.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word));
    
    return [...new Set(words)].slice(0, 5); // Máximo 5 palavras-chave únicas
  }

  // Testar conexão
  async testConnection(userId: string, marketplace: string): Promise<boolean> {
    try {
      const credentials = await this.getCredentials(userId, marketplace);
      if (!credentials) return false;

      this.mlAPI.setCredentials(credentials);
      return await this.mlAPI.testConnection();
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      return false;
    }
  }

  // Obter estatísticas de sincronização
  async getSyncStats(userId: string, marketplace: string): Promise<{
    totalProducts: number;
    totalReviews: number;
    lastSync: Date | null;
    isConnected: boolean;
  }> {
    try {
      // Obter estatísticas do banco
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('user_id', userId)
        .eq('marketplace', marketplace);

      const { data: reviews } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', products?.map(p => p.id) || []);

      const { data: credentials } = await supabase
        .from('marketplace_credentials')
        .select('last_sync, is_active')
        .eq('user_id', userId)
        .eq('marketplace', marketplace)
        .single();

      return {
        totalProducts: products?.length || 0,
        totalReviews: reviews?.length || 0,
        lastSync: credentials?.last_sync ? new Date(credentials.last_sync) : null,
        isConnected: credentials?.is_active || false,
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return {
        totalProducts: 0,
        totalReviews: 0,
        lastSync: null,
        isConnected: false,
      };
    }
  }
}

export default new MarketplaceSyncService(); 