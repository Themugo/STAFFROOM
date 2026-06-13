const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    attendance: {
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

// Import attendance controller
const attendanceController = require('../controllers/attendanceController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/attendance', attendanceController.getAllAttendance);
app.get('/api/attendance/:id', attendanceController.getAttendanceById);
app.post('/api/attendance/check-in', attendanceController.checkIn);
app.post('/api/attendance/check-out', attendanceController.checkOut);

describe('Attendance Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/attendance', () => {
    it('should return all attendance records', async () => {
      const mockAttendance = [
        {
          id: '1',
          employeeId: '1',
          date: '2024-01-15',
          checkIn: '08:00:00',
          checkOut: '17:00:00',
          status: 'PRESENT',
        },
        {
          id: '2',
          employeeId: '2',
          date: '2024-01-15',
          checkIn: '08:30:00',
          checkOut: '17:30:00',
          status: 'PRESENT',
        },
      ];

      prisma.attendance.findMany.mockResolvedValue(mockAttendance);

      const response = await request(app).get('/api/attendance');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PRESENT');
    });

    it('should filter attendance by employee', async () => {
      const mockAttendance = [
        {
          id: '1',
          employeeId: '1',
          date: '2024-01-15',
          status: 'PRESENT',
        },
      ];

      prisma.attendance.findMany.mockResolvedValue(mockAttendance);

      const response = await request(app).get('/api/attendance?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter attendance by date range', async () => {
      const mockAttendance = [
        {
          id: '1',
          employeeId: '1',
          date: '2024-01-15',
          status: 'PRESENT',
        },
      ];

      prisma.attendance.findMany.mockResolvedValue(mockAttendance);

      const response = await request(app).get('/api/attendance?startDate=2024-01-01&endDate=2024-01-31');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/attendance/:id', () => {
    it('should return attendance by ID', async () => {
      const mockAttendance = {
        id: '1',
        employeeId: '1',
        date: '2024-01-15',
        checkIn: '08:00:00',
        checkOut: '17:00:00',
        status: 'PRESENT',
      };

      prisma.attendance.findUnique.mockResolvedValue(mockAttendance);

      const response = await request(app).get('/api/attendance/1');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PRESENT');
    });

    it('should return 404 if attendance not found', async () => {
      prisma.attendance.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/attendance/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/attendance/check-in', () => {
    it('should check in employee successfully', async () => {
      const checkInData = {
        employeeId: '1',
        date: '2024-01-15',
        checkIn: '08:00:00',
        location: 'Office',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.attendance.create.mockResolvedValue({
        id: '1',
        ...checkInData,
        status: 'PRESENT',
      });

      const response = await request(app)
        .post('/api/attendance/check-in')
        .send(checkInData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PRESENT');
    });

    it('should return error if employee not found', async () => {
      const checkInData = {
        employeeId: '999',
        date: '2024-01-15',
        checkIn: '08:00:00',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/attendance/check-in')
        .send(checkInData);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteData = {
        employeeId: '1',
        // Missing date and checkIn
      };

      const response = await request(app)
        .post('/api/attendance/check-in')
        .send(incompleteData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/attendance/check-out', () => {
    it('should check out employee successfully', async () => {
      const checkOutData = {
        attendanceId: '1',
        checkOut: '17:00:00',
      };

      prisma.attendance.findUnique.mockResolvedValue({
        id: '1',
        employeeId: '1',
        date: '2024-01-15',
        checkIn: '08:00:00',
        status: 'PRESENT',
      });

      prisma.attendance.update.mockResolvedValue({
        id: '1',
        checkOut: '17:00:00',
        status: 'PRESENT',
      });

      const response = await request(app)
        .post('/api/attendance/check-out')
        .send(checkOutData);

      expect(response.status).toBe(200);
      expect(response.body.checkOut).toBe('17:00:00');
    });

    it('should return error if attendance not found', async () => {
      const checkOutData = {
        attendanceId: '999',
        checkOut: '17:00:00',
      };

      prisma.attendance.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/attendance/check-out')
        .send(checkOutData);

      expect(response.status).toBe(404);
    });

    it('should return error if already checked out', async () => {
      const checkOutData = {
        attendanceId: '1',
        checkOut: '17:00:00',
      };

      prisma.attendance.findUnique.mockResolvedValue({
        id: '1',
        checkIn: '08:00:00',
        checkOut: '17:00:00',
        status: 'PRESENT',
      });

      const response = await request(app)
        .post('/api/attendance/check-out')
        .send(checkOutData);

      expect(response.status).toBe(400);
    });
  });
});
