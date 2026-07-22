const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    candidate: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    jobOpening: {
      findUnique: jest.fn(),
    },
    application: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import recruitment controller
const recruitmentController = require('../controllers/recruitmentController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/recruitment/candidates', recruitmentController.getAllCandidates);
app.get('/api/recruitment/candidates/:id', recruitmentController.getCandidateById);
app.post('/api/recruitment/candidates', recruitmentController.createCandidate);
app.put('/api/recruitment/candidates/:id', recruitmentController.updateCandidate);
app.get('/api/recruitment/applications', recruitmentController.getAllApplications);
app.post('/api/recruitment/applications', recruitmentController.createApplication);

describe('Recruitment Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/recruitment/candidates', () => {
    it('should return all candidates', async () => {
      const mockCandidates = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          status: 'ACTIVE',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '0987654321',
          status: 'HIRED',
        },
      ];

      prisma.candidate.findMany.mockResolvedValue(mockCandidates);

      const response = await request(app).get('/api/recruitment/candidates');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });

    it('should filter candidates by status', async () => {
      const mockCandidates = [
        {
          id: '1',
          status: 'ACTIVE',
        },
      ];

      prisma.candidate.findMany.mockResolvedValue(mockCandidates);

      const response = await request(app).get('/api/recruitment/candidates?status=ACTIVE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/recruitment/candidates/:id', () => {
    it('should return candidate by ID', async () => {
      const mockCandidate = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        status: 'ACTIVE',
      };

      prisma.candidate.findUnique.mockResolvedValue(mockCandidate);

      const response = await request(app).get('/api/recruitment/candidates/1');

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('John');
    });

    it('should return 404 if candidate not found', async () => {
      prisma.candidate.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/recruitment/candidates/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/recruitment/candidates', () => {
    it('should create a new candidate', async () => {
      const newCandidate = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '5551234567',
        resume: 'resume.pdf',
      };

      prisma.candidate.create.mockResolvedValue({
        id: '3',
        ...newCandidate,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/recruitment/candidates')
        .send(newCandidate);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should validate required fields', async () => {
      const incompleteCandidate = {
        firstName: 'Bob',
        // Missing lastName, email, phone
      };

      const response = await request(app)
        .post('/api/recruitment/candidates')
        .send(incompleteCandidate);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/recruitment/candidates/:id', () => {
    it('should update a candidate', async () => {
      const updatedData = {
        status: 'HIRED',
        hiredAt: new Date(),
      };

      prisma.candidate.findUnique.mockResolvedValue({
        id: '1',
        status: 'ACTIVE',
      });

      prisma.candidate.update.mockResolvedValue({
        id: '1',
        status: 'HIRED',
        hiredAt: new Date(),
      });

      const response = await request(app)
        .put('/api/recruitment/candidates/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('HIRED');
    });

    it('should return 404 if candidate not found', async () => {
      prisma.candidate.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/recruitment/candidates/999')
        .send({ status: 'HIRED' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/recruitment/applications', () => {
    it('should return all applications', async () => {
      const mockApplications = [
        {
          id: '1',
          candidateId: '1',
          jobOpeningId: '1',
          status: 'PENDING',
          appliedAt: new Date(),
        },
        {
          id: '2',
          candidateId: '2',
          jobOpeningId: '1',
          status: 'REVIEWED',
          appliedAt: new Date(),
        },
      ];

      prisma.application.findMany.mockResolvedValue(mockApplications);

      const response = await request(app).get('/api/recruitment/applications');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('PENDING');
    });

    it('should filter applications by job opening', async () => {
      const mockApplications = [
        {
          id: '1',
          jobOpeningId: '1',
          status: 'PENDING',
        },
      ];

      prisma.application.findMany.mockResolvedValue(mockApplications);

      const response = await request(app).get('/api/recruitment/applications?jobOpeningId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('POST /api/recruitment/applications', () => {
    it('should create a new application', async () => {
      const newApplication = {
        candidateId: '1',
        jobOpeningId: '1',
        coverLetter: 'I am interested in this position.',
      };

      prisma.candidate.findUnique.mockResolvedValue({
        id: '1',
        status: 'ACTIVE',
      });

      prisma.jobOpening.findUnique.mockResolvedValue({
        id: '1',
        status: 'OPEN',
      });

      prisma.application.create.mockResolvedValue({
        id: '3',
        ...newApplication,
        status: 'PENDING',
        appliedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/recruitment/applications')
        .send(newApplication);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PENDING');
    });

    it('should return error if candidate not found', async () => {
      const newApplication = {
        candidateId: '999',
        jobOpeningId: '1',
      };

      prisma.candidate.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/recruitment/applications')
        .send(newApplication);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteApplication = {
        candidateId: '1',
        // Missing jobOpeningId
      };

      const response = await request(app)
        .post('/api/recruitment/applications')
        .send(incompleteApplication);

      expect(response.status).toBe(400);
    });
  });
});
