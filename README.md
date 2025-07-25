# BookHub Backend

This is the backend of the BookHub application, containerized using Docker.

## 🐳 Local Development with Docker

### Prerequisites

- Docker & Docker Compose installed
- Node.js & PostgreSQL if running without Docker

### 🚀 Run with Docker Compose

```bash
docker-compose up --build

🛑 Stop the containers
docker-compose down

📦 Environment Variables
Configured in docker-compose.yml, including:

DB_HOST

DB_USER

DB_PASSWORD

DB_NAME

🌐 Public Deployment
See phase.md for deployment details.
