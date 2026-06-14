const { prisma } = require('../config/database');

const getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
};

const checkIn = async (req, res) => {
  try {
    const { employeeId, location } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today
        }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        checkIn: now,
        location
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Check-in failed' });
  }
};

const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: today
        }
      }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ error: 'Already checked out today' });
    }

    const checkInTime = new Date(attendance.checkIn);
    const workHours = (now - checkInTime) / (1000 * 60 * 60);

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOut: now,
        workHours: parseFloat(workHours.toFixed(2))
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Check-out failed' });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayRecords = await prisma.attendance.findMany({
      where: { date: today }
    });

    const monthlyRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: today
        }
      }
    });

    const presentToday = todayRecords.filter(r => r.checkIn).length;
    const absentToday = todayRecords.filter(r => !r.checkIn).length;

    const avgWorkHours = monthlyRecords.length > 0
      ? monthlyRecords.reduce((sum, r) => sum + (r.workHours || 0), 0) / monthlyRecords.length
      : 0;

    res.json({
      presentToday,
      absentToday,
      totalToday: todayRecords.length,
      monthlyRecords: monthlyRecords.length,
      averageWorkHours: parseFloat(avgWorkHours.toFixed(2))
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceById,
  checkIn,
  checkOut,
  getAttendanceStats
};
