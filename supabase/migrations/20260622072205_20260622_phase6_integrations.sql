-- ============================================
-- PHASE 6: INTEGRATIONS FRAMEWORK
-- ============================================

-- Integration providers
CREATE TABLE IF NOT EXISTS integration_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- PAYMENT, HRIS, BIOMETRIC, COMMUNICATION, IDENTITY, ACCOUNTING
  logo_url TEXT,
  description TEXT,
  auth_type VARCHAR(50) NOT NULL, -- OAUTH2, API_KEY, BASIC, SAML, NONE
  auth_config JSONB DEFAULT '{}', -- Fields needed for auth
  api_base_url VARCHAR(255),
  webhook_url VARCHAR(255),
  supports_webhooks BOOLEAN DEFAULT FALSE,
  supports_sync BOOLEAN DEFAULT FALSE,
  supports_polling BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common providers
INSERT INTO integration_providers (name, code, category, auth_type, is_active) VALUES
('M-Pesa', 'MPESA', 'PAYMENT', 'API_KEY', TRUE),
('Airtel Money', 'AIRTEL', 'PAYMENT', 'API_KEY', TRUE),
('Zoho People', 'ZOHO_PEOPLE', 'HRIS', 'OAUTH2', TRUE),
('BambooHR', 'BAMBOOHR', 'HRIS', 'OAUTH2', TRUE),
('Microsoft Teams', 'TEAMS', 'COMMUNICATION', 'OAUTH2', TRUE),
('Slack', 'SLACK', 'COMMUNICATION', 'OAUTH2', TRUE),
('Google Workspace', 'GOOGLE', 'COMMUNICATION', 'OAUTH2', TRUE),
('Microsoft Outlook', 'OUTLOOK', 'COMMUNICATION', 'OAUTH2', TRUE),
('SAML 2.0', 'SAML', 'IDENTITY', 'SAML', TRUE),
('Active Directory', 'AD', 'IDENTITY', 'BASIC', TRUE),
('QuickBooks', 'QUICKBOOKS', 'ACCOUNTING', 'OAUTH2', TRUE),
('Xero', 'XERO', 'ACCOUNTING', 'OAUTH2', TRUE),
('Sage', 'SAGE', 'ACCOUNTING', 'OAUTH2', TRUE),
('Suprema', 'SUPREMA', 'BIOMETRIC', 'API_KEY', TRUE),
('ZKTeco', 'ZKTECO', 'BIOMETRIC', 'API_KEY', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Organization integrations
CREATE TABLE IF NOT EXISTS organization_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES integration_providers(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  config JSONB DEFAULT '{}', -- Provider-specific config
  credentials_encrypted TEXT, -- Encrypted credentials
  sync_frequency VARCHAR(20) DEFAULT 'MANUAL', -- MANUAL, HOURLY, DAILY, REAL_TIME
  last_sync_at TIMESTAMPTZ,
  last_sync_status VARCHAR(20),
  last_sync_error TEXT,
  sync_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, provider_id, name)
);

-- Integration sync logs
CREATE TABLE IF NOT EXISTS integration_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_integration_id UUID NOT NULL REFERENCES organization_integrations(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- FULL, PARTIAL, DELTA
  direction VARCHAR(20) NOT NULL, -- INBOUND, OUTBOUND
  status VARCHAR(20) NOT NULL,
  records_processed INT DEFAULT 0,
  records_success INT DEFAULT 0,
  records_failed INT DEFAULT 0,
  error_details JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biometric devices
CREATE TABLE IF NOT EXISTS biometric_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) UNIQUE,
  device_type VARCHAR(50) NOT NULL, -- FINGERPRINT, FACIAL, CARD, MIXED
  provider VARCHAR(50) NOT NULL,
  ip_address VARCHAR(45),
  port INT,
  api_key VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ACTIVE',
  last_sync_at TIMESTAMPTZ,
  last_sync_status VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Biometric templates (enrolled fingers/faces)
CREATE TABLE IF NOT EXISTS biometric_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES biometric_devices(id) ON DELETE CASCADE,
  template_type VARCHAR(20) NOT NULL, -- FINGER, FACE, IRIS
  template_index INT DEFAULT 0,
  template_data BYTEA,
  quality_score INT,
  is_active BOOLEAN DEFAULT TRUE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, device_id, template_type, template_index)
);

-- Payment configurations
CREATE TABLE IF NOT EXISTS payment_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- MPESA, AIRTEL, BANK
  config JSONB DEFAULT '{}',
  credentials_encrypted TEXT,
  callback_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  configuration_id UUID REFERENCES payment_configurations(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL, -- SALARY, LOAN, ALLOWANCE, REFUND
  reference_number VARCHAR(100),
  external_transaction_id VARCHAR(100),
  recipient_id UUID NOT NULL REFERENCES employees(id),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  phone VARCHAR(50),
  account_number VARCHAR(100),
  status VARCHAR(20) DEFAULT 'PENDING',
  initiated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  failure_reason TEXT,
  retry_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook events
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  processing_error TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE integration_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_integrations_all" ON integration_providers FOR SELECT TO authenticated USING (true);

CREATE POLICY "select_org_integrations_tenant" ON organization_integrations FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_org_integrations_admin" ON organization_integrations FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_org_integrations_admin" ON organization_integrations FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_sync_logs_tenant" ON integration_sync_logs FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM organization_integrations WHERE organization_integrations.id = integration_sync_logs.organization_integration_id 
    AND organization_integrations.organization_id = current_organization_id()));

CREATE POLICY "select_biometric_devices_tenant" ON biometric_devices FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_biometric_devices_admin" ON biometric_devices FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_biometric_devices_admin" ON biometric_devices FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_biometric_templates_tenant" ON biometric_templates FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_biometric_templates_admin" ON biometric_templates FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_payment_configs_tenant" ON payment_configurations FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_payment_configs_admin" ON payment_configurations FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_payment_trans_tenant" ON payment_transactions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_payment_trans_admin" ON payment_transactions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_payment_trans_admin" ON payment_transactions FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_webhook_events_tenant" ON webhook_events FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_webhook_events_admin" ON webhook_events FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_webhook_events_admin" ON webhook_events FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_integrations_org ON organization_integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_integration ON integration_sync_logs(organization_integration_id);
CREATE INDEX IF NOT EXISTS idx_biometric_devices_org ON biometric_devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_biometric_templates_employee ON biometric_templates(employee_id);
CREATE INDEX IF NOT EXISTS idx_payment_trans_org ON payment_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_org ON webhook_events(organization_id);