const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    talentPool: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    probationReview: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    okr: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    mentorship: {
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

// Import medium priority features controller
const mediumPriorityFeaturesController = require('../controllers/mediumPriorityFeaturesController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/medium-priority-features/talent-pools', mediumPriorityFeaturesController.getTalentPools);
app.post('/api/medium-priority-features/talent-pools', mediumPriorityFeaturesController.createTalentPool);
app.get('/api/medium-priority-features/probation-reviews', mediumPriorityFeaturesController.getProbationReviews);
app.post('/api/medium-priority-features/probation-reviews', mediumPriorityFeaturesController.createProbationReview);
app.get('/api/medium-priority-features/okrs', mediumPriorityFeaturesController.getOKRs);
app.post('/api/medium-priority-features/okrs', mediumPriorityFeaturesController.createOKR);
app.get('/api/medium-priority-features/mentorships', mediumPriorityFeaturesController.getMentorships);
app.post('/api/medium-priority-features/mentorships', mediumPriorityFeaturesController.createMentorship);

describe('Medium Priority Features Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/medium-priority-features/talent-pools', () => {
    it('should return all talent pools', async () => {
      const mockPools = [
        {
          id: '1',
          name: 'Leadership Pipeline',
          description: 'Future leaders',
          status: 'ACTIVE',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Technical Experts',
          description: 'Senior technical roles',
          status: 'ACTIVE',
          companyId: '1',
        },
      ];

      prisma.talentPool.findMany.mockResolvedValue(mockPools);

      const response = await request(app).get('/api/medium-priority-features/talent-pools');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/medium-priority-features/talent-pools', () => {
    it('should create a new talent pool', async () => {
      const newPool = {
        name: 'Sales Champions',
        description: 'Top sales performers',
        companyId: '1',
      };

      prisma.talentPool.create.mockResolvedValue({
        id: '3',
        ...newPool,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/medium-priority-features/talent-pools')
        .send(newPool);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/medium-priority-features/probation-reviews', () => {
    it('should return all probation reviews', async () => {
      const mockReviews = [
        {
          id: '1',
          employeeId: '1',
          reviewDate: '2024-03-01',
          outcome: 'PASS',
          comments: 'Excellent performance',
          status: 'COMPLETED',
        },
        {
          id: '2',
          employeeId: '2',
          reviewDate: '2024-03-15',
          outcome: 'EXTEND',
          comments: 'Needs more time',
          status: 'COMPLETED',
        },
      ];

      prisma.probationReview.findMany.mockResolvedValue(mockReviews);

      const response = await request(app).get('/api/medium-priority-features/probation-reviews');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].outcome).toBe('PASS');
    });
  });

  describe('POST /api/medium-priority-features/probation-reviews', () => {
    it('should create a new probation review', async () => {
      const newReview = {
        employeeId: '1',
        reviewDate: '2024-04-01',
        outcome: 'PASS',
        comments: 'Good performance',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.probationReview.create.mockResolvedValue({
        id: '3',
        ...newReview,
        status: 'COMPLETED',
      });

      const response = await request(app)
        .post('/api/medium-priority-features/probation-reviews')
        .send(newReview);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('COMPLETED');
    });

    it('should return error if employee not found', async () => {
      const newReview = {
        employeeId: '999',
        reviewDate: '2024-04-01',
        outcome: 'PASS',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/medium-priority-features/probation-reviews')
        .send(newReview);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/medium-priority-features/okrs', () => {
    it('should return all OKRs', async () => {
      const mockOKRs = [
        {
          id: '1',
          employeeId: '1',
          title: 'Increase Sales',
          objective: 'Achieve 20% sales growth',
          keyResults: ['Close 50 deals', 'Revenue $1M'],
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          title: 'Improve Quality',
          objective: 'Reduce bug rate by 50%',
          keyResults: ['Bug rate < 1%', 'Test coverage 80%'],
          status: 'ACTIVE',
        },
      ];

      prisma.okr.findMany.mockResolvedValue(mockOKRs);

      const response = await request(app).get('/api/medium-priority-features/okrs');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/medium-priority-features/okrs', () => {
    it('should create a new OKR', async () => {
      const newOKR = {
        employeeId: '1',
        title: 'Customer Satisfaction',
        objective: 'Achieve 95% CSAT',
        keyResults: ['CSAT 95%', 'Response time < 2h'],
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.okr.create.mockResolvedValue({
        id: '3',
        ...newOKR,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/medium-priority-features/okrs')
        .send(newOKR);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newOKR = {
        employeeId: '999',
        title: 'Test OKR',
        objective: 'Test objective',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/medium-priority-features/okrs')
        .send(newOKR);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/medium-priority-features/mentorships', () => {
    it('should return all mentorships', async () => {
      const mockMentorships = [
        {
          id: '1',
          mentorId: '1',
          menteeId: '2',
          startDate: '2024-01-01',
          status: 'ACTIVE',
        },
        {
          id: '2',
          mentorId: '3',
          menteeId: '4',
          startDate: '2024-02-01',
          status: 'ACTIVE',
        },
      ];

      prisma.mentorship.findMany.mockResolvedValue(mockMentorships);

      const response = await request(app).get('/api/medium-priority-features/mentorships');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });
  });

  describe('POST /api/medium-priority-features/mentorships', () => {
    it('should create a new mentorship', async () => {
      const newMentorship = {
        mentorId: '1',
        menteeId: '2',
        startDate: '2024-03-01',
        goals: 'Leadership development',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.mentorship.create.mockResolvedValue({
        id: '3',
        ...newMentorship,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/medium-priority-features/mentorships')
        .send(newMentorship);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if mentor not found', async () => {
      const newMentorship = {
        mentorId: '999',
        menteeId: '2',
        startDate: '2024-03-01',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/medium-priority-features/mentorships')
        .send(newMentorship);

      expect(response.status).toBe(404);
    });
  });
});
