# Deploy do Uni3D no Coolify

Domínio: **uni3d.unicontroller.com.br**

## 1. Novo recurso
Coolify › New Resource › **Docker Compose** › aponta pro repo `jacksontomelin/uni3d`, branch `main`.

## 2. Environment Variables
Cola as variáveis (ver `.env.example`). A única que você preenche é a `DATABASE_URL`,
com os dados do Postgres que você já criou:

```
DATABASE_URL=postgresql+asyncpg://USUARIO:SENHA@HOST_INTERNO:5432/uni3d
```

- Use `postgresql+asyncpg://` (backend é async), não `postgresql://`.
- `HOST_INTERNO` = nome do serviço Postgres no Coolify (mesma rede/projeto).
- Crie o database `uni3d` no seu Postgres antes (ou aponte pro `postgres` default).

## 3. Domínio
No serviço **nginx**, configura o domínio `uni3d.unicontroller.com.br` (porta 80).
O Coolify emite o SSL (Let's Encrypt) na frente.

## 4. Deploy
Sobe 5 serviços: minio, kirimoto, backend, frontend, nginx.
No primeiro boot o backend cria as tabelas automaticamente (create_all no lifespan).

## Rotas
- `/` → landing page
- `/login`, `/projetos`, `/imagem-3d`, `/fatiador` → app
- `/api/*` → backend FastAPI  ·  `/slicer/` → Kiri:Moto
