const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    company: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import company controller
const companyController = require('../controllers/companyController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/companies', companyController.getAllCompanies);
app.get('/api/companies/:id', companyController.getCompanyById);
app.post('/api/companies', companyController.createCompany);
app.put('/api/companies/:id', companyController.updateCompany);
app.delete('/api/companies/:id', companyController.deleteCompany);
app.get('/api/companies/:id/stats', companyController.getCompanyStats);

describe('Company Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/companies', () => {
    it('should return all companies', async () => {
      const mockCompanies = [
        {
          id: '1',
          name: 'Tech Corp',
          email: 'info@techcorp.com',
          phone: '1234567890',
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Health Solutions',
          email: 'info@healthsolutions.com',
          phone: '0987654321',
          status: 'ACTIVE',
        },
      ];

      prisma.company.findMany.mockResolvedValue(mockCompanies);

      const response = await request(app).get('/api/companies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });

    it('should filter companies by status', async () => {
      const mockCompanies = [
        {
          id: '1',
          status: 'ACTIVE',
        },
      ];

      prisma.company.findMany.mockResolvedValue(mockCompanies);

      const response = await request(app).get('/api/companies?status=ACTIVE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/companies/:id', () => {
    it('should return company by ID', async () => {
      const mockCompany = {
        id: '1',
        name: 'Tech Corp',
        email: 'info@techcorp.com',
        phone: '1234567890',
        status: 'ACTIVE',
      };

      prisma.company.findUnique.mockResolvedValue(mockCompany);

      const response = await request(app).get('/api/companies/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Tech Corp');
    });

    it('should return 404 if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/companies/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/companies', () => {
    it('should create a new company', async () => {
      const newCompany = {
        name: 'Innovate Ltd',
        email: 'info@innovateltd.com',
        phone: '5551234567',
        address: '123 Innovation Street',
      };

      prisma.company.create.mockResolvedValue({
        id: '3',
        ...newCompany,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/companies')
        .send(newCompany);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should validate required fields', async () => {
      const incompleteCompany = {
        email: 'info@test.com',
        // Missing name
      };

      const response = await request(app)
        .post('/api/companies')
        .send(incompleteCompany);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/companies/:id', () => {
    it('should update a company', async () => {
      const updatedData = {
        name: 'Updated Tech Corp',
        phone: '9998887777',
      };

      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.company.update.mockResolvedValue({
        id: '1',
        name: 'Updated Tech Corp',
        phone: '9998887777',
      });

      const response = await request(app)
        .put('/api/companies/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Tech Corp');
    });

    it('should return 404 if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/companies/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/companies/:id', () => {
    it('should delete a company', async () => {
      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.employee.findMany.mockResolvedValue([]);
      prisma.company.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/companies/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/companies/999');

      expect(response.status).toBe(404);
    });

    it('should return 400 if company has employees', async () => {
      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.employee.findMany.mockResolvedValue([
        { id: '1', name: 'John Doe' },
      ]);

      const response = await request(app).delete('/api/companies/1');

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/companies/:id/stats', () => {
    it('should return company statistics', async () => {
      prisma.employee.count.mockResolvedValue(50);
      prisma.employee.findMany.mockResolvedValue([
        { status: 'ACTIVE' },
        { status: 'ACTIVE' },
        { status: 'INACTIVE' },
      ]);

      const response = await request(app).get('/api/companies/1/stats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalEmployees');
      expect(response.body).toHaveProperty('activeEmployees');
    });
  });
});
