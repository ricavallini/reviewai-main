# Configuração da Integração Mercado Livre

Este documento explica como configurar a integração real com a API do Mercado Livre.

## Pré-requisitos

1. Conta no Mercado Livre
2. Acesso ao Portal de Desenvolvedores do Mercado Livre

## Passo a Passo

### 1. Criar Aplicativo no Portal de Desenvolvedores

1. Acesse: https://developers.mercadolivre.com.br/
2. Faça login com sua conta do Mercado Livre
3. Clique em "Criar Aplicativo"
4. Preencha os dados:
   - **Nome do Aplicativo**: ReviewAI (ou outro nome)
   - **Descrição**: Sistema de análise de reviews de produtos
   - **Categoria**: E-commerce
   - **Tipo de Aplicativo**: Web

### 2. Configurar URLs de Redirecionamento

No seu aplicativo criado, configure as URLs de redirecionamento:

**Para Desenvolvimento:**
```
http://localhost:5173/auth/callback
```

**Para Produção (Netlify):**
```
https://reviewai-main.netlify.app/auth/callback
```

**Se você tiver uma URL personalizada no Netlify, use:**
```
https://sua-url-personalizada.netlify.app/auth/callback
```

### 3. Obter Credenciais

Após criar o aplicativo, você receberá:
- **Client ID**: ID único do seu aplicativo
- **Client Secret**: Chave secreta (NÃO use no frontend)

### 4. Configurar no Projeto

#### Opção A: Variável de Ambiente (Recomendado)

1. Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_MERCADO_LIVRE_CLIENT_ID=seu_client_id_aqui
```

2. O arquivo `src/config/mercadolivre.ts` já está configurado para usar essa variável.

#### Opção B: Configuração Direta

1. Edite o arquivo `src/config/mercadolivre.ts`
2. Substitua `'YOUR_CLIENT_ID_HERE'` pelo seu Client ID real

### 5. Testar a Integração

1. Execute o projeto: `npm run dev`
2. Acesse: http://localhost:5173/configuracoes
3. Vá para a seção "Marketplaces"
4. Clique em "Conectar" no Mercado Livre
5. Siga o fluxo de autorização OAuth

## Fluxo de Autenticação

1. **Início**: Usuário clica em "Conectar" no Mercado Livre
2. **Redirecionamento**: Usuário é redirecionado para o Mercado Livre para autorizar
3. **Autorização**: Usuário autoriza o aplicativo
4. **Callback**: Mercado Livre redireciona de volta com código de autorização
5. **Troca de Token**: Sistema troca o código por access_token e refresh_token
6. **Armazenamento**: Tokens são armazenados no localStorage (em produção, use backend seguro)
7. **Uso**: Sistema usa access_token para fazer requisições à API

## Endpoints Utilizados

- **Autenticação**: `https://auth.mercadolivre.com.br/authorization`
- **Token**: `https://api.mercadolibre.com/oauth/token`
- **Usuário**: `https://api.mercadolibre.com/users/me`
- **Produtos**: `https://api.mercadolibre.com/users/{user_id}/items/search`
- **Reviews**: `https://api.mercadolibre.com/reviews/item/{item_id}`

## Segurança

⚠️ **IMPORTANTE**: Esta implementação armazena tokens no localStorage do navegador. Para produção:

1. **Use um backend**: Nunca exponha tokens no frontend
2. **HTTPS obrigatório**: Sempre use HTTPS em produção
3. **Refresh tokens**: Implemente renovação automática de tokens
4. **Validação**: Valide sempre os parâmetros de callback

## Troubleshooting

### Erro: "Client ID inválido"
- Verifique se o Client ID está correto
- Confirme se o aplicativo está ativo no Portal de Desenvolvedores

### Erro: "URL de redirecionamento inválida"
- Verifique se a URL está configurada corretamente no Portal de Desenvolvedores
- Para desenvolvimento: `http://localhost:5173/auth/callback`
- Para produção: `https://reviewai-main.netlify.app/auth/callback`

### Erro: "Estado inválido"
- Limpe o localStorage do navegador
- Tente novamente a autenticação

### Erro: "Token expirado"
- O sistema deve renovar automaticamente
- Se persistir, faça logout e conecte novamente

## Recursos Adicionais

- [Documentação Oficial da API](https://developers.mercadolivre.com.br/)
- [Portal de Desenvolvedores](https://developers.mercadolivre.com.br/)
- [Exemplos de Integração](https://github.com/mercadolibre/developer-examples)

## Suporte

Para dúvidas sobre a API do Mercado Livre:
- [Fórum de Desenvolvedores](https://developers.mercadolivre.com.br/forum)
- [Documentação](https://developers.mercadolivre.com.br/docs) 