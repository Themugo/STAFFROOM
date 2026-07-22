const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    employmentHistory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    certification: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import employee 360 controller
const employee360Controller = require('../controllers/employee360Controller');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/employee360/:id', employee360Controller.getEmployee360);
app.get('/api/employee360/:id/history', employee360Controller.getEmploymentHistory);
app.post('/api/employee360/:id/history', employee360Controller.addEmploymentHistory);
app.get('/api/employee360/:id/skills', employee360Controller.getSkills);
app.post('/api/employee360/:id/skills', employee360Controller.addSkill);
app.get('/api/employee360/:id/certifications', employee360Controller.getCertifications);

describe('Employee 360 Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/employee360/:id', () => {
    it('should return employee 360 profile', async () => {
      const mockEmployee = {
        id: '1',
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        department: { name: 'Engineering' },
        position: { title: 'Software Engineer' },
        skills: [{ name: 'JavaScript' }, { name: 'React' }],
        certifications: [{ name: 'AWS Certified' }],
      };

      prisma.employee.findUnique.mockResolvedValue(mockEmployee);

      const response = await request(app).get('/api/employee360/1');

      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('John');
    });

    it('should return 404 if employee not found', async () => {
      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/employee360/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/employee360/:id/history', () => {
    it('should return employment history', async () => {
      const mockHistory = [
        {
          id: '1',
          employeeId: '1',
          company: 'Previous Company',
          position: 'Senior Developer',
          startDate: '2020-01-01',
          endDate: '2023-12-31',
        },
        {
          id: '2',
          employeeId: '1',
          company: 'Another Company',
          position: 'Developer',
          startDate: '2018-01-01',
          endDate: '2019-12-31',
        },
      ];

      prisma.employmentHistory.findMany.mockResolvedValue(mockHistory);

      const response = await request(app).get('/api/employee360/1/history');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].company).toBe('Previous Company');
    });
  });

  describe('POST /api/employee360/:id/history', () => {
    it('should add employment history', async () => {
      const newHistory = {
        company: 'New Company',
        position: 'Lead Developer',
        startDate: '2024-01-01',
        endDate: null,
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.employmentHistory.create.mockResolvedValue({
        id: '3',
        employeeId: '1',
        ...newHistory,
      });

      const response = await request(app)
        .post('/api/employee360/1/history')
        .send(newHistory);

      expect(response.status).toBe(201);
      expect(response.body.company).toBe('New Company');
    });

    it('should return error if employee not found', async () => {
      const newHistory = {
        company: 'New Company',
        position: 'Developer',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/employee360/999/history')
        .send(newHistory);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/employee360/:id/skills', () => {
    it('should return employee skills', async () => {
      const mockSkills = [
        { id: '1', name: 'JavaScript', level: 'EXPERT' },
        { id: '2', name: 'React', level: 'ADVANCED' },
        { id: '3', name: 'Node.js', level: 'INTERMEDIATE' },
      ];

      prisma.skill.findMany.mockResolvedValue(mockSkills);

      const response = await request(app).get('/api/employee360/1/skills');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].name).toBe('JavaScript');
    });
  });

  describe('POST /api/employee360/:id/skills', () => {
    it('should add skill', async () => {
      const newSkill = {
        name: 'TypeScript',
        level: 'ADVANCED',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.skill.create.mockResolvedValue({
        id: '4',
        employeeId: '1',
        ...newSkill,
      });

      const response = await request(app)
        .post('/api/employee360/1/skills')
        .send(newSkill);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('TypeScript');
    });
  });

  describe('GET /api/employee360/:id/certifications', () => {
    it('should return certifications', async () => {
      const mockCertifications = [
        { id: '1', name: 'AWS Certified Developer', issuedDate: '2023-01-15' },
        { id: '2', name: 'Google Cloud Professional', issuedDate: '2023-06-20' },
      ];

      prisma.certification.findMany.mockResolvedValue(mockCertifications);

      const response = await request(app).get('/api/employee360/1/certifications');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('AWS Certified Developer');
    });
  });
});
