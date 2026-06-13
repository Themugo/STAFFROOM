const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    incident: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    investigation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    grievance: {
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

// Import high priority gaps controller
const highPriorityGapsController = require('../controllers/highPriorityGapsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/high-priority-gaps/incidents', highPriorityGapsController.getIncidents);
app.post('/api/high-priority-gaps/incidents', highPriorityGapsController.createIncident);
app.get('/api/high-priority-gaps/incidents/:id', highPriorityGapsController.getIncidentById);
app.get('/api/high-priority-gaps/investigations', highPriorityGapsController.getInvestigations);
app.post('/api/high-priority-gaps/investigations', highPriorityGapsController.createInvestigation);
app.get('/api/high-priority-gaps/grievances', highPriorityGapsController.getGrievances);

describe('High Priority Gaps Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/high-priority-gaps/incidents', () => {
    it('should return all incidents', async () => {
      const mockIncidents = [
        {
          id: '1',
          type: 'SAFETY',
          description: 'Slip and fall in warehouse',
          severity: 'HIGH',
          status: 'OPEN',
          reportedAt: new Date(),
        },
        {
          id: '2',
          type: 'SECURITY',
          description: 'Unauthorized access attempt',
          severity: 'MEDIUM',
          status: 'UNDER_INVESTIGATION',
          reportedAt: new Date(),
        },
      ];

      prisma.incident.findMany.mockResolvedValue(mockIncidents);

      const response = await request(app).get('/api/high-priority-gaps/incidents');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('SAFETY');
    });

    it('should filter incidents by type', async () => {
      const mockIncidents = [
        {
          id: '1',
          type: 'SAFETY',
          severity: 'HIGH',
        },
      ];

      prisma.incident.findMany.mockResolvedValue(mockIncidents);

      const response = await request(app).get('/api/high-priority-gaps/incidents?type=SAFETY');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('POST /api/high-priority-gaps/incidents', () => {
    it('should create a new incident', async () => {
      const newIncident = {
        type: 'SAFETY',
        description: 'Chemical spill in lab',
        severity: 'HIGH',
        reportedBy: '1',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.incident.create.mockResolvedValue({
        id: '3',
        ...newIncident,
        status: 'OPEN',
        reportedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/high-priority-gaps/incidents')
        .send(newIncident);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('OPEN');
    });

    it('should return error if reporter not found', async () => {
      const newIncident = {
        type: 'SAFETY',
        description: 'Test incident',
        severity: 'HIGH',
        reportedBy: '999',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/high-priority-gaps/incidents')
        .send(newIncident);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/high-priority-gaps/incidents/:id', () => {
    it('should return incident by ID', async () => {
      const mockIncident = {
        id: '1',
        type: 'SAFETY',
        description: 'Slip and fall in warehouse',
        severity: 'HIGH',
        status: 'OPEN',
      };

      prisma.incident.findUnique.mockResolvedValue(mockIncident);

      const response = await request(app).get('/api/high-priority-gaps/incidents/1');

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('SAFETY');
    });

    it('should return 404 if incident not found', async () => {
      prisma.incident.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/high-priority-gaps/incidents/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/high-priority-gaps/investigations', () => {
    it('should return all investigations', async () => {
      const mockInvestigations = [
        {
          id: '1',
          incidentId: '1',
          type: 'SAFETY',
          status: 'IN_PROGRESS',
          startedAt: new Date(),
        },
        {
          id: '2',
          incidentId: '2',
          type: 'SECURITY',
          status: 'COMPLETED',
          startedAt: new Date(),
        },
      ];

      prisma.investigation.findMany.mockResolvedValue(mockInvestigations);

      const response = await request(app).get('/api/high-priority-gaps/investigations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/high-priority-gaps/investigations', () => {
    it('should create a new investigation', async () => {
      const newInvestigation = {
        incidentId: '1',
        type: 'SAFETY',
        investigatorId: '2',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '2',
        name: 'Jane Smith',
      });

      prisma.investigation.create.mockResolvedValue({
        id: '3',
        ...newInvestigation,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/high-priority-gaps/investigations')
        .send(newInvestigation);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('IN_PROGRESS');
    });
  });

  describe('GET /api/high-priority-gaps/grievances', () => {
    it('should return all grievances', async () => {
      const mockGrievances = [
        {
          id: '1',
          type: 'WORKPLACE_HARASSMENT',
          description: 'Unfair treatment by manager',
          status: 'OPEN',
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'SALARY_DISPUTE',
          description: 'Incorrect salary calculation',
          status: 'IN_PROGRESS',
          createdAt: new Date(),
        },
      ];

      prisma.grievance.findMany.mockResolvedValue(mockGrievances);

      const response = await request(app).get('/api/high-priority-gaps/grievances');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('WORKPLACE_HARASSMENT');
    });
  });
});
