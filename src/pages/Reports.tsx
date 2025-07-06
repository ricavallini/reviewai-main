import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Star, 
  MessageSquare, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Users,
  Clock,
  Mail,
  Share2,
  Plus,
  X,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Reports: React.FC = () => {
  const { reports } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [reportType, setReportType] = useState('complete');
  const [isGenerating, setIsGenerating] = useState(false);
  const [availableReports, setAvailableReports] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // Carregar templates e relatórios existentes
  useEffect(() => {
    const loadData = () => {
      const reportTemplates = reports.getTemplates();
      const existingReports = reports.getReports();
      
      setTemplates(reportTemplates);
      setAvailableReports(existingReports);
    };

    loadData();
  }, [reports]);

  const reportTypes = [
    { id: 'complete', name: 'Relatório Completo', description: 'Análise detalhada de todos os aspectos' },
    { id: 'sentiment', name: 'Análise de Sentimento', description: 'Foco em sentimentos e emoções' },
    { id: 'trends', name: 'Tendências', description: 'Evolução temporal das avaliações' },
    { id: 'keywords', name: 'Palavras-chave', description: 'Termos mais mencionados' },
    { id: 'competitive', name: 'Análise Competitiva', description: 'Comparação com concorrentes' }
  ];

  const periods = [
    { id: '7d', name: 'Últimos 7 dias' },
    { id: '30d', name: 'Últimos 30 dias' },
    { id: '90d', name: 'Últimos 90 dias' },
    { id: 'month', name: 'Este mês' },
    { id: 'custom', name: 'Período personalizado' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const templateId = reportType;
      const period = selectedPeriod as '7d' | '30d' | '90d' | '1y';
      
      const newReport = await reports.generateReport(templateId, period);
      
      // Recarregar relatórios
      const updatedReports = reports.getReports();
      setAvailableReports(updatedReports);
      
      alert('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      await reports.exportReport(reportId, format);
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm('Tem certeza que deseja excluir este relatório?')) {
      reports.deleteReport(reportId);
      const updatedReports = reports.getReports();
      setAvailableReports(updatedReports);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Pronto';
      case 'processing':
        return 'Processando...';
      case 'failed':
        return 'Falhou';
      default:
        return 'Aguardando';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
            Relatórios
          </h1>
          <p className="text-gray-600">
            Gere relatórios detalhados e personalizados dos seus dados
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span>{isGenerating ? 'Gerando...' : 'Novo Relatório'}</span>
        </motion.button>
      </div>

      {/* Generate Report Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Gerar Novo Relatório
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="space-y-3">
              {reportTypes.map((type) => (
                <label key={type.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={reportType === type.id}
                    onChange={(e) => setReportType(e.target.value)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{type.name}</p>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período
            </label>
            <div className="space-y-3">
              {periods.map((period) => (
                <label key={period.id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="period"
                    value={period.id}
                    checked={selectedPeriod === period.id}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-900">{period.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Produto (Opcional)
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Todos os produtos</option>
              <option value="specific">Produto específico</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Relatórios Recentes
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 text-sm">
              <option>Todos os tipos</option>
              <option>Completo</option>
              <option>Sentimento</option>
              <option>Tendências</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {availableReports.length > 0 ? (
            availableReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {report.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(report.status)}
                        <span className="text-sm text-gray-600">
                          {getStatusText(report.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Tipo:</strong> {reportTypes.find(t => t.id === report.type)?.name || report.type}</p>
                      <p><strong>Período:</strong> {periods.find(p => p.id === report.period)?.name || report.period}</p>
                      <p><strong>Criado em:</strong> {formatDate(report.createdAt)}</p>
                      {report.completedAt && (
                        <p><strong>Concluído em:</strong> {formatDate(report.completedAt)}</p>
                      )}
                    </div>
                    
                    {report.insights && report.insights.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3 mt-3">
                        <p className="text-sm font-medium text-blue-900 mb-2">Principais Insights:</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {report.insights.slice(0, 3).map((insight: any, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{insight.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {report.status === 'ready' && (
                      <>
                        <button 
                          onClick={() => handleExportReport(report.id, 'pdf')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Baixar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleExportReport(report.id, 'excel')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Baixar Excel"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleExportReport(report.id, 'csv')}
                          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                          title="Baixar CSV"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {report.status === 'processing' && (
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Processando...</span>
                      </div>
                    )}
                    <button 
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Excluir relatório"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum relatório encontrado
              </h3>
              <p className="text-gray-600">
                Gere seu primeiro relatório para começar a analisar seus dados
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Templates de Relatório
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/60 rounded-lg p-4 border border-blue-200"
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-700 mb-3">{template.description}</p>
              <div className="text-xs text-gray-600">
                <p><strong>Período padrão:</strong> {template.defaultPeriod}</p>
                <p><strong>Seções:</strong> {template.sections.length}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;