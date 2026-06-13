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
      update: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import security controller
const securityController = require('../controllers/securityController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/security/audit-logs', securityController.getAuditLogs);
app.get('/api/security/audit-logs/:id', securityController.getAuditLogById);
app.post('/api/security/change-password', securityController.changePassword);
app.get('/api/security/user-activity', securityController.getUserActivity);

describe('Security Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/security/audit-logs', () => {
    it('should return all audit logs', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: '1',
          action: 'LOGIN',
          details: 'User logged in',
          timestamp: new Date(),
        },
        {
          id: '2',
          userId: '1',
          action: 'UPDATE_EMPLOYEE',
          details: 'Updated employee record',
          timestamp: new Date(),
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/security/audit-logs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].action).toBe('LOGIN');
    });

    it('should filter audit logs by user', async () => {
      const mockLogs = [
        {
          id: '1',
          userId: '1',
          action: 'LOGIN',
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/security/audit-logs?userId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter audit logs by action', async () => {
      const mockLogs = [
        {
          id: '1',
          action: 'LOGIN',
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockLogs);

      const response = await request(app).get('/api/security/audit-logs?action=LOGIN');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/security/audit-logs/:id', () => {
    it('should return audit log by ID', async () => {
      const mockLog = {
        id: '1',
        userId: '1',
        action: 'LOGIN',
        details: 'User logged in',
        timestamp: new Date(),
      };

      prisma.auditLog.findUnique.mockResolvedValue(mockLog);

      const response = await request(app).get('/api/security/audit-logs/1');

      expect(response.status).toBe(200);
      expect(response.body.action).toBe('LOGIN');
    });

    it('should return 404 if audit log not found', async () => {
      prisma.auditLog.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/security/audit-logs/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/security/change-password', () => {
    it('should change password successfully', async () => {
      const passwordData = {
        userId: '1',
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        password: 'hashedOldPassword',
      });

      prisma.user.update.mockResolvedValue({
        id: '1',
        password: 'hashedNewPassword',
      });

      const response = await request(app)
        .post('/api/security/change-password')
        .send(passwordData);

      expect(response.status).toBe(200);
    });

    it('should return error if user not found', async () => {
      const passwordData = {
        userId: '999',
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/security/change-password')
        .send(passwordData);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        userId: '1',
        // Missing currentPassword and newPassword
      };

      const response = await request(app)
        .post('/api/security/change-password')
        .send(incompleteData);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/security/user-activity', () => {
    it('should return user activity', async () => {
      const mockActivity = [
        {
          id: '1',
          userId: '1',
          action: 'LOGIN',
          timestamp: new Date(),
        },
        {
          id: '2',
          userId: '1',
          action: 'LOGOUT',
          timestamp: new Date(),
        },
      ];

      prisma.auditLog.findMany.mockResolvedValue(mockActivity);

      const response = await request(app).get('/api/security/user-activity?userId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });
});
