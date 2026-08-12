import { useState } from 'react'
import {
  GitBranch,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Flag,
  Calendar,
  Layers,
  Sparkles,
  Check
} from 'lucide-react'

const ENVIRONMENTS = [
  { id: 'dev', name: 'Development (Sandbox)', color: 'bg-blue-500', version: 'v3.5.0-dev.4', status: 'Healthy', schema: 'v3.5.0-dev' },
  { id: 'test', name: 'Testing & QA', color: 'bg-purple-500', version: 'v3.4.2-rc1', status: 'Healthy', schema: 'v3.4.2' },
  { id: 'staging', name: 'Staging & Pre-prod', color: 'bg-amber-500', version: 'v3.4.1', status: 'Healthy', schema: 'v3.4.1' },
  { id: 'prod', name: 'Production (Sovereign Cloud)', color: 'bg-emerald-500', version: 'v3.4.0', status: 'Active SLA 99.99%', schema: 'v3.4.0' }
]

const FEATURE_FLAGS = [
  { id: 'ff-mpesa', name: 'M-Pesa Bulk B2C Express API v3', enabled: true, rollout: '100% (Production)' },
  { id: 'ff-ai-cfo', name: 'Autonomous CFO Financial Forecasting', enabled: true, rollout: '50% Canary (Staging & Prod)' },
  { id: 'ff-kra-shif', name: 'Kenya SHIF & Housing Levy 2026 Engine', enabled: true, rollout: '100% (All Envs)' },
  { id: 'ff-live-locum', name: 'Locum Hospital Standby Dispatch', enabled: false, rollout: '0% (Dev Only)' }
]

export default function EnvironmentPromotionManager() {
  const [flags, setFlags] = useState(FEATURE_FLAGS)
  const [isPromoting, setIsPromoting] = useState(false)
  const [promotionSuccess, setPromotionSuccess] = useState(false)

  const toggleFlag = (id) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f))
  }

  const handlePromoteConfig = () => {
    setIsPromoting(true)
    setPromotionSuccess(false)
    setTimeout(() => {
      setIsPromoting(false)
      setPromotionSuccess(true)
    }, 1400)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 w-fit mb-2">
              <GitBranch size={13} className="text-purple-400" /> Multi-Environment Release Pipeline
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <GitBranch className="text-purple-400" /> Environment Pipeline & Feature Flags
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Promote solution configurations across Development, Staging, and Production environments safely with automated schema diff checks and canary feature flag controls.
            </p>
          </div>

          <button
            onClick={handlePromoteConfig}
            disabled={isPromoting}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer flex items-center gap-2 shadow-lg transition-all"
          >
            {isPromoting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Executing Pipeline Promotion...
              </>
            ) : (
              <>
                <ArrowRight size={15} /> Promote Staging to Production
              </>
            )}
          </button>
        </div>
      </div>

      {promotionSuccess && (
        <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 text-[#102A43] text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#2563EB]" />
            <span>Successfully promoted release candidate <strong>v3.4.1</strong> from Staging to Production without breaking changes!</span>
          </div>
        </div>
      )}

      {/* Environment Pipeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ENVIRONMENTS.map(env => (
          <div key={env.id} className="card p-4 bg-white border border-[#DCE6F2] rounded-3xl space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className={`w-3 h-3 rounded-full ${env.color}`} />
              <span className="text-[10px] font-mono font-bold text-[#52677F]">{env.version}</span>
            </div>
            <div>
              <h3 className="text-xs font-black text-[#102A43]">{env.name}</h3>
              <p className="text-[10px] font-semibold text-emerald-600">{env.status}</p>
            </div>
            <div className="pt-2 border-t border-[#DCE6F2] text-[10px] text-[#52677F] flex justify-between">
              <span>Schema:</span>
              <strong className="font-mono text-[#102A43]">{env.schema}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Flags Center */}
      <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
        <h2 className="text-sm font-black text-[#102A43] flex items-center gap-2">
          <Flag size={16} className="text-[#2563EB]" /> Enterprise Feature Flags & Canary Rollout Matrix
        </h2>

        <div className="space-y-2">
          {flags.map(flag => (
            <div
              key={flag.id}
              className="p-3.5 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] flex items-center justify-between gap-4"
            >
              <div>
                <h4 className="text-xs font-bold text-[#102A43]">{flag.name}</h4>
                <p className="text-[10px] text-[#52677F] font-mono">Rollout Target: {flag.rollout}</p>
              </div>

              <button
                onClick={() => toggleFlag(flag.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  flag.enabled
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-[#E2E8F0] text-[#52677F]'
                }`}
              >
                {flag.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
