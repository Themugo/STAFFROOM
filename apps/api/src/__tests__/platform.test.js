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
    systemSettings: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import platform controller
const platformController = require('../controllers/platformController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/platform/overview', platformController.getPlatformOverview);
app.get('/api/platform/settings', platformController.getPlatformSettings);
app.put('/api/platform/settings', platformController.updatePlatformSettings);
app.get('/api/platform/health', platformController.getPlatformHealth);
app.get('/api/platform/stats', platformController.getPlatformStats);

describe('Platform Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/platform/overview', () => {
    it('should return platform overview', async () => {
      prisma.company.findMany.mockResolvedValue([
        { id: '1', name: 'Tech Corp', status: 'ACTIVE' },
        { id: '2', name: 'Health Solutions', status: 'ACTIVE' },
      ]);

      prisma.employee.count.mockResolvedValue(500);
      prisma.employee.findMany.mockResolvedValue([
        { status: 'ACTIVE' },
        { status: 'ACTIVE' },
      ]);

      const response = await request(app).get('/api/platform/overview');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCompanies');
      expect(response.body).toHaveProperty('totalEmployees');
    });
  });

  describe('GET /api/platform/settings', () => {
    it('should return platform settings', async () => {
      const mockSettings = {
        id: '1',
        maintenanceMode: false,
        registrationEnabled: true,
        maxCompanies: 100,
        maxEmployeesPerCompany: 500,
      };

      prisma.systemSettings.findUnique.mockResolvedValue(mockSettings);

      const response = await request(app).get('/api/platform/settings');

      expect(response.status).toBe(200);
      expect(response.body.maintenanceMode).toBe(false);
    });
  });

  describe('PUT /api/platform/settings', () => {
    it('should update platform settings', async () => {
      const updatedSettings = {
        maintenanceMode: true,
        registrationEnabled: false,
      };

      prisma.systemSettings.findUnique.mockResolvedValue({
        id: '1',
        maintenanceMode: false,
      });

      prisma.systemSettings.update.mockResolvedValue({
        id: '1',
        maintenanceMode: true,
        registrationEnabled: false,
      });

      const response = await request(app)
        .put('/api/platform/settings')
        .send(updatedSettings);

      expect(response.status).toBe(200);
      expect(response.body.maintenanceMode).toBe(true);
    });
  });

  describe('GET /api/platform/health', () => {
    it('should return platform health status', async () => {
      const response = await request(app).get('/api/platform/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('api');
    });
  });

  describe('GET /api/platform/stats', () => {
    it('should return platform statistics', async () => {
      prisma.company.findMany.mockResolvedValue([
        { id: '1', status: 'ACTIVE' },
        { id: '2', status: 'ACTIVE' },
      ]);

      prisma.employee.count.mockResolvedValue(500);

      const response = await request(app).get('/api/platform/stats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalCompanies');
      expect(response.body).toHaveProperty('totalEmployees');
      expect(response.body).toHaveProperty('activeUsers');
    });
  });
});
