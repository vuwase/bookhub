
---

### 3. 📝 `phase.md` file

Here’s a clean template you can edit:

```md
# Phase 2 Submission - BookHub

## 🔗 Live URL
https://bookhub.azurewebsites.net

## 📸 Provisioned Resources

**Azure Container Registry**
- `bookhubacrvuwase2025`

**App Service Plan**
- `bookhub-service-plan`

**App Service**
- `bookhub-app`

**PostgreSQL**
- Dockerized in container

![Screenshot 1](./screenshots/app-service.png)
![Screenshot 2](./screenshots/acr.png)

## 🔁 Pull Request Reviewed

Peer PR link: https://github.com/Ange-Mukundente/agricare-planner/pull/34

## 🤔 Reflection

### Challenges with IaC (Terraform)
- Learning HCL syntax was tricky initially.
- Required trial-and-error with dependencies like `azurerm_app_service_plan`.

### Challenges with Manual Deployment
- Container registry naming required global uniqueness.
- Azure quota limits for free-tier VMs caused authentication and quota errors.

### Lessons Learned
- Importance of retry logic for containers (PostgreSQL startup).
- Role of `depends_on`, retry policies, and Docker health checks.
