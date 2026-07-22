import { useState, useEffect, useMemo, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Briefcase, Clock, Calendar,
  DollarSign, UserSearch, LogOut, Menu, X, Settings, GitBranch, BrainCircuit, Shield,
  Sun, Moon, Bell, Search, ChevronRight, Command, Sparkles, Megaphone, Receipt,
  MessageSquare, CalendarClock, FileText, BarChart3, Award, LifeBuoy, UserCircle,
  Package, GraduationCap, Heart, Globe,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNotifications } from '../contexts/NotificationContext'
import { usePermissions } from '../contexts/PermissionContext'
import { supabase } from '../lib/supabase'
import ChangePasswordModal from './ChangePasswordModal'
import Avatar from './ui/Avatar'
import { timeAgo } from '../lib/format'

const ALL_NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', perm: ['dashboard:overview:read'] },
  { to: '/employees', icon: Users, label: 'Employees', perm: ['employees:all:read'] },
  { to: '/departments', icon: Building2, label: 'Departments', perm: ['departments:all:read'] },
  { to: '/positions', icon: Briefcase, label: 'Positions', perm: ['positions:all:read'] },
  { to: '/attendance', icon: Clock, label: 'Attendance', perm: ['attendance:self:read'] },
  { to: '/attendance-intelligence', icon: BrainCircuit, label: 'Attendance Intelligence', perm: ['attendance:all:read'] },
  { to: '/leave', icon: Calendar, label: 'Leave Management', perm: ['leave:self:read'] },
  { to: '/payroll', icon: DollarSign, label: 'Payroll', perm: ['payroll:self:read'] },
  { to: '/recruitment', icon: UserSearch, label: 'Recruitment', perm: ['recruitment:all:read'] },
  { to: '/ai-copilot', icon: Sparkles, label: 'AI Copilot', perm: ['ai:copilot:use'] },
  { to: '/announcements', icon: Megaphone, label: 'Announcements', perm: ['communication:announcements:read'] },
  { to: '/communication', icon: MessageSquare, label: 'Communication Hub', perm: ['communication:messages:read'] },
  { to: '/expenses', icon: Receipt, label: 'Expense Claims', perm: ['expenses:self:create'] },
  { to: '/duty-roster', icon: CalendarClock, label: 'Duty Roster', perm: ['roster:self:read'] },
  { to: '/leave-policies', icon: FileText, label: 'Leave Policies', perm: ['leave:policies:manage'] },
  { to: '/performance', icon: Award, label: 'Performance', perm: ['employees:all:read'] },
  { to: '/learning', icon: GraduationCap, label: 'Learning & Dev', perm: ['employees:all:read'] },
  { to: '/assets', icon: Package, label: 'Asset Management', perm: ['employees:all:read'] },
  { to: '/benefits', icon: Heart, label: 'Benefits', perm: ['employees:all:read'] },
  { to: '/analytics', icon: BarChart3, label: 'Workforce Analytics', perm: ['dashboard:analytics:read'] },
  { to: '/help-desk', icon: LifeBuoy, label: 'Help Desk', perm: [] },
  { to: '/account', icon: UserCircle, label: 'My Account', perm: [] },
  { to: '/website-cms', icon: Globe, label: 'Website CMS', perm: ['settings:organization:manage'] },
  { to: '/workflows', icon: GitBranch, label: 'Workflows', perm: ['settings:workflows:manage'] },
  { to: '/users', icon: Settings, label: 'Users', perm: ['users:all:read'] },
  { to: '/settings', icon: Settings, label: 'Organization Settings', perm: ['settings:organization:manage'] },
  { to: '/security-center', icon: Shield, label: 'Security Center', perm: ['security:center:read'] },
  { to: '/audit-log', icon: FileText, label: 'Audit Trail', perm: ['security:audit:read'] },
]

const NAV_SECTIONS = [
  { label: 'Overview', items: ['dashboard'] },
  { label: 'People', items: ['employees', 'departments', 'positions', 'users', 'performance', 'learning', 'benefits', 'assets'] },
  { label: 'Time & Attendance', items: ['attendance', 'attendance-intelligence', 'leave', 'duty-roster'] },
  { label: 'Operations', items: ['payroll', 'recruitment', 'workflows', 'ai-copilot', 'announcements', 'communication', 'expenses', 'leave-policies', 'help-desk'] },
  { label: 'Insights', items: ['analytics'] },
  { label: 'Administration', items: ['settings', 'security-center', 'audit-log', 'account', 'website-cms'] },
]

export default function Layout() {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useNotifications()
  const { hasPermission: checkPerm, hasAnyPermission, hasModuleAccess } = usePermissions()

  function navVisible(item) {
    if (!item.perm || item.perm.length === 0) return true
    return item.perm.some((p) => {
      const [m, f, a] = p.split(':')
      // Match the RBACRoute logic: exact permission, or any permission for module:feature,
      // or (for feature='all') any access to the module
      if (checkPerm(m, f, a)) return true
      if (hasAnyPermission(m, f)) return true
      if (f === 'all' && hasModuleAccess(m)) return true
      return false
    })
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCommand, setShowCommand] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [dbNotifications, setDbNotifications] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const commandRef = useRef(null)

  // Real-time notification polling
  useEffect(() => {
    if (!profile?.id) return
    let channel
    async function fetchNotifications() {
      try {
        const { data } = await supabase
          .from('notifications')
          .select('id, title, message, created_at, read_at, action_url')
          .eq('user_id', profile.id)
          .is('read_at', null)
          .order('created_at', { ascending: false })
          .limit(10)
        setDbNotifications(data || [])
      } catch (e) {
        // Silently ignore — notifications are non-critical
      }
    }
    fetchNotifications()
    try {
      channel = supabase
        .channel('notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` }, fetchNotifications)
        .subscribe()
    } catch (e) {
      // Realtime subscription is non-critical
    }
    return () => { if (channel) { try { supabase.removeChannel(channel) } catch (e) {} } }
  }, [profile?.id])

  const allNotifications = [...dbNotifications, ...notifications].slice(0, 10)
  const nav = ALL_NAV_ITEMS.filter(navVisible)

  const activeNav = nav.find(n =>
    n.to === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(n.to)
  )

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', to: '/dashboard' }]
    if (activeNav) crumbs.push({ label: activeNav.label, to: activeNav.to })
    return crumbs
  }, [activeNav])

  useEffect(() => {
    if (profile?.must_change_password) setShowPasswordModal(true)
  }, [profile])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommand(s => !s)
      }
      if (e.key === 'Escape') setShowCommand(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
    setShowNotifications(false)
    setShowCommand(false)
  }, [location.pathname])

  function handlePasswordChanged() {
    setShowPasswordModal(false)
    navigate('/dashboard')
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const commandResults = useMemo(() => {
    if (!commandQuery) return nav
    const q = commandQuery.toLowerCase()
    return nav.filter(n => n.label.toLowerCase().includes(q))
  }, [commandQuery, nav])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gray-900 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center gap-3 border-b border-gray-700/50 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">SR</div>
          <span className="text-white font-semibold text-lg tracking-tight">StaffRoom</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 hover:text-white lg:hidden"><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          {NAV_SECTIONS.map((section) => {
            const sectionItems = nav.filter(n => section.items.includes(n.to.replace('/', '')))
            if (sectionItems.length === 0) return null
            return (
              <div key={section.label}>
                <p className="px-3 mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{section.label}</p>
                <div className="space-y-0.5">
                  {sectionItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`
                      }
                    >
                      <Icon size={18} />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="border-t border-gray-700/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={profile?.full_name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name ?? 'User'}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{profile?.role?.toLowerCase().replace('_', ' ') ?? 'Staff'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-6 dark:border-gray-800 dark:bg-gray-900">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"><Menu size={22} /></button>

          <nav className="hidden sm:flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
                <Link to={crumb.to} className={i === breadcrumbs.length - 1 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}>
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowCommand(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Search size={16} />
              <span className="text-xs">Search...</span>
              <kbd className="ml-2 flex items-center gap-0.5 rounded border border-gray-300 px-1 text-xs text-gray-400 dark:border-gray-600">
                <Command size={10} />K
              </kbd>
            </button>

            <button onClick={toggleTheme} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="relative">
              <button onClick={() => setShowNotifications(s => !s)} className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                <Bell size={20} />
                {allNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[10px] font-bold text-white">
                    {allNotifications.length > 9 ? '9+' : allNotifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-80 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 animate-fade-in-down">
                    <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                      <p className="font-semibold text-gray-900 dark:text-white">Notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {allNotifications.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">No notifications</p>
                      ) : (
                        allNotifications.map((n, i) => (
                          <div key={n.id || i} className="border-b border-gray-100 px-4 py-3 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                            {n.created_at && <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} onSuccess={handlePasswordChanged} />
      )}

      {showCommand && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setShowCommand(false)} />
          <div ref={commandRef} className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 animate-scale-in">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <Search size={20} className="text-gray-400" />
                <input
                  autoFocus
                  value={commandQuery}
                  onChange={(e) => setCommandQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 outline-none dark:text-white"
                />
                <kbd className="rounded border border-gray-300 px-1.5 text-xs text-gray-400 dark:border-gray-600">ESC</kbd>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {commandResults.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">No results found</p>
                ) : (
                  commandResults.map(({ to, icon: Icon, label }) => (
                    <button
                      key={to}
                      onClick={() => navigate(to)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
