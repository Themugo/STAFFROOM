const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Time Bank / Hours Bank
const createTimeBank = async (req, res) => {
  try {
    const { companyId, employeeId, expiresAfter } = req.body;

    const timeBank = await prisma.timeBank.create({
      data: {
        companyId,
        employeeId,
        expiresAfter
      }
    });

    res.json(timeBank);
  } catch (error) {
    console.error('Create time bank error:', error);
    res.status(500).json({ error: error.message || 'Failed to create time bank' });
  }
};

const updateTimeBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAfter } = req.body;

    const timeBank = await prisma.timeBank.update({
      where: { id },
      data: { expiresAfter }
    });

    res.json(timeBank);
  } catch (error) {
    console.error('Update time bank error:', error);
    res.status(500).json({ error: error.message || 'Failed to update time bank' });
  }
};

const getTimeBank = async (req, res) => {
  try {
    const { companyId, employeeId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;

    const timeBanks = await prisma.timeBank.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });

    res.json(timeBanks);
  } catch (error) {
    console.error('Get time bank error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch time bank' });
  }
};

const addTimeBankTransaction = async (req, res) => {
  try {
    const { timeBankId, type, hours, description, referenceDate, referenceType, referenceId } = req.body;

    const transaction = await prisma.timeBankTransaction.create({
      data: {
        timeBankId,
        type,
        hours,
        description,
        referenceDate: new Date(referenceDate),
        referenceType,
        referenceId
      }
    });

    // Update time bank balance
    const timeBank = await prisma.timeBank.findUnique({
      where: { id: timeBankId }
    });

    let hoursEarned = timeBank.hoursEarned;
    let hoursUsed = timeBank.hoursUsed;

    if (type === 'EARNED') {
      hoursEarned += hours;
    } else if (type === 'USED') {
      hoursUsed += hours;
    } else if (type === 'ADJUSTMENT') {
      // Adjust based on positive or negative hours
      if (hours > 0) {
        hoursEarned += hours;
      } else {
        hoursUsed += Math.abs(hours);
      }
    } else if (type === 'EXPIRED') {
      hoursUsed += hours;
    }

    const hoursRemaining = hoursEarned - hoursUsed;

    await prisma.timeBank.update({
      where: { id: timeBankId },
      data: {
        hoursEarned,
        hoursUsed,
        hoursRemaining
      }
    });

    res.json(transaction);
  } catch (error) {
    console.error('Add time bank transaction error:', error);
    res.status(500).json({ error: error.message || 'Failed to add time bank transaction' });
  }
};

const getTimeBankTransactions = async (req, res) => {
  try {
    const { timeBankId, type, referenceDate } = req.query;
    const where = {};

    if (timeBankId) where.timeBankId = timeBankId;
    if (type) where.type = type;
    if (referenceDate) where.referenceDate = new Date(referenceDate);

    const transactions = await prisma.timeBankTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get time bank transactions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch time bank transactions' });
  }
};

// Days Owed to Company
const createEmployeeDebt = async (req, res) => {
  try {
    const { companyId, employeeId, type, daysOwed, hoursOwed, description, referenceDate, referenceType, referenceId } = req.body;

    const debt = await prisma.employeeDebt.create({
      data: {
        companyId,
        employeeId,
        type,
        daysOwed,
        hoursOwed,
        description,
        referenceDate: new Date(referenceDate),
        referenceType,
        referenceId
      }
    });

    res.json(debt);
  } catch (error) {
    console.error('Create employee debt error:', error);
    res.status(500).json({ error: error.message || 'Failed to create employee debt' });
  }
};

const updateEmployeeDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const { daysRepaid, hoursRepaid, isResolved } = req.body;

    const debt = await prisma.employeeDebt.update({
      where: { id },
      data: {
        daysRepaid: daysRepaid !== undefined ? { increment: daysRepaid } : undefined,
        hoursRepaid: hoursRepaid !== undefined ? { increment: hoursRepaid } : undefined,
        isResolved,
        resolvedAt: isResolved ? new Date() : undefined
      }
    });

    res.json(debt);
  } catch (error) {
    console.error('Update employee debt error:', error);
    res.status(500).json({ error: error.message || 'Failed to update employee debt' });
  }
};

const deleteEmployeeDebt = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employeeDebt.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete employee debt error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete employee debt' });
  }
};

const getEmployeeDebts = async (req, res) => {
  try {
    const { companyId, employeeId, type, isResolved } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (type) where.type = type;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';

    const debts = await prisma.employeeDebt.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(debts);
  } catch (error) {
    console.error('Get employee debts error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee debts' });
  }
};

// Company Owes Employee
const createEmployeeCredit = async (req, res) => {
  try {
    const { companyId, employeeId, type, daysOwed, hoursOwed, description, referenceDate, referenceType, referenceId, expiresAt } = req.body;

    const credit = await prisma.employeeCredit.create({
      data: {
        companyId,
        employeeId,
        type,
        daysOwed,
        hoursOwed,
        description,
        referenceDate: new Date(referenceDate),
        referenceType,
        referenceId,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.json(credit);
  } catch (error) {
    console.error('Create employee credit error:', error);
    res.status(500).json({ error: error.message || 'Failed to create employee credit' });
  }
};

const updateEmployeeCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const { daysUsed, hoursUsed, isResolved } = req.body;

    const credit = await prisma.employeeCredit.update({
      where: { id },
      data: {
        daysUsed: daysUsed !== undefined ? { increment: daysUsed } : undefined,
        hoursUsed: hoursUsed !== undefined ? { increment: hoursUsed } : undefined,
        isResolved,
        resolvedAt: isResolved ? new Date() : undefined
      }
    });

    res.json(credit);
  } catch (error) {
    console.error('Update employee credit error:', error);
    res.status(500).json({ error: error.message || 'Failed to update employee credit' });
  }
};

const deleteEmployeeCredit = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employeeCredit.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete employee credit error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete employee credit' });
  }
};

const getEmployeeCredits = async (req, res) => {
  try {
    const { companyId, employeeId, type, isResolved, expiresAt } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (type) where.type = type;
    if (isResolved !== undefined) where.isResolved = isResolved === 'true';
    if (expiresAt) where.expiresAt = { gte: new Date(expiresAt) };

    const credits = await prisma.employeeCredit.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(credits);
  } catch (error) {
    console.error('Get employee credits error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee credits' });
  }
};

// Dashboard - Net Balance
const getEmployeeNetBalance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    // Get debts (employee owes company)
    const debts = await prisma.employeeDebt.findMany({
      where: { employeeId, isResolved: false }
    });

    let totalDaysOwed = 0;
    let totalHoursOwed = 0;

    debts.forEach(debt => {
      totalDaysOwed += debt.daysOwed - debt.daysRepaid;
      totalHoursOwed += debt.hoursOwed - debt.hoursRepaid;
    });

    // Get credits (company owes employee)
    const credits = await prisma.employeeCredit.findMany({
      where: { employeeId, isResolved: false }
    });

    let totalDaysOwedByCompany = 0;
    let totalHoursOwedByCompany = 0;

    credits.forEach(credit => {
      totalDaysOwedByCompany += credit.daysOwed - credit.daysUsed;
      totalHoursOwedByCompany += credit.hoursOwed - credit.hoursUsed;
    });

    // Calculate net balance
    const netDays = totalDaysOwedByCompany - totalDaysOwed;
    const netHours = totalHoursOwedByCompany - totalHoursOwed;

    res.json({
      employeeOwes: {
        days: totalDaysOwed,
        hours: totalHoursOwed
      },
      companyOwes: {
        days: totalDaysOwedByCompany,
        hours: totalHoursOwedByCompany
      },
      netBalance: {
        days: netDays,
        hours: netHours,
        direction: netDays > 0 || netHours > 0 ? 'COMPANY_OWES' : (netDays < 0 || netHours < 0 ? 'EMPLOYEE_OWES' : 'BALANCED')
      }
    });
  } catch (error) {
    console.error('Get employee net balance error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee net balance' });
  }
};

module.exports = {
  // Time Bank
  createTimeBank,
  updateTimeBank,
  getTimeBank,
  addTimeBankTransaction,
  getTimeBankTransactions,
  // Employee Debts
  createEmployeeDebt,
  updateEmployeeDebt,
  deleteEmployeeDebt,
  getEmployeeDebts,
  // Employee Credits
  createEmployeeCredit,
  updateEmployeeCredit,
  deleteEmployeeCredit,
  getEmployeeCredits,
  // Dashboard
  getEmployeeNetBalance
};
