const { logger } = require('./logger');

/**
 * Alerting System Configuration
 * Handles alerts for critical events, errors, and performance issues
 */

const alertingConfig = {
  enabled: process.env.ALERTING_ENABLED === 'true',
  
  // Alert channels
  channels: {
    webhook: {
      enabled: !!process.env.ALERT_WEBHOOK_URL,
      url: process.env.ALERT_WEBHOOK_URL,
    },
    email: {
      enabled: !!process.env.ALERT_EMAIL_RECIPIENTS,
      recipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(',').map(e => e.trim()),
    },
    slack: {
      enabled: !!process.env.SLACK_WEBHOOK_URL,
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
    },
  },
  
  // Alert severity levels
  severity: {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical',
  },
  
  // Alert types
  types: {
    // Security alerts
    SECURITY_BREACH: 'security_breach',
    UNAUTHORIZED_ACCESS: 'unauthorized_access',
    RATE_LIMIT_EXCEEDED: 'rate_limit_exceeded',
    
    // Performance alerts
    SLOW_API_REQUEST: 'slow_api_request',
    SLOW_DATABASE_QUERY: 'slow_database_query',
    HIGH_MEMORY_USAGE: 'high_memory_usage',
    HIGH_CPU_USAGE: 'high_cpu_usage',
    
    // Error alerts
    APPLICATION_ERROR: 'application_error',
    DATABASE_ERROR: 'database_error',
    EXTERNAL_SERVICE_ERROR: 'external_service_error',
    
    // Business alerts
    PAYMENT_FAILURE: 'payment_failure',
    USER_REGISTRATION_FAILURE: 'user_registration_failure',
    DATA_INTEGRITY_ISSUE: 'data_integrity_issue',
  },
};

/**
 * Alert history for deduplication
 */
const alertHistory = new Map();
const ALERT_DEDUP_WINDOW = 300000; // 5 minutes

/**
 * Check if alert should be sent (deduplication)
 */
function shouldSendAlert(type, key) {
  const alertKey = `${type}:${key}`;
  const lastSent = alertHistory.get(alertKey);
  
  if (lastSent && Date.now() - lastSent < ALERT_DEDUP_WINDOW) {
    return false;
  }
  
  alertHistory.set(alertKey, Date.now());
  return true;
}

/**
 * Send alert to all configured channels
 */
async function sendAlert(type, severity, message, data = {}) {
  if (!alertingConfig.enabled) {
    logger.debug({
      message: 'Alerting disabled, skipping alert',
      type,
      severity,
    });
    return;
  }
  
  const alert = {
    type,
    severity,
    message,
    data,
    timestamp: new Date().toISOString(),
    service: 'staffroom-api',
    environment: process.env.NODE_ENV || 'development',
  };
  
  // Check deduplication
  const dedupKey = data.dedupKey || JSON.stringify(data);
  if (!shouldSendAlert(type, dedupKey)) {
    logger.debug({
      message: 'Alert deduplicated, skipping',
      type,
    });
    return;
  }
  
  logger.warn({
    message: `Alert: ${type}`,
    ...alert,
  });
  
  // Send to all enabled channels
  const promises = [];
  
  if (alertingConfig.channels.webhook.enabled) {
    promises.push(sendWebhookAlert(alert));
  }
  
  if (alertingConfig.channels.slack.enabled) {
    promises.push(sendSlackAlert(alert));
  }
  
  if (alertingConfig.channels.email.enabled) {
    promises.push(sendEmailAlert(alert));
  }
  
  await Promise.allSettled(promises);
}

/**
 * Send webhook alert
 */
async function sendWebhookAlert(alert) {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(alertingConfig.channels.webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
      timeout: 5000,
    });
    
    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }
    
    logger.info({
      message: 'Webhook alert sent successfully',
      type: alert.type,
    });
  } catch (error) {
    logger.error({
      message: 'Failed to send webhook alert',
      error: error.message,
      type: alert.type,
    });
  }
}

/**
 * Send Slack alert
 */
async function sendSlackAlert(alert) {
  try {
    const fetch = require('node-fetch');
    
    const colors = {
      info: '#36a64f',
      warning: '#ff9900',
      error: '#ff0000',
      critical: '#000000',
    };
    
    const emoji = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
    };
    
    const message = {
      text: `${emoji[alert.severity] || '⚠️'} ${alert.message}`,
      attachments: [
        {
          color: colors[alert.severity] || colors.warning,
          fields: [
            {
              title: 'Type',
              value: alert.type,
              short: true,
            },
            {
              title: 'Severity',
              value: alert.severity.toUpperCase(),
              short: true,
            },
            {
              title: 'Environment',
              value: alert.environment,
              short: true,
            },
            {
              title: 'Timestamp',
              value: alert.timestamp,
              short: true,
            },
          ],
        },
      ],
    };
    
    // Add data fields if present
    if (Object.keys(alert.data).length > 0) {
      message.attachments[0].fields.push({
        title: 'Details',
        value: `\`\`\`${JSON.stringify(alert.data, null, 2)}\`\`\``,
        short: false,
      });
    }
    
    const response = await fetch(alertingConfig.channels.slack.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
      timeout: 5000,
    });
    
    if (!response.ok) {
      throw new Error(`Slack webhook returned ${response.status}`);
    }
    
    logger.info({
      message: 'Slack alert sent successfully',
      type: alert.type,
    });
  } catch (error) {
    logger.error({
      message: 'Failed to send Slack alert',
      error: error.message,
      type: alert.type,
    });
  }
}

/**
 * Send email alert
 */
async function sendEmailAlert(alert) {
  try {
    // This would integrate with your email service (e.g., SendGrid, AWS SES)
    // For now, just log that email would be sent
    logger.info({
      message: 'Email alert would be sent',
      recipients: alertingConfig.channels.email.recipients,
      type: alert.type,
      subject: `[${alert.severity.toUpperCase()}] ${alert.message}`,
    });
    
    // TODO: Implement actual email sending
    // Example with nodemailer:
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ ... });
  } catch (error) {
    logger.error({
      message: 'Failed to send email alert',
      error: error.message,
      type: alert.type,
    });
  }
}

/**
 * Convenience functions for common alert types
 */
const alerts = {
  // Security alerts
  securityBreach: (data) => sendAlert(
    alertingConfig.types.SECURITY_BREACH,
    alertingConfig.severity.CRITICAL,
    'Security breach detected',
    data
  ),
  
  unauthorizedAccess: (data) => sendAlert(
    alertingConfig.types.UNAUTHORIZED_ACCESS,
    alertingConfig.severity.ERROR,
    'Unauthorized access attempt',
    data
  ),
  
  rateLimitExceeded: (data) => sendAlert(
    alertingConfig.types.RATE_LIMIT_EXCEEDED,
    alertingConfig.severity.WARNING,
    'Rate limit exceeded',
    data
  ),
  
  // Performance alerts
  slowApiRequest: (data) => sendAlert(
    alertingConfig.types.SLOW_API_REQUEST,
    alertingConfig.severity.WARNING,
    'Slow API request detected',
    data
  ),
  
  slowDatabaseQuery: (data) => sendAlert(
    alertingConfig.types.SLOW_DATABASE_QUERY,
    alertingConfig.severity.WARNING,
    'Slow database query detected',
    data
  ),
  
  highMemoryUsage: (data) => sendAlert(
    alertingConfig.types.HIGH_MEMORY_USAGE,
    alertingConfig.severity.WARNING,
    'High memory usage detected',
    data
  ),
  
  // Error alerts
  applicationError: (data) => sendAlert(
    alertingConfig.types.APPLICATION_ERROR,
    alertingConfig.severity.ERROR,
    'Application error occurred',
    data
  ),
  
  databaseError: (data) => sendAlert(
    alertingConfig.types.DATABASE_ERROR,
    alertingConfig.severity.ERROR,
    'Database error occurred',
    data
  ),
  
  // Business alerts
  paymentFailure: (data) => sendAlert(
    alertingConfig.types.PAYMENT_FAILURE,
    alertingConfig.severity.ERROR,
    'Payment processing failed',
    data
  ),
  
  dataIntegrityIssue: (data) => sendAlert(
    alertingConfig.types.DATA_INTEGRITY_ISSUE,
    alertingConfig.severity.CRITICAL,
    'Data integrity issue detected',
    data
  ),
};

module.exports = {
  alertingConfig,
  sendAlert,
  alerts,
};
