import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Database, 
  Key, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Mail,
  Trash2,
  Edit,
  Plus,
  Eye,
  Activity,
  Server,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Zap,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/users';
import { analyticsService } from '../services/analytics';
import { alertService } from '../services/alerts';
import { reportService } from '../services/reports';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  change: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  createdAt: Date;
  usage: {
    reviews: number;
    products: number;
    apiCalls: number;
  };
}

interface SystemLog {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: Date;
  userId?: string;
  metadata: Record<string, any>;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dados administrativos
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Carregar dados administrativos
  useEffect(() => {
    const loadAdminData = async () => {
      setIsLoading(true);
      try {
        // Simular dados de usuários administrativos
        const mockUsers: AdminUser[] = [
          {
            id: '1',
            name: 'João Silva',
            email: 'joao@empresa.com',
            company: 'Loja Digital Ltda',
            plan: 'premium',
            status: 'active',
            lastLogin: new Date('2024-01-15T10:30:00'),
            createdAt: new Date('2023-12-01'),
            usage: { reviews: 1250, products: 15, apiCalls: 5420 }
          },
          {
            id: '2',
            name: 'Maria Santos',
            email: 'maria@startup.com',
            company: 'Startup Tech',
            plan: 'basic',
            status: 'active',
            lastLogin: new Date('2024-01-14T15:45:00'),
            createdAt: new Date('2024-01-10'),
            usage: { reviews: 450, products: 8, apiCalls: 1200 }
          },
          {
            id: '3',
            name: 'Carlos Oliveira',
            email: 'carlos@ecommerce.com',
            company: 'E-commerce Plus',
            plan: 'enterprise',
            status: 'inactive',
            lastLogin: new Date('2024-01-10T09:15:00'),
            createdAt: new Date('2023-11-15'),
            usage: { reviews: 3200, products: 45, apiCalls: 12500 }
          }
        ];

        // Métricas do sistema baseadas em dados reais
        const currentUser = userService.getCurrentUser();
        const analytics = analyticsService.getMetrics();
        const alerts = alertService.getAlertStats();
        const reports = reportService.getReports();

        const metrics: SystemMetric[] = [
          {
            name: 'Usuários Ativos',
            value: '1,247',
            status: 'good',
            change: '+12%',
            icon: Users,
            description: 'Usuários que fizeram login nos últimos 30 dias'
          },
          {
            name: 'API Calls/min',
            value: '2,340',
            status: 'warning',
            change: '+45%',
            icon: Activity,
            description: 'Média de chamadas por minuto'
          },
          {
            name: 'Uptime',
            value: '99.9%',
            status: 'good',
            change: '+0.1%',
            icon: Server,
            description: 'Tempo de atividade do sistema'
          },
          {
            name: 'Armazenamento',
            value: '78%',
            status: 'warning',
            change: '+5%',
            icon: Database,
            description: 'Uso do armazenamento em disco'
          },
          {
            name: 'Alertas Ativos',
            value: alerts.total.toString(),
            status: alerts.critical > 0 ? 'error' : 'good',
            change: alerts.critical > 0 ? `${alerts.critical} críticos` : 'Estável',
            icon: AlertTriangle,
            description: 'Alertas não resolvidos'
          },
          {
            name: 'Relatórios Gerados',
            value: reports.length.toString(),
            status: 'good',
            change: '+8%',
            icon: BarChart3,
            description: 'Relatórios gerados este mês'
          }
        ];

        // Logs do sistema
        const logs: SystemLog[] = [
          {
            id: '1',
            type: 'info',
            message: 'Sistema iniciado com sucesso',
            timestamp: new Date(),
            metadata: { version: '1.0.0' }
          },
          {
            id: '2',
            type: 'warning',
            message: 'Alto uso de CPU detectado',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            metadata: { cpu: '85%' }
          },
          {
            id: '3',
            type: 'error',
            message: 'Falha na conexão com banco de dados',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            metadata: { error: 'Connection timeout' }
          },
          {
            id: '4',
            type: 'success',
            message: 'Backup automático concluído',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            metadata: { size: '2.5GB' }
          }
        ];

        setAdminUsers(mockUsers);
        setSystemMetrics(metrics);
        setSystemLogs(logs);
        setAnalyticsData(analytics);
      } catch (error) {
        console.error('Erro ao carregar dados administrativos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'inactive': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'suspended': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return 'Desconhecido';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'text-gray-600 bg-gray-100';
      case 'basic': return 'text-blue-600 bg-blue-100';
      case 'premium': return 'text-purple-600 bg-purple-100';
      case 'enterprise': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'free': return 'Gratuito';
      case 'basic': return 'Básico';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return 'Desconhecido';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Eye className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    const updatedUsers = adminUsers.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'suspend':
            return { ...user, status: 'suspended' as const };
          case 'activate':
            return { ...user, status: 'active' as const };
          case 'delete':
            return null;
          default:
            return user;
        }
      }
      return user;
    }).filter(Boolean) as AdminUser[];

    setAdminUsers(updatedUsers);
  };

  const handleExportData = (type: 'users' | 'logs' | 'metrics') => {
    let data: any;
    let filename: string;

    switch (type) {
      case 'users':
        data = filteredUsers;
        filename = `admin-users-${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'logs':
        data = systemLogs;
        filename = `system-logs-${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'metrics':
        data = systemMetrics;
        filename = `system-metrics-${new Date().toISOString().split('T')[0]}.json`;
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'system', name: 'Sistema', icon: Settings },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'api', name: 'API', icon: Key },
    { id: 'logs', name: 'Logs', icon: Activity }
  ];

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando dados administrativos...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie usuários, monitore o sistema e configure a plataforma
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={() => handleExportData('metrics')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getMetricStatusColor(metric.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <metric.icon className="h-5 w-5" />
                        <span className="font-medium text-gray-900">{metric.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        metric.change.startsWith('+') ? 'text-green-600' : 
                        metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas Rápidas</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total de Usuários</span>
                      <span className="font-semibold">{adminUsers.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Usuários Ativos</span>
                      <span className="font-semibold text-green-600">
                        {adminUsers.filter(u => u.status === 'active').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Usuários Suspensos</span>
                      <span className="font-semibold text-red-600">
                        {adminUsers.filter(u => u.status === 'suspended').length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Planos Enterprise</span>
                      <span className="font-semibold text-orange-600">
                        {adminUsers.filter(u => u.plan === 'enterprise').length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logs Recentes</h3>
                  <div className="space-y-3">
                    {systemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${getLogTypeColor(log.type)}`}>
                          {getLogTypeIcon(log.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">{log.message}</p>
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="suspended">Suspensos</option>
                </select>

                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos os planos</option>
                  <option value="free">Gratuito</option>
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>

                <button
                  onClick={() => handleExportData('users')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
              </div>

              {/* Users List */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuário
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Empresa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plano
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Último Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(user.plan)}`}>
                              {getPlanText(user.plan)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(user.status)}`}>
                              {getStatusText(user.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(user.lastLogin, { addSuffix: true, locale: ptBR })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="space-y-1">
                              <div>Reviews: {user.usage.reviews.toLocaleString()}</div>
                              <div>Produtos: {user.usage.products}</div>
                              <div>API: {user.usage.apiCalls.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="text-green-600 hover:text-green-900"
                                title="Ativar usuário"
                              >
                                <Unlock className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'suspend')}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Suspender usuário"
                              >
                                <Lock className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                                title="Excluir usuário"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {selectedTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos do Sistema</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-5 w-5 text-blue-600" />
                        <span className="text-gray-700">CPU</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Memória</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-purple-600" />
                        <span className="text-gray-700">Disco</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Modo de Manutenção</span>
                      <button className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                        Desativado
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Backup Automático</span>
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                        Ativo
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Logs Detalhados</span>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Ativo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {selectedTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Logs do Sistema</h3>
                <button
                  onClick={() => handleExportData('logs')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar Logs</span>
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mensagem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {systemLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(log.type)}`}>
                              {getLogTypeIcon(log.type)}
                              <span className="ml-1 capitalize">{log.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{log.message}</div>
                            {Object.keys(log.metadata).length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                {Object.entries(log.metadata).map(([key, value]) => (
                                  <span key={key} className="mr-2">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDistanceToNow(log.timestamp, { addSuffix: true, locale: ptBR })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {selectedTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Segurança</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Autenticação 2FA</span>
                      <span className="text-green-600 font-medium">Ativo</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Rate Limiting</span>
                      <span className="text-green-600 font-medium">Ativo</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">SSL/TLS</span>
                      <span className="text-green-600 font-medium">Ativo</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Firewall</span>
                      <span className="text-green-600 font-medium">Ativo</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ameaças Detectadas</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">0</div>
                      <div className="text-sm text-gray-600">Ameaças hoje</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-600">Bloqueios esta semana</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Tab */}
          {selectedTab === 'api' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas da API</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Requests/min</span>
                      <span className="font-semibold">2,340</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Taxa de Erro</span>
                      <span className="font-semibold text-green-600">0.02%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Tempo Médio</span>
                      <span className="font-semibold">45ms</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Uptime</span>
                      <span className="font-semibold text-green-600">99.9%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Endpoints Mais Usados</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">GET /products</span>
                      <span className="text-sm font-medium">1,234</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">GET /reviews</span>
                      <span className="text-sm font-medium">987</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">POST /analytics</span>
                      <span className="text-sm font-medium">456</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">GET /alerts</span>
                      <span className="text-sm font-medium">234</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Admin;