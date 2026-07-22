const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    committee: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    assessment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    fraudAlert: {
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

// Import low priority features controller
const lowPriorityFeaturesController = require('../controllers/lowPriorityFeaturesController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/low-priority-features/committees', lowPriorityFeaturesController.getCommittees);
app.post('/api/low-priority-features/committees', lowPriorityFeaturesController.createCommittee);
app.get('/api/low-priority-features/projects', lowPriorityFeaturesController.getProjects);
app.post('/api/low-priority-features/projects', lowPriorityFeaturesController.createProject);
app.get('/api/low-priority-features/assessments', lowPriorityFeaturesController.getAssessments);
app.post('/api/low-priority-features/assessments', lowPriorityFeaturesController.createAssessment);
app.get('/api/low-priority-features/fraud-alerts', lowPriorityFeaturesController.getFraudAlerts);
app.post('/api/low-priority-features/fraud-alerts', lowPriorityFeaturesController.createFraudAlert);

describe('Low Priority Features Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/low-priority-features/committees', () => {
    it('should return all committees', async () => {
      const mockCommittees = [
        {
          id: '1',
          name: 'Health & Safety Committee',
          description: 'Workplace safety oversight',
          status: 'ACTIVE',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Social Committee',
          description: 'Employee engagement',
          status: 'ACTIVE',
          companyId: '1',
        },
      ];

      prisma.committee.findMany.mockResolvedValue(mockCommittees);

      const response = await request(app).get('/api/low-priority-features/committees');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/low-priority-features/committees', () => {
    it('should create a new committee', async () => {
      const newCommittee = {
        name: 'Diversity Committee',
        description: 'Promote diversity and inclusion',
        companyId: '1',
      };

      prisma.committee.create.mockResolvedValue({
        id: '3',
        ...newCommittee,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/low-priority-features/committees')
        .send(newCommittee);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/low-priority-features/projects', () => {
    it('should return all projects', async () => {
      const mockProjects = [
        {
          id: '1',
          name: 'Office Renovation',
          description: 'Renovate main office space',
          status: 'IN_PROGRESS',
          startDate: '2024-01-01',
          endDate: '2024-06-30',
        },
        {
          id: '2',
          name: 'System Upgrade',
          description: 'Upgrade HR system',
          status: 'PLANNED',
          startDate: '2024-07-01',
          endDate: '2024-12-31',
        },
      ];

      prisma.project.findMany.mockResolvedValue(mockProjects);

      const response = await request(app).get('/api/low-priority-features/projects');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/low-priority-features/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        name: 'Training Program',
        description: 'Implement new training system',
        startDate: '2024-04-01',
        endDate: '2024-09-30',
      };

      prisma.project.create.mockResolvedValue({
        id: '3',
        ...newProject,
        status: 'PLANNED',
      });

      const response = await request(app)
        .post('/api/low-priority-features/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PLANNED');
    });
  });

  describe('GET /api/low-priority-features/assessments', () => {
    it('should return all assessments', async () => {
      const mockAssessments = [
        {
          id: '1',
          employeeId: '1',
          type: 'SKILL_ASSESSMENT',
          title: 'Technical Skills Evaluation',
          score: 85,
          status: 'COMPLETED',
        },
        {
          id: '2',
          employeeId: '2',
          type: 'PERFORMANCE_ASSESSMENT',
          title: 'Annual Performance Review',
          score: 92,
          status: 'COMPLETED',
        },
      ];

      prisma.assessment.findMany.mockResolvedValue(mockAssessments);

      const response = await request(app).get('/api/low-priority-features/assessments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('COMPLETED');
    });
  });

  describe('POST /api/low-priority-features/assessments', () => {
    it('should create a new assessment', async () => {
      const newAssessment = {
        employeeId: '1',
        type: 'SKILL_ASSESSMENT',
        title: 'Leadership Skills Test',
        score: 78,
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.assessment.create.mockResolvedValue({
        id: '3',
        ...newAssessment,
        status: 'COMPLETED',
      });

      const response = await request(app)
        .post('/api/low-priority-features/assessments')
        .send(newAssessment);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('COMPLETED');
    });

    it('should return error if employee not found', async () => {
      const newAssessment = {
        employeeId: '999',
        type: 'SKILL_ASSESSMENT',
        title: 'Test Assessment',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/low-priority-features/assessments')
        .send(newAssessment);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/low-priority-features/fraud-alerts', () => {
    it('should return all fraud alerts', async () => {
      const mockAlerts = [
        {
          id: '1',
          type: 'ATTENDANCE_FRAUD',
          description: 'Suspicious attendance pattern',
          severity: 'HIGH',
          status: 'OPEN',
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'EXPENSE_FRAUD',
          description: 'Duplicate expense claim',
          severity: 'MEDIUM',
          status: 'UNDER_INVESTIGATION',
          createdAt: new Date(),
        },
      ];

      prisma.fraudAlert.findMany.mockResolvedValue(mockAlerts);

      const response = await request(app).get('/api/low-priority-features/fraud-alerts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].severity).toBe('HIGH');
    });
  });

  describe('POST /api/low-priority-features/fraud-alerts', () => {
    it('should create a new fraud alert', async () => {
      const newAlert = {
        type: 'ATTENDANCE_FRAUD',
        description: 'Suspicious clock-in pattern',
        severity: 'HIGH',
        relatedEmployeeId: '1',
      };

      prisma.fraudAlert.create.mockResolvedValue({
        id: '3',
        ...newAlert,
        status: 'OPEN',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/low-priority-features/fraud-alerts')
        .send(newAlert);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('OPEN');
    });
  });
});
