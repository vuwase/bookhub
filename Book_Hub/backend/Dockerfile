# Stage 1: Install dependencies
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Run
FROM node:18

# 👇 Add this line to install netcat
RUN apt-get update && apt-get install -y netcat-openbsd


WORKDIR /app
COPY --from=builder /app .

COPY wait-for-postgres.sh ./
RUN chmod +x wait-for-postgres.sh

EXPOSE 4000
CMD ["./wait-for-postgres.sh", "npm", "start"]
