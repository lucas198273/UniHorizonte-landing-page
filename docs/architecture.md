# Arquitetura — frontend público `construbet-public`

Site público de leitura (blog de viagens white-label). **Sem login, sem admin, sem CRUD.**
Consome apenas rotas **GET públicas** do `backend-cm1.0`.

## 1. Estrutura

```
src/
├── config/env.ts        # import.meta.env validado em boot
├── lib/                 # http.ts (fetch único), errors.ts, queryClient.ts, format.ts, cn.ts
├── types/               # contratos espelhando o backend (única fonte de verdade)
├── api/                 # blog.ts, products.ts — só funções de leitura
├── providers/           # AppProviders (Helmet + QueryClient), TenantProvider
├── hooks/               # useQuery por domínio
├── components/          # ui/ · layout/ · blog/ · products/ · common/
├── pages/               # Home, Blog, Post, Produtos, Produto, 404, Error
├── router/              # createBrowserRouter (todas as rotas públicas)
├── styles/globals.css   # Tailwind v4 (@theme) + typography
└── test/                # setup Vitest + utils
```

## 2. Responsabilidades por camada

| Camada | Faz | Não faz |
|--------|-----|---------|
| Providers | QueryClient, tenant slug | Lógica de página |
| Router | Rotas + layout | Fetch |
| Páginas | Composição + hooks | Fetch direto |
| Hooks | `useQuery` sobre serviços | Estado de UI |
| API services | HTTP tipado | Estado/cache |
| `lib/http.ts` | fetch, headers, erros | Conhecer domínio |

## 3. Fluxo de uma requisição

```
Página → hook (useQuery) → api/blog.ts (só GET) → lib/http.ts (fetch + X-Tenant-Slug)
→ backend-cm1.0 → envelope ApiResponse<T> → hook recebe T / PaginatedData<T>
```

- Todo fetch passa por `apiGet` / `apiGetList` em `lib/http.ts`. **Nenhum outro arquivo chama `fetch`.**
- Erros HTTP/JSON viram `ApiError` (com `status`).
- Listas: o backend devolve `{ success, data: T[], pagination }`; `apiGetList` normaliza para `PaginatedData<T> { items, meta }`.

## 4. Multi-tenant

Toda request envia `X-Tenant-Slug` automaticamente:

1. **Subdomínio** (`clienteA.app.com` → `clienteA`) quando houver;
2. Fallback: `VITE_DEFAULT_TENANT_SLUG` (MVP).

Resolvido em `TenantProvider`; consumível via `useTenant()`. O backend atual ainda ignora o header — enviar é inócuo e prepara o white-label.

## 5. Contratos de tipo

`src/types/` espelha o backend:

- `ApiResponse<T>` — `{ success, data, message?, pagination? }`
- `PaginatedMeta` / `PaginatedData<T>`
- `BlogPost`, `BlogCategoria` — campos snake_case do backend (`title`, `description`, `image_url`, `status: boolean`, etc.)
- `Product`, `ProductCategory` — camelCase como o backend devolve

Se o backend mudar um campo, só estes arquivos mudam.

## 6. Como adicionar uma página

1. Crie `src/pages/MinhaPage.tsx` (composição + hooks, `<Helmet>` para title/description).
2. Adicione a rota em `src/router/routes.tsx` (público, dentro de `PublicLayout`).

## 7. Como adicionar um endpoint GET

1. Tipo em `src/types/`.
2. Função em `src/api/<dominio>.ts` usando `apiGet` (item) ou `apiGetList` (lista).
3. Hook em `src/hooks/` com `useQuery` + `queryKey` estável.
4. Teste em `src/hooks/<hook>.test.ts` mockando o módulo de api.

## 8. Como rodar e testar

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc -b
npm run lint         # eslint .
npm test             # vitest
npm run build        # build de produção
```

Env necessária (`.env` ou `.env.local`):

```
VITE_API_URL=http://localhost:10000
VITE_DEFAULT_TENANT_SLUG=default
```

## 9. Divergências do documento original da missão

1. **Rotas de produto**: backend real usa `/api/product` (singular) e `/api/product-categories` — não `/api/products`.
2. **Categorias do blog**: backend usa `/api/blog/categorias` (pt-BR).
3. **`BlogPost`**: backend real usa `title/description/content/image_url/status:boolean`, não `excerpt/cover_image_url/status:'published'`.
4. **Paginação**: envelope do backend traz `pagination` no topo, não `meta` dentro de `data`; normalizado em `apiGetList`.
5. **Tailwind v4**: não usa `tailwind.config.js` — tokens via `@theme` no `globals.css`.
