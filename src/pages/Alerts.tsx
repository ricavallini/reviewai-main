import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Star, 
  MessageSquare, 
  Filter,
  Settings,
  Mail,
  Smartphone,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Plus,
  X,
  Save,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConfigModal {
  isOpen: boolean;
}

const Alerts: React.FC = () => {
  const { alerts } = useData();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [configModal, setConfigModal] = useState<ConfigModal>({ isOpen: false });
  const [alertConfig, setAlertConfig] = useState<any>(null);
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([]);
  const [alertStats, setAlertStats] = useState<any>(null);

  // Carregar dados de alertas
  useEffect(() => {
    const loadAlertData = () => {
      const config = alerts.getConfig();
      const stats = alerts.getAlertStats();
      const filtered = alerts.getFilteredAlerts({
        type: selectedType === 'all' ? undefined : selectedType,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      });

      setAlertConfig(config);
      setAlertStats(stats);
      setFilteredAlerts(filtered);
    };

    loadAlertData();
  }, [selectedType, selectedStatus, alerts]);

  const handleConfigChange = (field: string, value: any) => {
    setAlertConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !alertConfig.keywords.includes(keyword.trim())) {
      setAlertConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }));
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setAlertConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter((k: string) => k !== keyword)
    }));
  };

  const handleSaveConfig = () => {
    alerts.setConfig(alertConfig);
    setConfigModal({ isOpen: false });
    alert('Configurações de alertas salvas com sucesso!');
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'urgent': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'negative': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'warning': return 'border-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'urgent': return Bell;
      case 'negative': return MessageSquare;
      case 'warning': return Clock;
      default: return Bell;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'critical': return 'Crítico';
      case 'urgent': return 'Urgente';
      case 'negative': return 'Negativo';
      case 'warning': return 'Aviso';
      default: return type;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    alerts.markAsRead(alertId);
    // Recarregar alertas filtrados
    const filtered = alerts.getFilteredAlerts({
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus
    });
    setFilteredAlerts(filtered);
  };

  const handleMarkAsResolved = (alertId: string) => {
    alerts.markAsResolved(alertId);
    // Recarregar alertas filtrados
    const filtered = alerts.getFilteredAlerts({
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus
    });
    setFilteredAlerts(filtered);
  };

  const handleDeleteAlert = (alertId: string) => {
    alerts.deleteAlert(alertId);
    // Recarregar alertas filtrados
    const filtered = alerts.getFilteredAlerts({
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus
    });
    setFilteredAlerts(filtered);
  };

  const handleMarkAllAsRead = () => {
    alerts.markAllAsRead();
    // Recarregar alertas filtrados
    const filtered = alerts.getFilteredAlerts({
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus
    });
    setFilteredAlerts(filtered);
  };

  if (!alertStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando alertas...</span>
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
            Alertas & Notificações
          </h1>
          <p className="text-gray-600">
            Monitore avaliações críticas e tendências importantes
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setConfigModal({ isOpen: true })}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <Settings className="h-5 w-5" />
          <span>Configurar Alertas</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Não Lidos</p>
              <p className="text-2xl font-bold text-red-600">{alertStats.unread}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Críticos</p>
              <p className="text-2xl font-bold text-orange-600">{alertStats.critical}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-blue-600">{alertStats.pending}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="all">Todos os tipos</option>
            <option value="critical">Críticos</option>
            <option value="urgent">Urgentes</option>
            <option value="negative">Negativos</option>
            <option value="warning">Avisos</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
          >
            <option value="all">Todos os status</option>
            <option value="unread">Não lidos</option>
            <option value="pending">Pendentes</option>
            <option value="resolved">Resolvidos</option>
          </select>
        </div>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertas Recentes ({filteredAlerts.length})
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Marcar todos como lidos
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert, index) => {
            const AlertIcon = getAlertIcon(alert.type);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.type)} ${
                  !alert.isRead ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <AlertIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {alert.title}
                        </h4>
                        {!alert.isRead && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                        )}
                        <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full">
                          {getTypeLabel(alert.type)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">
                        {alert.description}
                      </p>
                      
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Produto:</strong> {alert.productName}</p>
                        <p><strong>Cliente:</strong> {alert.author}</p>
                        <p><strong>Avaliação:</strong> 
                          <span className="ml-1 inline-flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < alert.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </span>
                        </p>
                        <p className="italic">"{alert.comment}"</p>
                        <p className="text-gray-500">
                          {formatDistanceToNow(alert.date, { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {alert.isResolved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-white/50 rounded transition-colors">
                        <Mail className="h-4 w-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum alerta encontrado com os filtros selecionados</p>
          </div>
        )}
      </motion.div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {configModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfigModal({ isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Configurar Alertas
                </h2>
                <button
                  onClick={() => setConfigModal({ isOpen: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {alertConfig && (
                <div className="space-y-6">
                  {/* Notification Channels */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Canais de Notificação
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">E-mail</p>
                            <p className="text-sm text-gray-600">Receber alertas por e-mail</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.emailEnabled}
                          onChange={(e) => handleConfigChange('emailEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>

                      {alertConfig.emailEnabled && (
                        <div className="ml-8">
                          <input
                            type="email"
                            value={alertConfig.emailAddress}
                            onChange={(e) => handleConfigChange('emailAddress', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="seu@email.com"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">WhatsApp</p>
                            <p className="text-sm text-gray-600">Receber alertas via WhatsApp</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.whatsappEnabled}
                          onChange={(e) => handleConfigChange('whatsappEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </div>

                      {alertConfig.whatsappEnabled && (
                        <div className="ml-8">
                          <input
                            type="tel"
                            value={alertConfig.whatsappNumber}
                            onChange={(e) => handleConfigChange('whatsappNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="+55 (11) 99999-9999"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Push Notifications</p>
                            <p className="text-sm text-gray-600">Notificações no navegador</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.pushEnabled}
                          onChange={(e) => handleConfigChange('pushEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {alertConfig.soundEnabled ? (
                            <Volume2 className="h-5 w-5 text-orange-600" />
                          ) : (
                            <VolumeX className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Som</p>
                            <p className="text-sm text-gray-600">Tocar som para alertas críticos</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.soundEnabled}
                          onChange={(e) => handleConfigChange('soundEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alert Types */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tipos de Alerta
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-gray-700">Alertas Críticos</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.criticalEnabled}
                          onChange={(e) => handleConfigChange('criticalEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-700">Alertas Urgentes</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.urgentEnabled}
                          onChange={(e) => handleConfigChange('urgentEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-gray-700">Tendências Negativas</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.negativeEnabled}
                          onChange={(e) => handleConfigChange('negativeEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Avisos</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={alertConfig.warningEnabled}
                          onChange={(e) => handleConfigChange('warningEnabled', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Trigger Conditions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Condições de Disparo
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Avaliação Mínima para Alerta
                        </label>
                        <select
                          value={alertConfig.minRating}
                          onChange={(e) => handleConfigChange('minRating', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>1 estrela</option>
                          <option value={2}>2 estrelas</option>
                          <option value={3}>3 estrelas</option>
                          <option value={4}>4 estrelas</option>
                          <option value={5}>5 estrelas</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Palavras-chave Negativas
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {alertConfig.keywords.map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                            >
                              {keyword}
                              <button
                                onClick={() => handleKeywordRemove(keyword)}
                                className="ml-1 text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Adicionar palavra-chave"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleKeywordAdd(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              handleKeywordAdd(input.value);
                              input.value = '';
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setConfigModal({ isOpen: false })}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveConfig}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Alerts;