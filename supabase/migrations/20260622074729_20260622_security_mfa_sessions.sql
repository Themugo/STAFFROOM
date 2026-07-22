-- ============================================
-- ENTERPRISE SECURITY SUITE - PART 1: MFA & SESSIONS
-- ============================================

-- MFA Settings (organization-level)
CREATE TABLE IF NOT EXISTS mfa_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  mfa_required BOOLEAN DEFAULT FALSE,
  mfa_required_for_roles VARCHAR(50)[] DEFAULT '{}',
  allowed_mfa_methods VARCHAR(20)[] DEFAULT ARRAY['TOTP'],
  totp_issuer VARCHAR(100) DEFAULT 'StaffRoom',
  recovery_codes_count INT DEFAULT 8,
  remember_device_days INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id)
);

-- User MFA Secrets
CREATE TABLE IF NOT EXISTS user_mfa_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  method VARCHAR(20) NOT NULL DEFAULT 'TOTP',
  secret TEXT NOT NULL,
  backup_email VARCHAR(255),
  backup_phone VARCHAR(50),
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, method)
);

-- Recovery Codes
CREATE TABLE IF NOT EXISTS recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code_hash VARCHAR(255) NOT NULL,
  code_hint VARCHAR(10),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- MFA Challenges
CREATE TABLE IF NOT EXISTS mfa_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_token VARCHAR(255) UNIQUE NOT NULL,
  method VARCHAR(20) NOT NULL,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trusted Devices
CREATE TABLE IF NOT EXISTS trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(255) NOT NULL,
  device_name VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  trusted_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id, device_fingerprint)
);

-- User Sessions (extended tracking)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  device_fingerprint VARCHAR(255),
  device_name VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  ip_address VARCHAR(45),
  geo_country VARCHAR(2),
  geo_city VARCHAR(100),
  user_agent TEXT,
  is_mfa_verified BOOLEAN DEFAULT FALSE,
  is_suspicious BOOLEAN DEFAULT FALSE,
  suspicious_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ,
  terminated_reason VARCHAR(100)
);

-- Login History
CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  login_type VARCHAR(50) NOT NULL,
  sso_provider VARCHAR(50),
  ip_address VARCHAR(45),
  geo_country VARCHAR(2),
  geo_city VARCHAR(100),
  device_fingerprint VARCHAR(255),
  device_name VARCHAR(100),
  browser VARCHAR(50),
  os VARCHAR(50),
  user_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  failure_reason TEXT,
  mfa_used BOOLEAN DEFAULT FALSE,
  mfa_method VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suspicious Activity Detection
CREATE TABLE IF NOT EXISTS suspicious_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'MEDIUM',
  details JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  geo_country VARCHAR(2),
  device_fingerprint VARCHAR(255),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  action_taken VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device Fingerprints Cache
CREATE TABLE IF NOT EXISTS device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  fingerprint_hash VARCHAR(255) UNIQUE NOT NULL,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  seen_count INT DEFAULT 1,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  blocked_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for MFA settings
CREATE POLICY "select_mfa_settings_tenant" ON mfa_settings FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_mfa_settings_admin" ON mfa_settings FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_mfa_settings_admin" ON mfa_settings FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for user_mfa_secrets
CREATE POLICY "select_own_mfa_secrets" ON user_mfa_secrets FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "insert_own_mfa_secrets" ON user_mfa_secrets FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_mfa_secrets" ON user_mfa_secrets FOR UPDATE TO authenticated 
  USING (user_id = auth.uid());

-- RLS Policies for recovery_codes
CREATE POLICY "select_own_recovery_codes" ON recovery_codes FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "insert_own_recovery_codes" ON recovery_codes FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_recovery_codes" ON recovery_codes FOR UPDATE TO authenticated 
  USING (user_id = auth.uid());

-- RLS Policies for mfa_challenges
CREATE POLICY "select_own_mfa_challenges" ON mfa_challenges FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "insert_own_mfa_challenges" ON mfa_challenges FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for trusted_devices
CREATE POLICY "select_own_trusted_devices" ON trusted_devices FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "insert_own_trusted_devices" ON trusted_devices FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete_own_trusted_devices" ON trusted_devices FOR DELETE TO authenticated 
  USING (user_id = auth.uid());

-- RLS Policies for user_sessions
CREATE POLICY "select_own_sessions" ON user_sessions FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR organization_id = current_organization_id());
CREATE POLICY "insert_sessions_auth" ON user_sessions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_own_sessions" ON user_sessions FOR UPDATE TO authenticated 
  USING (user_id = auth.uid() OR organization_id = current_organization_id());

-- RLS Policies for login_history
CREATE POLICY "select_login_history_tenant" ON login_history FOR SELECT TO authenticated 
  USING (user_id = auth.uid() OR organization_id = current_organization_id());

-- RLS Policies for suspicious_activities
CREATE POLICY "select_suspicious_tenant" ON suspicious_activities FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_suspicious_system" ON suspicious_activities FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_suspicious_admin" ON suspicious_activities FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for device_fingerprints
CREATE POLICY "select_fingerprints_tenant" ON device_fingerprints FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_fingerprints_tenant" ON device_fingerprints FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- Indexes
CREATE INDEX idx_mfa_settings_org ON mfa_settings(organization_id);
CREATE INDEX idx_mfa_secrets_user ON user_mfa_secrets(user_id);
CREATE INDEX idx_recovery_codes_user ON recovery_codes(user_id);
CREATE INDEX idx_mfa_challenges_user ON mfa_challenges(user_id);
CREATE INDEX idx_trusted_devices_user ON trusted_devices(user_id);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_created ON login_history(created_at DESC);
CREATE INDEX idx_suspicious_org ON suspicious_activities(organization_id);
CREATE INDEX idx_suspicious_created ON suspicious_activities(created_at DESC);