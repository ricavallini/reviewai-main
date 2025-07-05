import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Palette, 
  Globe, 
  Mail, 
  Smartphone, 
  Save,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AppearanceSettings from '../components/Settings/AppearanceSettings';
import MarketplaceSettings from '../components/Settings/MarketplaceSettings';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    push: false,
    critical: true,
    weekly: true,
    monthly: false
  });

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'marketplace', name: 'Marketplaces', icon: ShoppingCart },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'api', name: 'API', icon: Key },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'language', name: 'Idioma', icon: Globe }
  ];

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
            alt={user?.name}
            className="h-24 w-24 rounded-full border-4 border-gray-200"
          />
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-sm text-gray-500">{user?.company}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            defaultValue={user?.name}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            defaultValue={user?.email}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <input
            type="text"
            defaultValue={user?.company}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            placeholder="+55 (11) 99999-9999"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            rows={3}
            placeholder="Conte um pouco sobre você..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <span>Notificações por E-mail</span>
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Alertas Críticos</p>
              <p className="text-sm text-gray-600">Avaliações que requerem atenção imediata</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.critical}
              onChange={() => handleNotificationChange('critical')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Relatório Semanal</p>
              <p className="text-sm text-gray-600">Resumo das atividades da semana</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weekly}
              onChange={() => handleNotificationChange('weekly')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Relatório Mensal</p>
              <p className="text-sm text-gray-600">Análise completa do mês</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.monthly}
              onChange={() => handleNotificationChange('monthly')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* WhatsApp Notifications */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          <span>WhatsApp</span>
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Ativar WhatsApp</p>
              <p className="text-sm text-gray-600">Receber alertas via WhatsApp Business</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.whatsapp}
              onChange={() => handleNotificationChange('whatsapp')}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </label>
          
          {notifications.whatsapp && (
            <div className="ml-4 p-3 bg-white rounded border">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+55 (11) 99999-9999"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Bell className="h-5 w-5 text-purple-600" />
          <span>Notificações Push</span>
        </h4>
        <label className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Ativar Push</p>
            <p className="text-sm text-gray-600">Notificações no navegador</p>
          </div>
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={() => handleNotificationChange('push')}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </label>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Alterar Senha</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Autenticação de Dois Fatores</h4>
          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
            Desativado
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Adicione uma camada extra de segurança à sua conta
        </p>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Ativar 2FA
        </button>
      </div>

      {/* Login History */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Histórico de Login</h4>
        <div className="space-y-3">
          {[
            { device: 'Chrome - Windows', location: 'São Paulo, BR', time: 'Agora', current: true },
            { device: 'Safari - iPhone', location: 'São Paulo, BR', time: '2 horas atrás', current: false },
            { device: 'Chrome - Windows', location: 'São Paulo, BR', time: 'Ontem', current: false }
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <p className="font-medium text-gray-900">{session.device}</p>
                <p className="text-sm text-gray-600">{session.location} • {session.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                {session.current && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    Atual
                  </span>
                )}
                {!session.current && (
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Revogar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Chaves de API</h4>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>Nova Chave</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'Produção', key: 'rva_prod_**********************', created: '15 Jan 2024', lastUsed: '2 horas atrás' },
            { name: 'Desenvolvimento', key: 'rva_dev_**********************', created: '10 Jan 2024', lastUsed: '1 dia atrás' }
          ].map((apiKey, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <p className="font-medium text-gray-900">{apiKey.name}</p>
                <p className="text-sm text-gray-600 font-mono">{apiKey.key}</p>
                <p className="text-xs text-gray-500">Criada em {apiKey.created} • Último uso: {apiKey.lastUsed}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">
                  Copiar
                </button>
                <button className="text-red-600 hover:text-red-800 text-sm">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Usage */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Uso da API</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded">
            <p className="text-2xl font-bold text-blue-600">2,847</p>
            <p className="text-sm text-gray-600">Requisições este mês</p>
          </div>
          <div className="text-center p-3 bg-white rounded">
            <p className="text-2xl font-bold text-green-600">99.9%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
          <div className="text-center p-3 bg-white rounded">
            <p className="text-2xl font-bold text-purple-600">145ms</p>
            <p className="text-sm text-gray-600">Latência média</p>
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Webhooks</h4>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
            Adicionar Webhook
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-600">Nenhum webhook configurado</p>
          <p className="text-sm text-gray-500">Configure webhooks para receber notificações em tempo real</p>
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Idioma da Interface</h4>
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (United States)</option>
          <option value="es-ES">Español (España)</option>
          <option value="fr-FR">Français (France)</option>
        </select>
      </div>

      {/* Timezone */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Fuso Horário</h4>
        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
          <option value="America/New_York">New York (GMT-5)</option>
          <option value="Europe/London">London (GMT+0)</option>
          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
        </select>
      </div>

      {/* Date Format */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Formato de Data</h4>
        <div className="space-y-3">
          {[
            { format: 'DD/MM/YYYY', example: '15/01/2024' },
            { format: 'MM/DD/YYYY', example: '01/15/2024' },
            { format: 'YYYY-MM-DD', example: '2024-01-15' }
          ].map((dateFormat, index) => (
            <label key={index} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-medium">{dateFormat.format}</p>
                <p className="text-sm text-gray-600">{dateFormat.example}</p>
              </div>
              <input type="radio" name="dateFormat" defaultChecked={index === 0} className="text-blue-600 focus:ring-blue-500" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'marketplace': return <MarketplaceSettings />;
      case 'security': return renderSecurityTab();
      case 'api': return renderApiTab();
      case 'appearance': return <AppearanceSettings />;
      case 'language': return renderLanguageTab();
      default: return renderProfileTab();
    }
  };

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
            Configurações
          </h1>
          <p className="text-gray-600">
            Gerencie suas preferências e configurações da conta
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 mt-4 sm:mt-0"
        >
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exportar Dados</span>
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Salvar</span>
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            {renderTabContent()}
          </div>
        </motion.div>
      </div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              Zona de Perigo
            </h3>
            <p className="text-red-700 mb-4">
              As ações abaixo são irreversíveis. Tenha certeza antes de prosseguir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Excluir Conta</span>
              </button>
              <button className="border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">
                Limpar Todos os Dados
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;