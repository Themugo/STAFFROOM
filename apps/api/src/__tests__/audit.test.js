const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    auditLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import audit controller
const auditController = require('../controllers/auditController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/audit/logs', auditController.getAuditLogs);
app.get('/api/audit/logs/:id', auditController.getAuditLogById);
app.post('/api/audit/logs', auditController.createAuditLog);
app.get('/api/audit/summary', auditController.getAuditSummary);

describe('Audit Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/audit/logs', () => {
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

      const response = await request(app).get('/api/audit/logs');

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

      const response = await request(app).get('/api/audit/logs?action=CREATE_EMPLOYEE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/audit/logs/:id', () => {
    it('should return audit log by ID', async () => {
      const mockLog = {
        id: '1',
        action: 'CREATE_EMPLOYEE',
        performerId: '1',
        details: 'Created new employee',
        timestamp: new Date(),
      };

      prisma.auditLog.findUnique.mockResolvedValue(mockLog);

      const response = await request(app).get('/api/audit/logs/1');

      expect(response.status).toBe(200);
      expect(response.body.action).toBe('CREATE_EMPLOYEE');
    });

    it('should return 404 if audit log not found', async () => {
      prisma.auditLog.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/audit/logs/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/audit/logs', () => {
    it('should create a new audit log', async () => {
      const newLog = {
        action: 'DELETE_EMPLOYEE',
        performerId: '1',
        details: 'Deleted employee record',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.auditLog.create.mockResolvedValue({
        id: '3',
        ...newLog,
        timestamp: new Date(),
      });

      const response = await request(app)
        .post('/api/audit/logs')
        .send(newLog);

      expect(response.status).toBe(201);
      expect(response.body.action).toBe('DELETE_EMPLOYEE');
    });

    it('should return error if performer not found', async () => {
      const newLog = {
        action: 'DELETE_EMPLOYEE',
        performerId: '999',
        details: 'Deleted employee',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/audit/logs')
        .send(newLog);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/audit/summary', () => {
    it('should return audit summary', async () => {
      const mockSummary = {
        totalLogs: 100,
        todayLogs: 15,
        topActions: [
          { action: 'CREATE_EMPLOYEE', count: 30 },
          { action: 'UPDATE_EMPLOYEE', count: 25 },
        ],
      };

      prisma.auditLog.findMany.mockResolvedValue([
        { action: 'CREATE_EMPLOYEE' },
        { action: 'UPDATE_EMPLOYEE' },
      ]);

      const response = await request(app).get('/api/audit/summary');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalLogs');
    });
  });
});
