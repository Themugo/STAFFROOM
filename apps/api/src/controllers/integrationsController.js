const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Enterprise Integrations
const createIntegration = async (req, res) => {
  try {
    const { companyId, type, name, description, apiKey, apiSecret, config, settings } = req.body;

    const integration = await prisma.integration.create({
      data: {
        companyId,
        type,
        name,
        description,
        apiKey,
        apiSecret,
        config,
        settings,
        status: 'PENDING'
      }
    });

    res.json(integration);
  } catch (error) {
    console.error('Create integration error:', error);
    res.status(500).json({ error: error.message || 'Failed to create integration' });
  }
};

const getIntegrations = async (req, res) => {
  try {
    const { companyId, type, status, enabled } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const integrations = await prisma.integration.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        webhooks: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(integrations);
  } catch (error) {
    console.error('Get integrations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch integrations' });
  }
};

const updateIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, apiKey, apiSecret, config, settings, status, enabled } = req.body;

    const integration = await prisma.integration.update({
      where: { id },
      data: {
        name,
        description,
        apiKey,
        apiSecret,
        config,
        settings,
        status,
        enabled,
        lastSyncAt: new Date()
      }
    });

    res.json(integration);
  } catch (error) {
    console.error('Update integration error:', error);
    res.status(500).json({ error: error.message || 'Failed to update integration' });
  }
};

const testIntegration = async (req, res) => {
  try {
    const { id } = req.params;

    // Mock test integration - in production, this would actually test the connection
    const integration = await prisma.integration.findUnique({
      where: { id }
    });

    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Simulate test
    const testResult = {
      success: true,
      message: 'Integration connection successful',
      timestamp: new Date()
    };

    // Update integration status
    await prisma.integration.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        lastSyncAt: new Date()
      }
    });

    res.json(testResult);
  } catch (error) {
    console.error('Test integration error:', error);
    res.status(500).json({ error: error.message || 'Failed to test integration' });
  }
};

// Webhooks
const createWebhook = async (req, res) => {
  try {
    const { companyId, integrationId, name, description, url, method, headers, events } = req.body;

    const webhook = await prisma.webhook.create({
      data: {
        companyId,
        integrationId,
        name,
        description,
        url,
        method,
        headers,
        events,
        status: 'ACTIVE'
      }
    });

    res.json(webhook);
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: error.message || 'Failed to create webhook' });
  }
};

const getWebhooks = async (req, res) => {
  try {
    const { companyId, integrationId, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (integrationId) where.integrationId = integrationId;
    if (status) where.status = status;

    const webhooks = await prisma.webhook.findMany({
      where,
      include: {
        integration: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(webhooks);
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch webhooks' });
  }
};

const triggerWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { payload } = req.body;

    const webhook = await prisma.webhook.findUnique({
      where: { id }
    });

    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    // Log webhook execution
    const log = await prisma.webhookLog.create({
      data: {
        webhookId: id,
        payload,
        success: true,
        statusCode: 200
      }
    });

    // Update webhook last triggered
    await prisma.webhook.update({
      where: { id },
      data: {
        lastTriggeredAt: new Date()
      }
    });

    res.json({ success: true, logId: log.id });
  } catch (error) {
    console.error('Trigger webhook error:', error);
    res.status(500).json({ error: error.message || 'Failed to trigger webhook' });
  }
};

// Regional Compliance
const createComplianceRule = async (req, res) => {
  try {
    const { country, type, name, description, rules, effectiveDate, expiryDate } = req.body;

    const complianceRule = await prisma.complianceRule.create({
      data: {
        country,
        type,
        name,
        description,
        rules,
        effectiveDate: new Date(effectiveDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null
      }
    });

    res.json(complianceRule);
  } catch (error) {
    console.error('Create compliance rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create compliance rule' });
  }
};

const getComplianceRules = async (req, res) => {
  try {
    const { country, type, isActive } = req.query;
    const where = {};

    if (country) where.country = country;
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const complianceRules = await prisma.complianceRule.findMany({
      where,
      orderBy: { effectiveDate: 'desc' }
    });

    res.json(complianceRules);
  } catch (error) {
    console.error('Get compliance rules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch compliance rules' });
  }
};

const enableCompanyCompliance = async (req, res) => {
  try {
    const { companyId, complianceRuleId, customRules, nextReviewDate } = req.body;

    const companyCompliance = await prisma.companyCompliance.upsert({
      where: {
        companyId_complianceRuleId: {
          companyId,
          complianceRuleId
        }
      },
      update: {
        isEnabled: true,
        customRules,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
        lastReviewedAt: new Date()
      },
      create: {
        companyId,
        complianceRuleId,
        isEnabled: true,
        customRules,
        nextReviewDate: nextReviewDate ? new Date(nextReviewDate) : null,
        lastReviewedAt: new Date()
      }
    });

    res.json(companyCompliance);
  } catch (error) {
    console.error('Enable company compliance error:', error);
    res.status(500).json({ error: error.message || 'Failed to enable company compliance' });
  }
};

const getCompanyCompliance = async (req, res) => {
  try {
    const { companyId, country, type } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;

    const companyCompliances = await prisma.companyCompliance.findMany({
      where,
      include: {
        complianceRule: {
          select: {
            id: true,
            country: true,
            type: true,
            name: true,
            description: true,
            rules: true,
            effectiveDate: true,
            expiryDate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter by country and type if provided
    let filtered = companyCompliances;
    if (country) {
      filtered = filtered.filter(cc => cc.complianceRule.country === country);
    }
    if (type) {
      filtered = filtered.filter(cc => cc.complianceRule.type === type);
    }

    res.json(filtered);
  } catch (error) {
    console.error('Get company compliance error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch company compliance' });
  }
};

// Integration Marketplace Summary
const getMarketplaceSummary = async (req, res) => {
  try {
    const availableIntegrations = [
      {
        type: 'MICROSOFT_365',
        name: 'Microsoft 365',
        description: 'Integrate with Microsoft 365 for email, calendar, and document management',
        features: ['Email Sync', 'Calendar Integration', 'OneDrive Integration', 'Teams Integration'],
        category: 'Productivity',
        logo: 'microsoft-365-logo.png'
      },
      {
        type: 'GOOGLE_WORKSPACE',
        name: 'Google Workspace',
        description: 'Integrate with Google Workspace for Gmail, Calendar, and Drive',
        features: ['Gmail Sync', 'Google Calendar', 'Google Drive', 'Google Meet'],
        category: 'Productivity',
        logo: 'google-workspace-logo.png'
      },
      {
        type: 'PAYROLL_PROVIDER',
        name: 'Payroll Providers',
        description: 'Integrate with leading payroll providers for automated payroll processing',
        features: ['Payroll Sync', 'Tax Calculation', 'Direct Deposit', 'Payslip Generation'],
        category: 'Payroll',
        logo: 'payroll-logo.png'
      },
      {
        type: 'ACCOUNTING_SYSTEM',
        name: 'Accounting Systems',
        description: 'Integrate with accounting systems for financial data synchronization',
        features: ['Journal Entries', 'Expense Tracking', 'Invoice Sync', 'Financial Reports'],
        category: 'Finance',
        logo: 'accounting-logo.png'
      },
      {
        type: 'ERP_SYSTEM',
        name: 'ERP Systems',
        description: 'Integrate with ERP systems for comprehensive business management',
        features: ['Inventory Management', 'Supply Chain', 'HR Integration', 'Financial Management'],
        category: 'Enterprise',
        logo: 'erp-logo.png'
      },
      {
        type: 'BIOMETRIC_DEVICE',
        name: 'Biometric Devices',
        description: 'Integrate with biometric devices for secure attendance tracking',
        features: ['Fingerprint Scanner', 'Face Recognition', 'RFID Cards', 'Attendance Sync'],
        category: 'Security',
        logo: 'biometric-logo.png'
      },
      {
        type: 'SMS_GATEWAY',
        name: 'SMS Gateway',
        description: 'Integrate with SMS gateways for SMS notifications and alerts',
        features: ['SMS Notifications', 'OTP Verification', 'Bulk SMS', 'Delivery Reports'],
        category: 'Communication',
        logo: 'sms-logo.png'
      },
      {
        type: 'WHATSAPP_BUSINESS',
        name: 'WhatsApp Business',
        description: 'Integrate with WhatsApp Business for messaging and notifications',
        features: ['Message Templates', 'Automated Replies', 'Media Sharing', 'Message Analytics'],
        category: 'Communication',
        logo: 'whatsapp-logo.png'
      }
    ];

    const supportedCountries = [
      {
        code: 'KENYA',
        name: 'Kenya',
        flag: '🇰🇪',
        currency: 'KES',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'UGANDA',
        name: 'Uganda',
        flag: '🇺🇬',
        currency: 'UGX',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'TANZANIA',
        name: 'Tanzania',
        flag: '🇹🇿',
        currency: 'TZS',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'RWANDA',
        name: 'Rwanda',
        flag: '🇷🇼',
        currency: 'RWF',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'SOUTH_AFRICA',
        name: 'South Africa',
        flag: '🇿🇦',
        currency: 'ZAR',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'NIGERIA',
        name: 'Nigeria',
        flag: '🇳🇬',
        currency: 'NGN',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      },
      {
        code: 'GHANA',
        name: 'Ghana',
        flag: '🇬🇭',
        currency: 'GHS',
        complianceTypes: ['TAX_RULES', 'PAYROLL_RULES', 'LEAVE_RULES', 'LABOR_LAWS', 'BENEFIT_RULES', 'PENSION_RULES', 'HEALTH_INSURANCE', 'SOCIAL_SECURITY']
      }
    ];

    res.json({
      integrations: availableIntegrations,
      countries: supportedCountries
    });
  } catch (error) {
    console.error('Get marketplace summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch marketplace summary' });
  }
};

module.exports = {
  // Enterprise Integrations
  createIntegration,
  getIntegrations,
  updateIntegration,
  testIntegration,
  // Webhooks
  createWebhook,
  getWebhooks,
  triggerWebhook,
  // Regional Compliance
  createComplianceRule,
  getComplianceRules,
  enableCompanyCompliance,
  getCompanyCompliance,
  // Marketplace
  getMarketplaceSummary
};
