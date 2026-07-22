# 🔌 STAFFROOM API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
```bash
# Login
POST /auth/login
{
  "email": "user@email.com",
  "password": "password"
}

# Returns JWT token
```

## Workflow Endpoints

### Get Workflows
```bash
GET /workflows
Query Params: ?status=pending&type=leave&limit=10
```

### Approve Workflow
```bash
POST /workflows/:id/approve
{
  "comment": "Approved"
}
```

### Reject Workflow
```bash
POST /workflows/:id/reject
{
  "reason": "Does not meet criteria"
}
```

## Leave Endpoints

### Get Leave Balance
```bash
GET /leaves/balance/:employeeId
```

### Request Leave
```bash
POST /leaves/request
{
  "employeeId": "e7",
  "type": "annual",
  "days": 3,
  "startDate": "2026-05-01"
}
```

## Payroll Endpoints

### Get Payroll Records
```bash
GET /payroll?month=April%202026
```

### Calculate Variance
```bash
GET /payroll/:employeeId/variance?month=April%202026
```

## See full API docs in code comments
