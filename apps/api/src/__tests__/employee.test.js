const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employee: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    department: {
      findUnique: jest.fn(),
    },
    position: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import employee controller
const employeeController = require('../controllers/employeeController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/employees', employeeController.getAllEmployees);
app.get('/api/employees/:id', employeeController.getEmployeeById);
app.post('/api/employees', employeeController.createEmployee);
app.put('/api/employees/:id', employeeController.updateEmployee);
app.delete('/api/employees/:id', employeeController.deleteEmployee);

describe('Employee Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/employees', () => {
    it('should return all employees', async () => {
      const mockEmployees = [
        {
          id: '1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: 'EMP002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          status: 'ACTIVE',
        },
      ];

      prisma.employee.findMany.mockResolvedValue(mockEmployees);

      const response = await request(app).get('/api/employees');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].firstName).toBe('John');
    });

    it('should filter employees by status', async () => {
      const mockEmployees = [
        {
          id: '1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          status: 'ACTIVE',
        },
      ];

      prisma.employee.findMany.mockResolvedValue(mockEmployees);

      const response = await request(app).get('/api/employees?status=ACTIVE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee by ID', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        status: 'ACTIVE',
      };

      prisma.employee.findUnique.mockResolvedValue(mockEmployee);

      const response = await request(app).get('/api/employees/1');

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('John');
    });

    it('should return 404 if employee not found', async () => {
      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/employees/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        employeeId: 'EMP003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        companyId: '1',
        departmentId: '1',
        positionId: '1',
        hireDate: '2024-01-01',
      };

      prisma.company.findUnique.mockResolvedValue({ id: '1' });
      prisma.department.findUnique.mockResolvedValue({ id: '1' });
      prisma.position.findUnique.mockResolvedValue({ id: '1' });
      prisma.employee.create.mockResolvedValue({
        id: '3',
        ...newEmployee,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/employees')
        .send(newEmployee);

      expect(response.status).toBe(201);
      expect(response.body.firstName).toBe('Bob');
    });

    it('should validate required fields', async () => {
      const incompleteEmployee = {
        firstName: 'Bob',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/employees')
        .send(incompleteEmployee);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an employee', async () => {
      const updatedData = {
        firstName: 'Robert',
        lastName: 'Johnson',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
      });

      prisma.employee.update.mockResolvedValue({
        id: '1',
        employeeId: 'EMP001',
        firstName: 'Robert',
        lastName: 'Johnson',
      });

      const response = await request(app)
        .put('/api/employees/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Robert');
    });

    it('should return 404 if employee not found', async () => {
      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/employees/999')
        .send({ firstName: 'Robert' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', async () => {
      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        employeeId: 'EMP001',
      });

      prisma.employee.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/employees/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if employee not found', async () => {
      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/employees/999');

      expect(response.status).toBe(404);
    });
  });
});
