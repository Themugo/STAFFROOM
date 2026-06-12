const express = require('express');
const router = express.Router();
const communicationsController = require('../controllers/communicationsController');
const { authenticate, authorize } = require('../middleware/auth');

// Announcements
router.post('/announcements', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), communicationsController.createAnnouncement);
router.get('/announcements', authenticate, communicationsController.getAnnouncements);

// Chat
router.post('/chats', authenticate, communicationsController.createChat);
router.get('/chats', authenticate, communicationsController.getChats);
router.post('/chats/messages', authenticate, communicationsController.sendMessage);
router.get('/chats/messages', authenticate, communicationsController.getMessages);

// Events
router.post('/events', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), communicationsController.createEvent);
router.get('/events', authenticate, communicationsController.getEvents);
router.post('/events/register', authenticate, communicationsController.registerForEvent);

// Surveys
router.post('/surveys', authenticate, authorize(['SUPER_ADMIN', 'ADMIN', 'HR_MANAGER']), communicationsController.createSurvey);
router.get('/surveys', authenticate, communicationsController.getSurveys);
router.post('/surveys/responses', authenticate, communicationsController.submitSurveyResponse);

// Recognition
router.post('/recognitions', authenticate, communicationsController.createRecognition);
router.get('/recognitions', authenticate, communicationsController.getRecognitions);

// Corporate Hub
router.get('/hub/summary', authenticate, communicationsController.getCorporateHubSummary);

module.exports = router;
