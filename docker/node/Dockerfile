# FROM node:18 as build

# WORKDIR /app
# COPY package*.json ./
# RUN npm ci && npm cache clean --force
# COPY . .

# FROM node:18-alpine as main
# WORKDIR /app
# COPY --from=build /app /app
# CMD ["npm", "run", "prisma:start:dev"]
# EXPOSE ${PORT}

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i && npm cache clean --force
COPY . .
CMD ["npm", "run", "prisma:start:dev"]
EXPOSE ${PORT}