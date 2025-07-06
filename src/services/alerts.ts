import { Review, Product } from '../contexts/DataContext';

export interface Alert {
  id: string;
  type: 'critical' | 'urgent' | 'negative' | 'warning';
  title: string;
  description: string;
  productName: string;
  productId: string;
  reviewId: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  isRead: boolean;
  isResolved: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'quality' | 'delivery' | 'service' | 'price' | 'other';
}

export interface AlertConfig {
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  criticalEnabled: boolean;
  urgentEnabled: boolean;
  negativeEnabled: boolean;
  warningEnabled: boolean;
  emailAddress: string;
  whatsappNumber: string;
  minRating: number;
  keywords: string[];
  soundEnabled: boolean;
  autoResolve: boolean;
  autoResolveHours: number;
  notificationFrequency: 'immediate' | 'hourly' | 'daily';
}

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: {
    type: 'rating' | 'keyword' | 'sentiment' | 'frequency';
    operator: 'equals' | 'less_than' | 'greater_than' | 'contains' | 'not_contains';
    value: string | number;
  }[];
  actions: {
    type: 'create_alert' | 'send_email' | 'send_whatsapp' | 'webhook';
    config: Record<string, any>;
  }[];
  priority: 'high' | 'medium' | 'low';
}

class AlertService {
  private alerts: Alert[] = [];
  private config: AlertConfig = {
    emailEnabled: true,
    whatsappEnabled: true,
    pushEnabled: false,
    criticalEnabled: true,
    urgentEnabled: true,
    negativeEnabled: true,
    warningEnabled: false,
    emailAddress: '',
    whatsappNumber: '',
    minRating: 3,
    keywords: ['defeito', 'problema', 'ruim', 'péssimo', 'quebrado', 'danificado'],
    soundEnabled: true,
    autoResolve: true,
    autoResolveHours: 24,
    notificationFrequency: 'immediate'
  };

  private rules: AlertRule[] = [
    {
      id: 'critical-rating',
      name: 'Avaliações Críticas (1-2 estrelas)',
      enabled: true,
      conditions: [
        {
          type: 'rating',
          operator: 'less_than',
          value: 3
        }
      ],
      actions: [
        {
          type: 'create_alert',
          config: { alertType: 'critical' }
        }
      ],
      priority: 'high'
    },
    {
      id: 'negative-keywords',
      name: 'Palavras-chave Negativas',
      enabled: true,
      conditions: [
        {
          type: 'keyword',
          operator: 'contains',
          value: 'defeito,problema,ruim,péssimo'
        }
      ],
      actions: [
        {
          type: 'create_alert',
          config: { alertType: 'urgent' }
        }
      ],
      priority: 'medium'
    },
    {
      id: 'multiple-complaints',
      name: 'Múltiplas Reclamações',
      enabled: true,
      conditions: [
        {
          type: 'frequency',
          operator: 'greater_than',
          value: 5
        }
      ],
      actions: [
        {
          type: 'create_alert',
          config: { alertType: 'warning' }
        }
      ],
      priority: 'medium'
    }
  ];

  private listeners: ((alert: Alert) => void)[] = [];

  // Configurar o serviço
  setConfig(config: Partial<AlertConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Obter configuração atual
  getConfig(): AlertConfig {
    return { ...this.config };
  }

  // Adicionar regra personalizada
  addRule(rule: AlertRule) {
    this.rules.push(rule);
  }

  // Remover regra
  removeRule(ruleId: string) {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  // Obter todas as regras
  getRules(): AlertRule[] {
    return [...this.rules];
  }

  // Processar nova review
  processReview(review: Review, product: Product): Alert[] {
    const newAlerts: Alert[] = [];

    // Verificar cada regra
    this.rules.forEach(rule => {
      if (!rule.enabled) return;

      const shouldTrigger = this.evaluateRule(rule, review, product);
      
      if (shouldTrigger) {
        const alert = this.createAlert(rule, review, product);
        if (alert) {
          newAlerts.push(alert);
          this.alerts.push(alert);
          this.notifyListeners(alert);
        }
      }
    });

    return newAlerts;
  }

  // Avaliar se uma regra deve ser acionada
  private evaluateRule(rule: AlertRule, review: Review, product: Product): boolean {
    return rule.conditions.every(condition => {
      switch (condition.type) {
        case 'rating':
          return this.evaluateRatingCondition(condition, review.rating);
        case 'keyword':
          return this.evaluateKeywordCondition(condition, review.comment);
        case 'sentiment':
          return this.evaluateSentimentCondition(condition, review);
        case 'frequency':
          return this.evaluateFrequencyCondition(condition, product.id);
        default:
          return false;
      }
    });
  }

  private evaluateRatingCondition(condition: any, rating: number): boolean {
    switch (condition.operator) {
      case 'equals':
        return rating === condition.value;
      case 'less_than':
        return rating < condition.value;
      case 'greater_than':
        return rating > condition.value;
      default:
        return false;
    }
  }

  private evaluateKeywordCondition(condition: any, comment: string): boolean {
    const keywords = condition.value.split(',').map((k: string) => k.trim().toLowerCase());
    const commentLower = comment.toLowerCase();
    
    switch (condition.operator) {
      case 'contains':
        return keywords.some(keyword => commentLower.includes(keyword));
      case 'not_contains':
        return !keywords.some(keyword => commentLower.includes(keyword));
      default:
        return false;
    }
  }

  private evaluateSentimentCondition(condition: any, review: Review): boolean {
    const sentiment = this.analyzeSentiment(review);
    
    switch (condition.operator) {
      case 'equals':
        return sentiment === condition.value;
      default:
        return false;
    }
  }

  private evaluateFrequencyCondition(condition: any, productId: string): boolean {
    // Contar reviews negativas do produto nas últimas 24h
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentNegativeReviews = this.alerts.filter(alert => 
      alert.productId === productId && 
      alert.date >= last24h &&
      (alert.type === 'critical' || alert.type === 'urgent')
    ).length;
    
    switch (condition.operator) {
      case 'greater_than':
        return recentNegativeReviews > condition.value;
      default:
        return false;
    }
  }

  // Analisar sentimento da review
  private analyzeSentiment(review: Review): 'positive' | 'neutral' | 'negative' {
    if (review.rating >= 4) return 'positive';
    if (review.rating <= 2) return 'negative';
    return 'neutral';
  }

  // Criar alerta baseado na regra
  private createAlert(rule: AlertRule, review: Review, product: Product): Alert | null {
    const action = rule.actions.find(a => a.type === 'create_alert');
    if (!action) return null;

    const alertType = action.config.alertType as Alert['type'];
    const category = this.categorizeAlert(review.comment);
    
    const alert: Alert = {
      id: this.generateId(),
      type: alertType,
      title: this.generateAlertTitle(alertType, product.name),
      description: this.generateAlertDescription(alertType, review),
      productName: product.name,
      productId: product.id,
      reviewId: review.id,
      author: review.author,
      rating: review.rating,
      comment: review.comment,
      date: new Date(),
      isRead: false,
      isResolved: false,
      priority: rule.priority,
      category
    };

    return alert;
  }

  // Categorizar alerta baseado no conteúdo
  private categorizeAlert(comment: string): Alert['category'] {
    const commentLower = comment.toLowerCase();
    
    if (commentLower.includes('qualidade') || commentLower.includes('defeito') || commentLower.includes('quebrado')) {
      return 'quality';
    }
    if (commentLower.includes('entrega') || commentLower.includes('atraso') || commentLower.includes('frete')) {
      return 'delivery';
    }
    if (commentLower.includes('atendimento') || commentLower.includes('suporte') || commentLower.includes('cliente')) {
      return 'service';
    }
    if (commentLower.includes('preço') || commentLower.includes('caro') || commentLower.includes('barato')) {
      return 'price';
    }
    
    return 'other';
  }

  // Gerar título do alerta
  private generateAlertTitle(type: Alert['type'], productName: string): string {
    switch (type) {
      case 'critical':
        return `Avaliação Crítica - ${productName}`;
      case 'urgent':
        return `Alerta Urgente - ${productName}`;
      case 'negative':
        return `Feedback Negativo - ${productName}`;
      case 'warning':
        return `Aviso - ${productName}`;
      default:
        return `Alerta - ${productName}`;
    }
  }

  // Gerar descrição do alerta
  private generateAlertDescription(type: Alert['type'], review: Review): string {
    switch (type) {
      case 'critical':
        return `Cliente deu ${review.rating} estrelas e relatou problema grave`;
      case 'urgent':
        return `Requer atenção imediata - ${review.rating} estrelas`;
      case 'negative':
        return `Avaliação negativa detectada - ${review.rating} estrelas`;
      case 'warning':
        return `Tendência negativa observada`;
      default:
        return `Nova avaliação requer atenção`;
    }
  }

  // Obter todos os alertas
  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  // Obter alertas filtrados
  getFilteredAlerts(filters: {
    type?: Alert['type'];
    status?: 'all' | 'unread' | 'resolved' | 'pending';
    category?: Alert['category'];
    priority?: Alert['priority'];
  }): Alert[] {
    return this.alerts.filter(alert => {
      if (filters.type && alert.type !== filters.type) return false;
      if (filters.status) {
        switch (filters.status) {
          case 'unread':
            if (alert.isRead) return false;
            break;
          case 'resolved':
            if (!alert.isResolved) return false;
            break;
          case 'pending':
            if (alert.isResolved) return false;
            break;
        }
      }
      if (filters.category && alert.category !== filters.category) return false;
      if (filters.priority && alert.priority !== filters.priority) return false;
      return true;
    });
  }

  // Marcar alerta como lido
  markAsRead(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  // Marcar alerta como resolvido
  markAsResolved(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isResolved = true;
    }
  }

  // Marcar todos como lidos
  markAllAsRead() {
    this.alerts.forEach(alert => {
      alert.isRead = true;
    });
  }

  // Deletar alerta
  deleteAlert(alertId: string) {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  // Limpar alertas antigos
  clearOldAlerts(daysOld: number = 30) {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.date >= cutoffDate);
  }

  // Obter estatísticas dos alertas
  getAlertStats() {
    const total = this.alerts.length;
    const unread = this.alerts.filter(alert => !alert.isRead).length;
    const critical = this.alerts.filter(alert => alert.type === 'critical').length;
    const pending = this.alerts.filter(alert => !alert.isResolved).length;
    
    return {
      total,
      unread,
      critical,
      pending,
      resolved: total - pending
    };
  }

  // Adicionar listener para novos alertas
  addListener(listener: (alert: Alert) => void) {
    this.listeners.push(listener);
  }

  // Remover listener
  removeListener(listener: (alert: Alert) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notificar listeners
  private notifyListeners(alert: Alert) {
    this.listeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        console.error('Erro ao notificar listener:', error);
      }
    });
  }

  // Enviar notificação por email
  async sendEmailNotification(alert: Alert) {
    if (!this.config.emailEnabled || !this.config.emailAddress) return;

    // Simular envio de email
    console.log('Enviando email para:', this.config.emailAddress);
    console.log('Assunto:', alert.title);
    console.log('Conteúdo:', alert.description);
    
    // Aqui você integraria com um serviço de email real
    // Por exemplo: SendGrid, AWS SES, etc.
  }

  // Enviar notificação por WhatsApp
  async sendWhatsAppNotification(alert: Alert) {
    if (!this.config.whatsappEnabled || !this.config.whatsappNumber) return;

    // Simular envio por WhatsApp
    console.log('Enviando WhatsApp para:', this.config.whatsappNumber);
    console.log('Mensagem:', `${alert.title}\n\n${alert.description}`);
    
    // Aqui você integraria com a API do WhatsApp Business
  }

  // Enviar notificação push
  async sendPushNotification(alert: Alert) {
    if (!this.config.pushEnabled) return;

    // Simular notificação push
    console.log('Enviando push notification:', alert.title);
    
    // Aqui você integraria com um serviço de push notifications
    // Por exemplo: Firebase Cloud Messaging, OneSignal, etc.
  }

  // Processar notificações baseado na frequência configurada
  async processNotifications() {
    const pendingAlerts = this.alerts.filter(alert => !alert.isRead);
    
    if (this.config.notificationFrequency === 'immediate') {
      // Processar imediatamente
      for (const alert of pendingAlerts) {
        await this.sendAllNotifications(alert);
      }
    } else if (this.config.notificationFrequency === 'hourly') {
      // Processar a cada hora (simulado)
      console.log('Processando notificações por hora...');
    } else if (this.config.notificationFrequency === 'daily') {
      // Processar diariamente (simulado)
      console.log('Processando notificações diárias...');
    }
  }

  // Enviar todas as notificações para um alerta
  private async sendAllNotifications(alert: Alert) {
    try {
      await Promise.all([
        this.sendEmailNotification(alert),
        this.sendWhatsAppNotification(alert),
        this.sendPushNotification(alert)
      ]);
    } catch (error) {
      console.error('Erro ao enviar notificações:', error);
    }
  }

  // Auto-resolver alertas antigos
  autoResolveOldAlerts() {
    if (!this.config.autoResolve) return;

    const cutoffDate = new Date(Date.now() - this.config.autoResolveHours * 60 * 60 * 1000);
    this.alerts.forEach(alert => {
      if (!alert.isResolved && alert.date < cutoffDate) {
        alert.isResolved = true;
      }
    });
  }

  // Gerar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const alertService = new AlertService(); 