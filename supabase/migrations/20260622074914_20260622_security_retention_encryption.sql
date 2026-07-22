-- ============================================
-- ENTERPRISE SECURITY SUITE - PART 4: DATA RETENTION & ENCRYPTION
-- ============================================

-- Data Retention Policies
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  data_category VARCHAR(50) NOT NULL,
  retention_days INT NOT NULL DEFAULT 2555,
  retention_trigger VARCHAR(50) DEFAULT 'LAST_MODIFIED',
  archive_after_days INT,
  archive_storage VARCHAR(50) DEFAULT 'COLD',
  hard_delete_enabled BOOLEAN DEFAULT FALSE,
  anonymize_instead VARCHAR(20),
  notify_before_days INT[] DEFAULT ARRAY[30, 60, 90],
  notify_recipients VARCHAR(50)[],
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, data_category)
);

-- Data Archival Log
CREATE TABLE IF NOT EXISTS data_archival_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  policy_id UUID REFERENCES data_retention_policies(id) ON DELETE SET NULL,
  data_category VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_ids UUID[] NOT NULL,
  action VARCHAR(20) NOT NULL,
  records_affected INT NOT NULL,
  archive_location VARCHAR(255),
  archive_reference VARCHAR(255),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  performed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Encrypted Fields Registry
CREATE TABLE IF NOT EXISTS encrypted_fields_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  table_name VARCHAR(100) NOT NULL,
  column_name VARCHAR(100) NOT NULL,
  encryption_type VARCHAR(20) NOT NULL DEFAULT 'AES256_GCM',
  key_version INT DEFAULT 1,
  is_encrypted BOOLEAN DEFAULT TRUE,
  encrypted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, table_name, column_name)
);

-- Encryption Keys (metadata only)
CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  key_id VARCHAR(100) UNIQUE NOT NULL,
  key_type VARCHAR(20) NOT NULL,
  algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  key_size INT DEFAULT 256,
  version INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  rotated_from UUID REFERENCES encryption_keys(id)
);

-- Key Rotation Log
CREATE TABLE IF NOT EXISTS key_rotation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  old_key_id UUID REFERENCES encryption_keys(id),
  new_key_id UUID REFERENCES encryption_keys(id),
  entity_type VARCHAR(50),
  records_rotated INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL,
  error_details JSONB,
  initiated_by UUID REFERENCES profiles(id)
);

-- Sensitive Data Classification
CREATE TABLE IF NOT EXISTS sensitive_data_classification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  table_name VARCHAR(100) NOT NULL,
  column_name VARCHAR(100) NOT NULL,
  sensitivity_level VARCHAR(20) NOT NULL,
  data_type VARCHAR(50),
  requires_encryption BOOLEAN DEFAULT FALSE,
  requires_masking BOOLEAN DEFAULT FALSE,
  requires_audit BOOLEAN DEFAULT FALSE,
  access_roles VARCHAR(50)[],
  masking_rule VARCHAR(100),
  compliance_tags VARCHAR(50)[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, table_name, column_name)
);

-- Data Access Requests (GDPR)
CREATE TABLE IF NOT EXISTS data_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  request_type VARCHAR(50) NOT NULL,
  requested_by UUID NOT NULL REFERENCES employees(id),
  request_details TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  exported_data_url TEXT,
  export_format VARCHAR(20),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Processing Activities (GDPR)
CREATE TABLE IF NOT EXISTS data_processing_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  activity_name VARCHAR(255) NOT NULL,
  activity_description TEXT,
  purpose VARCHAR(255) NOT NULL,
  legal_basis VARCHAR(50) NOT NULL,
  data_categories VARCHAR(50)[],
  data_subjects VARCHAR(50)[],
  recipients VARCHAR(255)[],
  transfers_outside_eec BOOLEAN DEFAULT FALSE,
  transfer_destinations VARCHAR(50)[],
  retention_period VARCHAR(100),
  automated_decision_making BOOLEAN DEFAULT FALSE,
  dpo_contact VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Privacy Consent Records
CREATE TABLE IF NOT EXISTS privacy_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL,
  subject_type VARCHAR(20) DEFAULT 'EMPLOYEE',
  consent_type VARCHAR(50) NOT NULL,
  consent_status VARCHAR(20) NOT NULL,
  granted_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,
  consent_text TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breach Notification Log
CREATE TABLE IF NOT EXISTS breach_notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  breach_name VARCHAR(255) NOT NULL,
  breach_type VARCHAR(50) NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  reported_at TIMESTAMPTZ,
  authority_reported_at TIMESTAMPTZ,
  affected_records INT DEFAULT 0,
  affected_data_categories VARCHAR(50)[],
  severity VARCHAR(20) DEFAULT 'MEDIUM',
  containment_at TIMESTAMPTZ,
  containment_steps TEXT,
  remediation_steps TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_archival_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE encrypted_fields_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_rotation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensitive_data_classification ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_processing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE breach_notification_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_retention_policies_tenant" ON data_retention_policies FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_retention_policies_admin" ON data_retention_policies FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_retention_policies_admin" ON data_retention_policies FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_archival_log_tenant" ON data_archival_log FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_encrypted_fields_tenant" ON encrypted_fields_registry FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_encryption_keys_tenant" ON encryption_keys FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_key_rotation_tenant" ON key_rotation_log FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_data_classification_tenant" ON sensitive_data_classification FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_data_classification_admin" ON sensitive_data_classification FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_access_requests_tenant" ON data_access_requests FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_access_requests_own" ON data_access_requests FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_access_requests_admin" ON data_access_requests FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_processing_activities_tenant" ON data_processing_activities FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_processing_activities_admin" ON data_processing_activities FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_privacy_consents_tenant" ON privacy_consents FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_breach_log_admin" ON breach_notification_log FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_breach_log_admin" ON breach_notification_log FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- Insert default sensitive data classifications
INSERT INTO sensitive_data_classification (organization_id, table_name, column_name, sensitivity_level, data_type, requires_encryption, requires_masking, masking_rule, compliance_tags)
SELECT id, 'employees', 'national_id', 'CONFIDENTIAL', 'PII', TRUE, TRUE, 'SHOW_LAST_4', ARRAY['GDPR', 'KENYA_DATA_PROTECTION']
FROM organizations LIMIT 10;

INSERT INTO sensitive_data_classification (organization_id, table_name, column_name, sensitivity_level, data_type, requires_encryption, requires_masking, masking_rule, compliance_tags)
SELECT id, 'employees', 'basic_salary', 'CONFIDENTIAL', 'FINANCIAL', TRUE, FALSE, NULL, ARRAY['GDPR']
FROM organizations LIMIT 10;

INSERT INTO sensitive_data_classification (organization_id, table_name, column_name, sensitivity_level, data_type, requires_encryption, requires_masking, masking_rule, compliance_tags)
SELECT id, 'payslips', 'net_pay', 'CONFIDENTIAL', 'FINANCIAL', TRUE, FALSE, NULL, ARRAY['PCI_DSS']
FROM organizations LIMIT 10;

-- Indexes
CREATE INDEX idx_retention_policies_org ON data_retention_policies(organization_id);
CREATE INDEX idx_archival_log_org ON data_archival_log(organization_id);
CREATE INDEX idx_encrypted_fields_org ON encrypted_fields_registry(organization_id);
CREATE INDEX idx_encryption_keys_org ON encryption_keys(organization_id);
CREATE INDEX idx_data_classification_org ON sensitive_data_classification(organization_id);
CREATE INDEX idx_access_requests_org ON data_access_requests(organization_id);
CREATE INDEX idx_processing_activities_org ON data_processing_activities(organization_id);
CREATE INDEX idx_privacy_consents_org ON privacy_consents(organization_id);
CREATE INDEX idx_breach_log_org ON breach_notification_log(organization_id);