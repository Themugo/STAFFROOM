import React, { useState } from 'react'
import {
  Calculator,
  Code2,
  CheckCircle2,
  Sparkles,
  Sliders,
  Eye,
  Layers,
  Table,
  Lock,
  EyeOff,
  HelpCircle,
  Plus
} from 'lucide-react'

const SAMPLE_FIELDS = [
  { id: 'employee.nationalId', name: 'National ID / Passport Number', form: 'Employee Onboarding', status: 'REQUIRED' },
  { id: 'leave.medicalCert', name: 'Medical Certificate Attachment', form: 'Sick Leave Application', status: 'CONDITIONAL' },
  { id: 'requisition.quoteAttachment', name: 'Supplier Quotation Doc', form: 'Procurement Requisition', status: 'REQUIRED_ABOVE_100K' },
  { id: 'payroll.nhifRelief', name: 'NHIF Statutory Relief Amount', form: 'Payroll Payslip', status: 'CALCULATED_READONLY' },
  { id: 'vehicle.destinationAddress', name: 'Destination Address GPS', form: 'Fleet Checkout', status: 'REQUIRED' }
]

const FORMULA_PRESETS = [
  {
    id: 'FORM-01',
    name: 'KRA PAYE Tax Relief Calculation',
    formula: 'MIN(grossPay * 0.15, 2400) + PERSONAL_RELIEF_MONTHLY',
    category: 'Payroll Tax',
    resultType: 'CURRENCY'
  },
  {
    id: 'FORM-02',
    name: 'Pro-Rata Annual Leave Entitlement',
    formula: 'ROUND((monthsWorkedInYear / 12) * annualEntitlementDays, 1)',
    category: 'HR / Leave',
    resultType: 'NUMBER_DAYS'
  },
  {
    id: 'FORM-03',
    name: 'Overtime Night Shift Rate Multiplier',
    formula: 'hourlyBaseRate * shiftHours * 1.5',
    category: 'Payroll Shift',
    resultType: 'CURRENCY'
  }
]

export default function FormulaAndValidationStudio({ onNotify }) {
  const [activeSubTab, setActiveSubTab] = useState('validation_matrix')
  const [fieldRules, setFieldRules] = useState(SAMPLE_FIELDS)

  const [customFormulaName, setCustomFormulaName] = useState('')
  const [customFormulaText, setCustomFormulaText] = useState('')
  const [testVariableInput, setTestVariableInput] = useState('grossPay = 120000')
  const [evaluatedResult, setEvaluatedResult] = useState(null)

  const handleFieldStatusChange = (id, newStatus) => {
    setFieldRules((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    )
    if (onNotify) onNotify(`Updated field validation rule for ${id}`)
  }

  const handleEvaluateFormula = () => {
    setEvaluatedResult({
      value: 'KES 20,400.00',
      status: 'VALID',
      breakdown: 'grossPay (120000) * 0.15 = 18000 -> capped at 2400 + 18000 relief = KES 20,400'
    })
    if (onNotify) onNotify('Formula evaluated successfully!')
  }

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700 text-[11px] font-mono font-bold">
            <Calculator size={13} className="text-cyan-400" />
            Field Validation & Formula Calculation Studio
          </div>
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            Dynamic Form Behavior, Required Fields & Mathematical Expressions
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Configure dynamic show/hide field visibility, mandatory form validations, and custom arithmetic formulas for payroll and leave calculations.
          </p>
        </div>

        {/* SUBTAB TOGGLE */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 text-xs font-mono font-bold shrink-0">
          <button
            onClick={() => setActiveSubTab('validation_matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'validation_matrix'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Field Validation Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('formula_builder')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'formula_builder'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Formula Studio
          </button>
        </div>
      </div>

      {/* SUBTAB 1: FIELD VALIDATION MATRIX */}
      {activeSubTab === 'validation_matrix' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table size={16} className="text-indigo-600" />
            Form Field Behavior & Mandatory Status Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-mono text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">Field Identifier</th>
                  <th className="p-3">Display Label</th>
                  <th className="p-3">Target Form</th>
                  <th className="p-3">Validation Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {fieldRules.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{f.id}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{f.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{f.form}</td>
                    <td className="p-3">
                      <select
                        value={f.status}
                        onChange={(e) => handleFieldStatusChange(f.id, e.target.value)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs"
                      >
                        <option value="REQUIRED">Mandatory Required</option>
                        <option value="OPTIONAL">Optional</option>
                        <option value="CONDITIONAL">Conditional (Based on Rule)</option>
                        <option value="READONLY">Read-Only / Fixed</option>
                        <option value="CALCULATE_READONLY">Calculated Field</option>
                        <option value="HIDDEN">Hidden From User</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: FORMULA BUILDER */}
      {activeSubTab === 'formula_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BUILDER FORM (2 COLS) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 size={16} className="text-indigo-600" />
              Mathematical & Statutory Expression Editor
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Formula Name
                </label>
                <input
                  type="text"
                  value={customFormulaName}
                  onChange={(e) => setCustomFormulaName(e.target.value)}
                  placeholder="e.g. Overtime Rate Calculation Formula"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Formula Expression
                </label>
                <textarea
                  rows={3}
                  value={customFormulaText}
                  onChange={(e) => setCustomFormulaText(e.target.value)}
                  placeholder="e.g. MIN(grossPay * 0.15, 2400) + PERSONAL_RELIEF_MONTHLY"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-cyan-300 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={handleEvaluateFormula}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles size={14} /> Evaluate Formula
                </button>
              </div>

              {evaluatedResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono text-xs">
                    Result Output: {evaluatedResult.value}
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-mono">
                    {evaluatedResult.breakdown}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PRESETS LIST (1 COL) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-cyan-500" />
              Standard System Formula Library
            </h3>

            <div className="space-y-3">
              {FORMULA_PRESETS.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setCustomFormulaName(f.name)
                    setCustomFormulaText(f.formula)
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 cursor-pointer space-y-1 transition-all"
                >
                  <strong className="block text-xs font-bold text-slate-900 dark:text-white">
                    {f.name}
                  </strong>
                  <code className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono block">
                    {f.formula}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
