import { useState } from 'react'
import {
  Store, CheckCircle2, XCircle, Search, Filter, ShieldCheck, Zap,
  ExternalLink, RefreshCw, Settings, AlertTriangle, ArrowRight, Check,
  Sliders, Database, Globe, Key, FileText, Lock, Play, Cpu, Layers, Sparkles
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const CONNECTOR_CATEGORIES = [
  'All Integrations',
  'Workspace & Productivity',
  'ERP & Accounting',
  'CRM & Sales',
  'Engineering & DevOps',
  'Telecom & Messaging',
  'Identity & SSO'
]

const INITIAL_CONNECTORS = [
  {
    id: 'ms365',
    name: 'Microsoft 365 & Entra ID',
    category: 'Workspace & Productivity',
    logo: '🟦',
    description: 'Sync employee directory, Azure AD single sign-on, and calendar leave events.',
    installed: true,
    status: 'Connected',
    lastSync: '2 minutes ago',
    version: 'v2.4.0',
    tier: 'Enterprise',
    config: {
      tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47',
      clientId: 'staffroom-azure-sso-app-id',
      syncInterval: '15 mins',
      eventsToSync: ['Users', 'Calendar Absences', 'Groups'],
    }
  },
  {
    id: 'google_workspace',
    name: 'Google Workspace',
    category: 'Workspace & Productivity',
    logo: '🔴',
    description: 'Google Directory sync, Gmail automated payslip dispatches, and Calendar OOO events.',
    installed: true,
    status: 'Connected',
    lastSync: '10 minutes ago',
    version: 'v3.1.0',
    tier: 'Enterprise',
    config: {
      domain: 'company.com',
      serviceAccount: 'staffroom-sync@company.iam.gserviceaccount.com',
      syncInterval: '30 mins',
      eventsToSync: ['Directory', 'Gmail Notifications', 'Google Calendar'],
    }
  },
  {
    id: 'slack',
    name: 'Slack HR Bot & Notifications',
    category: 'Workspace & Productivity',
    logo: '🟩',
    description: 'Real-time leave approval pings, daily attendance digests, and instant HR HelpDesk notifications.',
    installed: true,
    status: 'Connected',
    lastSync: '1 minute ago',
    version: 'v1.8.2',
    tier: 'Standard',
    config: {
      botToken: 'xoxb-982341234123-8912348123',
      defaultChannel: '#hr-approvals-stream',
      slashCommandsEnabled: true,
    }
  },
  {
    id: 'ms_teams',
    name: 'Microsoft Teams Integration',
    category: 'Workspace & Productivity',
    logo: '🟣',
    description: 'Approve leave requests directly inside Teams channels and receive interview reminders.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v2.0.1',
    tier: 'Standard',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online / Desktop',
    category: 'ERP & Accounting',
    logo: '🟢',
    description: 'Automated payroll journal entries dispatch, tax breakdown export, and expense reimbursement sync.',
    installed: true,
    status: 'Connected',
    lastSync: '1 hour ago',
    version: 'v4.0.2',
    tier: 'Enterprise',
    config: {
      realmId: '46208123981239',
      autoSyncPayroll: true,
      chartOfAccounts: '6100 - Payroll Expenses',
    }
  },
  {
    id: 'xero',
    name: 'Xero Cloud Accounting',
    category: 'ERP & Accounting',
    logo: '🔷',
    description: 'Seamless monthly payroll summary sync, timesheet imports, and employee reimbursable claims.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v2.2.0',
    tier: 'Standard',
  },
  {
    id: 'sap',
    name: 'SAP SuccessFactors / S/4HANA',
    category: 'ERP & Accounting',
    logo: '🟨',
    description: 'Bi-directional employee master data reconciliation and global payroll ledger integration.',
    installed: true,
    status: 'Connected',
    lastSync: '6 hours ago',
    version: 'v5.0.0',
    tier: 'Custom Enterprise',
    config: {
      apiEndpoint: 'https://api.sap.company.com/odata/v4',
      companyCode: 'US01',
      syncInterval: 'Daily at midnight',
    }
  },
  {
    id: 'oracle',
    name: 'Oracle HCM Cloud',
    category: 'ERP & Accounting',
    logo: '🔴',
    description: 'Enterprise workforce analytics feed, global talent data warehouse connector, and payroll bridge.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v1.5.0',
    tier: 'Custom Enterprise',
  },
  {
    id: 'salesforce',
    name: 'Salesforce CRM & Workflows',
    category: 'CRM & Sales',
    logo: '☁️',
    description: 'Sync sales team commission bonuses into StaffRoom payroll and map commission metrics.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v2.1.0',
    tier: 'Enterprise',
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'CRM & Sales',
    logo: '🟧',
    description: 'Track sales rep attendance vs. target performance and automate commission calculations.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v1.2.0',
    tier: 'Standard',
  },
  {
    id: 'jira',
    name: 'Jira Software & Service Management',
    category: 'Engineering & DevOps',
    logo: '🟦',
    description: 'Convert employee IT asset requests into Jira service desk tickets automatically.',
    installed: true,
    status: 'Connected',
    lastSync: '15 minutes ago',
    version: 'v3.0.1',
    tier: 'Standard',
    config: {
      jiraInstance: 'company.atlassian.net',
      projectKey: 'ITSD',
      autoTicketOnboarding: true,
    }
  },
  {
    id: 'github',
    name: 'GitHub Enterprise',
    category: 'Engineering & DevOps',
    logo: '⬛',
    description: 'Auto-provision GitHub team access on employee onboarding and revoke on offboarding.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v1.4.0',
    tier: 'Developer Tier',
  },
  {
    id: 'twilio',
    name: 'Twilio Programmable SMS',
    category: 'Telecom & Messaging',
    logo: '🔴',
    description: 'Send emergency SMS broadcasts, 2FA codes, and instant shift change alerts to employee phones.',
    installed: true,
    status: 'Connected',
    lastSync: 'Active',
    version: 'v2.8.0',
    tier: 'Standard',
    config: {
      accountSid: 'AC_9812371239812398123',
      fromNumber: '+1 800 555 0199',
    }
  },
  {
    id: 'africas_talking',
    name: "Africa's Talking Gateway",
    category: 'Telecom & Messaging',
    logo: '🌍',
    description: 'Regional SMS & USSD gateway for African markets, airtime disbursements, and shift pings.',
    installed: true,
    status: 'Connected',
    lastSync: 'Active',
    version: 'v1.9.0',
    tier: 'Regional Enterprise',
    config: {
      username: 'staffroom_prod_ke',
      shortcode: '22891',
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    category: 'Telecom & Messaging',
    logo: '🟢',
    description: 'Send automated PDF payslips, interview reminders, and instant leave status alerts via WhatsApp.',
    installed: false,
    status: 'Available',
    lastSync: 'Never',
    version: 'v2.0.0',
    tier: 'Enterprise',
  },
  {
    id: 'okta',
    name: 'Okta Universal Directory & SSO',
    category: 'Identity & SSO',
    logo: '🔵',
    description: 'OIDC/SAML2 single sign-on, SCIM 2.0 automated user provisioning, and group mapping.',
    installed: true,
    status: 'Connected',
    lastSync: 'Real-time SCIM',
    version: 'v4.2.1',
    tier: 'Security Enterprise',
    config: {
      oktaDomain: 'company.okta.com',
      scimEndpoint: 'https://api.staffroom.io/v1/scim/v2',
    }
  },
]

export default function IntegrationMarketplace() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const showInfo = notifications?.info || ((m) => console.log(m))

  const [connectors, setConnectors] = useState(INITIAL_CONNECTORS)
  const [selectedCategory, setSelectedCategory] = useState('All Integrations')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConnector, setSelectedConnector] = useState(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  // Filter logic
  const filteredConnectors = connectors.filter(c => {
    const matchesCategory = selectedCategory === 'All Integrations' || c.category === selectedCategory
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Installation / Disconnection
  const handleToggleInstall = (connector) => {
    setConnectors(prev => prev.map(c => {
      if (c.id === connector.id) {
        const nextInstalled = !c.installed
        if (nextInstalled) {
          showSuccess(`Installed ${c.name} connector successfully!`)
        } else {
          showInfo(`Uninstalled ${c.name} connector.`)
        }
        return {
          ...c,
          installed: nextInstalled,
          status: nextInstalled ? 'Connected' : 'Available',
          lastSync: nextInstalled ? 'Just now' : 'Never'
        }
      }
      return c
    }))
  }

  // Open config modal
  const handleOpenConfig = (connector) => {
    setSelectedConnector(connector)
    setTestResult(null)
    setIsConfigModalOpen(true)
  }

  // Test Connection
  const handleRunTest = () => {
    setIsTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setIsTesting(false)
      setTestResult({
        success: true,
        latencyMs: 84,
        status: '200 OK',
        message: `Successfully verified OAuth tokens & bi-directional sync payload with ${selectedConnector.name}.`
      })
      showSuccess(`Connection test passed for ${selectedConnector.name}!`)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              Enterprise Integration Marketplace & Pre-built Connectors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Connect StaffRoom with your HR ecosystem, ERP, Accounting, CRM, Messaging, and Identity Providers with zero code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              {connectors.filter(c => c.installed).length} Active Connectors
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
              {connectors.length} Total Pre-built Integrations
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search connectors (e.g. Slack, SAP, QuickBooks)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input text-xs pl-9 w-full bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {CONNECTOR_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Connectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredConnectors.map(connector => (
          <div
            key={connector.id}
            className={`card p-5 bg-white dark:bg-slate-900 border rounded-3xl space-y-4 transition-all flex flex-col justify-between ${
              connector.installed
                ? 'border-indigo-300 dark:border-indigo-800/80 shadow-md ring-1 ring-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl h-11 w-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {connector.logo}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{connector.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-400">{connector.category}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                  connector.installed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {connector.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {connector.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Version: <strong className="text-slate-700 dark:text-slate-300">{connector.version}</strong></span>
                <span>Tier: <strong className="text-indigo-600 dark:text-indigo-400">{connector.tier}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                {connector.installed ? (
                  <>
                    <button
                      onClick={() => handleOpenConfig(connector)}
                      className="btn-secondary text-xs flex-1 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Settings size={14} /> Configure Sync
                    </button>
                    <button
                      onClick={() => handleToggleInstall(connector)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 cursor-pointer"
                      title="Uninstall Connector"
                    >
                      Uninstall
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleToggleInstall(connector)}
                    className="btn-primary text-xs w-full flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap size={14} /> Install Connector
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Connector Settings & Sync Field Mapping */}
      {isConfigModalOpen && selectedConnector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedConnector.logo}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedConnector.name} Integration Setup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure authentication credentials, bi-directional event sync, and field mapping.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Config Fields */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block">Bi-Directional Sync Active</span>
                  <span className="text-[11px] text-indigo-700 dark:text-indigo-300">Last successful sync: {selectedConnector.lastSync}</span>
                </div>
                <button
                  onClick={handleRunTest}
                  disabled={isTesting}
                  className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                  {isTesting ? 'Testing Connection...' : 'Test Connection'}
                </button>
              </div>

              {testResult && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>✓ CONNECTION VERIFIED ({testResult.status})</span>
                    <span>{testResult.latencyMs} ms latency</span>
                  </div>
                  <p className="text-emerald-300 font-sans">{testResult.message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Sync Schedule Frequency
                  </label>
                  <select className="input text-xs w-full bg-white dark:bg-slate-900">
                    <option value="realtime">Real-time (Webhooks / SCIM)</option>
                    <option value="15min">Every 15 Minutes</option>
                    <option value="hourly">Hourly Sync</option>
                    <option value="daily">Daily at Midnight</option>
                  </select>
                </div>

                <div>
                  <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Security Token / OAuth Client ID
                  </label>
                  <input
                    type="password"
                    value="••••••••••••••••••••••••••••••••"
                    readOnly
                    className="input text-xs w-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Field Mapping Preview */}
              <div className="space-y-2">
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Attribute & Field Mapping Rules
                </label>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 dark:border-slate-700 pb-1">
                    <span>StaffRoom Attribute</span>
                    <span>→</span>
                    <span>Target Enterprise App Field</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span>`employee.work_email`</span>
                    <span>→</span>
                    <span className="text-indigo-600 dark:text-indigo-400">`userPrincipalName`</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span>`payroll.gross_salary`</span>
                    <span>→</span>
                    <span className="text-indigo-600 dark:text-indigo-400">`Accounting.Ledger6100`</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span>`leave.status_approved`</span>
                    <span>→</span>
                    <span className="text-indigo-600 dark:text-indigo-400">`Calendar.OutofOfficeEvent`</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="btn-secondary text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showSuccess(`Updated ${selectedConnector.name} settings.`)
                  setIsConfigModalOpen(false)
                }}
                className="btn-primary text-xs flex items-center gap-1 cursor-pointer"
              >
                <Check size={14} /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
