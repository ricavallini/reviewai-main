import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  Star,
  MessageSquare,
  Users,
  Target,
  FileText,
  Mail,
  Share2,
  X,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

interface ExportModal {
  isOpen: boolean;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  period: '7d' | '30d' | '90d' | '1y';
  includeCharts: boolean;
  includeRawData: boolean;
  includeInsights: boolean;
  email: string;
}

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('sentiment');
  const [exportModal, setExportModal] = useState<ExportModal>({ isOpen: false });
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    period: '30d',
    includeCharts: true,
    includeRawData: false,
    includeInsights: true,
    email: ''
  });

  // Mock data for charts
  const sentimentData = [
    { month: 'Jan', positive: 65, neutral: 20, negative: 15 },
    { month: 'Fev', positive: 70, neutral: 18, negative: 12 },
    { month: 'Mar', positive: 68, neutral: 22, negative: 10 },
    { month: 'Abr', positive: 72, neutral: 19, negative: 9 },
    { month: 'Mai', positive: 75, neutral: 17, negative: 8 },
    { month: 'Jun', positive: 73, neutral: 20, negative: 7 }
  ];

  const ratingDistribution = [
    { rating: '5 estrelas', count: 450, percentage: 45 },
    { rating: '4 estrelas', count: 300, percentage: 30 },
    { rating: '3 estrelas', count: 150, percentage: 15 },
    { rating: '2 estrelas', count: 70, percentage: 7 },
    { rating: '1 estrela', count: 30, percentage: 3 }
  ];

  const keywordData = [
    { keyword: 'qualidade', mentions: 234, sentiment: 'positive' },
    { keyword: 'entrega', mentions: 189, sentiment: 'positive' },
    { keyword: 'preço', mentions: 156, sentiment: 'neutral' },
    { keyword: 'embalagem', mentions: 98, sentiment: 'negative' },
    { keyword: 'atendimento', mentions: 87, sentiment: 'positive' }
  ];

  const pieData = [
    { name: 'Positivo', value: 73, color: '#10B981' },
    { name: 'Neutro', value: 20, color: '#F59E0B' },
    { name: 'Negativo', value: 7, color: '#EF4444' }
  ];

  const handleExportOptionChange = (field: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    // Simular processo de exportação
    console.log('Exportando com opções:', exportOptions);
    
    // Simular download
    const filename = `analytics-report-${exportOptions.period}.${exportOptions.format}`;
    
    // Criar um blob simulado para download
    const content = `Relatório de Analytics - ${exportOptions.period}\n\nDados exportados em ${new Date().toLocaleString('pt-BR')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Fechar modal
    setExportModal({ isOpen: false });
    
    // Mostrar mensagem de sucesso
    alert('Relatório exportado com sucesso!');
  };

  const handleEmailReport = () => {
    if (!exportOptions.email) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }
    
    // Simular envio por e-mail
    console.log('Enviando relatório por e-mail para:', exportOptions.email);
    alert(`Relatório enviado para ${exportOptions.email}!`);
    setExportModal({ isOpen: false });
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
            Analytics Avançado
          </h1>
          <p className="text-gray-600">
            Análise detalhada das avaliações e tendências dos seus produtos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4 mt-4 sm:mt-0"
        >
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExportModal({ isOpen: true })}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Satisfação Geral', value: '87%', change: '+5%', icon: Star, color: 'yellow' },
          { title: 'Total de Reviews', value: '2,847', change: '+12%', icon: MessageSquare, color: 'blue' },
          { title: 'Engajamento', value: '94%', change: '+8%', icon: Users, color: 'green' },
          { title: 'Taxa de Resposta', value: '96%', change: '+3%', icon: Target, color: 'purple' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-green-600 font-medium">{metric.change}</p>
              </div>
              <div className={`h-12 w-12 bg-${metric.color}-50 rounded-lg flex items-center justify-center`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tendência de Sentimento
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sentiment">Sentimento</option>
                <option value="rating">Avaliação</option>
                <option value="volume">Volume</option>
              </select>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="neutral" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Distribuição de Sentimento
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentual']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {item.value}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">{item.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Rating Distribution & Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Distribuição de Avaliações
          </h3>
          
          <div className="space-y-4">
            {ratingDistribution.map((item, index) => (
              <div key={item.rating} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-600">
                  {item.rating}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                  />
                </div>
                <div className="w-16 text-sm font-medium text-gray-900 text-right">
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Palavras-chave Mais Mencionadas
          </h3>
          
          <div className="space-y-4">
            {keywordData.map((keyword, index) => {
              const sentimentColors = {
                positive: 'bg-green-100 text-green-800 border-green-200',
                neutral: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                negative: 'bg-red-100 text-red-800 border-red-200'
              };

              return (
                <motion.div
                  key={keyword.keyword}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 capitalize">
                      {keyword.keyword}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${sentimentColors[keyword.sentiment]}`}>
                      {keyword.sentiment === 'positive' ? 'Positivo' : 
                       keyword.sentiment === 'negative' ? 'Negativo' : 'Neutro'}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {keyword.mentions} menções
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Insights da IA
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">📈 Tendência Positiva</h4>
            <p className="text-sm text-gray-700">
              Aumento de 15% em avaliações positivas relacionadas à "qualidade do produto" nos últimos 30 dias.
            </p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">⚠️ Ponto de Atenção</h4>
            <p className="text-sm text-gray-700">
              Reclamações sobre "embalagem" aumentaram 8%. Considere revisar o processo de empacotamento.
            </p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">💡 Oportunidade</h4>
            <p className="text-sm text-gray-700">
              Clientes elogiam o "atendimento". Use isso como diferencial competitivo em suas campanhas.
            </p>
          </div>
          
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">🎯 Recomendação</h4>
            <p className="text-sm text-gray-700">
              85% das respostas automáticas foram bem recebidas. Continue usando o tom empático atual.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Export Modal */}
      <AnimatePresence>
        {exportModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setExportModal({ isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Exportar Relatório
                </h2>
                <button
                  onClick={() => setExportModal({ isOpen: false })}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formato
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'pdf', label: 'PDF', icon: FileText },
                      { value: 'excel', label: 'Excel', icon: BarChart3 },
                      { value: 'csv', label: 'CSV', icon: Download }
                    ].map((format) => (
                      <button
                        key={format.value}
                        onClick={() => handleExportOptionChange('format', format.value)}
                        className={`p-3 border rounded-lg text-center transition-all ${
                          exportOptions.format === format.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <format.icon className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium">{format.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período
                  </label>
                  <select
                    value={exportOptions.period}
                    onChange={(e) => handleExportOptionChange('period', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                    <option value="1y">Último ano</option>
                  </select>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incluir
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCharts}
                        onChange={(e) => handleExportOptionChange('includeCharts', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Gráficos e visualizações</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeRawData}
                        onChange={(e) => handleExportOptionChange('includeRawData', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Dados brutos</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeInsights}
                        onChange={(e) => handleExportOptionChange('includeInsights', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Insights da IA</span>
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enviar por e-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={exportOptions.email}
                    onChange={(e) => handleExportOptionChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Baixar</span>
                  </button>
                  
                  {exportOptions.email && (
                    <button
                      onClick={handleEmailReport}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Enviar</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Analytics;