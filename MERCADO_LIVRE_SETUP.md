# Configuração da Integração Mercado Livre (Client Credentials)

Este documento explica como configurar a integração real com a API do Mercado Livre usando Client Credentials (Server-to-Server).

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
   - **Tipo de Aplicativo**: Server-to-Server

### 2. Obter Credenciais

Após criar o aplicativo, você receberá:
- **Client ID**: ID único do seu aplicativo
- **Client Secret**: Chave secreta para autenticação

**Importante**: Para aplicações Server-to-Server, não é necessário configurar URLs de redirecionamento.

### 3. Configurar no Projeto

#### Opção A: Variáveis de Ambiente (Recomendado)

1. Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_MERCADO_LIVRE_CLIENT_ID=seu_client_id_aqui
VITE_MERCADO_LIVRE_CLIENT_SECRET=seu_client_secret_aqui
```

2. O arquivo `src/config/mercadolivre.ts` já está configurado para usar essas variáveis.

#### Opção B: Configuração Direta

1. Edite o arquivo `src/config/mercadolivre.ts`
2. Substitua `'YOUR_CLIENT_ID_HERE'` pelo seu Client ID real

### 4. Testar a Integração

1. Execute o projeto: `npm run dev`
2. Acesse: http://localhost:5173/configuracoes
3. Vá para a seção "Marketplaces"
4. Digite seu Client ID e Client Secret
5. Clique em "Salvar Credenciais"
6. O sistema obterá automaticamente o access token

## Fluxo de Autenticação (Client Credentials)

1. **Configuração**: Usuário insere Client ID e Client Secret
2. **Token Request**: Sistema faz requisição para obter access token
3. **Armazenamento**: Token é armazenado no localStorage
4. **Uso**: Sistema usa access token para fazer requisições à API
5. **Renovação**: Token expira e precisa ser renovado manualmente

## Endpoints Utilizados

- **Token**: `https://api.mercadolibre.com/oauth/token`
- **Busca de Produtos**: `https://api.mercadolibre.com/sites/MLB/search`
- **Detalhes do Produto**: `https://api.mercadolibre.com/items/{item_id}`
- **Reviews**: `https://api.mercadolibre.com/reviews/item/{item_id}`

## Vantagens do Client Credentials

✅ **Simplicidade**: Não requer redirecionamento do usuário
✅ **Segurança**: Credenciais ficam no servidor (em produção)
✅ **Performance**: Menos requisições de autenticação
✅ **Controle**: Acesso direto sem intervenção do usuário

## Limitações

⚠️ **Atenção**: Esta abordagem tem algumas limitações:

- **Acesso Limitado**: Não pode acessar dados específicos de um usuário
- **Permissões**: Acesso apenas a dados públicos da API
- **Segurança**: Credenciais expostas no frontend (use backend em produção)

## Segurança

⚠️ **IMPORTANTE**: Esta implementação armazena tokens no localStorage do navegador. Para produção:

1. **Use um backend**: Nunca exponha Client Secret no frontend
2. **HTTPS obrigatório**: Sempre use HTTPS em produção
3. **Rotação de tokens**: Implemente renovação automática
4. **Validação**: Valide sempre as credenciais

## Troubleshooting

### Erro: "Client ID inválido"
- Verifique se o Client ID está correto
- Confirme se o aplicativo está ativo no Portal de Desenvolvedores

### Erro: "Client Secret inválido"
- Verifique se o Client Secret está correto
- Confirme se não há espaços extras

### Erro: "Token expirado"
- O token expira automaticamente
- Configure as credenciais novamente

### Erro: "Não autenticado"
- Verifique se as credenciais foram salvas corretamente
- Tente configurar novamente

## Recursos Adicionais

- [Documentação Oficial da API](https://developers.mercadolivre.com.br/)
- [Portal de Desenvolvedores](https://developers.mercadolivre.com.br/)
- [Client Credentials Flow](https://developers.mercadolivre.com.br/docs/oauth2)

## Suporte

Para dúvidas sobre a API do Mercado Livre:
- [Fórum de Desenvolvedores](https://developers.mercadolivre.com.br/forum)
- [Documentação](https://developers.mercadolivre.com.br/docs) 