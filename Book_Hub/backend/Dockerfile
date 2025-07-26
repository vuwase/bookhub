# Stage 1: Build frontend
FROM node:18 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend with frontend build included
FROM node:18 AS backend-builder

WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Copy frontend build files from frontend-builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose the backend port
EXPOSE 4000

# Start the backend server
CMD ["node", "server.js"]
