// Formatar moeda brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Formatar número com separadores
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

// Formatar data
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Formatar data e hora
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Formatar data relativa (ex: "há 2 dias")
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Hoje';
  } else if (diffInDays === 1) {
    return 'Ontem';
  } else if (diffInDays < 7) {
    return `Há ${diffInDays} dias`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Há ${months} mês${months > 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `Há ${years} ano${years > 1 ? 's' : ''}`;
  }
};

// Formatar porcentagem
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Formatar rating (estrelas)
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Formatar texto longo com truncamento
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Formatar ID do produto do Mercado Livre
export const formatMercadoLivreId = (id: string): string => {
  return `MLB${id}`;
};

// Formatar condição do produto
export const formatCondition = (condition: string): string => {
  const conditions: { [key: string]: string } = {
    'new': 'Novo',
    'used': 'Usado',
    'not_specified': 'Não especificado'
  };
  
  return conditions[condition] || condition;
};

// Formatar status do produto
export const formatStatus = (status: string): string => {
  const statuses: { [key: string]: string } = {
    'active': 'Ativo',
    'paused': 'Pausado',
    'closed': 'Fechado',
    'under_review': 'Em revisão'
  };
  
  return statuses[status] || status;
}; 