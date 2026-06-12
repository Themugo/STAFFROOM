const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getExecutiveMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total employees
    const totalEmployees = await prisma.employee.count({
      where: { isActive: true }
    });
    
    // Get active departments
    const activeDepartments = await prisma.department.count({
      where: { isActive: true }
    });
    
    // Get attendance rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: { gte: thirtyDaysAgo }
      }
    });
    
    const totalExpectedAttendance = totalEmployees * 30; // Assuming 30 working days
    const attendanceRate = totalExpectedAttendance > 0 
      ? ((attendanceRecords.length / totalExpectedAttendance) * 100).toFixed(1)
      : 0;
    
    // Get turnover rate (employees who left in last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const terminatedEmployees = await prisma.employee.count({
      where: {
        employmentStatus: 'TERMINATED',
        updatedAt: { gte: twelveMonthsAgo }
      }
    });
    
    const turnoverRate = totalEmployees > 0 
      ? ((terminatedEmployees / totalEmployees) * 100).toFixed(1)
      : 0;
    
    // Get payroll cost (last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    
    const payrollRuns = await prisma.payrollRun.findMany({
      where: {
        period: { gte: lastMonth }
      },
      include: {
        payslips: true
      }
    });
    
    let totalPayrollCost = 0;
    payrollRuns.forEach(run => {
      run.payslips.forEach(payslip => {
        totalPayrollCost += payslip.grossSalary;
      });
    });
    
    // Get leave utilization (current year)
    const currentYear = new Date().getFullYear();
    const leaveBalances = await prisma.leaveBalance.findMany({
      where: { year: currentYear }
    });
    
    let totalUsedLeave = 0;
    let totalLeaveBalance = 0;
    leaveBalances.forEach(balance => {
      totalUsedLeave += balance.used;
      totalLeaveBalance += balance.balance;
    });
    
    const leaveUtilization = totalLeaveBalance > 0 
      ? ((totalUsedLeave / (totalUsedLeave + totalLeaveBalance)) * 100).toFixed(1)
      : 0;
    
    // Get performance score (average of all performance reviews)
    const performanceReviews = await prisma.performanceReview.findMany({
      where: {
        reviewDate: { gte: twelveMonthsAgo }
      }
    });
    
    let averagePerformance = 0;
    if (performanceReviews.length > 0) {
      const totalScore = performanceReviews.reduce((sum, review) => {
        return sum + (review.rating || 0);
      }, 0);
      averagePerformance = (totalScore / performanceReviews.length).toFixed(1);
    }
    
    res.json({
      totalEmployees,
      activeDepartments,
      attendanceRate: parseFloat(attendanceRate),
      turnoverRate: parseFloat(turnoverRate),
      payrollCost: totalPayrollCost,
      leaveUtilization: parseFloat(leaveUtilization),
      performanceScore: parseFloat(averagePerformance)
    });
  } catch (error) {
    console.error('Get executive metrics error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch executive metrics' });
  }
};

const getWorkforceGrowth = async (req, res) => {
  try {
    const months = 12;
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const monthStart = new Date(date);
      const monthEnd = new Date(date);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const employeeCount = await prisma.employee.count({
        where: {
          createdAt: { lte: monthEnd },
          OR: [
            { employmentStatus: 'ACTIVE' },
            { employmentStatus: null }
          ]
        }
      });
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        employees: employeeCount
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get workforce growth error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workforce growth data' });
  }
};

const getDepartmentDistribution = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });
    
    const data = departments.map(dept => ({
      name: dept.name,
      employees: dept._count.employees
    }));
    
    res.json(data);
  } catch (error) {
    console.error('Get department distribution error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch department distribution' });
  }
};

const getAttendanceTrends = async (req, res) => {
  try {
    const days = 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const attendanceRecords = await prisma.attendance.findMany({
        where: {
          date: { gte: dayStart, lte: dayEnd }
        }
      });
      
      const totalEmployees = await prisma.employee.count({
        where: { isActive: true }
      });
      
      const presentCount = attendanceRecords.length;
      const attendanceRate = totalEmployees > 0 
        ? ((presentCount / totalEmployees) * 100).toFixed(1)
        : 0;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        present: presentCount,
        absent: totalEmployees - presentCount,
        rate: parseFloat(attendanceRate)
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get attendance trends error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch attendance trends' });
  }
};

const getCostAnalysis = async (req, res) => {
  try {
    const months = 12;
    const data = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      
      const monthStart = new Date(date);
      const monthEnd = new Date(date);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const payrollRuns = await prisma.payrollRun.findMany({
        where: {
          period: { gte: monthStart, lte: monthEnd }
        },
        include: {
          payslips: true
        }
      });
      
      let totalGross = 0;
      let totalNet = 0;
      let totalDeductions = 0;
      
      payrollRuns.forEach(run => {
        run.payslips.forEach(payslip => {
          totalGross += payslip.grossSalary;
          totalNet += payslip.netSalary;
          totalDeductions += (payslip.grossSalary - payslip.netSalary);
        });
      });
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        gross: totalGross,
        net: totalNet,
        deductions: totalDeductions
      });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Get cost analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch cost analysis' });
  }
};

module.exports = {
  getExecutiveMetrics,
  getWorkforceGrowth,
  getDepartmentDistribution,
  getAttendanceTrends,
  getCostAnalysis
};
