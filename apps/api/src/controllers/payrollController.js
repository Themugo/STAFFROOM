const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Payroll Run Controllers
const createPayrollRun = async (req, res) => {
  try {
    const { name, period, startDate, endDate, frequency } = req.body;
    
    const payrollRun = await prisma.payrollRun.create({
      data: {
        name,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        frequency: frequency || 'MONTHLY',
        status: 'DRAFT'
      }
    });
    
    res.status(201).json(payrollRun);
  } catch (error) {
    console.error('Create payroll run error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payroll run' });
  }
};

const getPayrollRuns = async (req, res) => {
  try {
    const { status, year } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      where.startDate = { gte: startDate };
      where.endDate = { lte: endDate };
    }
    
    const payrollRuns = await prisma.payrollRun.findMany({
      where,
      include: {
        payslips: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                employeeId: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(payrollRuns);
  } catch (error) {
    console.error('Get payroll runs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch payroll runs' });
  }
};

const getPayrollRunById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payrollRun = await prisma.payrollRun.findUnique({
      where: { id },
      include: {
        payslips: {
          include: {
            employee: true
          }
        }
      }
    });
    
    if (!payrollRun) {
      return res.status(404).json({ error: 'Payroll run not found' });
    }
    
    res.json(payrollRun);
  } catch (error) {
    console.error('Get payroll run error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch payroll run' });
  }
};

const updatePayrollRun = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, period, startDate, endDate, frequency, status } = req.body;
    
    const payrollRun = await prisma.payrollRun.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(frequency && { frequency }),
        ...(status && { status })
      }
    });
    
    res.json(payrollRun);
  } catch (error) {
    console.error('Update payroll run error:', error);
    res.status(500).json({ error: error.message || 'Failed to update payroll run' });
  }
};

const approvePayrollRun = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;
    
    const payrollRun = await prisma.payrollRun.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date()
      }
    });
    
    res.json(payrollRun);
  } catch (error) {
    console.error('Approve payroll run error:', error);
    res.status(500).json({ error: error.message || 'Failed to approve payroll run' });
  }
};

const deletePayrollRun = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.payrollRun.delete({
      where: { id }
    });
    
    res.json({ message: 'Payroll run deleted successfully' });
  } catch (error) {
    console.error('Delete payroll run error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete payroll run' });
  }
};

// Salary Component Controllers
const createSalaryComponent = async (req, res) => {
  try {
    const { name, type, amount, isPercentage, description } = req.body;
    
    const component = await prisma.salaryComponent.create({
      data: {
        name,
        type,
        amount,
        isPercentage: isPercentage || false,
        description
      }
    });
    
    res.status(201).json(component);
  } catch (error) {
    console.error('Create salary component error:', error);
    res.status(500).json({ error: error.message || 'Failed to create salary component' });
  }
};

const getSalaryComponents = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const components = await prisma.salaryComponent.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(components);
  } catch (error) {
    console.error('Get salary components error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch salary components' });
  }
};

const updateSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, amount, isPercentage, description, isActive } = req.body;
    
    const component = await prisma.salaryComponent.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(amount !== undefined && { amount }),
        ...(isPercentage !== undefined && { isPercentage }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(component);
  } catch (error) {
    console.error('Update salary component error:', error);
    res.status(500).json({ error: error.message || 'Failed to update salary component' });
  }
};

const deleteSalaryComponent = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.salaryComponent.delete({
      where: { id }
    });
    
    res.json({ message: 'Salary component deleted successfully' });
  } catch (error) {
    console.error('Delete salary component error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete salary component' });
  }
};

// Deduction Controllers
const createDeduction = async (req, res) => {
  try {
    const { name, type, amount, isPercentage, description } = req.body;
    
    const deduction = await prisma.deduction.create({
      data: {
        name,
        type,
        amount,
        isPercentage: isPercentage || false,
        description
      }
    });
    
    res.status(201).json(deduction);
  } catch (error) {
    console.error('Create deduction error:', error);
    res.status(500).json({ error: error.message || 'Failed to create deduction' });
  }
};

const getDeductions = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const where = {};
    
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const deductions = await prisma.deduction.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(deductions);
  } catch (error) {
    console.error('Get deductions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch deductions' });
  }
};

const updateDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, amount, isPercentage, description, isActive } = req.body;
    
    const deduction = await prisma.deduction.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(amount !== undefined && { amount }),
        ...(isPercentage !== undefined && { isPercentage }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(deduction);
  } catch (error) {
    console.error('Update deduction error:', error);
    res.status(500).json({ error: error.message || 'Failed to update deduction' });
  }
};

const deleteDeduction = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.deduction.delete({
      where: { id }
    });
    
    res.json({ message: 'Deduction deleted successfully' });
  } catch (error) {
    console.error('Delete deduction error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete deduction' });
  }
};

// Payslip Controllers
const generatePayslip = async (req, res) => {
  try {
    const { employeeId, payrollRunId, period, grossSalary, netSalary, totalTax, totalDeductions, earnings, deductions, taxDetails } = req.body;
    
    const payslip = await prisma.payslip.create({
      data: {
        employeeId,
        payrollRunId,
        period,
        grossSalary,
        netSalary,
        totalTax,
        totalDeductions,
        earnings,
        deductions,
        taxDetails,
        generatedAt: new Date()
      },
      include: {
        employee: true,
        payrollRun: true
      }
    });
    
    res.status(201).json(payslip);
  } catch (error) {
    console.error('Generate payslip error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate payslip' });
  }
};

const getPayslips = async (req, res) => {
  try {
    const { employeeId, payrollRunId, period } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (payrollRunId) where.payrollRunId = payrollRunId;
    if (period) where.period = period;
    
    const payslips = await prisma.payslip.findMany({
      where,
      include: {
        employee: true,
        payrollRun: true
      },
      orderBy: { generatedAt: 'desc' }
    });
    
    res.json(payslips);
  } catch (error) {
    console.error('Get payslips error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch payslips' });
  }
};

const getPayslipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payslip = await prisma.payslip.findUnique({
      where: { id },
      include: {
        employee: true,
        payrollRun: true
      }
    });
    
    if (!payslip) {
      return res.status(404).json({ error: 'Payslip not found' });
    }
    
    res.json(payslip);
  } catch (error) {
    console.error('Get payslip error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch payslip' });
  }
};

const getEmployeePayslips = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const payslips = await prisma.payslip.findMany({
      where: { employeeId },
      include: {
        payrollRun: true
      },
      orderBy: { generatedAt: 'desc' }
    });
    
    res.json(payslips);
  } catch (error) {
    console.error('Get employee payslips error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee payslips' });
  }
};

module.exports = {
  // Payroll Run
  createPayrollRun,
  getPayrollRuns,
  getPayrollRunById,
  updatePayrollRun,
  approvePayrollRun,
  deletePayrollRun,
  // Salary Components
  createSalaryComponent,
  getSalaryComponents,
  updateSalaryComponent,
  deleteSalaryComponent,
  // Deductions
  createDeduction,
  getDeductions,
  updateDeduction,
  deleteDeduction,
  // Payslips
  generatePayslip,
  getPayslips,
  getPayslipById,
  getEmployeePayslips
};
