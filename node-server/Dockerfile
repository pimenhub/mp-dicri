FROM alpine:3.21

# Directorio de trabajo
WORKDIR /api

# Copiar definiciones de dependencias primero (caching)
COPY package*.json ./

# Copiar el resto del código
COPY . .

# Puerto expuesto (coincide con server.js)
EXPOSE 5000

# Comando por defecto
CMD ["node", "server.js"]