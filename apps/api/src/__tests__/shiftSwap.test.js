const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    shiftSwapRequest: {
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

// Import shift swap controller
const shiftSwapController = require('../controllers/shiftSwapController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/shift-swap/requests', shiftSwapController.getSwapRequests);
app.get('/api/shift-swap/requests/:id', shiftSwapController.getSwapRequestById);
app.post('/api/shift-swap/requests', shiftSwapController.createSwapRequest);
app.put('/api/shift-swap/requests/:id/approve', shiftSwapController.approveSwapRequest);
app.put('/api/shift-swap/requests/:id/reject', shiftSwapController.rejectSwapRequest);

describe('Shift Swap Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/shift-swap/requests', () => {
    it('should return all swap requests', async () => {
      const mockRequests = [
        {
          id: '1',
          requesterId: '1',
          targetId: '2',
          originalShiftDate: '2024-01-20',
          requestedShiftDate: '2024-01-25',
          reason: 'Personal commitment',
          status: 'PENDING',
        },
        {
          id: '2',
          requesterId: '3',
          targetId: '4',
          originalShiftDate: '2024-01-21',
          requestedShiftDate: '2024-01-26',
          reason: 'Medical appointment',
          status: 'APPROVED',
        },
      ];

      prisma.shiftSwapRequest.findMany.mockResolvedValue(mockRequests);

      const response = await request(app).get('/api/shift-swap/requests');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should filter requests by status', async () => {
      const mockRequests = [
        {
          id: '1',
          status: 'PENDING',
        },
      ];

      prisma.shiftSwapRequest.findMany.mockResolvedValue(mockRequests);

      const response = await request(app).get('/api/shift-swap/requests?status=PENDING');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/shift-swap/requests/:id', () => {
    it('should return swap request by ID', async () => {
      const mockRequest = {
        id: '1',
        requesterId: '1',
        targetId: '2',
        originalShiftDate: '2024-01-20',
        requestedShiftDate: '2024-01-25',
        status: 'PENDING',
      };

      prisma.shiftSwapRequest.findUnique.mockResolvedValue(mockRequest);

      const response = await request(app).get('/api/shift-swap/requests/1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return 404 if request not found', async () => {
      prisma.shiftSwapRequest.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/shift-swap/requests/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/shift-swap/requests', () => {
    it('should create a new swap request', async () => {
      const newRequest = {
        requesterId: '1',
        targetId: '2',
        originalShiftDate: '2024-02-01',
        requestedShiftDate: '2024-02-05',
        reason: 'Family event',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.shiftSwapRequest.create.mockResolvedValue({
        id: '3',
        ...newRequest,
        status: 'PENDING',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/shift-swap/requests')
        .send(newRequest);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if requester not found', async () => {
      const newRequest = {
        requesterId: '999',
        targetId: '2',
        originalShiftDate: '2024-02-01',
        requestedShiftDate: '2024-02-05',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/shift-swap/requests')
        .send(newRequest);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/shift-swap/requests/:id/approve', () => {
    it('should approve a swap request', async () => {
      prisma.shiftSwapRequest.findUnique.mockResolvedValue({
        id: '1',
        status: 'PENDING',
      });

      prisma.shiftSwapRequest.update.mockResolvedValue({
        id: '1',
        status: 'APPROVED',
        approvedAt: new Date(),
      });

      const response = await request(app).put('/api/shift-swap/requests/1/approve');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('APPROVED');
    });

    it('should return 404 if request not found', async () => {
      prisma.shiftSwapRequest.findUnique.mockResolvedValue(null);

      const response = await request(app).put('/api/shift-swap/requests/999/approve');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/shift-swap/requests/:id/reject', () => {
    it('should reject a swap request', async () => {
      prisma.shiftSwapRequest.findUnique.mockResolvedValue({
        id: '1',
        status: 'PENDING',
      });

      prisma.shiftSwapRequest.update.mockResolvedValue({
        id: '1',
        status: 'REJECTED',
        rejectedAt: new Date(),
      });

      const response = await request(app).put('/api/shift-swap/requests/1/reject');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('REJECTED');
    });

    it('should return 404 if request not found', async () => {
      prisma.shiftSwapRequest.findUnique.mockResolvedValue(null);

      const response = await request(app).put('/api/shift-swap/requests/999/reject');

      expect(response.status).toBe(404);
    });
  });
});
