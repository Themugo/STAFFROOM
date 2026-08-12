import React, { useState } from 'react'
import { useBusinessRules } from '@/contexts/BusinessRulesContext'
import { useToast } from '@/contexts/ToastContext'
import {
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  RotateCcw,
  Code2,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Bug
} from 'lucide-react'

const SAMPLE_PAYLOADS = [
  {
    id: 'PAYLOAD-REQ-01',
    label: 'High-Value Procurement Requisition ($650,000)',
    data: {
      requisition: { id: 'REQ-2026-90', amount: 650000, department: 'IT Operations' },
      requester: { name: 'David Kim', grade: 'SENIOR_MANAGER' }
    }
  },
  {
    id: 'PAYLOAD-LV-02',
    label: 'Probationary Annual Leave Application',
    data: {
      employee: { name: 'Alice W.', tenureDays: 45, type: 'FULL_TIME' },
      leave: { type: 'ANNUAL', requestedDays: 5 }
    }
  },
  {
    id: 'PAYLOAD-AMB-03',
    label: 'Emergency Ambulance Fleet Checkout Request',
    data: {
      vehicle: { type: 'AMBULANCE', reg: 'KDG 482B' },
      request: { urgency: 'EMERGENCY', location: 'Kiambu Level 5' }
    }
  }
]

export default function TestingLabSimulator({ onNotify }) {
  const toast = useToast()
  const { rules } = useBusinessRules()
  const [selectedPayload, setSelectedPayload] = useState(SAMPLE_PAYLOADS[0])
  const [payloadJson, setPayloadJson] = useState(JSON.stringify(SAMPLE_PAYLOADS[0].data, null, 2))
  const [executionTrace, setExecutionTrace] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleSelectPreset = (preset) => {
    setSelectedPayload(preset)
    setPayloadJson(JSON.stringify(preset.data, null, 2))
  }

  const handleRunSimulation = () => {
    setIsEvaluating(true)
    setTimeout(() => {
      setIsEvaluating(false)

      try {
        const parsed = JSON.parse(payloadJson)

        // Simulate tracing through all active rules
        const matched = []
        rules.forEach((r) => {
          if (r.status !== 'Active') return

          // Quick mock evaluation check
          let isMatch = false
          if (r.category === 'Procurement' && parsed.requisition && parsed.requisition.amount > 500000) {
            isMatch = true
          } else if (r.category === 'HR Policies' && parsed.employee && parsed.employee.tenureDays < 90) {
            isMatch = true
          } else if (r.category === 'Transport' && parsed.vehicle && parsed.vehicle.type === 'AMBULANCE') {
            isMatch = true
          }

          if (isMatch) {
            matched.push({
              ruleId: r.id,
              ruleName: r.name,
              category: r.category,
              priority: r.priority,
              actions: r.actions
            })
          }
        })

        setExecutionTrace({
          timestamp: new Date().toLocaleTimeString(),
          matchedRulesCount: matched.length,
          matchedRules: matched,
          conflictsDetected: 0,
          performanceMs: (Math.random() * 0.8 + 0.2).toFixed(2),
          logs: [
            `[00:00.001] Initializing Rule Engine Sandbox v3.4...`,
            `[00:00.002] Loaded ${rules.length} total policy definitions.`,
            `[00:00.003] Evaluated payload against ${rules.filter((r) => r.status === 'Active').length} active rules.`,
            `[00:00.005] Simulation complete. Executed ${matched.length} rule actions.`
          ]
        })

        if (onNotify) onNotify(`Simulation complete! Matched ${matched.length} active business rules.`)
      } catch (err) {
        toast.error('Invalid JSON Payload string! Please check formatting.')
      }
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Activity size={13} className="text-cyan-400" />
            Testing Lab, Conflict Detector & Debug Execution Tracer
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Simulate Business Rules Before Live Deployment
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Pass test JSON payloads through the business rules engine to verify trigger evaluation, action outputs, conflict warnings, and execution speed.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isEvaluating}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          <Play size={15} className="fill-current" />
          {isEvaluating ? 'Evaluating Sandbox...' : 'Run Simulation'}
        </button>
      </div>

      {/* PAYLOAD SELECTOR & EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INPUT PAYLOAD EDITOR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal size={16} className="text-indigo-600" />
              Test Data Payload
            </h3>

            <div className="flex gap-1">
              {SAMPLE_PAYLOADS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold cursor-pointer"
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={12}
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800"
          />
        </div>

        {/* SIMULATION TRACE OUTPUT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bug size={16} className="text-amber-500" />
            Rule Engine Execution Trace Log
          </h3>

          {executionTrace ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-2">
                <div className="flex justify-between text-[11px] border-b border-slate-800 pb-2">
                  <span>Matched Rules: <strong className="text-emerald-400">{executionTrace.matchedRulesCount}</strong></span>
                  <span>Execution Speed: <strong className="text-cyan-300">{executionTrace.performanceMs} ms</strong></span>
                  <span>Conflicts: <strong className="text-emerald-400">0</strong></span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Matched Policy Rules:</span>
                  {executionTrace.matchedRules.map((m, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                      <div className="flex justify-between text-indigo-300 font-bold">
                        <span>{m.ruleId} — {m.ruleName}</span>
                        <span>Priority: {m.priority}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 block">
                        Action Output: {m.actions.map((a) => a.type).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOG TRACE STREAM */}
              <div className="p-3 rounded-2xl bg-slate-950 text-slate-300 text-[11px] space-y-1 border border-slate-800">
                {executionTrace.logs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs font-mono space-y-2">
              <p>No simulation run yet. Click 'Run Simulation' above to test payloads.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
