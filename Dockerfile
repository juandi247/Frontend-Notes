FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Desactiva el modo estricto de CI
ENV CI=false

RUN npm run build

CMD ["npm", "start"]
