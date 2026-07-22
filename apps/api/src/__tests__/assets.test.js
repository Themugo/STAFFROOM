const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    asset: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    assetAssignment: {
      findMany: jest.fn(),
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

// Import assets controller
const assetsController = require('../controllers/assetsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/assets', assetsController.getAllAssets);
app.get('/api/assets/:id', assetsController.getAssetById);
app.post('/api/assets', assetsController.createAsset);
app.put('/api/assets/:id', assetsController.updateAsset);
app.delete('/api/assets/:id', assetsController.deleteAsset);
app.get('/api/assets/:id/assignments', assetsController.getAssetAssignments);

describe('Assets Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/assets', () => {
    it('should return all assets', async () => {
      const mockAssets = [
        {
          id: '1',
          name: 'Laptop',
          type: 'EQUIPMENT',
          serialNumber: 'SN12345',
          status: 'AVAILABLE',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Office Chair',
          type: 'FURNITURE',
          serialNumber: 'SN67890',
          status: 'ASSIGNED',
          companyId: '1',
        },
      ];

      prisma.asset.findMany.mockResolvedValue(mockAssets);

      const response = await request(app).get('/api/assets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('AVAILABLE');
    });

    it('should filter assets by type', async () => {
      const mockAssets = [
        {
          id: '1',
          type: 'EQUIPMENT',
          status: 'AVAILABLE',
        },
      ];

      prisma.asset.findMany.mockResolvedValue(mockAssets);

      const response = await request(app).get('/api/assets?type=EQUIPMENT');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter assets by status', async () => {
      const mockAssets = [
        {
          id: '1',
          status: 'AVAILABLE',
        },
      ];

      prisma.asset.findMany.mockResolvedValue(mockAssets);

      const response = await request(app).get('/api/assets?status=AVAILABLE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/assets/:id', () => {
    it('should return asset by ID', async () => {
      const mockAsset = {
        id: '1',
        name: 'Laptop',
        type: 'EQUIPMENT',
        serialNumber: 'SN12345',
        status: 'AVAILABLE',
      };

      prisma.asset.findUnique.mockResolvedValue(mockAsset);

      const response = await request(app).get('/api/assets/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Laptop');
    });

    it('should return 404 if asset not found', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/assets/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/assets', () => {
    it('should create a new asset', async () => {
      const newAsset = {
        name: 'Monitor',
        type: 'EQUIPMENT',
        serialNumber: 'SN54321',
        purchaseDate: '2024-01-01',
        purchasePrice: 50000,
        companyId: '1',
      };

      prisma.asset.create.mockResolvedValue({
        id: '3',
        ...newAsset,
        status: 'AVAILABLE',
      });

      const response = await request(app)
        .post('/api/assets')
        .send(newAsset);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('AVAILABLE');
    });

    it('should validate required fields', async () => {
      const incompleteAsset = {
        name: 'Monitor',
        // Missing type, serialNumber, and companyId
      };

      const response = await request(app)
        .post('/api/assets')
        .send(incompleteAsset);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/assets/:id', () => {
    it('should update an asset', async () => {
      const updatedData = {
        status: 'ASSIGNED',
        assignedTo: 'employee-id',
      };

      prisma.asset.findUnique.mockResolvedValue({
        id: '1',
        status: 'AVAILABLE',
      });

      prisma.asset.update.mockResolvedValue({
        id: '1',
        status: 'ASSIGNED',
        assignedTo: 'employee-id',
      });

      const response = await request(app)
        .put('/api/assets/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ASSIGNED');
    });

    it('should return 404 if asset not found', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/assets/999')
        .send({ status: 'ASSIGNED' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/assets/:id', () => {
    it('should delete an asset', async () => {
      prisma.asset.findUnique.mockResolvedValue({
        id: '1',
        name: 'Laptop',
      });

      prisma.asset.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/assets/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if asset not found', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/assets/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/assets/:id/assignments', () => {
    it('should return asset assignments', async () => {
      const mockAssignments = [
        {
          id: '1',
          assetId: '1',
          employeeId: '1',
          assignedAt: new Date(),
          returnedAt: null,
        },
      ];

      prisma.assetAssignment.findMany.mockResolvedValue(mockAssignments);

      const response = await request(app).get('/api/assets/1/assignments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });
});
