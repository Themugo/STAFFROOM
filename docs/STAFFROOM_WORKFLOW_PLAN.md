# STAFFROOM Workflow & Departmental Leadership Build Plan

## 🎯 What We're Building

### **Phase 1: Department Leadership System** (4 new pages)
1. **Department Dashboard** — Head's overview of team, budget, KPIs
2. **Team Management** — Manage department members, assignments
3. **Department Performance** — Team metrics, goals, performance
4. **Department Budget** — Headcount, salary, spending by dept

### **Phase 2: Workflow Management System** (3 new pages)
1. **My Approvals** — All pending items needing action
2. **Approval History** — Track all completed workflows
3. **Workflow Configuration** — Setup approval rules & chains

### **Phase 3: Workflow Engine** (Core Logic)
- Multi-level approval chains
- Conditional routing based on department/amount
- Parallel & sequential approvals
- SLA tracking & deadline warnings
- Approval history & audit trail
- Notification system
- Status updates & notifications

### **Phase 4: Integration** 
- Enhanced Leave approval (with dept head approval)
- Enhanced Payroll approval (multi-level)
- Enhanced Expense approval (with routing)
- Promotion approval workflows
- Onboarding task assignments

---

## 📊 New Data Models

### **Workflow States**
```
Draft → Submitted → 
  ├─ Dept Head Review → Manager Approval → Finance → Approved/Rejected
  ├─ Parallel (all must approve)
  └─ SLA tracking on each step
```

### **Approval Rules**
```
Leave Request:
  ├─ < 2 days: Dept Head only
  ├─ 2-5 days: Dept Head + Manager
  └─ > 5 days: Dept Head + Manager + CEO

Expense:
  ├─ < $500: Dept Head
  ├─ $500-2000: Dept Head + Manager
  └─ > $2000: Dept Head + Manager + Finance + CEO

Payroll:
  ├─ < $1000 variance: Auto-approved
  ├─ $1000-5000: Manager + Finance
  └─ > $5000: Manager + Finance + CEO

Promotion:
  └─ Dept Head → Manager → CEO (all required)
```

### **Department Structure**
```
Engineering (4 people)
  ├─ Head: James Kamau
  ├─ Manager: Peter Otieno
  └─ Members: Mary Nduta, [+1]

Finance (3 people)
  ├─ Head: Brian Omondi
  └─ Members: Eli Kiprop, [+1]

Design (2 people)
  ├─ Head: Fatima Njoroge
  └─ Members: [+1]

HR (2 people)
  ├─ Head: Amara Mbeki
  └─ Members: [TBD]

Marketing (2 people)
  ├─ Head: Amina Wanjiru
  └─ Members: [TBD]
```

---

## 📋 Pages to Build

### **New Pages (7 total)**

#### **Department Pages** (4)

**1. Department Dashboard** (for dept heads)
```
Left: Team Overview
  - Department name & head
  - Team members (count, active, on leave)
  - Department budget utilization
  - Department KPIs (attendance, performance, goals)

Center: Team Metrics
  - Average performance score
  - Goals completion rate
  - Attendance rate
  - Leave taken YTD
  - Training hours

Right: Team List
  - Quick view of all team members
  - Status badges
  - Performance scores
  - Quick actions (view profile, assign goal, etc.)

Bottom: Department Goals
  - Q2 goals assigned to department
  - Progress tracking
  - Team progress vs company average
```

**2. Team Management**
```
- Searchable/filterable team member list
- Add/remove team members
- Assign managers/leads
- Team member profiles (in drawer)
- Team member performance
- Skill matrix
- Team capacity planning
```

**3. Department Performance**
```
- Department heatmap (similar to company performance)
- Team performance vs company average
- Performance by role/level
- Goal achievement by team member
- Training completion
- Promotion eligible in department
- Attrition risk analysis
```

**4. Department Budget**
```
- Budget allocation (salary, training, benefits)
- Actual spend vs budget
- Headcount breakdown
- Cost per employee
- Budget variances by month
- Forecast for next quarter
- Budget requests/adjustments
```

#### **Workflow Pages** (3)

**5. My Approvals Dashboard**
```
Pending Approvals (grouped by type)
  ├─ Leave Requests (3)
  ├─ Expense Claims (5)
  ├─ Payroll Items (7)
  ├─ Promotions (2)
  ├─ Onboarding Tasks (3)
  └─ Documents (1)

For each item:
  - Submitter name & avatar
  - Item details (amount, dates, reason)
  - Days pending
  - SLA status (on track, at risk, overdue)
  - Quick approve/reject buttons
  - View full details (modal)

Filters:
  - Item type
  - Submitter
  - Department
  - Date range
  - Status
```

**6. Approval History**
```
- All approved/rejected items (searchable)
- Timeline view
- Detailed approval chain (who approved when)
- Comments/feedback
- Approval rationale
- Export capabilities
- Analytics (approval rate, avg time, etc.)
```

**7. Workflow Configuration** (for admins)
```
- Define approval rules (conditions, chain, SLA)
- By workflow type (leave, expense, payroll, promotion)
- By amount/severity thresholds
- Approval chain builder (drag-drop)
- Parallel vs sequential
- SLA settings (warning, deadline)
- Notification preferences
- Test workflow
```

---

## 🔄 Enhanced Existing Pages

### **Leave Management** (Enhanced)
```
Current: Simple approve/reject
New: 
  - Multi-level approval (dept head → manager → HR)
  - Workflow tracking
  - Rejection feedback
  - SLA warnings
  - Approval history
  - Comments
```

### **Payroll** (Enhanced)
```
Current: Individual approve buttons
New:
  - Multi-level approval chain
  - Conditional routing by amount
  - Variance analysis
  - Approval comments
  - Workflow history
  - Batch workflow status
```

### **Expense Claims** (Enhanced)
```
Current: Simple approval
New:
  - Amount-based routing (different approvers)
  - Department-aware
  - Receipt review
  - Comments
  - Approval chain
  - SLA tracking
```

### **Promotions** (Enhanced)
```
Current: Card list
New:
  - Multi-level approval workflow
  - Dept Head → Manager → CEO
  - Comments at each stage
  - Rejection with feedback
  - Letter generation
  - Workflow tracking
```

### **Onboarding** (Enhanced)
```
Current: Simple checklist
New:
  - Task assignment by owner
  - Multi-owner tasks (all must complete)
  - Task approvals
  - Deadline tracking
  - Reassignment capability
  - Task comments
```

---

## 🎨 UI Components Needed

### **New Components**
1. **ApprovalCard** — Shows pending item with quick actions
2. **ApprovalChain** — Visual approval workflow path
3. **SLABadge** — Status indicator (on track, warning, overdue)
4. **WorkflowTimeline** — Approval history visualization
5. **ApprovalComments** — Comment thread on approval
6. **DepartmentMetric** — Styled metric card for dept
7. **TeamMemberCard** — Team member in department list
8. **WorkflowBuilder** — Drag-drop workflow configuration
9. **ApprovalModal** — Full details + approve/reject/comment

### **Enhanced Components**
1. **StatCard** — Add department context
2. **HeatMap** — Department-scoped version
3. **ProgressBar** — SLA tracking variant
4. **Badge** — Workflow status variants

---

## 💾 New Data Integration

### **Workflow Entities**
```
WorkflowInstance
  - id, type (leave, expense, payroll, promotion)
  - submitter_id, submitter_name
  - created_date, deadline
  - status (draft, pending, approved, rejected)
  - current_step (which level)
  - current_approver_id
  - item_data (leave details, expense details, etc.)

ApprovalStep
  - workflow_id, step_number
  - approver_id, approver_type (dept_head, manager, finance, ceo)
  - status (pending, approved, rejected)
  - comments
  - approved_date
  - sla_deadline

ApprovalRule
  - id, workflow_type
  - conditions (if amount > X, if dept == Y, etc.)
  - approval_chain (sequence of approvers)
  - sla_hours
  - parallel_approvals (bool)
```

### **Department Entities**
```
Department
  - id, name, head_id, budget_annual
  - members (list of employee_ids)
  - goals (list of goal_ids)
  - created_date

DepartmentMetrics (calculated)
  - avg_performance, avg_attendance
  - total_headcount, headcount_active
  - total_salary, headcount_cost
  - goals_completion_pct
  - training_hours_per_person
```

---

## 🚀 Implementation Order

1. **Data Models** — Add workflow & department data
2. **Workflow Engine** — Core approval logic
3. **My Approvals Page** — High-value, high-impact
4. **Department Dashboard** — For dept heads
5. **Approval History** — Audit trail
6. **Team Management** — Department operations
7. **Enhanced Pages** — Integration with existing pages
8. **Workflow Configuration** — Admin panel
9. **Notifications** — Alert system

---

## ✨ Key Features

✅ Multi-level approval chains (up to 5 levels)  
✅ Conditional routing (by amount, department, etc.)  
✅ Parallel & sequential approvals  
✅ SLA tracking with warnings  
✅ Approval comments & feedback  
✅ Rejection with reason  
✅ Approval history & audit trail  
✅ Notifications for approvers  
✅ Department dashboards  
✅ Team management  
✅ Department performance tracking  
✅ Budget management by department  
✅ Department KPIs  
✅ Real-time workflow status  

---

## 📊 Expected Outcome

After build:
- ✅ Complete departmental structure visible
- ✅ Department heads have their own dashboards
- ✅ All approvals go through proper workflow
- ✅ Multi-level approvals for high-value items
- ✅ SLA tracking prevents bottlenecks
- ✅ Full approval history for compliance
- ✅ Department performance visible
- ✅ Department budgets tracked
- ✅ Team assignments clear
- ✅ Workflow bottlenecks identified

---

**Ready to build! 🚀**
