/*
# Fix Infinite Recursion in Profiles RLS Policy

## Problem
The `profile_select_org` policy on the `profiles` table queries `profiles` inside its own RLS check:
```sql
CREATE POLICY "profile_select_org" ON profiles FOR SELECT
  TO authenticated USING (
    id = auth.uid()
    OR organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );
```
This causes infinite recursion because evaluating the policy on `profiles` triggers the policy itself.

## Fix
Replace the self-referencing subquery with `auth.uid()` directly. Since every user's `organization_id` is on their own profile row, we can use a simpler approach:
- Users can always read their own profile row (id = auth.uid())
- For reading other profiles in the same org, we use a SECURITY DEFINER function that bypasses RLS to look up the caller's org_id, avoiding the recursion.

## Safety
- No data is lost
- RLS remains enabled
- The fix is idempotent (DROP POLICY IF EXISTS first)
*/

-- Drop the recursive policy
DROP POLICY IF EXISTS "profile_select_org" ON profiles;

-- Create a SECURITY DEFINER function to get the caller's organization_id without RLS recursion
CREATE OR REPLACE FUNCTION get_current_user_org_id()
RETURNS uuid AS $$
DECLARE
  v_org_id uuid;
BEGIN
  SELECT organization_id INTO v_org_id FROM profiles WHERE id = auth.uid();
  RETURN v_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the policy using the function instead of a self-referencing subquery
CREATE POLICY "profile_select_org" ON profiles FOR SELECT
  TO authenticated USING (
    id = auth.uid()
    OR organization_id = get_current_user_org_id()
  );

-- Also fix the INSERT and UPDATE policies that had the same recursion issue
DROP POLICY IF EXISTS "profile_insert_org" ON profiles;
CREATE POLICY "profile_insert_org" ON profiles FOR INSERT
  TO authenticated WITH CHECK (
    organization_id = get_current_user_org_id()
    OR id = auth.uid()
  );

DROP POLICY IF EXISTS "profile_update_own" ON profiles;
CREATE POLICY "profile_update_own" ON profiles FOR UPDATE
  TO authenticated USING (
    id = auth.uid()
    OR (organization_id = get_current_user_org_id()
        AND EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('SYSTEM_OWNER', 'ADMIN', 'HR_DIRECTOR', 'HR_OFFICER', 'IT_ADMIN')))
  );

-- Fix the DELETE policy too
DROP POLICY IF EXISTS "profile_delete_admin" ON profiles;
CREATE POLICY "profile_delete_admin" ON profiles FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('SYSTEM_OWNER', 'ADMIN', 'IT_ADMIN'))
  );

-- Also fix the organizations policies that had the same recursion
DROP POLICY IF EXISTS "org_select_own" ON organizations;
CREATE POLICY "org_select_own" ON organizations FOR SELECT
  TO authenticated USING (
    id = get_current_user_org_id()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER')
  );

-- Grant execute on the helper function
GRANT EXECUTE ON FUNCTION get_current_user_org_id() TO authenticated;
