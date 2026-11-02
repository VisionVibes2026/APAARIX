# APAARIX — APAAR-Based Student Verification & Enrolment Intelligence for AICTE

**Problem Statement:** SIH 2026 – PS 26263  
**Domain:** Education Technology | Student Identity Verification | Regulatory Compliance | Enrolment Intelligence  

---

## 🏛️ Project Architecture Overview

APAARIX is an enterprise-grade platform engineered for the All India Council for Technical Education (AICTE) to validate, manage, and monitor student enrolment across technical institutions using the Automated Permanent Academic Account Registry (APAAR ID) as the national unique academic identifier.

### Technical Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18+, Vite, Tailwind CSS, React Router DOM, Lucide React, Recharts, Axios, Framer Motion |
| **Backend** | Java 21/24, Spring Boot 3.3.5, Spring Web, Spring Data JPA, Spring Security, Hibernate, Bean Validation, Maven |
| **Database** | PostgreSQL 16 (Production/Container profile) & Embedded PostgreSQL-compatible H2 (Instant Zero-Setup Dev profile) |
| **Containerization** | Docker & Docker Compose |

---

## 📁 Repository Structure

```
AicteProjectFile/
├── docker-compose.yml                      # PostgreSQL 16 & pgAdmin 4 local infrastructure
├── README.md                               # Master technical documentation
├── backend/                                # Spring Boot 3.3.5 REST backend
│   ├── pom.xml                             # Maven build definition & dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/apaarix/
│       │   │   ├── ApaarixApplication.java # Spring Boot entrypoint
│       │   │   ├── config/
│       │   │   │   └── CorsConfig.java     # Enterprise CORS filter configuration
│       │   │   ├── controller/
│       │   │   │   └── HealthController.java # /api/v1/health & /api/v1/system/info
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java    # Standardized API response envelope
│       │   │   │   └── SystemInfoResponse.java # JVM & Database diagnostic metrics
│       │   │   ├── exception/
│       │   │   │   └── GlobalExceptionHandler.java # Centralized exception handling
│       │   │   ├── security/
│       │   │   │   └── SecurityConfig.java # Stateless security & endpoint permissions
│       │   │   └── util/
│       │   │       └── DateTimeUtils.java  # ISO & IST timestamp formatters
│       │   └── resources/
│       │       ├── application.properties  # Default application configuration (H2 dev)
│       │       ├── application-postgres.properties # PostgreSQL dedicated profile
│       │       └── init-db.sql             # Database initialization script
│       └── test/
│           └── java/com/apaarix/
│               └── ApaarixApplicationTests.java # Context loading & endpoint tests
└── frontend/                               # React 18+ Vite Frontend
    ├── package.json                        # Dependencies & build scripts
    ├── vite.config.js                      # Vite bundler & backend proxy config
    ├── tailwind.config.js                  # Ant Design Pro & Vercel design tokens
    ├── postcss.config.js                   # CSS processing
    ├── index.html                          # HTML shell with Inter & Outfit typography
    ├── .env.example                        # Template environment variables
    ├── .env                                # Local development variables
    └── src/
        ├── index.css                       # Tailwind layers & custom scrollbars
        ├── main.jsx                        # React root mounter
        ├── App.jsx                         # Phase 1 diagnostic console & system monitor
        └── services/
            └── api.js                      # Axios instance with interceptors & systemService
```

---

## 🚀 Running the Application

### 1. Prerequisites
- **Java 21 or higher**
- **Apache Maven 3.9+**
- **Node.js 18+ and npm 9+**
- *(Optional)* Docker Desktop (if running PostgreSQL via container)

---

### 2. Backend Setup & Startup

#### Development Mode (Embedded Zero-Config Database):
```bash
cd backend
mvn clean package -DskipTests
java -jar target/apaarix-backend-1.0.0-SNAPSHOT.jar
```
Or directly using Maven:
```bash
cd backend
mvn spring-boot:run
```
The backend starts at `http://localhost:8080`.

#### PostgreSQL Database Mode (Container or Local Server):
1. Start PostgreSQL using Docker Compose:
```bash
docker compose up -d
```
2. Run backend with the `postgres` profile active:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=postgres
```
Or override database credentials via environment variables:
```bash
export DB_URL=jdbc:postgresql://localhost:5432/apaarix_db
export DB_USERNAME=postgres
export DB_PASSWORD=postgrespassword
mvn spring-boot:run
```

---

### 3. Frontend Setup & Startup

```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📡 API Testing & Verification

### 1. Health Probe Endpoint
- **URL:** `GET http://localhost:8080/api/v1/health`
- **Purpose:** Verifies backend liveness, service state, and database connectivity.
- **Sample Output:**
```json
{
  "success": true,
  "message": "Service is healthy and operational",
  "data": {
    "status": "UP",
    "service": "apaarix-backend",
    "version": "1.0.0",
    "databaseConnected": true,
    "databaseEngine": "H2 2.2.224 (2023-09-17)",
    "timestamp": "2026-11-01T15:20:52.030972500Z"
  },
  "timestamp": "2026-11-01T15:20:52.031977200Z"
}
```

### 2. System Diagnostics Endpoint
- **URL:** `GET http://localhost:8080/api/v1/system/info`
- **Purpose:** Returns server memory usage, active profile, and database details.
- **Sample Output:**
```json
{
  "success": true,
  "message": "System status retrieved successfully",
  "data": {
    "name": "APAARIX - Student Verification & Enrolment Intelligence for AICTE",
    "version": "1.0.0-PROTOTYPE",
    "status": "ONLINE",
    "activeProfile": "default",
    "database": {
      "connected": true,
      "productName": "H2",
      "url": "jdbc:h2:mem:apaarix_dev",
      "user": "SA"
    },
    "memory": {
      "availableProcessors": 8,
      "freeMemoryMb": 25,
      "totalMemoryMb": 64,
      "maxMemoryMb": 1982
    }
  },
  "timestamp": "2026-11-01T15:20:52.609721700Z"
}
```

---

## 🗺️ Master Execution Roadmap

- [x] **Phase 1 — Foundation & Connectivity:** Complete project scaffolding, layered architecture, Spring Boot 3.3.5 REST backend, React 18+ Vite frontend, hybrid PostgreSQL/H2 persistence, CORS, Health APIs, and end-to-end verified communication.
- [ ] **Phase 2 — Enterprise UI & Navigation:** Ant Design Pro layout, collapsible left sidebar, top header, breadcrumb navigation, role switcher, theme toggle, and reusable cards/drawers.
- [ ] **Phase 3 — Authentication & RBAC:** Multi-role JWT security (AICTE Admin, Institution Admin, Student, Authorized Verifier).
- [ ] **Phase 4 — Student & Institution Data:** Normalized PostgreSQL schemas, JPA repositories, CRUD APIs, and CSV/Excel batch ingestion engine.
- [ ] **Phase 5 — Intelligence Engines:** APAAR mock verification adapter, cross-institution duplicate enrolment detection, and SeatGuard intake compliance.
- [ ] **Phase 6 — Trusted Records & QR Verification:** Student portal, digitally verifiable enrolment credentials, tamper protection, and public QR verification view.
- [ ] **Phase 7 — SIH 2026 Evaluator Demo:** Executive analytics dashboards, audit trails, and 1-click synthetic demo dataset reset.

