-- ============================================
-- ENTERPRISE SECURITY SUITE - PART 2: SAML SSO & SCIM
-- ============================================

-- SSO Providers (SAML/OIDC)
CREATE TABLE IF NOT EXISTS sso_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  provider_type VARCHAR(50) NOT NULL, -- ENTRA_ID, GOOGLE_WORKSPACE, OKTA, ONELOGIN, CUSTOM_SAML, OIDC
  status VARCHAR(20) DEFAULT 'ACTIVE',
  
  -- SAML Configuration
  sso_url VARCHAR(500), -- IdP SSO URL
  slo_url VARCHAR(500), -- IdP SLO URL
  issuer VARCHAR(255), -- Entity ID
  certificate TEXT, -- IdP signing certificate
  private_key TEXT, -- SP private key (encrypted)
  sp_certificate TEXT, -- SP certificate
  
  -- OIDC Configuration (for Google, etc.)
  client_id VARCHAR(255),
  client_secret TEXT, -- Encrypted
  discovery_url VARCHAR(500),
  authorization_endpoint VARCHAR(500),
  token_endpoint VARCHAR(500),
  userinfo_endpoint VARCHAR(500),
  jwks_uri VARCHAR(500),
  
  -- Attribute Mapping
  attribute_mapping JSONB DEFAULT '{}', -- e.g., {"email": "http://schemas.../emailaddress", "name": "http://schemas.../name"}
  
  -- Settings
  is_default BOOLEAN DEFAULT FALSE,
  auto_provision BOOLEAN DEFAULT TRUE,
  auto_provision_role VARCHAR(50) DEFAULT 'EMPLOYEE',
  allowed_domains VARCHAR(255)[], -- e.g., ['company.com']
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- SSO Sessions
CREATE TABLE IF NOT EXISTS sso_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
  saml_request_id VARCHAR(255),
  saml_response_id VARCHAR(255),
  name_id VARCHAR(255),
  session_index VARCHAR(255),
  attributes JSONB DEFAULT '{}',
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  terminated_at TIMESTAMPTZ
);

-- SCIM Service Provider Configuration
CREATE TABLE IF NOT EXISTS scim_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  base_url VARCHAR(255) DEFAULT '/scim/v2',
  bearer_token TEXT, -- Encrypted API token for SCIM client
  token_expires_at TIMESTAMPTZ,
  
  -- SCIM Features
  support_patch BOOLEAN DEFAULT TRUE,
  support_bulk BOOLEAN DEFAULT TRUE,
  support_filter BOOLEAN DEFAULT TRUE,
  support_sorting BOOLEAN DEFAULT TRUE,
  support_etag BOOLEAN DEFAULT TRUE,
  
  -- Attribute mapping for provisioning
  user_schema JSONB DEFAULT '{}',
  group_schema JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- SCIM Sync Log
CREATE TABLE IF NOT EXISTS scim_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  scim_config_id UUID NOT NULL REFERENCES scim_configurations(id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- FULL, DELTA, USER_CREATE, USER_UPDATE, USER_DELETE, GROUP_SYNC
  direction VARCHAR(20) NOT NULL, -- INBOUND, OUTBOUND
  status VARCHAR(20) NOT NULL,
  records_processed INT DEFAULT 0,
  records_created INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_deleted INT DEFAULT 0,
  records_error INT DEFAULT 0,
  error_details JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INT
);

-- SCIM External ID Mappings (for tracking external identities)
CREATE TABLE IF NOT EXISTS scim_external_ids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  internal_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL,
  source_provider VARCHAR(100) NOT NULL, -- entra, google, okta, etc.
  external_user_principal VARCHAR(255), -- UPN for the user in external system
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  synced_attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, external_id, source_provider)
);

-- SSO Identity Provider (Identity Federation)
CREATE TABLE IF NOT EXISTS identity_federations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  friendly_name VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255) NOT NULL,
  metadata_url VARCHAR(500),
  metadata_xml TEXT,
  last_metadata_refresh TIMESTAMPTZ,
  
  -- Security settings
  want_assertions_signed BOOLEAN DEFAULT TRUE,
  want_response_signed BOOLEAN DEFAULT TRUE,
  signature_algorithm VARCHAR(50) DEFAULT 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAML Key Rotation Log
CREATE TABLE IF NOT EXISTS saml_key_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
  key_type VARCHAR(50) NOT NULL, -- SIGNING, ENCRYPTION
  old_key_ref VARCHAR(100),
  new_key_ref VARCHAR(100),
  rotated_at TIMESTAMPTZ DEFAULT NOW(),
  rotated_by UUID REFERENCES profiles(id),
  reason TEXT
);

-- OIDC Token Store
CREATE TABLE IF NOT EXISTS oidc_token_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES sso_providers(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMPTZ,
  scope VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sso_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sso_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scim_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scim_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scim_external_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saml_key_rotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE oidc_token_store ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sso_providers
CREATE POLICY "select_sso_providers_tenant" ON sso_providers FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_sso_providers_admin" ON sso_providers FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_sso_providers_admin" ON sso_providers FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "delete_sso_providers_admin" ON sso_providers FOR DELETE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for sso_sessions
CREATE POLICY "select_sso_sessions_tenant" ON sso_sessions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_sso_sessions_auth" ON sso_sessions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- RLS Policies for scim_configurations
CREATE POLICY "select_scim_config_tenant" ON scim_configurations FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_scim_config_admin" ON scim_configurations FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_scim_config_admin" ON scim_configurations FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for scim_sync_logs
CREATE POLICY "select_scim_logs_tenant" ON scim_sync_logs FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_scim_logs_system" ON scim_sync_logs FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- RLS Policies for scim_external_ids
CREATE POLICY "select_scim_ids_tenant" ON scim_external_ids FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_scim_ids_system" ON scim_external_ids FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_scim_ids_system" ON scim_external_ids FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for identity_federations
CREATE POLICY "select_federations_tenant" ON identity_federations FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_federations_admin" ON identity_federations FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_federations_admin" ON identity_federations FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for saml_key_rotations
CREATE POLICY "select_key_rotations_tenant" ON saml_key_rotations FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

-- RLS Policies for oidc_token_store
CREATE POLICY "select_own_oidc_tokens" ON oidc_token_store FOR SELECT TO authenticated 
  USING (user_id = auth.uid());
CREATE POLICY "insert_oidc_tokens_auth" ON oidc_token_store FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own_oidc_tokens" ON oidc_token_store FOR UPDATE TO authenticated 
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_sso_providers_org ON sso_providers(organization_id);
CREATE INDEX idx_sso_sessions_user ON sso_sessions(user_id);
CREATE INDEX idx_scim_config_org ON scim_configurations(organization_id);
CREATE INDEX idx_scim_sync_logs_config ON scim_sync_logs(scim_config_id);
CREATE INDEX idx_scim_external_ids_user ON scim_external_ids(internal_user_id);
CREATE INDEX idx_oidc_tokens_user ON oidc_token_store(user_id);