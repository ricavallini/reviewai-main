/*
  # Schema inicial para ReviewAI - Sistema de Análise de Avaliações

  1. Novas Tabelas
    - `users` - Usuários do sistema
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `company` (text)
      - `plan` (enum: free, basic, premium, enterprise)
      - `is_admin` (boolean)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products` - Produtos monitorados
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `name` (text)
      - `category` (text)
      - `price` (decimal)
      - `marketplace_url` (text)
      - `marketplace` (text)
      - `image_url` (text)
      - `description` (text)
      - `avg_rating` (decimal)
      - `total_reviews` (integer)
      - `recent_reviews` (integer)
      - `trend` (enum: up, down, stable)
      - `last_analysis` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `reviews` - Avaliações coletadas
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `author` (text)
      - `review_date` (timestamp)
      - `sentiment` (enum: positive, negative, neutral)
      - `category` (text)
      - `keywords` (text array)
      - `ai_response` (text)
      - `is_urgent` (boolean)
      - `marketplace_review_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `marketplace_credentials` - Credenciais dos marketplaces
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `marketplace` (text)
      - `api_key` (text, encrypted)
      - `secret_key` (text, encrypted)
      - `access_token` (text, encrypted)
      - `store_id` (text)
      - `webhook_url` (text)
      - `is_active` (boolean)
      - `last_sync` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `alerts` - Alertas e notificações
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key, nullable)
      - `review_id` (uuid, foreign key, nullable)
      - `type` (enum: critical, warning, info, success)
      - `title` (text)
      - `message` (text)
      - `is_read` (boolean)
      - `action_url` (text)
      - `created_at` (timestamp)

    - `user_settings` - Configurações do usuário
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `theme` (enum: light, dark, auto)
      - `color_scheme` (enum: blue, green, purple, orange)
      - `font_size` (enum: small, medium, large)
      - `sidebar_collapsed` (boolean)
      - `animations` (boolean)
      - `compact_mode` (boolean)
      - `email_notifications` (boolean)
      - `whatsapp_notifications` (boolean)
      - `push_notifications` (boolean)
      - `whatsapp_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados acessarem apenas seus próprios dados
    - Políticas especiais para administradores

  3. Índices
    - Índices para melhorar performance de consultas frequentes
    - Índices compostos para filtros comuns

  4. Triggers
    - Triggers para atualizar timestamps automaticamente
    - Triggers para manter estatísticas atualizadas
*/

-- Criar tipos enum
CREATE TYPE user_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE product_trend AS ENUM ('up', 'down', 'stable');
CREATE TYPE review_sentiment AS ENUM ('positive', 'negative', 'neutral');
CREATE TYPE alert_type AS ENUM ('critical', 'warning', 'info', 'success');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'auto');
CREATE TYPE color_scheme AS ENUM ('blue', 'green', 'purple', 'orange');
CREATE TYPE font_size AS ENUM ('small', 'medium', 'large');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  company text,
  plan user_plan DEFAULT 'free',
  is_admin boolean DEFAULT false,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  marketplace_url text NOT NULL,
  marketplace text,
  image_url text,
  description text,
  avg_rating decimal(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  recent_reviews integer DEFAULT 0,
  trend product_trend DEFAULT 'stable',
  last_analysis timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  author text NOT NULL,
  review_date timestamptz NOT NULL,
  sentiment review_sentiment DEFAULT 'neutral',
  category text,
  keywords text[] DEFAULT '{}',
  ai_response text,
  is_urgent boolean DEFAULT false,
  marketplace_review_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de credenciais de marketplace
CREATE TABLE IF NOT EXISTS marketplace_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  marketplace text NOT NULL,
  api_key text,
  secret_key text,
  access_token text,
  store_id text,
  webhook_url text,
  is_active boolean DEFAULT true,
  last_sync timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, marketplace)
);

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  review_id uuid REFERENCES reviews(id) ON DELETE CASCADE,
  type alert_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme theme_type DEFAULT 'light',
  color_scheme color_scheme DEFAULT 'blue',
  font_size font_size DEFAULT 'medium',
  sidebar_collapsed boolean DEFAULT false,
  animations boolean DEFAULT true,
  compact_mode boolean DEFAULT false,
  email_notifications boolean DEFAULT true,
  whatsapp_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT false,
  whatsapp_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Políticas RLS para products
CREATE POLICY "Users can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas RLS para reviews
CREATE POLICY "Users can read reviews of own products"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reviews for own products"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update reviews of own products"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM products WHERE user_id = auth.uid()
    )
  );

-- Políticas RLS para marketplace_credentials
CREATE POLICY "Users can manage own credentials"
  ON marketplace_credentials
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas RLS para alerts
CREATE POLICY "Users can read own alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas RLS para user_settings
CREATE POLICY "Users can manage own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para administradores
CREATE POLICY "Admins can read all data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_marketplace ON products(marketplace);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON reviews(sentiment);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_review_date ON reviews(review_date DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_is_urgent ON reviews(is_urgent);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_credentials_user_id ON marketplace_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_credentials_marketplace ON marketplace_credentials(marketplace);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_credentials_updated_at
  BEFORE UPDATE ON marketplace_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar estatísticas do produto
CREATE OR REPLACE FUNCTION update_product_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar estatísticas quando uma review é inserida, atualizada ou deletada
  UPDATE products 
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    recent_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND review_date >= now() - interval '30 days'
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers para atualizar estatísticas do produto
CREATE TRIGGER update_product_stats_on_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stats();

CREATE TRIGGER update_product_stats_on_review_update
  AFTER UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stats();

CREATE TRIGGER update_product_stats_on_review_delete
  AFTER DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stats();

-- Função para criar configurações padrão do usuário
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para criar configurações padrão quando um usuário é criado
CREATE TRIGGER create_user_settings_on_signup
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_settings();