const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Duty Roster Management
const createDutyRoster = async (req, res) => {
  try {
    const { companyId, departmentId, name, description, startDate, endDate, createdBy, notes } = req.body;

    const roster = await prisma.dutyRoster.create({
      data: {
        companyId,
        departmentId,
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdBy,
        notes
      }
    });

    res.json(roster);
  } catch (error) {
    console.error('Create duty roster error:', error);
    res.status(500).json({ error: error.message || 'Failed to create duty roster' });
  }
};

const updateDutyRoster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status, notes } = req.body;

    const roster = await prisma.dutyRoster.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        notes
      }
    });

    res.json(roster);
  } catch (error) {
    console.error('Update duty roster error:', error);
    res.status(500).json({ error: error.message || 'Failed to update duty roster' });
  }
};

const approveDutyRoster = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const roster = await prisma.dutyRoster.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy,
        approvedAt: new Date()
      }
    });

    res.json(roster);
  } catch (error) {
    console.error('Approve duty roster error:', error);
    res.status(500).json({ error: error.message || 'Failed to approve duty roster' });
  }
};

const deleteDutyRoster = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.dutyRoster.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete duty roster error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete duty roster' });
  }
};

const getDutyRosters = async (req, res) => {
  try {
    const { companyId, departmentId, status, startDate, endDate } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;
    if (startDate) where.startDate = { gte: new Date(startDate) };
    if (endDate) where.endDate = { lte: new Date(endDate) };

    const rosters = await prisma.dutyRoster.findMany({
      where,
      include: {
        department: {
          select: { name: true }
        },
        assignments: {
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    res.json(rosters);
  } catch (error) {
    console.error('Get duty rosters error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch duty rosters' });
  }
};

// Roster Assignments
const assignToRoster = async (req, res) => {
  try {
    const { rosterId, employeeId, rosterDate, shiftTemplateId, position, notes } = req.body;

    const assignment = await prisma.rosterAssignment.create({
      data: {
        rosterId,
        employeeId,
        rosterDate: new Date(rosterDate),
        shiftTemplateId,
        position,
        notes
      },
      include: {
        roster: {
          select: { name: true }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Assign to roster error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign to roster' });
  }
};

const updateRosterAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { rosterDate, shiftTemplateId, position, notes } = req.body;

    const assignment = await prisma.rosterAssignment.update({
      where: { id },
      data: {
        rosterDate: rosterDate ? new Date(rosterDate) : undefined,
        shiftTemplateId,
        position,
        notes
      }
    });

    res.json(assignment);
  } catch (error) {
    console.error('Update roster assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to update roster assignment' });
  }
};

const removeRosterAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.rosterAssignment.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove roster assignment error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove roster assignment' });
  }
};

const getRosterAssignments = async (req, res) => {
  try {
    const { rosterId, employeeId, rosterDate } = req.query;
    const where = {};

    if (rosterId) where.rosterId = rosterId;
    if (employeeId) where.employeeId = employeeId;
    if (rosterDate) where.rosterDate = new Date(rosterDate);

    const assignments = await prisma.rosterAssignment.findMany({
      where,
      include: {
        roster: {
          select: { name: true }
        },
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: [{ rosterDate: 'asc' }, { position: 'asc' }]
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get roster assignments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch roster assignments' });
  }
};

// Compensation Rules
const createCompensationRule = async (req, res) => {
  try {
    const { companyId, name, description, type, hoursWorked, creditEarned, multiplier, appliesTo } = req.body;

    const rule = await prisma.compensationRule.create({
      data: {
        companyId,
        name,
        description,
        type,
        hoursWorked,
        creditEarned,
        multiplier,
        appliesTo
      }
    });

    res.json(rule);
  } catch (error) {
    console.error('Create compensation rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to create compensation rule' });
  }
};

const updateCompensationRule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, hoursWorked, creditEarned, multiplier, appliesTo, enabled } = req.body;

    const rule = await prisma.compensationRule.update({
      where: { id },
      data: {
        name,
        description,
        type,
        hoursWorked,
        creditEarned,
        multiplier,
        appliesTo,
        enabled
      }
    });

    res.json(rule);
  } catch (error) {
    console.error('Update compensation rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to update compensation rule' });
  }
};

const deleteCompensationRule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.compensationRule.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete compensation rule error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete compensation rule' });
  }
};

const getCompensationRules = async (req, res) => {
  try {
    const { companyId, type, enabled } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (enabled !== undefined) where.enabled = enabled === 'true';

    const rules = await prisma.compensationRule.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(rules);
  } catch (error) {
    console.error('Get compensation rules error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch compensation rules' });
  }
};

// Compensation Credits
const calculateCompensationCredit = async (req, res) => {
  try {
    const { companyId, employeeId, hoursWorked, referenceDate, referenceType, referenceId } = req.body;

    // Find applicable compensation rules
    const rules = await prisma.compensationRule.findMany({
      where: {
        companyId,
        enabled: true
      }
    });

    let totalCredit = 0;
    const appliedRules = [];

    for (const rule of rules) {
      // Check if rule applies (simplified logic)
      let applies = true;
      if (rule.appliesTo) {
        const appliesTo = rule.appliesTo;
        // Check day of week
        if (appliesTo.days && appliesTo.days.length > 0) {
          const dayOfWeek = new Date(referenceDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
          if (!appliesTo.days.includes(dayOfWeek)) {
            applies = false;
          }
        }
      }

      if (applies && hoursWorked >= rule.hoursWorked) {
        let credit = rule.creditEarned;
        if (rule.multiplier) {
          credit = credit * rule.multiplier;
        }
        totalCredit += credit;
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          credit
        });

        // Create compensation credit record
        await prisma.compensationCredit.create({
          data: {
            companyId,
            employeeId,
            ruleId: rule.id,
            type: 'TOIL',
            hoursWorked,
            creditEarned: credit,
            referenceDate: new Date(referenceDate),
            referenceType,
            referenceId
          }
        });
      }
    }

    res.json({
      totalCredit,
      appliedRules
    });
  } catch (error) {
    console.error('Calculate compensation credit error:', error);
    res.status(500).json({ error: error.message || 'Failed to calculate compensation credit' });
  }
};

const useCompensationCredit = async (req, res) => {
  try {
    const { id } = req.params;
    const { creditUsed } = req.body;

    const credit = await prisma.compensationCredit.update({
      where: { id },
      data: {
        creditUsed: { increment: creditUsed }
      }
    });

    res.json(credit);
  } catch (error) {
    console.error('Use compensation credit error:', error);
    res.status(500).json({ error: error.message || 'Failed to use compensation credit' });
  }
};

const getCompensationCredits = async (req, res) => {
  try {
    const { companyId, employeeId, ruleId, referenceDate, expiresAt } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (ruleId) where.ruleId = ruleId;
    if (referenceDate) where.referenceDate = new Date(referenceDate);
    if (expiresAt) where.expiresAt = { gte: new Date(expiresAt) };

    const credits = await prisma.compensationCredit.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        rule: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: { referenceDate: 'desc' }
    });

    res.json(credits);
  } catch (error) {
    console.error('Get compensation credits error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch compensation credits' });
  }
};

const getEmployeeCompensationBalance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const credits = await prisma.compensationCredit.findMany({
      where: { employeeId }
    });

    let totalEarned = 0;
    let totalUsed = 0;

    credits.forEach(credit => {
      totalEarned += credit.creditEarned;
      totalUsed += credit.creditUsed;
    });

    const availableBalance = totalEarned - totalUsed;

    res.json({
      totalEarned,
      totalUsed,
      availableBalance
    });
  } catch (error) {
    console.error('Get employee compensation balance error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee compensation balance' });
  }
};

module.exports = {
  // Duty Roster Management
  createDutyRoster,
  updateDutyRoster,
  approveDutyRoster,
  deleteDutyRoster,
  getDutyRosters,
  // Roster Assignments
  assignToRoster,
  updateRosterAssignment,
  removeRosterAssignment,
  getRosterAssignments,
  // Compensation Rules
  createCompensationRule,
  updateCompensationRule,
  deleteCompensationRule,
  getCompensationRules,
  // Compensation Credits
  calculateCompensationCredit,
  useCompensationCredit,
  getCompensationCredits,
  getEmployeeCompensationBalance
};
