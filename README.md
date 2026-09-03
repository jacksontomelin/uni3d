# Uni3D — SaaS de Impressão 3D

**UniController** · Plataforma completa para gerenciar, visualizar, editar e fatiar modelos 3D direto no navegador.

## Stack

| Camada     | Tecnologia                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18 + Vite + react-three-fiber + Tailwind |
| Backend    | Python 3.12 + FastAPI + SQLAlchemy (async)     |
| Fatiador   | Kiri:Moto (Grid.Space) — MIT, embarcado via iframe |
| Banco      | PostgreSQL 16                                  |
| Storage    | MinIO (S3-compatível, self-hosted)             |
| Proxy      | Nginx                                          |
| Deploy     | Docker Compose / Coolify                       |

## Funcionalidades

- Auth JWT (registro + login)
- Projetos multi-tenant
- Upload de STL, OBJ, 3MF
- Viewer 3D interativo (rotate, zoom, wireframe)
- Fatiador integrado (Kiri:Moto) — gera G-code no browser
- Storage de arquivos via MinIO (presigned URLs)
- Download de G-code

## Rodando localmente

```bash
cp .env.example .env
# Edite o .env com suas senhas

docker-compose up --build
```

Acesse: `http://localhost`

## Deploy no Coolify

1. Crie um novo recurso "Docker Compose"
2. Aponte para este repositório
3. Configure as variáveis de ambiente do `.env.example`
4. Deploy

## Licenças

- Kiri:Moto: MIT (Grid.Space)
- Este projeto: proprietário UniController
