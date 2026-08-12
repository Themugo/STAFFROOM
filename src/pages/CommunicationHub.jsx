import { useState, useRef, useEffect, useMemo } from 'react'
import {
  MessageSquare,
  Megaphone,
  Mail,
  Smartphone,
  Share2,
  Sliders,
  ShieldCheck,
  Calendar,
  Paperclip,
  Smile,
  ThumbsUp,
  Heart,
  Sparkles,
  Plus,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Filter,
  ExternalLink,
  Lock,
  Bell,
  Trash2,
  Edit3,
  User,
  Bot,
  Download,
  ChevronRight,
  Send,
  Pin,
  PinOff,
  CheckCheck,
  Check,
  Search,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Hash,
  CheckSquare,
  Settings,
  Layers,
  Activity,
  Zap,
  Radio,
  SendHorizontal,
  Building,
  Video,
  Award,
  FolderKanban,
  Home,
} from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { formatDate, formatDateTime, timeAgo, initials } from '@/lib/format'
import PageHeader from '@/components/ui/PageHeader'
import Modal from '@/components/ui/Modal'
import StatCard from '@/components/ui/StatCard'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import SearchInput from '@/components/ui/SearchInput'

import EnterpriseHome from '@/components/collaboration/EnterpriseHome'
import TeamSpaces from '@/components/collaboration/TeamSpaces'
import DiscussionsBoard from '@/components/collaboration/DiscussionsBoard'
import TaskCollaborationBoard from '@/components/collaboration/TaskCollaborationBoard'
import MeetingHub from '@/components/collaboration/MeetingHub'
import DocumentCollaboration from '@/components/collaboration/DocumentCollaboration'
import SocialIntranet from '@/components/collaboration/SocialIntranet'
import ProjectCollaborationWorkspace from '@/components/collaboration/ProjectCollaborationWorkspace'
import AiCollaborationAssistant from '@/components/collaboration/AiCollaborationAssistant'
import EnhancedDirectory from '@/components/collaboration/EnhancedDirectory'
import UnifiedEnterpriseSearch from '@/components/collaboration/UnifiedEnterpriseSearch'

function TabsNav({ tabs, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// ── MOCK SYSTEM DATA ───────────────────────────────────────────────────

const INITIAL_INBOX_ITEMS = [
  {
    id: 'inb-1',
    category: 'Approvals',
    title: 'Leave Request: Elena Rostova (5 Days Annual)',
    summary: 'Elena requested 5 days annual leave from Aug 10 to Aug 15. Requires manager sign-off.',
    sender: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    time: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    unread: true,
    priority: 'HIGH',
    actionRequired: true,
    actionType: 'leave_approval',
    recordId: 'LR-2026-88',
  },
  {
    id: 'inb-2',
    category: 'Payroll',
    title: 'July 2026 Payroll Execution Report',
    summary: 'Payroll of $142,500 disbursed to 24 employees via Direct Deposit. Bank confirmation received.',
    sender: 'Payroll Automation Engine',
    avatar: null,
    time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unread: true,
    priority: 'MEDIUM',
    actionRequired: false,
  },
  {
    id: 'inb-3',
    category: 'System Alerts',
    title: 'Security Alert: Expiring Work Permits (3 Staff)',
    summary: 'Work authorization permits for Marcus Vance and 2 others expire in 30 days. Action required by HR Compliance.',
    sender: 'Governance Bot',
    avatar: null,
    time: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    unread: false,
    priority: 'HIGH',
    actionRequired: true,
    actionType: 'compliance_review',
  },
  {
    id: 'inb-4',
    category: 'Recruitment',
    title: 'Interview Scheduled: Senior Frontend Dev (Candidate: David Kim)',
    summary: 'Technical Interview scheduled for Aug 2, 2:00 PM with Engineering Team lead.',
    sender: 'Recruitment Portal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    time: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    unread: false,
    priority: 'MEDIUM',
    actionRequired: false,
  },
  {
    id: 'inb-5',
    category: 'Attendance',
    title: 'Attendance Exception: Unexcused Absence Flagged',
    summary: 'Lucas Vance was marked absent without approved leave application on July 30.',
    sender: 'Attendance Intelligence',
    avatar: null,
    time: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    unread: false,
    priority: 'MEDIUM',
    actionRequired: true,
    actionType: 'attendance_flag',
  },
]

const CHANNELS = [
  { id: 'ch-announcements', name: 'company-announcements', type: 'channel', isPublic: true, unread: 2, topic: 'Official broadcasts and policy updates' },
  { id: 'ch-engineering', name: 'engineering-ops', type: 'channel', isPublic: true, unread: 0, topic: 'Technical discussion & sprint sync' },
  { id: 'ch-hr', name: 'hr-operations', type: 'channel', isPublic: false, unread: 4, topic: 'Confidential HR & benefits coordination' },
  { id: 'ch-payroll', name: 'payroll-disbursements', type: 'channel', isPublic: false, unread: 0, topic: 'Monthly salary and expense queries' },
  { id: 'ch-social', name: 'social-lounge', type: 'channel', isPublic: true, unread: 1, topic: 'Team achievements, birthdays & watercooler' },
]

const INITIAL_DIRECT_MESSAGES = [
  { id: 'dm-1', name: 'Sarah Jenkins', role: 'HR Director', status: 'online', unread: 1, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'dm-2', name: 'Michael Chen', role: 'HR Manager', status: 'online', unread: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'dm-3', name: 'Elena Rostova', role: 'Senior Developer', status: 'away', unread: 0, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'dm-4', name: 'Alex Vance', role: 'Chief Executive Officer', status: 'offline', unread: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
]

const INITIAL_MESSAGES_CHAT = {
  'ch-announcements': [
    { id: 'm-1', sender: 'Sarah Jenkins', text: '📢 Reminder: Q3 All-Hands Townhall is scheduled for Friday at 10 AM EST. Please check your calendar invites.', time: '10:30 AM', pinned: true, reactions: { '👍': 8, '🚀': 5 } },
    { id: 'm-2', sender: 'Alex Vance', text: 'Great work to the product and engineering teams for completing the Q2 roadmap deliverables ahead of schedule!', time: '11:15 AM', pinned: false, reactions: { '🎉': 12, '❤️': 6 } },
  ],
  'ch-engineering-ops': [
    { id: 'm-3', sender: 'Elena Rostova', text: 'Deployment for v4.2 staging build completed. Please run regression checks.', time: 'Yesterday', pinned: false, reactions: { '👍': 4 } },
  ],
  'dm-1': [
    { id: 'm-4', sender: 'Sarah Jenkins', text: 'Hi! Could you review the new onboarding policy draft when you get a chance?', time: '9:45 AM', pinned: false, reactions: {} },
    { id: 'm-5', sender: 'You', text: 'Sure thing Sarah, reviewing it now in the Document Center.', time: '9:48 AM', pinned: false, reactions: { '👍': 1 } },
  ],
}

const ANNOUNCEMENTS_LIST = [
  {
    id: 'ann-1',
    title: 'Annual Health & Wellness Benefit Renewal 2026',
    content: 'All eligible employees can now select their medical and dental coverage options through the Benefits Portal. Enrollment closes on August 20th.',
    priority: 'HIGH',
    audience: 'All Staff',
    createdBy: 'Sarah Jenkins',
    createdAt: '2026-07-28T09:00:00Z',
    expiresAt: '2026-08-20T23:59:59Z',
    acknowledgedCount: 22,
    totalCount: 25,
    isEmergency: false,
  },
  {
    id: 'ann-2',
    title: 'Office Infrastructure Maintenance Window',
    content: 'Internal servers and VPN access will undergo scheduled security patches on Saturday, Aug 2 from 2:00 AM to 5:00 AM.',
    priority: 'MEDIUM',
    audience: 'Engineering & Ops',
    createdBy: 'Michael Chen',
    createdAt: '2026-07-29T14:30:00Z',
    expiresAt: '2026-08-03T00:00:00Z',
    acknowledgedCount: 18,
    totalCount: 25,
    isEmergency: false,
  },
  {
    id: 'ann-3',
    title: 'EMERGENCY ALERT: Severe Weather Remote Work Advisory',
    content: 'Due to severe storm warnings in headquarters area, all physical office facilities are closed today. Work remotely.',
    priority: 'EMERGENCY',
    audience: 'All Staff',
    createdBy: 'Alex Vance',
    createdAt: '2026-07-31T06:00:00Z',
    expiresAt: '2026-08-01T23:59:59Z',
    acknowledgedCount: 25,
    totalCount: 25,
    isEmergency: true,
  },
]

const INITIAL_EMAIL_SMS_TEMPLATES = [
  {
    id: 'tpl-1',
    name: 'Employment Offer Letter Dispatch',
    channel: 'Email',
    subject: 'Welcome to StaffRoom — Official Offer of Employment',
    body: 'Dear {{employee_name}},\n\nWe are thrilled to offer you the position of {{job_title}} at {{company_name}} in the {{department}} department.\n\nPlease review and sign your contract using the link below:\n{{link}}\n\nBest regards,\nPeople Operations Team',
    category: 'Recruitment',
  },
  {
    id: 'tpl-2',
    name: 'Monthly Payslip Disbursal Notification',
    channel: 'SMS',
    subject: 'Payslip Available',
    body: 'StaffRoom HR: Dear {{employee_name}}, your net salary of {{amount}} for {{month}} has been disbursed into your account. Download payslip: {{link}}',
    category: 'Payroll',
  },
  {
    id: 'tpl-3',
    name: 'Attendance Exception Warning Notice',
    channel: 'Email',
    subject: 'Action Required: Attendance Record Variance',
    body: 'Dear {{employee_name}},\n\nOur attendance tracking system logged an unexcused variance for your shift on {{date}}.\n\nIf you were on approved leave or remote duty, please submit a correction request in StaffRoom Self-Service within 48 hours.',
    category: 'Attendance',
  },
]

const DISPATCH_LOGS = [
  { id: 'log-1', recipient: 'Elena Rostova (elena@staffroom.demo)', channel: 'Email', template: 'Monthly Payslip Disbursal', status: 'Delivered', sentAt: '2026-07-31 08:30', openRate: 'Opened' },
  { id: 'log-2', recipient: 'Marcus Vance (+1555019283)', channel: 'SMS', template: 'Attendance Exception Warning', status: 'Delivered', sentAt: '2026-07-30 16:15', openRate: 'N/A' },
  { id: 'log-3', recipient: 'David Kim (david.k@candidate.demo)', channel: 'Email', template: 'Interview Invitation', status: 'Delivered', sentAt: '2026-07-29 11:20', openRate: 'Opened' },
  { id: 'log-4', recipient: 'Lucas Vance (lucas@staffroom.demo)', channel: 'Email', template: 'Probation Milestone Reminder', status: 'Pending', sentAt: '2026-07-31 12:00', openRate: 'Unopened' },
]

const TASKS_LIST = [
  { id: 'tsk-1', title: 'Conduct probation review for Lucas Vance', assignee: 'Sarah Jenkins', dueDate: '2026-08-05', priority: 'HIGH', status: 'In Progress', category: 'HR Operations' },
  { id: 'tsk-2', title: 'Verify July tax withholding filings', assignee: 'Michael Chen', dueDate: '2026-08-02', priority: 'MEDIUM', status: 'Pending', category: 'Payroll' },
  { id: 'tsk-3', title: 'Send safety protocol handbook to new hires', assignee: 'Elena Rostova', dueDate: '2026-07-31', priority: 'LOW', status: 'Completed', category: 'Onboarding' },
]

const EXTERNAL_CONNECTORS = [
  { id: 'conn-teams', name: 'Microsoft Teams', icon: '🔷', status: 'Connected', webhook: 'https://outlook.office.com/webhook/staffroom-hq', events: 'Approvals, Announcements' },
  { id: 'conn-slack', name: 'Slack Workplace', icon: '💬', status: 'Connected', webhook: 'https://hooks.slack.com/services/staffroom/alerts', events: 'Attendance, System Alerts' },
  { id: 'conn-gsuite', name: 'Google Workspace', icon: '📅', status: 'Connected', webhook: 'OAuth 2.0 (Google Calendar & Gmail)', events: 'Calendar Sync, Email' },
  { id: 'conn-twilio', name: 'Twilio SMS Gateway', icon: '📱', status: 'Connected', webhook: 'Account SID: AC998271...', events: 'SMS Notifications' },
  { id: 'conn-africastalking', name: 'Africa\'s Talking API', icon: '🌍', status: 'Configured', webhook: 'API Username: staffroom_ke', events: 'Regional Bulk SMS' },
  { id: 'conn-whatsapp', name: 'WhatsApp Business API', icon: '🟢', status: 'Disabled', webhook: 'Not configured', events: 'Direct WhatsApp Alerts' },
]

export default function CommunicationHub() {
  const { profile } = useAuth()
  const [activeTab, setActiveTab] = useState('enterprise_home')

  // Badges & Counters
  const [inboxItems, setInboxItems] = useState(INITIAL_INBOX_ITEMS)
  const unreadCount = useMemo(() => inboxItems.filter(i => i.unread).length, [inboxItems])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Digital Workplace & Collaboration Hub"
        description="Unified workplace platform for enterprise chat, team spaces, task collaboration, meeting minutes, discussions, social intranet, and AI tools."
        icon={Building}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Bell size={14} className="animate-pulse" />
              {unreadCount} Unread Notifications
            </span>
          </div>
        }
      />

      {/* Main Digital Workplace Tabs */}
      <TabsNav
        tabs={[
          { id: 'enterprise_home', label: '🏠 Enterprise Home' },
          { id: 'inbox', label: `📥 Unified Inbox (${unreadCount})` },
          { id: 'team_spaces', label: '🏢 Team Spaces' },
          { id: 'messaging', label: '💬 Enterprise Chat & Channels' },
          { id: 'discussions', label: '🗣️ Discussions' },
          { id: 'tasks', label: '📋 Task Collaboration' },
          { id: 'meetings', label: '📅 Meeting Hub' },
          { id: 'docs', label: '📝 Doc Collaboration' },
          { id: 'announcements', label: '📢 Announcements' },
          { id: 'social', label: '🌟 Social & Kudos' },
          { id: 'projects', label: '🚀 Projects' },
          { id: 'ai_assistant', label: '🤖 AI Collaboration' },
          { id: 'directory', label: '🎴 People Directory' },
          { id: 'search', label: '🔍 Unified Search' },
          { id: 'email_sms', label: '✉️ Email & SMS' },
          { id: 'connectors', label: '🔌 Connectors' },
          { id: 'audit', label: '🛡️ Audit' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Views */}
      {activeTab === 'enterprise_home' && <EnterpriseHome profile={profile} onNavigateTab={setActiveTab} />}
      {activeTab === 'inbox' && <UnifiedInboxTab items={inboxItems} setItems={setInboxItems} />}
      {activeTab === 'team_spaces' && <TeamSpaces />}
      {activeTab === 'messaging' && <MessagingTab profile={profile} />}
      {activeTab === 'discussions' && <DiscussionsBoard />}
      {activeTab === 'tasks' && <TaskCollaborationBoard />}
      {activeTab === 'meetings' && <MeetingHub />}
      {activeTab === 'docs' && <DocumentCollaboration />}
      {activeTab === 'announcements' && <AnnouncementsTab profile={profile} />}
      {activeTab === 'social' && <SocialIntranet />}
      {activeTab === 'projects' && <ProjectCollaborationWorkspace />}
      {activeTab === 'ai_assistant' && <AiCollaborationAssistant />}
      {activeTab === 'directory' && <EnhancedDirectory onStartChat={() => setActiveTab('messaging')} />}
      {activeTab === 'search' && <UnifiedEnterpriseSearch onSelectResult={() => setActiveTab('enterprise_home')} />}
      {activeTab === 'email_sms' && <EmailSmsTab />}
      {activeTab === 'connectors' && <ConnectorsTab />}
      {activeTab === 'audit' && <AuditTab />}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  1. UNIFIED INBOX TAB
 * ────────────────────────────────────────────────────────────────────── */

function UnifiedInboxTab({ items, setItems }) {
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [replyText, setReplyText] = useState('')

  const categories = ['ALL', 'Approvals', 'Payroll', 'System Alerts', 'Recruitment', 'Attendance']

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter
      const q = search.toLowerCase().trim()
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.sender.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [items, categoryFilter, search])

  const toggleMarkRead = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, unread: !item.unread } : item))
  }

  const handleQuickApprove = (id, approved) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          actionRequired: false,
          summary: `${item.summary} [STATUS: ${approved ? 'APPROVED BY HR' : 'REJECTED'}]`,
          unread: false,
        }
      }
      return item
    }))
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bell} label="Unread Communications" value={items.filter(i => i.unread).length} color="indigo" />
        <StatCard icon={ShieldCheck} label="Pending Action / Approvals" value={items.filter(i => i.actionRequired).length} color="amber" />
        <StatCard icon={Megaphone} label="Active Broadcasts" value={3} color="blue" />
        <StatCard icon={CheckCircle2} label="Resolved Today" value={14} color="emerald" />
      </div>

      {/* Filter and Search Toolbar */}
      <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter size={14} /> Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search inbox messages..." className="w-full md:w-64" />
      </div>

      {/* Inbox Items Feed */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Inbox is clear"
            description="No communications match your current filter criteria."
          />
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`card p-5 border rounded-3xl transition-all hover:shadow-md cursor-pointer ${
                item.unread
                  ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.sender} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {initials(item.sender)}
                    </div>
                  )}
                  {item.unread && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.sender}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.category}
                      </span>
                      {item.priority === 'HIGH' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                          HIGH
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{timeAgo(item.time)}</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.summary}</p>

                  {/* Quick Action Toolbar */}
                  <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      {item.actionRequired && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuickApprove(item.id, true); }}
                            className="px-3 py-1 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} /> Quick Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuickApprove(item.id, false); }}
                            className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); toggleMarkRead(item.id); }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {item.unread ? 'Mark as Read' : 'Mark Unread'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          description={`From: ${selectedItem.sender} • Category: ${selectedItem.category}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {selectedItem.summary}
            </div>

            {selectedItem.actionRequired && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <AlertCircle size={15} /> Action Required
                </h5>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">This request requires executive sign-off. Approving will update the HR database record automatically.</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleQuickApprove(selectedItem.id, true)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                  >
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleQuickApprove(selectedItem.id, false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                  >
                    Decline Request
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="label text-xs font-medium">Send In-Line Reply</label>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a message response..."
                rows={3}
                className="input text-xs"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    setReplyText('')
                    setSelectedItem(null)
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={14} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  2. INTERNAL MESSAGING & CHANNELS TAB
 * ────────────────────────────────────────────────────────────────────── */

function MessagingTab({ profile }) {
  const [activeChatId, setActiveChatId] = useState('ch-announcements')
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES_CHAT)
  const [inputText, setInputText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [newChannelModal, setNewChannelModal] = useState(false)
  const [newChannelName, setNewChannelName] = useState('')

  const activeChatInfo = useMemo(() => {
    const ch = CHANNELS.find(c => c.id === activeChatId)
    if (ch) return { title: `#${ch.name}`, desc: ch.topic, type: 'channel' }
    const dm = INITIAL_DIRECT_MESSAGES.find(d => d.id === activeChatId)
    if (dm) return { title: dm.name, desc: `${dm.role} • ${dm.status}`, type: 'dm', avatar: dm.avatar }
    return { title: 'Conversation', desc: '', type: 'channel' }
  }, [activeChatId])

  const currentMessages = chatMessages[activeChatId] || []

  const handleSendMessage = (e) => {
    e?.preventDefault()
    if (!inputText.trim()) return

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: profile?.full_name || 'You',
      text: inputText.trim(),
      time: 'Just now',
      pinned: false,
      reactions: {},
    }

    setChatMessages(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMsg],
    }))
    setInputText('')
  }

  const handleReaction = (msgId, emoji) => {
    setChatMessages(prev => {
      const list = prev[activeChatId] || []
      const updated = list.map(m => {
        if (m.id === msgId) {
          const currentCount = m.reactions[emoji] || 0
          return {
            ...m,
            reactions: { ...m.reactions, [emoji]: currentCount + 1 },
          }
        }
        return m
      })
      return { ...prev, [activeChatId]: updated }
    })
  }

  const handleCreateChannel = () => {
    if (!newChannelName.trim()) return
    const formatted = newChannelName.toLowerCase().replace(/\s+/g, '-')
    CHANNELS.push({
      id: `ch-${Date.now()}`,
      name: formatted,
      type: 'channel',
      isPublic: true,
      unread: 0,
      topic: 'New enterprise team room',
    })
    setNewChannelName('')
    setNewChannelModal(false)
  }

  return (
    <div className="card overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[75vh]">
        {/* Left Sidebar: Channels & DMs */}
        <div className="border-r border-slate-200 dark:border-slate-800 flex flex-col md:col-span-1 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search chats..." />
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
            {/* Department Channels */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Channels</span>
                <button
                  onClick={() => setNewChannelModal(true)}
                  className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </div>
              <div className="space-y-1">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChatId(ch.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeChatId === ch.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Hash size={14} className={activeChatId === ch.id ? 'text-indigo-200' : 'text-slate-400'} />
                      {ch.name}
                    </span>
                    {ch.unread > 0 && activeChatId !== ch.id && (
                      <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {ch.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Direct Messages</span>
              </div>
              <div className="space-y-1">
                {INITIAL_DIRECT_MESSAGES.map(dm => (
                  <button
                    key={dm.id}
                    onClick={() => setActiveChatId(dm.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeChatId === dm.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="relative">
                        <img src={dm.avatar} alt={dm.name} className="h-6 w-6 rounded-full object-cover" />
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white ${dm.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      </span>
                      <span className="truncate">{dm.name}</span>
                    </span>
                    {dm.unread > 0 && activeChatId !== dm.id && (
                      <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {dm.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Chat Window */}
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              {activeChatInfo.avatar && (
                <img src={activeChatInfo.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {activeChatInfo.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{activeChatInfo.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <Pin size={16} />
              </button>
              <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <Users size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30 dark:bg-slate-950/20">
            {currentMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs text-slate-500">No messages in this channel yet. Say hello!</p>
                </div>
              </div>
            ) : (
              currentMessages.map(msg => (
                <div key={msg.id} className="flex flex-col group">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {initials(msg.sender)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{msg.sender}</span>
                        <span className="text-[10px] text-slate-400">{msg.time}</span>
                        {msg.pinned && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <Pin size={10} /> Pinned
                          </span>
                        )}
                      </div>

                      <div className="mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 inline-block max-w-xl shadow-xs">
                        {msg.text}
                      </div>

                      {/* Reactions & Add Reaction Trigger */}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {Object.entries(msg.reactions || {}).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                          >
                            <span>{emoji}</span> <span>{count}</span>
                          </button>
                        ))}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          {['👍', '❤️', '🎉', '🚀'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="text-xs hover:scale-125 transition-transform cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Send Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
            <button type="button" className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Message ${activeChatInfo.title}...`}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* New Channel Modal */}
      {newChannelModal && (
        <Modal
          open={newChannelModal}
          onClose={() => setNewChannelModal(false)}
          title="Create New Channel"
          description="Build a room for team projects, departments, or broad announcements."
        >
          <div className="space-y-4">
            <div>
              <label className="label text-xs font-medium">Channel Name</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  placeholder="e.g. q3-launch-team"
                  className="input pl-9 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setNewChannelModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChannel}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
              >
                Create Channel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  3. ENTERPRISE ANNOUNCEMENTS TAB
 * ────────────────────────────────────────────────────────────────────── */

function AnnouncementsTab({ profile }) {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_LIST)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAckModal, setShowAckModal] = useState(null)
  const [form, setForm] = useState({ title: '', content: '', priority: 'MEDIUM', audience: 'All Staff', isEmergency: false })

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return

    const newAnn = {
      id: `ann-${Date.now()}`,
      title: form.title,
      content: form.content,
      priority: form.isEmergency ? 'EMERGENCY' : form.priority,
      audience: form.audience,
      createdBy: profile?.full_name || 'HR Management',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      acknowledgedCount: 1,
      totalCount: 25,
      isEmergency: form.isEmergency,
    }

    setAnnouncements([newAnn, ...announcements])
    setShowCreateModal(false)
    setForm({ title: '', content: '', priority: 'MEDIUM', audience: 'All Staff', isEmergency: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise Announcement Center</h3>
          <p className="text-xs text-slate-500">Publish high-priority broadcasts, policy changes, and emergency notifications with mandatory staff acknowledgment.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={16} /> New Broadcast
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => {
          const ackPct = Math.round((ann.acknowledgedCount / ann.totalCount) * 100)
          return (
            <div
              key={ann.id}
              className={`card p-6 border rounded-3xl transition-all ${
                ann.isEmergency
                  ? 'bg-red-500/5 dark:bg-red-950/30 border-red-500/50 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {ann.isEmergency ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white animate-bounce">
                        <AlertTriangle size={13} /> EMERGENCY ALERT
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ann.priority === 'HIGH' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {ann.priority} PRIORITY
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-500">Target: {ann.audience}</span>
                    <span className="text-xs text-slate-400">• Posted {formatDate(ann.createdAt)} by {ann.createdBy}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                </div>

                {/* Acknowledgement Tracker Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 w-full md:w-64 flex-shrink-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Staff Acknowledgement</span>
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{ackPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${ackPct}%` }} />
                  </div>
                  <button
                    onClick={() => setShowAckModal(ann)}
                    className="w-full py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors cursor-pointer"
                  >
                    View Status Log ({ann.acknowledgedCount}/{ann.totalCount})
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Enterprise Broadcast"
          description="Send an official announcement to employees with acknowledgment tracking."
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label text-xs font-medium">Broadcast Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Q3 Company Strategy Update"
                className="input text-xs"
                required
              />
            </div>
            <div>
              <label className="label text-xs font-medium">Content / Message</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Write full announcement details..."
                rows={4}
                className="input text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-medium">Target Audience</label>
                <select
                  value={form.audience}
                  onChange={e => setForm({ ...form, audience: e.target.value })}
                  className="input text-xs"
                >
                  <option value="All Staff">All Staff</option>
                  <option value="Engineering & Ops">Engineering & Ops</option>
                  <option value="Management & HR">Management & HR</option>
                </select>
              </div>
              <div>
                <label className="label text-xs font-medium">Priority Level</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="input text-xs"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="emergency"
                checked={form.isEmergency}
                onChange={e => setForm({ ...form, isEmergency: e.target.checked })}
                className="rounded border-slate-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="emergency" className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle size={14} /> Flag as Emergency Alert (Bypasses mute settings & sends push SMS)
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
              >
                Publish Broadcast
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ack Status Modal */}
      {showAckModal && (
        <Modal
          open={!!showAckModal}
          onClose={() => setShowAckModal(null)}
          title={`Acknowledgement Audit: ${showAckModal.title}`}
          description="Read receipt verification log across active organization staff."
        >
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Total Targeted Staff: <strong>25</strong></span>
              <span>Acknowledged: <strong className="text-emerald-600">22</strong></span>
              <span>Pending: <strong className="text-amber-600">3</strong></span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
              {['Sarah Jenkins', 'Michael Chen', 'Elena Rostova', 'Alex Vance', 'Lucas Vance'].map((name, i) => (
                <div key={name} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
                  {i < 4 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Read & Acknowledged
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Clock size={14} /> Pending Read
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAckModal(null)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  4. EMAIL & SMS DISPATCH CENTER
 * ────────────────────────────────────────────────────────────────────── */

function EmailSmsTab() {
  const [templates] = useState(INITIAL_EMAIL_SMS_TEMPLATES)
  const [selectedTpl, setSelectedTpl] = useState(INITIAL_EMAIL_SMS_TEMPLATES[0])
  const [logs] = useState(DISPATCH_LOGS)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Manager */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail size={16} /> Centralized Template Builder
            </h4>
            <span className="text-xs text-slate-500">3 Active Templates</span>
          </div>

          <div className="flex gap-2">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTpl(tpl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTpl.id === tpl.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {tpl.channel === 'Email' ? '📧' : '📱'} {tpl.category}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="label text-xs font-medium">Template Name</label>
              <input type="text" value={selectedTpl.name} readOnly className="input text-xs bg-slate-50 dark:bg-slate-800/50" />
            </div>
            {selectedTpl.channel === 'Email' && (
              <div>
                <label className="label text-xs font-medium">Subject Line</label>
                <input type="text" value={selectedTpl.subject} readOnly className="input text-xs bg-slate-50 dark:bg-slate-800/50" />
              </div>
            )}
            <div>
              <label className="label text-xs font-medium">Message Body (Supports Variables)</label>
              <textarea value={selectedTpl.body} readOnly rows={5} className="input text-xs font-mono bg-slate-50 dark:bg-slate-800/50" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400">Available Variables:</span>
              {['{{employee_name}}', '{{amount}}', '{{job_title}}', '{{department}}', '{{date}}', '{{link}}'].map(tag => (
                <span key={tag} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Dispatch Logs */}
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone size={16} /> Real-Time Gateway Logs
            </h4>
            <span className="text-xs text-slate-500">Live Twilio / SendGrid Feed</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map(log => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{log.recipient}</p>
                  <p className="text-[11px] text-slate-500">{log.template} • {log.sentAt}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    log.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {log.status}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{log.channel} • {log.openRate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  5. TASKS & APPROVAL THREADS TAB
 * ────────────────────────────────────────────────────────────────────── */

function TasksApprovalsTab() {
  const [tasks, setTasks] = useState(TASKS_LIST)
  const [newTaskModal, setNewTaskModal] = useState(false)
  const [form, setForm] = useState({ title: '', assignee: 'Sarah Jenkins', priority: 'MEDIUM', dueDate: '2026-08-05' })

  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setTasks([{ id: `tsk-${Date.now()}`, title: form.title, assignee: form.assignee, dueDate: form.dueDate, priority: form.priority, status: 'Pending', category: 'General' }, ...tasks])
    setNewTaskModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Task Command & Approval Discussions</h3>
          <p className="text-xs text-slate-500">Track assigned HR action items and threaded discussions tied to approval requests.</p>
        </div>
        <button
          onClick={() => setNewTaskModal(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer flex items-center gap-1.5"
        >
          <Plus size={16} /> Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tasks.map(tsk => (
          <div key={tsk.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {tsk.category}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tsk.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {tsk.priority}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tsk.title}</h4>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Assignee: {tsk.assignee}</span>
              <span>Due: {tsk.dueDate}</span>
            </div>
          </div>
        ))}
      </div>

      {newTaskModal && (
        <Modal
          open={newTaskModal}
          onClose={() => setNewTaskModal(false)}
          title="Create & Assign HR Task"
          description="Assign a task to a team member with notification alerts."
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="label text-xs font-medium">Task Description</label>
              <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Audit Q3 tax forms" className="input text-xs" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-medium">Assignee</label>
                <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} className="input text-xs">
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Michael Chen">Michael Chen</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                </select>
              </div>
              <div>
                <label className="label text-xs font-medium">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="input text-xs" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewTaskModal(false)} className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white cursor-pointer">Create Task</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  6. EXTERNAL CONNECTORS TAB
 * ────────────────────────────────────────────────────────────────────── */

function ConnectorsTab() {
  const [connectors, setConnectors] = useState(EXTERNAL_CONNECTORS)

  const toggleConnector = (id) => {
    setConnectors(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Connected' ? 'Disabled' : 'Connected'
        return { ...c, status: nextStatus }
      }
      return c
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">External Integration Framework</h3>
        <p className="text-xs text-slate-500">Connect StaffRoom communication channels to external collaboration tools and SMS gateways seamlessly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map(conn => (
          <div key={conn.id} className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{conn.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{conn.name}</h4>
                  <p className="text-[10px] text-slate-400">{conn.events}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                conn.status === 'Connected' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {conn.status}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate">
              {conn.webhook}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => toggleConnector(conn.id)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {conn.status === 'Connected' ? 'Disable Connector' : 'Enable & Configure'}
              </button>
              <button className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 cursor-pointer">
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 *  7. AUDIT & COMPLIANCE TAB
 * ────────────────────────────────────────────────────────────────────── */

function AuditTab() {
  return (
    <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={16} /> Communication Audit & Retention Logs
          </h4>
          <p className="text-xs text-slate-500">Immutable record of enterprise communications, delivery receipts, and compliance enforcement.</p>
        </div>
        <button className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer">
          <Download size={14} /> Export Audit Log (.CSV)
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {[
          { id: 1, type: 'Broadcast', sender: 'Alex Vance', event: 'EMERGENCY WEATHER ADVISORY', target: 'All Staff (25 Users)', time: '2026-07-31 06:00', status: '25/25 Delivered' },
          { id: 2, type: 'Direct Message', sender: 'Sarah Jenkins', event: 'Policy Review Chat', target: 'Elena Rostova', time: '2026-07-31 09:45', status: 'Read' },
          { id: 3, type: 'SMS Dispatch', sender: 'System Engine', event: 'Payslip Disbursal SMS', target: '+1555019283', time: '2026-07-31 08:30', status: 'Twilio Delivered' },
        ].map(row => (
          <div key={row.id} className="py-3 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">{row.event}</span>
              <p className="text-[11px] text-slate-500">Sender: {row.sender} • Target: {row.target}</p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{row.status}</span>
              <p className="text-[10px] text-slate-400">{row.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
