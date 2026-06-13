const https = require('https');
const fs = require('fs');

/**
 * SSL/TLS configuration for production
 */
const sslConfig = {
  // Enable HTTPS in production
  enabled: process.env.NODE_ENV === 'production',
  
  // SSL certificate paths (for self-signed or custom certificates)
  key: process.env.SSL_KEY_PATH || null,
  cert: process.env.SSL_CERT_PATH || null,
  ca: process.env.SSL_CA_PATH || null,
  
  // SSL options
  options: {
    // Reject unauthorized certificates in production
    rejectUnauthorized: process.env.NODE_ENV === 'production',
    
    // Minimum TLS version
    minVersion: 'TLSv1.2',
    
    // Maximum TLS version
    maxVersion: 'TLSv1.3',
    
    // Cipher suites
    ciphers: [
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-ECDSA-CHACHA20-POLY1305',
      'ECDHE-RSA-CHACHA20-POLY1305',
    ].join(':'),
    
    // Honor cipher order
    honorCipherOrder: true,
    
    // Use session resumption
    sessionTimeout: 300000, // 5 minutes
  },
};

/**
 * Create HTTPS server options
 */
function getHttpsOptions() {
  if (!sslConfig.enabled) {
    return null;
  }

  const options = {
    ...sslConfig.options,
  };

  // Add certificate paths if provided
  if (sslConfig.key && fs.existsSync(sslConfig.key)) {
    options.key = fs.readFileSync(sslConfig.key);
  }

  if (sslConfig.cert && fs.existsSync(sslConfig.cert)) {
    options.cert = fs.readFileSync(sslConfig.cert);
  }

  if (sslConfig.ca && fs.existsSync(sslConfig.ca)) {
    options.ca = fs.readFileSync(sslConfig.ca);
  }

  return options;
}

/**
 * HSTS configuration for production
 */
const hstsConfig = {
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true,
  preload: true,
};

/**
 * Get HSTS header value
 */
function getHstsHeader() {
  if (!sslConfig.enabled) {
    return null;
  }

  const directives = [
    `max-age=${hstsConfig.maxAge}`,
  ];

  if (hstsConfig.includeSubDomains) {
    directives.push('includeSubDomains');
  }

  if (hstsConfig.preload) {
    directives.push('preload');
  }

  return `Strict-Transport-Security: ${directives.join('; ')}`;
}

module.exports = {
  sslConfig,
  getHttpsOptions,
  hstsConfig,
  getHstsHeader,
};
