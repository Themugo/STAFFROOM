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
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import low priority gaps controller
const lowPriorityGapsController = require('../controllers/lowPriorityGapsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/low-priority-gaps/committees', lowPriorityGapsController.getCommittees);
app.post('/api/low-priority-gaps/committees', lowPriorityGapsController.createCommittee);
app.get('/api/low-priority-gaps/projects', lowPriorityGapsController.getProjects);
app.post('/api/low-priority-gaps/projects', lowPriorityGapsController.createProject);
app.get('/api/low-priority-gaps/assessments', lowPriorityGapsController.getAssessments);
app.post('/api/low-priority-gaps/assessments', lowPriorityGapsController.createAssessment);

describe('Low Priority Gaps Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/low-priority-gaps/committees', () => {
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

      const response = await request(app).get('/api/low-priority-gaps/committees');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/low-priority-gaps/committees', () => {
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
        .post('/api/low-priority-gaps/committees')
        .send(newCommittee);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/low-priority-gaps/projects', () => {
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

      const response = await request(app).get('/api/low-priority-gaps/projects');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/low-priority-gaps/projects', () => {
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
        .post('/api/low-priority-gaps/projects')
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PLANNED');
    });
  });

  describe('GET /api/low-priority-gaps/assessments', () => {
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

      const response = await request(app).get('/api/low-priority-gaps/assessments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('COMPLETED');
    });
  });

  describe('POST /api/low-priority-gaps/assessments', () => {
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
        .post('/api/low-priority-gaps/assessments')
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
        .post('/api/low-priority-gaps/assessments')
        .send(newAssessment);

      expect(response.status).toBe(404);
    });
  });
});
