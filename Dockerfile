# Usa una imagen base de Node.js
FROM node:16-alpine AS build

# Configurar el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación de React
RUN npm run build

# Usar un servidor web para servir los archivos estáticos
FROM nginx:stable-alpine

# Copiar los archivos de la build de React al servidor web
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
