import { useState } from 'react'
import {
  Bot,
  Sparkles,
  Send,
  BookOpen,
  FileText,
  Code,
  CheckCircle2,
  Copy,
  Download,
  Zap,
  Layers,
  HelpCircle
} from 'lucide-react'

const PROMPT_TEMPLATES = [
  'Generate complete County Government HR & Fleet Solution Blueprint',
  'Generate Kenya Statutory KRA P10 Payroll Migration Schema & Rules',
  'Generate Admin Implementation Guide for Healthcare Doctor Roster Pack',
  'Generate API Documentation for External ERP Worker Synchronization'
]

export default function AiSolutionAssistantCenter() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [response, setResponse] = useState(null)

  const handleGenerate = (queryToUse) => {
    const activeQuery = queryToUse || prompt
    if (!activeQuery.trim()) return

    setPrompt(activeQuery)
    setIsGenerating(true)
    setResponse(null)

    setTimeout(() => {
      setIsGenerating(false)
      setResponse({
        title: `AI Architecture Output for: "${activeQuery}"`,
        summary: 'Generated enterprise solution pack specification, database schema mappings, statutory business rules, and step-by-step rollout documentation.',
        blueprint: {
          solutionName: 'County Government Sovereign HR & Transport Pack v1.0',
          modules: ['Personnel Registry', 'County Payroll (KRA/SHIF/Housing Levy)', 'Fleet Dispatch Telemetry', 'Officer Duty Roster'],
          workflows: ['Multi-Tier Officer Leave Escalation', 'Fuel Card Purchase Requisition', 'Emergency Fleet Dispatch'],
          rules: ['Kenya Statutory PAYE Tax Bands 2026', 'SHIF 2.75% Gross Calculation', 'Pro-Rata Annual Leave Accrual'],
          migrationSchema: `// Auto-generated CSV Data Mapper
{
  "entity": "EmployeeMaster",
  "fields": [
    {"source": "STAFF_NO", "target": "employeeCode", "required": true},
    {"source": "ID_NUMBER", "target": "nationalId", "required": true, "validation": "KENYA_NATIONAL_ID"},
    {"source": "KRA_PIN", "target": "kraPin", "required": true, "validation": "KRA_PIN_FORMAT"},
    {"source": "BASIC_PAY", "target": "basicSalary", "required": true, "type": "CURRENCY"}
  ]
}`
        }
      })
    }, 1300)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Bot size={13} className="text-indigo-400" /> AI Platform Solution & Documentation Assistant
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Sparkles className="text-indigo-400" /> AI Solution Architect & Documentation Generator
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Ask AI to generate industry solution blueprints, custom migration schemas, business rule logic, admin training manuals, and API integration guides.
            </p>
          </div>
        </div>

        {/* Quick Prompt Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 mr-1">Quick Blueprints:</span>
          {PROMPT_TEMPLATES.map((tmpl, i) => (
            <button
              key={i}
              onClick={() => handleGenerate(tmpl)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-indigo-300 hover:bg-slate-700 cursor-pointer border border-slate-700"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-3 shadow-2xs">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the industry solution, statutory rule, or documentation manual to generate..."
            className="w-full px-4 py-3 text-xs rounded-2xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] placeholder-[#52677F] focus:bg-white focus:border-[#2563EB] outline-none"
          />
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={15} /> Generate Solution
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Blueprint Result */}
      {response && (
        <div className="card p-6 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#102A43] flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" /> {response.title}
            </h3>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#EAF3FF] text-[#2563EB] border border-[#2563EB]/20">
              Generated in 1.2s
            </span>
          </div>

          <p className="text-xs text-[#52677F]">{response.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-2">
              <h4 className="text-xs font-bold text-[#2563EB]">Included Modules</h4>
              <ul className="text-[11px] text-[#102A43] space-y-1">
                {response.blueprint.modules.map((m, i) => <li key={i}>• {m}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-2">
              <h4 className="text-xs font-bold text-[#2563EB]">Workflows & Escalations</h4>
              <ul className="text-[11px] text-[#102A43] space-y-1">
                {response.blueprint.workflows.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-2">
              <h4 className="text-xs font-bold text-[#2563EB]">Statutory Business Rules</h4>
              <ul className="text-[11px] text-[#102A43] space-y-1">
                {response.blueprint.rules.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          </div>

          {/* Generated Code Schema */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#102A43] flex items-center gap-1.5">
              <Code size={14} className="text-[#2563EB]" /> Generated Data Migration JSON Schema:
            </h4>
            <pre className="p-4 rounded-2xl bg-[#102A43] text-[#38BDF8] text-[11px] font-mono overflow-x-auto">
              {response.blueprint.migrationSchema}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
