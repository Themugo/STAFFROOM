const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    company: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    payslip: {
      findMany: jest.fn(),
    },
    leave: {
      findMany: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import executive controller
const executiveController = require('../controllers/executiveController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/executive/dashboard', executiveController.getExecutiveDashboard);
app.get('/api/executive/companies', executiveController.getAllCompanies);
app.get('/api/executive/analytics', executiveController.getAnalytics);
app.get('/api/executive/reports', executiveController.getReports);

describe('Executive Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/executive/dashboard', () => {
    it('should return executive dashboard data', async () => {
      prisma.company.findMany.mockResolvedValue([
        { id: '1', name: 'Tech Corp', status: 'ACTIVE' },
        { id: '2', name: 'Health Solutions', status: 'ACTIVE' },
      ]);

      prisma.employee.count.mockResolvedValue(500);
      prisma.employee.findMany.mockResolvedValue([
        { status: 'ACTIVE' },
        { status: 'ACTIVE' },
      ]);

      prisma.payslip.findMany.mockResolvedValue([
        { grossPay: 100000 },
        { grossPay: 90000 },
      ]);

      prisma.leave.findMany.mockResolvedValue([
        { status: 'PENDING' },
        { status: 'PENDING' },
      ]);

      const response = await request(app).get('/api/executive/dashboard');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCompanies');
      expect(response.body).toHaveProperty('totalEmployees');
      expect(response.body).toHaveProperty('totalPayroll');
    });
  });

  describe('GET /api/executive/companies', () => {
    it('should return all companies with metrics', async () => {
      const mockCompanies = [
        {
          id: '1',
          name: 'Tech Corp',
          status: 'ACTIVE',
          employeeCount: 250,
          revenue: 5000000,
        },
        {
          id: '2',
          name: 'Health Solutions',
          status: 'ACTIVE',
          employeeCount: 150,
          revenue: 3000000,
        },
      ];

      prisma.company.findMany.mockResolvedValue(mockCompanies);

      const response = await request(app).get('/api/executive/companies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Tech Corp');
    });
  });

  describe('GET /api/executive/analytics', () => {
    it('should return executive analytics', async () => {
      const mockAnalytics = {
        employeeGrowth: [
          { month: 'Jan', count: 450 },
          { month: 'Feb', count: 480 },
          { month: 'Mar', count: 500 },
        ],
        revenueGrowth: [
          { month: 'Jan', amount: 4000000 },
          { month: 'Feb', amount: 4500000 },
          { month: 'Mar', amount: 5000000 },
        ],
        turnoverRate: 0.05,
        satisfactionScore: 4.2,
      };

      prisma.employee.findMany.mockResolvedValue([
        { hireDate: '2024-01-01' },
        { hireDate: '2024-02-01' },
      ]);

      const response = await request(app).get('/api/executive/analytics');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('employeeGrowth');
      expect(response.body).toHaveProperty('revenueGrowth');
    });
  });

  describe('GET /api/executive/reports', () => {
    it('should return available reports', async () => {
      const mockReports = [
        {
          id: '1',
          name: 'Monthly Payroll Report',
          type: 'PAYROLL',
          generatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Employee Turnover Report',
          type: 'HR',
          generatedAt: new Date(),
        },
      ];

      const response = await request(app).get('/api/executive/reports');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Monthly Payroll Report');
    });

    it('should filter reports by type', async () => {
      const mockReports = [
        {
          id: '1',
          name: 'Monthly Payroll Report',
          type: 'PAYROLL',
        },
      ];

      const response = await request(app).get('/api/executive/reports?type=PAYROLL');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });
});
