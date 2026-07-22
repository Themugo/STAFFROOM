const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// OKR Management
const createGoal = async (req, res) => {
  try {
    const { companyId, type, title, description, period, startDate, endDate, weight, ownerId, ownerType, alignment, metrics } = req.body;

    const goal = await prisma.goal.create({
      data: {
        companyId,
        type,
        title,
        description,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weight: weight || 1.0,
        ownerId,
        ownerType,
        alignment,
        metrics
      }
    });

    res.json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: error.message || 'Failed to create goal' });
  }
};

const getGoals = async (req, res) => {
  try {
    const { companyId, type, status, period, ownerId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (period) where.period = period;
    if (ownerId) where.ownerId = ownerId;

    const goals = await prisma.goal.findMany({
      where,
      include: {
        keyResults: true,
        parentGoal: {
          select: {
            id: true,
            title: true,
            type: true
          }
        },
        subGoals: {
          select: {
            id: true,
            title: true,
            type: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch goals' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, progress, weight, alignment, metrics } = req.body;

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        title,
        description,
        status,
        progress,
        weight,
        alignment,
        metrics
      }
    });

    res.json(goal);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: error.message || 'Failed to update goal' });
  }
};

const createKeyResult = async (req, res) => {
  try {
    const { goalId, type, title, description, targetValue, unit, startDate, dueDate, weight, confidence } = req.body;

    const keyResult = await prisma.keyResult.create({
      data: {
        goalId,
        type,
        title,
        description,
        targetValue,
        currentValue: 0,
        unit,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        weight: weight || 1.0,
        confidence,
        progress: 0
      }
    });

    res.json(keyResult);
  } catch (error) {
    console.error('Create key result error:', error);
    res.status(500).json({ error: error.message || 'Failed to create key result' });
  }
};

const updateKeyResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentValue, status, confidence } = req.body;

    // Calculate progress based on current value vs target
    const keyResult = await prisma.keyResult.findUnique({ where: { id } });
    let progress = 0;
    if (keyResult.targetValue && currentValue !== null) {
      progress = Math.min(100, (currentValue / keyResult.targetValue) * 100);
    }

    const updated = await prisma.keyResult.update({
      where: { id },
      data: {
        currentValue,
        status,
        confidence,
        progress
      }
    });

    // Update parent goal progress
    const goal = await prisma.goal.findUnique({
      where: { id: keyResult.goalId },
      include: { keyResults: true }
    });

    if (goal && goal.keyResults.length > 0) {
      const totalProgress = goal.keyResults.reduce((sum, kr) => sum + (kr.progress || 0) * (kr.weight || 1), 0);
      const totalWeight = goal.keyResults.reduce((sum, kr) => sum + (kr.weight || 1), 0);
      const avgProgress = totalProgress / totalWeight;

      await prisma.goal.update({
        where: { id: goal.id },
        data: { progress: avgProgress }
      });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update key result error:', error);
    res.status(500).json({ error: error.message || 'Failed to update key result' });
  }
};

// Feedback Management
const createFeedback = async (req, res) => {
  try {
    const { companyId, goalId, fromEmployeeId, toEmployeeId, type, direction, subject, content, rating, tags, isAnonymous, isPublic } = req.body;

    const feedback = await prisma.feedback.create({
      data: {
        companyId,
        goalId,
        fromEmployeeId,
        toEmployeeId,
        type,
        direction,
        subject,
        content,
        rating,
        tags,
        isAnonymous: isAnonymous || false,
        isPublic: isPublic || false
      }
    });

    res.json(feedback);
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ error: error.message || 'Failed to create feedback' });
  }
};

const getFeedback = async (req, res) => {
  try {
    const { companyId, toEmployeeId, fromEmployeeId, type, goalId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (toEmployeeId) where.toEmployeeId = toEmployeeId;
    if (fromEmployeeId) where.fromEmployeeId = fromEmployeeId;
    if (type) where.type = type;
    if (goalId) where.goalId = goalId;

    const feedbacks = await prisma.feedback.findMany({
      where,
      include: {
        fromEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        toEmployee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        goal: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(feedbacks);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch feedback' });
  }
};

const acknowledgeFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.feedback.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date()
      }
    });

    res.json(feedback);
  } catch (error) {
    console.error('Acknowledge feedback error:', error);
    res.status(500).json({ error: error.message || 'Failed to acknowledge feedback' });
  }
};

// Appraisal Management
const createAppraisal = async (req, res) => {
  try {
    const { companyId, employeeId, reviewCycleId, period, startDate, endDate } = req.body;

    const appraisal = await prisma.appraisal.create({
      data: {
        companyId,
        employeeId,
        reviewCycleId,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });

    res.json(appraisal);
  } catch (error) {
    console.error('Create appraisal error:', error);
    res.status(500).json({ error: error.message || 'Failed to create appraisal' });
  }
};

const getAppraisals = async (req, res) => {
  try {
    const { companyId, employeeId, reviewCycleId, status, period } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (reviewCycleId) where.reviewCycleId = reviewCycleId;
    if (status) where.status = status;
    if (period) where.period = period;

    const appraisals = await prisma.appraisal.findMany({
      where,
      include: {
        employee: {
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
        reviewCycle: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(appraisals);
  } catch (error) {
    console.error('Get appraisals error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch appraisals' });
  }
};

const updateAppraisal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, selfRating, managerRating, finalRating, strengths, improvements, achievements, goals, comments } = req.body;

    const appraisal = await prisma.appraisal.update({
      where: { id },
      data: {
        status,
        selfRating,
        managerRating,
        finalRating,
        strengths,
        improvements,
        achievements,
        goals,
        comments
      }
    });

    res.json(appraisal);
  } catch (error) {
    console.error('Update appraisal error:', error);
    res.status(500).json({ error: error.message || 'Failed to update appraisal' });
  }
};

const approveAppraisal = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    const appraisal = await prisma.appraisal.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        approvedBy,
        approvedAt: new Date()
      }
    });

    res.json(appraisal);
  } catch (error) {
    console.error('Approve appraisal error:', error);
    res.status(500).json({ error: error.message || 'Failed to approve appraisal' });
  }
};

// 360 Review Management
const createReviewCycle = async (req, res) => {
  try {
    const { companyId, name, description, type, period, startDate, endDate, participants, reviewers, template } = req.body;

    const reviewCycle = await prisma.reviewCycle.create({
      data: {
        companyId,
        name,
        description,
        type,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        participants,
        reviewers,
        template
      }
    });

    res.json(reviewCycle);
  } catch (error) {
    console.error('Create review cycle error:', error);
    res.status(500).json({ error: error.message || 'Failed to create review cycle' });
  }
};

const getReviewCycles = async (req, res) => {
  try {
    const { companyId, status, period, type } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (status) where.status = status;
    if (period) where.period = period;
    if (type) where.type = type;

    const reviewCycles = await prisma.reviewCycle.findMany({
      where,
      include: {
        appraisals: {
          select: {
            id: true,
            employeeId: true,
            status: true
          }
        },
        _count: {
          select: { responses: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviewCycles);
  } catch (error) {
    console.error('Get review cycles error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch review cycles' });
  }
};

const submitReviewResponse = async (req, res) => {
  try {
    const { reviewCycleId, reviewerId, subjectId, answers, rating, comments } = req.body;

    const response = await prisma.reviewResponse.create({
      data: {
        reviewCycleId,
        reviewerId,
        subjectId,
        answers,
        rating,
        comments,
        submitted: true,
        submittedAt: new Date()
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Submit review response error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit review response' });
  }
};

const getReviewResponses = async (req, res) => {
  try {
    const { reviewCycleId, reviewerId, subjectId } = req.query;
    const where = {};

    if (reviewCycleId) where.reviewCycleId = reviewCycleId;
    if (reviewerId) where.reviewerId = reviewerId;
    if (subjectId) where.subjectId = subjectId;

    const responses = await prisma.reviewResponse.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(responses);
  } catch (error) {
    console.error('Get review responses error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch review responses' });
  }
};

// Promotion Recommendations
const createPromotionRecommendation = async (req, res) => {
  try {
    const { companyId, employeeId, currentPosition, recommendedPosition, recommendedLevel, effectiveDate, justification, achievements, skills, performance, salaryIncrease, benefits, recommendedBy } = req.body;

    const promotion = await prisma.promotionRecommendation.create({
      data: {
        companyId,
        employeeId,
        currentPosition,
        recommendedPosition,
        recommendedLevel,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        justification,
        achievements,
        skills,
        performance,
        salaryIncrease,
        benefits,
        recommendedBy
      }
    });

    res.json(promotion);
  } catch (error) {
    console.error('Create promotion recommendation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create promotion recommendation' });
  }
};

const getPromotionRecommendations = async (req, res) => {
  try {
    const { companyId, employeeId, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;

    const promotions = await prisma.promotionRecommendation.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            department: {
              select: { name: true }
            },
            position: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(promotions);
  } catch (error) {
    console.error('Get promotion recommendations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch promotion recommendations' });
  }
};

const updatePromotionRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy, approvedBy } = req.body;

    const updateData = { status };
    if (reviewedBy) updateData.reviewedBy = reviewedBy;
    if (reviewedBy) updateData.reviewedAt = new Date();
    if (approvedBy) updateData.approvedBy = approvedBy;
    if (approvedBy) updateData.approvedAt = new Date();

    const promotion = await prisma.promotionRecommendation.update({
      where: { id },
      data: updateData
    });

    res.json(promotion);
  } catch (error) {
    console.error('Update promotion recommendation error:', error);
    res.status(500).json({ error: error.message || 'Failed to update promotion recommendation' });
  }
};

// Performance Dashboard Summary
const getPerformanceSummary = async (req, res) => {
  try {
    const { companyId, period } = req.query;

    // Get goal progress by type
    const goalsByType = await prisma.goal.groupBy({
      by: ['type', 'status'],
      where: { companyId, period },
      _count: true,
      _avg: { progress: true }
    });

    // Get feedback summary
    const feedbackSummary = await prisma.feedback.groupBy({
      by: ['type'],
      where: { companyId },
      _count: true,
      _avg: { rating: true }
    });

    // Get appraisal summary
    const appraisalSummary = await prisma.appraisal.groupBy({
      by: ['status'],
      where: { companyId, period },
      _count: true,
      _avg: { finalRating: true }
    });

    // Get pending promotions
    const pendingPromotions = await prisma.promotionRecommendation.count({
      where: { companyId, status: 'RECOMMENDED' }
    });

    res.json({
      goalsByType,
      feedbackSummary,
      appraisalSummary,
      pendingPromotions
    });
  } catch (error) {
    console.error('Get performance summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch performance summary' });
  }
};

module.exports = {
  // OKR Management
  createGoal,
  getGoals,
  updateGoal,
  createKeyResult,
  updateKeyResult,
  // Feedback Management
  createFeedback,
  getFeedback,
  acknowledgeFeedback,
  // Appraisal Management
  createAppraisal,
  getAppraisals,
  updateAppraisal,
  approveAppraisal,
  // 360 Review Management
  createReviewCycle,
  getReviewCycles,
  submitReviewResponse,
  getReviewResponses,
  // Promotion Recommendations
  createPromotionRecommendation,
  getPromotionRecommendations,
  updatePromotionRecommendation,
  // Dashboard
  getPerformanceSummary
};
