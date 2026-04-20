# Employee API Endpoints Documentation

## Base URL
```
POST /api/v1/employees
GET /api/v1/employees
GET /api/v1/employees/{id}
PATCH /api/v1/employees/{id}
DELETE /api/v1/employees/{id}
```

---

## 1. CREATE EMPLOYEE
**POST** `/api/v1/employees`

**Authentication**: Required (Bearer Token)  
**Authorization**: admin, hr_admin roles only  
**Permission**: `employees:create`

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_jwt_token>"
}
```

### Request Body (Payload)
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@company.com",
  "personal_email": "john.personal@gmail.com",
  "emp_code": "EMP001",
  "phone_primary": "+1-555-0123",
  "date_of_joining": "2026-05-01",
  "employment_type": "full_time",
  "role_id": 2
}
```

### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| first_name | string | Yes | Employee's first name |
| last_name | string | Yes | Employee's last name |
| email | string | Yes | Work email (used for login) |
| personal_email | string | No | Personal email address |
| emp_code | string | Yes | Unique employee code |
| phone_primary | string | No | Primary contact number |
| date_of_joining | date | Yes | Joining date (YYYY-MM-DD format) |
| employment_type | string | No | Default: "full_time". Options: "full_time", "part_time", "contract", "intern" |
| role_id | number | Yes | Role ID (must exist in database) |

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "user_id": 5,
    "first_name": "John",
    "last_name": "Doe",
    "personal_email": "john.personal@gmail.com",
    "emp_code": "EMP001",
    "phone_primary": "+1-555-0123",
    "date_of_joining": "2026-05-01",
    "employment_type": "full_time",
    "created_at": "2026-04-20T10:30:00.000Z",
    "updated_at": "2026-04-20T10:30:00.000Z"
  }
}
```

### Error Responses

**400 Bad Request** - Missing required fields
```json
{
  "success": false,
  "message": "Missing required fields: first_name, last_name, emp_code, date_of_joining, email, role_id"
}
```

**404 Not Found** - Role not found
```json
{
  "success": false,
  "message": "Role not found"
}
```

**409 Conflict** - Employee code already exists
```json
{
  "success": false,
  "message": "Employee code already exists"
}
```

**409 Conflict** - Email already exists
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "Database connection failed"
}
```

---

## 2. GET ALL EMPLOYEES
**GET** `/api/v1/employees?page=1&limit=10&search=john`

**Authentication**: Required  
**Authorization**: admin, hr_admin, manager roles  
**Permission**: `employees:read`

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Records per page |
| search | string | No | "" | Search by first_name, last_name, email, or emp_code |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Employees fetched successfully",
  "data": {
    "count": 25,
    "totalPages": 3,
    "currentPage": 1,
    "employees": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "personal_email": "john.personal@gmail.com",
        "emp_code": "EMP001",
        "phone_primary": "+1-555-0123",
        "date_of_joining": "2026-05-01",
        "status": "active",
        "department_id": 3,
        "designation_id": 5,
        "manager_id": null,
        "work_location_id": 1,
        "employment_type": "full_time",
        "probation_end_date": "2026-08-01",
        "date_of_leaving": null,
        "exit_reason": null
      }
    ]
  }
}
```

---

## 3. GET EMPLOYEE BY ID
**GET** `/api/v1/employees/{id}`

**Authentication**: Required  
**Authorization**: admin, hr_admin, manager, or self  
**Permission**: `employees:read`

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Employee ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Employee fetched successfully",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "user_id": 5,
    "first_name": "John",
    "last_name": "Doe",
    "personal_email": "john.personal@gmail.com",
    "emp_code": "EMP001",
    "phone_primary": "+1-555-0123",
    "date_of_joining": "2026-05-01",
    "status": "active",
    "department_id": 3,
    "designation_id": 5,
    "manager_id": null,
    "employment_type": "full_time",
    "probation_end_date": "2026-08-01",
    "date_of_leaving": null,
    "exit_reason": null,
    "created_at": "2026-04-20T10:30:00.000Z",
    "updated_at": "2026-04-20T10:30:00.000Z"
  }
}
```

### Error Response (404)
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## 4. UPDATE EMPLOYEE
**PATCH** `/api/v1/employees/{id}`

**Authentication**: Required  
**Authorization**: admin, hr_admin roles only  
**Permission**: `employees:update`

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Employee ID |

### Request Body (Payload)
```json
{
  "first_name": "Jonathan",
  "last_name": "Doe",
  "date_of_joining": "2026-05-01"
}
```

### Request Body Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| first_name | string | No | Updated first name |
| last_name | string | No | Updated last name |
| date_of_joining | date | No | Updated joining date |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "user_id": 5,
    "first_name": "Jonathan",
    "last_name": "Doe",
    "personal_email": "john.personal@gmail.com",
    "emp_code": "EMP001",
    "phone_primary": "+1-555-0123",
    "date_of_joining": "2026-05-01",
    "employment_type": "full_time",
    "updated_at": "2026-04-20T11:45:00.000Z"
  }
}
```

### Error Response (404)
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## 5. DELETE EMPLOYEE (Soft Delete)
**DELETE** `/api/v1/employees/{id}`

**Authentication**: Required  
**Authorization**: admin, hr_admin roles only  

### URL Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Employee ID |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": {
    "id": 1,
    "tenant_id": 1,
    "deleted_at": "2026-04-20T12:00:00.000Z"
  }
}
```

### Error Response (404)
```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

## SAMPLE CURL REQUESTS

### Create Employee
```bash
curl -X POST http://localhost:3000/api/v1/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "personal_email": "john.personal@gmail.com",
    "emp_code": "EMP001",
    "phone_primary": "+1-555-0123",
    "date_of_joining": "2026-05-01",
    "employment_type": "full_time",
    "role_id": 2
  }'
```

### Get All Employees
```bash
curl -X GET "http://localhost:3000/api/v1/employees?page=1&limit=10&search=john" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Get Employee by ID
```bash
curl -X GET http://localhost:3000/api/v1/employees/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Update Employee
```bash
curl -X PATCH http://localhost:3000/api/v1/employees/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "first_name": "Jonathan",
    "last_name": "Doe"
  }'
```

### Delete Employee
```bash
curl -X DELETE http://localhost:3000/api/v1/employees/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## NOTES
- All date fields should be in `YYYY-MM-DD` format
- Employee codes must be unique within a tenant
- Email addresses must be unique within a tenant
- Deletion is soft-delete (paranoid mode) - employee records are retained with `deleted_at` timestamp
- Default password for new employees is temporary and should be changed on first login
- All endpoints require valid JWT authentication token
- Tenant ID is automatically derived from the authenticated user's context
