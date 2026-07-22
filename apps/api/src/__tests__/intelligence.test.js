const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employeeRiskPrediction: {
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

// Import intelligence controller
const intelligenceController = require('../controllers/intelligenceController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/intelligence/risk-predictions', intelligenceController.getRiskPredictions);
app.get('/api/intelligence/risk-predictions/:id', intelligenceController.getRiskPredictionById);
app.post('/api/intelligence/risk-predictions', intelligenceController.createRiskPrediction);
app.get('/api/intelligence/analytics', intelligenceController.getWorkforceAnalytics);

describe('Intelligence Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/intelligence/risk-predictions', () => {
    it('should return all risk predictions', async () => {
      const mockPredictions = [
        {
          id: '1',
          employeeId: '1',
          riskType: 'ATTRITION',
          riskLevel: 'HIGH',
          probability: 0.85,
          factors: ['Low salary', 'Long commute'],
          predictedAt: new Date(),
        },
        {
          id: '2',
          employeeId: '2',
          riskType: 'BURNOUT',
          riskLevel: 'MEDIUM',
          probability: 0.65,
          factors: ['High workload'],
          predictedAt: new Date(),
        },
      ];

      prisma.employeeRiskPrediction.findMany.mockResolvedValue(mockPredictions);

      const response = await request(app).get('/api/intelligence/risk-predictions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].riskLevel).toBe('HIGH');
    });

    it('should filter predictions by risk type', async () => {
      const mockPredictions = [
        {
          id: '1',
          riskType: 'ATTRITION',
          riskLevel: 'HIGH',
        },
      ];

      prisma.employeeRiskPrediction.findMany.mockResolvedValue(mockPredictions);

      const response = await request(app).get('/api/intelligence/risk-predictions?riskType=ATTRITION');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter predictions by risk level', async () => {
      const mockPredictions = [
        {
          id: '1',
          riskLevel: 'HIGH',
        },
      ];

      prisma.employeeRiskPrediction.findMany.mockResolvedValue(mockPredictions);

      const response = await request(app).get('/api/intelligence/risk-predictions?riskLevel=HIGH');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/intelligence/risk-predictions/:id', () => {
    it('should return risk prediction by ID', async () => {
      const mockPrediction = {
        id: '1',
        employeeId: '1',
        riskType: 'ATTRITION',
        riskLevel: 'HIGH',
        probability: 0.85,
        factors: ['Low salary', 'Long commute'],
      };

      prisma.employeeRiskPrediction.findUnique.mockResolvedValue(mockPrediction);

      const response = await request(app).get('/api/intelligence/risk-predictions/1');

      expect(response.status).toBe(200);
      expect(response.body.riskType).toBe('ATTRITION');
    });

    it('should return 404 if prediction not found', async () => {
      prisma.employeeRiskPrediction.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/intelligence/risk-predictions/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/intelligence/risk-predictions', () => {
    it('should create a new risk prediction', async () => {
      const newPrediction = {
        employeeId: '1',
        riskType: 'ATTRITION',
        riskLevel: 'HIGH',
        probability: 0.85,
        factors: ['Low salary', 'Long commute'],
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.employeeRiskPrediction.create.mockResolvedValue({
        id: '3',
        ...newPrediction,
        predictedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/intelligence/risk-predictions')
        .send(newPrediction);

      expect(response.status).toBe(201);
      expect(response.body.riskType).toBe('ATTRITION');
    });

    it('should return error if employee not found', async () => {
      const newPrediction = {
        employeeId: '999',
        riskType: 'ATTRITION',
        riskLevel: 'HIGH',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/intelligence/risk-predictions')
        .send(newPrediction);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompletePrediction = {
        employeeId: '1',
        // Missing riskType, riskLevel, probability
      };

      const response = await request(app)
        .post('/api/intelligence/risk-predictions')
        .send(incompletePrediction);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/intelligence/analytics', () => {
    it('should return workforce analytics', async () => {
      const mockAnalytics = {
        totalEmployees: 100,
        activeEmployees: 95,
        averageTenure: 3.5,
        attritionRate: 0.05,
        riskDistribution: {
          HIGH: 10,
          MEDIUM: 25,
          LOW: 65,
        },
      };

      prisma.employee.findMany.mockResolvedValue([
        { status: 'ACTIVE', hireDate: new Date('2020-01-01') },
        { status: 'ACTIVE', hireDate: new Date('2021-01-01') },
      ]);

      prisma.employeeRiskPrediction.findMany.mockResolvedValue([
        { riskLevel: 'HIGH' },
        { riskLevel: 'MEDIUM' },
        { riskLevel: 'LOW' },
      ]);

      const response = await request(app).get('/api/intelligence/analytics');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalEmployees');
      expect(response.body).toHaveProperty('attritionRate');
    });
  });
});
