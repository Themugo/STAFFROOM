import React, { useState } from 'react'
import {
  Sparkles, CheckCircle2, AlertTriangle, FileText, BookOpen, Layers,
  ShieldCheck, RefreshCw, Sliders, Terminal, Download, ArrowRight, Zap
} from 'lucide-react'

const GO_LIVE_CHECKLIST = [
  { item: 'Multi-Tenant Database Schema Partitioning Validated', status: 'PASSED', category: 'DATA_ISOLATION' },
  { item: 'SAML 2.0 Azure AD SSO Identity Provider Handshake', status: 'PASSED', category: 'SECURITY' },
  { item: 'Mandatory Hardware/Authenticator MFA Enforced for Admins', status: 'PASSED', category: 'SECURITY' },
  { item: 'KRA iTax & Statutory Payroll Formats Verified for 2026 Gazettes', status: 'PASSED', category: 'COMPLIANCE' },
  { item: 'Safaricom M-PESA B2C API Gateway Live Webhook Registered', status: 'PASSED', category: 'INTEGRATIONS' },
  { item: 'Automated 24/7 DB Snapshot & Point-in-Time Disaster Recovery Tested', status: 'PASSED', category: 'INFRASTRUCTURE' }
]

export default function AiAdminAssistantAndToolkit() {
  const [activeSubTab, setActiveSubTab] = useState('ASSISTANT') // 'ASSISTANT' or 'TOOLKIT'
  const [isScanning, setIsScanning] = useState(false)

  const handleRunScan = () => {
    setIsScanning(true)
    setTimeout(() => setIsScanning(false), 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Sparkles size={13} className="text-blue-400" /> AI Control Plane Intelligence & Implementation Toolkit
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-blue-400" /> AI Platform Assistant & Documentation Studio
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Proactive misconfiguration scanning, security recommendations, license optimization advisors, go-live readiness validation checklists, and auto-generated admin manuals.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 shrink-0">
            <button
              onClick={() => setActiveSubTab('ASSISTANT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'ASSISTANT' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              AI Advisory Studio
            </button>
            <button
              onClick={() => setActiveSubTab('TOOLKIT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                activeSubTab === 'TOOLKIT' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Go-Live Toolkit & Docs
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: AI ASSISTANT */}
      {activeSubTab === 'ASSISTANT' && (
        <div className="space-y-4">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-500" /> Automated Platform Configuration & Security Auditor
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Scans 140+ tenant schemas, permission trees, and API key policies for vulnerabilities.</p>
              </div>

              <button
                onClick={handleRunScan}
                className="px-4 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-2 shadow-md shrink-0"
              >
                <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
                {isScanning ? 'Auditing Schema...' : 'Run Platform Health Audit'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={15} /> Security Policy Advisory
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  3 newly invited HR Payroll Admins at Mombasa Logistics Hub do not have Authenticator MFA bound. Enforce before next session window.
                </p>
                <button className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold cursor-pointer">
                  Auto-Enforce MFA Policy →
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                  <Sparkles size={15} /> License Quota Optimization
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Kisumu Branch has 18 unused seats under "Benchmarking Module". Re-assigning to Mombasa Logistics will prevent new license costs.
                </p>
                <button className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold cursor-pointer">
                  Apply License Optimization →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GO-LIVE TOOLKIT */}
      {activeSubTab === 'TOOLKIT' && (
        <div className="space-y-4">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ShieldCheck size={16} className="text-emerald-500" /> Go-Live Readiness & Operational Governance Checklist
            </h3>

            <div className="space-y-3">
              {GO_LIVE_CHECKLIST.map((chk, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">{chk.item}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                    {chk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
