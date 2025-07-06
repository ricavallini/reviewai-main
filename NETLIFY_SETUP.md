# Configuração da Integração Mercado Livre no Netlify (Client Credentials)

Este documento explica como configurar a integração com Mercado Livre especificamente para deploy no Netlify usando Client Credentials.

## URLs do Seu Site

**URL Principal:** https://reviewai-main.netlify.app

## Passo a Passo para Configurar no Portal de Desenvolvedores

### 1. Acesse o Portal de Desenvolvedores do Mercado Livre

1. Vá para: https://developers.mercadolivre.com.br/
2. Faça login com sua conta do Mercado Livre
3. Acesse "Meus Aplicativos"

### 2. Criar ou Editar Aplicativo

1. Clique em "Criar Aplicativo" (se for novo) ou edite um existente
2. Preencha os dados:
   - **Nome**: ReviewAI
   - **Descrição**: Sistema de análise de reviews de produtos
   - **Categoria**: E-commerce
   - **Tipo**: Server-to-Server

### 3. Obter Credenciais

1. Após criar o aplicativo, você receberá:
   - **Client ID**: ID único do aplicativo
   - **Client Secret**: Chave secreta para autenticação
2. Anote ambos cuidadosamente

**Importante**: Para aplicações Server-to-Server, não é necessário configurar URLs de redirecionamento.

## Configurar Variáveis de Ambiente no Netlify

### 1. Acesse o Painel do Netlify

1. Vá para: https://app.netlify.com/
2. Selecione seu projeto `reviewai-main`
3. Vá em "Site settings" → "Environment variables"

### 2. Adicionar Variáveis de Ambiente

1. Clique em "Add a variable"
2. Adicione as seguintes variáveis:

**Client ID:**
- **Key**: `VITE_MERCADO_LIVRE_CLIENT_ID`
- **Value**: `seu_client_id_aqui` (substitua pelo Client ID real)

**Client Secret:**
- **Key**: `VITE_MERCADO_LIVRE_CLIENT_SECRET`
- **Value**: `seu_client_secret_aqui` (substitua pelo Client Secret real)

3. Clique em "Save" para cada variável

### 3. Fazer Novo Deploy

Após adicionar as variáveis de ambiente:

1. Vá em "Deploys"
2. Clique em "Trigger deploy" → "Deploy site"
3. Aguarde o deploy completar

## Testar a Integração

### 1. Acesse o Site

1. Vá para: https://reviewai-main.netlify.app
2. Faça login (usuário mock será criado automaticamente)

### 2. Configurar Integração

1. Vá em "Configurações" → "Marketplaces"
2. Digite seu Client ID e Client Secret
3. Clique em "Salvar Credenciais"
4. O sistema obterá automaticamente o access token

### 3. Verificar Funcionamento

Após configurar, você deve ver:
- Status: "Conectado"
- Produtos reais do Mercado Livre
- Reviews reais dos produtos

## Vantagens da Abordagem Server-to-Server

✅ **Simplicidade**: Não requer redirecionamento do usuário
✅ **Segurança**: Credenciais ficam no servidor (em produção)
✅ **Performance**: Menos requisições de autenticação
✅ **Controle**: Acesso direto sem intervenção do usuário

## Troubleshooting

### Erro: "Client ID inválido"

**Solução:**
1. Verifique se a variável `VITE_MERCADO_LIVRE_CLIENT_ID` está configurada no Netlify
2. Confirme se o valor está correto
3. Faça um novo deploy após configurar a variável

### Erro: "Client Secret inválido"

**Solução:**
1. Verifique se a variável `VITE_MERCADO_LIVRE_CLIENT_SECRET` está configurada no Netlify
2. Confirme se o valor está correto
3. Verifique se não há espaços extras

### Erro: "Token expirado"

**Solução:**
1. O token expira automaticamente
2. Configure as credenciais novamente
3. O sistema obterá um novo token

### Erro: "Não autenticado"

**Solução:**
1. Verifique se as credenciais foram salvas corretamente
2. Tente configurar novamente
3. Verifique se o aplicativo está ativo no Portal de Desenvolvedores

## Configuração de Domínio Personalizado (Opcional)

Se você quiser usar um domínio personalizado:

1. No Netlify, vá em "Domain settings"
2. Adicione seu domínio personalizado
3. Atualize as variáveis de ambiente se necessário

## Segurança

⚠️ **IMPORTANTE:**

1. **Nunca exponha o Client Secret** no frontend em produção
2. **Use sempre HTTPS** em produção
3. **Configure CORS** adequadamente se necessário
4. **Monitore os logs** do Netlify para detectar problemas
5. **Para produção real, use um backend** para gerenciar as credenciais

## Limitações

⚠️ **Atenção**: Esta abordagem tem algumas limitações:

- **Acesso Limitado**: Não pode acessar dados específicos de um usuário
- **Permissões**: Acesso apenas a dados públicos da API
- **Segurança**: Credenciais expostas no frontend (use backend em produção)

## Suporte

- **Netlify**: https://docs.netlify.com/
- **Mercado Livre API**: https://developers.mercadolivre.com.br/
- **Client Credentials Flow**: https://developers.mercadolivre.com.br/docs/oauth2

## Próximos Passos

Após configurar com sucesso:

1. Teste a busca de produtos
2. Verifique se os reviews estão sendo carregados
3. Configure notificações automáticas (se necessário)
4. Monitore o uso da API
5. Considere implementar um backend para maior segurança 