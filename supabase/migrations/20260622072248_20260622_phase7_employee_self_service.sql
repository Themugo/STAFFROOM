-- ============================================
-- PHASE 7: EMPLOYEE SELF-SERVICE PORTAL
-- ============================================

-- Employee mobile sessions
CREATE TABLE IF NOT EXISTS mobile_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  device_id UUID REFERENCES registered_devices(id) ON DELETE SET NULL,
  device_token TEXT,
  platform VARCHAR(20), -- IOS, ANDROID, WEB
  app_version VARCHAR(20),
  session_token VARCHAR(255) UNIQUE,
  logged_in_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  logged_out_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quick actions (for mobile app)
CREATE TABLE IF NOT EXISTS quick_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  action_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO', -- INFO, WARNING, URGENT, EVENT
  priority INT DEFAULT 0,
  target_audience VARCHAR(50) DEFAULT 'ALL', -- ALL, DEPARTMENT, BRANCH, ROLE, SPECIFIC
  target_ids UUID[] DEFAULT '{}',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES profiles(id),
  image_url TEXT,
  attachments JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcement reads
CREATE TABLE IF NOT EXISTS announcement_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(announcement_id, employee_id)
);

-- Expense claims
CREATE TABLE IF NOT EXISTS expense_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  claim_number VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KES',
  status VARCHAR(20) DEFAULT 'PENDING', -- DRAFT, PENDING, APPROVED, REJECTED, PAID
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES employees(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  paid_at TIMESTAMPTZ,
  payment_reference VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense claim items
CREATE TABLE IF NOT EXISTS expense_claim_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES expense_claims(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- TRAVEL, MEALS, EQUIPMENT, TRAINING, OTHER
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team directory profile (public view)
CREATE TABLE IF NOT EXISTS team_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  bio TEXT,
  skills JSONB DEFAULT '[]',
  interests JSONB DEFAULT '[]',
  preferred_name VARCHAR(100),
  pronouns VARCHAR(20),
  linkedin_url VARCHAR(255),
  twitter_url VARCHAR(255),
  show_email BOOLEAN DEFAULT TRUE,
  show_phone BOOLEAN DEFAULT FALSE,
  show_birthday BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, employee_id)
);

-- Learning modules
CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  content_type VARCHAR(50), -- VIDEO, DOCUMENT, QUIZ, SCORM
  content_url TEXT,
  duration_minutes INT,
  thumbnail_url TEXT,
  is_mandatory BOOLEAN DEFAULT FALSE,
  target_roles VARCHAR(50)[],
  target_departments UUID[],
  created_by UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee learning progress
CREATE TABLE IF NOT EXISTS employee_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage INT DEFAULT 0,
  score DECIMAL(5,2),
  attempts INT DEFAULT 1,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(employee_id, module_id)
);

-- Performance reviews (self-service)
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES employees(id),
  review_period VARCHAR(50) NOT NULL,
  review_date DATE NOT NULL,
  rating DECIMAL(3,2),
  goals JSONB DEFAULT '[]',
  achievements TEXT,
  feedback TEXT,
  development_plan TEXT,
  next_review_date DATE,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SUBMITTED, COMPLETED
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Help desk tickets
CREATE TABLE IF NOT EXISTS help_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50),
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- HR, IT, PAYROLL, LEAVE, OTHER
  priority VARCHAR(20) DEFAULT 'NORMAL',
  status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
  assigned_to UUID REFERENCES employees(id),
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Ticket responses
CREATE TABLE IF NOT EXISTS help_ticket_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES help_tickets(id) ON DELETE CASCADE,
  responder_id UUID NOT NULL REFERENCES employees(id),
  response TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mobile_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_claim_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_ticket_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_mobile_sessions_own" ON mobile_sessions FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM employees WHERE employees.id = mobile_sessions.employee_id 
    AND employees.organization_id = current_organization_id()));
CREATE POLICY "insert_mobile_sessions_auth" ON mobile_sessions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_quick_actions_tenant" ON quick_actions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_announcements_tenant" ON announcements FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_announcements_admin" ON announcements FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_announcement_reads_tenant" ON announcement_reads FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM announcements WHERE announcements.id = announcement_reads.announcement_id 
    AND announcements.organization_id = current_organization_id()));
CREATE POLICY "insert_announcement_reads_own" ON announcement_reads FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM employees WHERE employees.id = announcement_reads.employee_id 
    AND employees.organization_id = current_organization_id()));

CREATE POLICY "select_expense_claims_own" ON expense_claims FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_expense_claims_own" ON expense_claims FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_expense_claims_admin" ON expense_claims FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_expense_items_tenant" ON expense_claim_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM expense_claims WHERE expense_claims.id = expense_claim_items.claim_id 
    AND expense_claims.organization_id = current_organization_id()));
CREATE POLICY "insert_expense_items_own" ON expense_claim_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM expense_claims WHERE expense_claims.id = expense_claim_items.claim_id 
    AND expense_claims.organization_id = current_organization_id()));

CREATE POLICY "select_team_directory_tenant" ON team_directory FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "update_team_directory_own" ON team_directory FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_learning_modules_tenant" ON learning_modules FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_learning_admin" ON learning_modules FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_employee_learning_own" ON employee_learning FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_employee_learning_own" ON employee_learning FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_employee_learning_own" ON employee_learning FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_performance_reviews_own" ON performance_reviews FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_performance_reviews_admin" ON performance_reviews FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_performance_reviews_admin" ON performance_reviews FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_help_tickets_own" ON help_tickets FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_help_tickets_own" ON help_tickets FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_help_tickets_admin" ON help_tickets FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_help_responses_tenant" ON help_ticket_responses FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM help_tickets WHERE help_tickets.id = help_ticket_responses.ticket_id 
    AND help_tickets.organization_id = current_organization_id()));
CREATE POLICY "insert_help_responses_tenant" ON help_ticket_responses FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM help_tickets WHERE help_tickets.id = help_ticket_responses.ticket_id 
    AND help_tickets.organization_id = current_organization_id()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mobile_sessions_employee ON mobile_sessions(employee_id);
CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(organization_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_employee ON expense_claims(employee_id);
CREATE INDEX IF NOT EXISTS idx_team_directory_employee ON team_directory(employee_id);
CREATE INDEX IF NOT EXISTS idx_learning_modules_org ON learning_modules(organization_id);
CREATE INDEX IF NOT EXISTS idx_employee_learning_employee ON employee_learning(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_help_tickets_employee ON help_tickets(employee_id);