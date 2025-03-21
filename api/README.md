# API de Sincronização de Pedidos

Esta API é responsável por sincronizar o status dos pedidos entre duas bases do Supabase: uma para os entregadores e outra para os restaurantes.

## Requisitos

- Node.js 18+
- NPM ou Yarn
- Duas bases do Supabase configuradas

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
4. Configure as variáveis de ambiente no arquivo `.env` com suas credenciais do Supabase

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## Produção

Para build e execução em produção:

```bash
npm run build
npm start
```

## Endpoints

### Atualizar Status do Pedido

```http
PUT /api/orders/:orderId/status
```

**Headers:**
```
Authorization: Bearer seu_token_jwt
Content-Type: application/json
```

**Body:**
```json
{
  "status": "novo_status"
}
```

**Resposta de Sucesso:**
```json
{
  "success": true
}
```

**Códigos de Erro:**
- 400: Dados inválidos
- 401: Não autorizado
- 500: Erro interno do servidor

## Teste de Saúde

```http
GET /health
```

**Resposta:**
```json
{
  "status": "ok"
}
``` 