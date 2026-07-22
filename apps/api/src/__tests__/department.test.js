const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    department: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import department controller
const departmentController = require('../controllers/departmentController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/departments', departmentController.getAllDepartments);
app.get('/api/departments/:id', departmentController.getDepartmentById);
app.post('/api/departments', departmentController.createDepartment);
app.put('/api/departments/:id', departmentController.updateDepartment);
app.delete('/api/departments/:id', departmentController.deleteDepartment);

describe('Department Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/departments', () => {
    it('should return all departments', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Engineering',
          description: 'Software development team',
          companyId: '1',
        },
        {
          id: '2',
          name: 'HR',
          description: 'Human Resources',
          companyId: '1',
        },
      ];

      prisma.department.findMany.mockResolvedValue(mockDepartments);

      const response = await request(app).get('/api/departments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Engineering');
    });

    it('should filter departments by company', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Engineering',
          companyId: '1',
        },
      ];

      prisma.department.findMany.mockResolvedValue(mockDepartments);

      const response = await request(app).get('/api/departments?companyId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/departments/:id', () => {
    it('should return department by ID', async () => {
      const mockDepartment = {
        id: '1',
        name: 'Engineering',
        description: 'Software development team',
        companyId: '1',
      };

      prisma.department.findUnique.mockResolvedValue(mockDepartment);

      const response = await request(app).get('/api/departments/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Engineering');
    });

    it('should return 404 if department not found', async () => {
      prisma.department.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/departments/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/departments', () => {
    it('should create a new department', async () => {
      const newDepartment = {
        name: 'Marketing',
        description: 'Marketing team',
        companyId: '1',
      };

      prisma.company.findUnique.mockResolvedValue({ id: '1' });
      prisma.department.create.mockResolvedValue({
        id: '3',
        ...newDepartment,
      });

      const response = await request(app)
        .post('/api/departments')
        .send(newDepartment);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Marketing');
    });

    it('should validate required fields', async () => {
      const incompleteDepartment = {
        name: 'Marketing',
        // Missing companyId
      };

      const response = await request(app)
        .post('/api/departments')
        .send(incompleteDepartment);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/departments/:id', () => {
    it('should update a department', async () => {
      const updatedData = {
        name: 'Engineering Team',
        description: 'Software engineering and development',
      };

      prisma.department.findUnique.mockResolvedValue({
        id: '1',
        name: 'Engineering',
      });

      prisma.department.update.mockResolvedValue({
        id: '1',
        name: 'Engineering Team',
        description: 'Software engineering and development',
      });

      const response = await request(app)
        .put('/api/departments/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Engineering Team');
    });

    it('should return 404 if department not found', async () => {
      prisma.department.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/departments/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/departments/:id', () => {
    it('should delete a department', async () => {
      prisma.department.findUnique.mockResolvedValue({
        id: '1',
        name: 'Engineering',
      });

      prisma.employee.findMany.mockResolvedValue([]);
      prisma.department.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/departments/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if department not found', async () => {
      prisma.department.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/departments/999');

      expect(response.status).toBe(404);
    });

    it('should return 400 if department has employees', async () => {
      prisma.department.findUnique.mockResolvedValue({
        id: '1',
        name: 'Engineering',
      });

      prisma.employee.findMany.mockResolvedValue([
        { id: '1', name: 'John Doe' },
      ]);

      const response = await request(app).delete('/api/departments/1');

      expect(response.status).toBe(400);
    });
  });
});
