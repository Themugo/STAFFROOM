const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    announcement: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    chat: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    chatMessage: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import communications controller
const communicationsController = require('../controllers/communicationsController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/communications/announcements', communicationsController.getAllAnnouncements);
app.get('/api/communications/announcements/:id', communicationsController.getAnnouncementById);
app.post('/api/communications/announcements', communicationsController.createAnnouncement);
app.put('/api/communications/announcements/:id', communicationsController.updateAnnouncement);
app.delete('/api/communications/announcements/:id', communicationsController.deleteAnnouncement);
app.get('/api/communications/chats', communicationsController.getAllChats);
app.post('/api/communications/chats', communicationsController.createChat);

describe('Communications Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/communications/announcements', () => {
    it('should return all announcements', async () => {
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Company Meeting',
          content: 'All hands meeting on Friday',
          priority: 'HIGH',
          companyId: '1',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'Holiday Notice',
          content: 'Office closed on Monday',
          priority: 'MEDIUM',
          companyId: '1',
          createdAt: new Date(),
        },
      ];

      prisma.announcement.findMany.mockResolvedValue(mockAnnouncements);

      const response = await request(app).get('/api/communications/announcements');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].priority).toBe('HIGH');
    });

    it('should filter announcements by priority', async () => {
      const mockAnnouncements = [
        {
          id: '1',
          priority: 'HIGH',
        },
      ];

      prisma.announcement.findMany.mockResolvedValue(mockAnnouncements);

      const response = await request(app).get('/api/communications/announcements?priority=HIGH');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/communications/announcements/:id', () => {
    it('should return announcement by ID', async () => {
      const mockAnnouncement = {
        id: '1',
        title: 'Company Meeting',
        content: 'All hands meeting on Friday',
        priority: 'HIGH',
      };

      prisma.announcement.findUnique.mockResolvedValue(mockAnnouncement);

      const response = await request(app).get('/api/communications/announcements/1');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Company Meeting');
    });

    it('should return 404 if announcement not found', async () => {
      prisma.announcement.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/communications/announcements/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/communications/announcements', () => {
    it('should create a new announcement', async () => {
      const newAnnouncement = {
        title: 'New Policy Update',
        content: 'Updated HR policies effective immediately',
        priority: 'HIGH',
        companyId: '1',
      };

      prisma.announcement.create.mockResolvedValue({
        id: '3',
        ...newAnnouncement,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/communications/announcements')
        .send(newAnnouncement);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New Policy Update');
    });

    it('should validate required fields', async () => {
      const incompleteAnnouncement = {
        title: 'Test',
        // Missing content, priority, and companyId
      };

      const response = await request(app)
        .post('/api/communications/announcements')
        .send(incompleteAnnouncement);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/communications/announcements/:id', () => {
    it('should update an announcement', async () => {
      const updatedData = {
        title: 'Updated Company Meeting',
        content: 'Updated meeting details',
      };

      prisma.announcement.findUnique.mockResolvedValue({
        id: '1',
        title: 'Company Meeting',
      });

      prisma.announcement.update.mockResolvedValue({
        id: '1',
        title: 'Updated Company Meeting',
        content: 'Updated meeting details',
      });

      const response = await request(app)
        .put('/api/communications/announcements/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Company Meeting');
    });

    it('should return 404 if announcement not found', async () => {
      prisma.announcement.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/communications/announcements/999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/communications/announcements/:id', () => {
    it('should delete an announcement', async () => {
      prisma.announcement.findUnique.mockResolvedValue({
        id: '1',
        title: 'Company Meeting',
      });

      prisma.announcement.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/communications/announcements/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if announcement not found', async () => {
      prisma.announcement.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/communications/announcements/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/communications/chats', () => {
    it('should return all chats', async () => {
      const mockChats = [
        {
          id: '1',
          name: 'Team Chat',
          type: 'GROUP',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Direct Message',
          type: 'DIRECT',
          companyId: '1',
        },
      ];

      prisma.chat.findMany.mockResolvedValue(mockChats);

      const response = await request(app).get('/api/communications/chats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('GROUP');
    });
  });

  describe('POST /api/communications/chats', () => {
    it('should create a new chat', async () => {
      const newChat = {
        name: 'Project Discussion',
        type: 'GROUP',
        companyId: '1',
      };

      prisma.chat.create.mockResolvedValue({
        id: '3',
        ...newChat,
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/communications/chats')
        .send(newChat);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Project Discussion');
    });
  });
});
