
# 📚 BookHub Fullstack Application

**BookHub** is a fullstack web application for discovering and managing books. It consists of a Node.js + PostgreSQL backend and a React frontend. The app is containerized using Docker and deployed via Azure.

---

## 🚀 Phase 3: Full Automated Deployment, Monitoring & Professional Release

This section documents enhancements made for **Summative Phase 3**, including automated CI/CD pipelines, DevSecOps practices, and live monitoring.

---

### 🌍 Live URLs

| Environment | URL |
|-------------|-----|
| ✅ Staging   | [https://bookhub-frontend-staging.azurewebsites.net](https://bookhub-frontend-staging.azurewebsites.net) |
| ✅ Production| [https://bookhub-frontend.azurewebsites.net](https://bookhub-frontend.azurewebsites.net) |

---

### 🎥 Demo Video

📹 [Click here to watch the demo video]

---

### 🔁 CI/CD Pipeline Highlights

- Full GitHub Actions pipeline for build → test → security scan → deployment
- `develop` branch auto-deploys to **staging**
- `main` branch triggers **manual production deployment** (with approvals)
- Docker image pushed to **Azure Container Registry (ACR)**

---

### 🔐 DevSecOps Integration

- `npm audit` checks for dependency vulnerabilities
- `Trivy` scans Docker images before pushing to ACR
- Security scan results are logged in CI/CD run output
- All critical vulnerabilities are addressed before deployment

---

### 📊 Monitoring & Observability

- Azure Application Insights used for both frontend and backend
- Azure Monitor dashboards track performance, availability, and logs
- Alerts configured:
  - CPU usage > 75%
  - Request failures over 1 minute

---

### 📓 CHANGELOG

View detailed version updates in [`CHANGELOG.md`](./CHANGELOG.md)

---

## 📦 Project Structure

Book\_Hub/
├── backend/       # Node.js API backend
├── frontend/      # React frontend
├── docker-compose.yml
├── README.md
└── phase.md

## 🐳 Local Development with Docker

### ▶️ Start the App

```bash
docker-compose up --build
````

### ⏹️ Stop the App

```bash
docker-compose down
```

---

## ⚙️ Environment Variables

Environment variables are configured in `docker-compose.yml` and `.env` files. Key backend variables include:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Frontend may use:

- `REACT_APP_API_URL` — URL to access the backend

---

## 🌐 Public Deployment

### 🔧 Backend

The backend is containerized and configured to run via Docker. Refer to `phase.md` for setup and deployment instructions.

### 🖥️ Frontend

The frontend is deployed to **Azure App Service** and accessible publicly:

🔗 [https://bookhub-frontend.azurewebsites.net](https://bookhub-frontend.azurewebsites.net)

---

## 📝 Features

- 📖 Book discovery interface
- 🔐 User authentication
- 🌍 Multilingual support
- 📍 Geolocation-aware search
- 🔔 Real-time notifications (coming soon)

---

## 👩‍💻 Contributors

- Vaste Uwase

---

## 📄 Notes

- Uses PostgreSQL with PostGIS for spatial data
- Docker ensures consistent development and deployment
- Code and CI/CD integrated via GitHub & Azure
