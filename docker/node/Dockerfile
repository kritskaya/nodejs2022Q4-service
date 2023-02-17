FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
CMD ["npm", "run", "prisma:migrate"]
CMD ["npm", "start"]
EXPOSE 4000