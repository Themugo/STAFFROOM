const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    position: {
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
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import position controller
const positionController = require('../controllers/positionController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/positions', positionController.getAllPositions);
app.get('/api/positions/:id', positionController.getPositionById);
app.post('/api/positions', positionController.createPosition);
app.put('/api/positions/:id', positionController.updatePosition);
app.delete('/api/positions/:id', positionController.deletePosition);

describe('Position Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/positions', () => {
    it('should return all positions', async () => {
      const mockPositions = [
        {
          id: '1',
          title: 'Software Engineer',
          description: 'Develop software applications',
          salary: 80000,
          companyId: '1',
        },
        {
          id: '2',
          title: 'HR Manager',
          description: 'Manage human resources',
          salary: 75000,
          companyId: '1',
        },
      ];

      prisma.position.findMany.mockResolvedValue(mockPositions);

      const response = await request(app).get('/api/positions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Software Engineer');
    });

    it('should filter positions by department', async () => {
      const mockPositions = [
        {
          id: '1',
          title: 'Software Engineer',
          departmentId: '1',
        },
      ];

      prisma.position.findMany.mockResolvedValue(mockPositions);

      const response = await request(app).get('/api/positions?departmentId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/positions/:id', () => {
    it('should return position by ID', async () => {
      const mockPosition = {
        id: '1',
        title: 'Software Engineer',
        description: 'Develop software applications',
        salary: 80000,
        companyId: '1',
      };

      prisma.position.findUnique.mockResolvedValue(mockPosition);

      const response = await request(app).get('/api/positions/1');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Software Engineer');
    });

    it('should return 404 if position not found', async () => {
      prisma.position.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/positions/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/positions', () => {
    it('should create a new position', async () => {
      const newPosition = {
        title: 'Marketing Manager',
        description: 'Lead marketing initiatives',
        salary: 85000,
        companyId: '1',
        departmentId: '2',
      };

      prisma.company.findUnique.mockResolvedValue({ id: '1' });
      prisma.department.findUnique.mockResolvedValue({ id: '2' });
      prisma.position.create.mockResolvedValue({
        id: '3',
        ...newPosition,
      });

      const response = await request(app)
        .post('/api/positions')
        .send(newPosition);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Marketing Manager');
    });

    it('should validate required fields', async () => {
      const incompletePosition = {
        title: 'Marketing Manager',
        // Missing companyId and salary
      };

      const response = await request(app)
        .post('/api/positions')
        .send(incompletePosition);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/positions/:id', () => {
    it('should update a position', async () => {
      const updatedData = {
        title: 'Senior Software Engineer',
        salary: 95000,
      };

      prisma.position.findUnique.mockResolvedValue({
        id: '1',
        title: 'Software Engineer',
      });

      prisma.position.update.mockResolvedValue({
        id: '1',
        title: 'Senior Software Engineer',
        salary: 95000,
      });

      const response = await request(app)
        .put('/api/positions/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Senior Software Engineer');
    });

    it('should return 404 if position not found', async () => {
      prisma.position.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/positions/999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/positions/:id', () => {
    it('should delete a position', async () => {
      prisma.position.findUnique.mockResolvedValue({
        id: '1',
        title: 'Software Engineer',
      });

      prisma.position.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/positions/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if position not found', async () => {
      prisma.position.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/positions/999');

      expect(response.status).toBe(404);
    });
  });
});
