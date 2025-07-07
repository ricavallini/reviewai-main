import { analyticsService } from './analytics';
import { alertService } from './alerts';
import { reportService } from './reports';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
  usage: UserUsage;
  integrations: UserIntegrations;
}

export interface UserPreferences {
  language: 'pt-BR' | 'en-US' | 'es-ES';
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  currency: 'BRL' | 'USD' | 'EUR';
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
  reports: ReportPreferences;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    address: string;
    critical: boolean;
    weekly: boolean;
    monthly: boolean;
    marketing: boolean;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    critical: boolean;
    daily: boolean;
  };
  push: {
    enabled: boolean;
    critical: boolean;
    updates: boolean;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
}

export interface DashboardPreferences {
  defaultView: 'overview' | 'analytics' | 'products' | 'alerts';
  widgets: {
    id: string;
    enabled: boolean;
    position: number;
    size: 'small' | 'medium' | 'large';
  }[];
  refreshInterval: number; // seconds
  autoRefresh: boolean;
}

export interface ReportPreferences {
  defaultPeriod: '7d' | '30d' | '90d' | '1y';
  defaultFormat: 'pdf' | 'excel' | 'csv';
  autoGenerate: boolean;
  autoEmail: boolean;
  emailAddress: string;
  schedule: {
    weekly: boolean;
    monthly: boolean;
    custom: string;
  };
}

export interface UserUsage {
  reviews: {
    total: number;
    thisMonth: number;
    limit: number;
  };
  products: {
    total: number;
    thisMonth: number;
    limit: number;
  };
  apiCalls: {
    total: number;
    thisMonth: number;
    limit: number;
  };
  storage: {
    used: number; // MB
    limit: number; // MB
  };
  features: {
    analytics: boolean;
    alerts: boolean;
    reports: boolean;
    api: boolean;
    integrations: boolean;
  };
}

export interface UserIntegrations {
  mercadolivre: {
    connected: boolean;
    lastSync: Date | null;
    productsCount: number;
    reviewsCount: number;
  };
  email: {
    connected: boolean;
    provider: 'gmail' | 'outlook' | 'custom';
  };
  whatsapp: {
    connected: boolean;
    verified: boolean;
  };
}

export interface UserActivity {
  id: string;
  type: 'login' | 'logout' | 'sync' | 'export' | 'report' | 'alert' | 'settings';
  description: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

class UserService {
  private currentUser: UserProfile | null = null;
  private activities: UserActivity[] = [];

  // Inicializar usuário padrão para desenvolvimento
  initializeDefaultUser(): UserProfile {
    const defaultUser: UserProfile = {
      id: '1',
      name: 'Usuário Demo',
      email: 'demo@reviewai.com',
      company: 'ReviewAI Demo',
      phone: '+55 (11) 99999-9999',
      bio: 'Usuário de demonstração do ReviewAI',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      plan: 'premium',
      status: 'active',
      isAdmin: false,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date(),
      preferences: {
        language: 'pt-BR',
        theme: 'light',
        timezone: 'America/Sao_Paulo',
        dateFormat: 'DD/MM/YYYY',
        currency: 'BRL',
        notifications: {
          email: {
            enabled: true,
            address: 'demo@reviewai.com',
            critical: true,
            weekly: true,
            monthly: false,
            marketing: false
          },
          whatsapp: {
            enabled: true,
            number: '+5511999999999',
            critical: true,
            daily: false
          },
          push: {
            enabled: false,
            critical: true,
            updates: false
          },
          inApp: {
            enabled: true,
            sound: true,
            desktop: true
          }
        },
        dashboard: {
          defaultView: 'overview',
          widgets: [
            { id: 'stats', enabled: true, position: 0, size: 'medium' },
            { id: 'chart', enabled: true, position: 1, size: 'large' },
            { id: 'alerts', enabled: true, position: 2, size: 'medium' },
            { id: 'recent', enabled: true, position: 3, size: 'small' }
          ],
          refreshInterval: 30,
          autoRefresh: true
        },
        reports: {
          defaultPeriod: '30d',
          defaultFormat: 'pdf',
          autoGenerate: false,
          autoEmail: false,
          emailAddress: 'demo@reviewai.com',
          schedule: {
            weekly: false,
            monthly: false,
            custom: ''
          }
        }
      },
      usage: {
        reviews: {
          total: 1250,
          thisMonth: 89,
          limit: 10000
        },
        products: {
          total: 15,
          thisMonth: 3,
          limit: 100
        },
        apiCalls: {
          total: 5420,
          thisMonth: 320,
          limit: 50000
        },
        storage: {
          used: 45.2,
          limit: 1000
        },
        features: {
          analytics: true,
          alerts: true,
          reports: true,
          api: true,
          integrations: true
        }
      },
      integrations: {
        mercadolivre: {
          connected: false,
          lastSync: null,
          productsCount: 0,
          reviewsCount: 0
        },
        email: {
          connected: false,
          provider: 'gmail'
        },
        whatsapp: {
          connected: false,
          verified: false
        }
      }
    };

    this.currentUser = defaultUser;
    return defaultUser;
  }

  // Obter usuário atual
  getCurrentUser(): UserProfile | null {
    if (!this.currentUser) {
      return this.initializeDefaultUser();
    }
    return this.currentUser;
  }

  // Atualizar perfil do usuário
  updateProfile(updates: Partial<UserProfile>): UserProfile {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser = { ...this.currentUser, ...updates };
    this.logActivity('settings', 'Perfil atualizado', { updates });
    
    return this.currentUser;
  }

  // Atualizar preferências
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.preferences = { ...this.currentUser.preferences, ...updates };
    this.logActivity('settings', 'Preferências atualizadas', { updates });
    
    return this.currentUser.preferences;
  }

  // Atualizar notificações
  updateNotificationPreferences(updates: Partial<NotificationPreferences>): NotificationPreferences {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.preferences.notifications = {
      ...this.currentUser.preferences.notifications,
      ...updates
    };
    
    this.logActivity('settings', 'Preferências de notificação atualizadas', { updates });
    
    return this.currentUser.preferences.notifications;
  }

  // Atualizar dashboard
  updateDashboardPreferences(updates: Partial<DashboardPreferences>): DashboardPreferences {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.preferences.dashboard = {
      ...this.currentUser.preferences.dashboard,
      ...updates
    };
    
    this.logActivity('settings', 'Preferências do dashboard atualizadas', { updates });
    
    return this.currentUser.preferences.dashboard;
  }

  // Atualizar relatórios
  updateReportPreferences(updates: Partial<ReportPreferences>): ReportPreferences {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.preferences.reports = {
      ...this.currentUser.preferences.reports,
      ...updates
    };
    
    this.logActivity('settings', 'Preferências de relatórios atualizadas', { updates });
    
    return this.currentUser.preferences.reports;
  }

  // Atualizar uso
  updateUsage(updates: Partial<UserUsage>): UserUsage {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.usage = { ...this.currentUser.usage, ...updates };
    return this.currentUser.usage;
  }

  // Atualizar integrações
  updateIntegrations(updates: Partial<UserIntegrations>): UserIntegrations {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    this.currentUser.integrations = { ...this.currentUser.integrations, ...updates };
    this.logActivity('settings', 'Integrações atualizadas', { updates });
    
    return this.currentUser.integrations;
  }

  // Verificar limites de uso
  checkUsageLimits(): {
    reviews: { used: number; limit: number; percentage: number };
    products: { used: number; limit: number; percentage: number };
    apiCalls: { used: number; limit: number; percentage: number };
    storage: { used: number; limit: number; percentage: number };
  } {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    const { usage } = this.currentUser;

    return {
      reviews: {
        used: usage.reviews.thisMonth,
        limit: usage.reviews.limit,
        percentage: (usage.reviews.thisMonth / usage.reviews.limit) * 100
      },
      products: {
        used: usage.products.thisMonth,
        limit: usage.products.limit,
        percentage: (usage.products.thisMonth / usage.products.limit) * 100
      },
      apiCalls: {
        used: usage.apiCalls.thisMonth,
        limit: usage.apiCalls.limit,
        percentage: (usage.apiCalls.thisMonth / usage.apiCalls.limit) * 100
      },
      storage: {
        used: usage.storage.used,
        limit: usage.storage.limit,
        percentage: (usage.storage.used / usage.storage.limit) * 100
      }
    };
  }

  // Verificar se o usuário pode usar uma funcionalidade
  canUseFeature(feature: keyof UserUsage['features']): boolean {
    if (!this.currentUser) {
      return false;
    }

    return this.currentUser.usage.features[feature];
  }

  // Verificar se o usuário pode usar mais recursos
  canUseMoreResources(resource: 'reviews' | 'products' | 'apiCalls' | 'storage'): boolean {
    const limits = this.checkUsageLimits();
    return limits[resource].percentage < 90; // 90% do limite
  }

  // Obter estatísticas de uso
  getUsageStats(): {
    totalReviews: number;
    totalProducts: number;
    totalApiCalls: number;
    storageUsed: number;
    storageLimit: number;
    plan: string;
    features: string[];
  } {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    const { usage, plan } = this.currentUser;
    const features = Object.entries(usage.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature);

    return {
      totalReviews: usage.reviews.total,
      totalProducts: usage.products.total,
      totalApiCalls: usage.apiCalls.total,
      storageUsed: usage.storage.used,
      storageLimit: usage.storage.limit,
      plan: this.getPlanName(plan),
      features
    };
  }

  // Obter nome do plano
  getPlanName(plan: UserProfile['plan']): string {
    switch (plan) {
      case 'free': return 'Gratuito';
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return 'Desconhecido';
    }
  }

  // Obter recursos do plano
  getPlanFeatures(plan: UserProfile['plan']): {
    reviews: number;
    products: number;
    apiCalls: number;
    storage: number;
    features: string[];
  } {
    switch (plan) {
      case 'free':
        return {
          reviews: 1000,
          products: 5,
          apiCalls: 1000,
          storage: 100,
          features: ['analytics']
        };
      case 'basic':
        return {
          reviews: 10000,
          products: 50,
          apiCalls: 10000,
          storage: 500,
          features: ['analytics', 'alerts']
        };
      case 'premium':
        return {
          reviews: 100000,
          products: 200,
          apiCalls: 100000,
          storage: 2000,
          features: ['analytics', 'alerts', 'reports', 'api']
        };
      case 'enterprise':
        return {
          reviews: 1000000,
          products: 1000,
          apiCalls: 1000000,
          storage: 10000,
          features: ['analytics', 'alerts', 'reports', 'api', 'integrations']
        };
      default:
        return {
          reviews: 0,
          products: 0,
          apiCalls: 0,
          storage: 0,
          features: []
        };
    }
  }

  // Registrar atividade
  logActivity(type: UserActivity['type'], description: string, metadata: Record<string, any> = {}): void {
    const activity: UserActivity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date(),
      metadata
    };

    this.activities.unshift(activity);
    
    // Manter apenas as últimas 100 atividades
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100);
    }
  }

  // Obter atividades
  getActivities(limit: number = 20): UserActivity[] {
    return this.activities.slice(0, limit);
  }

  // Obter atividades por tipo
  getActivitiesByType(type: UserActivity['type']): UserActivity[] {
    return this.activities.filter(activity => activity.type === type);
  }

  // Limpar atividades
  clearActivities(): void {
    this.activities = [];
  }

  // Exportar dados do usuário
  exportUserData(): {
    profile: UserProfile;
    activities: UserActivity[];
    analytics: any;
    alerts: any;
    reports: any;
  } {
    if (!this.currentUser) {
      throw new Error('Usuário não encontrado');
    }

    return {
      profile: this.currentUser,
      activities: this.activities,
      analytics: analyticsService.getMetrics(),
      alerts: alertService.getAlerts(),
      reports: reportService.getReports()
    };
  }

  // Importar dados do usuário
  importUserData(data: any): void {
    if (data.profile) {
      this.currentUser = data.profile;
    }
    if (data.activities) {
      this.activities = data.activities;
    }
    
    this.logActivity('settings', 'Dados importados', { dataSize: JSON.stringify(data).length });
  }

  // Backup automático
  createBackup(): string {
    const data = this.exportUserData();
    const backup = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      data
    };
    
    return JSON.stringify(backup, null, 2);
  }

  // Restaurar backup
  restoreBackup(backupData: string): void {
    try {
      const backup = JSON.parse(backupData);
      if (backup.data) {
        this.importUserData(backup.data);
        this.logActivity('settings', 'Backup restaurado', { version: backup.version });
      }
    } catch (error) {
      throw new Error('Erro ao restaurar backup: dados inválidos');
    }
  }

  // Configurar integração com Mercado Livre
  setupMercadoLivreIntegration(connected: boolean, productsCount: number = 0, reviewsCount: number = 0): void {
    this.updateIntegrations({
      mercadolivre: {
        connected,
        lastSync: connected ? new Date() : null,
        productsCount,
        reviewsCount
      }
    });
  }

  // Configurar integração de e-mail
  setupEmailIntegration(connected: boolean, provider: 'gmail' | 'outlook' | 'custom' = 'gmail'): void {
    this.updateIntegrations({
      email: {
        connected,
        provider
      }
    });
  }

  // Configurar integração do WhatsApp
  setupWhatsAppIntegration(connected: boolean, verified: boolean = false): void {
    this.updateIntegrations({
      whatsapp: {
        connected,
        verified
      }
    });
  }

  // Atualizar último login
  updateLastLogin(): void {
    if (this.currentUser) {
      this.currentUser.lastLogin = new Date();
      this.logActivity('login', 'Login realizado');
    }
  }

  // Verificar se o usuário está ativo
  isUserActive(): boolean {
    return this.currentUser?.status === 'active';
  }

  // Verificar se o usuário é admin
  isUserAdmin(): boolean {
    return this.currentUser?.isAdmin || false;
  }

  // Obter configurações de tema
  getThemeConfig(): {
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
  } {
    if (!this.currentUser) {
      return { theme: 'light', primaryColor: '#3B82F6', accentColor: '#8B5CF6' };
    }

    return {
      theme: this.currentUser.preferences.theme,
      primaryColor: '#3B82F6',
      accentColor: '#8B5CF6'
    };
  }

  // Obter configurações de idioma
  getLanguageConfig(): {
    language: string;
    dateFormat: string;
    timezone: string;
    currency: string;
  } {
    if (!this.currentUser) {
      return {
        language: 'pt-BR',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'America/Sao_Paulo',
        currency: 'BRL'
      };
    }

    return {
      language: this.currentUser.preferences.language,
      dateFormat: this.currentUser.preferences.dateFormat,
      timezone: this.currentUser.preferences.timezone,
      currency: this.currentUser.preferences.currency
    };
  }
}

export const userService = new UserService(); 