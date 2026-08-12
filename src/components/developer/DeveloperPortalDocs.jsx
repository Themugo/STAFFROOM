import { useState } from 'react'
import {
  BookOpen, Download, Code, Terminal, ShieldCheck, Zap, FileText,
  ExternalLink, Copy, Check, ChevronRight, Layers, Sparkles
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const SDKS = [
  { name: 'Node.js / TypeScript SDK', package: 'npm install @staffroom/sdk', lang: 'TS / JS', version: 'v3.2.0', downloads: '142k/mo' },
  { name: 'Python PyPI SDK', package: 'pip install staffroom-sdk', lang: 'Python 3.10+', version: 'v2.8.1', downloads: '98k/mo' },
  { name: 'Java Enterprise SDK', package: 'implementation "io.staffroom:sdk:3.0"', lang: 'Java 17+', version: 'v3.0.0', downloads: '65k/mo' },
  { name: 'C# .NET Core SDK', package: 'dotnet add package StaffRoom.SDK', lang: '.NET 8.0', version: 'v2.5.0', downloads: '54k/mo' },
  { name: 'Go Language SDK', package: 'go get github.com/staffroom/sdk-go', lang: 'Go 1.22+', version: 'v1.9.0', downloads: '41k/mo' },
  { name: 'PHP Composer Package', package: 'composer require staffroom/sdk-php', lang: 'PHP 8.2+', version: 'v2.1.0', downloads: '32k/mo' },
]

const GUIDES = [
  { title: 'Authentication & OAuth 2.1 PKCE Flow Guide', category: 'Security', readTime: '5 min read', desc: 'Learn how to issue Bearer tokens and authenticate client requests securely.' },
  { title: 'Building Custom Webhook Handlers & Signature Verification', category: 'Webhooks', readTime: '8 min read', desc: 'Verify HMAC SHA-256 headers (`X-Staffroom-Signature`) to guarantee authenticity.' },
  { title: 'Rate Limiting, Idempotency Keys & Retry Policies', category: 'Best Practices', readTime: '6 min read', desc: 'Handle `429 Too Many Requests` gracefully using exponential backoff.' },
  { title: 'SCIM 2.0 Identity Provisioning Protocol Spec', category: 'Enterprise SSO', readTime: '10 min read', desc: 'Automate user lifecycle provisioning from Okta, Azure AD, and Ping Identity.' },
]

export default function DeveloperPortalDocs() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [activeTab, setActiveTab] = useState('sdks') // 'sdks' | 'guides' | 'migration'

  const handleCopy = (pkg) => {
    navigator.clipboard.writeText(pkg)
    showSuccess(`Copied command: ${pkg}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Developer Portal, Official SDKs & Integration Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Everything you need to build custom integrations, client SDKs, and enterprise plugins on StaffRoom.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['sdks', 'guides'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'sdks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SDKS.map((sdk, i) => (
            <div
              key={i}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm hover:border-indigo-400 transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{sdk.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {sdk.version}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 text-indigo-300 font-mono text-[11px] flex items-center justify-between border border-slate-800">
                <span className="truncate pr-2">{sdk.package}</span>
                <button
                  onClick={() => handleCopy(sdk.package)}
                  className="text-slate-400 hover:text-white cursor-pointer shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Target: {sdk.lang}</span>
                <span>Downloads: {sdk.downloads}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GUIDES.map((g, i) => (
            <div
              key={i}
              className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm hover:border-indigo-400 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px]">
                  {g.category}
                </span>
                <span className="text-[10px] text-slate-400">{g.readTime}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                {g.title} <ChevronRight size={14} className="text-indigo-600 shrink-0" />
              </h3>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
