import { Product, Review } from '../contexts/DataContext';
import { AnalyticsData } from './analytics';

export interface Report {
  id: string;
  name: string;
  type: 'complete' | 'sentiment' | 'trends' | 'keywords' | 'competitive';
  period: '7d' | '30d' | '90d' | '1y' | 'custom';
  status: 'processing' | 'ready' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  data: ReportData;
  insights: ReportInsight[];
  metadata: ReportMetadata;
}

export interface ReportData {
  summary: {
    totalProducts: number;
    totalReviews: number;
    averageRating: number;
    responseRate: number;
    satisfactionScore: number;
  };
  analytics: AnalyticsData;
  products: ProductReport[];
  reviews: ReviewReport[];
  trends: TrendData[];
  comparisons: ComparisonData[];
}

export interface ProductReport {
  productId: string;
  productName: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<string, number>;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keywords: {
    keyword: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  trends: {
    period: string;
    rating: number;
    reviews: number;
  }[];
  issues: {
    type: string;
    count: number;
    percentage: number;
  }[];
}

export interface ReviewReport {
  reviewId: string;
  productName: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  keywords: string[];
  isUrgent: boolean;
}

export interface TrendData {
  period: string;
  metrics: {
    totalReviews: number;
    averageRating: number;
    positivePercentage: number;
    negativePercentage: number;
  };
  changes: {
    reviews: number;
    rating: number;
    sentiment: number;
  };
}

export interface ComparisonData {
  metric: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ReportInsight {
  id: string;
  type: 'positive' | 'negative' | 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  data: Record<string, any>;
  recommendations: string[];
}

export interface ReportMetadata {
  generatedBy: string;
  dataSource: string;
  filters: Record<string, any>;
  processingTime: number;
  dataPoints: number;
  version: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: Report['type'];
  sections: ReportSection[];
  defaultPeriod: Report['period'];
  customFields: CustomField[];
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'summary' | 'chart' | 'table' | 'insights' | 'comparison';
  required: boolean;
  config: Record<string, any>;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

class ReportService {
  private reports: Report[] = [];
  private templates: ReportTemplate[] = [
    {
      id: 'complete',
      name: 'Relatório Completo',
      description: 'Análise detalhada de todos os aspectos dos produtos e reviews',
      type: 'complete',
      sections: [
        { id: 'summary', name: 'Resumo Executivo', type: 'summary', required: true, config: {} },
        { id: 'trends', name: 'Tendências', type: 'chart', required: true, config: { chartType: 'line' } },
        { id: 'sentiment', name: 'Análise de Sentimento', type: 'chart', required: true, config: { chartType: 'pie' } },
        { id: 'products', name: 'Performance dos Produtos', type: 'table', required: true, config: {} },
        { id: 'insights', name: 'Insights e Recomendações', type: 'insights', required: true, config: {} }
      ],
      defaultPeriod: '30d',
      customFields: []
    },
    {
      id: 'sentiment',
      name: 'Análise de Sentimento',
      description: 'Foco em sentimentos e emoções dos clientes',
      type: 'sentiment',
      sections: [
        { id: 'sentiment-summary', name: 'Resumo de Sentimento', type: 'summary', required: true, config: {} },
        { id: 'sentiment-distribution', name: 'Distribuição de Sentimento', type: 'chart', required: true, config: { chartType: 'pie' } },
        { id: 'sentiment-trends', name: 'Evolução do Sentimento', type: 'chart', required: true, config: { chartType: 'line' } },
        { id: 'keywords', name: 'Palavras-chave', type: 'table', required: true, config: {} },
        { id: 'sentiment-insights', name: 'Insights de Sentimento', type: 'insights', required: true, config: {} }
      ],
      defaultPeriod: '30d',
      customFields: []
    },
    {
      id: 'trends',
      name: 'Análise de Tendências',
      description: 'Evolução temporal das avaliações e métricas',
      type: 'trends',
      sections: [
        { id: 'trends-summary', name: 'Resumo de Tendências', type: 'summary', required: true, config: {} },
        { id: 'rating-trends', name: 'Tendência de Avaliações', type: 'chart', required: true, config: { chartType: 'line' } },
        { id: 'volume-trends', name: 'Volume de Reviews', type: 'chart', required: true, config: { chartType: 'bar' } },
        { id: 'comparison', name: 'Comparação Períodos', type: 'comparison', required: true, config: {} },
        { id: 'trends-insights', name: 'Insights de Tendências', type: 'insights', required: true, config: {} }
      ],
      defaultPeriod: '90d',
      customFields: []
    }
  ];

  private products: Product[] = [];
  private reviews: Review[] = [];

  // Configurar dados
  setData(products: Product[], reviews: Review[]) {
    this.products = products;
    this.reviews = reviews;
  }

  // Obter templates disponíveis
  getTemplates(): ReportTemplate[] {
    return [...this.templates];
  }

  // Obter template por ID
  getTemplate(templateId: string): ReportTemplate | undefined {
    return this.templates.find(template => template.id === templateId);
  }

  // Gerar relatório
  async generateReport(
    templateId: string,
    period: Report['period'],
    customFields?: Record<string, any>
  ): Promise<Report> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template não encontrado');
    }

    const reportId = this.generateId();
    const report: Report = {
      id: reportId,
      name: `${template.name} - ${this.formatPeriod(period)}`,
      type: template.type,
      period,
      status: 'processing',
      createdAt: new Date(),
      data: {} as ReportData,
      insights: [],
      metadata: {} as ReportMetadata
    };

    this.reports.push(report);

    try {
      // Processar relatório em background
      await this.processReport(report, template, customFields);
      
      report.status = 'ready';
      report.completedAt = new Date();
      
      return report;
    } catch (error) {
      report.status = 'failed';
      throw error;
    }
  }

  // Processar relatório
  private async processReport(
    report: Report,
    template: ReportTemplate,
    customFields?: Record<string, any>
  ): Promise<void> {
    const startTime = Date.now();
    
    // Filtrar dados pelo período
    const filteredData = this.filterDataByPeriod(report.period);
    
    // Gerar dados do relatório
    const reportData = await this.generateReportData(report.type, filteredData);
    
    // Gerar insights
    const insights = this.generateInsights(report.type, reportData);
    
    // Calcular métricas
    const metadata = this.calculateMetadata(startTime, filteredData);
    
    // Atualizar relatório
    report.data = reportData;
    report.insights = insights;
    report.metadata = metadata;
  }

  // Filtrar dados por período
  private filterDataByPeriod(period: Report['period']): { products: Product[]; reviews: Review[] } {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // Todos os dados
    }

    const filteredReviews = this.reviews.filter(review => review.date >= startDate);
    const productIds = new Set(filteredReviews.map(review => review.productId));
    const filteredProducts = this.products.filter(product => productIds.has(product.id));

    return { products: filteredProducts, reviews: filteredReviews };
  }

  // Gerar dados do relatório
  private async generateReportData(
    type: Report['type'],
    data: { products: Product[]; reviews: Review[] }
  ): Promise<ReportData> {
    const { products, reviews } = data;

    // Calcular resumo
    const summary = this.calculateSummary(products, reviews);
    
    // Gerar analytics
    const analytics = await this.generateAnalytics(reviews);
    
    // Gerar relatórios de produtos
    const productReports = this.generateProductReports(products, reviews);
    
    // Gerar relatórios de reviews
    const reviewReports = this.generateReviewReports(reviews);
    
    // Gerar tendências
    const trends = this.generateTrends(reviews);
    
    // Gerar comparações
    const comparisons = this.generateComparisons(reviews);

    return {
      summary,
      analytics,
      products: productReports,
      reviews: reviewReports,
      trends,
      comparisons
    };
  }

  // Calcular resumo
  private calculateSummary(products: Product[], reviews: Review[]): ReportData['summary'] {
    const totalProducts = products.length;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    const reviewsWithResponse = reviews.filter(review => review.aiResponse).length;
    const responseRate = totalReviews > 0 ? (reviewsWithResponse / totalReviews) * 100 : 0;
    
    const satisfiedReviews = reviews.filter(review => review.rating >= 4).length;
    const satisfactionScore = totalReviews > 0 ? (satisfiedReviews / totalReviews) * 100 : 0;

    return {
      totalProducts,
      totalReviews,
      averageRating,
      responseRate,
      satisfactionScore
    };
  }

  // Gerar analytics
  private async generateAnalytics(reviews: Review[]): Promise<AnalyticsData> {
    // Importar e usar o serviço de analytics
    const { analyticsService } = await import('./analytics');
    analyticsService.setData(reviews, []);
    
    return analyticsService.generateReport('30d');
  }

  // Gerar relatórios de produtos
  private generateProductReports(products: Product[], reviews: Review[]): ProductReport[] {
    return products.map(product => {
      const productReviews = reviews.filter(review => review.productId === product.id);
      
      // Distribuição de ratings
      const ratingDistribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
      productReviews.forEach(review => {
        ratingDistribution[review.rating.toString()]++;
      });

      // Distribuição de sentimento
      const sentiments = productReviews.map(review => this.analyzeSentiment(review));
      const sentimentDistribution = {
        positive: sentiments.filter(s => s === 'positive').length,
        neutral: sentiments.filter(s => s === 'neutral').length,
        negative: sentiments.filter(s => s === 'negative').length
      };

      // Palavras-chave
      const keywords = this.extractKeywords(productReviews);

      // Tendências
      const trends = this.calculateProductTrends(productReviews);

      // Problemas identificados
      const issues = this.identifyProductIssues(productReviews);

      return {
        productId: product.id,
        productName: product.name,
        totalReviews: productReviews.length,
        averageRating: productReviews.length > 0 
          ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length 
          : 0,
        ratingDistribution,
        sentimentDistribution,
        keywords,
        trends,
        issues
      };
    });
  }

  // Gerar relatórios de reviews
  private generateReviewReports(reviews: Review[]): ReviewReport[] {
    return reviews.map(review => {
      const product = this.products.find(p => p.id === review.productId);
      
      return {
        reviewId: review.id,
        productName: product?.name || 'Produto não encontrado',
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        sentiment: this.analyzeSentiment(review),
        category: this.categorizeReview(review.comment),
        keywords: this.extractKeywords([review]).map(k => k.keyword),
        isUrgent: review.rating <= 2 || this.containsUrgentKeywords(review.comment)
      };
    });
  }

  // Gerar tendências
  private generateTrends(reviews: Review[]): TrendData[] {
    const periods = this.generateTimePeriods(reviews);
    
    return periods.map(period => {
      const periodReviews = reviews.filter(review => 
        review.date >= period.start && review.date <= period.end
      );
      
      const totalReviews = periodReviews.length;
      const averageRating = totalReviews > 0 
        ? periodReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      const positiveReviews = periodReviews.filter(review => this.analyzeSentiment(review) === 'positive').length;
      const negativeReviews = periodReviews.filter(review => this.analyzeSentiment(review) === 'negative').length;
      
      const positivePercentage = totalReviews > 0 ? (positiveReviews / totalReviews) * 100 : 0;
      const negativePercentage = totalReviews > 0 ? (negativeReviews / totalReviews) * 100 : 0;

      return {
        period: period.label,
        metrics: {
          totalReviews,
          averageRating,
          positivePercentage,
          negativePercentage
        },
        changes: {
          reviews: 0, // Calcular mudança em relação ao período anterior
          rating: 0,
          sentiment: 0
        }
      };
    });
  }

  // Gerar comparações
  private generateComparisons(reviews: Review[]): ComparisonData[] {
    const currentPeriod = reviews.filter(review => {
      const daysDiff = (Date.now() - review.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });
    
    const previousPeriod = reviews.filter(review => {
      const daysDiff = (Date.now() - review.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 30 && daysDiff <= 60;
    });

    const comparisons: ComparisonData[] = [
      this.calculateComparison('Total de Reviews', currentPeriod.length, previousPeriod.length),
      this.calculateComparison('Avaliação Média', 
        this.calculateAverageRating(currentPeriod), 
        this.calculateAverageRating(previousPeriod)
      ),
      this.calculateComparison('Taxa de Satisfação',
        this.calculateSatisfactionRate(currentPeriod),
        this.calculateSatisfactionRate(previousPeriod)
      )
    ];

    return comparisons;
  }

  // Calcular comparação
  private calculateComparison(metric: string, current: number, previous: number): ComparisonData {
    const change = current - previous;
    const changePercentage = previous > 0 ? (change / previous) * 100 : 0;
    
    return {
      metric,
      current,
      previous,
      change,
      changePercentage,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }

  // Gerar insights
  private generateInsights(type: Report['type'], data: ReportData): ReportInsight[] {
    const insights: ReportInsight[] = [];

    // Insight baseado no tipo de relatório
    switch (type) {
      case 'complete':
        insights.push(...this.generateCompleteInsights(data));
        break;
      case 'sentiment':
        insights.push(...this.generateSentimentInsights(data));
        break;
      case 'trends':
        insights.push(...this.generateTrendInsights(data));
        break;
    }

    return insights;
  }

  // Gerar insights completos
  private generateCompleteInsights(data: ReportData): ReportInsight[] {
    const insights: ReportInsight[] = [];

    // Insight sobre satisfação geral
    if (data.summary.satisfactionScore >= 80) {
      insights.push({
        id: this.generateId(),
        type: 'positive',
        title: 'Alta Satisfação dos Clientes',
        description: `${data.summary.satisfactionScore.toFixed(1)}% dos clientes estão satisfeitos`,
        impact: 'high',
        confidence: 0.9,
        data: { satisfactionScore: data.summary.satisfactionScore },
        recommendations: ['Continue mantendo a qualidade', 'Use o feedback positivo em campanhas']
      });
    }

    // Insight sobre taxa de resposta
    if (data.summary.responseRate < 50) {
      insights.push({
        id: this.generateId(),
        type: 'warning',
        title: 'Baixa Taxa de Resposta',
        description: `Apenas ${data.summary.responseRate.toFixed(1)}% das reviews têm resposta`,
        impact: 'medium',
        confidence: 0.8,
        data: { responseRate: data.summary.responseRate },
        recommendations: ['Implemente respostas automáticas', 'Monitore reviews diariamente']
      });
    }

    return insights;
  }

  // Gerar insights de sentimento
  private generateSentimentInsights(data: ReportData): ReportInsight[] {
    const insights: ReportInsight[] = [];
    const sentimentDist = data.analytics.sentimentDistribution;
    const total = sentimentDist.positive + sentimentDist.neutral + sentimentDist.negative;

    if (sentimentDist.negative / total > 0.2) {
      insights.push({
        id: this.generateId(),
        type: 'negative',
        title: 'Alto Volume de Feedback Negativo',
        description: `${((sentimentDist.negative / total) * 100).toFixed(1)}% das avaliações são negativas`,
        impact: 'high',
        confidence: 0.85,
        data: { negativePercentage: (sentimentDist.negative / total) * 100 },
        recommendations: ['Investigue as causas dos problemas', 'Melhore o processo de qualidade']
      });
    }

    return insights;
  }

  // Gerar insights de tendências
  private generateTrendInsights(data: ReportData): ReportInsight[] {
    const insights: ReportInsight[] = [];

    // Analisar tendências
    if (data.trends.length >= 2) {
      const latest = data.trends[data.trends.length - 1];
      const previous = data.trends[data.trends.length - 2];

      if (latest.metrics.averageRating > previous.metrics.averageRating) {
        insights.push({
          id: this.generateId(),
          type: 'positive',
          title: 'Melhoria na Avaliação Média',
          description: 'Avaliação média aumentou de ' + previous.metrics.averageRating.toFixed(1) + ' para ' + latest.metrics.averageRating.toFixed(1),
          impact: 'medium',
          confidence: 0.8,
          data: { current: latest.metrics.averageRating, previous: previous.metrics.averageRating },
          recommendations: ['Continue as melhorias implementadas', 'Monitore a tendência']
        });
      }
    }

    return insights;
  }

  // Métodos auxiliares
  private analyzeSentiment(review: Review): 'positive' | 'neutral' | 'negative' {
    if (review.rating >= 4) return 'positive';
    if (review.rating <= 2) return 'negative';
    return 'neutral';
  }

  private extractKeywords(reviews: Review[]): { keyword: string; mentions: number; sentiment: 'positive' | 'neutral' | 'negative' }[] {
    const keywordCount: Record<string, { count: number; sentiments: string[] }> = {};
    
    reviews.forEach(review => {
      const words = review.comment.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      const sentiment = this.analyzeSentiment(review);
      
      words.forEach(word => {
        if (!keywordCount[word]) {
          keywordCount[word] = { count: 0, sentiments: [] };
        }
        keywordCount[word].count++;
        keywordCount[word].sentiments.push(sentiment);
      });
    });

    return Object.entries(keywordCount)
      .filter(([_, data]) => data.count >= 2)
      .map(([keyword, data]) => {
        const positiveCount = data.sentiments.filter(s => s === 'positive').length;
        const negativeCount = data.sentiments.filter(s => s === 'negative').length;
        
        let sentiment: 'positive' | 'neutral' | 'negative';
        if (positiveCount > negativeCount) {
          sentiment = 'positive';
        } else if (negativeCount > positiveCount) {
          sentiment = 'negative';
        } else {
          sentiment = 'neutral';
        }

        return { keyword, mentions: data.count, sentiment };
      })
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10);
  }

  private categorizeReview(comment: string): string {
    const commentLower = comment.toLowerCase();
    
    if (commentLower.includes('qualidade') || commentLower.includes('defeito')) return 'Qualidade';
    if (commentLower.includes('entrega') || commentLower.includes('frete')) return 'Entrega';
    if (commentLower.includes('atendimento') || commentLower.includes('suporte')) return 'Atendimento';
    if (commentLower.includes('preço') || commentLower.includes('valor')) return 'Preço';
    
    return 'Outros';
  }

  private containsUrgentKeywords(comment: string): boolean {
    const urgentWords = ['defeito', 'quebrado', 'danificado', 'péssimo', 'ruim'];
    return urgentWords.some(word => comment.toLowerCase().includes(word));
  }

  private generateTimePeriods(reviews: Review[]): { start: Date; end: Date; label: string }[] {
    if (reviews.length === 0) return [];

    const sortedReviews = reviews.sort((a, b) => a.date.getTime() - b.date.getTime());
    const startDate = sortedReviews[0].date;
    const endDate = sortedReviews[sortedReviews.length - 1].date;
    
    const periods = [];
    const interval = (endDate.getTime() - startDate.getTime()) / 6; // 6 períodos
    
    for (let i = 0; i < 6; i++) {
      const periodStart = new Date(startDate.getTime() + i * interval);
      const periodEnd = new Date(startDate.getTime() + (i + 1) * interval);
      
      periods.push({
        start: periodStart,
        end: periodEnd,
        label: periodStart.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      });
    }

    return periods;
  }

  private calculateProductTrends(reviews: Review[]): { period: string; rating: number; reviews: number }[] {
    const periods = this.generateTimePeriods(reviews);
    
    return periods.map(period => {
      const periodReviews = reviews.filter(review => 
        review.date >= period.start && review.date <= period.end
      );
      
      return {
        period: period.label,
        rating: periodReviews.length > 0 
          ? periodReviews.reduce((sum, review) => sum + review.rating, 0) / periodReviews.length 
          : 0,
        reviews: periodReviews.length
      };
    });
  }

  private identifyProductIssues(reviews: Review[]): { type: string; count: number; percentage: number }[] {
    const issues: Record<string, number> = {};
    
    reviews.forEach(review => {
      if (review.rating <= 2) {
        const category = this.categorizeReview(review.comment);
        issues[category] = (issues[category] || 0) + 1;
      }
    });

    const total = reviews.length;
    
    return Object.entries(issues).map(([type, count]) => ({
      type,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  }

  private calculateAverageRating(reviews: Review[]): number {
    return reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;
  }

  private calculateSatisfactionRate(reviews: Review[]): number {
    const satisfied = reviews.filter(review => review.rating >= 4).length;
    return reviews.length > 0 ? (satisfied / reviews.length) * 100 : 0;
  }

  private calculateMetadata(startTime: number, data: { products: Product[]; reviews: Review[] }): ReportMetadata {
    return {
      generatedBy: 'ReviewAI Analytics',
      dataSource: 'Mercado Livre API',
      filters: {},
      processingTime: Date.now() - startTime,
      dataPoints: data.reviews.length,
      version: '1.0.0'
    };
  }

  private formatPeriod(period: Report['period']): string {
    switch (period) {
      case '7d': return 'Últimos 7 dias';
      case '30d': return 'Últimos 30 dias';
      case '90d': return 'Últimos 90 dias';
      case '1y': return 'Último ano';
      default: return 'Período personalizado';
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Obter relatórios
  getReports(): Report[] {
    return [...this.reports];
  }

  // Obter relatório por ID
  getReport(reportId: string): Report | undefined {
    return this.reports.find(report => report.id === reportId);
  }

  // Deletar relatório
  deleteReport(reportId: string): void {
    this.reports = this.reports.filter(report => report.id !== reportId);
  }

  // Exportar relatório
  async exportReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<void> {
    const report = this.getReport(reportId);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    // Simular exportação
    const content = this.formatReportForExport(report, format);
    
    const blob = new Blob([content], { 
      type: format === 'pdf' ? 'application/pdf' : 
            format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            'text/csv'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private formatReportForExport(report: Report, format: string): string {
    // Implementar formatação específica para cada formato
    return `Relatório: ${report.name}\nGerado em: ${report.createdAt.toLocaleDateString('pt-BR')}\n\nDados do relatório...`;
  }
}

export const reportService = new ReportService(); 