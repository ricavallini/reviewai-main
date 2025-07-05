import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Star, TrendingUp, TrendingDown, ExternalLink, X, Save, Upload, Globe, ShoppingCart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

interface NewProductModal {
  isOpen: boolean;
}

interface NewProductForm {
  name: string;
  category: string;
  price: string;
  marketplaceUrl: string;
  marketplace: string;
  image: string;
  description: string;
}

interface FormErrors {
  [key: string]: string;
}

const Products: React.FC = () => {
  const { products, addProduct, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newProductModal, setNewProductModal] = useState<NewProductModal>({ isOpen: false });
  const [newProductForm, setNewProductForm] = useState<NewProductForm>({
    name: '',
    category: '',
    price: '',
    marketplaceUrl: '',
    marketplace: '',
    image: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const marketplaces = [
    { id: 'mercadolivre', name: 'Mercado Livre', icon: ShoppingCart },
    { id: 'amazon', name: 'Amazon Brasil', icon: Globe },
    { id: 'shopee', name: 'Shopee', icon: ShoppingCart },
    { id: 'magazineluiza', name: 'Magazine Luiza', icon: ShoppingCart },
    { id: 'americanas', name: 'Americanas', icon: ShoppingCart }
  ];

  const productCategories = [
    'Eletrônicos',
    'Áudio',
    'Computadores',
    'Casa e Jardim',
    'Moda',
    'Esportes',
    'Livros',
    'Beleza',
    'Automotivo',
    'Brinquedos'
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleInputChange = (field: keyof NewProductForm, value: string) => {
    setNewProductForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!newProductForm.name.trim()) {
      errors.name = 'Nome do produto é obrigatório';
    }

    if (!newProductForm.category) {
      errors.category = 'Categoria é obrigatória';
    }

    if (!newProductForm.price || parseFloat(newProductForm.price) <= 0) {
      errors.price = 'Preço deve ser maior que zero';
    }

    if (!newProductForm.marketplaceUrl.trim()) {
      errors.marketplaceUrl = 'URL do produto é obrigatória';
    } else if (!newProductForm.marketplaceUrl.startsWith('http')) {
      errors.marketplaceUrl = 'URL deve começar com http:// ou https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setNewProductForm({
      name: '',
      category: '',
      price: '',
      marketplaceUrl: '',
      marketplace: '',
      image: '',
      description: ''
    });
    setFormErrors({});
    setSubmitStatus('idle');
  };

  const handleSubmitProduct = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const productData = {
        name: newProductForm.name.trim(),
        category: newProductForm.category,
        price: parseFloat(newProductForm.price),
        marketplaceUrl: newProductForm.marketplaceUrl.trim(),
        marketplace: newProductForm.marketplace,
        image: newProductForm.image,
        description: newProductForm.description.trim()
      };

      await addProduct(productData);
      
      setSubmitStatus('success');
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        setNewProductModal({ isOpen: false });
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setSubmitStatus('error');
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Erro ao adicionar produto'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Por favor, selecione um arquivo de imagem válido'
        }));
        return;
      }

      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: 'Imagem deve ter no máximo 5MB'
        }));
        return;
      }

      // Simular upload da imagem
      const imageUrl = URL.createObjectURL(file);
      handleInputChange('image', imageUrl);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setNewProductModal({ isOpen: false });
      resetForm();
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
            Meus Produtos
          </h1>
          <p className="text-gray-600">
            Gerencie e monitore seus produtos nos marketplaces
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setNewProductModal({ isOpen: true })}
          disabled={isLoading}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Produto</span>
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTrendColor(product.trend)}`}>
                  {getTrendIcon(product.trend)}
                  <span className="ml-1">
                    {product.trend === 'up' ? 'Alta' : product.trend === 'down' ? 'Baixa' : 'Estável'}
                  </span>
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <a
                  href={product.marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">
                    {product.avgRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.totalReviews} avaliações)
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {product.category}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">{product.recentReviews}</p>
                  <p className="text-blue-600">Reviews recentes</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">
                    {((product.avgRating / 5) * 100).toFixed(0)}%
                  </p>
                  <p className="text-green-600">Satisfação</p>
                </div>
              </div>

              <Link
                to={`/produtos/${product.id}`}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 text-center block"
              >
                Ver Detalhes
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou adicionar novos produtos
          </p>
        </motion.div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {newProductModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
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
                  Adicionar Novo Produto
                </h2>
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Produto adicionado com sucesso!</p>
                    <p className="text-green-700 text-sm">A sincronização será iniciada em breve.</p>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && formErrors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Erro ao adicionar produto</p>
                    <p className="text-red-700 text-sm">{formErrors.submit}</p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                {/* Product Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Produto
                  </label>
                  <div className="flex items-center space-x-4">
                    {newProductForm.image ? (
                      <img
                        src={newProductForm.image}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-image"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="product-image"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Escolher Imagem
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG até 5MB</p>
                      {formErrors.image && (
                        <p className="text-xs text-red-600 mt-1">{formErrors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        formErrors.name ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="Ex: Smartphone Galaxy Pro Max"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        formErrors.category ? 'border-red-300' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Selecione uma categoria</option>
                      {productCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProductForm.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                        formErrors.price ? 'border-red-300' : 'border-gray-200'
                      }`}
                      placeholder="0,00"
                    />
                    {formErrors.price && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marketplace
                    </label>
                    <select
                      value={newProductForm.marketplace}
                      onChange={(e) => handleInputChange('marketplace', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="">Selecione o marketplace</option>
                      {marketplaces.map(marketplace => (
                        <option key={marketplace.id} value={marketplace.id}>
                          {marketplace.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Produto *
                  </label>
                  <input
                    type="url"
                    value={newProductForm.marketplaceUrl}
                    onChange={(e) => handleInputChange('marketplaceUrl', e.target.value)}
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      formErrors.marketplaceUrl ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="https://produto.mercadolivre.com.br/..."
                  />
                  {formErrors.marketplaceUrl && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.marketplaceUrl}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Cole a URL completa do produto no marketplace
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    rows={3}
                    value={newProductForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="Descrição adicional do produto..."
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Como funciona:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Após adicionar, o produto será sincronizado automaticamente</li>
                    <li>As avaliações serão coletadas e analisadas pela IA</li>
                    <li>Você receberá alertas sobre avaliações importantes</li>
                    <li>Relatórios detalhados estarão disponíveis em 24h</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    * Campos obrigatórios
                  </p>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSubmitProduct}
                      disabled={isSubmitting || submitStatus === 'success'}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Adicionando...</span>
                        </>
                      ) : submitStatus === 'success' ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Adicionado!</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Adicionar Produto</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;