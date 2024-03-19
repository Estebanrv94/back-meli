# Usamos una imagen base de Node.js versión 14.17.6
FROM node:14.17.6

# Establecemos el directorio de trabajo en la imagen
WORKDIR /app

# Copiamos el archivo package.json y package-lock.json a la imagen
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto de los archivos de la aplicación a la imagen
COPY . .

# Exponemos el puerto en el que el contenedor estará escuchando
EXPOSE 10000

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["node", "server.js"]
