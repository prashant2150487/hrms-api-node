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

## ✅ Testing Strategy

Create `src/tests/setup.js`:
```javascript
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
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

## 🎯 Immediate Action Items

1. **Initialize Git repository**
2. **Create package.json and install dependencies**
3. **Setup Sequelize with PostgreSQL**
4. **Create first migration for Tenant, User, Role**
5. **Implement basic authentication**
6. **Create Postman collection for testing**
7. **Setup Docker environment**
8. **Write first unit tests**

## 📚 Key Dependencies to Install

```bash
# Core
npm install express sequelize pg pg-hstore redis jsonwebtoken bcryptjs

# Security
npm install helmet cors express-rate-limit express-mongo-sanitize xss

# Validation
npm install express-validator joi

# File upload
npm install multer multer-s3 aws-sdk

# Queue
npm install bullmq

# Logging
npm install winston morgan

# Utils
npm install uuid moment lodash axios

# Testing
npm install -D jest supertest
```

This structure follows your PRD's module organization and implements all the core requirements including multi-tenancy, RBAC, and the extensive API specification. Start with the foundation (auth + tenant) and progressively add modules based on business priority.