const express = require('express');
const router = express.Router();
const lmsController = require('../controllers/lmsController');
const { authenticate, authorize } = require('../middleware/auth');

// Course Management
router.post('/courses', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createCourse);
router.get('/courses', authenticate, lmsController.getCourses);
router.put('/courses/:id', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.updateCourse);

router.post('/courses/modules', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createCourseModule);
router.post('/courses/lessons', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createLesson);

// Enrollment Management
router.post('/enrollments', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'EMPLOYEE']), lmsController.enrollEmployee);
router.get('/enrollments', authenticate, lmsController.getEnrollments);
router.put('/enrollments/:id', authenticate, lmsController.updateEnrollmentProgress);
router.post('/lesson-progress', authenticate, lmsController.updateLessonProgress);

// Learning Path Management
router.post('/learning-paths', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createLearningPath);
router.get('/learning-paths', authenticate, lmsController.getLearningPaths);
router.post('/learning-paths/courses', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.addCourseToLearningPath);
router.post('/learning-paths/enroll', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'EMPLOYEE']), lmsController.enrollInLearningPath);

// Certification Management
router.post('/certifications', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createCertification);
router.get('/certifications', authenticate, lmsController.getCertifications);

// Assessment Management
router.post('/assessments', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createAssessment);
router.post('/assessments/attempts', authenticate, lmsController.submitAssessmentAttempt);

// Skill Management
router.post('/skills', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), lmsController.createSkill);
router.get('/skills', authenticate, lmsController.getSkills);
router.post('/employee-skills', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER', 'EMPLOYEE']), lmsController.addEmployeeSkill);
router.get('/employee-skills', authenticate, lmsController.getEmployeeSkills);

// LMS Dashboard
router.get('/summary', authenticate, lmsController.getLMSSummary);

module.exports = router;
