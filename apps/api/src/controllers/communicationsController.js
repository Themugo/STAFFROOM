const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Announcements
const createAnnouncement = async (req, res) => {
  try {
    const { companyId, type, priority, title, content, imageUrl, targetAudience, publishedAt, expiresAt, authorId, attachments, tags } = req.body;

    const announcement = await prisma.announcement.create({
      data: {
        companyId,
        type,
        priority,
        title,
        content,
        imageUrl,
        targetAudience,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId,
        attachments,
        tags
      }
    });

    res.json(announcement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: error.message || 'Failed to create announcement' });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { companyId, type, priority, employeeId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        _count: {
          select: { reads: true }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    // If employeeId provided, mark as read
    if (employeeId) {
      await Promise.all(
        announcements.map(async (announcement) => {
          await prisma.announcementRead.upsert({
            where: {
              announcementId_employeeId: {
                announcementId: announcement.id,
                employeeId
              }
            },
            update: {},
            create: {
              announcementId: announcement.id,
              employeeId
            }
          });
        })
      );
    }

    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch announcements' });
  }
};

// Chat
const createChat = async (req, res) => {
  try {
    const { companyId, type, name, description, createdBy, departmentId, isPublic, imageUrl } = req.body;

    const chat = await prisma.chat.create({
      data: {
        companyId,
        type,
        name,
        description,
        createdBy,
        departmentId,
        isPublic,
        imageUrl
      }
    });

    // Add creator as participant
    await prisma.chatParticipant.create({
      data: {
        chatId: chat.id,
        employeeId: createdBy
      }
    });

    res.json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to create chat' });
  }
};

const getChats = async (req, res) => {
  try {
    const { companyId, type, status, departmentId, employeeId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;

    const chats = await prisma.chat.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        },
        participants: {
          include: {
            select: {
              employeeId: true
            }
          }
        },
        _count: {
          select: { messages: true, participants: true }
        }
      },
      orderBy: { lastMessageAt: 'desc' }
    });

    // Filter chats where employee is participant if employeeId provided
    let filteredChats = chats;
    if (employeeId) {
      filteredChats = chats.filter(chat => 
        chat.isPublic || chat.participants.some(p => p.employeeId === employeeId)
      );
    }

    res.json(filteredChats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch chats' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, content, type, replyToId } = req.body;

    const message = await prisma.chatMessage.create({
      data: {
        chatId,
        senderId,
        content,
        type,
        replyToId
      }
    });

    // Update chat last message time
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() }
    });

    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId, senderId } = req.query;
    const where = {};

    if (chatId) where.chatId = chatId;
    if (senderId) where.senderId = senderId;

    const messages = await prisma.chatMessage.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch messages' });
  }
};

// Events
const createEvent = async (req, res) => {
  try {
    const { companyId, type, title, description, imageUrl, startDate, endDate, location, isVirtual, virtualLink, maxCapacity, departmentId, organizerId } = req.body;

    const event = await prisma.event.create({
      data: {
        companyId,
        type,
        title,
        description,
        imageUrl,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        isVirtual,
        virtualLink,
        maxCapacity,
        departmentId,
        organizerId
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message || 'Failed to create event' });
  }
};

const getEvents = async (req, res) => {
  try {
    const { companyId, type, status, departmentId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (departmentId) where.departmentId = departmentId;

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        department: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch events' });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { eventId, employeeId, notes } = req.body;

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        employeeId,
        notes
      }
    });

    res.json(registration);
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ error: error.message || 'Failed to register for event' });
  }
};

// Surveys
const createSurvey = async (req, res) => {
  try {
    const { companyId, type, title, description, startDate, endDate, anonymous, allowMultiple, questions, targetAudience, createdBy } = req.body;

    const survey = await prisma.survey.create({
      data: {
        companyId,
        type,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        anonymous,
        allowMultiple,
        questions,
        targetAudience,
        createdBy
      }
    });

    res.json(survey);
  } catch (error) {
    console.error('Create survey error:', error);
    res.status(500).json({ error: error.message || 'Failed to create survey' });
  }
};

const getSurveys = async (req, res) => {
  try {
    const { companyId, type, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;

    const surveys = await prisma.survey.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(surveys);
  } catch (error) {
    console.error('Get surveys error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch surveys' });
  }
};

const submitSurveyResponse = async (req, res) => {
  try {
    const { surveyId, employeeId, answers } = req.body;

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
        employeeId,
        answers
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Submit survey response error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit survey response' });
  }
};

// Recognition
const createRecognition = async (req, res) => {
  try {
    const { companyId, type, title, description, recipientId, giverId, imageUrl, tags } = req.body;

    const recognition = await prisma.recognition.create({
      data: {
        companyId,
        type,
        title,
        description,
        recipientId,
        giverId,
        imageUrl,
        tags
      }
    });

    res.json(recognition);
  } catch (error) {
    console.error('Create recognition error:', error);
    res.status(500).json({ error: error.message || 'Failed to create recognition' });
  }
};

const getRecognitions = async (req, res) => {
  try {
    const { companyId, type, recipientId, giverId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (recipientId) where.recipientId = recipientId;
    if (giverId) where.giverId = giverId;

    const recognitions = await prisma.recognition.findMany({
      where,
      include: {
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            department: {
              select: { name: true }
            }
          }
        },
        giver: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(recognitions);
  } catch (error) {
    console.error('Get recognitions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch recognitions' });
  }
};

// Corporate Hub Summary
const getCorporateHubSummary = async (req, res) => {
  try {
    const { companyId, employeeId } = req.query;

    // Get unread announcements
    const unreadAnnouncements = await prisma.announcement.count({
      where: {
        companyId,
        reads: {
          none: { employeeId }
        }
      }
    });

    // Get active chats
    const activeChats = await prisma.chat.count({
      where: { companyId, status: 'ACTIVE' }
    });

    // Get upcoming events
    const upcomingEvents = await prisma.event.count({
      where: {
        companyId,
        status: 'PUBLISHED',
        startDate: {
          gte: new Date()
        }
      }
    });

    // Get active surveys
    const activeSurveys = await prisma.survey.count({
      where: {
        companyId,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      }
    });

    // Get recent recognitions
    const recentRecognitions = await prisma.recognition.count({
      where: {
        companyId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });

    // If employeeId provided, get employee-specific data
    let employeeData = null;
    if (employeeId) {
      const userChats = await prisma.chat.findMany({
        where: {
          companyId,
          participants: {
            some: { employeeId }
          }
        },
        include: {
          _count: {
            select: { messages: true }
          }
        }
      });

      const userEvents = await prisma.eventRegistration.findMany({
        where: { employeeId },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startDate: true
            }
          }
        }
      });

      const userRecognitions = await prisma.recognition.findMany({
        where: { recipientId: employeeId },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      employeeData = {
        chats: userChats,
        events: userEvents,
        recognitions: userRecognitions
      };
    }

    res.json({
      announcements: {
        unread: unreadAnnouncements
      },
      chats: {
        active: activeChats
      },
      events: {
        upcoming: upcomingEvents
      },
      surveys: {
        active: activeSurveys
      },
      recognitions: {
        recent: recentRecognitions
      },
      employeeData
    });
  } catch (error) {
    console.error('Get corporate hub summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch corporate hub summary' });
  }
};

module.exports = {
  // Announcements
  createAnnouncement,
  getAnnouncements,
  // Chat
  createChat,
  getChats,
  sendMessage,
  getMessages,
  // Events
  createEvent,
  getEvents,
  registerForEvent,
  // Surveys
  createSurvey,
  getSurveys,
  submitSurveyResponse,
  // Recognition
  createRecognition,
  getRecognitions,
  // Dashboard
  getCorporateHubSummary
};
