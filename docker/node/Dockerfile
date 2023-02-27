FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i && npm cache clean --force
COPY . .
CMD ["npm", "run", "prisma:start:dev"]
EXPOSE ${PORT}