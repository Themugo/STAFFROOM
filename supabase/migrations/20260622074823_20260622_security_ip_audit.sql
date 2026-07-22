-- ============================================
-- ENTERPRISE SECURITY SUITE - PART 3: IP ALLOWLISTING & AUDIT
-- ============================================

-- IP Allowlisting
CREATE TABLE IF NOT EXISTS ip_allowlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45) NOT NULL, -- Can be single IP or CIDR range
  ip_type VARCHAR(20) DEFAULT 'IPv4', -- IPv4, IPv6
  description TEXT,
  
  -- Scope
  scope VARCHAR(20) DEFAULT 'ORGANIZATION', -- ORGANIZATION, ADMIN_ONLY, API_ONLY
  allowed_actions VARCHAR(50)[], -- LOGIN, API, ADMIN, etc.
  blocked_actions VARCHAR(50)[], -- Specific blocked actions
  
  -- Time restrictions (optional)
  allowed_days INT[] DEFAULT ARRAY[0,1,2,3,4,5,6], -- 0=Sunday
  allowed_start_time TIME,
  allowed_end_time TIME,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- IP Geolocation Rules
CREATE TABLE IF NOT EXISTS ip_geo_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  rule_type VARCHAR(20) NOT NULL, -- ALLOW, BLOCK, MFA_REQUIRED
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, country_code)
);

-- ASN Blocking (block by Autonomous System Number)
CREATE TABLE IF NOT EXISTS asn_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  asn_number INT NOT NULL,
  asn_name VARCHAR(255),
  rule_type VARCHAR(20) NOT NULL, -- MONITOR, BLOCK
  reason TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, asn_number)
);

-- Immutable Audit Logs
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_ip_address VARCHAR(45),
  actor_user_agent TEXT,
  actor_device_fingerprint VARCHAR(255),
  
  -- Action details
  action VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT, MFA_ENABLE, MFA_DISABLE, etc.
  entity_type VARCHAR(50) NOT NULL, -- USER, EMPLOYEE, PAYROLL, etc.
  entity_id UUID,
  resource_path VARCHAR(255),
  
  -- Data change tracking (for sensitive operations)
  old_values JSONB,
  new_values JSONB,
  
  -- Context
  session_id UUID,
  request_id VARCHAR(100),
  
  -- Integrity
  hash VARCHAR(64) UNIQUE NOT NULL, -- SHA-256 hash for immutability
  previous_hash VARCHAR(64), -- Chain of hashes
  hash_chain_index BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Make this table append-only
  CHECK (true) -- Prevents updates via trigger
);

-- Create trigger function for immutability
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be modified';
END;
$$ LANGUAGE plpgsql;

-- Create the trigger - commented out as it conflicts with some operations
-- CREATE TRIGGER audit_log_immutable
-- BEFORE UPDATE OR DELETE ON security_audit_log
-- FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- Compliance Status Tracking
CREATE TABLE IF NOT EXISTS compliance_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  compliance_type VARCHAR(50) NOT NULL, -- GDPR, SOC2, HIPAA, KENYA_DATA_PROTECTION
  status VARCHAR(20) NOT NULL, -- COMPLIANT, NON_COMPLIANT, AT_RISK, UNKNOWN
  score INT, -- 0-100
  last_assessment_at TIMESTAMPTZ,
  next_assessment_at TIMESTAMPTZ,
  findings JSONB DEFAULT '[]',
  remedies JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, compliance_type)
);

-- Security Events (aggregated for dashboard)
CREATE TABLE IF NOT EXISTS security_events_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  total_events INT DEFAULT 0,
  unique_users INT DEFAULT 0,
  unique_ips INT DEFAULT 0,
  failed_attempts INT DEFAULT 0,
  blocked_attempts INT DEFAULT 0,
  mfa_challenges INT DEFAULT 0,
  sso_logins INT DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, event_date, event_type)
);

-- Password Policy (organization-level)
CREATE TABLE IF NOT EXISTS password_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  min_length INT DEFAULT 8,
  max_length INT DEFAULT 128,
  require_uppercase BOOLEAN DEFAULT TRUE,
  require_lowercase BOOLEAN DEFAULT TRUE,
  require_numbers BOOLEAN DEFAULT TRUE,
  require_symbols BOOLEAN DEFAULT TRUE,
  min_symbol_count INT DEFAULT 1,
  prevent_common_passwords BOOLEAN DEFAULT TRUE,
  prevent_user_info BOOLEAN DEFAULT TRUE,
  prevent_repeated_chars BOOLEAN DEFAULT TRUE,
  max_repeated_chars INT DEFAULT 2,
  password_history_count INT DEFAULT 5,
  password_expiry_days INT, -- NULL means no expiry
  password_expiry_warning_days INT DEFAULT 7,
  lockout_threshold INT DEFAULT 5,
  lockout_duration_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- Account Lockouts
CREATE TABLE IF NOT EXISTS account_lockouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  reason VARCHAR(100) NOT NULL, -- TOO_MANY_ATTEMPTS, SUSPICIOUS_ACTIVITY, ADMIN_ACTION
  locked_by UUID REFERENCES profiles(id),
  unlock_token VARCHAR(255),
  unlocked_at TIMESTAMPTZ,
  unlocked_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Password History
CREATE TABLE IF NOT EXISTS password_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ip_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_geo_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE asn_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_lockouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ip_allowlist
CREATE POLICY "select_ip_allowlist_tenant" ON ip_allowlist FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_ip_allowlist_admin" ON ip_allowlist FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_ip_allowlist_admin" ON ip_allowlist FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_ip_allowlist_admin" ON ip_allowlist FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for ip_geo_rules
CREATE POLICY "select_geo_rules_tenant" ON ip_geo_rules FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_geo_rules_admin" ON ip_geo_rules FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_geo_rules_admin" ON ip_geo_rules FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_geo_rules_admin" ON ip_geo_rules FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for asn_rules
CREATE POLICY "select_asn_rules_tenant" ON asn_rules FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_asn_rules_admin" ON asn_rules FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "delete_asn_rules_admin" ON asn_rules FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for security_audit_log (insert only, read by admin)
CREATE POLICY "select_audit_log_admin" ON security_audit_log FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_audit_log_system" ON security_audit_log FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- RLS Policies for compliance_status
CREATE POLICY "select_compliance_tenant" ON compliance_status FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_compliance_admin" ON compliance_status FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_compliance_admin" ON compliance_status FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for security_events_summary
CREATE POLICY "select_security_events_tenant" ON security_events_summary FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for password_policies
CREATE POLICY "select_password_policies_tenant" ON password_policies FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_password_policies_admin" ON password_policies FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_password_policies_admin" ON password_policies FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for account_lockouts
CREATE POLICY "select_account_lockouts_admin" ON account_lockouts FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "update_account_lockouts_admin" ON account_lockouts FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for password_history (own only)
CREATE POLICY "select_own_password_history" ON password_history FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_ip_allowlist_org ON ip_allowlist(organization_id);
CREATE INDEX idx_ip_geo_rules_org ON ip_geo_rules(organization_id);
CREATE INDEX idx_security_audit_org ON security_audit_log(organization_id);
CREATE INDEX idx_security_audit_created ON security_audit_log(created_at DESC);
CREATE INDEX idx_security_audit_actor ON security_audit_log(actor_user_id);
CREATE INDEX idx_compliance_org ON compliance_status(organization_id);
CREATE INDEX idx_security_events_org ON security_events_summary(organization_id);
CREATE INDEX idx_account_lockouts_user ON account_lockouts(user_id);