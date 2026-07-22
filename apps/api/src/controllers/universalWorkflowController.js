const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Workflow Template Controllers
const createWorkflowTemplate = async (req, res) => {
  try {
    const { name, description, category, triggerType, triggerConfig, steps } = req.body;
    const userId = req.user.id;
    
    const template = await prisma.workflowTemplate.create({
      data: {
        name,
        description,
        category,
        triggerType: triggerType || 'MANUAL',
        triggerConfig,
        createdBy: userId,
        steps: {
          create: steps.map((step, index) => ({
            name: step.name,
            description: step.description,
            type: step.type,
            order: index,
            config: step.config,
            isRequired: step.isRequired ?? true,
            canSkip: step.canSkip ?? false,
            timeoutMinutes: step.timeoutMinutes
          }))
        }
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    res.status(201).json(template);
  } catch (error) {
    console.error('Create workflow template error:', error);
    res.status(500).json({ error: error.message || 'Failed to create workflow template' });
  }
};

const getWorkflowTemplates = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const where = {};
    
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const templates = await prisma.workflowTemplate.findMany({
      where,
      include: {
        steps: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { executions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(templates);
  } catch (error) {
    console.error('Get workflow templates error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workflow templates' });
  }
};

const getWorkflowTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const template = await prisma.workflowTemplate.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        },
        executions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Workflow template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Get workflow template error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workflow template' });
  }
};

const updateWorkflowTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, triggerType, triggerConfig, isActive, updatedBy } = req.body;
    
    const template = await prisma.workflowTemplate.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(triggerType && { triggerType }),
        ...(triggerConfig !== undefined && { triggerConfig }),
        ...(isActive !== undefined && { isActive }),
        ...(updatedBy && { updatedBy })
      },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    res.json(template);
  } catch (error) {
    console.error('Update workflow template error:', error);
    res.status(500).json({ error: error.message || 'Failed to update workflow template' });
  }
};

const deleteWorkflowTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.workflowTemplate.delete({
      where: { id }
    });
    
    res.json({ message: 'Workflow template deleted successfully' });
  } catch (error) {
    console.error('Delete workflow template error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete workflow template' });
  }
};

// Workflow Step Controllers
const addWorkflowStep = async (req, res) => {
  try {
    const { templateId, name, description, type, order, config, isRequired, canSkip, timeoutMinutes } = req.body;
    
    const step = await prisma.workflowStep.create({
      data: {
        templateId,
        name,
        description,
        type,
        order,
        config,
        isRequired: isRequired ?? true,
        canSkip: canSkip ?? false,
        timeoutMinutes
      }
    });
    
    res.status(201).json(step);
  } catch (error) {
    console.error('Add workflow step error:', error);
    res.status(500).json({ error: error.message || 'Failed to add workflow step' });
  }
};

const updateWorkflowStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, order, config, isRequired, canSkip, timeoutMinutes } = req.body;
    
    const step = await prisma.workflowStep.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(type && { type }),
        ...(order !== undefined && { order }),
        ...(config !== undefined && { config }),
        ...(isRequired !== undefined && { isRequired }),
        ...(canSkip !== undefined && { canSkip }),
        ...(timeoutMinutes !== undefined && { timeoutMinutes })
      }
    });
    
    res.json(step);
  } catch (error) {
    console.error('Update workflow step error:', error);
    res.status(500).json({ error: error.message || 'Failed to update workflow step' });
  }
};

const deleteWorkflowStep = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.workflowStep.delete({
      where: { id }
    });
    
    res.json({ message: 'Workflow step deleted successfully' });
  } catch (error) {
    console.error('Delete workflow step error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete workflow step' });
  }
};

// Workflow Execution Controllers
const startWorkflowExecution = async (req, res) => {
  try {
    const { templateId, entityId, entityType, metadata } = req.body;
    const userId = req.user.id;
    
    // Get template with steps
    const template = await prisma.workflowTemplate.findUnique({
      where: { id: templateId },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Workflow template not found' });
    }
    
    // Create execution
    const execution = await prisma.workflowExecution.create({
      data: {
        templateId,
        category: template.category,
        initiatedBy: userId,
        entityId,
        entityType,
        totalSteps: template.steps.length,
        metadata: metadata || {},
        stepExecutions: {
          create: template.steps.map(step => ({
            stepId: step.id,
            status: 'PENDING',
            assignedTo: step.config?.assignedTo,
            assignedType: step.config?.assignedType
          }))
        }
      },
      include: {
        template: true,
        stepExecutions: {
          include: {
            step: true
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    // Start first step if exists
    if (execution.stepExecutions.length > 0) {
      const firstStep = execution.stepExecutions[0];
      await prisma.workflowStepExecution.update({
        where: { id: firstStep.id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });
    }
    
    res.status(201).json(execution);
  } catch (error) {
    console.error('Start workflow execution error:', error);
    res.status(500).json({ error: error.message || 'Failed to start workflow execution' });
  }
};

const getWorkflowExecutions = async (req, res) => {
  try {
    const { templateId, category, status, initiatedBy, entityId } = req.query;
    const where = {};
    
    if (templateId) where.templateId = templateId;
    if (category) where.category = category;
    if (status) where.status = status;
    if (initiatedBy) where.initiatedBy = initiatedBy;
    if (entityId) where.entityId = entityId;
    
    const executions = await prisma.workflowExecution.findMany({
      where,
      include: {
        template: true,
        stepExecutions: {
          include: {
            step: true
          },
          orderBy: { createdAt: 'asc' }
        },
        approvals: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(executions);
  } catch (error) {
    console.error('Get workflow executions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workflow executions' });
  }
};

const getWorkflowExecutionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const execution = await prisma.workflowExecution.findUnique({
      where: { id },
      include: {
        template: {
          include: {
            steps: {
              orderBy: { order: 'asc' }
            }
          }
        },
        stepExecutions: {
          include: {
            step: true
          },
          orderBy: { createdAt: 'asc' }
        },
        approvals: true
      }
    });
    
    if (!execution) {
      return res.status(404).json({ error: 'Workflow execution not found' });
    }
    
    res.json(execution);
  } catch (error) {
    console.error('Get workflow execution error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workflow execution' });
  }
};

const advanceWorkflowStep = async (req, res) => {
  try {
    const { executionId, stepExecutionId, status, result, comments } = req.body;
    const userId = req.user.id;
    
    // Update step execution
    const stepExecution = await prisma.workflowStepExecution.update({
      where: { id: stepExecutionId },
      data: {
        status,
        result,
        comments,
        completedAt: new Date()
      }
    });
    
    // Get execution to find next step
    const execution = await prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: {
        stepExecutions: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    // Find current step index
    const currentIndex = execution.stepExecutions.findIndex(s => s.id === stepExecutionId);
    const nextStep = execution.stepExecutions[currentIndex + 1];
    
    // If there's a next step, start it
    if (nextStep && status === 'COMPLETED') {
      await prisma.workflowStepExecution.update({
        where: { id: nextStep.id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });
      
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          currentStep: currentIndex + 1
        }
      });
    } else if (!nextStep || status === 'FAILED') {
      // Workflow completed or failed
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: status === 'FAILED' ? 'FAILED' : 'COMPLETED',
          completedAt: new Date()
        }
      });
    }
    
    res.json(stepExecution);
  } catch (error) {
    console.error('Advance workflow step error:', error);
    res.status(500).json({ error: error.message || 'Failed to advance workflow step' });
  }
};

const approveWorkflowStep = async (req, res) => {
  try {
    const { executionId, stepExecutionId, status, comments } = req.body;
    const userId = req.user.id;
    
    // Create approval record
    const approval = await prisma.workflowApproval.create({
      data: {
        executionId,
        stepExecutionId,
        approverId: userId,
        status,
        comments,
        approvedAt: new Date()
      }
    });
    
    // If approved, advance the workflow
    if (status === 'APPROVED') {
      await advanceWorkflowStep({
        user: { id: userId },
        body: {
          executionId,
          stepExecutionId,
          status: 'COMPLETED',
          result: { approved: true }
        }
      }, res);
      return;
    } else if (status === 'REJECTED') {
      await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: 'FAILED',
          completedAt: new Date()
        }
      });
    }
    
    res.status(201).json(approval);
  } catch (error) {
    console.error('Approve workflow step error:', error);
    res.status(500).json({ error: error.message || 'Failed to approve workflow step' });
  }
};

const getMyPendingApprovals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const pendingApprovals = await prisma.workflowExecution.findMany({
      where: {
        stepExecutions: {
          some: {
            assignedTo: userId,
            status: 'IN_PROGRESS'
          }
        },
        status: {
          in: ['STARTED', 'IN_PROGRESS']
        }
      },
      include: {
        template: true,
        stepExecutions: {
          where: {
            assignedTo: userId,
            status: 'IN_PROGRESS'
          },
          include: {
            step: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(pendingApprovals);
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch pending approvals' });
  }
};

module.exports = {
  // Workflow Templates
  createWorkflowTemplate,
  getWorkflowTemplates,
  getWorkflowTemplateById,
  updateWorkflowTemplate,
  deleteWorkflowTemplate,
  // Workflow Steps
  addWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
  // Workflow Executions
  startWorkflowExecution,
  getWorkflowExecutions,
  getWorkflowExecutionById,
  advanceWorkflowStep,
  approveWorkflowStep,
  getMyPendingApprovals
};
