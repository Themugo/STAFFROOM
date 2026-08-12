import { useState } from 'react'
import {
  Layers, Plus, Trash2, Edit3, Check, Sliders, Database, FileText,
  SlidersHorizontal, CheckCircle2, ShieldCheck, Box, Sparkles
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const INITIAL_EXTENSION_POINTS = [
  { id: 'ext_01', type: 'Dashboard Widget', target: 'Executive Dashboard', name: 'Salesforce Commission Feed', status: 'Active', provider: 'Salesforce Connector' },
  { id: 'ext_02', type: 'Workflow Node', target: 'Workflow Builder Canvas', name: 'Send Twilio SMS Verification', status: 'Active', provider: 'Twilio Gateway' },
  { id: 'ext_03', type: 'Custom Form', target: 'Employee Onboarding', name: 'IT Laptop Asset Provisioning', status: 'Active', provider: 'Jira Service Desk' },
  { id: 'ext_04', type: 'Report Widget', target: 'Workforce Analytics', name: 'SAP S/4HANA Ledger Reconciliation', status: 'Active', provider: 'SAP Extension' },
]

const INITIAL_CUSTOM_FIELDS = [
  { id: 'cf_01', entity: 'Employee Profile', fieldName: 'Emergency Contact Passport No', fieldType: 'Text', required: true, apiExposed: true },
  { id: 'cf_02', entity: 'Leave Application', fieldName: 'Airline Flight Confirmation Ref', fieldType: 'Text', required: false, apiExposed: true },
  { id: 'cf_03', entity: 'Payroll Entry', fieldName: 'Remote Work Differential Bonus', fieldType: 'Currency ($)', required: false, apiExposed: true },
  { id: 'cf_04', entity: 'Recruitment Candidate', fieldName: 'GitHub Portfolio URL', fieldType: 'URL', required: false, apiExposed: true },
]

export default function PluginCustomAppFramework() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const showInfo = notifications?.info || ((m) => console.log(m))

  const [activeTab, setActiveTab] = useState('fields') // 'fields' | 'extensions'
  const [customFields, setCustomFields] = useState(INITIAL_CUSTOM_FIELDS)
  const [extensions, setExtensions] = useState(INITIAL_EXTENSION_POINTS)

  // New Field Modal State
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false)
  const [entity, setEntity] = useState('Employee Profile')
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('Text')
  const [isRequired, setIsRequired] = useState(false)
  const [isApiExposed, setIsApiExposed] = useState(true)

  const handleAddField = () => {
    if (!fieldName.trim()) return

    const newField = {
      id: `cf_${Date.now()}`,
      entity,
      fieldName,
      fieldType,
      required: isRequired,
      apiExposed: isApiExposed,
    }

    setCustomFields([...customFields, newField])
    setFieldName('')
    setIsFieldModalOpen(false)
    showSuccess(`Added custom metadata field [${fieldName}] to ${entity}`)
  }

  const handleDeleteField = (id) => {
    setCustomFields(customFields.filter(f => f.id !== id))
    showInfo('Custom field removed from metadata schema.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Plugin Framework, Custom App Registration & Metadata Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extend StaffRoom core entities with custom attributes, custom workflow nodes, and UI widgets without editing core code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'fields' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Metadata & Custom Fields
            </button>
            <button
              onClick={() => setActiveTab('extensions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'extensions' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              UI Extension Points
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CUSTOM FIELDS & METADATA */}
      {activeTab === 'fields' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Entity Schema Metadata Extensions ({customFields.length})
            </span>
            <button
              onClick={() => setIsFieldModalOpen(true)}
              className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Add Custom Field
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customFields.map(f => (
              <div
                key={f.id}
                className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block">
                    {f.entity}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{f.fieldName}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Type: {f.fieldType}</span>
                    <span>• {f.required ? 'Required' : 'Optional'}</span>
                    <span>• {f.apiExposed ? 'Exposed in REST/GraphQL' : 'Internal Only'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteField(f.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXTENSION POINTS */}
      {activeTab === 'extensions' && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Box size={16} className="text-indigo-600" /> UI Widgets, Workflow Nodes & Menu Extensions
          </h3>

          <div className="space-y-3">
            {extensions.map(ext => (
              <div key={ext.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{ext.name}</h4>
                  <span className="text-[10px] text-slate-400">Target: {ext.target} • Provider: {ext.provider}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {ext.type} ({ext.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Custom Field */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Entity Custom Field</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Target Core Entity
                </label>
                <select value={entity} onChange={(e) => setEntity(e.target.value)} className="input text-xs w-full bg-white dark:bg-slate-900">
                  <option value="Employee Profile">Employee Profile</option>
                  <option value="Leave Application">Leave Application</option>
                  <option value="Payroll Entry">Payroll Entry</option>
                  <option value="Recruitment Candidate">Recruitment Candidate</option>
                  <option value="Department">Department</option>
                </select>
              </div>

              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Field Label Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Work Location Desk Code"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="input text-xs w-full bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Data Format Type
                </label>
                <select value={fieldType} onChange={(e) => setFieldType(e.target.value)} className="input text-xs w-full bg-white dark:bg-slate-900">
                  <option value="Text">Text String</option>
                  <option value="Number">Numeric</option>
                  <option value="Currency ($)">Currency ($)</option>
                  <option value="Date">Date Picker</option>
                  <option value="Dropdown">Dropdown Select</option>
                  <option value="URL">URL / Link</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isRequired} onChange={(e) => setIsRequired(e.target.checked)} className="rounded text-indigo-600" />
                  <span>Required Field</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isApiExposed} onChange={(e) => setIsApiExposed(e.target.checked)} className="rounded text-indigo-600" />
                  <span>Expose via REST/GraphQL API</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsFieldModalOpen(false)} className="btn-secondary text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddField} className="btn-primary text-xs cursor-pointer">
                Save Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
