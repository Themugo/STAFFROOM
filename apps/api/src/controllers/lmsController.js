const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Course Management
const createCourse = async (req, res) => {
  try {
    const { companyId, type, title, description, category, tags, duration, difficulty, instructorId, prerequisites, thumbnail, materials, expiresAfter } = req.body;

    const course = await prisma.course.create({
      data: {
        companyId,
        type,
        title,
        description,
        category,
        tags,
        duration,
        difficulty,
        instructorId,
        prerequisites,
        thumbnail,
        materials,
        expiresAfter
      }
    });

    res.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: error.message || 'Failed to create course' });
  }
};

const getCourses = async (req, res) => {
  try {
    const { companyId, type, status, category, instructorId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (category) where.category = category;
    if (instructorId) where.instructorId = instructorId;

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        modules: {
          include: {
            lessons: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch courses' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, category, tags, duration, difficulty, thumbnail, materials, expiresAfter } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        status,
        category,
        tags,
        duration,
        difficulty,
        thumbnail,
        materials,
        expiresAfter,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined
      }
    });

    res.json(course);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: error.message || 'Failed to update course' });
  }
};

const createCourseModule = async (req, res) => {
  try {
    const { courseId, title, description, content, duration, materials } = req.body;

    const module = await prisma.courseModule.create({
      data: {
        courseId,
        title,
        description,
        content,
        duration,
        materials
      }
    });

    res.json(module);
  } catch (error) {
    console.error('Create course module error:', error);
    res.status(500).json({ error: error.message || 'Failed to create course module' });
  }
};

const createLesson = async (req, res) => {
  try {
    const { moduleId, title, content, duration, videoUrl, materials } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        content,
        duration,
        videoUrl,
        materials
      }
    });

    res.json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: error.message || 'Failed to create lesson' });
  }
};

// Enrollment Management
const enrollEmployee = async (req, res) => {
  try {
    const { courseId, employeeId } = req.body;

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        employeeId,
        status: 'ENROLLED',
        enrolledAt: new Date()
      }
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Enroll employee error:', error);
    res.status(500).json({ error: error.message || 'Failed to enroll employee' });
  }
};

const getEnrollments = async (req, res) => {
  try {
    const { courseId, employeeId, status } = req.query;
    const where = {};

    if (courseId) where.courseId = courseId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            type: true,
            duration: true
          }
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch enrollments' });
  }
};

const updateEnrollmentProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progress, score, startedAt, completedAt } = req.body;

    const enrollment = await prisma.enrollment.update({
      where: { id },
      data: {
        status,
        progress,
        score,
        startedAt: startedAt ? new Date(startedAt) : undefined,
        completedAt: completedAt ? new Date(completedAt) : undefined
      }
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Update enrollment progress error:', error);
    res.status(500).json({ error: error.message || 'Failed to update enrollment progress' });
  }
};

const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId, employeeId, completed, timeSpent } = req.body;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        lessonId_employeeId: {
          lessonId,
          employeeId
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        timeSpent
      },
      create: {
        lessonId,
        employeeId,
        completed,
        completedAt: completed ? new Date() : null,
        timeSpent
      }
    });

    // Update overall enrollment progress
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { employeeId }
                }
              }
            }
          }
        }
      }
    });

    if (lesson && lesson.module.course.enrollments.length > 0) {
      const enrollment = lesson.module.course.enrollments[0];
      const allLessons = await prisma.lesson.findMany({
        where: {
          module: {
            courseId: lesson.module.courseId
          }
        }
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          employeeId,
          lesson: {
            module: {
              courseId: lesson.module.courseId
            }
          },
          completed: true
        }
      });

      const progress = (completedLessons / allLessons.length) * 100;

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: { progress }
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Update lesson progress error:', error);
    res.status(500).json({ error: error.message || 'Failed to update lesson progress' });
  }
};

// Learning Path Management
const createLearningPath = async (req, res) => {
  try {
    const { companyId, type, name, description, targetRole, targetSkills, targetDepartment, duration, isMandatory } = req.body;

    const learningPath = await prisma.learningPath.create({
      data: {
        companyId,
        type,
        name,
        description,
        targetRole,
        targetSkills,
        targetDepartment,
        duration,
        isMandatory
      }
    });

    res.json(learningPath);
  } catch (error) {
    console.error('Create learning path error:', error);
    res.status(500).json({ error: error.message || 'Failed to create learning path' });
  }
};

const getLearningPaths = async (req, res) => {
  try {
    const { companyId, type, targetRole, targetDepartment } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (targetRole) where.targetRole = targetRole;
    if (targetDepartment) where.targetDepartment = targetDepartment;

    const learningPaths = await prisma.learningPath.findMany({
      where,
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                type: true,
                duration: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(learningPaths);
  } catch (error) {
    console.error('Get learning paths error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch learning paths' });
  }
};

const addCourseToLearningPath = async (req, res) => {
  try {
    const { learningPathId, courseId, order, isMandatory } = req.body;

    const learningPathCourse = await prisma.learningPathCourse.create({
      data: {
        learningPathId,
        courseId,
        order,
        isMandatory
      }
    });

    res.json(learningPathCourse);
  } catch (error) {
    console.error('Add course to learning path error:', error);
    res.status(500).json({ error: error.message || 'Failed to add course to learning path' });
  }
};

const enrollInLearningPath = async (req, res) => {
  try {
    const { learningPathId, employeeId } = req.body;

    const enrollment = await prisma.learningPathEnrollment.create({
      data: {
        learningPathId,
        employeeId,
        status: 'ENROLLED',
        enrolledAt: new Date()
      }
    });

    res.json(enrollment);
  } catch (error) {
    console.error('Enroll in learning path error:', error);
    res.status(500).json({ error: error.message || 'Failed to enroll in learning path' });
  }
};

// Certification Management
const createCertification = async (req, res) => {
  try {
    const { companyId, employeeId, courseId, name, description, issuingBody, credentialId, certificateUrl, issuedDate, expiryDate, skills } = req.body;

    const certification = await prisma.certification.create({
      data: {
        companyId,
        employeeId,
        courseId,
        name,
        description,
        issuingBody,
        credentialId,
        certificateUrl,
        issuedDate: new Date(issuedDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        skills
      }
    });

    res.json(certification);
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({ error: error.message || 'Failed to create certification' });
  }
};

const getCertifications = async (req, res) => {
  try {
    const { companyId, employeeId, status, courseId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (courseId) where.courseId = courseId;

    const certifications = await prisma.certification.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        course: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { issuedDate: 'desc' }
    });

    res.json(certifications);
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch certifications' });
  }
};

// Assessment Management
const createAssessment = async (req, res) => {
  try {
    const { courseId, type, title, description, passingScore, timeLimit, attemptsAllowed, questions } = req.body;

    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        type,
        title,
        description,
        passingScore,
        timeLimit,
        attemptsAllowed,
        questions
      }
    });

    res.json(assessment);
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({ error: error.message || 'Failed to create assessment' });
  }
};

const submitAssessmentAttempt = async (req, res) => {
  try {
    const { assessmentId, employeeId, answers, timeSpent } = req.body;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });

    // Calculate score
    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / assessment.questions.length) * 100;
    const passed = score >= assessment.passingScore;

    // Get attempt number
    const existingAttempts = await prisma.assessmentAttempt.findMany({
      where: { assessmentId, employeeId }
    });

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId,
        employeeId,
        attemptNumber: existingAttempts.length + 1,
        score,
        passed,
        answers,
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent
      }
    });

    // If passed, create certification
    if (passed) {
      const course = await prisma.course.findUnique({
        where: { id: assessment.courseId }
      });

      if (course && course.type === 'CERTIFICATION') {
        await prisma.certification.create({
          data: {
            companyId: course.companyId,
            employeeId,
            courseId: course.id,
            name: course.title + ' Certification',
            description: 'Completed certification course',
            issuingBody: 'StaffRoom Academy',
            issuedDate: new Date(),
            skills: course.tags
          }
        });
      }
    }

    res.json(attempt);
  } catch (error) {
    console.error('Submit assessment attempt error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit assessment attempt' });
  }
};

// Skill Management
const createSkill = async (req, res) => {
  try {
    const { companyId, name, category, description, proficiency } = req.body;

    const skill = await prisma.skill.create({
      data: {
        companyId,
        name,
        category,
        description,
        proficiency
      }
    });

    res.json(skill);
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: error.message || 'Failed to create skill' });
  }
};

const getSkills = async (req, res) => {
  try {
    const { companyId, category } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (category) where.category = category;

    const skills = await prisma.skill.findMany({
      where,
      include: {
        _count: {
          select: { employeeSkills: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(skills);
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch skills' });
  }
};

const addEmployeeSkill = async (req, res) => {
  try {
    const { employeeId, skillId, level, yearsExperience, certified, source } = req.body;

    const employeeSkill = await prisma.employeeSkill.upsert({
      where: {
        employeeId_skillId: {
          employeeId,
          skillId
        }
      },
      update: {
        level,
        yearsExperience,
        certified,
        certifiedAt: certified ? new Date() : null,
        source
      },
      create: {
        employeeId,
        skillId,
        level,
        yearsExperience,
        certified,
        certifiedAt: certified ? new Date() : null,
        source
      }
    });

    res.json(employeeSkill);
  } catch (error) {
    console.error('Add employee skill error:', error);
    res.status(500).json({ error: error.message || 'Failed to add employee skill' });
  }
};

const getEmployeeSkills = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const where = {};

    if (employeeId) where.employeeId = employeeId;

    const employeeSkills = await prisma.employeeSkill.findMany({
      where,
      include: {
        skill: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: { level: 'desc' }
    });

    res.json(employeeSkills);
  } catch (error) {
    console.error('Get employee skills error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch employee skills' });
  }
};

// LMS Dashboard Summary
const getLMSSummary = async (req, res) => {
  try {
    const { companyId, employeeId } = req.query;

    // Get course statistics
    const totalCourses = await prisma.course.count({ where: { companyId, status: 'PUBLISHED' } });
    const complianceCourses = await prisma.course.count({ where: { companyId, type: 'COMPLIANCE', status: 'PUBLISHED' } });

    // Get enrollment statistics
    const totalEnrollments = await prisma.enrollment.count({ where: { companyId } });
    const completedEnrollments = await prisma.enrollment.count({ where: { companyId, status: 'COMPLETED' } });

    // Get certification statistics
    const activeCertifications = await prisma.certification.count({ where: { companyId, status: 'ACTIVE' } });
    const expiringCertifications = await prisma.certification.count({
      where: {
        companyId,
        status: 'ACTIVE',
        expiryDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Expiring within 30 days
        }
      }
    });

    // Get skill statistics
    const totalSkills = await prisma.skill.count({ where: { companyId } });

    // Get learning path statistics
    const totalLearningPaths = await prisma.learningPath.count({ where: { companyId } });

    // If employeeId is provided, get employee-specific data
    let employeeData = null;
    if (employeeId) {
      const employeeEnrollments = await prisma.enrollment.findMany({
        where: { employeeId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              type: true
            }
          }
        }
      });

      const employeeCertifications = await prisma.certification.findMany({
        where: { employeeId, status: 'ACTIVE' }
      });

      const employeeSkills = await prisma.employeeSkill.findMany({
        where: { employeeId },
        include: {
          skill: true
        }
      });

      employeeData = {
        enrollments: employeeEnrollments,
        certifications: employeeCertifications,
        skills: employeeSkills
      };
    }

    res.json({
      courses: {
        total: totalCourses,
        compliance: complianceCourses
      },
      enrollments: {
        total: totalEnrollments,
        completed: completedEnrollments,
        completionRate: totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
      },
      certifications: {
        active: activeCertifications,
        expiring: expiringCertifications
      },
      skills: {
        total: totalSkills
      },
      learningPaths: {
        total: totalLearningPaths
      },
      employeeData
    });
  } catch (error) {
    console.error('Get LMS summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch LMS summary' });
  }
};

module.exports = {
  // Course Management
  createCourse,
  getCourses,
  updateCourse,
  createCourseModule,
  createLesson,
  // Enrollment Management
  enrollEmployee,
  getEnrollments,
  updateEnrollmentProgress,
  updateLessonProgress,
  // Learning Path Management
  createLearningPath,
  getLearningPaths,
  addCourseToLearningPath,
  enrollInLearningPath,
  // Certification Management
  createCertification,
  getCertifications,
  // Assessment Management
  createAssessment,
  submitAssessmentAttempt,
  // Skill Management
  createSkill,
  getSkills,
  addEmployeeSkill,
  getEmployeeSkills,
  // Dashboard
  getLMSSummary
};
