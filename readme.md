# Express.js HRMS API - Project Structure & Setup Guide

Based on your HRMS PRD document and Express.js technology stack, here's a comprehensive project structure and implementation roadmap.

## 📁 Recommended Folder Structure

```
hrms-api/
├── src/
│   ├── config/
│   │   ├── database.js           # Sequelize configuration
│   │   ├── redis.js              # Redis client for BullMQ
│   │   ├── aws.js                # AWS S3 configuration
│   │   ├── passport.js           # JWT strategies
│   │   └── constants.js          # App constants
│   │
│   ├── models/
│   │   ├── index.js              # Sequelize models aggregator
│   │   ├── Tenant.model.js
│   │   ├── User.model.js
│   │   ├── Role.model.js
│   │   ├── Permission.model.js
│   │   ├── Employee.model.js
│   │   ├── Department.model.js
│   │   ├── Designation.model.js
│   │   ├── Payroll/
│   │   │   ├── PayrollRun.model.js
│   │   │   ├── PaySlip.model.js
│   │   │   └── SalaryComponent.model.js
│   │   ├── Leave/
│   │   │   ├── LeavePolicy.model.js
│   │   │   ├── LeaveRequest.model.js
│   │   │   └── LeaveBalance.model.js
│   │   ├── Attendance/
│   │   │   ├── AttendanceRecord.model.js
│   │   │   └── Shift.model.js
│   │   ├── Recruitment/
│   │   │   ├── JobPosting.model.js
│   │   │   ├── Application.model.js
│   │   │   └── Interview.model.js
│   │   ├── Performance/
│   │   │   ├── ReviewCycle.model.js
│   │   │   ├── Review.model.js
│   │   │   └── Goal.model.js
│   │   ├── Training/
│   │   │   ├── Course.model.js
│   │   │   └── Enrollment.model.js
│   │   ├── Expense.model.js
│   │   ├── Asset.model.js
│   │   ├── Document.model.js
│   │   └── AuditLog.model.js
│   │
│   ├── migrations/                # Sequelize migrations
│   ├── seeders/                    # Seed data
│   │
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication
│   │   ├── rbac.js                 # Role-based access control
│   │   ├── tenant.js               # Multi-tenancy middleware
│   │   ├── validator.js            # Request validation
│   │   ├── rateLimiter.js          # Rate limiting
│   │   ├── auditLogger.js          # Audit log middleware
│   │   ├── errorHandler.js         # Global error handler
│   │   └── upload.js               # Multer S3 upload config
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── queue.service.js        # BullMQ service
│   │   ├── s3.service.js
│   │   ├── notification.service.js
│   │   ├── search.service.js       # Elasticsearch (optional)
│   │   ├── payroll/
│   │   │   ├── calculator.service.js
│   │   │   └── exporter.service.js
│   │   ├── report/
│   │   │   ├── generator.service.js
│   │   │   └── exporter.service.js
│   │   └── websocket.service.js    # Real-time updates
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── tenant.controller.js
│   │   ├── user.controller.js
│   │   ├── employee.controller.js
│   │   ├── department.controller.js
│   │   ├── payroll.controller.js
│   │   ├── leave.controller.js
│   │   ├── attendance.controller.js
│   │   ├── recruitment.controller.js
│   │   ├── performance.controller.js
│   │   ├── training.controller.js
│   │   ├── expense.controller.js
│   │   ├── asset.controller.js
│   │   ├── document.controller.js
│   │   ├── notification.controller.js
│   │   ├── report.controller.js
│   │   ├── audit.controller.js
│   │   └── admin.controller.js
│   │
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── index.js
│   │   │   ├── auth.routes.js
│   │   │   ├── tenant.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── payroll.routes.js
│   │   │   ├── leave.routes.js
│   │   │   ├── attendance.routes.js
│   │   │   ├── recruitment.routes.js
│   │   │   ├── performance.routes.js
│   │   │   ├── training.routes.js
│   │   │   ├── expense.routes.js
│   │   │   ├── asset.routes.js
│   │   │   ├── document.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── report.routes.js
│   │   │   ├── audit.routes.js
│   │   │   └── admin.routes.js
│   │   └── webhook.routes.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── employee.validator.js
│   │   ├── leave.validator.js
│   │   └── ... (module-wise validators)
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   ├── enums.js
│   │   ├── permissions.js         # Permission constants
│   │   ├── logger.js               # Winston logger
│   │   ├── apiResponse.js          # Standard response formatter
│   │   ├── apiError.js              # Custom error classes
│   │   ├── encryption.js            # Data encryption utilities
│   │   └── pdfGenerator.js
│   │
│   ├── jobs/
│   │   ├── workers/
│   │   │   ├── email.worker.js
│   │   │   ├── payroll.worker.js
│   │   │   ├── report.worker.js
│   │   │   ├── import.worker.js
│   │   │   └── notification.worker.js
│   │   └── queues.js               # Queue definitions
│   │
│   ├── templates/
│   │   ├── emails/
│   │   ├── documents/               # PDF templates
│   │   └── reports/
│   │
│   ├── docs/
│   │   ├── swagger.yaml
│   │   └── postman-collection.json
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── fixtures/
│   │   └── setup.js
│   │
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
│
├── scripts/
│   ├── seed.js
│   ├── migrate.js
│   └── backup.js
│
├── .env.example
├── .gitignore
├── .sequelizerc                    # Sequelize CLI config
├── ecosystem.config.js             # PM2 config
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
└── README.md
```

## 🚀 Development Roadmap: Where to Start

### **Phase 1: Foundation (Week 1-2)**

#### Step 1: Project Setup & Configuration
```bash
# Initialize project
npm init -y
npm install express sequelize pg pg-hstore redis bullmq jsonwebtoken bcryptjs dotenv cors helmet express-rate-limit winston

# Dev dependencies
npm install -D nodemon jest supertest sequelize-cli @types/node
```

#### Step 2: Database Models (Priority Order)
1. **Core Models** (must be done first):
   - `Tenant.model.js` - Multi-tenancy foundation
   - `Role.model.js` & `Permission.model.js` - RBAC foundation
   - `User.model.js` - Authentication base

2. **Run migrations**:
```bash
npx sequelize-cli model:generate --name Tenant --attributes name:string,subdomain:string,plan:string,isActive:boolean
npx sequelize-cli model:generate --name Role --attributes name:string,tenantId:uuid
npx sequelize-cli model:generate --name User --attributes email:string,password:string,tenantId:uuid,roleId:uuid
```

#### Step 3: Authentication & RBAC Middleware
Create these files in order:
1. `src/middleware/auth.js` - JWT verification
2. `src/middleware/tenant.js` - Extract tenant from JWT
3. `src/middleware/rbac.js` - Permission checking
4. `src/controllers/auth.controller.js` - Login/register
5. `src/routes/v1/auth.routes.js`

### **Phase 2: Core HR Features (Week 3-4)**

#### Priority 1: Employee Management
Start with the most critical endpoints from PRD section 4.4:
- `POST /employees/` - Create employee
- `GET /employees/` - List with filtering
- `GET /employees/{id}` - Get details
- `PATCH /employees/{id}` - Update

#### Priority 2: Department & Designation
Complete sections 4.5 to support employee management

### **Phase 3: Leave & Attendance (Week 5)**

Implement from PRD sections 4.7 and 4.8:
- Leave policies and balances
- Leave request workflow
- Basic attendance check-in/out

### **Phase 4: Advanced Features (Week 6+)**

Continue with remaining modules in this order:
1. Payroll (section 4.6)
2. Recruitment (section 4.9)
3. Performance (section 4.10)
4. Documents & Assets (sections 4.13, 4.14)
5. Reports & Analytics (section 4.16)

## 🔧 Key Implementation Files to Create First

### 1. Database Configuration (`src/config/database.js`)
```javascript
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgresql',
    logging: console.log
  },
  test: { ... },
  production: { ... }
};
```

### 2. Auth Middleware (`src/middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) throw new Error('User not found');
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

### 3. RBAC Middleware (`src/middleware/rbac.js`)
```javascript
const hasPermission = (permission) => {
  return async (req, res, next) => {
    const userRole = await req.user.getRole({
      include: ['permissions']
    });
    
    const hasPerm = userRole.permissions.some(p => p.name === permission);
    
    if (!hasPerm) {
      return res.status(403).json({
        error: 'PERMISSION_DENIED',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};
```

### 4. Server Entry Point (`src/server.js`)
```javascript
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection failed:', err);
  });
```

## 📊 Initial API Endpoints to Implement

Based on your PRD, start with these endpoints in order:

### **Day 1-2: Authentication**
```
POST   /api/v1/auth/register     # Register tenant + super-admin
POST   /api/v1/auth/login        # Get JWT tokens
POST   /api/v1/auth/refresh      # Refresh access token
GET    /api/v1/auth/me           # Get current user
```

### **Day 3-4: Tenant & Users**
```
GET    /api/v1/tenants/{id}      # Get tenant details
GET    /api/v1/users             # List users
POST   /api/v1/users             # Create user
GET    /api/v1/roles             # List roles
```

### **Day 5-7: Employees**
```
GET    /api/v1/employees         # List employees
POST   /api/v1/employees         # Create employee
GET    /api/v1/employees/{id}    # Get employee details
PATCH  /api/v1/employees/{id}    # Update employee
GET    /api/v1/departments       # List departments
```

## 🐳 Docker Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: hrms
      POSTGRES_USER: hrms_user
      POSTGRES_PASSWORD: hrms_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    volumes:
      - ./src:/app/src

volumes:
  postgres_data:
```



## 📝 Environment Variables

`.env.example`:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=hrms-uploads

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS
```




## 📖 Overview

This repository contains the **Enterprise HRMS (Human Resource Management System)** — a large-scale, multi-tenant platform designed to manage the full employee lifecycle. The system provides a robust REST API consumed by a React admin panel and mobile clients, with a strong emphasis on role-based access control (RBAC), scalability, and compliance (GDPR, PDPA).

The platform is built with a **Node.js** backend, containerized with **Docker**, and deployed on **AWS** to support horizontal scaling for organizations of any size.

---

## 🏗️ Architecture & Technology Stack

| Category | Technology |
| :--- | :--- |
| **Backend** | Node.js (v20), Express.js, TypeScript |
| **Database** | PostgreSQL 16 (Primary), Redis (Cache & Queue Broker) |
| **Auth** | JWT (Access/Refresh), OAuth2 (Google/MS), TOTP MFA |
| **File Storage** | AWS S3 |
| **Search** | Elasticsearch 8 |
| **Queue/Jobs** | BullMQ (Redis-based) |
| **Infra** | Docker, AWS ECS (Fargate), AWS RDS, AWS ElastiCache, AWS ALB |
| **Monitoring** | AWS CloudWatch, Sentry, Prometheus (optional) |

---

## 👥 Role Hierarchy & Access Control

The system implements a strict, hierarchical RBAC model. Access is defined per module, ensuring data isolation and security.

| Role | Description |
| :--- | :--- |
| **Super Admin** | **Platform Owner.** Has unrestricted access across *all* tenants. Responsible for system configuration, billing, global user management, and auditing the entire platform. Cannot be created through standard flows. |
| **Admin** | **Software Purchaser/Tenant Owner.** This role is assigned to the primary contact who purchases the software for their company. They have full control over *their specific tenant* (company/subsidiary) but no access to other tenants or the platform's core system settings. This role inherits all permissions of an HR Admin but is the "root" user for their tenant. |
| **HR Admin** | Full HR operations within their tenant: employee CRUD, payroll, leave policies, and reports. |
| **Manager** | Team lead; approves leave, views team attendance, and manages performance for direct reports. |
| **Employee** | Self-service access: profile, leave requests, payslips, and own data. |
| *Other Roles* | Recruiter, Finance, Auditor (each with specific, granular permissions as defined in the PRD). |

> **Key Distinction:** A **Super Admin** manages the platform (e.g., creating new tenants, viewing all system logs). An **Admin** is the highest role *within a tenant* and manages their company's instance.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- Docker and Docker Compose (for local development)
- AWS CLI (for deployment)
- PostgreSQL client (psql)

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd hrms-backend
    ```

2.  **Copy the environment variables:**
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and fill in the required values (database credentials, JWT secret, etc.).

3.  **Start dependencies (PostgreSQL, Redis) using Docker Compose:**
    ```bash
    docker-compose up -d postgres redis
    ```

4.  **Install dependencies and run migrations:**
    ```bash
    npm install
    npx prisma migrate dev  # or your ORM's migration command
    ```

5.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The API will be available at `http://localhost:3000/api/v1`.

---

## 🐳 Docker & AWS Deployment

The application is designed to be fully containerized and deployed on AWS.

### Containerization

A `Dockerfile` is provided to build the Node.js application image. The `docker-compose.yml` file is used for local orchestration of the app and its dependencies.

### AWS Deployment Strategy

The recommended deployment architecture on AWS is:

- **Compute:** **AWS ECS (Elastic Container Service) with Fargate.** This allows for serverless, containerized deployments. Multiple ECS services are created for:
    - `api`: The main Express.js application.
    - `worker`: A BullMQ worker process to handle background jobs (payroll, emails, reports).
    - `scheduler`: A process running `node-cron` or similar for scheduled tasks.
- **Database:** **AWS RDS for PostgreSQL** with Multi-AZ deployment for high availability.
- **Caching & Queue:** **AWS ElastiCache for Redis** (cluster mode disabled for simple queue/cache).
- **Load Balancing:** **Application Load Balancer (ALB)** to distribute traffic to the `api` service.
- **Networking:** Services are deployed in private subnets, with the ALB in public subnets.
- **Storage:** **AWS S3** for all file uploads (documents, payslips, avatars).
- **CI/CD:** **GitHub Actions** configured to build the Docker image, push to **Amazon ECR**, and trigger a new ECS deployment upon push to the `main` branch.

---

## 📚 API Reference

All endpoints are prefixed with `/api/v1/`. Authentication is via JWT Bearer token.

- **Base URL:** `https://api.your-domain.com/api/v1/`
- **Auth Header:** `Authorization: Bearer <access_token>`
- **Format:** JSON
- **Pagination:** `?page=1&page_size=25`
- **Filtering:** `?field=value`
- **Search:** `?search=keyword`

### Key Endpoints

A complete Postman/OpenAPI collection is available in `/docs`. Key functional areas include:

| Module | Example Endpoints |
| :--- | :--- |
| **Authentication** | `POST /auth/login`, `POST /auth/register`, `POST /auth/mfa/setup` |
| **Tenant & Admin** | `GET /tenants` (Super Admin only), `PATCH /tenants/{id}/settings` |
| **Employees** | `GET /employees`, `POST /employees`, `GET /employees/org-chart` |
| **Payroll** | `GET /payroll/runs`, `POST /payroll/runs/{id}/process` |
| **Leave** | `POST /leave/requests`, `POST /leave/requests/{id}/approve` |
| **Recruitment** | `GET /recruitment/jobs`, `POST /recruitment/applications` |
| **Performance** | `GET /performance/cycles`, `POST /performance/goals` |
| **Reports** | `GET /reports/headcount`, `POST /reports/export` |

---

## 🔒 Security & Compliance

- **Authentication:** JWT tokens with 15-minute access and 7-day refresh, stored in HttpOnly cookies.
- **MFA:** TOTP-based 2FA is enforced for Admin, HR Admin, and Finance roles.
- **Authorization:** RBAC is enforced at the controller/middleware level. Row-level security ensures users can only access their own or their subordinates' data.
- **Data Encryption:** Sensitive PII (e.g., salary, tax IDs) is encrypted at rest using AWS KMS and application-level encryption.
- **Audit Logging:** Every create, update, delete, and export action is logged immutably with actor, timestamp, and IP address.
- **Compliance:** Built to support GDPR and PDPA data portability (export) and erasure (right to be forgotten) requests.

---

## 📊 Monitoring & Observability

- **Application Logs:** Streamed to **AWS CloudWatch Logs** from ECS containers.
- **Performance Metrics:** **AWS CloudWatch** monitors ECS, RDS, and ElastiCache health. Custom business metrics (e.g., payroll run duration) are exposed via a `/metrics` endpoint for Prometheus.
- **Error Tracking:** **Sentry** is integrated to capture and alert on unhandled exceptions and performance bottlenecks.

---

## 📁 Project Structure

```
hrms-backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models (e.g., Prisma, Sequelize)
│   ├── middlewares/     # Auth, RBAC, tenant resolution, validation
│   ├── routes/          # API route definitions (grouped by module)
│   ├── utils/           # Helper functions, logger
│   ├── workers/         # BullMQ job processors
│   └── app.js           # Express app initialization
├── docker-compose.yml
├── Dockerfile
├── .github/workflows/   # CI/CD pipelines
└── package.json
```

---

## 🤝 Contributing

1.  Create a feature branch from `develop`.
2.  Write clear, tested code following the established ESLint/Prettier rules.
3.  Ensure all existing tests pass (`npm test`).
4.  Open a pull request with a detailed description of changes.
5.  The pull request requires at least one approval before merging.

---
