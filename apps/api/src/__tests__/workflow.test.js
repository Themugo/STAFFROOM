const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    workflow: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    workflowStep: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import workflow controller
const workflowController = require('../controllers/workflowController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/workflows', workflowController.getAllWorkflows);
app.get('/api/workflows/:id', workflowController.getWorkflowById);
app.post('/api/workflows', workflowController.createWorkflow);
app.put('/api/workflows/:id', workflowController.updateWorkflow);
app.delete('/api/workflows/:id', workflowController.deleteWorkflow);

describe('Workflow Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/workflows', () => {
    it('should return all workflows', async () => {
      const mockWorkflows = [
        {
          id: '1',
          name: 'Leave Approval',
          description: 'Leave request approval process',
          companyId: '1',
          status: 'ACTIVE',
        },
        {
          id: '2',
          name: 'Expense Approval',
          description: 'Expense claim approval process',
          companyId: '1',
          status: 'ACTIVE',
        },
      ];

      prisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const response = await request(app).get('/api/workflows');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('ACTIVE');
    });

    it('should filter workflows by company', async () => {
      const mockWorkflows = [
        {
          id: '1',
          companyId: '1',
          status: 'ACTIVE',
        },
      ];

      prisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const response = await request(app).get('/api/workflows?companyId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should filter workflows by status', async () => {
      const mockWorkflows = [
        {
          id: '1',
          status: 'ACTIVE',
        },
      ];

      prisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const response = await request(app).get('/api/workflows?status=ACTIVE');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/workflows/:id', () => {
    it('should return workflow by ID', async () => {
      const mockWorkflow = {
        id: '1',
        name: 'Leave Approval',
        description: 'Leave request approval process',
        companyId: '1',
        status: 'ACTIVE',
      };

      prisma.workflow.findUnique.mockResolvedValue(mockWorkflow);

      const response = await request(app).get('/api/workflows/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Leave Approval');
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/workflows/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/workflows', () => {
    it('should create a new workflow', async () => {
      const newWorkflow = {
        name: 'Performance Review',
        description: 'Annual performance review process',
        companyId: '1',
        steps: [
          { name: 'Self Assessment', order: 1 },
          { name: 'Manager Review', order: 2 },
        ],
      };

      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Test Company',
      });

      prisma.workflow.create.mockResolvedValue({
        id: '3',
        name: 'Performance Review',
        description: 'Annual performance review process',
        companyId: '1',
        status: 'ACTIVE',
      });

      prisma.workflowStep.create.mockResolvedValue({
        id: '1',
        name: 'Self Assessment',
        order: 1,
      });

      const response = await request(app)
        .post('/api/workflows')
        .send(newWorkflow);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Performance Review');
    });

    it('should return error if company not found', async () => {
      const newWorkflow = {
        name: 'Performance Review',
        companyId: '999',
      };

      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/workflows')
        .send(newWorkflow);

      expect(response.status).toBe(404);
    });

    it('should validate required fields', async () => {
      const incompleteWorkflow = {
        description: 'Test workflow',
        // Missing name and companyId
      };

      const response = await request(app)
        .post('/api/workflows')
        .send(incompleteWorkflow);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/workflows/:id', () => {
    it('should update a workflow', async () => {
      const updatedData = {
        name: 'Updated Leave Approval',
        description: 'Updated description',
      };

      prisma.workflow.findUnique.mockResolvedValue({
        id: '1',
        name: 'Leave Approval',
      });

      prisma.workflow.update.mockResolvedValue({
        id: '1',
        name: 'Updated Leave Approval',
        description: 'Updated description',
      });

      const response = await request(app)
        .put('/api/workflows/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Leave Approval');
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/workflows/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/workflows/:id', () => {
    it('should delete a workflow', async () => {
      prisma.workflow.findUnique.mockResolvedValue({
        id: '1',
        name: 'Leave Approval',
      });

      prisma.workflow.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/workflows/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/workflows/999');

      expect(response.status).toBe(404);
    });
  });
});
