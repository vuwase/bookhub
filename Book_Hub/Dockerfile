# Stage 1: Build frontend
FROM node:18 AS frontend-builder

WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build
RUN echo "=== CONTENTS OF FRONTEND BUILD ===" && ls -la frontend/build


# Stage 2: Build backend
FROM node:18 AS backend

WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend

# Copy frontend build to backend public folder
# COPY --from=frontend-builder /app/frontend/build ./backend/public

# Set working directory and start backend server
WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "server.js"]
