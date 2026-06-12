
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/employees', require('./routes/employee360'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/positions', require('./routes/positions'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/attendance', require('./routes/attendanceIntelligence'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/leaves', require('./routes/leaveManagement'));
app.use('/api/workflows', require('./routes/workflows'));
app.use('/api/workflows', require('./routes/universalWorkflow'));
app.use('/api/payroll', require('./routes/payroll'));
app.use('/api/recruitment', require('./routes/recruitment'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/security', require('./routes/security'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api', require('./routes/company'));
app.use('/api/intelligence', require('./routes/intelligence'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/lms', require('./routes/lms'));
app.use('/api', require('./routes/assets'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: 'v2-production',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
