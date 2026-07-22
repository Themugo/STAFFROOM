const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

// Initialize Sentry
const initSentry = (app) => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
        new Tracing.Integrations.Prisma({ client: require('@prisma/client').PrismaClient }),
      ],
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers['authorization'];
            delete event.request.headers['cookie'];
          }
        }
        return event;
      },
    });
    console.log('Sentry initialized');
  } else {
    console.log('Sentry DSN not provided, skipping initialization');
  }
};

const captureException = (error, context = {}) => {
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
};

const captureMessage = (message, level = 'info', context = {}) => {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, level, { extra: context });
  }
};

module.exports = {
  initSentry,
  captureException,
  captureMessage,
  Sentry,
};
