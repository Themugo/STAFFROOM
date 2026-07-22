import { useState, useEffect, useCallback } from 'react'
import {
  User as UserIcon,
  Shield,
  Monitor,
  Bell,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Building2,
  Save,
  Trash2,
  CheckCheck,
  Smartphone,
  Laptop,
  Tablet,
  Clock,
  MapPin,
  Info,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { formatDate, formatDateTime, timeAgo } from '../lib/format'
import PageHeader from '../components/ui/PageHeader'
import Tabs from '../components/ui/Tabs'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import Avatar from '../components/ui/Avatar'
import ChangePasswordModal from '../components/ChangePasswordModal'

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'notifications', label: 'Notifications' },
]

// Parse a user-agent string into a human-readable device/browser label
function parseUserAgent(ua) {
  if (!ua) return 'Unknown device'
  let browser = 'Unknown browser'
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome'
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua)) browser = 'Safari'

  let os = 'Unknown OS'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/mac os|iphone|ipad|ipod/i.test(ua)) os = 'iOS/macOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/linux/i.test(ua)) os = 'Linux'

  let device = 'Desktop'
  if (/mobile|iphone|android/i.test(ua)) device = 'Mobile'
  else if (/ipad|tablet/i.test(ua)) device = 'Tablet'

  return `${device} • ${browser} on ${os}`
}

function deviceIcon(ua) {
  if (!ua) return Monitor
  if (/mobile|iphone|android/i.test(ua)) return Smartphone
  if (/ipad|tablet/i.test(ua)) return Tablet
  return Laptop
}

export default function UserAccount() {
  const { user, profile, refreshProfile } = useAuth()
  const { success, error: showError } = useNotifications()

  const [activeTab, setActiveTab] = useState('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Profile tab state
  const [fullName, setFullName] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [organization, setOrganization] = useState(null)

  // Sessions tab state
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [terminatingId, setTerminatingId] = useState(null)

  // Notifications tab state
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [markingAllRead, setMarkingAllRead] = useState(false)

  // Sync the editable full_name with the profile
  useEffect(() => {
    if (profile) setFullName(profile.full_name || '')
  }, [profile])

  // Fetch organization name when profile changes
  useEffect(() => {
    if (!profile?.organization_id) {
      setOrganization(null)
      return
    }
    let cancelled = false
    supabase
      .from('organizations')
      .select('id, name')
      .eq('id', profile.organization_id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setOrganization(data)
      })
    return () => { cancelled = true }
  }, [profile?.organization_id])

  const fetchSessions = useCallback(async () => {
    if (!profile?.id) return
    setSessionsLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('id, ip_address, user_agent, created_at, last_active, is_active')
        .eq('user_id', profile.id)
        .order('last_active', { ascending: false })
      if (error) throw error
      setSessions(data || [])
    } catch (err) {
      console.error('Error fetching sessions:', err)
      setSessions([])
    } finally {
      setSessionsLoading(false)
    }
  }, [profile?.id])

  const fetchNotifications = useCallback(async () => {
    if (!profile?.id) return
    setNotificationsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, read_at, created_at, type')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setNotifications(data || [])
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setNotifications([])
    } finally {
      setNotificationsLoading(false)
    }
  }, [profile?.id])

  // Lazy-load tab data when the tab is first opened
  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions()
    if (activeTab === 'notifications') fetchNotifications()
  }, [activeTab, fetchSessions, fetchNotifications])

  async function handleSaveProfile(e) {
    e?.preventDefault()
    if (!profile?.id) return
    setSavingProfile(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (error) throw error
      await refreshProfile()
      success('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      showError('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleTerminateSession(sessionId) {
    setTerminatingId(sessionId)
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false, terminated_at: new Date().toISOString() })
        .eq('id', sessionId)
      if (error) throw error
      success('Session terminated')
      setSessions(prev => prev.filter(s => s.id !== sessionId))
    } catch (err) {
      console.error('Error terminating session:', err)
      showError('Failed to terminate session')
    } finally {
      setTerminatingId(null)
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
      if (error) throw error
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n))
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
      showError('Failed to mark notification as read')
    }
  }

  async function handleMarkAllRead() {
    const unread = notifications.filter(n => !n.read_at)
    if (unread.length === 0) return
    setMarkingAllRead(true)
    try {
      const now = new Date().toISOString()
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: now })
        .in('id', unread.map(n => n.id))
      if (error) throw error
      setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || now })))
      success('All notifications marked as read')
    } catch (err) {
      console.error('Error marking all as read:', err)
      showError('Failed to mark all as read')
    } finally {
      setMarkingAllRead(false)
    }
  }

  if (!profile) {
    return <Spinner size="lg" className="h-64" />
  }

  const activeSessions = sessions.filter(s => s.is_active).length
  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          icon={UserIcon}
          title="My Account"
          description="View and manage your profile, security, and sessions"
        />

        <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              user={user}
              fullName={fullName}
              setFullName={setFullName}
              onSave={handleSaveProfile}
              saving={savingProfile}
              organization={organization}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              profile={profile}
              onChangePassword={() => setShowPasswordModal(true)}
              activeSessions={activeSessions}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsTab
              sessions={sessions}
              loading={sessionsLoading}
              onTerminate={handleTerminateSession}
              terminatingId={terminatingId}
              currentSessionId={null}
              onRefresh={fetchSessions}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              loading={notificationsLoading}
              onMarkRead={handleMarkAsRead}
              onMarkAllRead={handleMarkAllRead}
              markingAllRead={markingAllRead}
              onRefresh={fetchNotifications}
            />
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false)
            success('Password changed successfully')
            refreshProfile()
          }}
        />
      )}
    </div>
  )
}

/* ----------------------------- Profile Tab ----------------------------- */

function ProfileTab({ profile, user, fullName, setFullName, onSave, saving, organization }) {
  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar + role */}
        <div className="flex flex-col items-center gap-3">
          <Avatar name={profile.full_name} size="xl" />
          <StatusBadge status={profile.role ? profile.role.toUpperCase() : 'INACTIVE'} label={profile.role || 'User'} />
        </div>

        {/* Editable form */}
        <form onSubmit={onSave} className="flex-1 space-y-5">
          <div>
            <label className="label" htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              type="text"
              className="input"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Email</label>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                <span>{profile.email || user?.email || '—'}</span>
              </div>
            </div>

            <div>
              <label className="label">Role</label>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Shield size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="capitalize">{profile.role || '—'}</span>
              </div>
            </div>

            <div>
              <label className="label">Organization</label>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Building2 size={16} className="text-gray-400 dark:text-gray-500" />
                <span>{organization?.name || '—'}</span>
              </div>
            </div>

            <div>
              <label className="label">User ID</label>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <UserIcon size={16} className="text-gray-400 dark:text-gray-500" />
                <span className="font-mono">{profile.id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={16} className="mr-1.5" />
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ----------------------------- Security Tab ----------------------------- */

function SecurityTab({ profile, onChangePassword, activeSessions }) {
  const mfaEnabled = !!profile?.mfa_enabled
  const mustChange = !!profile?.must_change_password
  const passwordChangedAt = profile?.password_changed_at

  const recommendations = []
  if (!mfaEnabled) {
    recommendations.push({
      icon: Key,
      text: 'Enable MFA for enhanced security',
      tone: 'warning',
    })
  }
  if (mustChange) {
    recommendations.push({
      icon: AlertTriangle,
      text: 'Your password must be changed — please update it now',
      tone: 'danger',
    })
  }
  if (passwordChangedAt && (Date.now() - new Date(passwordChangedAt).getTime()) > 90 * 24 * 60 * 60 * 1000) {
    recommendations.push({
      icon: Clock,
      text: 'Your password is over 90 days old — consider updating it',
      tone: 'warning',
    })
  }
  if (recommendations.length === 0) {
    recommendations.push({
      icon: CheckCircle,
      text: 'Your account meets all security recommendations. Great job!',
      tone: 'success',
    })
  }

  const toneClasses = {
    success: 'border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-900/30 dark:text-success-400',
    warning: 'border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
    danger: 'border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-800 dark:bg-danger-900/30 dark:text-danger-400',
  }

  return (
    <div className="space-y-6">
      {/* Security status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={mfaEnabled ? CheckCircle : XCircle}
          label="MFA"
          value={mfaEnabled ? 'Enabled' : 'Disabled'}
          color={mfaEnabled ? 'green' : 'red'}
        />
        <StatCard
          icon={Key}
          label="Password Last Changed"
          value={passwordChangedAt ? formatDate(passwordChangedAt) : '—'}
          sublabel={passwordChangedAt ? timeAgo(passwordChangedAt) : 'Never'}
          color="blue"
        />
        <StatCard
          icon={Monitor}
          label="Active Sessions"
          value={activeSessions}
          color="cyan"
        />
      </div>

      {/* Password action */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Password</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {mustChange
                  ? 'You are required to change your password.'
                  : 'Change your password to keep your account secure.'}
              </p>
            </div>
          </div>
          <button onClick={onChangePassword} className="btn-primary whitespace-nowrap">
            <Key size={16} className="mr-1.5" />
            Change Password
          </button>
        </div>
      </div>

      {/* Security recommendations */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield size={16} className="text-gray-400 dark:text-gray-500" />
          Security Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-lg border p-4 ${toneClasses[rec.tone]}`}
            >
              <rec.icon size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">{rec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------- Sessions Tab ----------------------------- */

function SessionsTab({ sessions, loading, onTerminate, terminatingId, currentSessionId, onRefresh }) {
  if (loading) {
    return <Spinner size="lg" className="h-64" />
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Monitor}
        title="No sessions found"
        description="You don't have any recorded sessions yet."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Your Sessions</h3>
        <button
          onClick={onRefresh}
          className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const DeviceIcon = deviceIcon(session.user_agent)
          const isCurrent = session.id === currentSessionId
          return (
            <div
              key={session.id}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <DeviceIcon className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {parseUserAgent(session.user_agent)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {session.ip_address || 'Unknown IP'} • Location unavailable
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last active</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {session.last_active ? formatDateTime(session.last_active) : '—'}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {session.last_active ? timeAgo(session.last_active) : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {session.is_active ? (
                    <StatusBadge status="ACTIVE" label="Active" />
                  ) : (
                    <StatusBadge status="INACTIVE" label="Inactive" />
                  )}

                  {!isCurrent && (
                    <button
                      onClick={() => onTerminate(session.id)}
                      disabled={terminatingId === session.id}
                      className="p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-900/40 rounded-lg transition disabled:opacity-50"
                      title="Terminate session"
                    >
                      {terminatingId === session.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* --------------------------- Notifications Tab --------------------------- */

const NOTIFICATION_TYPE_ICON = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
}

function NotificationsTab({ notifications, loading, onMarkRead, onMarkAllRead, markingAllRead, onRefresh }) {
  if (loading) {
    return <Spinner size="lg" className="h-64" />
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Notifications {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-danger-100 text-danger-600 dark:bg-danger-900/40 dark:text-danger-400 px-2 py-0.5 text-xs">
              {unreadCount} unread
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            Refresh
          </button>
          <button
            onClick={onMarkAllRead}
            disabled={markingAllRead || unreadCount === 0}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            <CheckCheck size={16} className="mr-1.5" />
            {markingAllRead ? 'Marking…' : 'Mark all as read'}
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You don't have any notifications yet."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isRead = !!n.read_at
            const Icon = NOTIFICATION_TYPE_ICON[n.type] || Bell
            return (
              <div
                key={n.id}
                className={`rounded-lg border p-4 transition ${
                  isRead
                    ? 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
                    : 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {n.title || 'Notification'}
                        </p>
                        {n.type && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                            {n.type}
                          </span>
                        )}
                        {!isRead && (
                          <span className="h-2 w-2 rounded-full bg-danger-500" title="Unread" />
                        )}
                      </div>
                      {n.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                          {n.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                        {formatDate(n.created_at)} • {timeAgo(n.created_at)}
                      </p>
                    </div>
                  </div>

                  {!isRead && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium whitespace-nowrap shrink-0"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
