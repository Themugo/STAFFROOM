const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    auditLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    liabilityRecord: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    workforceDispute: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import governance controller
const governanceController = require('../controllers/governanceController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/governance/audit-logs', governanceController.getAuditLogs);
app.get('/api/governance/audit-logs/:id', governanceController.getAuditLogById);
app.get('/api/governance/liabilities', governanceController.getLiabilities);
app.post('/api/governance/liabilities', governanceController.createLiability);
app.get('/api/governance/disputes', governanceController.getDisputes);
app.post('/api/governance/disputes', governanceController.createDispute);

describe('Governance Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/governance/audit-logs', () => {
    it('should return all audit logs', async () => {
      const mockLogs = [
        {
          id: '1',
          action: 'CREATE_EMPLOYEE',
          performerId: '1',
          details: 'Created new employee',
          timestamp: new Date(),
        },
        {
          id: '2',
          action: 'UPDATE_SALARY',
          performerId: '2',
          details: 'Updated employee salary',
          timestamp: new Date(),
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/governance/audit-logs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].action).toBe('CREATE_EMPLOYEE');
    });

    it('should filter audit logs by action', async () => {
      const mockLogs = [
        {
          id: '1',
          action: 'CREATE_EMPLOYEE',
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/governance/audit-logs?action=CREATE_EMPLOYEE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/governance/audit-logs/:id', () => {
    it('should return audit log by ID', async () => {
      const mockLog = {
        id: '1',
        action: 'CREATE_EMPLOYEE',
        performerId: '1',
        details: 'Created new employee',
        timestamp: new Date(),
      };

      prisma.auditLog.findUnique.mockResolvedValue(mockLog);

      const response = await request(app).get('/api/governance/audit-logs/1');

      expect(response.status).toBe(200);
      expect(response.body.action).toBe('CREATE_EMPLOYEE');
    });

    it('should return 404 if audit log not found', async () => {
      prisma.auditLog.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/governance/audit-logs/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/governance/liabilities', () => {
    it('should return all liabilities', async () => {
      const mockLiabilities = [
        {
          id: '1',
          type: 'LEAVE_BALANCE',
          employeeId: '1',
          amount: 5,
          status: 'PENDING',
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'OVERTIME',
          employeeId: '2',
          amount: 10,
          status: 'APPROVED',
          createdAt: new Date(),
        },
      ];

      prisma.liabilityRecord.findMany.mockResolvedValue(mockLiabilities);

      const response = await request(app).get('/api/governance/liabilities');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should filter liabilities by status', async () => {
      const mockLiabilities = [
        {
          id: '1',
          status: 'PENDING',
        },
      ];

      prisma.liabilityRecord.findMany.mockResolvedValue(mockLiabilities);

      const response = await request(app).get('/api/governance/liabilities?status=PENDING');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('POST /api/governance/liabilities', () => {
    it('should create a new liability', async () => {
      const newLiability = {
        type: 'LEAVE_BALANCE',
        employeeId: '1',
        amount: 5,
        description: 'Annual leave balance',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.liabilityRecord.create.mockResolvedValue({
        id: '3',
        ...newLiability,
        status: 'PENDING',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/governance/liabilities')
        .send(newLiability);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if employee not found', async () => {
      const newLiability = {
        type: 'LEAVE_BALANCE',
        employeeId: '999',
        amount: 5,
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/governance/liabilities')
        .send(newLiability);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/governance/disputes', () => {
    it('should return all disputes', async () => {
      const mockDisputes = [
        {
          id: '1',
          employeeId: '1',
          type: 'ATTENDANCE',
          description: 'Disputed attendance record',
          status: 'OPEN',
          createdAt: new Date(),
        },
        {
          id: '2',
          employeeId: '2',
          type: 'PAYROLL',
          description: 'Salary calculation error',
          status: 'RESOLVED',
          createdAt: new Date(),
        },
      ];

      prisma.workforceDispute.findMany.mockResolvedValue(mockDisputes);

      const response = await request(app).get('/api/governance/disputes');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('OPEN');
    });

    it('should filter disputes by status', async () => {
      const mockDisputes = [
        {
          id: '1',
          status: 'OPEN',
        },
      ];

      prisma.workforceDispute.findMany.mockResolvedValue(mockDisputes);

      const response = await request(app).get('/api/governance/disputes?status=OPEN');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('POST /api/governance/disputes', () => {
    it('should create a new dispute', async () => {
      const newDispute = {
        employeeId: '1',
        type: 'ATTENDANCE',
        description: 'Disputed attendance record',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.workforceDispute.create.mockResolvedValue({
        id: '3',
        ...newDispute,
        status: 'OPEN',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/governance/disputes')
        .send(newDispute);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('OPEN');
    });

    it('should return error if employee not found', async () => {
      const newDispute = {
        employeeId: '999',
        type: 'ATTENDANCE',
        description: 'Disputed attendance',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/governance/disputes')
        .send(newDispute);

      expect(response.status).toBe(404);
    });
  });
});
