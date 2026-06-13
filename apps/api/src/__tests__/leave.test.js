const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    leave: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    leaveBalance: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import leave controller
const leaveController = require('../controllers/leaveController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/leaves', leaveController.getAllLeaves);
app.get('/api/leaves/:id', leaveController.getLeaveById);
app.post('/api/leaves', leaveController.createLeave);
app.put('/api/leaves/:id/approve', leaveController.approveLeave);
app.put('/api/leaves/:id/reject', leaveController.rejectLeave);

describe('Leave Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/leaves', () => {
    it('should return all leave requests', async () => {
      const mockLeaves = [
        {
          id: '1',
          employeeId: '1',
          type: 'ANNUAL',
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          status: 'PENDING',
          reason: 'Family vacation',
        },
        {
          id: '2',
          employeeId: '2',
          type: 'SICK',
          startDate: '2024-01-20',
          endDate: '2024-01-21',
          status: 'APPROVED',
          reason: 'Medical appointment',
        },
      ];

      prisma.leave.findMany.mockResolvedValue(mockLeaves);

      const response = await request(app).get('/api/leaves');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should filter leaves by status', async () => {
      const mockLeaves = [
        {
          id: '1',
          employeeId: '1',
          status: 'PENDING',
        },
      ];

      prisma.leave.findMany.mockResolvedValue(mockLeaves);

      const response = await request(app).get('/api/leaves?status=PENDING');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter leaves by employee', async () => {
      const mockLeaves = [
        {
          id: '1',
          employeeId: '1',
          status: 'PENDING',
        },
      ];

      prisma.leave.findMany.mockResolvedValue(mockLeaves);

      const response = await request(app).get('/api/leaves?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/leaves/:id', () => {
    it('should return leave by ID', async () => {
      const mockLeave = {
        id: '1',
        employeeId: '1',
        type: 'ANNUAL',
        startDate: '2024-02-01',
        endDate: '2024-02-05',
        status: 'PENDING',
        reason: 'Family vacation',
      };

      prisma.leave.findUnique.mockResolvedValue(mockLeave);

      const response = await request(app).get('/api/leaves/1');

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('ANNUAL');
    });

    it('should return 404 if leave not found', async () => {
      prisma.leave.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/leaves/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/leaves', () => {
    it('should create a new leave request', async () => {
      const newLeave = {
        employeeId: '1',
        type: 'ANNUAL',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
        reason: 'Personal vacation',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.leaveBalance.findUnique.mockResolvedValue({
        id: '1',
        employeeId: '1',
        type: 'ANNUAL',
        balance: 20,
      });

      prisma.leave.create.mockResolvedValue({
        id: '3',
        ...newLeave,
        status: 'PENDING',
      });

      const response = await request(app)
        .post('/api/leaves')
        .send(newLeave);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if employee not found', async () => {
      const newLeave = {
        employeeId: '999',
        type: 'ANNUAL',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/leaves')
        .send(newLeave);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteLeave = {
        employeeId: '1',
        type: 'ANNUAL',
        // Missing dates
      };

      const response = await request(app)
        .post('/api/leaves')
        .send(incompleteLeave);

      expect(response.status).toBe(400);
    });

    it('should return error if insufficient leave balance', async () => {
      const newLeave = {
        employeeId: '1',
        type: 'ANNUAL',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        status: 'ACTIVE',
      });

      prisma.leaveBalance.findUnique.mockResolvedValue({
        id: '1',
        type: 'ANNUAL',
        balance: 5,
      });

      const response = await request(app)
        .post('/api/leaves')
        .send(newLeave);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/leaves/:id/approve', () => {
    it('should approve a leave request', async () => {
      prisma.leave.findUnique.mockResolvedValue({
        id: '1',
        employeeId: '1',
        status: 'PENDING',
        type: 'ANNUAL',
        startDate: '2024-03-01',
        endDate: '2024-03-05',
      });

      prisma.leave.update.mockResolvedValue({
        id: '1',
        status: 'APPROVED',
        approvedBy: 'manager-id',
        approvedAt: new Date(),
      });

      const response = await request(app).put('/api/leaves/1/approve');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APPROVED');
    });

    it('should return error if leave not found', async () => {
      prisma.leave.findUnique.mockResolvedValue(null);

      const response = await request(app).put('/api/leaves/999/approve');

      expect(response.status).toBe(404);
    });

    it('should return error if leave already approved', async () => {
      prisma.leave.findUnique.mockResolvedValue({
        id: '1',
        status: 'APPROVED',
      });

      const response = await request(app).put('/api/leaves/1/approve');

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/leaves/:id/reject', () => {
    it('should reject a leave request', async () => {
      prisma.leave.findUnique.mockResolvedValue({
        id: '1',
        employeeId: '1',
        status: 'PENDING',
      });

      prisma.leave.update.mockResolvedValue({
        id: '1',
        status: 'REJECTED',
        rejectedBy: 'manager-id',
        rejectedAt: new Date(),
      });

      const response = await request(app).put('/api/leaves/1/reject');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('REJECTED');
    });

    it('should return error if leave not found', async () => {
      prisma.leave.findUnique.mockResolvedValue(null);

      const response = await request(app).put('/api/leaves/999/reject');

      expect(response.status).toBe(404);
    });

    it('should return error if leave already processed', async () => {
      prisma.leave.findUnique.mockResolvedValue({
        id: '1',
        status: 'APPROVED',
      });

      const response = await request(app).put('/api/leaves/1/reject');

      expect(response.status).toBe(400);
    });
  });
});
