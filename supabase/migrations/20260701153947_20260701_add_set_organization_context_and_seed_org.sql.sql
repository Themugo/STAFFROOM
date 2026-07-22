-- ============================================
-- 1. set_organization_context RPC function
--    Called by the frontend OrganizationContext to set the
--    app.current_organization session variable used by RLS.
-- ============================================
CREATE OR REPLACE FUNCTION set_organization_context(org_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_organization', org_id::TEXT, TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Seed a demo organization and link ALL existing
--    seed data (departments, positions, employees, etc.)
--    to it so the multi-tenant app has a working tenant.
-- ============================================

-- Create the demo organization (idempotent)
INSERT INTO organizations (id, name, slug, country, currency, subscription_tier, subscription_status, max_employees)
VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'Acme Corporation',
  'acme-corp',
  'KE',
  'KES',
  'TRIAL',
  'ACTIVE',
  50
)
ON CONFLICT (slug) DO NOTHING;

-- Link all existing seed data to the demo organization
UPDATE departments   SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE positions     SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE employees     SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE attendance    SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE leave_requests SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE payroll_runs  SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE payslips      SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE vacancies     SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE applications  SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;
UPDATE interviews    SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001' WHERE organization_id IS NULL;

-- Link profiles to the demo organization (except SYSTEM_OWNER who is platform-level)
UPDATE profiles SET organization_id = 'aaaaaaaa-0000-0000-0000-000000000001'
  WHERE organization_id IS NULL AND role != 'SYSTEM_OWNER';

-- Create a headquarters branch for the demo org
INSERT INTO branches (organization_id, name, country, is_headquarters)
VALUES ('aaaaaaaa-0000-0000-0000-000000000001', 'Headquarters', 'KE', TRUE)
ON CONFLICT DO NOTHING;
