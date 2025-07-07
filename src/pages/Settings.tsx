import React, { useState, useEffect } from 'react';
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
  ShoppingCart,
  Activity,
  Database,
  Zap,
  Lock,
  Unlock,
  Clock,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/users';
import AppearanceSettings from '../components/Settings/AppearanceSettings';
import MarketplaceSettings from '../components/Settings/MarketplaceSettings';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Estado do usuário
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    bio: ''
  });

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = () => {
      const profile = userService.getCurrentUser();
      setUserProfile(profile);
      
      if (profile) {
        setProfileForm({
          name: profile.name,
          email: profile.email,
          company: profile.company,
          phone: profile.phone || '',
          bio: profile.bio || ''
        });
      }
    };

    loadUserData();
  }, []);

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'marketplace', name: 'Marketplaces', icon: ShoppingCart },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'api', name: 'API', icon: Key },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'language', name: 'Idioma', icon: Globe },
    { id: 'usage', name: 'Uso', icon: Activity }
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      const updatedProfile = userService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        company: profileForm.company,
        phone: profileForm.phone,
        bio: profileForm.bio
      });
      
      setUserProfile(updatedProfile);
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (category: string, key: string, value: boolean) => {
    if (!userProfile) return;

    const currentNotifications = userProfile.preferences.notifications;
    const updatedNotifications = {
      ...currentNotifications,
      [category]: {
        ...currentNotifications[category],
        [key]: value
      }
    };

    userService.updateNotificationPreferences(updatedNotifications);
    setUserProfile(userService.getCurrentUser());
  };

  const handleDashboardChange = (key: string, value: any) => {
    if (!userProfile) return;

    const updatedDashboard = {
      ...userProfile.preferences.dashboard,
      [key]: value
    };

    userService.updateDashboardPreferences(updatedDashboard);
    setUserProfile(userService.getCurrentUser());
  };

  const handleReportChange = (key: string, value: any) => {
    if (!userProfile) return;

    const updatedReports = {
      ...userProfile.preferences.reports,
      [key]: value
    };

    userService.updateReportPreferences(updatedReports);
    setUserProfile(userService.getCurrentUser());
  };

  const handleExportData = () => {
    try {
      const data = userService.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reviewai-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        userService.importUserData(data);
        setUserProfile(userService.getCurrentUser());
        alert('Dados importados com sucesso!');
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        alert('Erro ao importar dados');
      }
    };
    reader.readAsText(file);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={userProfile?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'}
            alt={userProfile?.name}
            className="h-24 w-24 rounded-full border-4 border-gray-200"
          />
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{userProfile?.name}</h3>
          <p className="text-gray-600">{userProfile?.email}</p>
          <p className="text-sm text-gray-500">{userProfile?.company}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userProfile?.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {userProfile?.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {userService.getPlanName(userProfile?.plan)}
            </span>
          </div>
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
            value={profileForm.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Empresa
          </label>
          <input
            type="text"
            value={profileForm.company}
            onChange={(e) => handleProfileChange('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            value={profileForm.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
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
            value={profileForm.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            placeholder="Conte um pouco sobre você..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleSaveProfile}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : saveStatus === 'saved' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>
            {isLoading ? 'Salvando...' : 
             saveStatus === 'saved' ? 'Salvo!' : 
             saveStatus === 'error' ? 'Erro' : 'Salvar Alterações'}
          </span>
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
              checked={userProfile?.preferences.notifications.email.critical || false}
              onChange={(e) => handleNotificationChange('email', 'critical', e.target.checked)}
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
              checked={userProfile?.preferences.notifications.email.weekly || false}
              onChange={(e) => handleNotificationChange('email', 'weekly', e.target.checked)}
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
              checked={userProfile?.preferences.notifications.email.monthly || false}
              onChange={(e) => handleNotificationChange('email', 'monthly', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>

      {/* WhatsApp Notifications */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-green-600" />
          <span>Notificações por WhatsApp</span>
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Alertas Críticos</p>
              <p className="text-sm text-gray-600">Receber alertas urgentes via WhatsApp</p>
            </div>
            <input
              type="checkbox"
              checked={userProfile?.preferences.notifications.whatsapp.critical || false}
              onChange={(e) => handleNotificationChange('whatsapp', 'critical', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Resumo Diário</p>
              <p className="text-sm text-gray-600">Receber resumo diário das atividades</p>
            </div>
            <input
              type="checkbox"
              checked={userProfile?.preferences.notifications.whatsapp.daily || false}
              onChange={(e) => handleNotificationChange('whatsapp', 'daily', e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
          </label>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4 flex items-center space-x-2">
          <Bell className="h-5 w-5 text-purple-600" />
          <span>Notificações Push</span>
        </h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Alertas Críticos</p>
              <p className="text-sm text-gray-600">Notificações push para alertas urgentes</p>
            </div>
            <input
              type="checkbox"
              checked={userProfile?.preferences.notifications.push.critical || false}
              onChange={(e) => handleNotificationChange('push', 'critical', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Atualizações do Sistema</p>
              <p className="text-sm text-gray-600">Receber notificações sobre atualizações</p>
            </div>
            <input
              type="checkbox"
              checked={userProfile?.preferences.notifications.push.updates || false}
              onChange={(e) => handleNotificationChange('push', 'updates', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderUsageTab = () => {
    if (!userProfile) return null;

    const usageStats = userService.getUsageStats();
    const limits = userService.checkUsageLimits();
    const planFeatures = userService.getPlanFeatures(userProfile.plan);

    return (
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {usageStats.plan}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{planFeatures.reviews.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Reviews/mês</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{planFeatures.products}</p>
              <p className="text-sm text-gray-600">Produtos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{planFeatures.apiCalls.toLocaleString()}</p>
              <p className="text-sm text-gray-600">API Calls</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{planFeatures.storage}MB</p>
              <p className="text-sm text-gray-600">Armazenamento</p>
            </div>
          </div>
        </div>

        {/* Usage Progress */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Uso Atual</h3>
          
          {Object.entries(limits).map(([resource, data]) => (
            <div key={resource} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 capitalize">
                  {resource === 'reviews' ? 'Reviews' : 
                   resource === 'products' ? 'Produtos' : 
                   resource === 'apiCalls' ? 'API Calls' : 'Armazenamento'}
                </span>
                <span className="text-sm text-gray-600">
                  {data.used.toLocaleString()} / {data.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    data.percentage > 90 ? 'bg-red-500' : 
                    data.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(data.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {data.percentage.toFixed(1)}% utilizado
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Funcionalidades Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planFeatures.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 capitalize">
                  {feature === 'analytics' ? 'Analytics' :
                   feature === 'alerts' ? 'Alertas' :
                   feature === 'reports' ? 'Relatórios' :
                   feature === 'api' ? 'API' :
                   feature === 'integrations' ? 'Integrações' : feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
          <div className="space-y-2">
            {userService.getActivities(5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{activity.description}</span>
                <span className="text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 pr-10"
                placeholder="Digite sua senha atual"
              />
              <button
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
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              placeholder="Digite a nova senha"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
              placeholder="Confirme a nova senha"
            />
          </div>
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Alterar Senha
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Autenticação em Duas Etapas</h3>
            <p className="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Ativar</span>
          </button>
        </div>
      </div>

      {/* Data Export/Import */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar/Importar Dados</h3>
        <div className="flex space-x-4">
          <button
            onClick={handleExportData}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Dados</span>
          </button>
          
          <label className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 cursor-pointer">
            <Upload className="h-4 w-4" />
            <span>Importar Dados</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="space-y-6">
      {/* API Keys */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chaves da API</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Chave Principal</p>
              <p className="text-sm text-gray-600">Usada para acessar a API</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value="sk_live_1234567890abcdef"
                readOnly
                className="px-3 py-1 border border-gray-200 rounded text-sm bg-white"
              />
              <button className="text-blue-600 hover:text-blue-800">
                <Eye className="h-4 w-4" />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Chave de Teste</p>
              <p className="text-sm text-gray-600">Para desenvolvimento e testes</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="password"
                value="sk_test_abcdef1234567890"
                readOnly
                className="px-3 py-1 border border-gray-200 rounded text-sm bg-white"
              />
              <button className="text-blue-600 hover:text-blue-800">
                <Eye className="h-4 w-4" />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentação da API</h3>
        <p className="text-gray-700 mb-4">
          Acesse a documentação completa da API para integrar o ReviewAI em suas aplicações.
        </p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Ver Documentação
        </button>
      </div>

      {/* Usage Limits */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Limites de Uso da API</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">1,000</p>
            <p className="text-sm text-gray-600">Requests/hora</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">10,000</p>
            <p className="text-sm text-gray-600">Requests/dia</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">100,000</p>
            <p className="text-sm text-gray-600">Requests/mês</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => {
    if (!userProfile) return null;

    const languageConfig = userService.getLanguageConfig();

    return (
      <div className="space-y-6">
        {/* Language */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Idioma</h3>
          <select
            value={languageConfig.language}
            onChange={(e) => userService.updatePreferences({ language: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Formato de Data</h3>
          <select
            value={languageConfig.dateFormat}
            onChange={(e) => userService.updatePreferences({ dateFormat: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuso Horário</h3>
          <select
            value={languageConfig.timezone}
            onChange={(e) => userService.updatePreferences({ timezone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="America/Sao_Paulo">America/Sao_Paulo (UTC-3)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
          </select>
        </div>

        {/* Currency */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Moeda</h3>
          <select
            value={languageConfig.currency}
            onChange={(e) => userService.updatePreferences({ currency: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="BRL">Real Brasileiro (R$)</option>
            <option value="USD">Dólar Americano ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'marketplace':
        return <MarketplaceSettings />;
      case 'security':
        return renderSecurityTab();
      case 'api':
        return renderApiTab();
      case 'appearance':
        return <AppearanceSettings />;
      case 'language':
        return renderLanguageTab();
      case 'usage':
        return renderUsageTab();
      default:
        return renderProfileTab();
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando configurações...</span>
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
      >
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Configurações
        </h1>
        <p className="text-gray-600">
          Gerencie suas preferências e configurações da conta
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
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
          {renderTabContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;