import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Crown, 
  Building2, 
  CreditCard, 
  Shield, 
  Headphones, 
  TrendingUp,
  Users,
  MessageSquare,
  BarChart3,
  Bot,
  Mail,
  Smartphone,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      description: 'Perfeito para começar',
      price: { monthly: 0, yearly: 0 },
      icon: Star,
      color: 'gray',
      features: [
        { name: '500 análises por mês', included: true },
        { name: '1 produto conectado', included: true },
        { name: 'Análise básica de sentimento', included: true },
        { name: 'Relatórios mensais', included: true },
        { name: 'Suporte por email', included: true },
        { name: 'Respostas automáticas IA', included: false },
        { name: 'Alertas WhatsApp', included: false },
        { name: 'Análise competitiva', included: false },
        { name: 'API access', included: false },
        { name: 'Suporte prioritário', included: false }
      ],
      popular: false,
      cta: 'Começar Grátis'
    },
    {
      id: 'basic',
      name: 'Básico',
      description: 'Para pequenas empresas',
      price: { monthly: 49, yearly: 490 },
      icon: Zap,
      color: 'blue',
      features: [
        { name: '5.000 análises por mês', included: true },
        { name: '5 produtos conectados', included: true },
        { name: 'Análise avançada de sentimento', included: true },
        { name: 'Relatórios semanais', included: true },
        { name: 'Suporte por email', included: true },
        { name: 'Respostas automáticas IA', included: true },
        { name: 'Alertas WhatsApp', included: true },
        { name: 'Análise competitiva', included: false },
        { name: 'API access', included: false },
        { name: 'Suporte prioritário', included: false }
      ],
      popular: true,
      cta: 'Escolher Básico'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Para empresas em crescimento',
      price: { monthly: 149, yearly: 1490 },
      icon: Crown,
      color: 'purple',
      features: [
        { name: '25.000 análises por mês', included: true },
        { name: '20 produtos conectados', included: true },
        { name: 'Análise completa + IA', included: true },
        { name: 'Relatórios personalizados', included: true },
        { name: 'Suporte prioritário', included: true },
        { name: 'Respostas automáticas IA', included: true },
        { name: 'Alertas WhatsApp + Email', included: true },
        { name: 'Análise competitiva', included: true },
        { name: 'API access', included: true },
        { name: 'Treinamento personalizado', included: false }
      ],
      popular: false,
      cta: 'Escolher Premium'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Para grandes empresas',
      price: { monthly: 499, yearly: 4990 },
      icon: Building2,
      color: 'orange',
      features: [
        { name: 'Análises ilimitadas', included: true },
        { name: 'Produtos ilimitados', included: true },
        { name: 'IA personalizada', included: true },
        { name: 'Relatórios sob demanda', included: true },
        { name: 'Suporte 24/7', included: true },
        { name: 'Respostas automáticas IA', included: true },
        { name: 'Todos os canais de alerta', included: true },
        { name: 'Análise competitiva avançada', included: true },
        { name: 'API completa', included: true },
        { name: 'Treinamento personalizado', included: true }
      ],
      popular: false,
      cta: 'Falar com Vendas'
    }
  ];

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' | 'gradient') => {
    const colors = {
      gray: {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        border: 'border-gray-200',
        gradient: 'from-gray-500 to-gray-600'
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-200',
        gradient: 'from-blue-500 to-blue-600'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-200',
        gradient: 'from-purple-500 to-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        border: 'border-orange-200',
        gradient: 'from-orange-500 to-orange-600'
      }
    };
    return colors[color]?.[variant] || colors.gray[variant];
  };

  const savings = Math.round(((plans[1].price.monthly * 12 - plans[1].price.yearly) / (plans[1].price.monthly * 12)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Planos e Preços
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Escolha o plano ideal para sua empresa e comece a transformar suas avaliações em insights valiosos
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Mensal
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
            Anual
          </span>
          {billingCycle === 'yearly' && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Economize {savings}%
            </span>
          )}
        </motion.div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const isCurrentPlan = user?.plan === plan.id;
          const price = plan.price[billingCycle];
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white/80 backdrop-blur-sm rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all duration-300 ${
                plan.popular 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : isCurrentPlan
                  ? 'border-green-500 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                    Plano Atual
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`h-12 w-12 ${getColorClasses(plan.color, 'bg')} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className={`h-6 w-6 ${getColorClasses(plan.color, 'text')}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      R$ {price.toLocaleString('pt-BR')}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-600 text-sm">
                        /{billingCycle === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    )}
                  </div>

                  {billingCycle === 'yearly' && price > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      R$ {(price / 12).toFixed(0)}/mês quando pago anualmente
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isCurrentPlan}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isCurrentPlan
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                      : `bg-gradient-to-r ${getColorClasses(plan.color, 'gradient')} text-white hover:shadow-lg`
                  }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Plano Atual</span>
                    </>
                  ) : (
                    <>
                      <span>{plan.cta}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Compare todos os recursos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-900">Recursos</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-4 px-4 font-medium text-gray-900">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plans[0].features.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700">{feature.name}</td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="py-3 px-4 text-center">
                      {plan.features[index].included ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Perguntas Frequentes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: 'Posso mudar de plano a qualquer momento?',
              answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente.'
            },
            {
              question: 'Como funciona o período de teste?',
              answer: 'Oferecemos 14 dias grátis para todos os planos pagos. Não é necessário cartão de crédito para começar.'
            },
            {
              question: 'Quais marketplaces são suportados?',
              answer: 'Atualmente suportamos Mercado Livre, Amazon Brasil, Shopee e estamos constantemente adicionando novos marketplaces.'
            },
            {
              question: 'Como funciona a IA para respostas automáticas?',
              answer: 'Nossa IA analisa o contexto da avaliação e gera respostas personalizadas e empáticas em português brasileiro.'
            },
            {
              question: 'Os dados são seguros?',
              answer: 'Sim! Utilizamos criptografia de ponta e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados.'
            },
            {
              question: 'Posso cancelar a qualquer momento?',
              answer: 'Claro! Não há contratos de longo prazo. Você pode cancelar sua assinatura a qualquer momento.'
            }
          ].map((faq, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-gray-900">{faq.question}</h4>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Precisa de um plano personalizado?
          </h3>
          <p className="text-gray-600 mb-6">
            Para empresas com necessidades específicas, oferecemos planos customizados com recursos sob medida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Falar com Vendas</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Smartphone className="h-5 w-5" />
              <span>WhatsApp</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            icon: Shield,
            title: 'Segurança Garantida',
            description: 'Criptografia de ponta e conformidade com LGPD'
          },
          {
            icon: Headphones,
            title: 'Suporte Especializado',
            description: 'Equipe dedicada para ajudar seu negócio crescer'
          },
          {
            icon: TrendingUp,
            title: 'ROI Comprovado',
            description: 'Clientes relatam 40% de melhoria na satisfação'
          }
        ].map((item, index) => (
          <div key={index} className="text-center p-6 bg-white/60 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <item.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Pricing;