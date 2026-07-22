const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    leaveBalance: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    leaveTransaction: {
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

// Import leave management controller
const leaveManagementController = require('../controllers/leaveManagementController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/leave-management/balances', leaveManagementController.getLeaveBalances);
app.get('/api/leave-management/balances/:id', leaveManagementController.getLeaveBalanceById);
app.post('/api/leave-management/balances', leaveManagementController.createLeaveBalance);
app.put('/api/leave-management/balances/:id', leaveManagementController.updateLeaveBalance);
app.get('/api/leave-management/transactions', leaveManagementController.getLeaveTransactions);
app.post('/api/leave-management/transactions', leaveManagementController.createLeaveTransaction);

describe('Leave Management Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/leave-management/balances', () => {
    it('should return all leave balances', async () => {
      const mockBalances = [
        {
          id: '1',
          employeeId: '1',
          leaveType: 'ANNUAL',
          balance: 20,
          used: 5,
          year: 2024,
        },
        {
          id: '2',
          employeeId: '1',
          leaveType: 'SICK',
          balance: 10,
          used: 2,
          year: 2024,
        },
      ];

      prisma.leaveBalance.findMany.mockResolvedValue(mockBalances);

      const response = await request(app).get('/api/leave-management/balances');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].leaveType).toBe('ANNUAL');
    });

    it('should filter balances by employee', async () => {
      const mockBalances = [
        {
          id: '1',
          employeeId: '1',
          leaveType: 'ANNUAL',
          balance: 20,
        },
      ];

      prisma.leaveBalance.findMany.mockResolvedValue(mockBalances);

      const response = await request(app).get('/api/leave-management/balances?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/leave-management/balances/:id', () => {
    it('should return leave balance by ID', async () => {
      const mockBalance = {
        id: '1',
        employeeId: '1',
        leaveType: 'ANNUAL',
        balance: 20,
        used: 5,
        year: 2024,
      };

      prisma.leaveBalance.findUnique.mockResolvedValue(mockBalance);

      const response = await request(app).get('/api/leave-management/balances/1');

      expect(response.status).toBe(200);
      expect(response.body.leaveType).toBe('ANNUAL');
    });

    it('should return 404 if balance not found', async () => {
      prisma.leaveBalance.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/leave-management/balances/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/leave-management/balances', () => {
    it('should create a new leave balance', async () => {
      const newBalance = {
        employeeId: '1',
        leaveType: 'MATERNITY',
        balance: 90,
        year: 2024,
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.leaveBalance.create.mockResolvedValue({
        id: '3',
        ...newBalance,
        used: 0,
      });

      const response = await request(app)
        .post('/api/leave-management/balances')
        .send(newBalance);

      expect(response.status).toBe(201);
      expect(response.body.leaveType).toBe('MATERNITY');
    });

    it('should return error if employee not found', async () => {
      const newBalance = {
        employeeId: '999',
        leaveType: 'ANNUAL',
        balance: 20,
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/leave-management/balances')
        .send(newBalance);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/leave-management/balances/:id', () => {
    it('should update a leave balance', async () => {
      const updatedData = {
        balance: 25,
        used: 8,
      };

      prisma.leaveBalance.findUnique.mockResolvedValue({
        id: '1',
        leaveType: 'ANNUAL',
      });

      prisma.leaveBalance.update.mockResolvedValue({
        id: '1',
        leaveType: 'ANNUAL',
        balance: 25,
        used: 8,
      });

      const response = await request(app)
        .put('/api/leave-management/balances/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.balance).toBe(25);
    });

    it('should return 404 if balance not found', async () => {
      prisma.leaveBalance.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/leave-management/balances/999')
        .send({ balance: 25 });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/leave-management/transactions', () => {
    it('should return all leave transactions', async () => {
      const mockTransactions = [
        {
          id: '1',
          employeeId: '1',
          type: 'CREDIT',
          amount: 20,
          description: 'Annual leave allocation',
          date: new Date(),
        },
        {
          id: '2',
          employeeId: '1',
          type: 'DEBIT',
          amount: 5,
          description: 'Leave taken',
          date: new Date(),
        },
      ];

      prisma.leaveTransaction.findMany.mockResolvedValue(mockTransactions);

      const response = await request(app).get('/api/leave-management/transactions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('CREDIT');
    });
  });

  describe('POST /api/leave-management/transactions', () => {
    it('should create a new leave transaction', async () => {
      const newTransaction = {
        employeeId: '1',
        type: 'DEBIT',
        amount: 3,
        description: 'Emergency leave',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.leaveTransaction.create.mockResolvedValue({
        id: '3',
        ...newTransaction,
        date: new Date(),
      });

      const response = await request(app)
        .post('/api/leave-management/transactions')
        .send(newTransaction);

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('DEBIT');
    });
  });
});
