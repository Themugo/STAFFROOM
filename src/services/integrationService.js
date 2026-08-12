/**
 * STAFFROOM PHASE 13 — INTEGRATION SERVICE
 * Communicates with backend Integration Center API endpoints (/api/integrations/*)
 */

export const integrationService = {
  /**
   * Get all connectors for an organization
   */
  async getConnectors(orgId = 'org_ke_hq') {
    try {
      const res = await fetch(`/api/integrations?org_id=${orgId}`);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Fetch integrations error:', err);
      return { org_id: orgId, total: 0, connectors: [] };
    }
  },

  /**
   * Update connector configuration, credentials, modules, or enabled state
   */
  async updateConnector(updateData) {
    try {
      const res = await fetch('/api/integrations/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Update connector error:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Run live diagnostic test on connector
   */
  async testConnection(integrationId, user = 'Admin') {
    try {
      const res = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: integrationId, user }),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Test connection error:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Fetch integration invocation logs & webhook queue
   */
  async getLogs(integrationId = null) {
    try {
      const url = integrationId ? `/api/integrations/logs?integration_id=${integrationId}` : '/api/integrations/logs';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Fetch integration logs error:', err);
      return { total: 0, logs: [] };
    }
  },

  /**
   * Force retry a failed integration transaction / webhook
   */
  async retryLog(logId) {
    try {
      const res = await fetch('/api/integrations/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: logId }),
      });
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Retry log error:', err);
      return { success: false, message: err.message };
    }
  },

  /**
   * Fetch integration security audit trail
   */
  async getAuditTrail() {
    try {
      const res = await fetch('/api/integrations/audit');
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Fetch audit trail error:', err);
      return { total: 0, audit_trail: [] };
    }
  },
};
