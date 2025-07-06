# Configuração da Integração Mercado Livre no Netlify

Este documento explica como configurar a integração com Mercado Livre especificamente para deploy no Netlify.

## URLs do Seu Site

**URL Principal:** https://reviewai-main.netlify.app

**URL de Callback OAuth:** https://reviewai-main.netlify.app/auth/callback

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
   - **Tipo**: Web

### 3. Configurar URLs de Redirecionamento

Na seção "URLs de Redirecionamento", adicione:

**Para Desenvolvimento:**
```
http://localhost:5173/auth/callback
```

**Para Produção (Netlify):**
```
https://reviewai-main.netlify.app/auth/callback
```

### 4. Salvar e Obter Credenciais

1. Clique em "Salvar"
2. Anote o **Client ID** gerado
3. **NÃO** use o Client Secret no frontend

## Configurar Variáveis de Ambiente no Netlify

### 1. Acesse o Painel do Netlify

1. Vá para: https://app.netlify.com/
2. Selecione seu projeto `reviewai-main`
3. Vá em "Site settings" → "Environment variables"

### 2. Adicionar Variável de Ambiente

1. Clique em "Add a variable"
2. Configure:
   - **Key**: `VITE_MERCADO_LIVRE_CLIENT_ID`
   - **Value**: `seu_client_id_aqui` (substitua pelo Client ID real)
3. Clique em "Save"

### 3. Fazer Novo Deploy

Após adicionar a variável de ambiente:

1. Vá em "Deploys"
2. Clique em "Trigger deploy" → "Deploy site"
3. Aguarde o deploy completar

## Testar a Integração

### 1. Acesse o Site

1. Vá para: https://reviewai-main.netlify.app
2. Faça login (usuário mock será criado automaticamente)

### 2. Configurar Integração

1. Vá em "Configurações" → "Marketplaces"
2. Clique em "Conectar" no Mercado Livre
3. Siga o fluxo de autorização OAuth

### 3. Verificar Funcionamento

Após conectar, você deve ver:
- Status: "Conectado"
- Produtos reais do seu Mercado Livre
- Reviews reais dos produtos

## Troubleshooting

### Erro: "URL de redirecionamento inválida"

**Solução:**
1. Verifique se a URL está exatamente como: `https://reviewai-main.netlify.app/auth/callback`
2. Confirme que não há espaços extras
3. Verifique se o aplicativo está ativo no Portal de Desenvolvedores

### Erro: "Client ID inválido"

**Solução:**
1. Verifique se a variável `VITE_MERCADO_LIVRE_CLIENT_ID` está configurada no Netlify
2. Confirme se o valor está correto
3. Faça um novo deploy após configurar a variável

### Erro: "Estado inválido"

**Solução:**
1. Limpe o cache do navegador
2. Tente novamente a autenticação
3. Verifique se não há múltiplas abas abertas

### Erro: "Token expirado"

**Solução:**
1. O sistema deve renovar automaticamente
2. Se persistir, faça logout e conecte novamente
3. Verifique se o refresh_token está sendo armazenado

## Configuração de Domínio Personalizado (Opcional)

Se você quiser usar um domínio personalizado:

1. No Netlify, vá em "Domain settings"
2. Adicione seu domínio personalizado
3. Atualize a URL de redirecionamento no Portal de Desenvolvedores:
   ```
   https://seudominio.com/auth/callback
   ```
4. Atualize o arquivo `src/config/mercadolivre.ts` com a nova URL

## Segurança

⚠️ **IMPORTANTE:**

1. **Nunca exponha o Client Secret** no frontend
2. **Use sempre HTTPS** em produção
3. **Configure CORS** adequadamente se necessário
4. **Monitore os logs** do Netlify para detectar problemas

## Suporte

- **Netlify**: https://docs.netlify.com/
- **Mercado Livre API**: https://developers.mercadolivre.com.br/
- **Issues do Projeto**: GitHub do projeto

## Próximos Passos

Após configurar com sucesso:

1. Teste a sincronização de produtos
2. Verifique se os reviews estão sendo carregados
3. Configure notificações automáticas (se necessário)
4. Monitore o uso da API 