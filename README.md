
# 📚 BookHub Fullstack Application

**BookHub** is a fullstack web application for discovering and managing books. It consists of a Node.js + PostgreSQL backend and a React frontend. The app is containerized using Docker and deployed via Azure.

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

* `DB_HOST`
* `DB_USER`
* `DB_PASSWORD`
* `DB_NAME`

Frontend may use:

* `REACT_APP_API_URL` — URL to access the backend

---

## 🌐 Public Deployment

### 🔧 Backend

The backend is containerized and configured to run via Docker. Refer to `phase.md` for setup and deployment instructions.
🔗 [https://bookhub-backend.azurewebsites.net](https://bookhub-backend.azurewebsites.net)

### 🖥️ Frontend

The frontend is deployed to **Azure App Service** and accessible publicly:

🔗 [https://bookhub-frontend.azurewebsites.net](https://bookhub-frontend.azurewebsites.net)

---

## 📝 Features

* 📖 Book discovery interface
* 🔐 User authentication
* 🌍 Multilingual support
* 📍 Geolocation-aware search
* 🔔 Real-time notifications (coming soon)

## 👩‍💻 Contributors

* Vaste Uwase

## 📄 Notes

* Uses PostgreSQL with PostGIS for spatial data
* Docker ensures consistent development and deployment
* Code and CI/CD integrated via GitHub & Azure

  <!-- This change was made for peer review branch -->
