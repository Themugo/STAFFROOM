const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    timeBank: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employeeDebt: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employeeCredit: {
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

// Import time bank controller
const timeBankController = require('../controllers/timeBankController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/time-bank/entries', timeBankController.getTimeBankEntries);
app.get('/api/time-bank/entries/:id', timeBankController.getTimeBankEntryById);
app.post('/api/time-bank/entries', timeBankController.createTimeBankEntry);
app.get('/api/time-bank/debts', timeBankController.getEmployeeDebts);
app.post('/api/time-bank/debts', timeBankController.createEmployeeDebt);
app.get('/api/time-bank/credits', timeBankController.getEmployeeCredits);
app.post('/api/time-bank/credits', timeBankController.createEmployeeCredit);

describe('Time Bank Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/time-bank/entries', () => {
    it('should return all time bank entries', async () => {
      const mockEntries = [
        {
          id: '1',
          employeeId: '1',
          type: 'CREDIT',
          hours: 8,
          description: 'Overtime worked',
          date: new Date(),
        },
        {
          id: '2',
          employeeId: '1',
          type: 'DEBIT',
          hours: 4,
          description: 'Time taken off',
          date: new Date(),
        },
      ];

      prisma.timeBank.findMany.mockResolvedValue(mockEntries);

      const response = await request(app).get('/api/time-bank/entries');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('CREDIT');
    });

    it('should filter entries by employee', async () => {
      const mockEntries = [
        {
          id: '1',
          employeeId: '1',
          type: 'CREDIT',
        },
      ];

      prisma.timeBank.findMany.mockResolvedValue(mockEntries);

      const response = await request(app).get('/api/time-bank/entries?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/time-bank/entries/:id', () => {
    it('should return time bank entry by ID', async () => {
      const mockEntry = {
        id: '1',
        employeeId: '1',
        type: 'CREDIT',
        hours: 8,
        description: 'Overtime worked',
      };

      prisma.timeBank.findUnique.mockResolvedValue(mockEntry);

      const response = await request(app).get('/api/time-bank/entries/1');

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('CREDIT');
    });

    it('should return 404 if entry not found', async () => {
      prisma.timeBank.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/time-bank/entries/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/time-bank/entries', () => {
    it('should create a new time bank entry', async () => {
      const newEntry = {
        employeeId: '1',
        type: 'CREDIT',
        hours: 12,
        description: 'Weekend overtime',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.timeBank.create.mockResolvedValue({
        id: '3',
        ...newEntry,
        date: new Date(),
      });

      const response = await request(app)
        .post('/api/time-bank/entries')
        .send(newEntry);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('CREDIT');
    });

    it('should return error if employee not found', async () => {
      const newEntry = {
        employeeId: '999',
        type: 'CREDIT',
        hours: 8,
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/time-bank/entries')
        .send(newEntry);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/time-bank/debts', () => {
    it('should return all employee debts', async () => {
      const mockDebts = [
        {
          id: '1',
          employeeId: '1',
          amount: 50000,
          reason: 'Salary advance',
          status: 'PENDING',
          createdAt: new Date(),
        },
        {
          id: '2',
          employeeId: '2',
          amount: 30000,
          reason: 'Loan repayment',
          status: 'PAID',
          createdAt: new Date(),
        },
      ];

      prisma.employeeDebt.findMany.mockResolvedValue(mockDebts);

      const response = await request(app).get('/api/time-bank/debts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });
  });

  describe('POST /api/time-bank/debts', () => {
    it('should create a new employee debt', async () => {
      const newDebt = {
        employeeId: '1',
        amount: 80000,
        reason: 'Emergency loan',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.employeeDebt.create.mockResolvedValue({
        id: '3',
        ...newDebt,
        status: 'PENDING',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/time-bank/debts')
        .send(newDebt);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });
  });

  describe('GET /api/time-bank/credits', () => {
    it('should return all employee credits', async () => {
      const mockCredits = [
        {
          id: '1',
          employeeId: '1',
          amount: 10000,
          reason: 'Performance bonus',
          status: 'AVAILABLE',
          createdAt: new Date(),
        },
        {
          id: '2',
          employeeId: '1',
          amount: 5000,
          reason: 'Referral bonus',
          status: 'USED',
          createdAt: new Date(),
        },
      ];

      prisma.employeeCredit.findMany.mockResolvedValue(mockCredits);

      const response = await request(app).get('/api/time-bank/credits');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('AVAILABLE');
    });
  });

  describe('POST /api/time-bank/credits', () => {
    it('should create a new employee credit', async () => {
      const newCredit = {
        employeeId: '1',
        amount: 15000,
        reason: 'Project completion bonus',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.employeeCredit.create.mockResolvedValue({
        id: '3',
        ...newCredit,
        status: 'AVAILABLE',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/time-bank/credits')
        .send(newCredit);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('AVAILABLE');
    });
  });
});
