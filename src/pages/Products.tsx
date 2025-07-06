import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Star, TrendingUp, TrendingDown, ExternalLink, X, Save, Upload, Globe, ShoppingCart, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { useMercadoLivre } from '../hooks/useMercadoLivre';
import { formatCurrency } from '../utils/formatters';

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
  const { products, addProduct, isLoading, searchProducts } = useData();
  const { isConnected, loadProducts, loadCategories, categories } = useMercadoLivre();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'reviews'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isSearching, setIsSearching] = useState(false);
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

  // Carregar categorias ao inicializar
  useEffect(() => {
    if (isConnected) {
      loadCategories();
    }
  }, [isConnected, loadCategories]);

  // Carregar produtos em destaque se conectado
  useEffect(() => {
    if (isConnected && products.length === 0) {
      loadProducts();
    }
  }, [isConnected, products.length, loadProducts]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      if (isConnected) {
        await loadProducts(searchQuery, selectedCategory);
      } else {
        // Busca local
        await searchProducts(searchQuery);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (isConnected && categoryId) {
      setIsSearching(true);
      try {
        await loadProducts(undefined, categoryId);
      } catch (error) {
        console.error('Erro ao carregar categoria:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSort = (field: 'name' | 'price' | 'rating' | 'reviews') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.avgRating;
        bValue = b.avgRating;
        break;
      case 'reviews':
        aValue = a.totalReviews;
        bValue = b.totalReviews;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTrendText = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'Crescendo';
      case 'down':
        return 'Diminuindo';
      default:
        return 'Estável';
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Produtos
          </h1>
          <p className="text-gray-600">
            {isConnected ? 'Produtos do Mercado Livre' : 'Produtos cadastrados'}
          </p>
        </div>
        
        <Link
          to="/produtos/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Não conectado ao Mercado Livre
              </p>
              <p className="text-sm text-yellow-700">
                Conecte-se para buscar produtos reais e análises de reviews.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          {[
            { key: 'name', label: 'Nome' },
            { key: 'price', label: 'Preço' },
            { key: 'rating', label: 'Avaliação' },
            { key: 'reviews', label: 'Reviews' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key as any)}
              className={`text-sm px-3 py-1 rounded-md transition-colors ${
                sortBy === key
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
              {sortBy === key && (
                <span className="ml-1">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <span className="text-sm text-gray-600">
          {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Products Grid */}
      {isLoading || isSearching ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-600">
            {searchQuery ? 'Tente ajustar sua busca ou filtros.' : 'Adicione produtos para começar.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <Link to={`/produtos/${product.id}`}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {product.marketplace === 'mercadolivre' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      ML
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.avgRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{product.totalReviews} reviews</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(product.trend)}
                      <span className={product.trend === 'up' ? 'text-green-600' : product.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                        {getTrendText(product.trend)}
                      </span>
                    </div>
                  </div>
                  
                  {product.marketplace === 'mercadolivre' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Disponível: {product.availableQuantity || 0}</span>
                        <span>Vendidos: {product.soldQuantity || 0}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
              
              <div className="px-4 pb-4">
                <a
                  href={product.marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ver no marketplace
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
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
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
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
                      {['mercadolivre', 'amazon', 'shopee', 'magazineluiza', 'americanas'].map(marketplace => (
                        <option key={marketplace} value={marketplace}>{marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}</option>
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