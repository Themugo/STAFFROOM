const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    payslip: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    payrollPeriod: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import payroll controller
const payrollController = require('../controllers/payrollController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/payroll/payslips', payrollController.getAllPayslips);
app.get('/api/payroll/payslips/:id', payrollController.getPayslipById);
app.post('/api/payroll/payslips', payrollController.createPayslip);
app.put('/api/payroll/payslips/:id', payrollController.updatePayslip);
app.get('/api/payroll/summary', payrollController.getPayrollSummary);

describe('Payroll Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/payroll/payslips', () => {
    it('should return all payslips', async () => {
      const mockPayslips = [
        {
          id: '1',
          employeeId: '1',
          periodId: '1',
          grossPay: 100000,
          netPay: 85000,
          status: 'PAID',
        },
        {
          id: '2',
          employeeId: '2',
          periodId: '1',
          grossPay: 90000,
          netPay: 76500,
          status: 'PAID',
        },
      ];

      prisma.payslip.findMany.mockResolvedValue(mockPayslips);

      const response = await request(app).get('/api/payroll/payslips');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PAID');
    });

    it('should filter payslips by employee', async () => {
      const mockPayslips = [
        {
          id: '1',
          employeeId: '1',
          status: 'PAID',
        },
      ];

      prisma.payslip.findMany.mockResolvedValue(mockPayslips);

      const response = await request(app).get('/api/payroll/payslips?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter payslips by period', async () => {
      const mockPayslips = [
        {
          id: '1',
          periodId: '1',
          status: 'PAID',
        },
      ];

      prisma.payslip.findMany.mockResolvedValue(mockPayslips);

      const response = await request(app).get('/api/payroll/payslips?periodId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/payroll/payslips/:id', () => {
    it('should return payslip by ID', async () => {
      const mockPayslip = {
        id: '1',
        employeeId: '1',
        periodId: '1',
        grossPay: 100000,
        netPay: 85000,
        status: 'PAID',
      };

      prisma.payslip.findUnique.mockResolvedValue(mockPayslip);

      const response = await request(app).get('/api/payroll/payslips/1');

      expect(response.status).toBe(200);
      expect(response.body.grossPay).toBe(100000);
    });

    it('should return 404 if payslip not found', async () => {
      prisma.payslip.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/payroll/payslips/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/payroll/payslips', () => {
    it('should create a new payslip', async () => {
      const newPayslip = {
        employeeId: '1',
        periodId: '1',
        grossPay: 100000,
        deductions: 15000,
        netPay: 85000,
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.payrollPeriod.findUnique.mockResolvedValue({
        id: '1',
        status: 'ACTIVE',
      });

      prisma.payslip.create.mockResolvedValue({
        id: '3',
        ...newPayslip,
        status: 'PENDING',
      });

      const response = await request(app)
        .post('/api/payroll/payslips')
        .send(newPayslip);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if employee not found', async () => {
      const newPayslip = {
        employeeId: '999',
        periodId: '1',
        grossPay: 100000,
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/payroll/payslips')
        .send(newPayslip);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompletePayslip = {
        employeeId: '1',
        // Missing periodId and grossPay
      };

      const response = await request(app)
        .post('/api/payroll/payslips')
        .send(incompletePayslip);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/payroll/payslips/:id', () => {
    it('should update a payslip', async () => {
      const updatedData = {
        status: 'PAID',
        paidAt: new Date(),
      };

      prisma.payslip.findUnique.mockResolvedValue({
        id: '1',
        status: 'PENDING',
      });

      prisma.payslip.update.mockResolvedValue({
        id: '1',
        status: 'PAID',
        paidAt: new Date(),
      });

      const response = await request(app)
        .put('/api/payroll/payslips/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PAID');
    });

    it('should return 404 if payslip not found', async () => {
      prisma.payslip.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/payroll/payslips/999')
        .send({ status: 'PAID' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/payroll/summary', () => {
    it('should return payroll summary', async () => {
      const mockSummary = {
        totalEmployees: 50,
        totalGrossPay: 5000000,
        totalNetPay: 4250000,
        totalDeductions: 750000,
        paidCount: 45,
        pendingCount: 5,
      };

      prisma.payslip.findMany.mockResolvedValue([
        { grossPay: 100000, netPay: 85000, status: 'PAID' },
        { grossPay: 90000, netPay: 76500, status: 'PENDING' },
      ]);

      prisma.employee.findMany.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);

      const response = await request(app).get('/api/payroll/summary');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalGrossPay');
    });
  });
});
