import React, { useState, useEffect, useMemo } from 'react'
import {
  Building2, Users, CheckSquare, Briefcase, Calendar, BookOpen,
  Target, BarChart3, MessageSquare, ShieldCheck, Bot, Network, Plus,
  Search, Filter, Clock, FileText, CheckCircle2, ChevronRight,
  DollarSign, Layers, Download, Settings, Send, HardDrive, GitFork,
  Activity, Shield, RefreshCw
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { initials } from '../lib/format'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import { PageHeader, Modal } from '../components/ui'

// Import Tab Components
import DepartmentHierarchyHeader from '../components/department/DepartmentHierarchyHeader'
import DepartmentDashboardTab from '../components/department/DepartmentDashboardTab'
import DepartmentPeopleTab from '../components/department/DepartmentPeopleTab'
import DepartmentOperationsTab from '../components/department/DepartmentOperationsTab'
import DepartmentWorkflowTab from '../components/department/DepartmentWorkflowTab'
import DepartmentRosterTab from '../components/department/DepartmentRosterTab'
import DepartmentBudgetTab from '../components/department/DepartmentBudgetTab'
import DepartmentReportsTab from '../components/department/DepartmentReportsTab'
import DepartmentDocumentsTab from '../components/department/DepartmentDocumentsTab'
import DepartmentKpisTab from '../components/department/DepartmentKpisTab'
import DepartmentSettingsTab from '../components/department/DepartmentSettingsTab'

// Initial Data Generators
const INITIAL_TASKS = [
  { id: 't-1', title: 'Q3 Staffing Strategy Review', deptId: 'dept_hr', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'Sarah Jenkins', dueDate: '2026-08-15', category: 'Strategy' },
  { id: 't-2', title: 'Migrate Auth Service to OAuth2', deptId: 'dept_eng', status: 'IN_PROGRESS', priority: 'CRITICAL', assignee: 'David Miller', dueDate: '2026-08-12', category: 'DevOps' },
  { id: 't-3', title: 'Prepare FY27 Operating Budget Draft', deptId: 'dept_fin', status: 'TODO', priority: 'HIGH', assignee: 'Michael Chen', dueDate: '2026-08-20', category: 'Finance' },
  { id: 't-4', title: 'Enterprise Sales Pitch Deck v4', deptId: 'dept_sales', status: 'COMPLETED', priority: 'MEDIUM', assignee: 'Rachel Green', dueDate: '2026-07-30', category: 'Marketing' },
  { id: 't-5', title: 'HQ Facility Safety Audit', deptId: 'dept_ops', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: 'James Wilson', dueDate: '2026-08-18', category: 'Safety' },
]

const INITIAL_PROJECTS = [
  { id: 'p-1', name: 'StaffRoom Phase 8 OS Deployment', deptId: 'dept_eng', status: 'On Track', health: 'HEALTHY', budget: 45000, spent: 32000, lead: 'David Miller', deadline: '2026-08-20', completion: 82 },
  { id: 'p-2', name: 'Global Talent Onboarding Overhaul', deptId: 'dept_hr', status: 'On Track', health: 'HEALTHY', budget: 25000, spent: 18500, lead: 'Sarah Jenkins', deadline: '2026-09-01', completion: 65 },
  { id: 'p-3', name: 'Automated Tax Compliance Module', deptId: 'dept_fin', status: 'At Risk', health: 'WARNING', budget: 60000, spent: 54000, lead: 'Michael Chen', deadline: '2026-08-25', completion: 45 },
]

const INITIAL_APPROVALS = [
  { id: 'app-1', type: 'Leave Request', applicant: 'Alex Rivers', deptId: 'dept_eng', amountOrDays: '3 Days Paid Leave', date: '2026-08-01', status: 'PENDING' },
  { id: 'app-2', type: 'Equipment Purchase', applicant: 'Emma Watson', deptId: 'dept_hr', amountOrDays: '$1,200 (MacBook Monitor)', date: '2026-08-02', status: 'PENDING' },
  { id: 'app-3', type: 'Travel Expense Claim', applicant: 'Carlos Ruiz', deptId: 'dept_sales', amountOrDays: '$850 (Client Summit)', date: '2026-08-03', status: 'PENDING' },
]

const INITIAL_ANNOUNCEMENTS = [
  { id: 'anc-1', title: 'Q3 All-Hands Department Strategy Meeting', deptId: 'dept_hr', date: '2026-08-01', author: 'Sarah Jenkins', pinned: true, content: 'Please review the updated department KPIs prior to Friday\'s review session.' },
  { id: 'anc-2', title: 'Scheduled Infrastructure Maintenance Window', deptId: 'dept_eng', date: '2026-08-03', author: 'DevOps Lead', pinned: false, content: 'Production cluster upgrade scheduled for Sunday at 02:00 UTC.' }
]

export default function Departments() {
  const {
    departments,
    activeDepartmentId,
    setActiveDepartmentId,
    userDepartment,
    filterByDepartment,
    isDepartmentScoped,
    isElevatedRole
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Main Operating System Views
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, people, operations, workflow, roster, budget, reports, documents, kpis, settings, ai
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS)
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS)

  // AI Chat Assistant State
  const [aiQuery, setAiQuery] = useState('')
  const [aiChat, setAiChat] = useState([
    { sender: 'bot', text: 'Hello! I am your Department AI Workspace Assistant. I have scoped access to your department\'s active projects, SOPs, tasks, rosters, and budgets. How can I assist your team today?' }
  ])
  const [aiLoading, setAiLoading] = useState(false)

  // Modals & Forms State
  const [modalType, setModalType] = useState(null) // 'task', 'announcement'
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'MEDIUM', dueDate: '', category: 'General' })
  const [ancForm, setAncForm] = useState({ title: '', content: '' })

  // Supabase departments sync
  const [dbDepartments, setDbDepartments] = useState([])

  useEffect(() => {
    loadDbDepartments()
  }, [])

  async function loadDbDepartments() {
    try {
      const { data } = await supabase
        .from('departments')
        .select('*')
        .order('name')
      if (data) setDbDepartments(data)
    } catch (e) {
      console.error(e)
    }
  }

  // Currently Selected Department Object
  const currentDeptObj = useMemo(() => {
    return departments.find((d) => d.id === activeDepartmentId) || userDepartment || departments[0]
  }, [departments, activeDepartmentId, userDepartment])

  const filteredTasks = useMemo(() => filterByDepartment(tasks), [tasks, activeDepartmentId])
  const filteredProjects = useMemo(() => filterByDepartment(projects), [projects, activeDepartmentId])
  const filteredApprovals = useMemo(() => filterByDepartment(approvals), [approvals, activeDepartmentId])
  const filteredAnnouncements = useMemo(() => filterByDepartment(announcements), [announcements, activeDepartmentId])

  // Handlers
  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!taskForm.title) return
    const newTask = {
      id: `t-${Date.now()}`,
      title: taskForm.title,
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      status: 'TODO',
      priority: taskForm.priority,
      assignee: 'Current User',
      dueDate: taskForm.dueDate || '2026-08-30',
      category: taskForm.category
    }
    setTasks([newTask, ...tasks])
    setTaskForm({ title: '', priority: 'MEDIUM', dueDate: '', category: 'General' })
    setModalType(null)
    showSuccess(`New task "${newTask.title}" added to ${currentDeptObj.name}!`)
  }

  const handleCreateAnnouncement = (e) => {
    e.preventDefault()
    if (!ancForm.title) return
    const newAnc = {
      id: `anc-${Date.now()}`,
      title: ancForm.title,
      content: ancForm.content,
      deptId: activeDepartmentId === 'ALL' ? 'dept_eng' : activeDepartmentId,
      date: new Date().toISOString().split('T')[0],
      author: currentDeptObj.head || 'Department Manager',
      pinned: false
    }
    setAnnouncements([newAnc, ...announcements])
    setAncForm({ title: '', content: '' })
    setModalType(null)
    showSuccess(`Announcement posted to ${currentDeptObj.name}!`)
  }

  const handleApproveRequest = (id, approved) => {
    setApprovals(approvals.map((a) => a.id === id ? { ...a, status: approved ? 'APPROVED' : 'REJECTED' } : a))
    showSuccess(`Approval request ${approved ? 'approved' : 'rejected'}.`)
  }

  const handleAiSend = (e) => {
    e.preventDefault()
    if (!aiQuery.trim()) return
    const userMsg = aiQuery
    setAiQuery('')
    setAiChat((prev) => [...prev, { sender: 'user', text: userMsg }])
    setAiLoading(true)

    setTimeout(() => {
      let botResponse = `Based on ${currentDeptObj.name} records: We have ${filteredTasks.length} active tasks, ${filteredProjects.length} key projects, and ${currentDeptObj.memberCount || 28} assigned members.`
      if (userMsg.toLowerCase().includes('budget')) {
        botResponse = `Department Budget Analysis for ${currentDeptObj.name}: Total allocated operating budget is $110,000, with 74% currently committed across SaaS, Hardware, and Training line items.`
      } else if (userMsg.toLowerCase().includes('sop') || userMsg.toLowerCase().includes('policy')) {
        botResponse = `Verified SOP Policy: According to ${currentDeptObj.name} Standard Operating Procedure (v2.4), all expense claims > $500 require Department Manager approval.`
      } else if (userMsg.toLowerCase().includes('roster') || userMsg.toLowerCase().includes('shift')) {
        botResponse = `${currentDeptObj.name} Duty Roster: Morning shift runs 08:00 - 16:30, Evening shift 14:00 - 22:30. Current shift fulfillment rate is 96.4%.`
      }
      setAiChat((prev) => [...prev, { sender: 'bot', text: botResponse }])
      setAiLoading(false)
    }, 800)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <PageHeader
        title={`${currentDeptObj.name} Department Operating System`}
        description={`Secure operational workspace for ${currentDeptObj.name} — Manage people, tasks, workflows, rosters, budgets, documents, and KPIs.`}
        icon={Building2}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setModalType('task')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> New Task
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Bot size={14} /> AI Co-Pilot
            </button>
          </div>
        }
      />

      {/* Hierarchy Flow Header Banner */}
      <DepartmentHierarchyHeader currentDept={currentDeptObj} isElevatedRole={isElevatedRole} />

      {/* Workspace Quick Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">Active Department Workspace</span>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {currentDeptObj.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                {currentDeptObj.code}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Quick Switch Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setActiveDepartmentId('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
              activeDepartmentId === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Workspaces
          </button>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDepartmentId(d.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer shrink-0 ${
                activeDepartmentId === d.id
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {d.code}
            </button>
          ))}
        </div>
      </div>

      {/* Main 10 Required Department OS Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'dashboard', label: 'Department Dashboard', icon: Building2 },
          { id: 'people', label: 'People', icon: Users },
          { id: 'operations', label: 'Operations', icon: HardDrive },
          { id: 'workflow', label: 'Workflow', icon: GitFork },
          { id: 'roster', label: 'Roster', icon: Calendar },
          { id: 'budget', label: 'Budget', icon: DollarSign },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'documents', label: 'Documents', icon: BookOpen },
          { id: 'kpis', label: 'KPIs', icon: Target },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'ai', label: 'AI Co-Pilot', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB CONTENT SWITCHING */}
      {activeTab === 'dashboard' && (
        <DepartmentDashboardTab
          currentDept={currentDeptObj}
          tasks={filteredTasks}
          projects={filteredProjects}
          approvals={filteredApprovals}
          announcements={filteredAnnouncements}
          onOpenModal={setModalType}
          onApproveRequest={handleApproveRequest}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'people' && (
        <DepartmentPeopleTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'operations' && (
        <DepartmentOperationsTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'workflow' && (
        <DepartmentWorkflowTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'roster' && (
        <DepartmentRosterTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'budget' && (
        <DepartmentBudgetTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'reports' && (
        <DepartmentReportsTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'documents' && (
        <DepartmentDocumentsTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'kpis' && (
        <DepartmentKpisTab currentDept={currentDeptObj} showSuccess={showSuccess} />
      )}

      {activeTab === 'settings' && (
        <DepartmentSettingsTab currentDept={currentDeptObj} isElevatedRole={isElevatedRole} showSuccess={showSuccess} />
      )}

      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Department AI Co-Pilot ({currentDeptObj.name})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scoped strictly to {currentDeptObj.name} documents, SOPs, budgets, and project telemetry.</p>
              </div>
            </div>

            <div className="h-80 overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              {aiChat.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 animate-pulse text-xs">
                    Synthesizing response for {currentDeptObj.name}...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleAiSend} className="flex gap-2">
              <input
                type="text"
                placeholder={`Ask AI about ${currentDeptObj.name} tasks, SOPs, rosters, or budget...`}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="btn-primary text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 cursor-pointer">
                <Send size={14} /> Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {modalType === 'task' && (
        <Modal
          open={true}
          onClose={() => setModalType(null)}
          title={`New Task for ${currentDeptObj.name}`}
          size="md"
        >
          <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
            <div>
              <label className="label">Task Title *</label>
              <input
                className="input"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g. Complete Q3 Compliance Review"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Priority</label>
                <select
                  className="input"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="label">Due Date</label>
                <input
                  type="date"
                  className="input"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalType(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Task</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Post Announcement Modal */}
      {modalType === 'announcement' && (
        <Modal
          open={true}
          onClose={() => setModalType(null)}
          title={`Post Comms for ${currentDeptObj.name}`}
          size="md"
        >
          <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
            <div>
              <label className="label">Announcement Title *</label>
              <input
                className="input"
                value={ancForm.title}
                onChange={(e) => setAncForm({ ...ancForm, title: e.target.value })}
                placeholder="e.g. Q3 All-Hands Review Session"
                required
              />
            </div>
            <div>
              <label className="label">Content *</label>
              <textarea
                rows={4}
                className="input"
                value={ancForm.content}
                onChange={(e) => setAncForm({ ...ancForm, content: e.target.value })}
                placeholder="Write announcement details..."
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalType(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Post Announcement</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
