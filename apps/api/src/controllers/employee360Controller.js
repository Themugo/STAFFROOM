const prisma = require('../config/database');

// Get complete 360 profile for an employee
const getEmployee360Profile = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, role: true, lastLogin: true }
        },
        department: {
          select: { id: true, name: true, code: true, location: true }
        },
        position: {
          select: { id: true, title: true, description: true, baseSalary: true }
        },
        manager: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        employmentHistory: {
          orderBy: { startDate: 'desc' }
        },
        contracts: {
          orderBy: { startDate: 'desc' }
        },
        certifications: {
          orderBy: { issueDate: 'desc' }
        },
        skills: {
          orderBy: [{ category: 'asc' }, { level: 'desc' }]
        },
        trainingRecords: {
          orderBy: { startDate: 'desc' }
        },
        assets: {
          orderBy: { assignedDate: 'desc' }
        },
        disciplinaryRecords: {
          orderBy: { date: 'desc' }
        },
        promotionHistory: {
          orderBy: { fromDate: 'desc' }
        },
        salaryHistory: {
          orderBy: { effectiveDate: 'desc' }
        },
        dependants: {
          orderBy: [{ isEmergency: 'desc' }, { lastName: 'asc' }]
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        },
        performanceReviews: {
          orderBy: { period: 'desc' }
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee 360 profile error:', error);
    res.status(500).json({ error: 'Failed to fetch employee profile' });
  }
};

// Employment History
const getEmploymentHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const history = await prisma.employmentHistory.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' }
    });
    res.json(history);
  } catch (error) {
    console.error('Get employment history error:', error);
    res.status(500).json({ error: 'Failed to fetch employment history' });
  }
};

const createEmploymentHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const history = await prisma.employmentHistory.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(history);
  } catch (error) {
    console.error('Create employment history error:', error);
    res.status(500).json({ error: 'Failed to create employment history' });
  }
};

// Contracts
const getContracts = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const contracts = await prisma.contract.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' }
    });
    res.json(contracts);
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
};

const createContract = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const contract = await prisma.contract.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(contract);
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
};

// Certifications
const getCertifications = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const certifications = await prisma.certification.findMany({
      where: { employeeId },
      orderBy: { issueDate: 'desc' }
    });
    res.json(certifications);
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
};

const createCertification = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const certification = await prisma.certification.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(certification);
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ error: 'Failed to create certification' });
  }
};

// Skills
const getSkills = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const skills = await prisma.skill.findMany({
      where: { employeeId },
      orderBy: [{ category: 'asc' }, { level: 'desc' }]
    });
    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

const createSkill = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const skill = await prisma.skill.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

// Training Records
const getTrainingRecords = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const training = await prisma.trainingRecord.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' }
    });
    res.json(training);
  } catch (error) {
    console.error('Get training records error:', error);
    res.status(500).json({ error: 'Failed to fetch training records' });
  }
};

const createTrainingRecord = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const training = await prisma.trainingRecord.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(training);
  } catch (error) {
    console.error('Create training record error:', error);
    res.status(500).json({ error: 'Failed to create training record' });
  }
};

// Assets
const getAssets = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const assets = await prisma.asset.findMany({
      where: { employeeId },
      orderBy: { assignedDate: 'desc' }
    });
    res.json(assets);
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

const createAsset = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const asset = await prisma.asset.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(asset);
  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

// Disciplinary Records
const getDisciplinaryRecords = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await prisma.disciplinaryRecord.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' }
    });
    res.json(records);
  } catch (error) {
    console.error('Get disciplinary records error:', error);
    res.status(500).json({ error: 'Failed to fetch disciplinary records' });
  }
};

const createDisciplinaryRecord = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const record = await prisma.disciplinaryRecord.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(record);
  } catch (error) {
    console.error('Create disciplinary record error:', error);
    res.status(500).json({ error: 'Failed to create disciplinary record' });
  }
};

// Promotion History
const getPromotionHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const promotions = await prisma.promotionHistory.findMany({
      where: { employeeId },
      orderBy: { fromDate: 'desc' }
    });
    res.json(promotions);
  } catch (error) {
    console.error('Get promotion history error:', error);
    res.status(500).json({ error: 'Failed to fetch promotion history' });
  }
};

const createPromotionHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const promotion = await prisma.promotionHistory.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(promotion);
  } catch (error) {
    console.error('Create promotion history error:', error);
    res.status(500).json({ error: 'Failed to create promotion history' });
  }
};

// Salary History
const getSalaryHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salaryHistory = await prisma.salaryHistory.findMany({
      where: { employeeId },
      orderBy: { effectiveDate: 'desc' }
    });
    res.json(salaryHistory);
  } catch (error) {
    console.error('Get salary history error:', error);
    res.status(500).json({ error: 'Failed to fetch salary history' });
  }
};

const createSalaryHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const salary = await prisma.salaryHistory.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(salary);
  } catch (error) {
    console.error('Create salary history error:', error);
    res.status(500).json({ error: 'Failed to create salary history' });
  }
};

// Dependants
const getDependants = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const dependants = await prisma.dependant.findMany({
      where: { employeeId },
      orderBy: [{ isEmergency: 'desc' }, { lastName: 'asc' }]
    });
    res.json(dependants);
  } catch (error) {
    console.error('Get dependants error:', error);
    res.status(500).json({ error: 'Failed to fetch dependants' });
  }
};

const createDependant = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const dependant = await prisma.dependant.create({
      data: { ...req.body, employeeId }
    });
    res.status(201).json(dependant);
  } catch (error) {
    console.error('Create dependant error:', error);
    res.status(500).json({ error: 'Failed to create dependant' });
  }
};

module.exports = {
  getEmployee360Profile,
  getEmploymentHistory,
  createEmploymentHistory,
  getContracts,
  createContract,
  getCertifications,
  createCertification,
  getSkills,
  createSkill,
  getTrainingRecords,
  createTrainingRecord,
  getAssets,
  createAsset,
  getDisciplinaryRecords,
  createDisciplinaryRecord,
  getPromotionHistory,
  createPromotionHistory,
  getSalaryHistory,
  createSalaryHistory,
  getDependants,
  createDependant
};
