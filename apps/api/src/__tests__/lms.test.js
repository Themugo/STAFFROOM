const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    enrollment: {
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

// Import LMS controller
const lmsController = require('../controllers/lmsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/lms/courses', lmsController.getAllCourses);
app.get('/api/lms/courses/:id', lmsController.getCourseById);
app.post('/api/lms/courses', lmsController.createCourse);
app.put('/api/lms/courses/:id', lmsController.updateCourse);
app.delete('/api/lms/courses/:id', lmsController.deleteCourse);
app.get('/api/lms/enrollments', lmsController.getAllEnrollments);
app.post('/api/lms/enrollments', lmsController.createEnrollment);

describe('LMS Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lms/courses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        {
          id: '1',
          title: 'Leadership Training',
          description: 'Develop leadership skills',
          category: 'MANAGEMENT',
          duration: 40,
          status: 'ACTIVE',
        },
        {
          id: '2',
          title: 'Safety Procedures',
          description: 'Workplace safety training',
          category: 'COMPLIANCE',
          duration: 20,
          status: 'ACTIVE',
        },
      ];

      prisma.course.findMany.mockResolvedValue(mockCourses);

      const response = await request(app).get('/api/lms/courses');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].category).toBe('MANAGEMENT');
    });

    it('should filter courses by category', async () => {
      const mockCourses = [
        {
          id: '1',
          category: 'MANAGEMENT',
        },
      ];

      prisma.course.findMany.mockResolvedValue(mockCourses);

      const response = await request(app).get('/api/lms/courses?category=MANAGEMENT');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/lms/courses/:id', () => {
    it('should return course by ID', async () => {
      const mockCourse = {
        id: '1',
        title: 'Leadership Training',
        description: 'Develop leadership skills',
        category: 'MANAGEMENT',
        status: 'ACTIVE',
      };

      prisma.course.findUnique.mockResolvedValue(mockCourse);

      const response = await request(app).get('/api/lms/courses/1');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Leadership Training');
    });

    it('should return 404 if course not found', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/lms/courses/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/lms/courses', () => {
    it('should create a new course', async () => {
      const newCourse = {
        title: 'Communication Skills',
        description: 'Improve workplace communication',
        category: 'SOFT_SKILLS',
        duration: 30,
        companyId: '1',
      };

      prisma.course.create.mockResolvedValue({
        id: '3',
        ...newCourse,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/lms/courses')
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should validate required fields', async () => {
      const incompleteCourse = {
        title: 'Test Course',
        // Missing description, category, duration
      };

      const response = await request(app)
        .post('/api/lms/courses')
        .send(incompleteCourse);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/lms/courses/:id', () => {
    it('should update a course', async () => {
      const updatedData = {
        title: 'Updated Leadership Training',
        duration: 45,
      };

      prisma.course.findUnique.mockResolvedValue({
        id: '1',
        title: 'Leadership Training',
      });

      prisma.course.update.mockResolvedValue({
        id: '1',
        title: 'Updated Leadership Training',
        duration: 45,
      });

      const response = await request(app)
        .put('/api/lms/courses/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Leadership Training');
    });

    it('should return 404 if course not found', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/lms/courses/999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/lms/courses/:id', () => {
    it('should delete a course', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: '1',
        title: 'Leadership Training',
      });

      prisma.course.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/lms/courses/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if course not found', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/lms/courses/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/lms/enrollments', () => {
    it('should return all enrollments', async () => {
      const mockEnrollments = [
        {
          id: '1',
          employeeId: '1',
          courseId: '1',
          status: 'IN_PROGRESS',
          enrolledAt: new Date(),
        },
        {
          id: '2',
          employeeId: '2',
          courseId: '1',
          status: 'COMPLETED',
          enrolledAt: new Date(),
        },
      ];

      prisma.enrollment.findMany.mockResolvedValue(mockEnrollments);

      const response = await request(app).get('/api/lms/enrollments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/lms/enrollments', () => {
    it('should create a new enrollment', async () => {
      const newEnrollment = {
        employeeId: '1',
        courseId: '1',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        status: 'ACTIVE',
      });

      prisma.enrollment.create.mockResolvedValue({
        id: '3',
        ...newEnrollment,
        status: 'IN_PROGRESS',
        enrolledAt: new Date(),
      });

      const response = await request(app)
        .post('/api/lms/enrollments')
        .send(newEnrollment);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('IN_PROGRESS');
    });

    it('should return error if employee not found', async () => {
      const newEnrollment = {
        employeeId: '999',
        courseId: '1',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/lms/enrollments')
        .send(newEnrollment);

      expect(response.status).toBe(404);
    });
  });
});
