const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employmentContract: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    compensationComponent: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    disciplinaryRecord: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    grievance: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import high priority features controller
const highPriorityFeaturesController = require('../controllers/highPriorityFeaturesController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/high-priority-features/contracts', highPriorityFeaturesController.getAllContracts);
app.post('/api/high-priority-features/contracts', highPriorityFeaturesController.createContract);
app.get('/api/high-priority-features/compensation', highPriorityFeaturesController.getCompensationComponents);
app.post('/api/high-priority-features/compensation', highPriorityFeaturesController.createCompensationComponent);
app.get('/api/high-priority-features/disciplinary', highPriorityFeaturesController.getDisciplinaryRecords);
app.post('/api/high-priority-features/disciplinary', highPriorityFeaturesController.createDisciplinaryRecord);
app.get('/api/high-priority-features/grievances', highPriorityFeaturesController.getGrievances);
app.post('/api/high-priority-features/grievances', highPriorityFeaturesController.createGrievance);

describe('High Priority Features Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/high-priority-features/contracts', () => {
    it('should return all employment contracts', async () => {
      const mockContracts = [
        {
          id: '1',
          employeeId: '1',
          type: 'PERMANENT',
          startDate: '2024-01-01',
          endDate: null,
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          type: 'CONTRACT',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'ACTIVE',
        },
      ];

      prisma.employmentContract.findMany.mockResolvedValue(mockContracts);

      const response = await request(app).get('/api/high-priority-features/contracts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('PERMANENT');
    });
  });

  describe('POST /api/high-priority-features/contracts', () => {
    it('should create a new employment contract', async () => {
      const newContract = {
        employeeId: '1',
        type: 'PERMANENT',
        startDate: '2024-01-01',
        salary: 100000,
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.employmentContract.create.mockResolvedValue({
        id: '3',
        ...newContract,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/high-priority-features/contracts')
        .send(newContract);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newContract = {
        employeeId: '999',
        type: 'PERMANENT',
        startDate: '2024-01-01',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/high-priority-features/contracts')
        .send(newContract);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/high-priority-features/compensation', () => {
    it('should return all compensation components', async () => {
      const mockComponents = [
        {
          id: '1',
          name: 'Basic Salary',
          type: 'FIXED',
          amount: 80000,
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Housing Allowance',
          type: 'ALLOWANCE',
          amount: 15000,
          status: 'ACTIVE',
        },
      ];

      prisma.compensationComponent.findMany.mockResolvedValue(mockComponents);

      const response = await request(app).get('/api/high-priority-features/compensation');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('FIXED');
    });
  });

  describe('POST /api/high-priority-features/compensation', () => {
    it('should create a new compensation component', async () => {
      const newComponent = {
        name: 'Transport Allowance',
        type: 'ALLOWANCE',
        amount: 10000,
      };

      prisma.compensationComponent.create.mockResolvedValue({
        id: '3',
        ...newComponent,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/high-priority-features/compensation')
        .send(newComponent);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/high-priority-features/disciplinary', () => {
    it('should return all disciplinary records', async () => {
      const mockRecords = [
        {
          id: '1',
          employeeId: '1',
          type: 'WARNING',
          description: 'Late attendance',
          date: '2024-01-15',
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          type: 'SUSPENSION',
          description: 'Policy violation',
          date: '2024-01-20',
          status: 'ACTIVE',
        },
      ];

      prisma.disciplinaryRecord.findMany.mockResolvedValue(mockRecords);

      const response = await request(app).get('/api/high-priority-features/disciplinary');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('WARNING');
    });
  });

  describe('POST /api/high-priority-features/disciplinary', () => {
    it('should create a new disciplinary record', async () => {
      const newRecord = {
        employeeId: '1',
        type: 'WARNING',
        description: 'Late attendance',
        date: '2024-01-15',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.disciplinaryRecord.create.mockResolvedValue({
        id: '3',
        ...newRecord,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/high-priority-features/disciplinary')
        .send(newRecord);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newRecord = {
        employeeId: '999',
        type: 'WARNING',
        description: 'Late attendance',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/high-priority-features/disciplinary')
        .send(newRecord);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/high-priority-features/grievances', () => {
    it('should return all grievances', async () => {
      const mockGrievances = [
        {
          id: '1',
          employeeId: '1',
          type: 'WORKPLACE_HARASSMENT',
          description: 'Unfair treatment',
          status: 'OPEN',
          createdAt: new Date(),
        },
        {
          id: '2',
          employeeId: '2',
          type: 'SALARY_DISPUTE',
          description: 'Incorrect salary calculation',
          status: 'IN_PROGRESS',
          createdAt: new Date(),
        },
      ];

      prisma.grievance.findMany.mockResolvedValue(mockGrievances);

      const response = await request(app).get('/api/high-priority-features/grievances');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('OPEN');
    });
  });

  describe('POST /api/high-priority-features/grievances', () => {
    it('should create a new grievance', async () => {
      const newGrievance = {
        employeeId: '1',
        type: 'WORKPLACE_HARASSMENT',
        description: 'Unfair treatment',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.grievance.create.mockResolvedValue({
        id: '3',
        ...newGrievance,
        status: 'OPEN',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/high-priority-features/grievances')
        .send(newGrievance);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('OPEN');
    });

    it('should return error if employee not found', async () => {
      const newGrievance = {
        employeeId: '999',
        type: 'WORKPLACE_HARASSMENT',
        description: 'Unfair treatment',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/high-priority-features/grievances')
        .send(newGrievance);

      expect(response.status).toBe(404);
    });
  });
});
