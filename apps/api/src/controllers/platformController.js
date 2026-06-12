const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Workflow Builder
const createWorkflowNode = async (req, res) => {
  try {
    const { workflowId, type, name, description, positionX, positionY, config, conditions } = req.body;

    const node = await prisma.workflowNode.create({
      data: {
        workflowId,
        type,
        name,
        description,
        positionX,
        positionY,
        config,
        conditions
      }
    });

    res.json(node);
  } catch (error) {
    console.error('Create workflow node error:', error);
    res.status(500).json({ error: error.message || 'Failed to create workflow node' });
  }
};

const updateWorkflowNode = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, positionX, positionY, config, conditions } = req.body;

    const node = await prisma.workflowNode.update({
      where: { id },
      data: {
        name,
        description,
        positionX,
        positionY,
        config,
        conditions
      }
    });

    res.json(node);
  } catch (error) {
    console.error('Update workflow node error:', error);
    res.status(500).json({ error: error.message || 'Failed to update workflow node' });
  }
};

const deleteWorkflowNode = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workflowNode.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete workflow node error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete workflow node' });
  }
};

const getWorkflowNodes = async (req, res) => {
  try {
    const { workflowId } = req.query;

    const nodes = await prisma.workflowNode.findMany({
      where: { workflowId },
      include: {
        connections: true
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(nodes);
  } catch (error) {
    console.error('Get workflow nodes error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workflow nodes' });
  }
};

const createWorkflowConnection = async (req, res) => {
  try {
    const { workflowId, fromNodeId, toNodeId, condition } = req.body;

    const connection = await prisma.workflowConnection.create({
      data: {
        workflowId,
        fromNodeId,
        toNodeId,
        condition
      }
    });

    res.json(connection);
  } catch (error) {
    console.error('Create workflow connection error:', error);
    res.status(500).json({ error: error.message || 'Failed to create workflow connection' });
  }
};

const deleteWorkflowConnection = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.workflowConnection.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete workflow connection error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete workflow connection' });
  }
};

// Rules Engine
const createBusinessRule = async (req, res) => {
  try {
    const { companyId, name, description, category, conditions, actions, priority } = req.body;

    const rule = await prisma.businessRule.create({
      data: {
        companyId,
        name,
        description,
        category,
        conditions,
        actions,
        priority
      }
    });

    res.json(rule);
  } catch (error) {
    console.error('Create business rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create business rule' });
  }
};

const updateBusinessRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, conditions, actions, priority, enabled } = req.body;

    const rule = await prisma.businessRule.update({
      where: { id },
      data: {
        name,
        description,
        category,
        conditions,
        actions,
        priority,
        enabled
      }
    });

    res.json(rule);
  } catch (error) {
    console.error('Update business rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update business rule' });
  }
};

const deleteBusinessRule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.businessRule.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete business rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete business rule' });
  }
};

const getBusinessRules = async (req, res) => {
  try {
    const { companyId, category, enabled } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (category) where.category = category;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const rules = await prisma.businessRule.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    });

    res.json(rules);
  } catch (error) {
    console.error('Get business rules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch business rules' });
  }
};

const executeBusinessRule = async (req, res) => {
  try {
    const { ruleId, context } = req.body;

    const rule = await prisma.businessRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Check if conditions match
    let matched = true;
    if (rule.conditions) {
      // Simple condition matching logic
      // In production, this would be more sophisticated
      matched = evaluateConditions(rule.conditions, context);
    }

    // Log execution
    await prisma.ruleExecutionLog.create({
      data: {
        ruleId,
        matched,
        context,
        results: matched ? rule.actions : null
      }
    });

    // Update rule stats
    if (matched) {
      await prisma.businessRule.update({
        where: { id: ruleId },
        data: {
          triggeredCount: { increment: 1 },
          lastTriggered: new Date()
        }
      });
    }

    res.json({
      matched,
      actions: matched ? rule.actions : null
    });
  } catch (error) {
    console.error('Execute business rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to execute business rule' });
  }
};

const evaluateConditions = (conditions, context) => {
  // Simple condition evaluation
  // In production, this would be more sophisticated with proper rule engine
  try {
    if (conditions.operator === 'AND') {
      return conditions.rules.every(rule => evaluateSingleCondition(rule, context));
    } else if (conditions.operator === 'OR') {
      return conditions.rules.some(rule => evaluateSingleCondition(rule, context));
    }
    return evaluateSingleCondition(conditions, context);
  } catch (error) {
    return false;
  }
};

const evaluateSingleCondition = (condition, context) => {
  const { field, operator, value } = condition;
  const contextValue = context[field];

  switch (operator) {
    case 'EQUALS':
      return contextValue === value;
    case 'NOT_EQUALS':
      return contextValue !== value;
    case 'GREATER_THAN':
      return contextValue > value;
    case 'LESS_THAN':
      return contextValue < value;
    case 'CONTAINS':
      return contextValue.includes(value);
    case 'NOT_CONTAINS':
      return !contextValue.includes(value);
    default:
      return false;
  }
};

const getRuleExecutionLogs = async (req, res) => {
  try {
    const { ruleId } = req.query;
    const where = {};

    if (ruleId) where.ruleId = ruleId;

    const logs = await prisma.ruleExecutionLog.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      take: 100
    });

    res.json(logs);
  } catch (error) {
    console.error('Get rule execution logs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch rule execution logs' });
  }
};

// Public API & Developer Portal
const createOAuthClient = async (req, res) => {
  try {
    const { companyId, name, description, redirectUris, grantTypes, scopes } = req.body;

    const clientId = `client_${Math.random().toString(36).substring(2, 15)}`;
    const clientSecret = `secret_${Math.random().toString(36).substring(2, 15)}`;

    const client = await prisma.oAuthClient.create({
      data: {
        companyId,
        name,
        description,
        clientId,
        clientSecret,
        redirectUris,
        grantTypes,
        scopes
      }
    });

    res.json(client);
  } catch (error) {
    console.error('Create OAuth client error:', error);
    res.status(500).json({ error: error.message || 'Failed to create OAuth client' });
  }
};

const getOAuthClients = async (req, res) => {
  try {
    const { companyId, enabled } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const clients = await prisma.oAuthClient.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        clientId: true,
        redirectUris: true,
        grantTypes: true,
        scopes: true,
        enabled: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(clients);
  } catch (error) {
    console.error('Get OAuth clients error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch OAuth clients' });
  }
};

const revokeOAuthClient = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.oAuthClient.update({
      where: { id },
      data: { enabled: false }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke OAuth client error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke OAuth client' });
  }
};

const createApiDocumentation = async (req, res) => {
  try {
    const { path, method, description, parameters, requestBody, responseBody, category, version } = req.body;

    const doc = await prisma.apiDocumentation.create({
      data: {
        path,
        method,
        description,
        parameters,
        requestBody,
        responseBody,
        category,
        version
      }
    });

    res.json(doc);
  } catch (error) {
    console.error('Create API documentation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create API documentation' });
  }
};

const getApiDocumentation = async (req, res) => {
  try {
    const { category, status, path } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (path) where.path = { contains: path };

    const docs = await prisma.apiDocumentation.findMany({
      where,
      orderBy: [{ category: 'asc' }, { path: 'asc' }]
    });

    res.json(docs);
  } catch (error) {
    console.error('Get API documentation error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch API documentation' });
  }
};

const updateApiDocumentation = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, parameters, requestBody, responseBody, status, version } = req.body;

    const doc = await prisma.apiDocumentation.update({
      where: { id },
      data: {
        description,
        parameters,
        requestBody,
        responseBody,
        status,
        version
      }
    });

    res.json(doc);
  } catch (error) {
    console.error('Update API documentation error:', error);
    res.status(500).json({ error: error.message || 'Failed to update API documentation' });
  }
};

const createDeveloperAccount = async (req, res) => {
  try {
    const { email, name, organization, scopes, rateLimit } = req.body;

    const apiKey = `api_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const apiSecret = `secret_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const account = await prisma.developerAccount.create({
      data: {
        email,
        name,
        organization,
        apiKey,
        apiSecret,
        scopes,
        rateLimit
      }
    });

    res.json(account);
  } catch (error) {
    console.error('Create developer account error:', error);
    res.status(500).json({ error: error.message || 'Failed to create developer account' });
  }
};

const getDeveloperAccounts = async (req, res) => {
  try {
    const { enabled } = req.query;
    const where = {};

    if (enabled !== undefined) where.enabled = enabled === 'true';

    const accounts = await prisma.developerAccount.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        organization: true,
        apiKey: true,
        scopes: true,
        rateLimit: true,
        enabled: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(accounts);
  } catch (error) {
    console.error('Get developer accounts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch developer accounts' });
  }
};

const revokeDeveloperAccount = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.developerAccount.update({
      where: { id },
      data: { enabled: false }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke developer account error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke developer account' });
  }
};

module.exports = {
  // Workflow Builder
  createWorkflowNode,
  updateWorkflowNode,
  deleteWorkflowNode,
  getWorkflowNodes,
  createWorkflowConnection,
  deleteWorkflowConnection,
  // Rules Engine
  createBusinessRule,
  updateBusinessRule,
  deleteBusinessRule,
  getBusinessRules,
  executeBusinessRule,
  getRuleExecutionLogs,
  // Public API & Developer Portal
  createOAuthClient,
  getOAuthClients,
  revokeOAuthClient,
  createApiDocumentation,
  getApiDocumentation,
  updateApiDocumentation,
  createDeveloperAccount,
  getDeveloperAccounts,
  revokeDeveloperAccount
};
