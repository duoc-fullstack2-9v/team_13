FROM nginx:alpine

# Opcional: agrega etiquetas o mantiene un maintainer si lo necesitas.

# Copia configuración de Nginx para SPA (fallback a index.html).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia artefactos estáticos ya construidos.
COPY dist/ /usr/share/nginx/html/
