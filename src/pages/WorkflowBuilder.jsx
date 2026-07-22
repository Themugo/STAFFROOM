import { useEffect, useState } from 'react'
import { GitBranch, Play, CheckCircle, Clock, AlertCircle, Settings, Users, FileText, Briefcase, DollarSign, Calendar, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { StatCard, Modal, DataTable, StatusBadge, EmptyState, PageHeader, Tabs, Spinner } from '../components/ui'
import { formatDate } from '../lib/format'

const TABS = [
  { id: 'templates', label: 'Workflow Templates' },
  { id: 'executions', label: 'Executions' },
  { id: 'approvals', label: 'My Approvals' },
]

const CATEGORY_CONFIG = {
  LEAVE: { icon: Calendar, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', label: 'Leave' },
  PROCUREMENT: { icon: Briefcase, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', label: 'Procurement' },
  RECRUITMENT: { icon: Users, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400', label: 'Recruitment' },
  EXPENSE: { icon: DollarSign, color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', label: 'Expense' },
  APPROVAL: { icon: FileText, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', label: 'Approval' },
  ONBOARDING: { icon: Users, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400', label: 'Onboarding' },
  OFFBOARDING: { icon: AlertCircle, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', label: 'Offboarding' },
}

export default function WorkflowBuilder() {
  const { profile } = useAuth()
  const { success, error } = useNotifications()
  const [activeTab, setActiveTab] = useState('templates')
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState([])
  const [executions, setExecutions] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', category: 'LEAVE', trigger_type: 'MANUAL' })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [tplRes, execRes] = await Promise.allSettled([
        supabase.from('workflow_templates').select('*').eq('organization_id', profile?.organization_id).order('created_at', { ascending: false }),
        supabase.from('workflow_executions').select('*, template:workflow_templates(name, category)').eq('organization_id', profile?.organization_id).order('created_at', { ascending: false }).limit(20),
      ])

      setTemplates(tplRes.value?.data || [])
      const execs = execRes.value?.data || []
      setExecutions(execs)
      setPendingApprovals(execs.filter(e => e.status === 'PENDING' || e.status === 'IN_PROGRESS'))
    } catch (err) {
      console.error('Workflow load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    totalTemplates: templates.length,
    activeExecutions: executions.filter(e => e.status === 'IN_PROGRESS').length,
    completed: executions.filter(e => e.status === 'COMPLETED').length,
    pendingApprovals: pendingApprovals.length,
  }

  function getCategoryIcon(category) {
    return CATEGORY_CONFIG[category]?.icon || Settings
  }

  function getCategoryColor(category) {
    return CATEGORY_CONFIG[category]?.color || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  async function handleApprove(id) {
    try {
      await supabase.from('workflow_executions').update({ status: 'COMPLETED', completed_at: new Date().toISOString() }).eq('id', id)
      success('Workflow approved successfully')
      loadData()
    } catch {
      error('Failed to approve workflow')
    }
  }

  async function handleReject(id) {
    try {
      await supabase.from('workflow_executions').update({ status: 'REJECTED', completed_at: new Date().toISOString() }).eq('id', id)
      success('Workflow rejected')
      loadData()
    } catch {
      error('Failed to reject workflow')
    }
  }

  async function handleCreateTemplate() {
    if (!form.name) return
    setSaving(true)
    try {
      const { data } = await supabase.from('workflow_templates').insert({
        name: form.name,
        description: form.description,
        category: form.category,
        trigger_type: form.trigger_type,
        version: 1,
        is_active: true,
        created_by: profile?.id,
        organization_id: profile?.organization_id,
      }).select().single()
      if (data) {
        success('Workflow template created')
        setTemplates(prev => [data, ...prev])
        setModal(null)
        setForm({ name: '', description: '', category: 'LEAVE', trigger_type: 'MANUAL' })
      }
    } catch {
      error('Failed to create workflow template')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  const executionColumns = [
    {
      key: 'workflow',
      header: 'Workflow',
      render: (row) => <span className="font-medium text-gray-900 dark:text-white">{row.template?.name || row.name || 'Unnamed'}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => {
        const cat = row.template?.category || row.category
        const CategoryIcon = getCategoryIcon(cat)
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cat)}`}>
            <CategoryIcon size={12} />
            {CATEGORY_CONFIG[cat]?.label || cat}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'startedAt',
      header: 'Started',
      render: (row) => <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(row.created_at || row.started_at)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflow Builder"
        description="Automate your business processes with intelligent workflows"
        icon={GitBranch}
        actions={
          <button onClick={() => setModal('create')} className="btn-primary">
            <Plus size={16} className="mr-1" /> Create Workflow
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={GitBranch} label="Templates" value={stats.totalTemplates} color="purple" />
        <StatCard icon={Play} label="Active Executions" value={stats.activeExecutions} color="blue" />
        <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="green" />
        <StatCard icon={Clock} label="Pending Approvals" value={stats.pendingApprovals} color="yellow" />
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.length === 0 ? (
            <div className="col-span-full">
              <div className="card">
                <EmptyState icon={GitBranch} title="No workflow templates found" description="Create your first workflow template to get started." />
              </div>
            </div>
          ) : templates.map(template => {
            const CategoryIcon = getCategoryIcon(template.category)
            return (
              <div key={template.id} className="card p-5 hover:shadow-lg transition group dark:bg-gray-900 dark:border dark:border-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(template.category)}`}>
                      <CategoryIcon size={12} />
                      {CATEGORY_CONFIG[template.category]?.label || template.category}
                    </span>
                    {template.is_active ? (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Inactive</span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${template.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {template.is_active ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {template.is_active ? 'Live' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{template.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span>v{template.version || 1} • {template.trigger_type || 'Manual'}</span>
                  <span>{executions.filter(e => e.template_id === template.id).length} executions</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'executions' && (
        <DataTable
          columns={executionColumns}
          data={executions}
          emptyIcon={Play}
          emptyTitle="No workflow executions"
          emptyDescription="Workflow executions will appear here once started."
        />
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="card">
              <EmptyState icon={CheckCircle} title="No pending approvals" description="You're all caught up — no approvals waiting on you." />
            </div>
          ) : pendingApprovals.map(approval => {
            const cat = approval.template?.category || approval.category
            const CategoryIcon = getCategoryIcon(cat)
            return (
              <div key={approval.id} className="card p-5 hover:shadow-md transition dark:bg-gray-900 dark:border dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getCategoryColor(cat)}`}>
                      <CategoryIcon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{approval.template?.name || 'Workflow'}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Started {formatDate(approval.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(approval.id)} className="btn-primary">
                      <CheckCircle size={14} className="mr-1" /> Approve
                    </button>
                    <button onClick={() => handleReject(approval.id)} className="btn-danger">
                      <AlertCircle size={14} className="mr-1" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        open={modal === 'create'}
        onClose={() => setModal(null)}
        title="Create Workflow Template"
        size="sm"
        footer={
          <>
            <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreateTemplate} disabled={saving} className="btn-primary">
              {saving ? 'Creating...' : 'Create Template'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Workflow Name *</label>
            <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Leave Approval" />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Trigger Type</label>
            <select className="input" value={form.trigger_type} onChange={e => setForm({ ...form, trigger_type: e.target.value })}>
              <option value="MANUAL">Manual</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="EVENT">Event-based</option>
              <option value="WEBHOOK">Webhook</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this workflow..." />
          </div>
        </div>
      </Modal>
    </div>
  )
}
