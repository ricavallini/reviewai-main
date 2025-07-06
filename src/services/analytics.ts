import { Product, Review } from '../contexts/DataContext';

export interface AnalyticsData {
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  trends: {
    period: string;
    positive: number;
    neutral: number;
    negative: number;
    total: number;
  }[];
  keywords: {
    keyword: string;
    mentions: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    trend: 'up' | 'down' | 'stable';
  }[];
  insights: {
    type: 'positive' | 'negative' | 'opportunity' | 'warning';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  metrics: {
    totalReviews: number;
    averageRating: number;
    responseRate: number;
    satisfactionScore: number;
    growthRate: number;
  };
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  period: '7d' | '30d' | '90d' | '1y';
  includeCharts: boolean;
  includeRawData: boolean;
  includeInsights: boolean;
  email?: string;
}

class AnalyticsService {
  private reviews: Review[] = [];
  private products: Product[] = [];

  setData(reviews: Review[], products: Product[]) {
    this.reviews = reviews;
    this.products = products;
  }

  // Análise de sentimento baseada no rating e palavras-chave
  private analyzeSentiment(review: Review): 'positive' | 'neutral' | 'negative' {
    // Baseado no rating
    if (review.rating >= 4) return 'positive';
    if (review.rating <= 2) return 'negative';
    return 'neutral';
  }

  // Extrair palavras-chave dos comentários
  private extractKeywords(text: string): string[] {
    const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'e', 'é', 'de', 'do', 'da', 'em', 'com', 'para', 'por', 'que', 'não', 'se', 'mais', 'muito', 'bem', 'mal', 'sim', 'não', 'já', 'ainda', 'sempre', 'nunca', 'também', 'só', 'apenas', 'muito', 'pouco', 'grande', 'pequeno', 'bom', 'ruim', 'ótimo', 'péssimo'];
    
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
  }

  // Calcular distribuição de sentimento
  getSentimentDistribution(): AnalyticsData['sentimentDistribution'] {
    const sentiments = this.reviews.map(review => this.analyzeSentiment(review));
    
    return {
      positive: sentiments.filter(s => s === 'positive').length,
      neutral: sentiments.filter(s => s === 'neutral').length,
      negative: sentiments.filter(s => s === 'negative').length
    };
  }

  // Calcular distribuição de ratings
  getRatingDistribution(): AnalyticsData['ratingDistribution'] {
    const distribution = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    
    this.reviews.forEach(review => {
      distribution[review.rating.toString() as keyof typeof distribution]++;
    });
    
    return distribution;
  }

  // Calcular tendências por período
  getTrends(period: '7d' | '30d' | '90d' | '1y'): AnalyticsData['trends'] {
    const now = new Date();
    const periods = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = periods[period];
    const trends = [];
    
    for (let i = days; i >= 0; i -= Math.ceil(days / 6)) {
      const startDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const endDate = new Date(now.getTime() - (i - Math.ceil(days / 6)) * 24 * 60 * 60 * 1000);
      
      const periodReviews = this.reviews.filter(review => 
        review.date >= startDate && review.date <= endDate
      );
      
      const sentiments = periodReviews.map(review => this.analyzeSentiment(review));
      
      trends.push({
        period: startDate.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
        positive: sentiments.filter(s => s === 'positive').length,
        neutral: sentiments.filter(s => s === 'neutral').length,
        negative: sentiments.filter(s => s === 'negative').length,
        total: periodReviews.length
      });
    }
    
    return trends;
  }

  // Extrair palavras-chave mais mencionadas
  getKeywords(): AnalyticsData['keywords'] {
    const keywordCount: Record<string, { count: number; sentiments: string[] }> = {};
    
    this.reviews.forEach(review => {
      const keywords = this.extractKeywords(review.comment);
      const sentiment = this.analyzeSentiment(review);
      
      keywords.forEach(keyword => {
        if (!keywordCount[keyword]) {
          keywordCount[keyword] = { count: 0, sentiments: [] };
        }
        keywordCount[keyword].count++;
        keywordCount[keyword].sentiments.push(sentiment);
      });
    });
    
    return Object.entries(keywordCount)
      .filter(([_, data]) => data.count >= 3) // Mínimo 3 menções
      .map(([keyword, data]) => {
        const positiveCount = data.sentiments.filter(s => s === 'positive').length;
        const negativeCount = data.sentiments.filter(s => s === 'negative').length;
        const neutralCount = data.sentiments.filter(s => s === 'neutral').length;
        
        let sentiment: 'positive' | 'neutral' | 'negative';
        if (positiveCount > negativeCount && positiveCount > neutralCount) {
          sentiment = 'positive';
        } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
          sentiment = 'negative';
        } else {
          sentiment = 'neutral';
        }
        
        // Calcular tendência (simplificado)
        const trend: 'up' | 'down' | 'stable' = 'stable';
        
        return {
          keyword,
          mentions: data.count,
          sentiment,
          trend
        };
      })
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 10); // Top 10 keywords
  }

  // Gerar insights automáticos
  generateInsights(): AnalyticsData['insights'] {
    const insights: AnalyticsData['insights'] = [];
    const sentimentDist = this.getSentimentDistribution();
    const ratingDist = this.getRatingDistribution();
    const keywords = this.getKeywords();
    
    const totalReviews = this.reviews.length;
    const positivePercentage = (sentimentDist.positive / totalReviews) * 100;
    const negativePercentage = (sentimentDist.negative / totalReviews) * 100;
    
    // Insight sobre satisfação geral
    if (positivePercentage >= 80) {
      insights.push({
        type: 'positive',
        title: 'Alta Satisfação dos Clientes',
        description: `${positivePercentage.toFixed(1)}% das avaliações são positivas. Continue mantendo a qualidade!`,
        impact: 'high'
      });
    } else if (negativePercentage >= 20) {
      insights.push({
        type: 'negative',
        title: 'Atenção: Aumento de Reclamações',
        description: `${negativePercentage.toFixed(1)}% das avaliações são negativas. Considere investigar os problemas.`,
        impact: 'high'
      });
    }
    
    // Insight sobre palavras-chave negativas
    const negativeKeywords = keywords.filter(k => k.sentiment === 'negative');
    if (negativeKeywords.length > 0) {
      const topNegative = negativeKeywords[0];
      insights.push({
        type: 'warning',
        title: 'Palavra-chave Negativa Detectada',
        description: `"${topNegative.keyword}" aparece ${topNegative.mentions} vezes com sentimento negativo.`,
        impact: 'medium'
      });
    }
    
    // Insight sobre oportunidades
    const positiveKeywords = keywords.filter(k => k.sentiment === 'positive');
    if (positiveKeywords.length > 0) {
      const topPositive = positiveKeywords[0];
      insights.push({
        type: 'opportunity',
        title: 'Diferencial Competitivo Identificado',
        description: `"${topPositive.keyword}" é muito elogiado pelos clientes. Use isso em suas campanhas!`,
        impact: 'medium'
      });
    }
    
    // Insight sobre distribuição de ratings
    const fiveStarPercentage = (ratingDist['5'] / totalReviews) * 100;
    if (fiveStarPercentage >= 60) {
      insights.push({
        type: 'positive',
        title: 'Excelente Avaliação 5 Estrelas',
        description: `${fiveStarPercentage.toFixed(1)}% dos clientes deram 5 estrelas. Produto muito bem avaliado!`,
        impact: 'high'
      });
    }
    
    return insights;
  }

  // Calcular métricas gerais
  getMetrics(): AnalyticsData['metrics'] {
    const totalReviews = this.reviews.length;
    const averageRating = totalReviews > 0 
      ? this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;
    
    // Simular taxa de resposta (baseado em reviews com resposta)
    const reviewsWithResponse = this.reviews.filter(review => review.hasResponse).length;
    const responseRate = totalReviews > 0 ? (reviewsWithResponse / totalReviews) * 100 : 0;
    
    // Calcular score de satisfação (baseado em ratings 4-5 estrelas)
    const satisfiedReviews = this.reviews.filter(review => review.rating >= 4).length;
    const satisfactionScore = totalReviews > 0 ? (satisfiedReviews / totalReviews) * 100 : 0;
    
    // Simular taxa de crescimento (baseado em reviews recentes)
    const recentReviews = this.reviews.filter(review => {
      const daysDiff = (Date.now() - review.date.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    }).length;
    
    const growthRate = totalReviews > 0 ? (recentReviews / totalReviews) * 100 : 0;
    
    return {
      totalReviews,
      averageRating,
      responseRate,
      satisfactionScore,
      growthRate
    };
  }

  // Gerar relatório completo
  generateReport(period: '7d' | '30d' | '90d' | '1y'): AnalyticsData {
    return {
      sentimentDistribution: this.getSentimentDistribution(),
      ratingDistribution: this.getRatingDistribution(),
      trends: this.getTrends(period),
      keywords: this.getKeywords(),
      insights: this.generateInsights(),
      metrics: this.getMetrics()
    };
  }

  // Exportar relatório
  async exportReport(options: ExportOptions): Promise<void> {
    const report = this.generateReport(options.period);
    
    // Simular geração de arquivo
    const content = this.formatReportForExport(report, options);
    
    // Criar blob e download
    const blob = new Blob([content], { 
      type: options.format === 'pdf' ? 'application/pdf' : 
            options.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
            'text/csv'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${options.period}.${options.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Enviar relatório por email
  async sendReportByEmail(options: ExportOptions): Promise<void> {
    if (!options.email) {
      throw new Error('Email é obrigatório para envio');
    }
    
    // Simular envio por email
    console.log('Enviando relatório para:', options.email);
    
    // Aqui você integraria com um serviço de email real
    // Por exemplo: SendGrid, AWS SES, etc.
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Relatório enviado com sucesso!');
  }

  private formatReportForExport(report: AnalyticsData, options: ExportOptions): string {
    if (options.format === 'csv') {
      return this.formatAsCSV(report);
    } else if (options.format === 'excel') {
      return this.formatAsExcel(report);
    } else {
      return this.formatAsPDF(report);
    }
  }

  private formatAsCSV(report: AnalyticsData): string {
    let csv = 'Métrica,Valor\n';
    csv += `Total de Reviews,${report.metrics.totalReviews}\n`;
    csv += `Avaliação Média,${report.metrics.averageRating.toFixed(2)}\n`;
    csv += `Taxa de Resposta,${report.metrics.responseRate.toFixed(1)}%\n`;
    csv += `Score de Satisfação,${report.metrics.satisfactionScore.toFixed(1)}%\n`;
    csv += `Taxa de Crescimento,${report.metrics.growthRate.toFixed(1)}%\n\n`;
    
    csv += 'Sentimento,Quantidade\n';
    csv += `Positivo,${report.sentimentDistribution.positive}\n`;
    csv += `Neutro,${report.sentimentDistribution.neutral}\n`;
    csv += `Negativo,${report.sentimentDistribution.negative}\n\n`;
    
    csv += 'Palavra-chave,Menções,Sentimento\n';
    report.keywords.forEach(keyword => {
      csv += `${keyword.keyword},${keyword.mentions},${keyword.sentiment}\n`;
    });
    
    return csv;
  }

  private formatAsExcel(report: AnalyticsData): string {
    // Simular formato Excel (na prática, você usaria uma biblioteca como xlsx)
    return this.formatAsCSV(report);
  }

  private formatAsPDF(report: AnalyticsData): string {
    // Simular formato PDF (na prática, você usaria uma biblioteca como jsPDF)
    return `Relatório de Analytics\n\nMétricas:\n- Total de Reviews: ${report.metrics.totalReviews}\n- Avaliação Média: ${report.metrics.averageRating.toFixed(2)}\n- Taxa de Resposta: ${report.metrics.responseRate.toFixed(1)}%\n\nInsights:\n${report.insights.map(insight => `- ${insight.title}: ${insight.description}`).join('\n')}`;
  }
}

export const analyticsService = new AnalyticsService(); 