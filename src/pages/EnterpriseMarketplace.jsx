import React, { useState, useMemo } from 'react'
import {
  Store, Globe, Building, ShieldCheck, CreditCard, Sparkles, Bot, Package,
  Download, Plus, Search, Filter, CheckCircle2, AlertTriangle, Layers,
  Terminal, Code2, Users, DollarSign, Sliders, Check, X, RefreshCw, Zap,
  ChevronRight, Laptop, Award, Cpu, Star, ExternalLink, Shield, Settings,
  MapPin, Flag, FileText, Lock
} from 'lucide-react'
import { useDepartment } from '../contexts/DepartmentContext'
import { useNotifications } from '../contexts/NotificationContext'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  Modal,
  SearchInput
} from '../components/ui'

// Mock Data Sets for Enterprise Marketplace & Ecosystem
const INITIAL_MARKETPLACE_APPS = [
  {
    id: 'app-hc-01',
    name: 'Healthcare & Clinical Workforce Accelerator',
    category: 'Industry Packs',
    rating: 4.9,
    installs: '1,240',
    developer: 'StaffRoom Health Labs',
    price: '$250/mo',
    status: 'INSTALLED',
    icon: '🏥',
    description: 'HIPAA-compliant shift scheduling, doctor-on-call dispatch, and medical credential verification.'
  },
  {
    id: 'app-fin-02',
    name: 'Financial Services & Anti-Money Laundering (AML)',
    category: 'Industry Packs',
    rating: 4.8,
    installs: '890',
    developer: 'FinTech Compliance Global',
    price: '$450/mo',
    status: 'AVAILABLE',
    icon: '🏦',
    description: 'Central bank reporting, PEP screening, and real-time transaction threshold monitoring.'
  },
  {
    id: 'app-comp-ke',
    name: 'Kenya & East Africa Statutory Payroll Pack',
    category: 'Regional Compliance',
    rating: 5.0,
    installs: '3,450',
    developer: 'StaffRoom Africa Team',
    price: 'Included',
    status: 'INSTALLED',
    icon: '🇰🇪',
    description: 'Automated KRA iTax, SHIF, NSSF Tier I/II, Housing Levy, and M-Pesa bulk salary payouts.'
  },
  {
    id: 'app-comp-uk',
    name: 'UK HMRC & GDPR Statutory Compliance Pack',
    category: 'Regional Compliance',
    rating: 4.9,
    installs: '2,100',
    developer: 'StaffRoom EU/UK Legal',
    price: 'Included',
    status: 'INSTALLED',
    icon: '🇬🇧',
    description: 'HMRC Real Time Information (RTI), PAYE pension auto-enrolment, and GDPR Right to Erasure workflows.'
  },
  {
    id: 'app-ai-cfo',
    name: 'Autonomous CFO & Capital Allocator Agent',
    category: 'AI Agents',
    rating: 4.9,
    installs: '1,820',
    developer: 'StaffRoom AI Core',
    price: '$180/mo',
    status: 'INSTALLED',
    icon: '🤖',
    description: 'Continuous budget variance analysis, cash runway forecasting, and automated vendor discount negotiation.'
  },
  {
    id: 'app-slack-ext',
    name: 'Slack & Teams Universal Approval Bot',
    category: 'Extensions',
    rating: 4.7,
    installs: '4,500',
    developer: 'Open Integration Works',
    price: 'Free',
    status: 'INSTALLED',
    icon: '💬',
    description: '1-click expense, leave, and procurement approvals directly inside Slack & Microsoft Teams.'
  }
]

const INITIAL_TENANTS = [
  {
    id: 'tnt-01',
    name: 'Acme Enterprise Global',
    domain: 'acme.staffroom.io',
    plan: 'Enterprise Ultimate (Multi-Region)',
    seatsUsed: 1420,
    seatsLimit: 2000,
    region: 'EMEA / US-East',
    whiteLabel: true,
    status: 'ACTIVE'
  },
  {
    id: 'tnt-02',
    name: 'Safari Logistics Group',
    domain: 'logistics.safarigroup.co.ke',
    plan: 'Enterprise Growth',
    seatsUsed: 480,
    seatsLimit: 500,
    region: 'Africa (Nairobi)',
    whiteLabel: true,
    status: 'ACTIVE'
  }
]

export default function EnterpriseMarketplace() {
  const {
    departments,
    activeDepartmentId,
    userDepartment
  } = useDepartment()

  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((msg) => console.log(msg))

  // Operating Tabs
  const [activeTab, setActiveTab] = useState('marketplace') // marketplace, multitenant, whitelabel, developer, partner, compliance, billing
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // States
  const [apps, setApps] = useState(INITIAL_MARKETPLACE_APPS)
  const [tenants, setTenants] = useState(INITIAL_TENANTS)

  // Modals
  const [modalMode, setModalMode] = useState(null) // 'install_app', 'new_tenant'

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCat = categoryFilter === 'ALL' || app.category === categoryFilter
      return matchesSearch && matchesCat
    })
  }, [apps, searchQuery, categoryFilter])

  const handleInstallApp = (appId, appName) => {
    setApps(apps.map(a => a.id === appId ? { ...a, status: 'INSTALLED' } : a))
    showSuccess(`App "${appName}" installed into Enterprise Tenant Ecosystem!`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Enterprise Cloud Platform, Marketplace & Ecosystem"
        description={`Multi-tenant SaaS administration, white-label branding, industry accelerators, regional compliance packs, developer portal, and AI agent store.`}
        icon={Store}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('developer')}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Code2 size={14} /> Developer Portal
            </button>
            <button
              onClick={() => setActiveTab('whitelabel')}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              <Settings size={14} /> White-Label Studio
            </button>
          </div>
        }
      />

      {/* Main Operating Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'marketplace', label: 'Enterprise App Store & Marketplace', icon: Store, badge: apps.length },
          { id: 'multitenant', label: 'Multi-Tenant Cloud Admin', icon: Building, badge: tenants.length },
          { id: 'whitelabel', label: 'White-Label & Custom Domain Studio', icon: Laptop },
          { id: 'compliance', label: 'Regional Compliance Packs', icon: Flag },
          { id: 'developer', label: 'Developer SDK & Extension Framework', icon: Code2 },
          { id: 'partner', label: 'Partner Portal & Resellers', icon: Users },
          { id: 'billing', label: 'Subscription & Multi-Gateway Billing', icon: CreditCard }
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
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* TAB 1: ENTERPRISE MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps, industry packs, AI agents..."
              className="w-full sm:w-72"
            />

            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-slate-400 font-bold shrink-0">Category:</span>
              {['ALL', 'Industry Packs', 'Regional Compliance', 'AI Agents', 'Extensions'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between text-xs">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{app.icon}</span>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-lg text-[11px]">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      <span>{app.rating}</span>
                    </div>
                  </div>

                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                      {app.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{app.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mt-1">{app.description}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm block">{app.price}</span>
                    <span className="text-[10px] text-slate-400">{app.installs} active installs</span>
                  </div>

                  {app.status === 'INSTALLED' ? (
                    <span className="px-3 py-1.5 rounded-xl font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Installed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInstallApp(app.id, app.name)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
                    >
                      <Download size={13} /> Install Pack
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-TENANT CLOUD ADMIN */}
      {activeTab === 'multitenant' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Multi-Tenant SaaS Isolation & Organization Directory</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Isolated database schemas, custom domains, regional hosting, and seat allocation.</p>
              </div>
              <button onClick={() => showSuccess('Tenant provisioner initialized.')} className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                <Plus size={14} /> Provision New Tenant
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {tenants.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.id}</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{t.name}</h4>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-0.5">Domain: {t.domain} • Region: {t.region}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center font-mono text-[11px]">
                    <span>Plan: {t.plan}</span>
                    <span>Seats: {t.seatsUsed} / {t.seatsLimit}</span>
                    <span className="text-emerald-600 font-bold">White-Label: Enabled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHITE LABEL STUDIO */}
      {activeTab === 'whitelabel' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-bold">
                <Laptop size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">White-Label Branding & Custom Domain Studio</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure corporate logos, primary brand colors, custom SSL domains, and email templates.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Corporate Visual Identity</h4>
                <div>
                  <label className="label">Brand Platform Title</label>
                  <input className="input" defaultValue="Acme Enterprise OS" />
                </div>
                <div>
                  <label className="label">Primary Custom Domain</label>
                  <input className="input" defaultValue="portal.acme-corp.com" />
                </div>
                <div>
                  <label className="label">Primary Accent Color Code</label>
                  <input className="input font-mono" defaultValue="#4F46E5 (Indigo Hex)" />
                </div>
                <button onClick={() => showSuccess('White-label branding saved and propagated to tenant edge CDN!')} className="btn-primary text-xs py-2 px-4 cursor-pointer">
                  Save Branding Configuration
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">SSL & DNS Domain Verification</h4>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block">CNAME Status: Verified</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">portal.acme-corp.com → ingress.staffroom.cloud (Wildcard Let's Encrypt SSL Active)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BILLING & PAYMENT GATEWAYS */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Multi-Currency Subscription & Payment Gateways</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Stripe Enterprise</span>
                <p className="text-[11px] text-slate-400">Card & ACH Direct Debit processing in USD, EUR, GBP.</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono inline-block">ACTIVE</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Safaricom M-Pesa B2B</span>
                <p className="text-[11px] text-slate-400">Instant mobile money collection in KES, TZS, UGX.</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono inline-block">ACTIVE</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Direct Bank Wire / Invoice</span>
                <p className="text-[11px] text-slate-400">Annual contract billing with NET-30 terms.</p>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono inline-block">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
