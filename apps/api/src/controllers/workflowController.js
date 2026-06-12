const prisma = require('../config/database');

const getAllWorkflows = async (req, res) => {
  try {
    const { departmentId, entityType, status } = req.query;

    const where = {};
    if (departmentId) where.departmentId = departmentId;
    if (entityType) where.entityType = entityType;
    if (status) where.status = status;

    const workflows = await prisma.departmentWorkflow.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true }
        },
        _count: {
          select: { steps: true, executions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(workflows);
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ error: 'Failed to fetch workflows' });
  }
};

const getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;

    const workflow = await prisma.departmentWorkflow.findUnique({
      where: { id },
      include: {
        department: {
          select: { id: true, name: true }
        },
        steps: {
          orderBy: { order: 'asc' }
        },
        executions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            _count: {
              select: { approvals: true }
            }
          }
        }
      }
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Get workflow error:', error);
    res.status(500).json({ error: 'Failed to fetch workflow' });
  }
};

const createWorkflow = async (req, res) => {
  try {
    const { departmentId, name, description, entityType, config } = req.body;
    const userId = req.user.id;

    const workflow = await prisma.departmentWorkflow.create({
      data: {
        departmentId,
        name,
        description,
        entityType,
        config,
        status: 'DRAFT',
        createdBy: userId
      },
      include: {
        department: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json(workflow);
  } catch (error) {
    console.error('Create workflow error:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, config, status } = req.body;
    const userId = req.user.id;

    const workflow = await prisma.departmentWorkflow.update({
      where: { id },
      data: {
        name,
        description,
        config,
        status,
        updatedBy: userId
      },
      include: {
        department: {
          select: { id: true, name: true }
        }
      }
    });

    res.json(workflow);
  } catch (error) {
    console.error('Update workflow error:', error);
    res.status(500).json({ error: 'Failed to update workflow' });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    const { id } = req.params;

    const executionCount = await prisma.workflowExecution.count({
      where: { workflowId: id }
    });

    if (executionCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete workflow with executions. Archive it instead.' 
      });
    }

    await prisma.departmentWorkflow.delete({ where: { id } });

    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Delete workflow error:', error);
    res.status(500).json({ error: 'Failed to delete workflow' });
  }
};

const createWorkflowStep = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { name, description, type, order, config, isRequired } = req.body;

    const step = await prisma.workflowStep.create({
      data: {
        workflowId,
        name,
        description,
        type,
        order,
        config,
        isRequired
      }
    });

    res.status(201).json(step);
  } catch (error) {
    console.error('Create workflow step error:', error);
    res.status(500).json({ error: 'Failed to create workflow step' });
  }
};

const updateWorkflowStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, order, config, isRequired } = req.body;

    const step = await prisma.workflowStep.update({
      where: { id },
      data: {
        name,
        description,
        type,
        order,
        config,
        isRequired
      }
    });

    res.json(step);
  } catch (error) {
    console.error('Update workflow step error:', error);
    res.status(500).json({ error: 'Failed to update workflow step' });
  }
};

const deleteWorkflowStep = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workflowStep.delete({ where: { id } });

    res.json({ message: 'Workflow step deleted successfully' });
  } catch (error) {
    console.error('Delete workflow step error:', error);
    res.status(500).json({ error: 'Failed to delete workflow step' });
  }
};

const executeWorkflow = async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { entityId, entityType, data } = req.body;
    const userId = req.user.id;

    // Get workflow
    const workflow = await prisma.departmentWorkflow.findUnique({
      where: { id: workflowId },
      include: {
        steps: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    if (workflow.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Workflow is not active' });
    }

    // Create execution
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        entityId,
        entityType,
        data,
        status: 'ACTIVE',
        currentStep: 0,
        initiatedBy: userId
      },
      include: {
        workflow: {
          include: {
            steps: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    // Create approval records for first step
    const firstStep = workflow.steps[0];
    if (firstStep && firstStep.type === 'APPROVAL') {
      const approvers = firstStep.config?.approvers || [];
      
      for (const approverId of approvers) {
        await prisma.workflowApproval.create({
          data: {
            executionId: execution.id,
            stepId: firstStep.id,
            approverId,
            status: 'PENDING'
          }
        });
      }
    }

    res.status(201).json(execution);
  } catch (error) {
    console.error('Execute workflow error:', error);
    res.status(500).json({ error: 'Failed to execute workflow' });
  }
};

const approveWorkflowStep = async (req, res) => {
  try {
    const { executionId, stepId } = req.params;
    const { status, comments } = req.body;
    const userId = req.user.id;

    const approval = await prisma.workflowApproval.findFirst({
      where: {
        executionId,
        stepId,
        approverId: userId,
        status: 'PENDING'
      }
    });

    if (!approval) {
      return res.status(404).json({ error: 'Approval not found or already processed' });
    }

    const now = new Date();
    const updateData = {
      status,
      comments,
      ...(status === 'APPROVED' ? { approvedAt: now } : { rejectedAt: now })
    };

    await prisma.workflowApproval.update({
      where: { id: approval.id },
      data: updateData
    });

    // Check if all approvals for this step are complete
    const allApprovals = await prisma.workflowApproval.findMany({
      where: { executionId, stepId }
    });

    const allComplete = allApprovals.every(a => a.status !== 'PENDING');
    const anyRejected = allApprovals.some(a => a.status === 'REJECTED');

    if (allComplete) {
      const execution = await prisma.workflowExecution.findUnique({
        where: { id: executionId },
        include: {
          workflow: {
            include: {
              steps: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (anyRejected) {
        await prisma.workflowExecution.update({
          where: { id: executionId },
          data: { status: 'REJECTED', completedAt: now }
        });
      } else {
        // Move to next step
        const currentStepIndex = execution.currentStep;
        const nextStep = execution.workflow.steps[currentStepIndex + 1];

        if (nextStep) {
          await prisma.workflowExecution.update({
            where: { id: executionId },
            data: { currentStep: currentStepIndex + 1 }
          });

          // Create approvals for next step if it's an approval step
          if (nextStep.type === 'APPROVAL') {
            const approvers = nextStep.config?.approvers || [];
            
            for (const approverId of approvers) {
              await prisma.workflowApproval.create({
                data: {
                  executionId,
                  stepId: nextStep.id,
                  approverId,
                  status: 'PENDING'
                }
              });
            }
          }
        } else {
          // Workflow complete
          await prisma.workflowExecution.update({
            where: { id: executionId },
            data: { status: 'COMPLETED', completedAt: now }
          });
        }
      }
    }

    res.json({ message: 'Approval processed successfully' });
  } catch (error) {
    console.error('Approve workflow step error:', error);
    res.status(500).json({ error: 'Failed to process approval' });
  }
};

module.exports = {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  createWorkflowStep,
  updateWorkflowStep,
  deleteWorkflowStep,
  executeWorkflow,
  approveWorkflowStep
};
