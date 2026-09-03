# Build próprio do Kiri:Moto (grid-apps).
# Requer Node >=22 (o npm i falhava com 254 no Node 20).
# Testado: gs-app-server serve /kiri/ com HTTP 200.
FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /grid
RUN git clone --depth 1 https://github.com/GridSpace/grid-apps.git . && \
    npm i --no-audit --no-fund && \
    npm run webpack-ext && \
    npm install -g @gridspace/app-server --no-audit --no-fund

EXPOSE 8080
CMD ["gs-app-server", "--port=8080"]
