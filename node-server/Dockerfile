FROM alpine:3.21

# Directorio de trabajo
WORKDIR /usr/src/app

# Evitar warnings y fijar entorno por defecto
ENV NODE_ENV=production

# Copiar definiciones de dependencias primero (caching)
COPY package*.json ./

# Instalar dependencias (usa npm ci si tienes package-lock.json)
RUN npm ci --only=production || npm install --production

# Copiar el resto del código
COPY . .

# Puerto expuesto (coincide con server.js)
EXPOSE 5000

# Comando por defecto
CMD ["node", "server.js"]