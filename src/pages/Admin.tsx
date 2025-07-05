import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
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

interface SystemMetric {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  change: string;
  icon: React.ComponentType<any>;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for admin dashboard
  const mockUsers: User[] = [
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

  const systemMetrics: SystemMetric[] = [
    {
      name: 'Usuários Ativos',
      value: '1,247',
      status: 'good',
      change: '+12%',
      icon: Users
    },
    {
      name: 'API Calls/min',
      value: '2,340',
      status: 'warning',
      change: '+45%',
      icon: Activity
    },
    {
      name: 'Uptime',
      value: '99.9%',
      status: 'good',
      change: '+0.1%',
      icon: Server
    },
    {
      name: 'Armazenamento',
      value: '78%',
      status: 'warning',
      change: '+5%',
      icon: Database
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesStatus;
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

  const tabs = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'users', name: 'Usuários', icon: Users },
    { id: 'system', name: 'Sistema', icon: Settings },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'api', name: 'API', icon: Key }
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie usuários, sistema e configurações avançadas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 mt-4 sm:mt-0"
        >
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Exportar Logs</span>
          </button>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* System Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {systemMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 border shadow-sm ${getMetricStatusColor(metric.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">{metric.name}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className="text-sm font-medium">{metric.change}</p>
                  </div>
                  <metric.icon className="h-8 w-8" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Atividade Recente do Sistema
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Novo usuário registrado', user: 'maria@startup.com', time: '5 min atrás', type: 'success' },
                { action: 'API rate limit atingido', user: 'sistema', time: '12 min atrás', type: 'warning' },
                { action: 'Backup automático concluído', user: 'sistema', time: '1 hora atrás', type: 'success' },
                { action: 'Tentativa de login falhada', user: 'admin@test.com', time: '2 horas atrás', type: 'error' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {activity.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {activity.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedTab === 'users' && (
        <div className="space-y-6">
          {/* User Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                >
                  <option value="all">Todos os status</option>
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="suspended">Suspensos</option>
                </select>
              </div>

              <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Novo Usuário</span>
              </button>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Usuários ({filteredUsers.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Último Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.company}</div>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="space-y-1">
                          <div>{user.usage.reviews} reviews</div>
                          <div>{user.usage.products} produtos</div>
                          <div>{user.usage.apiCalls} API calls</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(user.lastLogin, { addSuffix: true, locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Mail className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {selectedTab === 'system' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Configurações do Sistema
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Configurações Gerais</h4>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Manutenção Programada</span>
                  <input type="checkbox" className="rounded border-gray-300" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Backup Automático</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Logs Detalhados</span>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Limites do Sistema</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rate Limit (req/min)</label>
                  <input type="number" defaultValue="1000" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max Upload Size (MB)</label>
                  <input type="number" defaultValue="10" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Session Timeout (min)</label>
                  <input type="number" defaultValue="60" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
              Salvar Configurações
            </button>
          </div>
        </motion.div>
      )}

      {selectedTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Configurações de Segurança
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Autenticação</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">2FA Obrigatório</span>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Login Social</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Captcha</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Políticas de Senha</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Comprimento Mínimo</label>
                    <input type="number" defaultValue="8" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Caracteres Especiais</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Números Obrigatórios</span>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h4 className="font-medium text-red-900">Zona de Perigo</h4>
            </div>
            <p className="text-sm text-red-700 mb-4">
              Ações irreversíveis que afetam todo o sistema. Use com extrema cautela.
            </p>
            <div className="flex space-x-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Resetar Sistema
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Limpar Logs
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {selectedTab === 'api' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Gerenciamento de API
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-900">12,450</p>
                <p className="text-sm text-blue-600">Requests Hoje</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-900">99.8%</p>
                <p className="text-sm text-green-600">Uptime</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-900">245ms</p>
                <p className="text-sm text-purple-600">Latência Média</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-4">Chaves de API Ativas</h4>
              <div className="space-y-3">
                {[
                  { name: 'Produção', key: 'pk_live_...', lastUsed: '2 min atrás', requests: '1.2k' },
                  { name: 'Desenvolvimento', key: 'pk_test_...', lastUsed: '1 hora atrás', requests: '45' },
                  { name: 'Webhook', key: 'wh_...', lastUsed: '5 min atrás', requests: '890' }
                ].map((apiKey, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{apiKey.name}</p>
                      <p className="text-xs text-gray-600">{apiKey.key}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{apiKey.requests} requests</p>
                      <p className="text-xs text-gray-500">{apiKey.lastUsed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Admin;