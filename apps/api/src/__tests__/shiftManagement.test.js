const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    shiftAssignment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    shift: {
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

// Import shift management controller
const shiftManagementController = require('../controllers/shiftManagementController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/shift-management/shifts', shiftManagementController.getAllShifts);
app.get('/api/shift-management/shifts/:id', shiftManagementController.getShiftById);
app.post('/api/shift-management/shifts', shiftManagementController.createShift);
app.put('/api/shift-management/shifts/:id', shiftManagementController.updateShift);
app.get('/api/shift-management/assignments', shiftManagementController.getShiftAssignments);
app.post('/api/shift-management/assignments', shiftManagementController.createShiftAssignment);

describe('Shift Management Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/shift-management/shifts', () => {
    it('should return all shifts', async () => {
      const mockShifts = [
        {
          id: '1',
          name: 'Morning Shift',
          startTime: '08:00',
          endTime: '17:00',
          type: 'REGULAR',
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Night Shift',
          startTime: '20:00',
          endTime: '06:00',
          type: 'NIGHT',
          status: 'ACTIVE',
        },
      ];

      prisma.shift.findMany.mockResolvedValue(mockShifts);

      const response = await request(app).get('/api/shift-management/shifts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('REGULAR');
    });

    it('should filter shifts by type', async () => {
      const mockShifts = [
        {
          id: '1',
          type: 'NIGHT',
          status: 'ACTIVE',
        },
      ];

      prisma.shift.findMany.mockResolvedValue(mockShifts);

      const response = await request(app).get('/api/shift-management/shifts?type=NIGHT');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/shift-management/shifts/:id', () => {
    it('should return shift by ID', async () => {
      const mockShift = {
        id: '1',
        name: 'Morning Shift',
        startTime: '08:00',
        endTime: '17:00',
        type: 'REGULAR',
        status: 'ACTIVE',
      };

      prisma.shift.findUnique.mockResolvedValue(mockShift);

      const response = await request(app).get('/api/shift-management/shifts/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Morning Shift');
    });

    it('should return 404 if shift not found', async () => {
      prisma.shift.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/shift-management/shifts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/shift-management/shifts', () => {
    it('should create a new shift', async () => {
      const newShift = {
        name: 'Afternoon Shift',
        startTime: '12:00',
        endTime: '21:00',
        type: 'REGULAR',
      };

      prisma.shift.create.mockResolvedValue({
        id: '3',
        ...newShift,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/shift-management/shifts')
        .send(newShift);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('PUT /api/shift-management/shifts/:id', () => {
    it('should update a shift', async () => {
      const updatedData = {
        name: 'Updated Morning Shift',
        startTime: '09:00',
        endTime: '18:00',
      };

      prisma.shift.findUnique.mockResolvedValue({
        id: '1',
        name: 'Morning Shift',
      });

      prisma.shift.update.mockResolvedValue({
        id: '1',
        name: 'Updated Morning Shift',
        startTime: '09:00',
        endTime: '18:00',
      });

      const response = await request(app)
        .put('/api/shift-management/shifts/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Morning Shift');
    });

    it('should return 404 if shift not found', async () => {
      prisma.shift.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/shift-management/shifts/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/shift-management/assignments', () => {
    it('should return all shift assignments', async () => {
      const mockAssignments = [
        {
          id: '1',
          employeeId: '1',
          shiftId: '1',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          shiftId: '2',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          status: 'ACTIVE',
        },
      ];

      prisma.shiftAssignment.findMany.mockResolvedValue(mockAssignments);

      const response = await request(app).get('/api/shift-management/assignments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/shift-management/assignments', () => {
    it('should create a new shift assignment', async () => {
      const newAssignment = {
        employeeId: '1',
        shiftId: '1',
        startDate: '2024-02-01',
        endDate: '2024-12-31',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.shiftAssignment.create.mockResolvedValue({
        id: '3',
        ...newAssignment,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/shift-management/assignments')
        .send(newAssignment);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newAssignment = {
        employeeId: '999',
        shiftId: '1',
        startDate: '2024-02-01',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/shift-management/assignments')
        .send(newAssignment);

      expect(response.status).toBe(404);
    });
  });
});
