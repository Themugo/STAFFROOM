const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Enterprise SaaS Architecture
const updateWhiteLabelConfig = async (req, res) => {
  try {
    const { companyId, logoUrl, faviconUrl, primaryColor, secondaryColor, customDomain, customEmail, brandingName, brandingTagline, cssOverrides, customScripts } = req.body;

    const config = await prisma.whiteLabelConfig.upsert({
      where: { companyId },
      update: {
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        customDomain,
        customEmail,
        brandingName,
        brandingTagline,
        cssOverrides,
        customScripts
      },
      create: {
        companyId,
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        customDomain,
        customEmail,
        brandingName,
        brandingTagline,
        cssOverrides,
        customScripts
      }
    });

    res.json(config);
  } catch (error) {
    console.error('Update white label config error:', error);
    res.status(500).json({ error: error.message || 'Failed to update white label config' });
  }
};

const getWhiteLabelConfig = async (req, res) => {
  try {
    const { companyId } = req.query;

    const config = await prisma.whiteLabelConfig.findUnique({
      where: { companyId }
    });

    res.json(config);
  } catch (error) {
    console.error('Get white label config error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch white label config' });
  }
};

const updateSSOConfig = async (req, res) => {
  try {
    const { companyId, provider, enabled, metadataUrl, certUrl, entityId, config } = req.body;

    const ssoConfig = await prisma.sSOConfig.upsert({
      where: { companyId },
      update: {
        provider,
        enabled,
        metadataUrl,
        certUrl,
        entityId,
        config
      },
      create: {
        companyId,
        provider,
        enabled,
        metadataUrl,
        certUrl,
        entityId,
        config
      }
    });

    res.json(ssoConfig);
  } catch (error) {
    console.error('Update SSO config error:', error);
    res.status(500).json({ error: error.message || 'Failed to update SSO config' });
  }
};

const getSSOConfig = async (req, res) => {
  try {
    const { companyId } = req.query;

    const ssoConfig = await prisma.sSOConfig.findUnique({
      where: { companyId }
    });

    res.json(ssoConfig);
  } catch (error) {
    console.error('Get SSO config error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch SSO config' });
  }
};

const updateSCIMConfig = async (req, res) => {
  try {
    const { companyId, accessToken, tokenUrl, baseUrl, config } = req.body;

    const scimConfig = await prisma.sCIMConfig.upsert({
      where: { companyId },
      update: {
        accessToken,
        tokenUrl,
        baseUrl,
        config,
        status: 'ACTIVE'
      },
      create: {
        companyId,
        accessToken,
        tokenUrl,
        baseUrl,
        config,
        status: 'ACTIVE'
      }
    });

    res.json(scimConfig);
  } catch (error) {
    console.error('Update SCIM config error:', error);
    res.status(500).json({ error: error.message || 'Failed to update SCIM config' });
  }
};

const getSCIMConfig = async (req, res) => {
  try {
    const { companyId } = req.query;

    const scimConfig = await prisma.sCIMConfig.findUnique({
      where: { companyId }
    });

    res.json(scimConfig);
  } catch (error) {
    console.error('Get SCIM config error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch SCIM config' });
  }
};

const createApiKey = async (req, res) => {
  try {
    const { companyId, createdBy, name, description, permissions, rateLimit, expiresAt } = req.body;

    // Generate API key
    const key = `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        companyId,
        createdBy,
        name,
        description,
        key,
        permissions,
        rateLimit,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.json(apiKey);
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: error.message || 'Failed to create API key' });
  }
};

const getApiKeys = async (req, res) => {
  try {
    const { companyId, status } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (status) where.status = status;

    const apiKeys = await prisma.apiKey.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Don't return full key in list
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: `${key.keyPrefix}${key.key.substring(3, 7)}****`
    }));

    res.json(maskedKeys);
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch API keys' });
  }
};

const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' }
    });

    res.json(apiKey);
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: error.message || 'Failed to revoke API key' });
  }
};

const getCurrencies = async (req, res) => {
  try {
    const { isActive } = req.query;
    const where = {};

    if (isActive !== undefined) where.isActive = isActive === 'true';

    const currencies = await prisma.currency.findMany({
      where,
      orderBy: { code: 'asc' }
    });

    res.json(currencies);
  } catch (error) {
    console.error('Get currencies error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch currencies' });
  }
};

// StaffRoom Ecosystem
const createPlugin = async (req, res) => {
  try {
    const { name, description, version, category, developerId, developerName, logoUrl, screenshots, pricing, features, documentationUrl, supportUrl } = req.body;

    const plugin = await prisma.plugin.create({
      data: {
        name,
        description,
        version,
        category,
        developerId,
        developerName,
        logoUrl,
        screenshots,
        pricing,
        features,
        documentationUrl,
        supportUrl,
        status: 'DRAFT'
      }
    });

    res.json(plugin);
  } catch (error) {
    console.error('Create plugin error:', error);
    res.status(500).json({ error: error.message || 'Failed to create plugin' });
  }
};

const getPlugins = async (req, res) => {
  try {
    const { category, status, developerId } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (developerId) where.developerId = developerId;

    const plugins = await prisma.plugin.findMany({
      where,
      include: {
        _count: {
          select: { installations: true, reviews: true }
        }
      },
      orderBy: { installCount: 'desc' }
    });

    res.json(plugins);
  } catch (error) {
    console.error('Get plugins error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch plugins' });
  }
};

const installPlugin = async (req, res) => {
  try {
    const { pluginId, companyId, config, expiresAt } = req.body;

    const installation = await prisma.pluginInstallation.upsert({
      where: {
        pluginId_companyId: {
          pluginId,
          companyId
        }
      },
      update: {
        config,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isEnabled: true
      },
      create: {
        pluginId,
        companyId,
        config,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    // Update plugin install count
    await prisma.plugin.update({
      where: { id: pluginId },
      data: { installCount: { increment: 1 } }
    });

    res.json(installation);
  } catch (error) {
    console.error('Install plugin error:', error);
    res.status(500).json({ error: error.message || 'Failed to install plugin' });
  }
};

const getPluginInstallations = async (req, res) => {
  try {
    const { companyId, pluginId } = req.query;
    const where = {};

    if (companyId) where.companyId = companyId;
    if (pluginId) where.pluginId = pluginId;

    const installations = await prisma.pluginInstallation.findMany({
      where,
      include: {
        plugin: {
          select: {
            id: true,
            name: true,
            version: true,
            category: true
          }
        }
      },
      orderBy: { installedAt: 'desc' }
    });

    res.json(installations);
  } catch (error) {
    console.error('Get plugin installations error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch plugin installations' });
  }
};

const createPluginReview = async (req, res) => {
  try {
    const { pluginId, companyId, rating, title, content } = req.body;

    const review = await prisma.pluginReview.upsert({
      where: {
        pluginId_companyId: {
          pluginId,
          companyId
        }
      },
      update: {
        rating,
        title,
        content
      },
      create: {
        pluginId,
        companyId,
        rating,
        title,
        content
      }
    });

    // Update plugin rating and review count
    const reviews = await prisma.pluginReview.findMany({
      where: { pluginId }
    });

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.plugin.update({
      where: { id: pluginId },
      data: {
        rating: avgRating,
        reviewCount: reviews.length
      }
    });

    res.json(review);
  } catch (error) {
    console.error('Create plugin review error:', error);
    res.status(500).json({ error: error.message || 'Failed to create plugin review' });
  }
};

const getPluginReviews = async (req, res) => {
  try {
    const { pluginId } = req.query;
    const where = {};

    if (pluginId) where.pluginId = pluginId;

    const reviews = await prisma.pluginReview.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get plugin reviews error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch plugin reviews' });
  }
};

// Enterprise Dashboard Summary
const getEnterpriseSummary = async (req, res) => {
  try {
    const { companyId } = req.query;

    // Get white label config
    const whiteLabelConfig = await prisma.whiteLabelConfig.findUnique({
      where: { companyId }
    });

    // Get SSO config
    const ssoConfig = await prisma.sSOConfig.findUnique({
      where: { companyId }
    });

    // Get SCIM config
    const scimConfig = await prisma.sCIMConfig.findUnique({
      where: { companyId }
    });

    // Get API keys count
    const activeApiKeys = await prisma.apiKey.count({
      where: { companyId, status: 'ACTIVE' }
    });

    // Get plugin installations
    const pluginInstallations = await prisma.pluginInstallation.count({
      where: { companyId, isEnabled: true }
    });

    // Get installed plugins
    const installedPlugins = await prisma.pluginInstallation.findMany({
      where: { companyId, isEnabled: true },
      include: {
        plugin: {
          select: {
            id: true,
            name: true,
            category: true,
            version: true
          }
        }
      }
    });

    res.json({
      whiteLabelConfig,
      ssoConfig,
      scimConfig,
      apiKeys: {
        active: activeApiKeys
      },
      plugins: {
        installed: pluginInstallations,
        details: installedPlugins
      }
    });
  } catch (error) {
    console.error('Get enterprise summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch enterprise summary' });
  }
};

module.exports = {
  // Enterprise SaaS Architecture
  updateWhiteLabelConfig,
  getWhiteLabelConfig,
  updateSSOConfig,
  getSSOConfig,
  updateSCIMConfig,
  getSCIMConfig,
  createApiKey,
  getApiKeys,
  revokeApiKey,
  getCurrencies,
  // StaffRoom Ecosystem
  createPlugin,
  getPlugins,
  installPlugin,
  getPluginInstallations,
  createPluginReview,
  getPluginReviews,
  // Dashboard
  getEnterpriseSummary
};
