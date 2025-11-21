FROM alpine:3.21

# Instalar Node.js y npm en la imagen base Alpine
RUN apk update && apk add nodejs npm

# Directorio de trabajo
WORKDIR /api

# Copiar definiciones de dependencias primero (caching)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Puerto expuesto (coincide con server.js)
EXPOSE 5000

# Comando por defecto
CMD ["node", "server.js"]