import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import PageHeader from '../components/ui/PageHeader'
import Modal from '../components/ui/Modal'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Tabs from '../components/ui/Tabs'
import {
  CalendarDays,
  ListChecks,
  Eye,
  Plus,
  Pencil,
  Power,
  FileText,
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  CalendarClock,
  FileCheck,
  Settings2,
} from 'lucide-react'

const DEFAULT_RULE = {
  leave_type: '',
  display_name: '',
  annual_entitlement: 21,
  monthly_accrual_enabled: false,
  accrual_rate: 1.75,
  max_carry_forward: 10,
  probation_restricted: false,
  min_service_months: 0,
  half_day_allowed: false,
  negative_leave_allowed: false,
  max_negative_leave: 0,
  encashment_allowed: false,
  encashment_rate: 0,
  weekend_inclusive: false,
  holiday_inclusive: false,
  requires_document: false,
}

const TABS = [
  { id: 'policies', label: 'Leave Policies' },
  { id: 'rules', label: 'Leave Rules' },
  { id: 'preview', label: 'Preview' },
]

const SERVICE_MONTHS_OPTIONS = [3, 6, 12, 24, 36]

export default function LeavePolicyEngine() {
  const { profile } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const organizationId = profile?.organization_id

  const [activeTab, setActiveTab] = useState('policies')
  const [loading, setLoading] = useState(true)
  const [policies, setPolicies] = useState([])
  const [rules, setRules] = useState([])
  const [rulesLoading, setRulesLoading] = useState(false)
  const [selectedPolicyId, setSelectedPolicyId] = useState(null)

  // Policy modal
  const [policyModalOpen, setPolicyModalOpen] = useState(false)
  const [policyForm, setPolicyForm] = useState({ name: '', description: '' })
  const [policySaving, setPolicySaving] = useState(false)

  // Rule modal
  const [ruleModalOpen, setRuleModalOpen] = useState(false)
  const [ruleForm, setRuleForm] = useState(DEFAULT_RULE)
  const [editingRuleId, setEditingRuleId] = useState(null)
  const [ruleSaving, setRuleSaving] = useState(false)

  // Preview service months (M16: was hardcoded to 12)
  const [previewServiceMonths, setPreviewServiceMonths] = useState(12)

  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId) || null

  // ---------- Fetch policies ----------
  const fetchPolicies = useCallback(async () => {
    if (!organizationId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('leave_policies')
      .select('*, leave_policy_rules(count)')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    if (error) {
      notifyError('Failed to load leave policies')
    } else {
      const normalized = (data || []).map((p) => ({
        ...p,
        rule_count: p.leave_policy_rules?.[0]?.count ?? 0,
      }))
      setPolicies(normalized)
      if (!selectedPolicyId && normalized.length > 0) {
        setSelectedPolicyId(normalized[0].id)
      }
    }
    setLoading(false)
  }, [organizationId, selectedPolicyId, notifyError])

  // ---------- Fetch rules for selected policy ----------
  const fetchRules = useCallback(async () => {
    if (!selectedPolicyId) {
      setRules([])
      return
    }
    setRulesLoading(true)
    const { data, error } = await supabase
      .from('leave_policy_rules')
      .select('*')
      .eq('policy_id', selectedPolicyId)
      .order('created_at', { ascending: true })
    if (error) {
      notifyError('Failed to load leave rules')
    } else {
      setRules(data || [])
    }
    setRulesLoading(false)
  }, [selectedPolicyId, notifyError])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  // ---------- Create policy ----------
  const openPolicyModal = () => {
    setPolicyForm({ name: '', description: '' })
    setPolicyModalOpen(true)
  }

  const handleCreatePolicy = async () => {
    if (!policyForm.name.trim()) {
      notifyError('Policy name is required')
      return
    }
    if (!organizationId) {
      notifyError('No organization found')
      return
    }
    setPolicySaving(true)
    const { data, error } = await supabase
      .from('leave_policies')
      .insert({
        name: policyForm.name.trim(),
        description: policyForm.description.trim(),
        organization_id: organizationId,
        is_active: true,
      })
      .select()
      .single()
    setPolicySaving(false)
    if (error) {
      notifyError(error.message || 'Failed to create policy')
      return
    }
    success('Policy created successfully')
    setPolicyModalOpen(false)
    setPolicies((prev) => [{ ...data, rule_count: 0 }, ...prev])
    setSelectedPolicyId(data.id)
  }

  // ---------- Toggle policy active ----------
  const togglePolicyActive = async (policy) => {
    const { error } = await supabase
      .from('leave_policies')
      .update({ is_active: !policy.is_active })
      .eq('id', policy.id)
    if (error) {
      notifyError('Failed to update policy status')
      return
    }
    success(`Policy ${!policy.is_active ? 'activated' : 'deactivated'}`)
    setPolicies((prev) =>
      prev.map((p) => (p.id === policy.id ? { ...p, is_active: !p.is_active } : p))
    )
  }

  // ---------- Select policy ----------
  const selectPolicy = (id) => {
    setSelectedPolicyId(id)
    if (activeTab === 'policies') setActiveTab('rules')
  }

  // ---------- Rule modal ----------
  const openCreateRuleModal = () => {
    setRuleForm(DEFAULT_RULE)
    setEditingRuleId(null)
    setRuleModalOpen(true)
  }

  const openEditRuleModal = (rule) => {
    setRuleForm({ ...DEFAULT_RULE, ...rule })
    setEditingRuleId(rule.id)
    setRuleModalOpen(true)
  }

  const handleSaveRule = async () => {
    if (!ruleForm.leave_type.trim()) {
      notifyError('Leave type is required')
      return
    }
    if (!selectedPolicyId) {
      notifyError('No policy selected')
      return
    }
    setRuleSaving(true)

    const payload = {
      policy_id: selectedPolicyId,
      leave_type: ruleForm.leave_type.trim(),
      display_name: ruleForm.display_name.trim() || ruleForm.leave_type.trim(),
      annual_entitlement: Number(ruleForm.annual_entitlement) || 0,
      monthly_accrual_enabled: !!ruleForm.monthly_accrual_enabled,
      accrual_rate: Number(ruleForm.accrual_rate) || 0,
      max_carry_forward: Number(ruleForm.max_carry_forward) || 0,
      probation_restricted: !!ruleForm.probation_restricted,
      min_service_months: Number(ruleForm.min_service_months) || 0,
      half_day_allowed: !!ruleForm.half_day_allowed,
      negative_leave_allowed: !!ruleForm.negative_leave_allowed,
      max_negative_leave: Number(ruleForm.max_negative_leave) || 0,
      encashment_allowed: !!ruleForm.encashment_allowed,
      encashment_rate: Number(ruleForm.encashment_rate) || 0,
      weekend_inclusive: !!ruleForm.weekend_inclusive,
      holiday_inclusive: !!ruleForm.holiday_inclusive,
      requires_document: !!ruleForm.requires_document,
    }

    let res
    if (editingRuleId) {
      res = await supabase.from('leave_policy_rules').update(payload).eq('id', editingRuleId).select().single()
    } else {
      res = await supabase.from('leave_policy_rules').insert(payload).select().single()
    }
    setRuleSaving(false)

    if (res.error) {
      notifyError(res.error.message || 'Failed to save rule')
      return
    }
    success(editingRuleId ? 'Rule updated' : 'Rule created')
    setRuleModalOpen(false)
    setRules((prev) => {
      if (editingRuleId) {
        return prev.map((r) => (r.id === editingRuleId ? res.data : r))
      }
      return [...prev, res.data]
    })
    // refresh policy rule counts
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === selectedPolicyId
          ? { ...p, rule_count: editingRuleId ? p.rule_count : (p.rule_count || 0) + 1 }
          : p
      )
    )
  }

  // ---------- Stats ----------
  const activePolicyCount = policies.filter((p) => p.is_active).length
  const totalRules = rules.length
  const totalEntitlement = rules.reduce((sum, r) => sum + (Number(r.annual_entitlement) || 0), 0)

  // ---------- Preview computation ----------
  const previewEarnedPerYear = rules.reduce(
    (sum, r) => sum + (Number(r.annual_entitlement) || 0),
    0
  )
  const previewMonthlyAccrual = rules
    .filter((r) => r.monthly_accrual_enabled)
    .reduce((sum, r) => sum + (Number(r.accrual_rate) || 0), 0)
  const previewMaxCarryForward = Math.max(
    0,
    ...rules.map((r) => Number(r.max_carry_forward) || 0)
  )
  const previewProbationRestricted = rules.some((r) => r.probation_restricted)

  return (
    <div>
      <PageHeader
        title="Leave Policy Engine"
        description="Configure leave policies, rules, and entitlements for your organization"
        icon={Settings2}
        actions={
          activeTab === 'policies' ? (
            <button
              onClick={openPolicyModal}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus size={16} /> New Policy
            </button>
          ) : activeTab === 'rules' && selectedPolicy ? (
            <button
              onClick={openCreateRuleModal}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <Plus size={16} /> New Rule
            </button>
          ) : null
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          icon={FileText}
          label="Total Policies"
          value={policies.length}
          sublabel={`${activePolicyCount} active`}
          color="blue"
          loading={loading}
        />
        <StatCard
          icon={ListChecks}
          label="Rules in Policy"
          value={selectedPolicy ? totalRules : '—'}
          sublabel={selectedPolicy ? selectedPolicy.name : 'Select a policy'}
          color="purple"
          loading={loading}
        />
        <StatCard
          icon={CalendarDays}
          label="Total Annual Entitlement"
          value={selectedPolicy ? `${totalEntitlement} days` : '—'}
          sublabel={selectedPolicy ? 'Across all rules' : 'Select a policy'}
          color="green"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Accrual Rules"
          value={selectedPolicy ? rules.filter((r) => r.monthly_accrual_enabled).length : '—'}
          sublabel={selectedPolicy ? 'Enabled' : 'Select a policy'}
          color="cyan"
          loading={loading}
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* ---------- Policies Tab ---------- */}
      {activeTab === 'policies' && (
        <div>
          {loading ? (
            <Spinner className="py-16" />
          ) : policies.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No leave policies yet"
              description="Create your first leave policy to start defining leave types and entitlements."
              action={
                <button
                  onClick={openPolicyModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Plus size={16} /> New Policy
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  className={`card p-5 flex flex-col ${
                    selectedPolicyId === policy.id ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {policy.name}
                        </h3>
                        <span
                          className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            policy.is_active
                              ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              policy.is_active ? 'bg-success-500' : 'bg-gray-400'
                            }`}
                          />
                          {policy.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                    {policy.description || 'No description provided.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ListChecks size={14} />
                    {policy.rule_count} {policy.rule_count === 1 ? 'rule' : 'rules'}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <button
                      onClick={() => selectPolicy(policy.id)}
                      className="flex-1 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 dark:hover:bg-brand-900/50"
                    >
                      View Rules
                    </button>
                    <button
                      onClick={() => togglePolicyActive(policy)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                        policy.is_active
                          ? 'text-danger-700 bg-danger-50 hover:bg-danger-100 dark:text-danger-300 dark:bg-danger-900/30 dark:hover:bg-danger-900/50'
                          : 'text-success-700 bg-success-50 hover:bg-success-100 dark:text-success-300 dark:bg-success-900/30 dark:hover:bg-success-900/50'
                      }`}
                    >
                      <Power size={14} />
                      {policy.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------- Rules Tab ---------- */}
      {activeTab === 'rules' && (
        <div>
          {!selectedPolicy ? (
            <EmptyState
              icon={ListChecks}
              title="No policy selected"
              description="Go to the Leave Policies tab and select a policy to manage its rules."
            />
          ) : rulesLoading ? (
            <Spinner className="py-16" />
          ) : rules.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No leave rules yet"
              description={`Add leave type rules to the "${selectedPolicy.name}" policy.`}
              action={
                <button
                  onClick={openCreateRuleModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  <Plus size={16} /> New Rule
                </button>
              }
            />
          ) : (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedPolicy.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {rules.length} {rules.length === 1 ? 'rule' : 'rules'} configured
                </p>
              </div>
            </div>
          )}

          {rules.length > 0 && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rules.map((rule) => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  onEdit={() => openEditRuleModal(rule)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------- Preview Tab ---------- */}
      {activeTab === 'preview' && (
        <div>
          {!selectedPolicy ? (
            <EmptyState
              icon={Eye}
              title="No policy selected"
              description="Select a policy to preview how it works for an employee."
            />
          ) : rules.length === 0 ? (
            <EmptyState
              icon={Eye}
              title="Nothing to preview"
              description={`The "${selectedPolicy.name}" policy has no rules configured yet.`}
            />
          ) : (
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                    <Eye size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Policy Preview — {selectedPolicy.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      How this policy applies to an employee with {previewServiceMonths} months of service
                    </p>
                  </div>
                </div>

                {/* Service months selector (M16) */}
                <div className="mt-4 flex items-center gap-3">
                  <label
                    htmlFor="preview-service-months"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Service months:
                  </label>
                  <select
                    id="preview-service-months"
                    value={previewServiceMonths}
                    onChange={(e) => setPreviewServiceMonths(Number(e.target.value))}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    {SERVICE_MONTHS_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} months
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <PreviewItem
                    icon={CalendarDays}
                    label="Annual Entitlement"
                    value={`${previewEarnedPerYear} days/year`}
                    description="Total earned across all leave types"
                    color="green"
                  />
                  <PreviewItem
                    icon={TrendingUp}
                    label="Monthly Accrual"
                    value={`${previewMonthlyAccrual.toFixed(2)} days/month`}
                    description="Sum of accrual rates for enabled rules"
                    color="cyan"
                  />
                  <PreviewItem
                    icon={CalendarClock}
                    label="Maximum Carry Forward"
                    value={`${previewMaxCarryForward} days`}
                    description="Highest carry-forward cap among rules"
                    color="blue"
                  />
                  <PreviewItem
                    icon={AlertTriangle}
                    label="Probation Restriction"
                    value={previewProbationRestricted ? 'Yes' : 'No'}
                    description="At least one rule restricts during probation"
                    color={previewProbationRestricted ? 'yellow' : 'gray'}
                  />
                </div>
              </div>

              {/* Per-rule breakdown */}
              <div className="card p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Per Leave Type Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2 pr-4 font-medium">Leave Type</th>
                        <th className="pb-2 pr-4 font-medium">Entitlement</th>
                        <th className="pb-2 pr-4 font-medium">Accrual</th>
                        <th className="pb-2 pr-4 font-medium">Carry Fwd</th>
                        <th className="pb-2 pr-4 font-medium">Probation</th>
                        <th className="pb-2 font-medium">Half Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map((rule) => (
                        <tr
                          key={rule.id}
                          className="border-b border-gray-100 dark:border-gray-800/50"
                        >
                          <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                            {rule.display_name || rule.leave_type}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {rule.annual_entitlement} days
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {rule.monthly_accrual_enabled
                              ? `${rule.accrual_rate}/mo`
                              : '—'}
                          </td>
                          <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                            {rule.max_carry_forward} days
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              value={rule.probation_restricted}
                              yesLabel="Restricted"
                              noLabel="Open"
                            />
                          </td>
                          <td className="py-3">
                            <Badge
                              value={rule.half_day_allowed}
                              yesLabel="Yes"
                              noLabel="No"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Narrative summary */}
              <div className="card p-6">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  Summary
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CalendarDays size={16} className="mt-0.5 text-brand-500" />
                    <span>
                      An employee with <strong>{previewServiceMonths} months</strong> of service earns{' '}
                      <strong>{previewEarnedPerYear} days</strong> per year across all leave types.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp size={16} className="mt-0.5 text-brand-500" />
                    <span>
                      Monthly accrual: <strong>{previewMonthlyAccrual.toFixed(2)} days/month</strong>{' '}
                      {previewMonthlyAccrual > 0
                        ? '(accrued progressively throughout the year)'
                        : '(no monthly accrual rules enabled)'}
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CalendarClock size={16} className="mt-0.5 text-brand-500" />
                    <span>
                      Maximum carry forward: <strong>{previewMaxCarryForward} days</strong> into the next leave year.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle size={16} className="mt-0.5 text-brand-500" />
                    <span>
                      Probation restriction: <strong>{previewProbationRestricted ? 'Yes' : 'No'}</strong>
                      {previewProbationRestricted
                        ? ' — some leave types are restricted during the probation period.'
                        : ' — all leave types are available during probation.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------- Create Policy Modal ---------- */}
      <Modal
        open={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        title="New Leave Policy"
        description="Create a new leave policy for your organization."
        size="md"
        footer={
          <>
            <button
              onClick={() => setPolicyModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePolicy}
              disabled={policySaving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {policySaving ? 'Creating...' : 'Create Policy'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Policy Name <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={policyForm.name}
              onChange={(e) => setPolicyForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Standard Leave Policy 2025"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={policyForm.description}
              onChange={(e) => setPolicyForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of this policy..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>
      </Modal>

      {/* ---------- Create / Edit Rule Modal ---------- */}
      <Modal
        open={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        title={editingRuleId ? 'Edit Leave Rule' : 'New Leave Rule'}
        description={
          selectedPolicy
            ? `Configure rule for "${selectedPolicy.name}"`
            : 'Configure a new leave type rule'
        }
        size="xl"
        footer={
          <>
            <button
              onClick={() => setRuleModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRule}
              disabled={ruleSaving}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {ruleSaving ? 'Saving...' : editingRuleId ? 'Update Rule' : 'Create Rule'}
            </button>
          </>
        }
      >
        <RuleForm form={ruleForm} setForm={setRuleForm} />
      </Modal>
    </div>
  )
}

// ============================================================
// RuleCard component
// ============================================================
function RuleCard({ rule, onEdit }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
            <CalendarDays size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {rule.display_name || rule.leave_type}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {rule.leave_type}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <RuleField icon={CalendarDays} label="Annual Entitlement" value={`${rule.annual_entitlement} days`} />
        <RuleField
          icon={TrendingUp}
          label="Monthly Accrual"
          value={rule.monthly_accrual_enabled ? `${rule.accrual_rate}/mo` : 'Disabled'}
        />
        <RuleField icon={CalendarClock} label="Max Carry Forward" value={`${rule.max_carry_forward} days`} />
        <RuleField icon={Clock} label="Min Service" value={`${rule.min_service_months || 0} months`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Badge value={rule.probation_restricted} yesLabel="Probation Restricted" noLabel="No Probation Limit" />
        <Badge value={rule.half_day_allowed} yesLabel="Half Day" noLabel="No Half Day" />
        <Badge value={rule.negative_leave_allowed} yesLabel={`Negative (up to ${rule.max_negative_leave})`} noLabel="No Negative" />
        <Badge value={rule.encashment_allowed} yesLabel={`Encashable (${rule.encashment_rate})`} noLabel="No Encashment" />
        <Badge value={rule.weekend_inclusive} yesLabel="Weekends Incl." noLabel="Weekends Excl." />
        <Badge value={rule.holiday_inclusive} yesLabel="Holidays Incl." noLabel="Holidays Excl." />
        <Badge value={rule.requires_document} yesLabel="Doc Required" noLabel="No Doc" />
      </div>
    </div>
  )
}

function RuleField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-gray-400" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}

function Badge({ value, yesLabel, noLabel }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
        value
          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      {value ? yesLabel : noLabel}
    </span>
  )
}

// ============================================================
// PreviewItem component
// ============================================================
function PreviewItem({ icon: Icon, label, value, description, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400',
    green: 'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400',
    cyan: 'bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400',
    yellow: 'bg-warning-100 text-warning-600 dark:bg-warning-900/40 dark:text-warning-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{description}</p>
      )}
    </div>
  )
}

// ============================================================
// RuleForm component (used inside the modal)
// ============================================================
function RuleForm({ form, setForm }) {
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="space-y-6">
      {/* Section: Basic */}
      <FormSection title="Basic Information" icon={FileText}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Leave Type" required hint="e.g. Annual, Sick, Maternity">
            <input
              type="text"
              value={form.leave_type}
              onChange={(e) => update('leave_type', e.target.value)}
              placeholder="Annual"
              className={inputClass}
            />
          </FormField>
          <FormField label="Display Name" hint="Shown to employees">
            <input
              type="text"
              value={form.display_name}
              onChange={(e) => update('display_name', e.target.value)}
              placeholder="Annual Leave"
              className={inputClass}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Section: Entitlement & Accrual */}
      <FormSection title="Entitlement & Accrual" icon={CalendarDays}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField label="Annual Entitlement (days)">
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.annual_entitlement}
              onChange={(e) => update('annual_entitlement', e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Max Carry Forward (days)">
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.max_carry_forward}
              onChange={(e) => update('max_carry_forward', e.target.value)}
              className={inputClass}
            />
          </FormField>
          <FormField label="Min Service (months)">
            <input
              type="number"
              min="0"
              value={form.min_service_months}
              onChange={(e) => update('min_service_months', e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Toggle
            label="Monthly Accrual Enabled"
            description="Accrue leave progressively each month"
            checked={form.monthly_accrual_enabled}
            onChange={(v) => update('monthly_accrual_enabled', v)}
          />
          <FormField label="Accrual Rate (days/month)" disabled={!form.monthly_accrual_enabled}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.accrual_rate}
              onChange={(e) => update('accrual_rate', e.target.value)}
              disabled={!form.monthly_accrual_enabled}
              className={`${inputClass} disabled:opacity-50`}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Section: Restrictions */}
      <FormSection title="Restrictions & Conditions" icon={AlertTriangle}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Toggle
            label="Probation Restricted"
            description="Unavailable during probation"
            checked={form.probation_restricted}
            onChange={(v) => update('probation_restricted', v)}
          />
          <Toggle
            label="Half Day Allowed"
            description="Employees can take half-day leave"
            checked={form.half_day_allowed}
            onChange={(v) => update('half_day_allowed', v)}
          />
          <Toggle
            label="Requires Document"
            description="Supporting document required"
            checked={form.requires_document}
            onChange={(v) => update('requires_document', v)}
          />
          <Toggle
            label="Weekend Inclusive"
            description="Count weekends in leave duration"
            checked={form.weekend_inclusive}
            onChange={(v) => update('weekend_inclusive', v)}
          />
          <Toggle
            label="Holiday Inclusive"
            description="Count holidays in leave duration"
            checked={form.holiday_inclusive}
            onChange={(v) => update('holiday_inclusive', v)}
          />
        </div>
      </FormSection>

      {/* Section: Negative Leave */}
      <FormSection title="Negative Leave" icon={TrendingUp}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Toggle
            label="Negative Leave Allowed"
            description="Allow employees to go into negative balance"
            checked={form.negative_leave_allowed}
            onChange={(v) => update('negative_leave_allowed', v)}
          />
          <FormField label="Max Negative Leave (days)" disabled={!form.negative_leave_allowed}>
            <input
              type="number"
              min="0"
              step="0.5"
              value={form.max_negative_leave}
              onChange={(e) => update('max_negative_leave', e.target.value)}
              disabled={!form.negative_leave_allowed}
              className={`${inputClass} disabled:opacity-50`}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Section: Encashment */}
      <FormSection title="Encashment" icon={FileCheck}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Toggle
            label="Encashment Allowed"
            description="Allow converting unused leave to payout"
            checked={form.encashment_allowed}
            onChange={(v) => update('encashment_allowed', v)}
          />
          <FormField label="Encashment Rate" disabled={!form.encashment_allowed} hint="Multiplier or per-day rate">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.encashment_rate}
              onChange={(e) => update('encashment_rate', e.target.value)}
              disabled={!form.encashment_allowed}
              className={`${inputClass} disabled:opacity-50`}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500'

function FormSection({ title, icon: Icon, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-brand-500" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function FormField({ label, required, hint, disabled, children }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
    </div>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
