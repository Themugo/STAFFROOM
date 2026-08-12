import { useState } from 'react'
import {
  Kanban,
  FileSpreadsheet,
  CheckCircle2,
  Upload,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Building,
  DollarSign,
  Briefcase,
  FileText
} from 'lucide-react'

const MIGRATION_ENTITY_TEMPLATES = [
  { id: 'emp', name: 'Employee Personnel Records', fields: 24, sampleRows: 1250, icon: Users, desc: 'National ID, KRA PIN, NSSF, SHIF, designation, basic pay' },
  { id: 'dept', name: 'Department & Org Hierarchy', fields: 8, sampleRows: 42, icon: Building, desc: 'Department code, parent unit, head of department, cost center' },
  { id: 'payroll', name: 'Historical Payroll Balances', fields: 18, sampleRows: 3400, icon: DollarSign, desc: 'YTD taxable pay, PAYE paid, pension relief, voluntary deductions' },
  { id: 'assets', name: 'Fleet Vehicles & Asset Registry', fields: 12, sampleRows: 180, icon: Briefcase, desc: 'Reg plate, logbook ID, driver assignment, insurance validity' },
  { id: 'leave', name: 'Opening Leave Entitlement Balances', fields: 6, sampleRows: 1250, icon: FileText, desc: 'Annual leave carried forward, sick leave days, paternity log' }
]

const IMPLEMENTATION_CHECKLIST = [
  { id: 'c-1', stage: '01. Discovery & Blueprint', task: 'Sign-off on Enterprise Solution Blueprint & Data Schemas', done: true },
  { id: 'c-2', stage: '01. Discovery & Blueprint', task: 'Provision Sovereign Tenant Environment & Identity Providers', done: true },
  { id: 'c-3', stage: '02. Data Migration', task: 'Export legacy payroll & employee CSVs into Data Migration Studio', done: true },
  { id: 'c-4', stage: '02. Data Migration', task: 'Execute dry-run validation check for KRA PIN and NSSF formats', done: false },
  { id: 'c-5', stage: '03. Configuration & Rules', task: 'Verify Kenya Statutory Tax Bands (PAYE, SHIF, Housing Levy)', done: true },
  { id: 'c-6', stage: '04. User Acceptance & Go-Live', task: 'Conduct HR & Payroll User Acceptance Testing (UAT)', done: false },
  { id: 'c-7', stage: '04. User Acceptance & Go-Live', task: 'Sign-off on Go-Live Checklist & Initiate 30-Day Hypercare Support', done: false },
]

export default function ImplementationCenterStudio() {
  const [activeSubTab, setActiveSubTab] = useState('checklist')
  const [selectedEntity, setSelectedEntity] = useState('emp')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)

  const [checklist, setChecklist] = useState(IMPLEMENTATION_CHECKLIST)

  const toggleChecklist = (id) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, done: !c.done } : c))
  }

  const handleSimulateUpload = () => {
    setUploadedFile({ name: 'nairobi_county_staff_2026.csv', size: '2.4 MB', rows: 1250 })
    setIsValidating(true)
    setValidationResult(null)

    setTimeout(() => {
      setIsValidating(false)
      setValidationResult({
        totalRows: 1250,
        validRows: 1242,
        errorRows: 8,
        errors: [
          { line: 42, field: 'KRA PIN', issue: 'Invalid format "A01923" (Must be 11 characters starting with A)' },
          { line: 108, field: 'SHIF No', issue: 'Missing required field' },
          { line: 312, field: 'Basic Salary', issue: 'Non-numeric string value "Fifty Thousand"' }
        ]
      })
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card p-6 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 w-fit mb-2">
              <Kanban size={13} className="text-amber-400" /> Enterprise Implementation & Migration Center
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <ClipboardCheck className="text-amber-400" /> Implementation Center & Data Migration Studio
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Track implementation project milestones, import historical employee and payroll data with schema validation, dry-run previews, and 1-click rollback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('checklist')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                activeSubTab === 'checklist' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Project Checklist
            </button>
            <button
              onClick={() => setActiveSubTab('migration')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                activeSubTab === 'migration' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Data Migration Studio
            </button>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      {activeSubTab === 'checklist' && (
        <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-[#102A43]">Enterprise Implementation Readiness Checklist</h2>
              <p className="text-xs text-[#52677F]">Track key milestone deliverables prior to final executive sign-off and go-live.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#2563EB]">
                {Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)}% Complete
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {checklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.done
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-[#F6F9FD] border-[#DCE6F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                    item.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#DCE6F2] bg-white'
                  }`}>
                    {item.done && <CheckCircle2 size={14} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#52677F] block">{item.stage}</span>
                    <h4 className={`text-xs font-bold ${item.done ? 'line-through text-[#52677F]' : 'text-[#102A43]'}`}>
                      {item.task}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'migration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Entity Selector */}
          <div className="card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-3 shadow-2xs">
            <h3 className="text-xs font-black text-[#102A43] uppercase tracking-wider">Select Migration Data Entity</h3>
            <div className="space-y-2">
              {MIGRATION_ENTITY_TEMPLATES.map(ent => {
                const Icon = ent.icon
                const isSelected = selectedEntity === ent.id
                return (
                  <div
                    key={ent.id}
                    onClick={() => setSelectedEntity(ent.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#EAF3FF] border-[#2563EB]/40 text-[#102A43]'
                        : 'bg-[#F6F9FD] border-[#DCE6F2]'
                    }`}
                  >
                    <div className={`p-2 rounded-xl text-white font-bold shrink-0 ${isSelected ? 'bg-[#2563EB]' : 'bg-slate-400'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#102A43]">{ent.name}</h4>
                      <p className="text-[10px] text-[#52677F] mt-0.5">{ent.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Import Dropzone & Validation Panel */}
          <div className="lg:col-span-2 card p-5 bg-white border border-[#DCE6F2] rounded-3xl space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-[#102A43] flex items-center gap-2">
              <FileSpreadsheet className="text-[#2563EB]" /> Data Schema Mapper & Dry-Run Inspector
            </h3>

            {/* Upload Dropzone */}
            <div
              onClick={handleSimulateUpload}
              className="p-6 rounded-3xl border-2 border-dashed border-[#2563EB]/30 hover:border-[#2563EB] bg-[#EAF3FF]/40 text-center cursor-pointer space-y-2 transition-all"
            >
              <Upload size={28} className="mx-auto text-[#2563EB]" />
              <div className="text-xs font-bold text-[#102A43]">
                Drop CSV or Excel File Here, or Click to Select File
              </div>
              <p className="text-[11px] text-[#52677F]">Supports .csv, .xlsx formatted with StaffRoom Standard Schema v3.0</p>
            </div>

            {isValidating && (
              <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 text-[#2563EB] text-xs font-semibold flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                Validating syntax, statutory ID formats, and constraint rules across rows...
              </div>
            )}

            {validationResult && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2]">
                    <span className="text-[10px] text-[#52677F] uppercase font-bold block">Total Inspected</span>
                    <strong className="text-sm font-black text-[#102A43]">{validationResult.totalRows}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <span className="text-[10px] uppercase font-bold block">Valid Rows</span>
                    <strong className="text-sm font-black">{validationResult.validRows}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800">
                    <span className="text-[10px] uppercase font-bold block">Error Rows</span>
                    <strong className="text-sm font-black">{validationResult.errorRows}</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle size={14} /> Dry-Run Schema Errors Found:
                  </h4>
                  <ul className="text-[11px] text-rose-700 space-y-1">
                    {validationResult.errors.map((err, i) => (
                      <li key={i} className="font-mono">
                        Row {err.line} [{err.field}]: {err.issue}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F6F9FD] border border-[#DCE6F2] text-[#52677F] hover:bg-slate-200/60 flex items-center gap-1">
                    <RotateCcw size={13} /> Rollback Dry-Run
                  </button>
                  <button className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1 shadow-2xs">
                    <Play size={13} /> Commit Valid 1,242 Records to Production Database
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}
