-- ============================================
-- SECURITY HARDENING: Audit Log View, Login Tracking, Notifications
-- ============================================

-- 1. Audit log view with user names
CREATE OR REPLACE VIEW audit_log_view AS
SELECT
  al.id, al.user_id, p.full_name as user_name, al.organization_id,
  al.action, al.entity_type, al.entity_id, al.old_values, al.new_values,
  al.ip_address, al.user_agent, al.created_at
FROM audit_logs al
LEFT JOIN profiles p ON al.user_id = p.id
ORDER BY al.created_at DESC;

-- 2. Login attempt tracking
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_login_attempts_owner" ON login_attempts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'SYSTEM_OWNER'));
CREATE POLICY "insert_login_attempts_any" ON login_attempts FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted ON login_attempts(attempted_at);

-- 3. Notification support columns
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_url TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_organization ON notifications(organization_id);
