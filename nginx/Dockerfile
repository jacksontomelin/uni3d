# Build do frontend + nginx servindo tudo. Contexto = raiz do projeto.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY frontend/package.json ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY landing/ /usr/share/nginx/landing/
COPY --from=build /app/dist /usr/share/nginx/app/
