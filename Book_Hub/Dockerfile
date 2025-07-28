# Stage 1: Build frontend
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files and install deps
COPY frontend/package*.json ./
RUN npm install

# Copy all frontend source files
COPY frontend/ ./

# Build frontend
RUN npm run build

# Optional: check that build folder exists (debug)
RUN ls -la /app/frontend/build

# Stage 2: Build backend
FROM node:18 AS backend-builder

WORKDIR /app/backend

# Copy backend package files and install deps
COPY backend/package*.json ./
RUN npm install

# Copy backend source files
COPY backend/ ./

# Copy frontend build from previous stage into backend public folder (adjust if your backend serves static files differently)
COPY --from=frontend-builder /app/frontend/build ./public

EXPOSE 5000

CMD ["node", "server.js"]
