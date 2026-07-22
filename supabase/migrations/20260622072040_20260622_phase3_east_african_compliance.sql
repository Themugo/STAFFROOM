-- ============================================
-- PHASE 3: EAST AFRICAN COMPLIANCE ENGINE
-- ============================================

-- Countries
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  currency_code VARCHAR(3) REFERENCES currencies(code),
  dial_code VARCHAR(10),
  tax_authority_name VARCHAR(255),
  tax_year_start_month INT DEFAULT 1,
  is_eac BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert East African countries
INSERT INTO countries (code, name, currency_code, dial_code, tax_authority_name, is_eac) VALUES
('KE', 'Kenya', 'KES', '+254', 'Kenya Revenue Authority', TRUE),
('UG', 'Uganda', 'UGX', '+256', 'Uganda Revenue Authority', TRUE),
('TZ', 'Tanzania', 'TZS', '+255', 'Tanzania Revenue Authority', TRUE),
('RW', 'Rwanda', 'RWF', '+250', 'Rwanda Revenue Authority', TRUE),
('BI', 'Burundi', 'BIF', '+257', 'Burundi Revenue Authority', TRUE),
('SS', 'South Sudan', 'SSP', '+211', 'National Revenue Authority', TRUE)
ON CONFLICT (code) DO NOTHING;

-- Tax jurisdictions
CREATE TABLE IF NOT EXISTS tax_jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
  name VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  tax_registration_number VARCHAR(100),
  effective_date DATE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, country_code)
);

-- Tax rule categories
CREATE TABLE IF NOT EXISTS tax_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  country_code VARCHAR(3) REFERENCES countries(code),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tax categories
INSERT INTO tax_categories (code, name, description, country_code) VALUES
('PAYE', 'Pay As You Earn', 'Income tax deducted from employment income', NULL),
('NSSF', 'National Social Security Fund', 'Social security contribution', NULL),
('NHIF', 'National Hospital Insurance Fund', 'Health insurance contribution', 'KE'),
('SHIF', 'Social Health Insurance Fund', 'SHA contribution', 'KE'),
('HOUSING_LEVY', 'Housing Levy', 'Affordable housing levy', 'KE')
ON CONFLICT (code) DO NOTHING;

-- Tax rules
CREATE TABLE IF NOT EXISTS tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
  category_id UUID NOT NULL REFERENCES tax_categories(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  calculation_type VARCHAR(20) NOT NULL,
  employee_share DECIMAL(10,4) DEFAULT 0,
  employer_share DECIMAL(10,4) DEFAULT 0,
  ceiling_amount DECIMAL(12,2),
  floor_amount DECIMAL(12,2),
  tiers JSONB DEFAULT '[]',
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NSSF Tiers
CREATE TABLE IF NOT EXISTS nssf_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
  tier INT NOT NULL,
  pensionable_low DECIMAL(12,2) NOT NULL,
  pensionable_high DECIMAL(12,2) NOT NULL,
  employee_rate DECIMAL(10,4) NOT NULL,
  employer_rate DECIMAL(10,4) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Insurance rates
CREATE TABLE IF NOT EXISTS health_insurance_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
  scheme_type VARCHAR(20) NOT NULL,
  min_salary DECIMAL(12,2) NOT NULL,
  max_salary DECIMAL(12,2),
  contribution DECIMAL(12,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deduction types
CREATE TABLE IF NOT EXISTS deduction_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  calculation_type VARCHAR(20) DEFAULT 'FIXED',
  amount DECIMAL(12,2),
  percentage DECIMAL(10,4),
  is_pre_tax BOOLEAN DEFAULT FALSE,
  is_statutory BOOLEAN DEFAULT FALSE,
  has_employer_contribution BOOLEAN DEFAULT FALSE,
  employer_amount DECIMAL(12,2),
  employer_percentage DECIMAL(10,4),
  priority INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Allowance types
CREATE TABLE IF NOT EXISTS allowance_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  calculation_type VARCHAR(20) DEFAULT 'FIXED',
  amount DECIMAL(12,2),
  percentage DECIMAL(10,4),
  is_taxable BOOLEAN DEFAULT TRUE,
  is_pensionable BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Benefits
CREATE TABLE IF NOT EXISTS benefit_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  category VARCHAR(50),
  monthly_value DECIMAL(12,2),
  is_taxable BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE nssf_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_insurance_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE deduction_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_countries_all" ON countries FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_tax_jurisdictions_tenant" ON tax_jurisdictions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_tax_jurisdictions_admin" ON tax_jurisdictions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "select_tax_categories_all" ON tax_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_tax_rules_tenant" ON tax_rules FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id() OR organization_id IS NULL);
CREATE POLICY "select_nssf_tiers_all" ON nssf_tiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_health_rates_all" ON health_insurance_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_deduction_types_tenant" ON deduction_types FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_deduction_types_admin" ON deduction_types FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "select_allowance_types_tenant" ON allowance_types FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_allowance_types_admin" ON allowance_types FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "select_benefit_types_tenant" ON benefit_types FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_benefit_types_admin" ON benefit_types FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- Insert Kenya NSSF Tier rates
INSERT INTO nssf_tiers (country_code, tier, pensionable_low, pensionable_high, employee_rate, employer_rate, effective_from)
VALUES 
('KE', 1, 0, 7000, 6.0, 6.0, '2024-02-01'),
('KE', 2, 7001, 20000, 6.0, 6.0, '2024-02-01');

-- Insert Kenya SHIF rates 2024
INSERT INTO health_insurance_rates (country_code, scheme_type, min_salary, max_salary, contribution, effective_from)
VALUES 
('KE', 'SHIF', 0, 2999, 300, '2024-11-01'),
('KE', 'SHIF', 3000, 4999, 400, '2024-11-01'),
('KE', 'SHIF', 5000, 7999, 500, '2024-11-01'),
('KE', 'SHIF', 8000, 11999, 600, '2024-11-01'),
('KE', 'SHIF', 12000, 19999, 750, '2024-11-01'),
('KE', 'SHIF', 20000, 29999, 900, '2024-11-01'),
('KE', 'SHIF', 30000, 49999, 1200, '2024-11-01'),
('KE', 'SHIF', 50000, NULL, 1700, '2024-11-01');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tax_jurisdictions_org ON tax_jurisdictions(organization_id);
CREATE INDEX IF NOT EXISTS idx_tax_rules_country ON tax_rules(country_code);
CREATE INDEX IF NOT EXISTS idx_nssf_tiers_country ON nssf_tiers(country_code);
CREATE INDEX IF NOT EXISTS idx_health_rates_country ON health_insurance_rates(country_code);