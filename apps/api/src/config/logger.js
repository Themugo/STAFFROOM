const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf, errors, json } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  if (stack) {
    return `${timestamp} [${level}]: ${message} - ${stack}`;
  }
  return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    process.env.NODE_ENV === 'production' ? json() : logFormat
  ),
  defaultMeta: { service: 'staffroom-api' },
  transports: [
    // Console transport
    new transports.Console({
      format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),
    // Error log file
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(
        errors({ stack: true }),
        timestamp(),
        json()
      ),
    }),
    // Combined log file
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(
        timestamp(),
        json()
      ),
    }),
  ],
  // Handle exceptions and rejections
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// Add Sentry transport in production
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  const Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || 'production',
    tracesSampleRate: 0.1,
  });

  logger.add(new winston.transports.Sentry({
    level: 'error',
    sentry: Sentry,
  }));
}

// Create child logger with context
function createChildLogger(context) {
  return logger.child({ context });
}

// Performance logging
function logPerformance(operation, duration, metadata = {}) {
  logger.info({
    message: `Performance: ${operation}`,
    duration_ms: duration,
    ...metadata,
  });
}

// Security event logging
function logSecurityEvent(event, metadata = {}) {
  logger.warn({
    message: `Security Event: ${event}`,
    ...metadata,
  });
}

// API request logging
function logApiRequest(req, res, duration) {
  logger.info({
    message: 'API Request',
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration_ms: duration,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
}

// Database query logging
function logDatabaseQuery(query, duration, metadata = {}) {
  if (process.env.NODE_ENV === 'development') {
    logger.debug({
      message: 'Database Query',
      query: query.substring(0, 200),
      duration_ms: duration,
      ...metadata,
    });
  }
}

// Error logging with context
function logError(error, context = {}) {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

// Stream logger for Morgan HTTP logger
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = {
  logger,
  createChildLogger,
  logPerformance,
  logSecurityEvent,
  logApiRequest,
  logDatabaseQuery,
  logError,
  stream,
};
