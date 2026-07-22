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
    branch: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import enterprise controller
const enterpriseController = require('../controllers/enterpriseController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/enterprise/companies', enterpriseController.getAllCompanies);
app.get('/api/enterprise/companies/:id', enterpriseController.getCompanyById);
app.post('/api/enterprise/companies', enterpriseController.createCompany);
app.get('/api/enterprise/companies/:id/branches', enterpriseController.getCompanyBranches);
app.post('/api/enterprise/companies/:id/branches', enterpriseController.createBranch);
app.get('/api/enterprise/overview', enterpriseController.getEnterpriseOverview);

describe('Enterprise Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/enterprise/companies', () => {
    it('should return all companies', async () => {
      const mockCompanies = [
        {
          id: '1',
          name: 'Tech Corp',
          industry: 'Technology',
          size: 'LARGE',
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Health Solutions',
          industry: 'Healthcare',
          size: 'MEDIUM',
          status: 'ACTIVE',
        },
      ];

      prisma.company.findMany.mockResolvedValue(mockCompanies);

      const response = await request(app).get('/api/enterprise/companies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].industry).toBe('Technology');
    });

    it('should filter companies by industry', async () => {
      const mockCompanies = [
        {
          id: '1',
          industry: 'Technology',
        },
      ];

      prisma.company.findMany.mockResolvedValue(mockCompanies);

      const response = await request(app).get('/api/enterprise/companies?industry=Technology');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/enterprise/companies/:id', () => {
    it('should return company by ID', async () => {
      const mockCompany = {
        id: '1',
        name: 'Tech Corp',
        industry: 'Technology',
        size: 'LARGE',
        status: 'ACTIVE',
      };

      prisma.company.findUnique.mockResolvedValue(mockCompany);

      const response = await request(app).get('/api/enterprise/companies/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Tech Corp');
    });

    it('should return 404 if company not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/enterprise/companies/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/enterprise/companies', () => {
    it('should create a new company', async () => {
      const newCompany = {
        name: 'Innovate Ltd',
        industry: 'Technology',
        size: 'SMALL',
        address: '123 Innovation Street',
      };

      prisma.company.create.mockResolvedValue({
        id: '3',
        ...newCompany,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/enterprise/companies')
        .send(newCompany);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/enterprise/companies/:id/branches', () => {
    it('should return company branches', async () => {
      const mockBranches = [
        {
          id: '1',
          companyId: '1',
          name: 'Main Office',
          location: 'Nairobi',
          status: 'ACTIVE',
        },
        {
          id: '2',
          companyId: '1',
          name: 'Branch Office',
          location: 'Mombasa',
          status: 'ACTIVE',
        },
      ];

      prisma.branch.findMany.mockResolvedValue(mockBranches);

      const response = await request(app).get('/api/enterprise/companies/1/branches');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Main Office');
    });
  });

  describe('POST /api/enterprise/companies/:id/branches', () => {
    it('should create a new branch', async () => {
      const newBranch = {
        name: 'New Branch',
        location: 'Kisumu',
        address: '456 Branch Street',
      };

      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.branch.create.mockResolvedValue({
        id: '3',
        companyId: '1',
        ...newBranch,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/enterprise/companies/1/branches')
        .send(newBranch);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if company not found', async () => {
      const newBranch = {
        name: 'New Branch',
        location: 'Kisumu',
      };

      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/enterprise/companies/999/branches')
        .send(newBranch);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/enterprise/overview', () => {
    it('should return enterprise overview', async () => {
      prisma.company.findMany.mockResolvedValue([
        { id: '1', name: 'Tech Corp' },
        { id: '2', name: 'Health Solutions' },
      ]);

      prisma.employee.count.mockResolvedValue(500);
      prisma.employee.findMany.mockResolvedValue([
        { status: 'ACTIVE' },
        { status: 'ACTIVE' },
      ]);

      const response = await request(app).get('/api/enterprise/overview');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCompanies');
      expect(response.body).toHaveProperty('totalEmployees');
    });
  });
});
