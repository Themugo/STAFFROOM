# StaffRoom API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except `/auth/*`) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Full access except system configuration
- **HR_MANAGER**: HR operations, employee management
- **MANAGER**: Department-level management
- **EMPLOYEE**: Read-only access to own data

---

## Authentication Endpoints

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254700000000"
}
```

**Response:** 201 Created
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "role": "EMPLOYEE",
  "employee": {
    "id": "clxxx...",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "role": "EMPLOYEE"
  }
}
```

### GET /auth/profile
Get current user profile.

**Response:** 200 OK
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "role": "EMPLOYEE",
  "employee": {
    "id": "clxxx...",
    "firstName": "John",
    "lastName": "Doe",
    "department": {
      "name": "Engineering"
    }
  }
}
```

---

## Department Endpoints

### GET /departments
Get all departments.

**Query Parameters:**
- `includeHierarchy` (boolean): Include parent/child relationships
- `status` (string): Filter by status (ACTIVE, INACTIVE, ARCHIVED)

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "name": "Engineering",
    "code": "ENG",
    "description": "Software development",
    "location": "Nairobi",
    "budget": 5000000,
    "level": 0,
    "status": "ACTIVE",
    "_count": {
      "employees": 25,
      "positions": 8,
      "subDepartments": 3
    }
  }
]
```

### GET /departments/hierarchy
Get complete organizational hierarchy tree.

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "name": "Engineering",
    "level": 0,
    "children": [
      {
        "id": "clxxx...",
        "name": "Frontend Team",
        "level": 1,
        "children": []
      }
    ]
  }
]
```

### GET /departments/:id
Get department by ID with full details.

**Response:** 200 OK
```json
{
  "id": "clxxx...",
  "name": "Engineering",
  "head": {
    "id": "clxxx...",
    "firstName": "John",
    "lastName": "Doe"
  },
  "employees": [...],
  "positions": [...],
  "workflows": [...],
  "policies": [...]
}
```

### GET /departments/:id/stats
Get department statistics.

**Response:** 200 OK
```json
{
  "employees": 25,
  "positions": 8,
  "subDepartments": 3,
  "workflows": 5,
  "policies": 12,
  "employeesByStatus": [
    { "status": "ACTIVE", "_count": 23 },
    { "status": "ON_LEAVE", "_count": 2 }
  ],
  "totalBudget": 15000000,
  "directBudget": 5000000
}
```

### POST /departments
Create new department.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "name": "Marketing",
  "code": "MKT",
  "description": "Marketing and communications",
  "location": "Nairobi",
  "budget": 3000000,
  "parentDepartmentId": "clxxx...",
  "headId": "clxxx...",
  "settings": {
    "maxEmployees": 50,
    "approvalRequired": true
  }
}
```

**Response:** 201 Created

### PUT /departments/:id
Update department.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "name": "Marketing & Communications",
  "status": "ACTIVE",
  "budget": 3500000
}
```

**Response:** 200 OK

### PUT /departments/:id/head
Assign department head.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "headId": "clxxx..."
}
```

**Response:** 200 OK

### DELETE /departments/:id
Delete department.

**Roles Required:** SUPER_ADMIN, ADMIN

**Response:** 200 OK
```json
{
  "message": "Department deleted successfully"
}
```

---

## Employee Endpoints

### GET /employees
Get all employees.

**Query Parameters:**
- `departmentId` (string): Filter by department
- `status` (string): Filter by status
- `search` (string): Search by name or email

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": {
      "id": "clxxx...",
      "name": "Engineering"
    },
    "position": {
      "id": "clxxx...",
      "title": "Senior Developer"
    },
    "status": "ACTIVE"
  }
]
```

### GET /employees/:id
Get employee by ID.

**Response:** 200 OK
```json
{
  "id": "clxxx...",
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+254700000000",
  "department": {...},
  "position": {...},
  "manager": {...},
  "salary": 150000,
  "hireDate": "2024-01-15T00:00:00.000Z"
}
```

### POST /employees
Create new employee.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+254700000000",
  "departmentId": "clxxx...",
  "positionId": "clxxx...",
  "managerId": "clxxx...",
  "salary": 120000,
  "hireDate": "2024-06-01"
}
```

**Response:** 201 Created

### PUT /employees/:id
Update employee.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Johnson",
  "salary": 130000,
  "status": "ACTIVE"
}
```

**Response:** 200 OK

### DELETE /employees/:id
Delete employee.

**Roles Required:** SUPER_ADMIN, ADMIN

**Response:** 200 OK

---

## Position Endpoints

### GET /positions
Get all positions.

**Query Parameters:**
- `departmentId` (string): Filter by department

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "title": "Senior Developer",
    "description": "Experienced software developer",
    "department": {
      "id": "clxxx...",
      "name": "Engineering"
    },
    "baseSalary": 150000,
    "_count": {
      "employees": 5
    }
  }
]
```

### GET /positions/:id
Get position by ID.

**Response:** 200 OK
```json
{
  "id": "clxxx...",
  "title": "Senior Developer",
  "description": "Experienced software developer",
  "department": {...},
  "baseSalary": 150000,
  "requirements": "5+ years experience",
  "employees": [...]
}
```

### POST /positions
Create new position.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "title": "Junior Developer",
  "description": "Entry-level developer position",
  "departmentId": "clxxx...",
  "baseSalary": 80000,
  "requirements": "1-2 years experience"
}
```

**Response:** 201 Created

### PUT /positions/:id
Update position.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Response:** 200 OK

### DELETE /positions/:id
Delete position.

**Roles Required:** SUPER_ADMIN, ADMIN

**Response:** 200 OK

---

## Attendance Endpoints

### GET /attendance
Get attendance records.

**Query Parameters:**
- `employeeId` (string): Filter by employee
- `date` (string): Filter by date
- `startDate` (string): Start date range
- `endDate` (string): End date range

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "employeeId": "clxxx...",
    "date": "2024-06-12T00:00:00.000Z",
    "checkIn": "2024-06-12T08:00:00.000Z",
    "checkOut": "2024-06-12T17:00:00.000Z",
    "workHours": 8.5,
    "isLate": false,
    "location": "Nairobi Office"
  }
]
```

### GET /attendance/stats
Get attendance statistics.

**Response:** 200 OK
```json
{
  "total": 150,
  "present": 140,
  "absent": 10,
  "late": 5,
  "averageWorkHours": 8.2
}
```

### POST /attendance/check-in
Employee check-in.

**Request Body:**
```json
{
  "employeeId": "clxxx...",
  "location": "Nairobi Office"
}
```

**Response:** 201 Created

### POST /attendance/check-out
Employee check-out.

**Request Body:**
```json
{
  "employeeId": "clxxx..."
}
```

**Response:** 200 OK

---

## Leave Endpoints

### GET /leaves
Get leave requests.

**Query Parameters:**
- `employeeId` (string): Filter by employee
- `status` (string): Filter by status
- `type` (string): Filter by type

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "employeeId": "clxxx...",
    "type": "ANNUAL",
    "startDate": "2024-07-01T00:00:00.000Z",
    "endDate": "2024-07-05T00:00:00.000Z",
    "days": 5,
    "reason": "Family vacation",
    "status": "PENDING",
    "approvedBy": null,
    "approvedAt": null
  }
]
```

### GET /leaves/stats
Get leave statistics.

**Response:** 200 OK
```json
{
  "total": 45,
  "pending": 5,
  "approved": 35,
  "rejected": 5,
  "byType": {
    "ANNUAL": 30,
    "SICK": 10,
    "MATERNITY": 5
  }
}
```

### POST /leaves
Create leave request.

**Request Body:**
```json
{
  "employeeId": "clxxx...",
  "type": "ANNUAL",
  "startDate": "2024-07-01",
  "endDate": "2024-07-05",
  "reason": "Family vacation"
}
```

**Response:** 201 Created

### PUT /leaves/:id/approve
Approve leave request.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER

**Request Body:**
```json
{
  "status": "APPROVED",
  "rejectionReason": null
}
```

**Response:** 200 OK

### PUT /leaves/:id/reject
Reject leave request.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER, MANAGER

**Request Body:**
```json
{
  "status": "REJECTED",
  "rejectionReason": "Insufficient leave balance"
}
```

**Response:** 200 OK

---

## Workflow Endpoints

### GET /workflows
Get all workflows.

**Query Parameters:**
- `departmentId` (string): Filter by department
- `entityType` (string): Filter by entity type (LEAVE, EXPENSE, PROMOTION)
- `status` (string): Filter by status

**Response:** 200 OK
```json
[
  {
    "id": "clxxx...",
    "name": "Leave Approval Workflow",
    "description": "Multi-level leave approval",
    "entityType": "LEAVE",
    "status": "ACTIVE",
    "version": 1,
    "department": {
      "id": "clxxx...",
      "name": "Engineering"
    },
    "_count": {
      "steps": 3,
      "executions": 25
    }
  }
]
```

### GET /workflows/:id
Get workflow by ID with steps and executions.

**Response:** 200 OK
```json
{
  "id": "clxxx...",
  "name": "Leave Approval Workflow",
  "steps": [
    {
      "id": "clxxx...",
      "name": "Manager Approval",
      "type": "APPROVAL",
      "order": 1,
      "config": {
        "approvers": ["clxxx..."]
      }
    }
  ],
  "executions": [...]
}
```

### POST /workflows
Create new workflow.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Request Body:**
```json
{
  "departmentId": "clxxx...",
  "name": "Expense Approval",
  "description": "Expense report approval process",
  "entityType": "EXPENSE",
  "config": {
    "steps": [...]
  }
}
```

**Response:** 201 Created

### PUT /workflows/:id
Update workflow.

**Roles Required:** SUPER_ADMIN, ADMIN, HR_MANAGER

**Response:** 200 OK

### DELETE /workflows/:id
Delete workflow.

**Roles Required:** SUPER_ADMIN, ADMIN

**Response:** 200 OK

### POST /workflows/:workflowId/execute
Execute workflow.

**Request Body:**
```json
{
  "entityId": "clxxx...",
  "entityType": "LEAVE",
  "data": {
    "leaveId": "clxxx...",
    "days": 5
  }
}
```

**Response:** 201 Created

### PUT /workflows/executions/:executionId/steps/:stepId/approve
Approve workflow step.

**Request Body:**
```json
{
  "status": "APPROVED",
  "comments": "Approved"
}
```

**Response:** 200 OK

---

## Error Responses

All endpoints may return error responses:

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": ["Email is required", "Password must be at least 6 characters"]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to process request"
}
```

---

## Rate Limiting
API requests are limited to 100 requests per 15 minutes per IP address.

## CORS
Allowed origins: `http://localhost:5173` (configurable via `FRONTEND_URL` env variable)
