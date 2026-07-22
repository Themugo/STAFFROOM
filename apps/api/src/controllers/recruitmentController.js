const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Vacancy Controllers
const createVacancy = async (req, res) => {
  try {
    const { title, description, departmentId, positionId, location, employmentType, salaryMin, salaryMax, requirements, responsibilities, benefits, deadline, positions } = req.body;
    
    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        departmentId,
        positionId,
        location,
        employmentType,
        salaryMin,
        salaryMax,
        requirements,
        responsibilities,
        benefits,
        deadline: deadline ? new Date(deadline) : null,
        positions: positions || 1,
        status: 'DRAFT'
      },
      include: {
        department: true,
        position: true
      }
    });
    
    res.status(201).json(vacancy);
  } catch (error) {
    console.error('Create vacancy error:', error);
    res.status(500).json({ error: error.message || 'Failed to create vacancy' });
  }
};

const getVacancies = async (req, res) => {
  try {
    const { status, departmentId, positionId } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;
    if (positionId) where.positionId = positionId;
    
    const vacancies = await prisma.vacancy.findMany({
      where,
      include: {
        department: true,
        position: true,
        applications: {
          include: {
            candidate: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(vacancies);
  } catch (error) {
    console.error('Get vacancies error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch vacancies' });
  }
};

const getVacancyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vacancy = await prisma.vacancy.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        applications: {
          include: {
            candidate: true,
            interviews: true
          }
        }
      }
    });
    
    if (!vacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }
    
    res.json(vacancy);
  } catch (error) {
    console.error('Get vacancy error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch vacancy' });
  }
};

const updateVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, employmentType, salaryMin, salaryMax, requirements, responsibilities, benefits, status, deadline, positions, publishedAt } = req.body;
    
    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(location !== undefined && { location }),
        ...(employmentType && { employmentType }),
        ...(salaryMin !== undefined && { salaryMin }),
        ...(salaryMax !== undefined && { salaryMax }),
        ...(requirements !== undefined && { requirements }),
        ...(responsibilities !== undefined && { responsibilities }),
        ...(benefits !== undefined && { benefits }),
        ...(status && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(positions !== undefined && { positions }),
        ...(publishedAt && { publishedAt: new Date(publishedAt) })
      },
      include: {
        department: true,
        position: true
      }
    });
    
    res.json(vacancy);
  } catch (error) {
    console.error('Update vacancy error:', error);
    res.status(500).json({ error: error.message || 'Failed to update vacancy' });
  }
};

const deleteVacancy = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.vacancy.delete({
      where: { id }
    });
    
    res.json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    console.error('Delete vacancy error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete vacancy' });
  }
};

// Candidate Controllers
const createCandidate = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, location, resumeUrl, linkedInUrl, portfolioUrl, notes, source } = req.body;
    
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        location,
        resumeUrl,
        linkedInUrl,
        portfolioUrl,
        notes,
        source
      }
    });
    
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({ error: error.message || 'Failed to create candidate' });
  }
};

const getCandidates = async (req, res) => {
  try {
    const { source } = req.query;
    const where = {};
    
    if (source) where.source = source;
    
    const candidates = await prisma.candidate.findMany({
      where,
      include: {
        applications: {
          include: {
            vacancy: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(candidates);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch candidates' });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        applications: {
          include: {
            vacancy: true,
            interviews: true
          }
        }
      }
    });
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch candidate' });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, location, resumeUrl, linkedInUrl, portfolioUrl, notes, source } = req.body;
    
    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(resumeUrl !== undefined && { resumeUrl }),
        ...(linkedInUrl !== undefined && { linkedInUrl }),
        ...(portfolioUrl !== undefined && { portfolioUrl }),
        ...(notes !== undefined && { notes }),
        ...(source !== undefined && { source })
      }
    });
    
    res.json(candidate);
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ error: error.message || 'Failed to update candidate' });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.candidate.delete({
      where: { id }
    });
    
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete candidate' });
  }
};

// Application Controllers
const createApplication = async (req, res) => {
  try {
    const { vacancyId, candidateId, coverLetter, expectedSalary, availableDate } = req.body;
    
    const application = await prisma.application.create({
      data: {
        vacancyId,
        candidateId,
        coverLetter,
        expectedSalary,
        availableDate: availableDate ? new Date(availableDate) : null
      },
      include: {
        vacancy: true,
        candidate: true
      }
    });
    
    res.status(201).json(application);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: error.message || 'Failed to create application' });
  }
};

const getApplications = async (req, res) => {
  try {
    const { vacancyId, candidateId, status } = req.query;
    const where = {};
    
    if (vacancyId) where.vacancyId = vacancyId;
    if (candidateId) where.candidateId = candidateId;
    if (status) where.status = status;
    
    const applications = await prisma.application.findMany({
      where,
      include: {
        vacancy: true,
        candidate: true,
        interviews: true
      },
      orderBy: { appliedAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch applications' });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, coverLetter, expectedSalary, availableDate } = req.body;
    
    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(coverLetter !== undefined && { coverLetter }),
        ...(expectedSalary !== undefined && { expectedSalary }),
        ...(availableDate !== undefined && { availableDate: availableDate ? new Date(availableDate) : null })
      },
      include: {
        vacancy: true,
        candidate: true
      }
    });
    
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: error.message || 'Failed to update application' });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.application.delete({
      where: { id }
    });
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete application' });
  }
};

// Interview Controllers
const createInterview = async (req, res) => {
  try {
    const { applicationId, type, scheduledDate, duration, location, notes, interviewerId } = req.body;
    
    const interview = await prisma.interview.create({
      data: {
        applicationId,
        type,
        scheduledDate: new Date(scheduledDate),
        duration,
        location,
        notes,
        interviewerId
      },
      include: {
        application: {
          include: {
            candidate: true,
            vacancy: true
          }
        }
      }
    });
    
    res.status(201).json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ error: error.message || 'Failed to create interview' });
  }
};

const getInterviews = async (req, res) => {
  try {
    const { applicationId, status, scheduledDate } = req.query;
    const where = {};
    
    if (applicationId) where.applicationId = applicationId;
    if (status) where.status = status;
    if (scheduledDate) {
      const date = new Date(scheduledDate);
      where.scheduledDate = {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }
    
    const interviews = await prisma.interview.findMany({
      where,
      include: {
        application: {
          include: {
            candidate: true,
            vacancy: true
          }
        }
      },
      orderBy: { scheduledDate: 'asc' }
    });
    
    res.json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch interviews' });
  }
};

const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status, scheduledDate, duration, location, notes, feedback, rating, interviewerId } = req.body;
    
    const interview = await prisma.interview.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(status && { status }),
        ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }),
        ...(duration !== undefined && { duration }),
        ...(location !== undefined && { location }),
        ...(notes !== undefined && { notes }),
        ...(feedback !== undefined && { feedback }),
        ...(rating !== undefined && { rating }),
        ...(interviewerId !== undefined && { interviewerId })
      },
      include: {
        application: {
          include: {
            candidate: true,
            vacancy: true
          }
        }
      }
    });
    
    res.json(interview);
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ error: error.message || 'Failed to update interview' });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.interview.delete({
      where: { id }
    });
    
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete interview' });
  }
};

// Onboarding Controllers
const createOnboarding = async (req, res) => {
  try {
    const { employeeId, startDate, tasks, mentorId } = req.body;
    
    const onboarding = await prisma.onboarding.create({
      data: {
        employeeId,
        startDate: new Date(startDate),
        tasks,
        mentorId
      },
      include: {
        employee: true
      }
    });
    
    res.status(201).json(onboarding);
  } catch (error) {
    console.error('Create onboarding error:', error);
    res.status(500).json({ error: error.message || 'Failed to create onboarding' });
  }
};

const getOnboardings = async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    const where = {};
    
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;
    
    const onboardings = await prisma.onboarding.findMany({
      where,
      include: {
        employee: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(onboardings);
  } catch (error) {
    console.error('Get onboardings error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch onboardings' });
  }
};

const updateOnboarding = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, endDate, tasks, completedTasks, mentorId } = req.body;
    
    const onboarding = await prisma.onboarding.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(tasks && { tasks }),
        ...(completedTasks !== undefined && { completedTasks }),
        ...(mentorId !== undefined && { mentorId })
      },
      include: {
        employee: true
      }
    });
    
    res.json(onboarding);
  } catch (error) {
    console.error('Update onboarding error:', error);
    res.status(500).json({ error: error.message || 'Failed to update onboarding' });
  }
};

const deleteOnboarding = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.onboarding.delete({
      where: { id }
    });
    
    res.json({ message: 'Onboarding deleted successfully' });
  } catch (error) {
    console.error('Delete onboarding error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete onboarding' });
  }
};

module.exports = {
  // Vacancies
  createVacancy,
  getVacancies,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
  // Candidates
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  // Applications
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  // Interviews
  createInterview,
  getInterviews,
  updateInterview,
  deleteInterview,
  // Onboarding
  createOnboarding,
  getOnboardings,
  updateOnboarding,
  deleteOnboarding
};
