-- ============================================
-- PHASE 4: WORKFORCE INTELLIGENCE AI
-- ============================================

-- ML Model predictions table
CREATE TABLE IF NOT EXISTS workforce_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  prediction_type VARCHAR(50) NOT NULL, -- ATTRITION, ATTENDANCE, COST, HIRING
  model_version VARCHAR(20),
  prediction_date DATE NOT NULL,
  target_date DATE,
  predictions JSONB NOT NULL,
  confidence_score DECIMAL(5,2),
  features_used JSONB,
  model_metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee risk scores
CREATE TABLE IF NOT EXISTS employee_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  risk_type VARCHAR(50) NOT NULL, -- ATTRITION, PERFORMANCE, ENGAGEMENT
  risk_score DECIMAL(5,2) NOT NULL,
  risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH, CRITICAL
  contributing_factors JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anomaly detection
CREATE TABLE IF NOT EXISTS attendance_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  anomaly_type VARCHAR(50) NOT NULL, -- LATE, EARLY_LEAVE, ABSENT, OT_EXCESS, PATTERN_CHANGE
  severity VARCHAR(20) DEFAULT 'MEDIUM',
  expected_value JSONB,
  actual_value JSONB,
  deviation_score DECIMAL(5,2),
  is_confirmed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workforce analytics cache
CREATE TABLE IF NOT EXISTS workforce_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,4),
  metric_unit VARCHAR(20),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  previous_value DECIMAL(15,4),
  change_percentage DECIMAL(10,2),
  trend VARCHAR(10), -- UP, DOWN, STABLE
  breakdown JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, metric_name, period_start, period_end)
);

-- AI Insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  insight_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  impact_score DECIMAL(5,2) DEFAULT 50,
  affected_count INT DEFAULT 0,
  affected_employees UUID[] DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  action_items JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'NEW', -- NEW, ACKNOWLEDGED, ACTED, DISMISSED
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cost forecasts
CREATE TABLE IF NOT EXISTS workforce_cost_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  forecast_period VARCHAR(20) NOT NULL, -- MONTHLY, QUARTERLY, YEARLY
  predicted_gross DECIMAL(15,2),
  predicted_deductions DECIMAL(15,2),
  predicted_net DECIMAL(15,2),
  confidence_level DECIMAL(5,2),
  assumptions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, forecast_date, forecast_period)
);

-- Performance benchmarks
CREATE TABLE IF NOT EXISTS performance_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  benchmark_type VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  industry_value DECIMAL(15,4),
  organization_value DECIMAL(15,4),
  percentile_rank DECIMAL(5,2),
  data_source VARCHAR(100),
  period VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workforce_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE workforce_cost_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (tenant-scoped)
CREATE POLICY "select_predictions_tenant" ON workforce_predictions FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_predictions_admin" ON workforce_predictions FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_risk_scores_tenant" ON employee_risk_scores FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_risk_scores_admin" ON employee_risk_scores FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_anomalies_tenant" ON attendance_anomalies FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_anomalies_admin" ON attendance_anomalies FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_anomalies_tenant" ON attendance_anomalies FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_analytics_tenant" ON workforce_analytics FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_analytics_admin" ON workforce_analytics FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_analytics_admin" ON workforce_analytics FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_insights_tenant" ON ai_insights FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_insights_admin" ON ai_insights FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());
CREATE POLICY "update_insights_admin" ON ai_insights FOR UPDATE TO authenticated 
  USING (organization_id = current_organization_id());

CREATE POLICY "select_forecasts_tenant" ON workforce_cost_forecasts FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_forecasts_admin" ON workforce_cost_forecasts FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

CREATE POLICY "select_benchmarks_tenant" ON performance_benchmarks FOR SELECT TO authenticated 
  USING (organization_id = current_organization_id());
CREATE POLICY "insert_benchmarks_admin" ON performance_benchmarks FOR INSERT TO authenticated 
  WITH CHECK (organization_id = current_organization_id());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_predictions_org ON workforce_predictions(organization_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_employee ON employee_risk_scores(employee_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_employee ON attendance_anomalies(employee_id);
CREATE INDEX IF NOT EXISTS idx_analytics_org_period ON workforce_analytics(organization_id, period_start);
CREATE INDEX IF NOT EXISTS idx_insights_org ON ai_insights(organization_id);
CREATE INDEX IF NOT EXISTS idx_forecasts_org ON workforce_cost_forecasts(organization_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_org ON performance_benchmarks(organization_id);