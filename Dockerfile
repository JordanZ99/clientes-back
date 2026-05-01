# 1. FROM: Elegimos la materia prima.
# Usamos una imagen oficial de Node.js (20-alpine es ligera).
FROM node:20-alpine

# 2. WORKDIR: Creamos una carpeta de trabajo dentro del contenedor.
WORKDIR /app

# 3. Copiar y Dependencias: Copiamos el listado de paquetes y los instalamos.
# Esto asegura que Docker cachee esta capa si solo cambia el código.
COPY package*.json ./
RUN npm install

# 4. Copiar Código: Copiamos todo el código de nuestro proyecto (server.js, .env, etc.)
COPY . .

# 5. EXPOSE: Informamos que el puerto 3000 va a ser usado.
# Esto es documentación, no lo abre automáticamente.
EXPOSE 3000

# 6. CMD: El comando final. Indica qué hacer cuando el contenedor se inicie.
# Ejecutar el servidor con Node.js.
CMD ["node", "server.js"]
