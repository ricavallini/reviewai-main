# ReviewAI - Sistema de Análise de Avaliações

Sistema SaaS para monitoramento e análise de avaliações de produtos em marketplaces brasileiros, com foco especial na integração com o Mercado Livre.

## 🚀 Funcionalidades

- **Dashboard Analítico** com métricas em tempo real
- **Integração com Mercado Livre** via API oficial
- **Análise de Sentimento** automática das avaliações
- **Sistema de Alertas** para reviews críticos
- **Respostas Automáticas** com IA
- **Relatórios Personalizados**
- **Interface Responsiva** e moderna

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **APIs**: Mercado Livre API, Google Analytics
- **Deploy**: Vercel/Netlify

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase
- Aplicação registrada no Portal de Desenvolvedores do Mercado Livre

## 🔧 Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/ricavallini/reviewai-main.git
cd reviewai-main
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Mercado Livre API Configuration
VITE_MERCADO_LIVRE_CLIENT_ID=seu_client_id_do_mercadolivre
VITE_MERCADO_LIVRE_CLIENT_SECRET=seu_client_secret_do_mercadolivre
VITE_MERCADO_LIVRE_REDIRECT_URI=http://localhost:5173/auth/callback

# App Configuration
VITE_APP_NAME=ReviewAI
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

### 4. Configure o Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute as migrações do banco de dados:

```bash
npx supabase db push
```

### 5. Configure o Mercado Livre

1. Acesse o [Portal de Desenvolvedores do Mercado Livre](https://developers.mercadolivre.com.br)
2. Crie uma nova aplicação
3. Configure as permissões necessárias:
   - `read_products` - Leitura de produtos
   - `read_reviews` - Leitura de avaliações
   - `read_user` - Informações do usuário
4. Configure a URL de redirecionamento: `http://localhost:5173/auth/callback`
5. Copie o Client ID e Client Secret para o arquivo `.env.local`

### 6. Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## 🔌 Integração com Mercado Livre

### Fluxo de Autenticação

1. **Configuração Inicial**: O usuário configura suas credenciais na página de integrações
2. **Autenticação OAuth**: O sistema redireciona para o Mercado Livre para autorização
3. **Callback**: Após autorização, o usuário retorna com um código de autorização
4. **Token Exchange**: O sistema troca o código por um access token
5. **Sincronização**: Produtos e avaliações são sincronizados automaticamente

### Endpoints Utilizados

- `GET /users/me` - Informações do usuário
- `GET /users/{user_id}/items/search` - Produtos do usuário
- `GET /items/{item_id}/reviews` - Avaliações de um produto
- `GET /users/{user_id}/reviews` - Todas as avaliações do usuário
- `POST /oauth/token` - Autenticação e renovação de tokens

### Sincronização de Dados

- **Produtos**: Informações básicas, preços, categorias, imagens
- **Avaliações**: Ratings, comentários, autores, datas
- **Análise**: Sentimento, palavras-chave, categorização automática
- **Estatísticas**: Totais, médias, tendências

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Autenticação
│   ├── Dashboard/      # Componentes do dashboard
│   ├── Layout/         # Layout principal
│   └── Settings/       # Configurações
├── contexts/           # Contextos React
├── hooks/              # Hooks personalizados
├── lib/                # Bibliotecas e configurações
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
└── types/              # Definições de tipos TypeScript
```

## 🔐 Segurança

- **Credenciais Criptografadas**: Tokens armazenados de forma segura no Supabase
- **RLS (Row Level Security)**: Usuários só acessam seus próprios dados
- **Rate Limiting**: Controle de requisições à API do Mercado Livre
- **Validação**: Validação de entrada em todos os formulários

## 🚀 Deploy

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📈 Monitoramento

- **Logs**: Logs detalhados de sincronização
- **Métricas**: Performance da API e sincronização
- **Alertas**: Notificações para falhas e problemas
- **Dashboard**: Visão geral do sistema

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

- **Documentação**: [docs.reviewai.com](https://docs.reviewai.com)
- **Issues**: [GitHub Issues](https://github.com/ricavallini/reviewai-main/issues)
- **Email**: suporte@reviewai.com

## 🔄 Changelog

### v1.0.0
- ✅ Integração completa com API do Mercado Livre
- ✅ Sistema de autenticação OAuth
- ✅ Sincronização automática de produtos e avaliações
- ✅ Análise de sentimento automática
- ✅ Dashboard com métricas em tempo real
- ✅ Sistema de alertas e notificações
- ✅ Interface responsiva e moderna 