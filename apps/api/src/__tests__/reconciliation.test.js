const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    attendanceReconciliation: {
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

// Import reconciliation controller
const reconciliationController = require('../controllers/reconciliationController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/reconciliation/attendance', reconciliationController.getAttendanceReconciliations);
app.get('/api/reconciliation/attendance/:id', reconciliationController.getReconciliationById);
app.post('/api/reconciliation/attendance', reconciliationController.createReconciliation);
app.put('/api/reconciliation/attendance/:id/approve', reconciliationController.approveReconciliation);
app.get('/api/reconciliation/summary', reconciliationController.getReconciliationSummary);

describe('Reconciliation Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reconciliation/attendance', () => {
    it('should return all attendance reconciliations', async () => {
      const mockReconciliations = [
        {
          id: '1',
          employeeId: '1',
          date: '2024-01-15',
          originalStatus: 'ABSENT',
          reconciledStatus: 'PRESENT',
          reason: 'System error corrected',
          status: 'PENDING',
        },
        {
          id: '2',
          employeeId: '2',
          date: '2024-01-16',
          originalStatus: 'LATE',
          reconciledStatus: 'PRESENT',
          reason: 'Traffic delay approved',
          status: 'APPROVED',
        },
      ];

      prisma.attendanceReconciliation.findMany.mockResolvedValue(mockReconciliations);

      const response = await request(app).get('/api/reconciliation/attendance');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should filter reconciliations by status', async () => {
      const mockReconciliations = [
        {
          id: '1',
          status: 'PENDING',
        },
      ];

      prisma.attendanceReconciliation.findMany.mockResolvedValue(mockReconciliations);

      const response = await request(app).get('/api/reconciliation/attendance?status=PENDING');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/reconciliation/attendance/:id', () => {
    it('should return reconciliation by ID', async () => {
      const mockReconciliation = {
        id: '1',
        employeeId: '1',
        date: '2024-01-15',
        originalStatus: 'ABSENT',
        reconciledStatus: 'PRESENT',
        status: 'PENDING',
      };

      prisma.attendanceReconciliation.findUnique.mockResolvedValue(mockReconciliation);

      const response = await request(app).get('/api/reconciliation/attendance/1');

      expect(response.status).toBe(200);
      expect(response.body.originalStatus).toBe('ABSENT');
    });

    it('should return 404 if reconciliation not found', async () => {
      prisma.attendanceReconciliation.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/reconciliation/attendance/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/reconciliation/attendance', () => {
    it('should create a new reconciliation', async () => {
      const newReconciliation = {
        employeeId: '1',
        date: '2024-01-20',
        originalStatus: 'ABSENT',
        reconciledStatus: 'PRESENT',
        reason: 'Forgot to check in',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.attendanceReconciliation.create.mockResolvedValue({
        id: '3',
        ...newReconciliation,
        status: 'PENDING',
      });

      const response = await request(app)
        .post('/api/reconciliation/attendance')
        .send(newReconciliation);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if employee not found', async () => {
      const newReconciliation = {
        employeeId: '999',
        date: '2024-01-20',
        originalStatus: 'ABSENT',
        reconciledStatus: 'PRESENT',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/reconciliation/attendance')
        .send(newReconciliation);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/reconciliation/attendance/:id/approve', () => {
    it('should approve a reconciliation', async () => {
      prisma.attendanceReconciliation.findUnique.mockResolvedValue({
        id: '1',
        status: 'PENDING',
      });

      prisma.attendanceReconciliation.update.mockResolvedValue({
        id: '1',
        status: 'APPROVED',
        approvedAt: new Date(),
      });

      const response = await request(app).put('/api/reconciliation/attendance/1/approve');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APPROVED');
    });

    it('should return 404 if reconciliation not found', async () => {
      prisma.attendanceReconciliation.findUnique.mockResolvedValue(null);

      const response = await request(app).put('/api/reconciliation/attendance/999/approve');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/reconciliation/summary', () => {
    it('should return reconciliation summary', async () => {
      prisma.attendanceReconciliation.findMany.mockResolvedValue([
        { status: 'PENDING' },
        { status: 'APPROVED' },
        { status: 'APPROVED' },
      ]);

      const response = await request(app).get('/api/reconciliation/summary');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pending');
      expect(response.body).toHaveProperty('approved');
    });
  });
});
