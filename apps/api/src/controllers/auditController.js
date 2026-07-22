const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Login History
const getLoginHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;
    
    const loginHistory = await prisma.loginHistory.findMany({
      where: { userId },
      orderBy: { loginTime: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });
    
    res.json(loginHistory);
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch login history' });
  }
};

const recordLogin = async (userId, status, ipAddress, userAgent, location = null, failureReason = null) => {
  try {
    await prisma.loginHistory.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        deviceType: extractDeviceType(userAgent),
        browser: extractBrowser(userAgent),
        os: extractOS(userAgent),
        status,
        failureReason,
        location
      }
    });
  } catch (error) {
    console.error('Record login error:', error);
  }
};

// Device Sessions
const getDeviceSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await prisma.deviceSession.findMany({
      where: { userId },
      orderBy: { lastActive: 'desc' }
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get device sessions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch device sessions' });
  }
};

const createDeviceSession = async (userId, deviceName, deviceFingerprint, ipAddress, userAgent) => {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
    
    const session = await prisma.deviceSession.create({
      data: {
        userId,
        deviceName,
        deviceType: extractDeviceType(userAgent),
        deviceFingerprint,
        ipAddress,
        userAgent,
        expiresAt
      }
    });
    
    return session;
  } catch (error) {
    console.error('Create device session error:', error);
  }
};

const revokeDeviceSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    await prisma.deviceSession.updateMany({
      where: {
        id: sessionId,
        userId
      },
      data: {
        status: 'REVOKED'
      }
    });
    
    res.json({ message: 'Device session revoked successfully' });
  } catch (error) {
    console.error('Revoke device session error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke device session' });
  }
};

const revokeAllDeviceSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await prisma.deviceSession.updateMany({
      where: { userId },
      data: {
        status: 'REVOKED'
      }
    });
    
    res.json({ message: 'All device sessions revoked successfully' });
  } catch (error) {
    console.error('Revoke all device sessions error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke all device sessions' });
  }
};

const trustDeviceSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    await prisma.deviceSession.updateMany({
      where: {
        id: sessionId,
        userId
      },
      data: {
        isTrusted: true
      }
    });
    
    res.json({ message: 'Device marked as trusted' });
  } catch (error) {
    console.error('Trust device session error:', error);
    res.status(500).json({ error: error.message || 'Failed to trust device' });
  }
};

// Audit Trail
const getAuditLogs = async (req, res) => {
  try {
    const { userId, action, entityType, severity, limit = 100, offset = 0 } = req.query;
    const where = {};
    
    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (severity) where.severity = severity;
    
    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
    
    res.json(auditLogs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch audit logs' });
  }
};

const createAuditLog = async (userId, action, entityType, entityId, description, metadata = null, ipAddress = null, userAgent = null, severity = 'INFO') => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        severity,
        entityType,
        entityId,
        description,
        metadata,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    console.error('Create audit log error:', error);
  }
};

// Permission Matrix
const getPermissions = async (req, res) => {
  try {
    const { resource, action, scope } = req.query;
    const where = {};
    
    if (resource) where.resource = resource;
    if (action) where.action = action;
    if (scope) where.scope = scope;
    
    const permissions = await prisma.permission.findMany({
      where,
      include: {
        rolePermissions: {
          include: {
            role: true
          }
        }
      }
    });
    
    res.json(permissions);
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch permissions' });
  }
};

const createPermission = async (req, res) => {
  try {
    const { name, description, resource, action, scope } = req.body;
    
    const permission = await prisma.permission.create({
      data: {
        name,
        description,
        resource,
        action,
        scope
      }
    });
    
    res.status(201).json(permission);
  } catch (error) {
    console.error('Create permission error:', error);
    res.status(500).json({ error: error.message || 'Failed to create permission' });
  }
};

const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;
    
    const rolePermission = await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    });
    
    res.status(201).json(rolePermission);
  } catch (error) {
    console.error('Assign permission to role error:', error);
    res.status(500).json({ error: error.message || 'Failed to assign permission to role' });
  }
};

const removePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;
    
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
        permissionId
      }
    });
    
    res.json({ message: 'Permission removed from role successfully' });
  } catch (error) {
    console.error('Remove permission from role error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove permission from role' });
  }
};

// Helper functions
function extractDeviceType(userAgent) {
  if (!userAgent) return 'UNKNOWN';
  
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'MOBILE';
  if (/tablet|ipad/i.test(ua)) return 'TABLET';
  return 'DESKTOP';
}

function extractBrowser(userAgent) {
  if (!userAgent) return 'UNKNOWN';
  
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edge/i.test(userAgent)) return 'Edge';
  return 'Unknown';
}

function extractOS(userAgent) {
  if (!userAgent) return 'UNKNOWN';
  
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

module.exports = {
  // Login History
  getLoginHistory,
  recordLogin,
  // Device Sessions
  getDeviceSessions,
  createDeviceSession,
  revokeDeviceSession,
  revokeAllDeviceSessions,
  trustDeviceSession,
  // Audit Trail
  getAuditLogs,
  createAuditLog,
  // Permissions
  getPermissions,
  createPermission,
  assignPermissionToRole,
  removePermissionFromRole
};
