const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pooling configuration
const connectionPoolConfig = {
  connection_limit: parseInt(process.env.DB_POOL_SIZE || '10'),
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000'),
  idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || '300000'),
  max_lifetime: parseInt(process.env.DB_MAX_LIFETIME || '3600000'),
};

module.exports = { prisma, connectionPoolConfig };
