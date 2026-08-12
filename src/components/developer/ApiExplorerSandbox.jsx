import { useState } from 'react'
import {
  Play, Code, Copy, Check, Terminal, RefreshCw, Layers, Database,
  Sliders, Globe, Server, FileText, Send, Sparkles, BookOpen
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const API_ENDPOINTS = [
  {
    id: 'ep_01',
    method: 'GET',
    path: '/v1/employees',
    summary: 'List All Employees',
    description: 'Retrieve a paginated list of employee profiles with filtering and sorting.',
    queryParams: [
      { key: 'page', value: '1', desc: 'Page number' },
      { key: 'limit', value: '20', desc: 'Items per page' },
      { key: 'department', value: 'Engineering', desc: 'Filter by department' },
    ],
    sampleResponse: {
      status: 'success',
      page: 1,
      total_count: 148,
      data: [
        { id: 'EMP-001', name: 'Elena Rostova', department: 'Engineering', email: 'elena@company.com', status: 'ACTIVE' },
        { id: 'EMP-002', name: 'Marcus Vance', department: 'Executive', email: 'marcus@company.com', status: 'ACTIVE' }
      ]
    }
  },
  {
    id: 'ep_02',
    method: 'POST',
    path: '/v1/leave/requests',
    summary: 'Submit Leave Request',
    description: 'Submit an employee leave application with automatic rule engine evaluation.',
    headers: [
      { key: 'X-Idempotency-Key', value: 'idemp_req_98123712398', desc: 'Prevents duplicate submissions' }
    ],
    sampleBody: {
      employee_id: 'EMP-001',
      leave_type: 'ANNUAL',
      start_date: '2026-08-10',
      end_date: '2026-08-15',
      reason: 'Summer vacation'
    },
    sampleResponse: {
      request_id: 'LV-2026-9921',
      status: 'SUBMITTED_PENDING_APPROVAL',
      workflow_step: 'Line Manager Review',
      approver: 'Direct Manager (Marcus Vance)',
      created_at: '2026-07-31T19:42:00Z'
    }
  },
  {
    id: 'ep_03',
    method: 'POST',
    path: '/v1/payroll/runs',
    summary: 'Trigger Monthly Payroll Disbursal',
    description: 'Initiate bulk salary calculations, tax deductions, and bank dispatches.',
    headers: [
      { key: 'X-Idempotency-Key', value: 'idemp_pay_4412983', desc: 'Critical idempotency guard' }
    ],
    sampleBody: {
      period: '2026-07',
      currency: 'USD',
      auto_approve_bonus: true
    },
    sampleResponse: {
      payroll_run_id: 'PAY-2026-07-MAIN',
      status: 'CALCULATED_AWAITING_CFO_SIGNOFF',
      total_disbursal: 542900.00,
      employee_count: 148
    }
  },
  {
    id: 'ep_04',
    method: 'POST',
    path: '/v1/graphql',
    summary: 'GraphQL Unified Endpoint',
    description: 'Query any entity graph (Employees, Leave, Payroll, OrgChart) in a single request.',
    sampleBody: {
      query: `query FetchWorkforceOverview {\n  employees(limit: 10) {\n    id\n    fullName\n    department {\n      name\n      budget\n    }\n  }\n}`
    },
    sampleResponse: {
      data: {
        employees: [
          { id: 'EMP-001', fullName: 'Elena Rostova', department: { name: 'Engineering', budget: 1200000 } }
        ]
      }
    }
  }
]

export default function ApiExplorerSandbox() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [selectedEndpoint, setSelectedEndpoint] = useState(API_ENDPOINTS[0])
  const [selectedLanguage, setSelectedLanguage] = useState('cURL') // cURL | JS | Python | Go | C#
  const [isExecuting, setIsExecuting] = useState(false)
  const [responseOutput, setResponseOutput] = useState(selectedEndpoint.sampleResponse)
  const [responseHeaders, setResponseHeaders] = useState({
    'HTTP/1.1': '200 OK',
    'Content-Type': 'application/json',
    'X-RateLimit-Limit': '1000',
    'X-RateLimit-Remaining': '994',
    'X-RateLimit-Reset': '1722455000',
    'X-Staffroom-Trace-Id': 'tr_9812371239123'
  })

  // Execute Mock Request
  const handleExecuteRequest = () => {
    setIsExecuting(true)
    setTimeout(() => {
      setIsExecuting(false)
      setResponseOutput(selectedEndpoint.sampleResponse)
      showSuccess(`Executed ${selectedEndpoint.method} ${selectedEndpoint.path} successfully!`)
    }, 600)
  }

  // Generate Snippets
  const getCodeSnippet = () => {
    const path = `https://api.staffroom.io${selectedEndpoint.path}`
    if (selectedLanguage === 'cURL') {
      return `curl -X ${selectedEndpoint.method} "${path}" \\\n  -H "Authorization: Bearer str_live_89a7f21e0b3c4d..." \\\n  -H "Content-Type: application/json"${selectedEndpoint.method !== 'GET' ? ` \\\n  -d '${JSON.stringify(selectedEndpoint.sampleBody || {}, null, 2)}'` : ''}`
    }
    if (selectedLanguage === 'JS') {
      return `import { StaffRoomClient } from '@staffroom/sdk';\n\nconst staffroom = new StaffRoomClient({\n  apiKey: process.env.STAFFROOM_API_KEY\n});\n\nconst response = await staffroom.${selectedEndpoint.method.toLowerCase()}('${selectedEndpoint.path}');\nconsole.log(response);`
    }
    if (selectedLanguage === 'Python') {
      return `from staffroom import StaffRoomClient\n\nclient = StaffRoomClient(api_key="str_live_89a7f...")\nresponse = client.request("${selectedEndpoint.method}", "${selectedEndpoint.path}")\nprint(response.json())`
    }
    return `// Language SDK snippet placeholder`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              OpenAPI 3.0 Interactive Explorer & API Sandbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test REST and GraphQL endpoints in real-time, inspect rate limit headers, and copy auto-generated code snippets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300">
              OpenAPI 3.1 Spec Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Endpoint Selection (Left) + Sandbox Tester (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Endpoints Sidebar (1 col) */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Core REST & GraphQL Endpoints
          </span>

          <div className="space-y-2">
            {API_ENDPOINTS.map(ep => (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep)
                  setResponseOutput(ep.sampleResponse)
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedEndpoint.id === ep.id
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{ep.path}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ep.summary}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Command & Output (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            
            {/* Address Bar */}
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs">
              <span className={`px-2.5 py-1 rounded font-bold text-[11px] ${
                selectedEndpoint.method === 'GET' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {selectedEndpoint.method}
              </span>
              <span className="text-slate-300 flex-1 truncate">https://api.staffroom.io{selectedEndpoint.path}</span>
              <button
                onClick={handleExecuteRequest}
                disabled={isExecuting}
                className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isExecuting ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
                {isExecuting ? 'Sending...' : 'Send Request'}
              </button>
            </div>

            <p className="text-xs text-slate-500">{selectedEndpoint.description}</p>

            {/* Language Code Snippets */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Code Snippet Generator</span>
                <div className="flex gap-1">
                  {['cURL', 'JS', 'Python'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        selectedLanguage === lang ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <pre className="p-3.5 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                {getCodeSnippet()}
              </pre>
            </div>

            {/* Response Output Inspector */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Server size={14} className="text-emerald-500" /> Response Payload & Headers
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">200 OK (54ms)</span>
              </div>

              <pre className="p-3.5 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] max-h-64 overflow-x-auto border border-slate-800 leading-relaxed">
                {JSON.stringify(responseOutput, null, 2)}
              </pre>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
