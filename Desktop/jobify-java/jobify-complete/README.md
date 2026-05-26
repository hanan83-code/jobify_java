# Jobify – Full-Stack Job Platform

A production-ready job board platform for Ethiopia, built with React (frontend) and Spring Boot (backend).

---

## 🚀 Quick Start

### Option A: Frontend Only (Standalone Demo)
The React app includes a complete in-memory database simulation — works with NO backend required.

```bash
cd jobify-frontend
npm install
npm start
```
Open http://localhost:3000 — fully functional with demo data.

---

### Option B: Full Stack (Frontend + Spring Boot Backend)

#### 1. Backend
```bash
cd jobify-backend
# H2 in-memory DB (no setup needed):
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# OR MySQL:
# Edit src/main/resources/application-mysql.properties with your DB details
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```
Backend runs on http://localhost:8080

#### 2. Frontend
```bash
cd jobify-frontend
npm install
npm start
```
Frontend proxies API calls to http://localhost:8080 automatically.

---

## 🔐 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@jobify.dev | Password123! | Admin |
| employer@jobify.dev | Password123! | Employer |
| seeker@jobify.dev | Password123! | Job Seeker |

---

## 🗄️ Database

- **H2 (default):** Auto-configured, no setup needed. Data resets on restart.
- **MySQL:** Create a database named `jobify`, then run `jobify-sql/schema.sql`, and update `application-mysql.properties`.

---

## 📁 Project Structure

```
jobify-complete/
├── jobify-frontend/         # React app (standalone + backend-connected)
│   ├── src/
│   │   └── App.jsx          # All-in-one: router, pages, components, DB
│   ├── public/
│   └── package.json
├── jobify-backend/          # Spring Boot REST API
│   ├── src/main/java/com/jobify/
│   │   ├── controller/      # REST endpoints
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Spring Data repos
│   │   ├── security/        # JWT auth
│   │   └── DataSeeder.java  # Seeds demo data on startup
│   └── src/main/resources/
│       ├── application.properties
│       ├── application-h2.properties
│       └── application-mysql.properties
└── jobify-sql/
    └── schema.sql           # MySQL schema
```

---

## ✨ Features

### Job Seeker
- Browse & search jobs (keyword, location, category, type)
- View job details and apply with cover letter
- Track application status in dashboard

### Employer
- Post job listings with full details
- View applicants per job
- Update applicant status (Pending → Shortlisted → Hired)

### Admin Panel (`/admin`)
- Overview stats dashboard
- Manage all users (roles, enable/disable)
- Manage all jobs (status, delete)
- Verify/unverify companies
- View all applications
- Add/delete job categories
