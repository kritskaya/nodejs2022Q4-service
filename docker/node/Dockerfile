# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# COPY prisma ./prisma/
# RUN npm ci
# COPY . .
# CMD ["npm", "run", "prisma:migrate:start"]
# EXPOSE 4000

FROM node:18 as build

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .

FROM node:18-alpine as main

COPY --from=build /app ./
CMD ["npm", "run", "prisma:migrate:start"]
EXPOSE 4000