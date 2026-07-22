-- ============================================
-- PHASE 5: ENHANCED WORKFLOW ENGINE
-- ============================================

-- Workflow definition
CREATE TABLE IF NOT EXISTS workflow_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  trigger_type VARCHAR(50) NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, code)
);

-- Workflow triggers
CREATE TABLE IF NOT EXISTS workflow_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  condition_config JSONB DEFAULT '{}',
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow steps
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSONB DEFAULT '{}',
  assignee_type VARCHAR(50),
  assignee_id UUID,
  timeout_hours INT,
  timeout_action VARCHAR(50),
  is_mandatory BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow actions
CREATE TABLE IF NOT EXISTS workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES workflow_steps(id),
  action_type VARCHAR(50) NOT NULL,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow conditions
CREATE TABLE IF NOT EXISTS workflow_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  field VARCHAR(100) NOT NULL,
  operator VARCHAR(20) NOT NULL,
  value JSONB NOT NULL,
  then_step INT,
  else_step INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow schedules
CREATE TABLE IF NOT EXISTS workflow_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  cron_expression VARCHAR(100) NOT NULL,
  timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow webhooks
CREATE TABLE IF NOT EXISTS workflow_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES workflow_definitions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  method VARCHAR(10) DEFAULT 'POST',
  headers JSONB DEFAULT '{}',
  body_template JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "select_workflow_defs_tenant" ON workflow_definitions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_workflow_defs_admin" ON workflow_definitions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_workflow_defs_admin" ON workflow_definitions FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_workflow_triggers_tenant" ON workflow_triggers FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_workflow_triggers_admin" ON workflow_triggers FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_workflow_steps_tenant" ON workflow_steps FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_workflow_steps_admin" ON workflow_steps FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_workflow_actions_tenant" ON workflow_actions FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM workflow_executions WHERE workflow_executions.id = workflow_actions.execution_id 
    AND workflow_executions.organization_id = current_organization_id()));
CREATE POLICY "insert_workflow_actions_tenant" ON workflow_actions FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM workflow_executions WHERE workflow_executions.id = workflow_actions.execution_id 
    AND workflow_executions.organization_id = current_organization_id()));

CREATE POLICY "select_workflow_conditions_tenant" ON workflow_conditions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_workflow_schedules_tenant" ON workflow_schedules FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_workflow_webhooks_tenant" ON workflow_webhooks FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workflow_defs_org ON workflow_definitions(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_def ON workflow_steps(definition_id);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_exec ON workflow_actions(execution_id);