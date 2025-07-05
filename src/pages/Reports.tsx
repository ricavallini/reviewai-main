import React, { useState } from 'react';
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
  Share2
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Reports: React.FC = () => {
  const { products, reviews } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [reportType, setReportType] = useState('complete');

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

  const mockReports = [
    {
      id: '1',
      title: 'Relatório Mensal - Janeiro 2024',
      type: 'Completo',
      period: 'Janeiro 2024',
      products: 3,
      reviews: 1250,
      avgRating: 4.2,
      createdAt: new Date('2024-01-31'),
      status: 'ready',
      insights: [
        'Aumento de 15% em avaliações positivas',
        '3 produtos com tendência de alta',
        'Redução de 8% em reclamações sobre entrega'
      ]
    },
    {
      id: '2',
      title: 'Análise de Sentimento - Dezembro 2023',
      type: 'Sentimento',
      period: 'Dezembro 2023',
      products: 3,
      reviews: 1180,
      avgRating: 4.0,
      createdAt: new Date('2023-12-31'),
      status: 'ready',
      insights: [
        'Sentimento geral melhorou 12%',
        'Palavras positivas aumentaram 20%',
        'Críticas sobre preço diminuíram'
      ]
    },
    {
      id: '3',
      title: 'Relatório Semanal - Semana 4',
      type: 'Tendências',
      period: '22-28 Jan 2024',
      products: 3,
      reviews: 89,
      avgRating: 4.3,
      createdAt: new Date('2024-01-28'),
      status: 'processing',
      insights: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100 border-green-200';
      case 'processing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Pronto';
      case 'processing': return 'Processando';
      case 'error': return 'Erro';
      default: return 'Pendente';
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
            Relatórios
          </h1>
          <p className="text-gray-600">
            Gere e baixe relatórios detalhados das suas análises
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
        >
          <FileText className="h-5 w-5" />
          <span>Novo Relatório</span>
        </motion.button>
      </div>

      {/* Report Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Gerar Novo Relatório
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Relatório
            </label>
            <div className="space-y-2">
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
                    <p className="text-sm font-medium text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Período
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50 mb-4"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Produtos
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            >
              <option value="all">Todos os produtos</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-3">Prévia do Relatório</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">
                  {reportTypes.find(t => t.id === reportType)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Período:</span>
                <span className="font-medium">
                  {periods.find(p => p.id === selectedPeriod)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produtos:</span>
                <span className="font-medium">
                  {selectedProduct === 'all' ? 'Todos' : '1 produto'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reviews:</span>
                <span className="font-medium">~{reviews.length}</span>
              </div>
            </div>

            <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Gerar Relatório</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          {mockReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{report.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{report.period}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>{report.products} produtos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{report.reviews} reviews</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4" />
                      <span>{report.avgRating.toFixed(1)} média</span>
                    </div>
                  </div>
                  
                  {report.insights.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 mt-3">
                      <p className="text-sm font-medium text-blue-900 mb-2">Principais Insights:</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {report.insights.map((insight, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {report.status === 'ready' && (
                    <>
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {report.status === 'processing' && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processando...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Criado em {format(report.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
                <span className="text-blue-600 font-medium">
                  {report.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Report Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Templates de Relatório
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Relatório Executivo',
              description: 'Resumo para tomada de decisões',
              icon: TrendingUp,
              color: 'blue'
            },
            {
              name: 'Análise Detalhada',
              description: 'Relatório completo com todos os dados',
              icon: BarChart3,
              color: 'green'
            },
            {
              name: 'Comparativo Mensal',
              description: 'Evolução mês a mês',
              icon: PieChart,
              color: 'purple'
            },
            {
              name: 'Relatório de Crise',
              description: 'Foco em problemas críticos',
              icon: AlertTriangle,
              color: 'red'
            },
            {
              name: 'Satisfação do Cliente',
              description: 'Métricas de satisfação',
              icon: Users,
              color: 'yellow'
            },
            {
              name: 'Palavras-chave',
              description: 'Termos mais mencionados',
              icon: MessageSquare,
              color: 'indigo'
            }
          ].map((template, index) => {
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              purple: 'bg-purple-50 text-purple-600 border-purple-200',
              red: 'bg-red-50 text-red-600 border-red-200',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
              indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
            };

            return (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all ${colorClasses[template.color]}`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <template.icon className="h-6 w-6" />
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <button className="text-sm font-medium hover:underline">
                  Usar Template
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Reports;