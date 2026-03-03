# Production Dockerfile for Universal Archive Management System - Backend
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads

EXPOSE 5000

USER node

CMD ["node", "server.js"]
