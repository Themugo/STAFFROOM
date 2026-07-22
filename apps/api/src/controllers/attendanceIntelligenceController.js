const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Shift Schedule Controllers
const createShiftSchedule = async (req, res) => {
  try {
    const { name, type, startTime, endTime, breakDuration, location } = req.body;
    
    const shift = await prisma.shiftSchedule.create({
      data: {
        name,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        breakDuration,
        location
      }
    });
    
    res.status(201).json(shift);
  } catch (error) {
    console.error('Create shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create shift schedule' });
  }
};

const getShiftSchedules = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const shifts = await prisma.shiftSchedule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(shifts);
  } catch (error) {
    console.error('Get shift schedules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch shift schedules' });
  }
};

const updateShiftSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, startTime, endTime, breakDuration, location, isActive } = req.body;
    
    const shift = await prisma.shiftSchedule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(breakDuration !== undefined && { breakDuration }),
        ...(location !== undefined && { location }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(shift);
  } catch (error) {
    console.error('Update shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update shift schedule' });
  }
};

const deleteShiftSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.shiftSchedule.delete({
      where: { id }
    });
    
    res.json({ message: 'Shift schedule deleted successfully' });
  } catch (error) {
    console.error('Delete shift schedule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete shift schedule' });
  }
};

// Employee Shift Controllers
const assignEmployeeShift = async (req, res) => {
  try {
    const { employeeId, shiftId, effectiveDate, endDate } = req.body;
    
    const employeeShift = await prisma.employeeShift.create({
      data: {
        employeeId,
        shiftId,
        effectiveDate: new Date(effectiveDate),
        endDate: endDate ? new Date(endDate) : null
      },
      include: {
        employee: true,
        shift: true
      }
    });
    
    res.status(201).json(employeeShift);
  } catch (error) {
    console.error('Assign employee shift error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign employee shift' });
  }
};

const getEmployeeShifts = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const shifts = await prisma.employeeShift.findMany({
      where: { employeeId },
      include: {
        shift: true
      },
      orderBy: { effectiveDate: 'desc' }
    });
    
    res.json(shifts);
  } catch (error) {
    console.error('Get employee shifts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee shifts' });
  }
};

const updateEmployeeShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { shiftId, effectiveDate, endDate } = req.body;
    
    const employeeShift = await prisma.employeeShift.update({
      where: { id },
      data: {
        ...(shiftId && { shiftId }),
        ...(effectiveDate && { effectiveDate: new Date(effectiveDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null })
      },
      include: {
        shift: true
      }
    });
    
    res.json(employeeShift);
  } catch (error) {
    console.error('Update employee shift error:', error);
    res.status(500).json({ error: error.message || 'Failed to update employee shift' });
  }
};

const deleteEmployeeShift = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.employeeShift.delete({
      where: { id }
    });
    
    res.json({ message: 'Employee shift deleted successfully' });
  } catch (error) {
    console.error('Delete employee shift error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete employee shift' });
  }
};

// Attendance Rule Controllers
const createAttendanceRule = async (req, res) => {
  try {
    const { name, type, condition, action } = req.body;
    
    const rule = await prisma.attendanceRule.create({
      data: {
        name,
        type,
        condition,
        action
      }
    });
    
    res.status(201).json(rule);
  } catch (error) {
    console.error('Create attendance rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create attendance rule' });
  }
};

const getAttendanceRules = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const rules = await prisma.attendanceRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(rules);
  } catch (error) {
    console.error('Get attendance rules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance rules' });
  }
};

const updateAttendanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, condition, action, isActive } = req.body;
    
    const rule = await prisma.attendanceRule.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(condition && { condition }),
        ...(action && { action }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(rule);
  } catch (error) {
    console.error('Update attendance rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update attendance rule' });
  }
};

const deleteAttendanceRule = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.attendanceRule.delete({
      where: { id }
    });
    
    res.json({ message: 'Attendance rule deleted successfully' });
  } catch (error) {
    console.error('Delete attendance rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete attendance rule' });
  }
};

// Registered Device Controllers
const registerDevice = async (req, res) => {
  try {
    const { employeeId, deviceId, deviceName, deviceType, ipAddress, location } = req.body;
    
    const device = await prisma.registeredDevice.create({
      data: {
        employeeId,
        deviceId,
        deviceName,
        deviceType,
        ipAddress,
        location
      }
    });
    
    res.status(201).json(device);
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({ error: error.message || 'Failed to register device' });
  }
};

const getRegisteredDevices = async (req, res) => {
  try {
    const { employeeId, status } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    
    const devices = await prisma.registeredDevice.findMany({
      where,
      include: {
        employee: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(devices);
  } catch (error) {
    console.error('Get registered devices error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch registered devices' });
  }
};

const updateRegisteredDevice = async (req, res) => {
  try {
    const { id } = req.params;
    const { deviceName, deviceType, status, ipAddress, location, lastUsed } = req.body;
    
    const device = await prisma.registeredDevice.update({
      where: { id },
      data: {
        ...(deviceName && { deviceName }),
        ...(deviceType && { deviceType }),
        ...(status && { status }),
        ...(ipAddress !== undefined && { ipAddress }),
        ...(location !== undefined && { location }),
        ...(lastUsed && { lastUsed: new Date(lastUsed) })
      }
    });
    
    res.json(device);
  } catch (error) {
    console.error('Update registered device error:', error);
    res.status(500).json({ error: error.message || 'Failed to update registered device' });
  }
};

const deleteRegisteredDevice = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.registeredDevice.delete({
      where: { id }
    });
    
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Delete registered device error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete device' });
  }
};

// Attendance Location Controllers
const recordAttendanceLocation = async (req, res) => {
  try {
    const { employeeId, latitude, longitude, accuracy, method } = req.body;
    
    const location = await prisma.attendanceLocation.create({
      data: {
        employeeId,
        latitude,
        longitude,
        accuracy,
        method,
        timestamp: new Date()
      },
      include: {
        employee: true
      }
    });
    
    res.status(201).json(location);
  } catch (error) {
    console.error('Record attendance location error:', error);
    res.status(500).json({ error: error.message || 'Failed to record attendance location' });
  }
};

const getAttendanceLocations = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    const locations = await prisma.attendanceLocation.findMany({
      where,
      include: {
        employee: true
      },
      orderBy: { timestamp: 'desc' }
    });
    
    res.json(locations);
  } catch (error) {
    console.error('Get attendance locations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance locations' });
  }
};

const getEmployeeAttendanceLocations = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;
    
    const where = { employeeId };
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    const locations = await prisma.attendanceLocation.findMany({
      where,
      orderBy: { timestamp: 'desc' }
    });
    
    res.json(locations);
  } catch (error) {
    console.error('Get employee attendance locations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee attendance locations' });
  }
};

module.exports = {
  // Shift Schedules
  createShiftSchedule,
  getShiftSchedules,
  updateShiftSchedule,
  deleteShiftSchedule,
  // Employee Shifts
  assignEmployeeShift,
  getEmployeeShifts,
  updateEmployeeShift,
  deleteEmployeeShift,
  // Attendance Rules
  createAttendanceRule,
  getAttendanceRules,
  updateAttendanceRule,
  deleteAttendanceRule,
  // Registered Devices
  registerDevice,
  getRegisteredDevices,
  updateRegisteredDevice,
  deleteRegisteredDevice,
  // Attendance Locations
  recordAttendanceLocation,
  getAttendanceLocations,
  getEmployeeAttendanceLocations
};
