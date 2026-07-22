import { useState, useEffect } from 'react'
import {
  Shield, AlertTriangle, Monitor, Lock, Key, Globe,
  Clock, User, CheckCircle, XCircle,
  Smartphone, Laptop, Tablet, Trash2,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useOrganization } from '../contexts/OrganizationContext'
import { useNotifications } from '../contexts/NotificationContext'
import { StatCard, StatusBadge, DataTable, EmptyState, PageHeader, Tabs } from '../components/ui'
import { formatDate, formatDateTime } from '../lib/format'

const TABS = [
  { id: 'overview', label: 'Security Overview' },
  { id: 'sessions', label: 'Active Sessions' },
  { id: 'history', label: 'Login History' },
  { id: 'suspicious', label: 'Suspicious Activity' },
  { id: 'mfa', label: 'MFA Settings' },
  { id: 'ip', label: 'IP Allowlist' },
  { id: 'compliance', label: 'Compliance' },
]

const DEVICE_ICONS = { MOBILE: Smartphone, TABLET: Tablet, DESKTOP: Monitor }

const SEVERITY_STATUS = {
  LOW: 'PENDING',
  MEDIUM: 'PENDING',
  HIGH: 'REJECTED',
  CRITICAL: 'REJECTED',
}

const COMPLIANCE_STATUS = {
  COMPLIANT: 'APPROVED',
  AT_RISK: 'REJECTED',
  UNKNOWN: 'PENDING',
}

export default function SecurityCenter() {
  const { organization } = useOrganization()
  const { success: showSuccess } = useNotifications()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    sessions: [],
    loginHistory: [],
    suspiciousActivities: [],
    complianceStatus: [],
    mfaSettings: null,
    ipAllowlist: [],
    stats: {
      activeSessions: 0,
      failedLogins24h: 0,
      suspiciousEvents: 0,
      mfaEnabledUsers: 0,
      complianceScore: 0,
    }
  })

  useEffect(() => {
    if (organization) fetchSecurityData()
  }, [organization])

  async function fetchSecurityData() {
    setLoading(true)
    try {
      const [sessionsRes, historyRes, suspiciousRes, complianceRes, mfaRes, ipRes] = await Promise.all([
        supabase.from('user_sessions').select('*').eq('organization_id', organization.id).is('terminated_at', null).order('created_at', { ascending: false }).limit(50),
        supabase.from('login_history').select('*').eq('organization_id', organization.id).order('created_at', { ascending: false }).limit(100),
        supabase.from('suspicious_activities').select('*').eq('organization_id', organization.id).eq('resolved', false).order('created_at', { ascending: false }).limit(50),
        supabase.from('compliance_status').select('*').eq('organization_id', organization.id),
        supabase.from('mfa_settings').select('*').eq('organization_id', organization.id).single(),
        supabase.from('ip_allowlist').select('*').eq('organization_id', organization.id).eq('is_active', true),
      ])

      const sessions = sessionsRes.data || []
      const history = historyRes.data || []
      const suspicious = suspiciousRes.data || []
      const compliance = complianceRes.data || []
      const mfa = mfaRes.data
      const ip = ipRes.data || []

      setData({
        sessions,
        loginHistory: history,
        suspiciousActivities: suspicious,
        complianceStatus: compliance,
        mfaSettings: mfa,
        ipAllowlist: ip,
        stats: {
          activeSessions: sessions.length,
          failedLogins24h: history.filter(h => !h.success && new Date(h.created_at) > new Date(Date.now() - 86400000)).length,
          suspiciousEvents: suspicious.length,
          mfaEnabledUsers: m ? (m.require_mfa ? profiles?.length || 0 : 0) : 0,
          complianceScore: compliance.length > 0 ? Math.round(compliance.reduce((acc, c) => acc + (c.score || 0), 0) / compliance.length) : 0,
        }
      })
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function terminateSession(sessionId) {
    const { error } = await supabase
      .from('user_sessions')
      .update({ terminated_at: new Date().toISOString(), terminated_reason: 'ADMIN_TERMINATED' })
      .eq('id', sessionId)

    if (!error) {
      showSuccess('Session terminated')
      fetchSecurityData()
    } else {
      showSuccess('Failed to terminate session')
    }
  }

  async function markSuspiciousResolved(id, action) {
    const { error } = await supabase
      .from('suspicious_activities')
      .update({ resolved: true, resolved_at: new Date().toISOString(), action_taken: action })
      .eq('id', id)

    if (!error) {
      showSuccess('Activity marked as resolved')
      fetchSecurityData()
    } else {
      showSuccess('Failed to resolve activity')
    }
  }

  async function updateMFASettings(key, value) {
    const ALLOWED_MFA_KEYS = ['require_mfa', 'mfa_grace_hours', 'mfa_enforce_roles', 'allow_backup_codes']
    if (!ALLOWED_MFA_KEYS.includes(key)) {
      showSuccess('Invalid setting')
      return
    }
    const { error } = await supabase
      .from('mfa_settings')
      .upsert({
        organization_id: organization.id,
        [key]: value,
        updated_at: new Date().toISOString()
      })

    if (!error) {
      showSuccess('MFA settings updated')
      fetchSecurityData()
    } else {
      showSuccess('Failed to update MFA settings')
    }
  }

  async function addIPToAllowlist() {
    const { error } = await supabase
      .from('ip_allowlist')
      .insert({
        organization_id: organization.id,
        name: 'New IP',
        ip_address: '0.0.0.0/32',
        is_active: false,
        created_at: new Date().toISOString()
      })

    if (!error) {
      fetchSecurityData()
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          icon={Shield}
          title="Security Center"
          description="Monitor and manage your organization's security posture"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard icon={Monitor} label="Active Sessions" value={data.stats.activeSessions} color="cyan" loading={loading} />
          <StatCard icon={XCircle} label="Failed Logins (24h)" value={data.stats.failedLogins24h} color="red" loading={loading} />
          <StatCard icon={AlertTriangle} label="Suspicious Events" value={data.stats.suspiciousEvents} color="yellow" loading={loading} />
          <StatCard icon={Key} label="MFA Users" value={data.stats.mfaEnabledUsers} color="purple" loading={loading} />
          <StatCard icon={CheckCircle} label="Compliance Score" value={`${data.stats.complianceScore}%`} color="green" loading={loading} />
        </div>

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6 card p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-brand-600 dark:border-t-brand-400 animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab data={data} />}
              {activeTab === 'sessions' && <SessionsTab sessions={data.sessions} onTerminate={terminateSession} />}
              {activeTab === 'history' && <HistoryTab history={data.loginHistory} />}
              {activeTab === 'suspicious' && <SuspiciousTab activities={data.suspiciousActivities} onResolve={markSuspiciousResolved} />}
              {activeTab === 'mfa' && <MFATab settings={data.mfaSettings} organizationId={organization?.id} onUpdate={updateMFASettings} />}
              {activeTab === 'ip' && <IPTab allowlist={data.ipAllowlist} onAdd={addIPToAllowlist} />}
              {activeTab === 'compliance' && <ComplianceTab statuses={data.complianceStatus} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function OverviewTab({ data }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Security Overview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <Clock size={16} />
            Recent Login Activity
          </h3>
          <div className="space-y-2">
            {data.loginHistory.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No recent activity</p>
            ) : (
              data.loginHistory.slice(0, 5).map((login) => (
                <div key={login.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-success-500' : 'bg-danger-500'}`} />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{login.device_name || 'Unknown device'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{login.ip_address} • {login.browser}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(login.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Unresolved Alerts */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            Unresolved Alerts
          </h3>
          <div className="space-y-2">
            {data.suspiciousActivities.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No unresolved alerts</p>
            ) : (
              data.suspiciousActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={SEVERITY_STATUS[activity.severity] || 'PENDING'} label={activity.severity} />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{activity.activity_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.ip_address}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(activity.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Lock, label: 'Lock All Sessions', color: 'text-danger-600 bg-danger-100 dark:bg-danger-900/40 dark:text-danger-400' },
            { icon: Key, label: 'Rotate API Keys', color: 'text-warning-600 bg-warning-100 dark:bg-warning-900/40 dark:text-warning-400' },
            { icon: Shield, label: 'Security Scan', color: 'text-accent-600 bg-accent-100 dark:bg-accent-900/40 dark:text-accent-400' },
            { icon: Globe, label: 'Export Audit Logs', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400' },
          ].map((action, i) => (
            <button key={i} className={`flex items-center gap-2 px-4 py-3 rounded-lg ${action.color} hover:opacity-80 transition`}>
              <action.icon size={16} />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SessionsTab({ sessions, onTerminate }) {
  if (sessions.length === 0) {
    return <EmptyState icon={Monitor} title="No active sessions" description="There are no active sessions to display." />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
        <span className="px-3 py-1 bg-accent-100 text-accent-600 dark:bg-accent-900/40 dark:text-accent-400 rounded-full text-sm">{sessions.length} active</span>
      </div>
      <div className="space-y-3">
        {sessions.map((session) => {
          const DeviceIcon = DEVICE_ICONS[session.device_type] || Monitor
          return (
            <div key={session.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <DeviceIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{session.device_name || 'Unknown Device'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{session.browser} • {session.os}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    IP: {session.ip_address} • {session.geo_city && `${session.geo_city}, ${session.geo_country}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last activity</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{formatDateTime(session.last_activity_at)}</p>
                  {session.is_mfa_verified && (
                    <span className="text-xs text-success-600 dark:text-success-400 flex items-center gap-1 mt-1 justify-end">
                      <CheckCircle size={12} /> MFA verified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onTerminate(session.id)}
                  className="p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/40 rounded-lg transition"
                  title="Terminate session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HistoryTab({ history }) {
  const columns = [
    {
      key: 'success',
      header: 'Status',
      render: (login) => (
        <span className={`inline-flex items-center gap-1 ${login.success ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
          {login.success ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {login.success ? 'Success' : 'Failed'}
        </span>
      ),
    },
    { key: 'login_type', header: 'Type', render: (login) => <span className="text-gray-700 dark:text-gray-300">{login.login_type}</span> },
    { key: 'device_name', header: 'Device', render: (login) => <span className="text-gray-700 dark:text-gray-300">{login.device_name || login.browser}</span> },
    {
      key: 'ip_address',
      header: 'Location',
      render: (login) => <span className="text-gray-700 dark:text-gray-300">{login.ip_address} {login.geo_city && ` (${login.geo_city})`}</span>,
    },
    {
      key: 'mfa_used',
      header: 'MFA',
      render: (login) =>
        login.mfa_used ? (
          <StatusBadge status="APPROVED" label={login.mfa_method} />
        ) : (
          <StatusBadge status="INACTIVE" label="None" />
        ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (login) => <span className="text-gray-500 dark:text-gray-400">{formatDateTime(login.created_at)}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Login History</h2>
      <DataTable
        columns={columns}
        data={history}
        emptyTitle="No login history"
        emptyDescription="No login events have been recorded yet."
        emptyIcon={Clock}
      />
    </div>
  )
}

function SuspiciousTab({ activities, onResolve }) {
  if (activities.length === 0) {
    return <EmptyState icon={Shield} title="No suspicious activity detected" description="All clear — no unresolved suspicious events." />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Suspicious Activity</h2>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <StatusBadge status={SEVERITY_STATUS[activity.severity] || 'PENDING'} label={activity.severity} />
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">{activity.activity_type.replace(/_/g, ' ')}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.details?.description || 'No details available'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>IP: {activity.ip_address}</span>
                    <span>Device: {activity.device_fingerprint?.substring(0, 8)}...</span>
                    <span>{formatDateTime(activity.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onResolve(activity.id, 'IGNORED')}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Ignore
                </button>
                <button
                  onClick={() => onResolve(activity.id, 'INVESTIGATED')}
                  className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700"
                >
                  Investigate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MFATab({ settings, organizationId, onUpdate }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Multi-Factor Authentication</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Organization Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Require MFA for all users</span>
              <input
                type="checkbox"
                checked={settings?.mfa_required || false}
                onChange={(e) => onUpdate('mfa_required', e.target.checked)}
                className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-brand-600 focus:ring-brand-500"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Admin Role MFA Required</span>
              <input
                type="checkbox"
                checked={settings?.mfa_required_for_roles?.includes('ADMIN') || false}
                onChange={(e) => {
                  const roles = settings?.mfa_required_for_roles || []
                  const newRoles = e.target.checked
                    ? [...roles, 'ADMIN']
                    : roles.filter(r => r !== 'ADMIN')
                  onUpdate('mfa_required_for_roles', newRoles)
                }}
                className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-brand-600 focus:ring-brand-500"
              />
            </label>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 block mb-2">Trusted device duration (days)</label>
              <input
                type="number"
                value={settings?.remember_device_days || 30}
                onChange={(e) => onUpdate('remember_device_days', parseInt(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">MFA Methods</h3>
          <div className="space-y-3">
            {['TOTP', 'SMS', 'EMAIL', 'RECOVERY_CODE'].map((method) => (
              <label key={method} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <input
                  type="checkbox"
                  checked={settings?.allowed_mfa_methods?.includes(method) || false}
                  onChange={(e) => {
                    const methods = settings?.allowed_mfa_methods || []
                    const newMethods = e.target.checked
                      ? [...methods, method]
                      : methods.filter(m => m !== method)
                    onUpdate('allowed_mfa_methods', newMethods)
                  }}
                  className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-brand-600"
                />
                <span className="text-gray-900 dark:text-white">{method}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function IPTab({ allowlist, onAdd }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">IP Allowlist</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          Add IP Range
        </button>
      </div>
      {allowlist.length === 0 ? (
        <EmptyState icon={Globe} title="No IP allowlist entries" description="Add an IP range to restrict access." />
      ) : (
        <div className="space-y-3">
          {allowlist.map((ip) => (
            <div key={ip.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${ip.is_active ? 'bg-success-500' : 'bg-gray-400 dark:bg-gray-600'}`} />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">{ip.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{ip.ip_address}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{ip.scope}</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(ip.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ComplianceTab({ statuses }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Compliance Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { type: 'GDPR', name: 'General Data Protection Regulation', icon: Globe },
          { type: 'SOC2', name: 'SOC 2 Type II', icon: Shield },
          { type: 'KENYA_DATA_PROTECTION', name: 'Kenya Data Protection Act', icon: Lock },
          { type: 'HIPAA', name: 'HIPAA Compliance', icon: User },
        ].map((item) => {
          const status = statuses.find(s => s.compliance_type === item.type)
          return (
            <div key={item.type} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <div className="flex items-center gap-3 mb-3">
                <item.icon size={20} className="text-accent-600 dark:text-accent-400" />
                <h3 className="text-gray-900 dark:text-white font-medium">{item.name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={COMPLIANCE_STATUS[status?.status] || 'PENDING'} label={status?.status || 'UNKNOWN'} />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{status?.score || '--'}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
