const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    workflow: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    workflowStep: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    workflowExecution: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import universal workflow controller
const universalWorkflowController = require('../controllers/universalWorkflowController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/universal-workflow/workflows', universalWorkflowController.getAllWorkflows);
app.get('/api/universal-workflow/workflows/:id', universalWorkflowController.getWorkflowById);
app.post('/api/universal-workflow/workflows', universalWorkflowController.createWorkflow);
app.put('/api/universal-workflow/workflows/:id', universalWorkflowController.updateWorkflow);
app.delete('/api/universal-workflow/workflows/:id', universalWorkflowController.deleteWorkflow);
app.post('/api/universal-workflow/workflows/:id/execute', universalWorkflowController.executeWorkflow);
app.get('/api/universal-workflow/executions', universalWorkflowController.getWorkflowExecutions);

describe('Universal Workflow Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/universal-workflow/workflows', () => {
    it('should return all workflows', async () => {
      const mockWorkflows = [
        {
          id: '1',
          name: 'Leave Approval Workflow',
          type: 'LEAVE_APPROVAL',
          status: 'ACTIVE',
          companyId: '1',
        },
        {
          id: '2',
          name: 'Expense Approval Workflow',
          type: 'EXPENSE_APPROVAL',
          status: 'ACTIVE',
          companyId: '1',
        },
      ];

      prisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const response = await request(app).get('/api/universal-workflow/workflows');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('LEAVE_APPROVAL');
    });

    it('should filter workflows by type', async () => {
      const mockWorkflows = [
        {
          id: '1',
          type: 'LEAVE_APPROVAL',
          status: 'ACTIVE',
        },
      ];

      prisma.workflow.findMany.mockResolvedValue(mockWorkflows);

      const response = await request(app).get('/api/universal-workflow/workflows?type=LEAVE_APPROVAL');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/universal-workflow/workflows/:id', () => {
    it('should return workflow by ID', async () => {
      const mockWorkflow = {
        id: '1',
        name: 'Leave Approval Workflow',
        type: 'LEAVE_APPROVAL',
        status: 'ACTIVE',
      };

      prisma.workflow.findUnique.mockResolvedValue(mockWorkflow);

      const response = await request(app).get('/api/universal-workflow/workflows/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Leave Approval Workflow');
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/universal-workflow/workflows/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/universal-workflow/workflows', () => {
    it('should create a new workflow', async () => {
      const newWorkflow = {
        name: 'New Approval Workflow',
        type: 'CUSTOM_APPROVAL',
        companyId: '1',
        steps: [
          { name: 'Manager Review', order: 1 },
          { name: 'HR Review', order: 2 },
        ],
      };

      prisma.company.findUnique.mockResolvedValue({
        id: '1',
        name: 'Tech Corp',
      });

      prisma.workflow.create.mockResolvedValue({
        id: '3',
        ...newWorkflow,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/universal-workflow/workflows')
        .send(newWorkflow);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if company not found', async () => {
      const newWorkflow = {
        name: 'Test Workflow',
        type: 'CUSTOM_APPROVAL',
        companyId: '999',
      };

      prisma.company.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/universal-workflow/workflows')
        .send(newWorkflow);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/universal-workflow/workflows/:id', () => {
    it('should update a workflow', async () => {
      const updatedData = {
        name: 'Updated Workflow Name',
        status: 'INACTIVE',
      };

      prisma.workflow.findUnique.mockResolvedValue({
        id: '1',
        name: 'Leave Approval Workflow',
      });

      prisma.workflow.update.mockResolvedValue({
        id: '1',
        name: 'Updated Workflow Name',
        status: 'INACTIVE',
      });

      const response = await request(app)
        .put('/api/universal-workflow/workflows/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Workflow Name');
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/universal-workflow/workflows/999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/universal-workflow/workflows/:id', () => {
    it('should delete a workflow', async () => {
      prisma.workflow.findUnique.mockResolvedValue({
        id: '1',
        name: 'Leave Approval Workflow',
      });

      prisma.workflow.delete.mockResolvedValue({
        id: '1',
      });

      const response = await request(app).delete('/api/universal-workflow/workflows/1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if workflow not found', async () => {
      prisma.workflow.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/universal-workflow/workflows/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/universal-workflow/workflows/:id/execute', () => {
    it('should execute a workflow', async () => {
      prisma.workflow.findUnique.mockResolvedValue({
        id: '1',
        name: 'Leave Approval Workflow',
        status: 'ACTIVE',
      });

      prisma.workflowExecution.create.mockResolvedValue({
        id: '1',
        workflowId: '1',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      });

      const response = await request(app).post('/api/universal-workflow/workflows/1/execute');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('IN_PROGRESS');
    });
  });

  describe('GET /api/universal-workflow/executions', () => {
    it('should return all workflow executions', async () => {
      const mockExecutions = [
        {
          id: '1',
          workflowId: '1',
          status: 'COMPLETED',
          startedAt: new Date(),
          completedAt: new Date(),
        },
        {
          id: '2',
          workflowId: '2',
          status: 'IN_PROGRESS',
          startedAt: new Date(),
        },
      ];

      prisma.workflowExecution.findMany.mockResolvedValue(mockExecutions);

      const response = await request(app).get('/api/universal-workflow/executions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].status).toBe('COMPLETED');
    });
  });
});
