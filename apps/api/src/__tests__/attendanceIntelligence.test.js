const request = require('supertest');

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    employeeShift: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    registeredDevice: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    attendanceLocation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
  })),
}));

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import attendance intelligence controller
const attendanceIntelligenceController = require('../controllers/attendanceIntelligenceController');

// Create test app
const express = require('express');
const app = express();
app.use(express.json());

// Mock routes
app.get('/api/attendance-intelligence/shifts', attendanceIntelligenceController.getAllShifts);
app.get('/api/attendance-intelligence/shifts/:id', attendanceIntelligenceController.getShiftById);
app.post('/api/attendance-intelligence/shifts', attendanceIntelligenceController.createShift);
app.get('/api/attendance-intelligence/devices', attendanceIntelligenceController.getAllDevices);
app.post('/api/attendance-intelligence/devices', attendanceIntelligenceController.registerDevice);
app.get('/api/attendance-intelligence/locations', attendanceIntelligenceController.getAttendanceLocations);

describe('Attendance Intelligence Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/attendance-intelligence/shifts', () => {
    it('should return all employee shifts', async () => {
      const mockShifts = [
        {
          id: '1',
          employeeId: '1',
          shiftType: 'MORNING',
          startTime: '08:00',
          endTime: '17:00',
          status: 'ACTIVE',
        },
        {
          id: '2',
          employeeId: '2',
          shiftType: 'NIGHT',
          startTime: '20:00',
          endTime: '06:00',
          status: 'ACTIVE',
        },
      ];

      prisma.employeeShift.findMany.mockResolvedValue(mockShifts);

      const response = await request(app).get('/api/attendance-intelligence/shifts');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].shiftType).toBe('MORNING');
    });

    it('should filter shifts by employee', async () => {
      const mockShifts = [
        {
          id: '1',
          employeeId: '1',
          shiftType: 'MORNING',
        },
      ];

      prisma.employeeShift.findMany.mockResolvedValue(mockShifts);

      const response = await request(app).get('/api/attendance-intelligence/shifts?employeeId=1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });
  });

  describe('GET /api/attendance-intelligence/shifts/:id', () => {
    it('should return shift by ID', async () => {
      const mockShift = {
        id: '1',
        employeeId: '1',
        shiftType: 'MORNING',
        startTime: '08:00',
        endTime: '17:00',
      };

      prisma.employeeShift.findUnique.mockResolvedValue(mockShift);

      const response = await request(app).get('/api/attendance-intelligence/shifts/1');

      expect(response.status).toBe(200);
      expect(response.body.shiftType).toBe('MORNING');
    });

    it('should return 404 if shift not found', async () => {
      prisma.employeeShift.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/attendance-intelligence/shifts/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/attendance-intelligence/shifts', () => {
    it('should create a new shift', async () => {
      const newShift = {
        employeeId: '1',
        shiftType: 'MORNING',
        startTime: '08:00',
        endTime: '17:00',
      };

      prisma.employee.findUnique.mockResolvedValue({
        id: '1',
        name: 'John Doe',
        status: 'ACTIVE',
      });

      prisma.employeeShift.create.mockResolvedValue({
        id: '3',
        ...newShift,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/attendance-intelligence/shifts')
        .send(newShift);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });

    it('should return error if employee not found', async () => {
      const newShift = {
        employeeId: '999',
        shiftType: 'MORNING',
        startTime: '08:00',
      };

      prisma.employee.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/attendance-intelligence/shifts')
        .send(newShift);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/attendance-intelligence/devices', () => {
    it('should return all registered devices', async () => {
      const mockDevices = [
        {
          id: '1',
          deviceId: 'DEVICE-001',
          type: 'BIOMETRIC',
          location: 'Main Entrance',
          status: 'ACTIVE',
        },
        {
          id: '2',
          deviceId: 'DEVICE-002',
          type: 'MOBILE',
          location: 'Remote',
          status: 'ACTIVE',
        },
      ];

      prisma.registeredDevice.findMany.mockResolvedValue(mockDevices);

      const response = await request(app).get('/api/attendance-intelligence/devices');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].type).toBe('BIOMETRIC');
    });
  });

  describe('POST /api/attendance-intelligence/devices', () => {
    it('should register a new device', async () => {
      const newDevice = {
        deviceId: 'DEVICE-003',
        type: 'BIOMETRIC',
        location: 'Side Entrance',
      };

      prisma.registeredDevice.create.mockResolvedValue({
        id: '3',
        ...newDevice,
        status: 'ACTIVE',
      });

      const response = await request(app)
        .post('/api/attendance-intelligence/devices')
        .send(newDevice);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('ACTIVE');
    });
  });

  describe('GET /api/attendance-intelligence/locations', () => {
    it('should return all attendance locations', async () => {
      const mockLocations = [
        {
          id: '1',
          name: 'Main Office',
          latitude: -1.286389,
          longitude: 36.817223,
          radius: 100,
        },
        {
          id: '2',
          name: 'Branch Office',
          latitude: -1.292066,
          longitude: 36.821945,
          radius: 50,
        },
      ];

      prisma.attendanceLocation.findMany.mockResolvedValue(mockLocations);

      const response = await request(app).get('/api/attendance-intelligence/locations');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Main Office');
    });
  });
});
