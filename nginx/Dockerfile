FROM nginx:alpine
# config e landing embutidos na imagem (evita bind-mount que o Coolify quebra)
COPY default.conf /etc/nginx/conf.d/default.conf
COPY landing/ /usr/share/nginx/landing/
