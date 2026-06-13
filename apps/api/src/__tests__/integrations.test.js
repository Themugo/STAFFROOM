const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    integration: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import integrations controller
const integrationsController = require('../controllers/integrationsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/integrations', integrationsController.getAllIntegrations);
app.get('/api/integrations/:id', integrationsController.getIntegrationById);
app.post('/api/integrations', integrationsController.createIntegration);
app.put('/api/integrations/:id', integrationsController.updateIntegration);
app.delete('/api/integrations/:id', integrationsController.deleteIntegration);
app.post('/api/integrations/:id/sync', integrationsController.syncIntegration);

describe('Integrations Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/integrations', () => {
    it('should return all integrations', async () => {
      const mockIntegrations = [
        {
          id: '1',
          name: 'QuickBooks Integration',
          type: 'ACCOUNTING',
          status: 'ACTIVE',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Slack Integration',
          type: 'COMMUNICATION',
          status: 'ACTIVE',
          companyId: '1',
        },
      ];

      prisma.integration.findMany.mockResolvedValue(mockIntegrations);

      const response = await request(app).get('/api/integrations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('ACCOUNTING');
    });

    it('should filter integrations by type', async () => {
      const mockIntegrations = [
        {
          id: '1',
          type: 'ACCOUNTING',
          status: 'ACTIVE',
        },
      ];

      prisma.integration.findMany.mockResolvedValue(mockIntegrations);

      const response = await request(app).get('/api/integrations?type=ACCOUNTING');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/integrations/:id', () => {
    it('should return integration by ID', async () => {
      const mockIntegration = {
        id: '1',
        name: 'QuickBooks Integration',
        type: 'ACCOUNTING',
        status: 'ACTIVE',
      };

      prisma.integration.findUnique.mockResolvedValue(mockIntegration);

      const response = await request(app).get('/api/integrations/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('QuickBooks Integration');
    });

    it('should return 404 if integration not found', async () => {
      prisma.integration.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/integrations/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/integrations', () => {
    it('should create a new integration', async () => {
      const newIntegration = {
        name: 'Gmail Integration',
        type: 'EMAIL',
        companyId: '1',
        config: {
          apiKey: 'test-key',
          email: 'test@example.com',
        },
      };

      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.integration.create.mockResolvedValue({
        id: '3',
        ...newIntegration,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/integrations')
        .send(newIntegration);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if company not found', async () => {
      const newIntegration = {
        name: 'Test Integration',
        type: 'EMAIL',
        companyId: '999',
      };

      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/integrations')
        .send(newIntegration);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/integrations/:id', () => {
    it('should update an integration', async () => {
      const updatedData = {
        status: 'INACTIVE',
        config: {
          apiKey: 'new-key',
        },
      };

      prisma.integration.findUnique.mockResolvedValue({
        id: '1',
        name: 'QuickBooks Integration',
      });

      prisma.integration.update.mockResolvedValue({
        id: '1',
        status: 'INACTIVE',
        config: {
          apiKey: 'new-key',
        },
      });

      const response = await request(app)
        .put('/api/integrations/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('INACTIVE');
    });

    it('should return 404 if integration not found', async () => {
      prisma.integration.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/integrations/999')
        .send({ status: 'INACTIVE' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/integrations/:id', () => {
    it('should delete an integration', async () => {
      prisma.integration.findUnique.mockResolvedValue({
        id: '1',
        name: 'QuickBooks Integration',
      });

      prisma.integration.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/integrations/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if integration not found', async () => {
      prisma.integration.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/integrations/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/integrations/:id/sync', () => {
    it('should sync integration data', async () => {
      prisma.integration.findUnique.mockResolvedValue({
        id: '1',
        name: 'QuickBooks Integration',
        status: 'ACTIVE',
      });

      const response = await request(app).post('/api/integrations/1/sync');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('syncStatus');
    });
  });
});
