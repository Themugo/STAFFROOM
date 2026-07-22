const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import auth controller
const authController = require('../controllers/authController');

// Create test app
const app = express();
app.use(express.json());

// Mock routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', authController.getProfile);

describe('Authentication Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // Missing password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should return error with invalid credentials', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'WrongPassword!',
      };

      const hashedPassword = await bcrypt.hash('Test123!', 12);

      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: userData.email,
        password: hashedPassword,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return error if user not found', async () => {
      const userData = {
        email: 'nonexistent@example.com',
        password: 'Test123!',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(userData);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile with valid token', async () => {
      const userId = '1';
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

      prisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'EMPLOYEE',
      });

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email');
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
