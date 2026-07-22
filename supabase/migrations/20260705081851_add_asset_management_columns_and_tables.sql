/*
# Asset Management: add columns and history tables

## Overview
Extends the existing `assets` table with fields needed for full asset management
(asset tags, categories, and condition tracking) and adds two new child tables
to track assignment history and maintenance records.

## 1. Modified Table: `assets`
Adds three new columns:
- `asset_tag` (varchar, nullable) — human-readable tag/label for the asset (e.g. "AST-001").
- `category` (varchar, nullable) — asset category. Values: LAPTOP, PHONE, VEHICLE, SIM, TOOL, FURNITURE, LICENSE, OTHER.
- `condition` (varchar, nullable, default 'NEW') — physical condition. Values: NEW, GOOD, FAIR, POOR.

The existing `type` column is left in place for backward compatibility; `category`
is the preferred field going forward.

Adds an index on `category` for filter performance.

## 2. New Table: `asset_assignments`
Tracks the full history of asset-to-employee assignments (past and present).
- `id` (uuid, primary key)
- `asset_id` (uuid, FK → assets.id ON DELETE CASCADE)
- `employee_id` (uuid, FK → employees.id ON DELETE SET NULL)
- `assigned_by` (uuid, FK → profiles.id ON DELETE SET NULL) — who made the assignment
- `assignment_date` (date) — when the asset was assigned
- `return_date` (date, nullable) — when the asset was returned (null = currently assigned)
- `notes` (text, nullable)
- `organization_id` (uuid, FK → organizations.id)
- `created_at` (timestamptz, default now())

## 3. New Table: `asset_maintenance`
Tracks maintenance/repair records for assets.
- `id` (uuid, primary key)
- `asset_id` (uuid, FK → assets.id ON DELETE CASCADE)
- `maintenance_type` (varchar) — REPAIR, SERVICE, UPGRADE, INSPECTION
- `scheduled_date` (date) — when the maintenance is scheduled
- `completed_date` (date, nullable) — when maintenance was completed (null = pending)
- `status` (varchar, default 'SCHEDULED') — SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
- `notes` (text, nullable)
- `organization_id` (uuid, FK → organizations.id)
- `created_at` (timestamptz, default now())

## 4. Security (RLS)
- `asset_assignments`: SELECT for authenticated; INSERT/UPDATE/DELETE for ADMIN and SYSTEM_OWNER roles.
- `asset_maintenance`: SELECT for authenticated; INSERT/UPDATE/DELETE for ADMIN and SYSTEM_OWNER roles.
These match the existing policy pattern on the `assets` table.

## 5. Indexes
- `idx_assets_category` on `assets(category)`
- `idx_asset_assignments_asset_id` on `asset_assignments(asset_id)`
- `idx_asset_assignments_employee_id` on `asset_assignments(employee_id)`
- `idx_asset_maintenance_asset_id` on `asset_maintenance(asset_id)`
- `idx_asset_maintenance_status` on `asset_maintenance(status)`
*/

-- ============================================================
-- 1. Add columns to assets
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'assets' AND column_name = 'asset_tag') THEN
    ALTER TABLE assets ADD COLUMN asset_tag varchar;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'assets' AND column_name = 'category') THEN
    ALTER TABLE assets ADD COLUMN category varchar;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = 'public' AND table_name = 'assets' AND column_name = 'condition') THEN
    ALTER TABLE assets ADD COLUMN condition varchar DEFAULT 'NEW';
  END IF;
END $$;

-- Index on category for filtering
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);

-- ============================================================
-- 2. Create asset_assignments table
-- ============================================================
CREATE TABLE IF NOT EXISTS asset_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  assigned_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assignment_date date NOT NULL DEFAULT CURRENT_DATE,
  return_date date,
  notes text,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asset_assignments ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_asset_assignments_asset_id ON asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_employee_id ON asset_assignments(employee_id);

-- Policies: SELECT for authenticated, write for admins
DROP POLICY IF EXISTS "select_asset_assignments_authenticated" ON asset_assignments;
CREATE POLICY "select_asset_assignments_authenticated"
ON asset_assignments FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_asset_assignments_admin" ON asset_assignments;
CREATE POLICY "insert_asset_assignments_admin"
ON asset_assignments FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));

DROP POLICY IF EXISTS "update_asset_assignments_admin" ON asset_assignments;
CREATE POLICY "update_asset_assignments_admin"
ON asset_assignments FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));

DROP POLICY IF EXISTS "delete_asset_assignments_admin" ON asset_assignments;
CREATE POLICY "delete_asset_assignments_admin"
ON asset_assignments FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));

-- ============================================================
-- 3. Create asset_maintenance table
-- ============================================================
CREATE TABLE IF NOT EXISTS asset_maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type varchar NOT NULL DEFAULT 'SERVICE',
  scheduled_date date NOT NULL DEFAULT CURRENT_DATE,
  completed_date date,
  status varchar NOT NULL DEFAULT 'SCHEDULED',
  notes text,
  organization_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_asset_id ON asset_maintenance(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_maintenance_status ON asset_maintenance(status);

-- Policies: SELECT for authenticated, write for admins
DROP POLICY IF EXISTS "select_asset_maintenance_authenticated" ON asset_maintenance;
CREATE POLICY "select_asset_maintenance_authenticated"
ON asset_maintenance FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_asset_maintenance_admin" ON asset_maintenance;
CREATE POLICY "insert_asset_maintenance_admin"
ON asset_maintenance FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));

DROP POLICY IF EXISTS "update_asset_maintenance_admin" ON asset_maintenance;
CREATE POLICY "update_asset_maintenance_admin"
ON asset_maintenance FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));

DROP POLICY IF EXISTS "delete_asset_maintenance_admin" ON asset_maintenance;
CREATE POLICY "delete_asset_maintenance_admin"
ON asset_maintenance FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('ADMIN', 'SYSTEM_OWNER')
));
