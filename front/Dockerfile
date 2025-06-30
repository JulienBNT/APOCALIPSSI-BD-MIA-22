# Étape 1 : build de l'application
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : run en production
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
