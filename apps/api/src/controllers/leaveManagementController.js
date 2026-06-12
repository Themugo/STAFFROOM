const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Leave Balance Controllers
const createLeaveBalance = async (req, res) => {
  try {
    const { employeeId, leaveType, year, balance, accrualRate } = req.body;
    
    const leaveBalance = await prisma.leaveBalance.create({
      data: {
        employeeId,
        leaveType,
        year,
        balance: balance || 0,
        accrualRate
      }
    });
    
    res.status(201).json(leaveBalance);
  } catch (error) {
    console.error('Create leave balance error:', error);
    res.status(500).json({ error: error.message || 'Failed to create leave balance' });
  }
};

const getLeaveBalances = async (req, res) => {
  try {
    const { employeeId, leaveType, year } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (leaveType) where.leaveType = leaveType;
    if (year) where.year = parseInt(year);
    
    const balances = await prisma.leaveBalance.findMany({
      where,
      include: {
        employee: true
      },
      orderBy: [
        { year: 'desc' },
        { leaveType: 'asc' }
      ]
    });
    
    res.json(balances);
  } catch (error) {
    console.error('Get leave balances error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leave balances' });
  }
};

const getEmployeeLeaveBalances = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;
    
    const where = { employeeId };
    if (year) where.year = parseInt(year);
    
    const balances = await prisma.leaveBalance.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { leaveType: 'asc' }
      ]
    });
    
    res.json(balances);
  } catch (error) {
    console.error('Get employee leave balances error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee leave balances' });
  }
};

const updateLeaveBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { balance, used, carriedForward, accrualRate } = req.body;
    
    const leaveBalance = await prisma.leaveBalance.update({
      where: { id },
      data: {
        ...(balance !== undefined && { balance }),
        ...(used !== undefined && { used }),
        ...(carriedForward !== undefined && { carriedForward }),
        ...(accrualRate !== undefined && { accrualRate })
      }
    });
    
    res.json(leaveBalance);
  } catch (error) {
    console.error('Update leave balance error:', error);
    res.status(500).json({ error: error.message || 'Failed to update leave balance' });
  }
};

// Leave Accrual Rule Controllers
const createLeaveAccrualRule = async (req, res) => {
  try {
    const { leaveType, accrualType, rate, maxBalance, carryForwardPercentage, expiryMonths } = req.body;
    
    const rule = await prisma.leaveAccrualRule.create({
      data: {
        leaveType,
        accrualType,
        rate,
        maxBalance,
        carryForwardPercentage,
        expiryMonths
      }
    });
    
    res.status(201).json(rule);
  } catch (error) {
    console.error('Create leave accrual rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create leave accrual rule' });
  }
};

const getLeaveAccrualRules = async (req, res) => {
  try {
    const { leaveType, isActive } = req.query;
    const where = {};
    
    if (leaveType) where.leaveType = leaveType;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    
    const rules = await prisma.leaveAccrualRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(rules);
  } catch (error) {
    console.error('Get leave accrual rules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leave accrual rules' });
  }
};

const updateLeaveAccrualRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveType, accrualType, rate, maxBalance, carryForwardPercentage, expiryMonths, isActive } = req.body;
    
    const rule = await prisma.leaveAccrualRule.update({
      where: { id },
      data: {
        ...(leaveType && { leaveType }),
        ...(accrualType && { accrualType }),
        ...(rate !== undefined && { rate }),
        ...(maxBalance !== undefined && { maxBalance }),
        ...(carryForwardPercentage !== undefined && { carryForwardPercentage }),
        ...(expiryMonths !== undefined && { expiryMonths }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    res.json(rule);
  } catch (error) {
    console.error('Update leave accrual rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update leave accrual rule' });
  }
};

const deleteLeaveAccrualRule = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.leaveAccrualRule.delete({
      where: { id }
    });
    
    res.json({ message: 'Leave accrual rule deleted successfully' });
  } catch (error) {
    console.error('Delete leave accrual rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete leave accrual rule' });
  }
};

// Public Holiday Controllers
const createPublicHoliday = async (req, res) => {
  try {
    const { name, date, isRecurring, description } = req.body;
    
    const holiday = await prisma.publicHoliday.create({
      data: {
        name,
        date: new Date(date),
        isRecurring: isRecurring || false,
        description
      }
    });
    
    res.status(201).json(holiday);
  } catch (error) {
    console.error('Create public holiday error:', error);
    res.status(500).json({ error: error.message || 'Failed to create public holiday' });
  }
};

const getPublicHolidays = async (req, res) => {
  try {
    const { year, isRecurring } = req.query;
    const where = {};
    
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      where.date = { gte: startDate, lte: endDate };
    }
    if (isRecurring !== undefined) where.isRecurring = isRecurring === 'true';
    
    const holidays = await prisma.publicHoliday.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    
    res.json(holidays);
  } catch (error) {
    console.error('Get public holidays error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch public holidays' });
  }
};

const updatePublicHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, isRecurring, description } = req.body;
    
    const holiday = await prisma.publicHoliday.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(date && { date: new Date(date) }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(description !== undefined && { description })
      }
    });
    
    res.json(holiday);
  } catch (error) {
    console.error('Update public holiday error:', error);
    res.status(500).json({ error: error.message || 'Failed to update public holiday' });
  }
};

const deletePublicHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.publicHoliday.delete({
      where: { id }
    });
    
    res.json({ message: 'Public holiday deleted successfully' });
  } catch (error) {
    console.error('Delete public holiday error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete public holiday' });
  }
};

// Leave Transaction Controllers
const createLeaveTransaction = async (req, res) => {
  try {
    const { employeeId, leaveBalanceId, type, amount, description, referenceId } = req.body;
    
    const transaction = await prisma.leaveTransaction.create({
      data: {
        employeeId,
        leaveBalanceId,
        type,
        amount,
        description,
        referenceId
      },
      include: {
        employee: true,
        leaveBalance: true
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create leave transaction error:', error);
    res.status(500).json({ error: error.message || 'Failed to create leave transaction' });
  }
};

const getLeaveTransactions = async (req, res) => {
  try {
    const { employeeId, leaveBalanceId, type } = req.query;
    const where = {};
    
    if (employeeId) where.employeeId = employeeId;
    if (leaveBalanceId) where.leaveBalanceId = leaveBalanceId;
    if (type) where.type = type;
    
    const transactions = await prisma.leaveTransaction.findMany({
      where,
      include: {
        employee: true,
        leaveBalance: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Get leave transactions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch leave transactions' });
  }
};

const getEmployeeLeaveTransactions = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const transactions = await prisma.leaveTransaction.findMany({
      where: { employeeId },
      include: {
        leaveBalance: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Get employee leave transactions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee leave transactions' });
  }
};

module.exports = {
  // Leave Balances
  createLeaveBalance,
  getLeaveBalances,
  getEmployeeLeaveBalances,
  updateLeaveBalance,
  // Leave Accrual Rules
  createLeaveAccrualRule,
  getLeaveAccrualRules,
  updateLeaveAccrualRule,
  deleteLeaveAccrualRule,
  // Public Holidays
  createPublicHoliday,
  getPublicHolidays,
  updatePublicHoliday,
  deletePublicHoliday,
  // Leave Transactions
  createLeaveTransaction,
  getLeaveTransactions,
  getEmployeeLeaveTransactions
};
