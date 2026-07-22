/*
# Audit Trail Enhancement & Leave Approval Workflow Functions

## Overview
1. Creates a database function for easy audit logging from the frontend
2. Adds leave approval workflow tracking columns to leave_requests
3. Creates a view for audit log queries with user details

## Changes

### Functions
- `log_audit_action` — Callable from frontend to log any action
- `get_leave_approval_chain` — Returns the approval chain for a leave request

### Columns Added
- `leave_requests.approval_workflow_id` — Links to approval workflow
- `leave_requests.current_approval_step` — Current step in the chain
- `leave_requests.approval_history` — JSONB array of approval actions
- `leave_requests.delegated_by` — If approved by a delegate

### Views
- `audit_log_details` — Joins audit_logs with profiles for user names

## Security
- RLS on audit_logs already exists
- The log_audit_action function runs with the caller's permissions
*/

-- Add workflow tracking columns to leave_requests
DO $$ BEGIN
  ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS approval_workflow_id uuid;
  ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS current_approval_step integer DEFAULT 0;
  ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS approval_history jsonb DEFAULT '[]'::jsonb;
  ALTER TABLE leave_requests ADD COLUMN IF NOT EXISTS delegated_by uuid;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Audit logging function — callable from frontend via supabase.rpc()
CREATE OR REPLACE FUNCTION log_audit_action(
  p_action text,
  p_entity_type text DEFAULT NULL,
  p_entity_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_audit_id uuid;
BEGIN
  SELECT organization_id INTO v_org_id FROM profiles WHERE id = v_user_id;
  
  INSERT INTO audit_logs (
    organization_id, user_id, action, entity_type, entity_id,
    old_values, new_values
  ) VALUES (
    v_org_id, v_user_id, p_action, p_entity_type, p_entity_id,
    p_old_values, p_new_values
  )
  RETURNING id INTO v_audit_id;
  
  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for audit log details with user names
CREATE OR REPLACE VIEW audit_log_details AS
SELECT
  al.id,
  al.organization_id,
  al.user_id,
  p.full_name AS user_name,
  p.role AS user_role,
  al.action,
  al.entity_type,
  al.entity_id,
  al.old_values,
  al.new_values,
  al.ip_address,
  al.user_agent,
  al.created_at
FROM audit_logs al
LEFT JOIN profiles p ON p.id = al.user_id;

-- Enable RLS on the view
ALTER VIEW audit_log_details SET (security_barrier = true);

-- Grant access to authenticated users
GRANT SELECT ON audit_log_details TO authenticated;

-- Function to get leave approval chain
CREATE OR REPLACE FUNCTION get_leave_approval_chain(p_request_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'step', step_order,
      'approver_type', approver_type,
      'approver_role', approver_role,
      'is_parallel', is_parallel,
      'condition_field', condition_field,
      'condition_value', condition_value
    ) ORDER BY step_order
  ) INTO v_result
  FROM approval_workflow_steps
  WHERE workflow_id = (
    SELECT approval_workflow_id FROM leave_requests WHERE id = p_request_id
  );
  
  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_created ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_workflow ON leave_requests(approval_workflow_id);
