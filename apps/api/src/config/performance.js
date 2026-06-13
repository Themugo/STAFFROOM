const { logger } = require('./logger');

/**
 * Performance monitoring configuration
 * Tracks API response times, database queries, and system metrics
 */

const performanceConfig = {
  // Enable performance monitoring
  enabled: process.env.PERFORMANCE_MONITORING_ENABLED !== 'false',
  
  // Sampling rate (0-1) for performance tracking
  sampleRate: parseFloat(process.env.PERFORMANCE_SAMPLE_RATE) || 0.1,
  
  // Alert thresholds (in milliseconds)
  thresholds: {
    apiResponseTime: parseInt(process.env.API_RESPONSE_THRESHOLD) || 1000,
    databaseQueryTime: parseInt(process.env.DB_QUERY_THRESHOLD) || 100,
    memoryUsage: parseInt(process.env.MEMORY_THRESHOLD) || 500, // MB
    cpuUsage: parseInt(process.env.CPU_THRESHOLD) || 80, // percentage
  },
  
  // Alerting configuration
  alerting: {
    enabled: process.env.ALERTING_ENABLED === 'true',
    webhookUrl: process.env.ALERT_WEBHOOK_URL,
    emailRecipients: process.env.ALERT_EMAIL_RECIPIENTS?.split(','),
    slackWebhook: process.env.SLACK_WEBHOOK_URL,
  },
};

// Performance metrics storage
const metrics = {
  apiRequests: [],
  databaseQueries: [],
  systemMetrics: [],
};

/**
 * Track API request performance
 */
function trackApiRequest(req, res, next) {
  if (!performanceConfig.enabled) {
    return next();
  }
  
  // Sample requests based on sample rate
  if (Math.random() > performanceConfig.sampleRate) {
    return next();
  }
  
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const metric = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      timestamp: new Date(),
    };
    
    metrics.apiRequests.push(metric);
    
    // Keep only last 1000 metrics
    if (metrics.apiRequests.length > 1000) {
      metrics.apiRequests.shift();
    }
    
    // Log slow requests
    if (duration > performanceConfig.thresholds.apiResponseTime) {
      logger.warn({
        message: 'Slow API request detected',
        ...metric,
      });
      
      // Trigger alert if enabled
      if (performanceConfig.alerting.enabled) {
        triggerAlert('slow_api_request', metric);
      }
    }
  });
  
  next();
}

/**
 * Track database query performance
 */
function trackDatabaseQuery(query, duration) {
  if (!performanceConfig.enabled) {
    return;
  }
  
  const metric = {
    query: query.substring(0, 200),
    duration,
    timestamp: new Date(),
  };
  
  metrics.databaseQueries.push(metric);
  
  // Keep only last 1000 metrics
  if (metrics.databaseQueries.length > 1000) {
    metrics.databaseQueries.shift();
  }
  
  // Log slow queries
  if (duration > performanceConfig.thresholds.databaseQueryTime) {
    logger.warn({
      message: 'Slow database query detected',
      ...metric,
    });
    
    // Trigger alert if enabled
    if (performanceConfig.alerting.enabled) {
      triggerAlert('slow_database_query', metric);
    }
  }
}

/**
 * Track system metrics
 */
function trackSystemMetrics() {
  if (!performanceConfig.enabled) {
    return;
  }
  
  const used = process.memoryUsage();
  const metric = {
    memory: {
      rss: Math.round(used.rss / 1024 / 1024), // MB
      heapTotal: Math.round(used.heapTotal / 1024 / 1024), // MB
      heapUsed: Math.round(used.heapUsed / 1024 / 1024), // MB
      external: Math.round(used.external / 1024 / 1024), // MB
    },
    timestamp: new Date(),
  };
  
  metrics.systemMetrics.push(metric);
  
  // Keep only last 100 metrics
  if (metrics.systemMetrics.length > 100) {
    metrics.systemMetrics.shift();
  }
  
  // Check memory threshold
  if (metric.memory.heapUsed > performanceConfig.thresholds.memoryUsage) {
    logger.warn({
      message: 'High memory usage detected',
      ...metric,
    });
    
    // Trigger alert if enabled
    if (performanceConfig.alerting.enabled) {
      triggerAlert('high_memory_usage', metric);
    }
  }
}

/**
 * Get performance metrics summary
 */
function getMetricsSummary() {
  const apiMetrics = metrics.apiRequests;
  const dbMetrics = metrics.databaseQueries;
  const systemMetrics = metrics.systemMetrics;
  
  return {
    api: {
      total: apiMetrics.length,
      averageDuration: apiMetrics.length > 0 
        ? Math.round(apiMetrics.reduce((sum, m) => sum + m.duration, 0) / apiMetrics.length)
        : 0,
      slowRequests: apiMetrics.filter(m => m.duration > performanceConfig.thresholds.apiResponseTime).length,
      errorRate: apiMetrics.length > 0
        ? (apiMetrics.filter(m => m.status >= 400).length / apiMetrics.length * 100).toFixed(2)
        : 0,
    },
    database: {
      total: dbMetrics.length,
      averageDuration: dbMetrics.length > 0
        ? Math.round(dbMetrics.reduce((sum, m) => sum + m.duration, 0) / dbMetrics.length)
        : 0,
      slowQueries: dbMetrics.filter(m => m.duration > performanceConfig.thresholds.databaseQueryTime).length,
    },
    system: {
      currentMemory: systemMetrics.length > 0 ? systemMetrics[systemMetrics.length - 1].memory : null,
      averageMemory: systemMetrics.length > 0
        ? Math.round(systemMetrics.reduce((sum, m) => sum + m.memory.heapUsed, 0) / systemMetrics.length)
        : 0,
    },
  };
}

/**
 * Trigger alert
 */
function triggerAlert(type, data) {
  const alert = {
    type,
    severity: 'warning',
    timestamp: new Date(),
    data,
  };
  
  logger.warn({
    message: `Alert triggered: ${type}`,
    ...alert,
  });
  
  // Send to webhook if configured
  if (performanceConfig.alerting.webhookUrl) {
    sendWebhookAlert(alert);
  }
  
  // Send to Slack if configured
  if (performanceConfig.alerting.slackWebhook) {
    sendSlackAlert(alert);
  }
}

/**
 * Send webhook alert
 */
async function sendWebhookAlert(alert) {
  try {
    const fetch = require('node-fetch');
    await fetch(performanceConfig.alerting.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alert),
    });
  } catch (error) {
    logger.error({
      message: 'Failed to send webhook alert',
      error: error.message,
    });
  }
}

/**
 * Send Slack alert
 */
async function sendSlackAlert(alert) {
  try {
    const fetch = require('node-fetch');
    const message = {
      text: `🚨 Alert: ${alert.type}`,
      attachments: [
        {
          color: 'warning',
          fields: [
            {
              title: 'Type',
              value: alert.type,
              short: true,
            },
            {
              title: 'Severity',
              value: alert.severity,
              short: true,
            },
            {
              title: 'Timestamp',
              value: alert.timestamp,
              short: false,
            },
            {
              title: 'Details',
              value: JSON.stringify(alert.data, null, 2),
              short: false,
            },
          ],
        },
      ],
    };
    
    await fetch(performanceConfig.alerting.slackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    logger.error({
      message: 'Failed to send Slack alert',
      error: error.message,
    });
  }
}

/**
 * Start periodic system metrics collection
 */
function startMetricsCollection(interval = 60000) {
  setInterval(trackSystemMetrics, interval);
}

module.exports = {
  performanceConfig,
  trackApiRequest,
  trackDatabaseQuery,
  trackSystemMetrics,
  getMetricsSummary,
  triggerAlert,
  startMetricsCollection,
};
