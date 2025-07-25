# Stage 1: Build dependencies
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Run
FROM node:18

WORKDIR /app
COPY --from=builder /app .

EXPOSE 4000

CMD ["node", "server.js"]
