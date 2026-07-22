import React, { useState, useMemo, useCallback, useReducer, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════════════════
// 🚀 STAFFROOM OPTIMIZED WORKFLOW SYSTEM v3.0
// Production-Grade Leave, Approval & Payroll Flows
// ═══════════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────────
// LEAVE ALLOTMENTS (REAL-TIME TRACKING)
// ─────────────────────────────────────────────────────────────────────────────────────

const LEAVE_ALLOTMENTS = {
  e1: { name: "Amara Mbeki", annual: 20, sick: 10, emergency: 3, used: { annual: 5, sick: 2, emergency: 0 }, carryover: 2, lastUpdated: "2026-01-01" },
  e2: { name: "James Kamau", annual: 20, sick: 10, emergency: 3, used: { annual: 12, sick: 3, emergency: 1 }, carryover: 0, lastUpdated: "2026-01-01" },
  e3: { name: "Fatima Njoroge", annual: 20, sick: 10, emergency: 3, used: { annual: 8, sick: 1, emergency: 0 }, carryover: 3, lastUpdated: "2026-01-01" },
  e4: { name: "Brian Omondi", annual: 20, sick: 10, emergency: 3, used: { annual: 3, sick: 0, emergency: 0 }, carryover: 1, lastUpdated: "2026-01-01" },
  e5: { name: "Amina Wanjiru", annual: 20, sick: 10, emergency: 3, used: { annual: 10, sick: 4, emergency: 0 }, carryover: 0, lastUpdated: "2026-01-01" },
  e6: { name: "Peter Otieno", annual: 20, sick: 10, emergency: 3, used: { annual: 2, sick: 1, emergency: 0 }, carryover: 4, lastUpdated: "2026-01-01" },
  e7: { name: "Mary Nduta", annual: 20, sick: 10, emergency: 3, used: { annual: 6, sick: 2, emergency: 0 }, carryover: 2, lastUpdated: "2026-01-01" },
  e8: { name: "Eli Kiprop", annual: 20, sick: 10, emergency: 3, used: { annual: 15, sick: 5, emergency: 1 }, carryover: 0, lastUpdated: "2026-01-01" },
};

// ─────────────────────────────────────────────────────────────────────────────────────
// APPROVAL RULES (CLEAR & ENFORCEABLE)
// ─────────────────────────────────────────────────────────────────────────────────────

const APPROVAL_RULES = {
  leave: [
    { condition: "days <= 2 && type === 'sick'", chain: ["manager"], sla: 24, desc: "Sick ≤2: Manager" },
    { condition: "days <= 2 && type === 'annual'", chain: ["manager", "dept_head"], sla: 24, desc: "Annual ≤2: Manager→Head" },
    { condition: "days > 2 && days <= 5", chain: ["manager", "dept_head"], sla: 48, desc: "3-5 days: Manager→Head" },
    { condition: "days > 5", chain: ["manager", "dept_head", "hr"], sla: 72, desc: ">5 days: Full chain" },
  ],
  expense: [
    { condition: "amount < 500", chain: ["manager"], sla: 24, desc: "<$500: Manager" },
    { condition: "amount >= 500 && amount < 2000", chain: ["manager", "finance"], sla: 48, desc: "$500-2k: Manager→Finance" },
    { condition: "amount >= 2000", chain: ["manager", "finance", "ceo"], sla: 72, desc: ">$2k: Full chain" },
  ],
  payroll: [
    { condition: "variance < 100", chain: [], autoApprove: true, sla: 0, desc: "<$100: Auto-approved" },
    { condition: "variance >= 100 && variance < 1000", chain: ["finance"], sla: 24, desc: "$100-1k: Finance" },
    { condition: "variance >= 1000", chain: ["finance", "ceo"], sla: 24, desc: ">$1k: Finance→CEO" },
  ],
  promotion: [
    { condition: "all", chain: ["manager", "dept_head", "hr", "finance", "ceo"], sla: 120, desc: "Full chain required" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────
// PAYROLL CONFIG & VARIANCE DETECTION
// ─────────────────────────────────────────────────────────────────────────────────────

const PAYROLL_CONFIG = {
  taxRate: 0.16,
  socialSecurityRate: 0.06,
  healthInsuranceRate: 0.04,
  otherDeductionsRate: 0.02,
};

const EMPLOYEE_PAYROLL_HISTORY = {
  e1: { avg_gross: 4800, last_gross: 4800, avg_variance: 0 },
  e2: { avg_gross: 6200, last_gross: 6200, avg_variance: 0 },
  e3: { avg_gross: 4100, last_gross: 4100, avg_variance: 0 },
  e4: { avg_gross: 5000, last_gross: 5000, avg_variance: 0 },
  e5: { avg_gross: 4500, last_gross: 4500, avg_variance: 0 },
  e6: { avg_gross: 5500, last_gross: 5500, avg_variance: 0 },
  e7: { avg_gross: 4900, last_gross: 4900, avg_variance: 0 },
  e8: { avg_gross: 4000, last_gross: 4000, avg_variance: 0 },
};

// ─────────────────────────────────────────────────────────────────────────────────────
// WORKFLOW STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────────────

const initialState = {
  workflows: [
    { id: "w1", type: "leave", employee: "e7", status: "pending", current_step: 0, created: "2026-07-10", item: { type: "annual", days: 5, start: "2026-07-15" }, steps: [{ role: "manager", name: "James Kamau", status: "pending", deadline: "2026-07-11" }, { role: "dept_head", name: "James Kamau", status: "pending", deadline: "2026-07-12" }] },
    { id: "w2", type: "payroll", employee: "e3", status: "pending", current_step: 0, created: "2026-07-10", item: { amount: 4100, variance: 150 }, steps: [{ role: "finance", name: "Brian Omondi", status: "pending", deadline: "2026-07-11" }] },
    { id: "w3", type: "expense", employee: "e6", status: "pending", current_step: 0, created: "2026-07-09", item: { amount: 750, category: "travel" }, steps: [{ role: "manager", name: "James Kamau", status: "pending", deadline: "2026-07-10" }, { role: "finance", name: "Brian Omondi", status: "pending", deadline: "2026-07-11" }] },
  ],
  notifications: [],
  auditLog: [],
};

function workflowReducer(state, action) {
  switch(action.type) {
    case "APPROVE_STEP":
      return {
        ...state,
        workflows: state.workflows.map(w => {
          if(w.id !== action.payload.workflow_id) return w;
          const updated = { ...w };
          updated.steps[w.current_step].status = "approved";
          updated.steps[w.current_step].completed = new Date().toISOString();
          if(w.current_step < w.steps.length - 1) updated.current_step += 1;
          else updated.status = "approved";
          return updated;
        }),
        auditLog: [...state.auditLog, { timestamp: Date.now(), action: "APPROVE", workflow_id: action.payload.workflow_id, by: action.payload.user }]
      };
    
    case "REJECT_STEP":
      return {
        ...state,
        workflows: state.workflows.map(w => {
          if(w.id !== action.payload.workflow_id) return w;
          return { ...w, status: "rejected", current_step: 0 };
        }),
        auditLog: [...state.auditLog, { timestamp: Date.now(), action: "REJECT", workflow_id: action.payload.workflow_id, by: action.payload.user, reason: action.payload.reason }]
      };
    
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case "CLEAR_NOTIFICATION":
      return { ...state, notifications: state.notifications.filter((n, i) => i !== action.payload) };
    
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────────

function validateLeaveRequest(employee_id, days, type) {
  const allotment = LEAVE_ALLOTMENTS[employee_id];
  if(!allotment) return { valid: false, message: "Employee not found" };
  
  const available = allotment[type] - allotment.used[type] + (type === 'annual' ? allotment.carryover : 0);
  
  if(days > available) {
    return { valid: false, message: `Only ${available} ${type} days available`, daysAvailable: available };
  }
  
  return { valid: true, daysAvailable: available, daysRemaining: available - days };
}

function validatePayroll(employee_id, amount) {
  const history = EMPLOYEE_PAYROLL_HISTORY[employee_id];
  if(!history) return { valid: false, anomalies: [] };
  
  const variance = amount - history.last_gross;
  const variance_pct = (variance / history.last_gross) * 100;
  const anomalies = [];
  
  if(Math.abs(variance_pct) > 20) {
    anomalies.push({ type: "GROSS_VARIANCE", severity: Math.abs(variance_pct) > 50 ? "CRITICAL" : "HIGH", message: `Pay varies ${variance_pct.toFixed(1)}%` });
  }
  
  if(amount > history.last_gross * 2) {
    anomalies.push({ type: "EXCESSIVE_INCREASE", severity: "CRITICAL", message: "Payment more than 2x normal" });
  }
  
  if(amount < 0) {
    anomalies.push({ type: "NEGATIVE_PAYMENT", severity: "CRITICAL", message: "Negative payment detected" });
  }
  
  return { valid: anomalies.length === 0, anomalies, variance, variance_pct };
}

function calculateSLA(created, deadline) {
  const now = new Date(created);
  const dl = new Date(deadline);
  const msLeft = dl - now;
  const hoursLeft = msLeft / (1000 * 60 * 60);
  
  if(hoursLeft < 0) return { status: "overdue", label: "OVERDUE", color: "#d45a6a", hoursLeft: 0 };
  if(hoursLeft < 12) return { status: "at_risk", label: "AT RISK", color: "#c4852a", hoursLeft };
  return { status: "on_track", label: "ON TRACK", color: "#5a8a6a", hoursLeft };
}

// ─────────────────────────────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return <div style={{ background: "#fff", border: "1px solid #e0ddd8", borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function Badge({ children, variant = "neutral" }) {
  const colors = {
    pending: { bg: "#fef3e2", color: "#c4852a" },
    approved: { bg: "#e8f5e9", color: "#5a8a6a" },
    rejected: { bg: "#ffebee", color: "#d45a6a" },
    overdue: { bg: "#ffebee", color: "#d45a6a" },
    at_risk: { bg: "#fff3e0", color: "#c4852a" },
    on_track: { bg: "#e8f5e9", color: "#5a8a6a" },
  };
  const c = colors[variant] || colors.neutral;
  return <span style={{ display: "inline-block", background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{children}</span>;
}

function WorkflowCard({ workflow, employees, onApprove, onReject }) {
  const currentStep = workflow.steps[workflow.current_step];
  const created = new Date(workflow.created);
  const deadline = new Date(currentStep?.deadline || "2026-07-12");
  const sla = calculateSLA(created, deadline);
  
  const employee = Object.values(LEAVE_ALLOTMENTS).find(e => e.name === (workflow.employee_name || LEAVE_ALLOTMENTS[workflow.employee]?.name));
  
  return (
    <Card style={{ marginBottom: 12, borderLeft: `4px solid ${sla.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            {workflow.type === "leave" && `🏖️ Leave Request: ${workflow.item.days} days`}
            {workflow.type === "payroll" && `💸 Payroll: $${workflow.item.amount.toLocaleString()}`}
            {workflow.type === "expense" && `💰 Expense: $${workflow.item.amount.toLocaleString()} (${workflow.item.category})`}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Employee: {employee?.name || "Unknown"}
            {workflow.type === "leave" && ` · Type: ${workflow.item.type} · Starts: ${workflow.item.start}`}
            {workflow.type === "payroll" && ` · Variance: $${workflow.item.variance}`}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <Badge variant={sla.status}>{sla.label}</Badge>
          <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>
            Deadline: {currentStep?.deadline}
          </div>
        </div>
      </div>
      
      {workflow.status === "pending" && currentStep && (
        <>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
            Awaiting approval from: <strong>{currentStep.name}</strong> ({currentStep.role})
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onApprove(workflow.id)} style={{ padding: "8px 16px", background: "#5a8a6a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              ✓ Approve
            </button>
            <button onClick={() => onReject(workflow.id)} style={{ padding: "8px 16px", background: "#d45a6a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              ✕ Reject
            </button>
          </div>
        </>
      )}
      
      {workflow.status === "approved" && (
        <Badge variant="approved">✓ APPROVED</Badge>
      )}
      
      {workflow.status === "rejected" && (
        <Badge variant="rejected">✕ REJECTED</Badge>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────────

export default function StaffRoomWorkflowSystem() {
  const [state, dispatch] = useReducer(workflowReducer, initialState);
  const [filter, setFilter] = useState("pending");
  const [tab, setTab] = useState("workflows");
  
  const filteredWorkflows = useMemo(() => {
    if(filter === "pending") return state.workflows.filter(w => w.status === "pending");
    if(filter === "approved") return state.workflows.filter(w => w.status === "approved");
    if(filter === "rejected") return state.workflows.filter(w => w.status === "rejected");
    return state.workflows;
  }, [state.workflows, filter]);
  
  const handleApprove = (workflow_id) => {
    const workflow = state.workflows.find(w => w.id === workflow_id);
    if(!workflow) return;
    
    // Validate based on type
    if(workflow.type === "leave") {
      const validation = validateLeaveRequest(workflow.employee, workflow.item.days, workflow.item.type);
      if(!validation.valid) {
        dispatch({ type: "ADD_NOTIFICATION", payload: { type: "error", message: validation.message } });
        return;
      }
    }
    
    if(workflow.type === "payroll") {
      const validation = validatePayroll(workflow.employee, workflow.item.amount);
      if(validation.anomalies.length > 0) {
        dispatch({ type: "ADD_NOTIFICATION", payload: { type: "warning", message: `${validation.anomalies.length} anomalies detected - review carefully` } });
      }
    }
    
    dispatch({ type: "APPROVE_STEP", payload: { workflow_id, user: "current_user" } });
    dispatch({ type: "ADD_NOTIFICATION", payload: { type: "success", message: `Workflow ${workflow_id} approved` } });
  };
  
  const handleReject = (workflow_id) => {
    dispatch({ type: "REJECT_STEP", payload: { workflow_id, user: "current_user", reason: "Rejected by approver" } });
    dispatch({ type: "ADD_NOTIFICATION", payload: { type: "error", message: `Workflow ${workflow_id} rejected` } });
  };
  
  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh", fontFamily: "'Sora', sans-serif", padding: 20 }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital@0;1&family=Sora:wght@400;600&display=swap');
      `}</style>
      
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 32, marginBottom: 20 }}>Workflow Management System</h1>
      
      {/* Notifications */}
      {state.notifications.map((n, i) => (
        <div key={i} style={{ marginBottom: 12, padding: 12, background: n.type === "success" ? "#e8f5e9" : n.type === "error" ? "#ffebee" : "#fff3e0", border: `1px solid ${n.type === "success" ? "#5a8a6a" : n.type === "error" ? "#d45a6a" : "#c4852a"}`, borderRadius: 6, color: n.type === "success" ? "#5a8a6a" : n.type === "error" ? "#d45a6a" : "#c4852a" }}>
          {n.message}
        </div>
      ))}
      
      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setTab("workflows")} style={{ padding: "10px 20px", background: tab === "workflows" ? "#e8512a" : "#fff", color: tab === "workflows" ? "#fff" : "#333", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          Workflows ({state.workflows.length})
        </button>
        <button onClick={() => setTab("leave")} style={{ padding: "10px 20px", background: tab === "leave" ? "#e8512a" : "#fff", color: tab === "leave" ? "#fff" : "#333", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          Leave Tracking
        </button>
        <button onClick={() => setTab("payroll")} style={{ padding: "10px 20px", background: tab === "payroll" ? "#e8512a" : "#fff", color: tab === "payroll" ? "#fff" : "#333", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          Payroll Validation
        </button>
      </div>
      
      {/* Workflows Tab */}
      {tab === "workflows" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            {["pending", "approved", "rejected"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", background: filter === f ? "#e8512a" : "#fff", color: filter === f ? "#fff" : "#333", border: "1px solid #ddd", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({state.workflows.filter(w => w.status === f).length})
              </button>
            ))}
          </div>
          
          <div>
            {filteredWorkflows.map(w => (
              <WorkflowCard key={w.id} workflow={w} onApprove={handleApprove} onReject={handleReject} />
            ))}
          </div>
        </div>
      )}
      
      {/* Leave Tracking Tab */}
      {tab === "leave" && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Leave Balance Tracking</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {Object.entries(LEAVE_ALLOTMENTS).map(([id, allot]) => {
              const total_annual = allot.annual + allot.carryover;
              const used_annual = allot.used.annual;
              const remaining = total_annual - used_annual;
              
              return (
                <Card key={id}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{allot.name}</h3>
                  <div style={{ fontSize: 13, marginBottom: 8 }}>
                    <div>Annual: {used_annual}/{total_annual} days ({remaining} remaining)</div>
                    <div>Sick: {allot.used.sick}/{allot.sick} days ({allot.sick - allot.used.sick} remaining)</div>
                    <div>Emergency: {allot.used.emergency}/{allot.emergency} days ({allot.emergency - allot.used.emergency} remaining)</div>
                  </div>
                  <div style={{ height: 6, background: "#e0ddd8", borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${(used_annual / total_annual) * 100}%`, background: "#5a8a6a", transition: "width 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#666" }}>
                    {remaining} days available this year
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Payroll Validation Tab */}
      {tab === "payroll" && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Payroll Validation & Anomalies</h2>
          <div>
            {Object.entries(EMPLOYEE_PAYROLL_HISTORY).map(([id, history]) => {
              const allot = LEAVE_ALLOTMENTS[id];
              const validation = validatePayroll(id, history.last_gross);
              
              return (
                <Card key={id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600 }}>{allot.name}</h3>
                      <div style={{ fontSize: 12, color: "#666" }}>Last Gross: ${history.last_gross.toLocaleString()}</div>
                    </div>
                    <Badge variant={validation.anomalies.length === 0 ? "on_track" : "at_risk"}>
                      {validation.anomalies.length === 0 ? "✓ VALID" : `${validation.anomalies.length} ANOMALIES`}
                    </Badge>
                  </div>
                  
                  {validation.anomalies.map((anom, i) => (
                    <div key={i} style={{ fontSize: 12, padding: 8, background: anom.severity === "CRITICAL" ? "#ffebee" : "#fff3e0", color: anom.severity === "CRITICAL" ? "#d45a6a" : "#c4852a", borderRadius: 4, marginBottom: 8 }}>
                      ⚠️ {anom.message}
                    </div>
                  ))}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
