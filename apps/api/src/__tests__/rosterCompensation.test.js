const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    rosterAssignment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    compensationCredit: {
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

// Import roster compensation controller
const rosterCompensationController = require('../controllers/rosterCompensationController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/roster-compensation/assignments', rosterCompensationController.getRosterAssignments);
app.get('/api/roster-compensation/assignments/:id', rosterCompensationController.getAssignmentById);
app.post('/api/roster-compensation/assignments', rosterCompensationController.createAssignment);
app.get('/api/roster-compensation/credits', rosterCompensationController.getCompensationCredits);
app.post('/api/roster-compensation/credits', rosterCompensationController.createCompensationCredit);

describe('Roster Compensation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/roster-compensation/assignments', () => {
    it('should return all roster assignments', async () => {
      const mockAssignments = [
        {
          id: '1',
          employeeId: '1',
          rosterId: '1',
          shiftType: 'MORNING',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          rosterId: '1',
          shiftType: 'NIGHT',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'ACTIVE',
        },
      ];

      prisma.rosterAssignment.findMany.mockResolvedValue(mockAssignments);

      const response = await request(app).get('/api/roster-compensation/assignments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].shiftType).toBe('MORNING');
    });

    it('should filter assignments by employee', async () => {
      const mockAssignments = [
        {
          id: '1',
          employeeId: '1',
          shiftType: 'MORNING',
        },
      ];

      prisma.rosterAssignment.findMany.mockResolvedValue(mockAssignments);

      const response = await request(app).get('/api/roster-compensation/assignments?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/roster-compensation/assignments/:id', () => {
    it('should return assignment by ID', async () => {
      const mockAssignment = {
        id: '1',
        employeeId: '1',
        rosterId: '1',
        shiftType: 'MORNING',
        status: 'ACTIVE',
      };

      prisma.rosterAssignment.findUnique.mockResolvedValue(mockAssignment);

      const response = await request(app).get('/api/roster-compensation/assignments/1');

      expect(response.status).toBe(200);
      expect(response.body.shiftType).toBe('MORNING');
    });

    it('should return 404 if assignment not found', async () => {
      prisma.rosterAssignment.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/roster-compensation/assignments/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/roster-compensation/assignments', () => {
    it('should create a new assignment', async () => {
      const newAssignment = {
        employeeId: '1',
        rosterId: '1',
        shiftType: 'AFTERNOON',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.rosterAssignment.create.mockResolvedValue({
        id: '3',
        ...newAssignment,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/roster-compensation/assignments')
        .send(newAssignment);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newAssignment = {
        employeeId: '999',
        rosterId: '1',
        shiftType: 'MORNING',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/roster-compensation/assignments')
        .send(newAssignment);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/roster-compensation/credits', () => {
    it('should return all compensation credits', async () => {
      const mockCredits = [
        {
          id: '1',
          employeeId: '1',
          type: 'OVERTIME',
          amount: 5000,
          description: 'Weekend work',
          date: new Date(),
        },
        {
          id: '2',
          employeeId: '1',
          type: 'HOLIDAY',
          amount: 3000,
          description: 'Holiday work',
          date: new Date(),
        },
      ];

      prisma.compensationCredit.findMany.mockResolvedValue(mockCredits);

      const response = await request(app).get('/api/roster-compensation/credits');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('OVERTIME');
    });
  });

  describe('POST /api/roster-compensation/credits', () => {
    it('should create a new compensation credit', async () => {
      const newCredit = {
        employeeId: '1',
        type: 'OVERTIME',
        amount: 8000,
        description: 'Extra weekend shift',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.compensationCredit.create.mockResolvedValue({
        id: '3',
        ...newCredit,
        date: new Date(),
      });

      const response = await request(app)
        .post('/api/roster-compensation/credits')
        .send(newCredit);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('OVERTIME');
    });
  });
});
