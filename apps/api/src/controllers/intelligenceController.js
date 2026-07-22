const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Employee Risk Prediction
const calculateAttritionRisk = async (employee) => {
  let riskScore = 0;
  const factors = {};

  // Tenure factor (higher tenure = lower risk)
  const tenureMonths = (new Date() - new Date(employee.hireDate)) / (1000 * 60 * 60 * 24 * 30);
  factors.tenure = tenureMonths;
  if (tenureMonths < 6) riskScore += 30;
  else if (tenureMonths < 12) riskScore += 20;
  else if (tenureMonths < 24) riskScore += 10;
  else riskScore -= 10;

  // Salary factor (below market = higher risk)
  const marketSalary = employee.salary * 1.2; // Assume market is 20% higher
  factors.salaryRatio = employee.salary / marketSalary;
  if (employee.salary < marketSalary * 0.8) riskScore += 25;
  else if (employee.salary < marketSalary * 0.9) riskScore += 15;
  else if (employee.salary < marketSalary) riskScore += 5;

  // Performance factor
  const performanceReviews = await prisma.performanceReview.findMany({
    where: { employeeId: employee.id },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  const avgPerformance = performanceReviews.length > 0 
    ? performanceReviews.reduce((sum, r) => sum + r.rating, 0) / performanceReviews.length 
    : 3;
  factors.avgPerformance = avgPerformance;
  if (avgPerformance < 2.5) riskScore += 25;
  else if (avgPerformance < 3) riskScore += 15;
  else if (avgPerformance < 3.5) riskScore += 5;
  else riskScore -= 10;

  // Attendance factor
  const attendances = await prisma.attendance.findMany({
    where: { employeeId: employee.id },
    take: 30
  });
  const attendanceRate = attendances.length > 0 
    ? attendances.filter(a => a.checkIn).length / attendances.length 
    : 0.95;
  factors.attendanceRate = attendanceRate;
  if (attendanceRate < 0.8) riskScore += 20;
  else if (attendanceRate < 0.9) riskScore += 10;
  else riskScore -= 5;

  // Leave utilization factor
  const leaves = await prisma.leave.findMany({
    where: { employeeId: employee.id, status: 'APPROVED' }
  });
  factors.leaveCount = leaves.length;
  if (leaves.length > 5) riskScore += 10;

  // Normalize score to 0-100
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine risk level
  let riskLevel = 'LOW';
  if (riskScore >= 70) riskLevel = 'CRITICAL';
  else if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 30) riskLevel = 'MEDIUM';

  // Generate recommendations
  const recommendations = [];
  if (riskScore >= 30) {
    if (factors.tenure < 12) recommendations.push('Conduct stay interview to understand concerns');
    if (factors.salaryRatio < 0.9) recommendations.push('Review compensation package');
    if (factors.avgPerformance < 3) recommendations.push('Provide performance coaching and support');
    if (factors.attendanceRate < 0.9) recommendations.push('Address attendance patterns');
  }

  return {
    riskScore,
    riskLevel,
    factors,
    recommendations,
    confidence: 0.75
  };
};

const generateEmployeeRiskPredictions = async (req, res) => {
  try {
    const { companyId } = req.query;
    const where = companyId ? { companyId } : {};

    const employees = await prisma.employee.findMany({
      where: { ...where, status: 'ACTIVE' },
      include: { company: true }
    });

    const predictions = await Promise.all(
      employees.map(async (employee) => {
        const attritionRisk = await calculateAttritionRisk(employee);
        
        // Create or update prediction
        const prediction = await prisma.employeeRiskPrediction.upsert({
          where: {
            id: employee.id + '-ATTRITION' // Simple composite key
          },
          update: {
            riskScore: attritionRisk.riskScore,
            riskLevel: attritionRisk.riskLevel,
            factors: attritionRisk.factors,
            recommendations: attritionRisk.recommendations,
            confidence: attritionRisk.confidence,
            updatedAt: new Date()
          },
          create: {
            employeeId: employee.id,
            companyId: employee.companyId,
            predictionType: 'ATTRITION',
            riskScore: attritionRisk.riskScore,
            riskLevel: attritionRisk.riskLevel,
            factors: attritionRisk.factors,
            recommendations: attritionRisk.recommendations,
            confidence: attritionRisk.confidence
          }
        });

        return prediction;
      })
    );

    res.json(predictions);
  } catch (error) {
    console.error('Generate risk predictions error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate risk predictions' });
  }
};

const getEmployeeRiskPredictions = async (req, res) => {
  try {
    const { companyId, employeeId, predictionType, riskLevel } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (predictionType) where.predictionType = predictionType;
    if (riskLevel) where.riskLevel = riskLevel;

    const predictions = await prisma.employeeRiskPrediction.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            employeeId: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { riskScore: 'desc' }
    });

    res.json(predictions);
  } catch (error) {
    console.error('Get risk predictions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch risk predictions' });
  }
};

// Department Productivity Scoring
const calculateDepartmentProductivity = async (department, period) => {
  const employees = await prisma.employee.findMany({
    where: { departmentId: department.id, status: 'ACTIVE' }
  });

  // Calculate metrics
  const tasksCompleted = await prisma.task.count({
    where: {
      assigneeId: { in: employees.map(e => e.id) },
      completedAt: { gte: new Date(period) }
    }
  });

  const attendances = await prisma.attendance.findMany({
    where: {
      employeeId: { in: employees.map(e => e.id) },
      date: { gte: new Date(period) }
    }
  });

  const attendanceRate = attendances.length > 0 
    ? attendances.filter(a => a.checkIn).length / attendances.length 
    : 0.95;

  const performanceReviews = await prisma.performanceReview.findMany({
    where: {
      employeeId: { in: employees.map(e => e.id) },
      createdAt: { gte: new Date(period) }
    }
  });

  const avgPerformance = performanceReviews.length > 0 
    ? performanceReviews.reduce((sum, r) => sum + r.rating, 0) / performanceReviews.length 
    : 3.5;

  // Calculate scores
  const efficiencyScore = Math.min(100, (tasksCompleted / employees.length) * 10);
  const qualityScore = (avgPerformance / 5) * 100;
  const collaborationScore = attendanceRate * 100;
  const overallScore = (efficiencyScore * 0.4 + qualityScore * 0.3 + collaborationScore * 0.3);

  return {
    overallScore,
    efficiencyScore,
    qualityScore,
    collaborationScore,
    metrics: {
      tasksCompleted,
      employeeCount: employees.length,
      attendanceRate,
      avgPerformance
    }
  };
};

const generateDepartmentProductivityScores = async (req, res) => {
  try {
    const { companyId } = req.query;
    const where = companyId ? { companyId } : {};

    const departments = await prisma.department.findMany({
      where,
      include: { company: true }
    });

    const period = new Date();
    period.setMonth(period.getMonth() - 1); // Last month

    const scores = await Promise.all(
      departments.map(async (department) => {
        const productivity = await calculateDepartmentProductivity(department, period);
        
        const score = await prisma.departmentProductivityScore.upsert({
          where: {
            id: department.id + '-' + period.toISOString().slice(0, 7)
          },
          update: {
            overallScore: productivity.overallScore,
            efficiencyScore: productivity.efficiencyScore,
            qualityScore: productivity.qualityScore,
            collaborationScore: productivity.collaborationScore,
            metrics: productivity.metrics,
            updatedAt: new Date()
          },
          create: {
            departmentId: department.id,
            companyId: department.companyId,
            period: period.toISOString().slice(0, 7),
            overallScore: productivity.overallScore,
            efficiencyScore: productivity.efficiencyScore,
            qualityScore: productivity.qualityScore,
            collaborationScore: productivity.collaborationScore,
            metrics: productivity.metrics
          }
        });

        return score;
      })
    );

    res.json(scores);
  } catch (error) {
    console.error('Generate productivity scores error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate productivity scores' });
  }
};

const getDepartmentProductivityScores = async (req, res) => {
  try {
    const { companyId, departmentId, period } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (period) where.period = period;

    const scores = await prisma.departmentProductivityScore.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { overallScore: 'desc' }
    });

    res.json(scores);
  } catch (error) {
    console.error('Get productivity scores error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch productivity scores' });
  }
};

// Hiring Forecast
const generateHiringForecast = async (req, res) => {
  try {
    const { companyId, departmentId, forecastPeriod } = req.query;
    const period = forecastPeriod || 'QUARTERLY';

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { employees: true }
    });

    // Calculate attrition rate
    const terminatedEmployees = company.employees.filter(e => e.status === 'TERMINATED');
    const attritionRate = terminatedEmployees.length / company.employees.length;

    // Calculate growth rate (simplified)
    const growthRate = 0.05; // Assume 5% growth

    // Predict hires based on attrition and growth
    const predictedHires = Math.ceil(company.employees.length * (attritionRate + growthRate));

    const forecast = await prisma.hiringForecast.create({
      data: {
        companyId,
        departmentId: departmentId || null,
        forecastPeriod: period,
        forecastDate: new Date(),
        predictedHires,
        confidence: 0.7,
        breakdown: {
          byLevel: {
            junior: Math.ceil(predictedHires * 0.4),
            mid: Math.ceil(predictedHires * 0.4),
            senior: Math.ceil(predictedHires * 0.2)
          }
        },
        drivers: {
          attrition: Math.ceil(company.employees.length * attritionRate),
          growth: Math.ceil(company.employees.length * growthRate)
        }
      }
    });

    res.json(forecast);
  } catch (error) {
    console.error('Generate hiring forecast error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate hiring forecast' });
  }
};

const getHiringForecasts = async (req, res) => {
  try {
    const { companyId, departmentId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;

    const forecasts = await prisma.hiringForecast.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        department: departmentId ? {
          select: {
            id: true,
            name: true
          }
        } : undefined
      },
      orderBy: { forecastDate: 'desc' }
    });

    res.json(forecasts);
  } catch (error) {
    console.error('Get hiring forecasts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch hiring forecasts' });
  }
};

// Salary Benchmarking
const generateSalaryBenchmarks = async (req, res) => {
  try {
    const { companyId } = req.query;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        employees: {
          include: { position: true, department: true }
        }
      }
    });

    // Group salaries by position
    const positionSalaries = {};
    company.employees.forEach(emp => {
      if (emp.position && emp.salary) {
        if (!positionSalaries[emp.position.title]) {
          positionSalaries[emp.position.title] = [];
        }
        positionSalaries[emp.position.title].push(emp.salary);
      }
    });

    // Generate benchmarks for each position
    const benchmarks = await Promise.all(
      Object.entries(positionSalaries).map(async ([positionTitle, salaries]) => {
        const companyAverage = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
        const marketAverage = companyAverage * 1.15; // Assume market is 15% higher
        const percentile = (companyAverage / marketAverage) * 100;

        const position = await prisma.position.findFirst({
          where: { title: positionTitle, companyId }
        });

        return prisma.salaryBenchmark.create({
          data: {
            companyId,
            positionId: position?.id,
            category: 'SALARY',
            marketAverage,
            companyAverage,
            percentile,
            industry: company.industry,
            companySize: company.size,
            dataPoints: {
              p25: marketAverage * 0.85,
              p50: marketAverage,
              p75: marketAverage * 1.15,
              p90: marketAverage * 1.3
            },
            recommendations: percentile < 80 
              ? ['Consider salary adjustments to remain competitive']
              : ['Salary is competitive with market rates']
          }
        });
      })
    );

    res.json(benchmarks);
  } catch (error) {
    console.error('Generate salary benchmarks error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate salary benchmarks' });
  }
};

const getSalaryBenchmarks = async (req, res) => {
  try {
    const { companyId, category, positionId, departmentId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (category) where.category = category;
    if (positionId) where.positionId = positionId;
    if (departmentId) where.departmentId = departmentId;

    const benchmarks = await prisma.salaryBenchmark.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        },
        position: positionId ? {
          select: {
            id: true,
            title: true
          }
        } : undefined,
        department: departmentId ? {
          select: {
            id: true,
            name: true
          }
        } : undefined
      },
      orderBy: { lastUpdated: 'desc' }
    });

    res.json(benchmarks);
  } catch (error) {
    console.error('Get salary benchmarks error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch salary benchmarks' });
  }
};

// Intelligence Dashboard Summary
const getIntelligenceSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get high-risk employees
    const highRiskEmployees = await prisma.employeeRiskPrediction.findMany({
      where: {
        companyId,
        riskLevel: { in: ['HIGH', 'CRITICAL'] }
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      take: 10
    });

    // Get low productivity departments
    const lowProductivityDepts = await prisma.departmentProductivityScore.findMany({
      where: { companyId },
      include: {
        department: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { overallScore: 'asc' },
      take: 5
    });

    // Get latest hiring forecast
    const latestForecast = await prisma.hiringForecast.findFirst({
      where: { companyId },
      orderBy: { forecastDate: 'desc' }
    });

    // Get salary benchmark insights
    const salaryBenchmarks = await prisma.salaryBenchmark.findMany({
      where: { companyId, category: 'SALARY' },
      take: 10
    });

    const belowMarketSalaries = salaryBenchmarks.filter(b => b.percentile < 80);

    res.json({
      highRiskEmployees: {
        count: highRiskEmployees.length,
        employees: highRiskEmployees
      },
      lowProductivityDepartments: {
        count: lowProductivityDepts.length,
        departments: lowProductivityDepts
      },
      hiringForecast: latestForecast,
      salaryInsights: {
        belowMarketCount: belowMarketSalaries.length,
        benchmarks: salaryBenchmarks
      }
    });
  } catch (error) {
    console.error('Get intelligence summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch intelligence summary' });
  }
};

module.exports = {
  // Risk Predictions
  generateEmployeeRiskPredictions,
  getEmployeeRiskPredictions,
  // Productivity Scores
  generateDepartmentProductivityScores,
  getDepartmentProductivityScores,
  // Hiring Forecasts
  generateHiringForecast,
  getHiringForecasts,
  // Salary Benchmarks
  generateSalaryBenchmarks,
  getSalaryBenchmarks,
  // Dashboard
  getIntelligenceSummary
};
