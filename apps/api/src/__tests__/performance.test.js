const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    performanceReview: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    feedback: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import performance controller
const performanceController = require('../controllers/performanceController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/performance/reviews', performanceController.getAllReviews);
app.get('/api/performance/reviews/:id', performanceController.getReviewById);
app.post('/api/performance/reviews', performanceController.createReview);
app.put('/api/performance/reviews/:id', performanceController.updateReview);
app.get('/api/performance/reviews/:id/feedback', performanceController.getReviewFeedback);

describe('Performance Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/performance/reviews', () => {
    it('should return all performance reviews', async () => {
      const mockReviews = [
        {
          id: '1',
          employeeId: '1',
          reviewerId: '2',
          period: 'Q1 2024',
          overallRating: 4,
          status: 'COMPLETED',
        },
        {
          id: '2',
          employeeId: '3',
          reviewerId: '2',
          period: 'Q1 2024',
          overallRating: 5,
          status: 'COMPLETED',
        },
      ];

      prisma.performanceReview.findMany.mockResolvedValue(mockReviews);

      const response = await request(app).get('/api/performance/reviews');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('COMPLETED');
    });

    it('should filter reviews by employee', async () => {
      const mockReviews = [
        {
          id: '1',
          employeeId: '1',
          status: 'COMPLETED',
        },
      ];

      prisma.performanceReview.findMany.mockResolvedValue(mockReviews);

      const response = await request(app).get('/api/performance/reviews?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter reviews by period', async () => {
      const mockReviews = [
        {
          id: '1',
          period: 'Q1 2024',
          status: 'COMPLETED',
        },
      ];

      prisma.performanceReview.findMany.mockResolvedValue(mockReviews);

      const response = await request(app).get('/api/performance/reviews?period=Q1%202024');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/performance/reviews/:id', () => {
    it('should return review by ID', async () => {
      const mockReview = {
        id: '1',
        employeeId: '1',
        reviewerId: '2',
        period: 'Q1 2024',
        overallRating: 4,
        status: 'COMPLETED',
      };

      prisma.performanceReview.findUnique.mockResolvedValue(mockReview);

      const response = await request(app).get('/api/performance/reviews/1');

      expect(response.status).toBe(200);
      expect(response.body.overallRating).toBe(4);
    });

    it('should return 404 if review not found', async () => {
      prisma.performanceReview.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/performance/reviews/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/performance/reviews', () => {
    it('should create a new performance review', async () => {
      const newReview = {
        employeeId: '1',
        reviewerId: '2',
        period: 'Q2 2024',
        overallRating: 5,
        strengths: 'Excellent communication',
        improvements: 'Time management',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.employee.findUnique.mockResolvedValue({
        id: '2',
        name: 'Jane Smith',
        status: 'ACTIVE',
      });

      prisma.performanceReview.create.mockResolvedValue({
        id: '3',
        ...newReview,
        status: 'DRAFT',
      });

      const response = await request(app)
        .post('/api/performance/reviews')
        .send(newReview);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('DRAFT');
    });

    it('should return error if employee not found', async () => {
      const newReview = {
        employeeId: '999',
        reviewerId: '2',
        period: 'Q2 2024',
        overallRating: 5,
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/performance/reviews')
        .send(newReview);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteReview = {
        employeeId: '1',
        // Missing reviewerId, period, and overallRating
      };

      const response = await request(app)
        .post('/api/performance/reviews')
        .send(incompleteReview);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/performance/reviews/:id', () => {
    it('should update a performance review', async () => {
      const updatedData = {
        status: 'COMPLETED',
        overallRating: 5,
        completedAt: new Date(),
      };

      prisma.performanceReview.findUnique.mockResolvedValue({
        id: '1',
        status: 'DRAFT',
      });

      prisma.performanceReview.update.mockResolvedValue({
        id: '1',
        status: 'COMPLETED',
        overallRating: 5,
        completedAt: new Date(),
      });

      const response = await request(app)
        .put('/api/performance/reviews/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('COMPLETED');
    });

    it('should return 404 if review not found', async () => {
      prisma.performanceReview.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/performance/reviews/999')
        .send({ status: 'COMPLETED' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/performance/reviews/:id/feedback', () => {
    it('should return feedback for a review', async () => {
      const mockFeedback = [
        {
          id: '1',
          reviewId: '1',
          fromEmployeeId: '2',
          rating: 5,
          comment: 'Great work',
        },
        {
          id: '2',
          reviewId: '1',
          fromEmployeeId: '3',
          rating: 4,
          comment: 'Good performance',
        },
      ];

      prisma.feedback.findMany.mockResolvedValue(mockFeedback);

      const response = await request(app).get('/api/performance/reviews/1/feedback');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].rating).toBe(5);
    });
  });
});
