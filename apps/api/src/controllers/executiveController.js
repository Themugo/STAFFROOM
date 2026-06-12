const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Executive Command Center
const getExecutiveDashboard = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get total employees
    const totalEmployees = await prisma.employee.count({
      where: { companyId, employmentStatus: 'ACTIVE' }
    });

    // Get attendance rate (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const presentEmployees = await prisma.attendance.count({
      where: {
        companyId,
        date: today,
        status: 'PRESENT'
      }
    });

    const attendanceRate = totalEmployees > 0 ? (presentEmployees / totalEmployees) * 100 : 0;

    // Get payroll cost (current month)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const payrollCost = await prisma.payslip.aggregate({
      where: {
        companyId,
        payPeriodStart: { gte: currentMonth },
        payPeriodEnd: { lt: nextMonth }
      },
      _sum: {
        netPay: true
      }
    });

    // Get turnover risk (based on performance and attendance)
    const lowPerformanceEmployees = await prisma.performanceReview.count({
      where: {
        companyId,
        overallRating: { lte: 3 }
      }
    });

    const highAbsenteeism = await prisma.attendance.groupBy({
      by: ['employeeId'],
      where: {
        companyId,
        date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      },
      having: {
        status: { equals: 'ABSENT' }
      }
    });

    const turnoverRisk = (lowPerformanceEmployees + highAbsenteeism.length) / totalEmployees;
    let turnoverRiskLevel = 'LOW';
    if (turnoverRisk > 0.1) turnoverRiskLevel = 'MEDIUM';
    if (turnoverRisk > 0.2) turnoverRiskLevel = 'HIGH';

    // Get top performing department
    const departmentPerformance = await prisma.department.findMany({
      where: { companyId },
      include: {
        employees: {
          include: {
            performanceReviews: {
              where: {
                createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }
            }
          }
        }
      }
    });

    let topDepartment = null;
    let highestAvgRating = 0;

    departmentPerformance.forEach(dept => {
      const reviews = dept.employees.flatMap(e => e.performanceReviews);
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;
        if (avgRating > highestAvgRating) {
          highestAvgRating = avgRating;
          topDepartment = dept.name;
        }
      }
    });

    // Get employees needing attention
    const employeesNeedingAttention = await prisma.employee.findMany({
      where: {
        companyId,
        OR: [
          { employmentStatus: 'ON_LEAVE' },
          { employmentStatus: 'INACTIVE' }
        ]
      },
      take: 14,
      include: {
        department: {
          select: { name: true }
        }
      }
    });

    // Get pending leave requests
    const pendingLeaveRequests = await prisma.leave.count({
      where: {
        companyId,
        status: 'PENDING'
      }
    });

    // Get open positions
    const openPositions = await prisma.recruitment.count({
      where: {
        companyId,
        status: 'OPEN'
      }
    });

    res.json({
      employees: totalEmployees,
      attendance: {
        rate: attendanceRate.toFixed(1),
        present: presentEmployees
      },
      payroll: {
        cost: payrollCost._sum.netPay || 0,
        currency: 'KES'
      },
      turnover: {
        risk: turnoverRiskLevel,
        atRiskEmployees: lowPerformanceEmployees + highAbsenteeism.length
      },
      topDepartment: topDepartment || 'N/A',
      employeesNeedingAttention: employeesNeedingAttention.length,
      pendingLeaveRequests,
      openPositions,
      alerts: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    });
  } catch (error) {
    console.error('Get executive dashboard error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch executive dashboard' });
  }
};

const getExecutiveAlerts = async (req, res) => {
  try {
    const { companyId, severity, category, isResolved } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (severity) where.severity = severity;
    if (category) where.category = category;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';

    const alerts = await prisma.executiveAlert.findMany({
      where,
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(alerts);
  } catch (error) {
    console.error('Get executive alerts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch executive alerts' });
  }
};

const createExecutiveAlert = async (req, res) => {
  try {
    const { companyId, severity, category, title, description, metrics, recommendations } = req.body;

    const alert = await prisma.executiveAlert.create({
      data: {
        companyId,
        severity,
        category,
        title,
        description,
        metrics,
        recommendations
      }
    });

    res.json(alert);
  } catch (error) {
    console.error('Create executive alert error:', error);
    res.status(500).json({ error: error.message || 'Failed to create executive alert' });
  }
};

const resolveExecutiveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolvedBy } = req.body;

    const alert = await prisma.executiveAlert.update({
      where: { id },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
        resolvedBy
      }
    });

    res.json(alert);
  } catch (error) {
    console.error('Resolve executive alert error:', error);
    res.status(500).json({ error: error.message || 'Failed to resolve executive alert' });
  }
};

const getExecutiveInsights = async (req, res) => {
  try {
    const { companyId, type, period } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (period) where.period = period;

    const insights = await prisma.executiveInsight.findMany({
      where,
      orderBy: { periodStart: 'desc' }
    });

    res.json(insights);
  } catch (error) {
    console.error('Get executive insights error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch executive insights' });
  }
};

const generateExecutiveInsight = async (req, res) => {
  try {
    const { companyId, type, period, periodStart, periodEnd, title, description, data, metrics } = req.body;

    const insight = await prisma.executiveInsight.create({
      data: {
        companyId,
        type,
        period,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        title,
        description,
        data,
        metrics
      }
    });

    res.json(insight);
  } catch (error) {
    console.error('Generate executive insight error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate executive insight' });
  }
};

const getWorkforceSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get employee distribution by department
    const departmentDistribution = await prisma.department.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });

    // Get employee distribution by employment status
    const statusDistribution = await prisma.employee.groupBy({
      by: ['employmentStatus'],
      where: { companyId },
      _count: true
    });

    // Get new hires (last 30 days)
    const newHires = await prisma.employee.count({
      where: {
        companyId,
        hireDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });

    // Get terminations (last 30 days)
    const terminations = await prisma.employee.count({
      where: {
        companyId,
        terminationDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }
    });

    // Get average tenure
    const employees = await prisma.employee.findMany({
      where: { companyId },
      select: { hireDate: true }
    });

    const totalTenure = employees.reduce((sum, emp) => {
      const tenure = Date.now() - new Date(emp.hireDate).getTime();
      return sum + tenure;
    }, 0);

    const avgTenureDays = employees.length > 0 ? totalTenure / employees.length : 0;
    const avgTenureMonths = Math.floor(avgTenureDays / (30 * 24 * 60 * 60 * 1000));

    res.json({
      departmentDistribution: departmentDistribution.map(dept => ({
        name: dept.name,
        count: dept._count.employees
      })),
      statusDistribution: statusDistribution,
      newHires,
      terminations,
      avgTenure: {
        months: avgTenureMonths
      }
    });
  } catch (error) {
    console.error('Get workforce summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch workforce summary' });
  }
};

const getFinancialSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get payroll cost by department
    const departmentPayroll = await prisma.department.findMany({
      where: { companyId },
      include: {
        employees: {
          include: {
            payrollPayslips: {
              where: {
                payPeriodStart: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          }
        }
      }
    });

    const payrollByDepartment = departmentPayroll.map(dept => {
      const totalPay = dept.employees.reduce((sum, emp) => {
        return sum + (emp.payrollPayslips.reduce((s, p) => s + (p.netPay || 0), 0));
      }, 0);
      return {
        department: dept.name,
        totalPay
      };
    });

    // Get benefits cost
    const benefitsCost = await prisma.employee.aggregate({
      where: { companyId },
      _sum: {
        salary: true
      }
    });

    // Calculate benefits (assuming 20% of salary)
    const benefits = (benefitsCost._sum.salary || 0) * 0.2;

    res.json({
      payrollByDepartment,
      benefits,
      currency: 'KES'
    });
  } catch (error) {
    console.error('Get financial summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch financial summary' });
  }
};

module.exports = {
  // Executive Dashboard
  getExecutiveDashboard,
  // Executive Alerts
  getExecutiveAlerts,
  createExecutiveAlert,
  resolveExecutiveAlert,
  // Executive Insights
  getExecutiveInsights,
  generateExecutiveInsight,
  // Summaries
  getWorkforceSummary,
  getFinancialSummary
};
