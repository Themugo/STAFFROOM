const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    departmentPost: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    departmentComment: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    workforceCalendarEvent: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    department: {
      findUnique: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import workforce management controller
const workforceManagementController = require('../controllers/workforceManagementController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/workforce-management/posts', workforceManagementController.getDepartmentPosts);
app.get('/api/workforce-management/posts/:id', workforceManagementController.getPostById);
app.post('/api/workforce-management/posts', workforceManagementController.createPost);
app.get('/api/workforce-management/comments', workforceManagementController.getComments);
app.post('/api/workforce-management/comments', workforceManagementController.createComment);
app.get('/api/workforce-management/calendar-events', workforceManagementController.getCalendarEvents);
app.post('/api/workforce-management/calendar-events', workforceManagementController.createCalendarEvent);
app.get('/api/workforce-management/overview', workforceManagementController.getWorkforceOverview);

describe('Workforce Management Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/workforce-management/posts', () => {
    it('should return all department posts', async () => {
      const mockPosts = [
        {
          id: '1',
          departmentId: '1',
          authorId: '1',
          title: 'Team Meeting Announcement',
          content: 'Meeting scheduled for Friday',
          type: 'ANNOUNCEMENT',
          status: 'PUBLISHED',
          createdAt: new Date(),
        },
        {
          id: '2',
          departmentId: '1',
          authorId: '2',
          title: 'Project Update',
          content: 'Project milestone achieved',
          type: 'UPDATE',
          status: 'PUBLISHED',
          createdAt: new Date(),
        },
      ];

      prisma.departmentPost.findMany.mockResolvedValue(mockPosts);

      const response = await request(app).get('/api/workforce-management/posts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('ANNOUNCEMENT');
    });

    it('should filter posts by department', async () => {
      const mockPosts = [
        {
          id: '1',
          departmentId: '1',
          type: 'ANNOUNCEMENT',
        },
      ];

      prisma.departmentPost.findMany.mockResolvedValue(mockPosts);

      const response = await request(app).get('/api/workforce-management/posts?departmentId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/workforce-management/posts/:id', () => {
    it('should return post by ID', async () => {
      const mockPost = {
        id: '1',
        departmentId: '1',
        authorId: '1',
        title: 'Team Meeting Announcement',
        content: 'Meeting scheduled for Friday',
        type: 'ANNOUNCEMENT',
        status: 'PUBLISHED',
      };

      prisma.departmentPost.findUnique.mockResolvedValue(mockPost);

      const response = await request(app).get('/api/workforce-management/posts/1');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Team Meeting Announcement');
    });

    it('should return 404 if post not found', async () => {
      prisma.departmentPost.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/workforce-management/posts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/workforce-management/posts', () => {
    it('should create a new department post', async () => {
      const newPost = {
        departmentId: '1',
        authorId: '1',
        title: 'New Policy Update',
        content: 'Updated remote work policy',
        type: 'ANNOUNCEMENT',
      };

      prisma.department.findUnique.mockResolvedValue({
        id: '1',
        name: 'Engineering',
      });

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.departmentPost.create.mockResolvedValue({
        id: '3',
        ...newPost,
        status: 'PUBLISHED',
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/workforce-management/posts')
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('PUBLISHED');
    });

    it('should return error if department not found', async () => {
      const newPost = {
        departmentId: '999',
        authorId: '1',
        title: 'Test Post',
        type: 'ANNOUNCEMENT',
      };

      prisma.department.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/workforce-management/posts')
        .send(newPost);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/workforce-management/comments', () => {
    it('should return all comments', async () => {
      const mockComments = [
        {
          id: '1',
          postId: '1',
          authorId: '2',
          content: 'Great announcement!',
          createdAt: new Date(),
        },
        {
          id: '2',
          postId: '1',
          authorId: '3',
          content: 'Looking forward to the meeting',
          createdAt: new Date(),
        },
      ];

      prisma.departmentComment.findMany.mockResolvedValue(mockComments);

      const response = await request(app).get('/api/workforce-management/comments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].content).toBe('Great announcement!');
    });
  });

  describe('POST /api/workforce-management/comments', () => {
    it('should create a new comment', async () => {
      const newComment = {
        postId: '1',
        authorId: '1',
        content: 'Thanks for the update',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
      });

      prisma.departmentComment.create.mockResolvedValue({
        id: '3',
        ...newComment,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/workforce-management/comments')
        .send(newComment);

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('Thanks for the update');
    });
  });

  describe('GET /api/workforce-management/calendar-events', () => {
    it('should return all calendar events', async () => {
      const mockEvents = [
        {
          id: '1',
          title: 'Team Building Event',
          startDate: '2024-02-15',
          endDate: '2024-02-15',
          type: 'TEAM_BUILDING',
          status: 'SCHEDULED',
        },
        {
          id: '2',
          title: 'Training Session',
          startDate: '2024-02-20',
          endDate: '2024-02-20',
          type: 'TRAINING',
          status: 'SCHEDULED',
        },
      ];

      prisma.workforceCalendarEvent.findMany.mockResolvedValue(mockEvents);

      const response = await request(app).get('/api/workforce-management/calendar-events');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('TEAM_BUILDING');
    });
  });

  describe('POST /api/workforce-management/calendar-events', () => {
    it('should create a new calendar event', async () => {
      const newEvent = {
        title: 'Quarterly Review',
        startDate: '2024-03-01',
        endDate: '2024-03-01',
        type: 'MEETING',
      };

      prisma.workforceCalendarEvent.create.mockResolvedValue({
        id: '3',
        ...newEvent,
        status: 'SCHEDULED',
      });

      const response = await request(app)
        .post('/api/workforce-management/calendar-events')
        .send(newEvent);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('SCHEDULED');
    });
  });

  describe('GET /api/workforce-management/overview', () => {
    it('should return workforce overview', async () => {
      prisma.departmentPost.findMany.mockResolvedValue([
        { id: '1', type: 'ANNOUNCEMENT' },
        { id: '2', type: 'UPDATE' },
      ]);

      prisma.workforceCalendarEvent.findMany.mockResolvedValue([
        { id: '1', type: 'TEAM_BUILDING' },
      ]);

      const response = await request(app).get('/api/workforce-management/overview');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalPosts');
      expect(response.body).toHaveProperty('upcomingEvents');
    });
  });
});
