const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Refresh Token Management
const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const createRefreshToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const expiresInDays = 30; // 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    
    const token = generateRefreshToken();
    
    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
    
    res.status(201).json({
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt
    });
  } catch (error) {
    console.error('Create refresh token error:', error);
    res.status(500).json({ error: error.message || 'Failed to create refresh token' });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });
    
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    if (tokenRecord.revokedAt) {
      return res.status(401).json({ error: 'Refresh token has been revoked' });
    }
    
    if (new Date() > tokenRecord.expiresAt) {
      return res.status(401).json({ error: 'Refresh token has expired' });
    }
    
    if (!tokenRecord.user.isActive) {
      return res.status(401).json({ error: 'User account is inactive' });
    }
    
    // Generate new access token (this would use your JWT logic)
    const newAccessToken = generateAccessToken(tokenRecord.user);
    
    // Optionally rotate refresh token
    const newRefreshToken = generateRefreshToken();
    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh access token error:', error);
    res.status(500).json({ error: error.message || 'Failed to refresh access token' });
  }
};

const revokeRefreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user.id;
    
    await prisma.refreshToken.updateMany({
      where: {
        token: refreshToken,
        userId
      },
      data: {
        revokedAt: new Date()
      }
    });
    
    res.json({ message: 'Refresh token revoked successfully' });
  } catch (error) {
    console.error('Revoke refresh token error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke refresh token' });
  }
};

const revokeAllRefreshTokens = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: {
        revokedAt: new Date()
      }
    });
    
    res.json({ message: 'All refresh tokens revoked successfully' });
  } catch (error) {
    console.error('Revoke all refresh tokens error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke all refresh tokens' });
  }
};

// MFA Management
const setupMFA = async (req, res) => {
  try {
    const { type, phoneNumber, email } = req.body;
    const userId = req.user.id;
    
    // Generate secret for TOTP
    const secret = crypto.randomBytes(32).toString('base32');
    
    // Generate backup codes
    const backupCodes = Array.from({ length: 10 }, () => 
      crypto.randomBytes(4).toString('hex').toUpperCase()
    );
    
    const mfa = await prisma.multiFactorAuth.create({
      data: {
        userId,
        type,
        secret,
        phoneNumber,
        email,
        status: 'PENDING_SETUP',
        backupCodes
      }
    });
    
    res.status(201).json({
      id: mfa.id,
      type: mfa.type,
      secret: mfa.secret,
      backupCodes,
      qrCode: generateQRCode(mfa.secret) // Would integrate with a QR code library
    });
  } catch (error) {
    console.error('Setup MFA error:', error);
    res.status(500).json({ error: error.message || 'Failed to setup MFA' });
  }
};

const verifyMFA = async (req, res) => {
  try {
    const { code, mfaId } = req.body;
    const userId = req.user.id;
    
    const mfa = await prisma.multiFactorAuth.findUnique({
      where: { id: mfaId }
    });
    
    if (!mfa || mfa.userId !== userId) {
      return res.status(404).json({ error: 'MFA configuration not found' });
    }
    
    // Verify TOTP code (would use speakeasy or similar library)
    const isValid = verifyTOTPCode(mfa.secret, code);
    
    if (!isValid) {
      // Check backup codes
      const backupCodes = mfa.backupCodes || [];
      if (!backupCodes.includes(code)) {
        return res.status(400).json({ error: 'Invalid MFA code' });
      }
      
      // Remove used backup code
      const updatedBackupCodes = backupCodes.filter(c => c !== code);
      await prisma.multiFactorAuth.update({
        where: { id: mfaId },
        data: { backupCodes: updatedBackupCodes }
      });
    }
    
    // Enable MFA
    await prisma.multiFactorAuth.update({
      where: { id: mfaId },
      data: { status: 'ENABLED' }
    });
    
    res.json({ message: 'MFA verified and enabled successfully' });
  } catch (error) {
    console.error('Verify MFA error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify MFA' });
  }
};

const disableMFA = async (req, res) => {
  try {
    const { mfaId } = req.params;
    const userId = req.user.id;
    
    await prisma.multiFactorAuth.updateMany({
      where: {
        id: mfaId,
        userId
      },
      data: { status: 'DISABLED' }
    });
    
    res.json({ message: 'MFA disabled successfully' });
  } catch (error) {
    console.error('Disable MFA error:', error);
    res.status(500).json({ error: error.message || 'Failed to disable MFA' });
  }
};

const getMFAStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const mfa = await prisma.multiFactorAuth.findUnique({
      where: { userId }
    });
    
    if (!mfa) {
      return res.json({ enabled: false });
    }
    
    res.json({
      enabled: mfa.status === 'ENABLED',
      type: mfa.type,
      status: mfa.status
    });
  } catch (error) {
    console.error('Get MFA status error:', error);
    res.status(500).json({ error: error.message || 'Failed to get MFA status' });
  }
};

// Helper functions (would be implemented with actual libraries)
function generateAccessToken(user) {
  // This would use jsonwebtoken or similar
  return 'jwt_token_placeholder';
}

function generateQRCode(secret) {
  // This would use qrcode library
  return `otpauth://totp/StaffRoom:${user.email}?secret=${secret}&issuer=StaffRoom`;
}

function verifyTOTPCode(secret, code) {
  // This would use speakeasy or similar TOTP library
  return code === '123456'; // Placeholder
}

module.exports = {
  // Refresh Tokens
  createRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  // MFA
  setupMFA,
  verifyMFA,
  disableMFA,
  getMFAStatus
};
