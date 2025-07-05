/*
  # Dados de exemplo para desenvolvimento

  1. Usuários de exemplo
  2. Produtos de exemplo
  3. Avaliações de exemplo
  4. Alertas de exemplo
  5. Credenciais de marketplace de exemplo
*/

-- Inserir usuários de exemplo
INSERT INTO users (id, email, name, company, plan, is_admin, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@reviewai.com', 'Admin ReviewAI', 'ReviewAI', 'enterprise', true, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('550e8400-e29b-41d4-a716-446655440001', 'joao@empresa.com', 'João Silva', 'Loja Digital Ltda', 'premium', false, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('550e8400-e29b-41d4-a716-446655440002', 'maria@startup.com', 'Maria Santos', 'Startup Tech', 'basic', false, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'),
  ('550e8400-e29b-41d4-a716-446655440003', 'carlos@ecommerce.com', 'Carlos Oliveira', 'E-commerce Plus', 'free', false, 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150')
ON CONFLICT (email) DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO products (id, user_id, name, category, price, marketplace_url, marketplace, image_url, description, avg_rating, total_reviews, recent_reviews, trend, last_analysis) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Smartphone Galaxy Pro Max', 'Eletrônicos', 1899.99, 'https://mercadolivre.com.br/produto/1', 'mercadolivre', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=300', 'Smartphone premium com câmera avançada', 4.2, 1250, 89, 'up', now()),
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Fone Bluetooth Premium', 'Áudio', 299.99, 'https://mercadolivre.com.br/produto/2', 'mercadolivre', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300', 'Fone sem fio com cancelamento de ruído', 3.8, 456, 23, 'down', now()),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Notebook Gaming Ultra', 'Computadores', 3499.99, 'https://mercadolivre.com.br/produto/3', 'mercadolivre', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=300', 'Notebook para jogos com placa de vídeo dedicada', 4.7, 789, 45, 'up', now()),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Smartwatch Fitness', 'Eletrônicos', 599.99, 'https://amazon.com.br/produto/1', 'amazon', 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300', 'Relógio inteligente para atividades físicas', 4.1, 324, 18, 'stable', now())
ON CONFLICT (id) DO NOTHING;

-- Inserir avaliações de exemplo
INSERT INTO reviews (id, product_id, rating, comment, author, review_date, sentiment, category, keywords, ai_response, is_urgent, marketplace_review_id) VALUES
  ('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 5, 'Produto incrível! Chegou muito rápido e a qualidade é excelente. Recomendo!', 'Maria Santos', now() - interval '1 day', 'positive', 'Qualidade', ARRAY['qualidade', 'rápido', 'excelente'], 'Olá Maria! Muito obrigado pelo seu feedback positivo! Ficamos felizes que tenha gostado da qualidade do produto e da rapidez na entrega. Sua recomendação é muito importante para nós! 😊', false, 'ML_REV_001'),
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 2, 'A embalagem chegou danificada e o produto tinha riscos. Decepcionado com a compra.', 'João Oliveira', now() - interval '2 days', 'negative', 'Embalagem', ARRAY['embalagem', 'danificada', 'riscos'], 'Olá João, sentimos muito pelo problema com a embalagem e os riscos no produto. Isso não condiz com nossos padrões de qualidade. Vamos entrar em contato para resolver esta situação rapidamente. Pode nos enviar fotos pelo chat? Faremos a troca imediatamente!', true, 'ML_REV_002'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 4, 'Som muito bom, bateria dura bastante. Só achei um pouco caro.', 'Ana Costa', now() - interval '3 days', 'positive', 'Qualidade', ARRAY['som', 'bateria', 'caro'], 'Olá Ana! Obrigado pela avaliação! Ficamos felizes que tenha gostado da qualidade do som e da duração da bateria. Entendemos sua preocupação com o preço e sempre buscamos oferecer o melhor custo-benefício. Agradecemos seu feedback!', false, 'ML_REV_003'),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 5, 'Notebook perfeito para jogos! Performance excelente e não esquenta muito.', 'Pedro Lima', now() - interval '4 days', 'positive', 'Performance', ARRAY['jogos', 'performance', 'temperatura'], 'Olá Pedro! Que ótimo saber que está satisfeito com a performance do notebook! Realmente investimos muito na refrigeração para manter as temperaturas baixas durante os jogos. Obrigado pela avaliação!', false, 'ML_REV_004'),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 3, 'Smartwatch ok, mas a bateria poderia durar mais. Interface é boa.', 'Carla Souza', now() - interval '5 days', 'neutral', 'Bateria', ARRAY['bateria', 'interface'], null, false, 'AMZ_REV_001')
ON CONFLICT (id) DO NOTHING;

-- Inserir credenciais de marketplace de exemplo
INSERT INTO marketplace_credentials (id, user_id, marketplace, api_key, secret_key, access_token, store_id, webhook_url, is_active, last_sync) VALUES
  ('880e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'mercadolivre', 'ML_API_KEY_123456789', 'ML_SECRET_987654321', 'ML_ACCESS_TOKEN_456789123', 'STORE_ID_123', 'https://api.reviewai.com/webhooks/mercadolivre', true, now()),
  ('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'amazon', 'AMZ_API_KEY_987654321', 'AMZ_SECRET_123456789', 'AMZ_ACCESS_TOKEN_789123456', 'STORE_ID_456', 'https://api.reviewai.com/webhooks/amazon', true, now() - interval '1 hour')
ON CONFLICT (user_id, marketplace) DO NOTHING;

-- Inserir alertas de exemplo
INSERT INTO alerts (id, user_id, product_id, review_id, type, title, message, is_read, action_url) VALUES
  ('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440001', 'critical', 'Avaliação Crítica Recebida', 'Produto "Smartphone Galaxy Pro Max" recebeu avaliação 2 estrelas com reclamação sobre embalagem danificada', false, '/produtos/660e8400-e29b-41d4-a716-446655440000'),
  ('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', null, null, 'warning', 'Tendência Negativa Detectada', 'Aumento de 15% em reclamações sobre entrega nos últimos 7 dias', false, '/analytics'),
  ('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', null, null, 'info', 'Relatório Mensal Disponível', 'Seu relatório de análise de janeiro está pronto para download', true, '/relatorios'),
  ('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', null, null, 'success', 'Integração Concluída', 'Amazon Brasil foi conectado com sucesso', true, '/integracoes')
ON CONFLICT (id) DO NOTHING;

-- Atualizar configurações de usuário de exemplo
UPDATE user_settings 
SET 
  theme = 'light',
  color_scheme = 'blue',
  font_size = 'medium',
  email_notifications = true,
  whatsapp_notifications = true,
  whatsapp_number = '+55 (11) 99999-9999'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE user_settings 
SET 
  theme = 'dark',
  color_scheme = 'purple',
  font_size = 'large',
  compact_mode = true
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';