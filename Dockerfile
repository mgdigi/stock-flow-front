# Étape 1: Build de l'application
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src/ ./src/
COPY pages/ ./pages/
COPY public/ ./public/
COPY index.html ./

# Créer le fichier d'environnement pour la production
ARG VITE_API_BASE_URL
RUN echo "VITE_API_BASE_URL=${VITE_API_BASE_URL}" > .env

# Build de l'application
RUN npm run build

# Étape 2: Serveur de production
FROM nginx:alpine

# Copier les fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
