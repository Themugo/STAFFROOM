const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    attendance: {
      findMany: jest.fn(),
    },
    leave: {
      findMany: jest.fn(),
    },
    payslip: {
      findMany: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import dashboard controller
const dashboardController = require('../controllers/dashboardController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/dashboard/stats', dashboardController.getDashboardStats);
app.get('/api/dashboard/attendance', dashboardController.getAttendanceStats);
app.get('/api/dashboard/leave', dashboardController.getLeaveStats);
app.get('/api/dashboard/payroll', dashboardController.getPayrollStats);

describe('Dashboard Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/dashboard/stats', () => {
    it('should return dashboard statistics', async () => {
      prisma.employee.count.mockResolvedValue(50);
      prisma.attendance.findMany.mockResolvedValue([
        { status: 'PRESENT' },
        { status: 'PRESENT' },
        { status: 'ABSENT' },
      ]);
      prisma.leave.findMany.mockResolvedValue([
        { status: 'PENDING' },
        { status: 'APPROVED' },
      ]);

      const response = await request(app).get('/api/dashboard/stats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalEmployees');
      expect(response.body).toHaveProperty('attendanceStats');
      expect(response.body).toHaveProperty('leaveStats');
    });
  });

  describe('GET /api/dashboard/attendance', () => {
    it('should return attendance statistics', async () => {
      const mockAttendance = [
        { date: '2024-01-15', status: 'PRESENT' },
        { date: '2024-01-15', status: 'PRESENT' },
        { date: '2024-01-15', status: 'ABSENT' },
        { date: '2024-01-15', status: 'LATE' },
      ];

      prisma.attendance.findMany.mockResolvedValue(mockAttendance);

      const response = await request(app).get('/api/dashboard/attendance?startDate=2024-01-01&endDate=2024-01-31');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('present');
      expect(response.body).toHaveProperty('absent');
      expect(response.body).toHaveProperty('late');
    });

    it('should filter by date range', async () => {
      prisma.attendance.findMany.mockResolvedValue([]);

      const response = await request(app).get('/api/dashboard/attendance?startDate=2024-01-01&endDate=2024-01-31');

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/dashboard/leave', () => {
    it('should return leave statistics', async () => {
      const mockLeaves = [
        { status: 'PENDING', type: 'ANNUAL' },
        { status: 'APPROVED', type: 'SICK' },
        { status: 'APPROVED', type: 'ANNUAL' },
        { status: 'REJECTED', type: 'ANNUAL' },
      ];

      prisma.leave.findMany.mockResolvedValue(mockLeaves);

      const response = await request(app).get('/api/dashboard/leave');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('pending');
      expect(response.body).toHaveProperty('approved');
      expect(response.body).toHaveProperty('rejected');
    });
  });

  describe('GET /api/dashboard/payroll', () => {
    it('should return payroll statistics', async () => {
      const mockPayslips = [
        { grossPay: 100000, netPay: 85000, status: 'PAID' },
        { grossPay: 90000, netPay: 76500, status: 'PAID' },
        { grossPay: 80000, netPay: 68000, status: 'PENDING' },
      ];

      prisma.payslip.findMany.mockResolvedValue(mockPayslips);

      const response = await request(app).get('/api/dashboard/payroll?periodId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalGrossPay');
      expect(response.body).toHaveProperty('totalNetPay');
      expect(response.body).toHaveProperty('paidCount');
      expect(response.body).toHaveProperty('pendingCount');
    });
  });
});
