import { useState } from 'react'
import {
  Webhook, Plus, Trash2, RefreshCw, CheckCircle2, XCircle, Copy,
  Eye, EyeOff, Play, ShieldAlert, Send, Lock, FileCode, Check, Clock
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const WEBHOOK_EVENTS = [
  'employee.created',
  'employee.updated',
  'employee.terminated',
  'leave.requested',
  'leave.approved',
  'leave.rejected',
  'payroll.completed',
  'payslip.released',
  'candidate.hired',
  'interview.scheduled',
  'workflow.completed',
  'policy.published',
  'document.uploaded',
  'custom.event',
]

const INITIAL_WEBHOOKS = [
  {
    id: 'wh_01',
    name: 'Slack Leave & Approval Ping Bot',
    url: 'https://api.slack.com/events/staffroom-leave-webhook',
    secret: 'whsec_89a7f21e0b3c4d5e6f7a8b9c0d1e2f3a',
    events: ['leave.requested', 'leave.approved', 'workflow.completed'],
    status: 'Active',
    created: '2026-02-10',
    lastDelivery: '2 minutes ago',
    successRate: '99.8%',
  },
  {
    id: 'wh_02',
    name: 'Workday ERP Employee Master Reconciler',
    url: 'https://erp.company.com/hooks/staffroom/employee-sync',
    secret: 'whsec_41b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5',
    events: ['employee.created', 'employee.updated', 'employee.terminated'],
    status: 'Active',
    created: '2026-03-01',
    lastDelivery: '1 hour ago',
    successRate: '100%',
  },
  {
    id: 'wh_03',
    name: 'Payroll Direct Bank Disbursal Listener',
    url: 'https://finance.company.com/webhooks/payroll-disbursal',
    secret: 'whsec_99z1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
    events: ['payroll.completed', 'payslip.released'],
    status: 'Active',
    created: '2026-04-12',
    lastDelivery: 'Yesterday',
    successRate: '98.5%',
  }
]

const INITIAL_DELIVERY_LOGS = [
  {
    id: 'del_101',
    time: '19:40:02',
    event: 'leave.approved',
    webhookName: 'Slack Leave & Approval Ping Bot',
    url: 'https://api.slack.com/events/staffroom-leave-webhook',
    httpStatus: 200,
    latency: '64ms',
    status: 'SUCCESS',
    payload: {
      event: 'leave.approved',
      timestamp: '2026-07-31T19:40:02Z',
      data: {
        request_id: 'LV-2026-891',
        employee_id: 'EMP-042',
        employee_name: 'Elena Rostova',
        leave_type: 'Annual Leave',
        days: 5,
        approver: 'Marcus Vance'
      }
    }
  },
  {
    id: 'del_102',
    time: '19:35:10',
    event: 'payroll.completed',
    webhookName: 'Payroll Direct Bank Disbursal Listener',
    url: 'https://finance.company.com/webhooks/payroll-disbursal',
    httpStatus: 200,
    latency: '112ms',
    status: 'SUCCESS',
    payload: {
      event: 'payroll.completed',
      timestamp: '2026-07-31T19:35:10Z',
      data: {
        period: '2026-07',
        total_employees: 148,
        disbursal_amount: 542900.00,
        currency: 'USD'
      }
    }
  },
  {
    id: 'del_103',
    time: '19:20:00',
    event: 'employee.updated',
    webhookName: 'Workday ERP Employee Master Reconciler',
    url: 'https://erp.company.com/hooks/staffroom/employee-sync',
    httpStatus: 504,
    latency: '5000ms',
    status: 'DLQ_FAILED',
    payload: {
      event: 'employee.updated',
      timestamp: '2026-07-31T19:20:00Z',
      data: {
        employee_id: 'EMP-108',
        field_changed: 'department',
        old_value: 'Engineering',
        new_value: 'AI Platform'
      }
    }
  }
]

export default function WebhookPlatform() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const showInfo = notifications?.info || ((m) => console.log(m))

  const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS)
  const [logs, setLogs] = useState(INITIAL_DELIVERY_LOGS)
  const [selectedLog, setSelectedLog] = useState(INITIAL_DELIVERY_LOGS[0])

  // New Webhook Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [selectedEvents, setSelectedEvents] = useState(['employee.created', 'leave.approved'])

  // Secret visibility
  const [revealedSecretId, setRevealedSecretId] = useState(null)

  // Copy Secret
  const handleCopySecret = (sec) => {
    navigator.clipboard.writeText(sec)
    showSuccess('Webhook HMAC Signing Secret copied to clipboard!')
  }

  // Create Webhook
  const handleCreateWebhook = () => {
    if (!name.trim() || !url.trim()) return

    const randomSecret = 'whsec_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const newWh = {
      id: `wh_${Date.now()}`,
      name,
      url,
      secret: randomSecret,
      events: selectedEvents,
      status: 'Active',
      created: new Date().toISOString().split('T')[0],
      lastDelivery: 'Never',
      successRate: '100%',
    }

    setWebhooks([newWh, ...webhooks])
    setName('')
    setUrl('')
    setIsModalOpen(false)
    showSuccess(`Registered webhook endpoint: ${newWh.name}`)
  }

  // Delete Webhook
  const handleDeleteWebhook = (whId) => {
    setWebhooks(webhooks.filter(w => w.id !== whId))
    showInfo('Webhook endpoint deleted.')
  }

  // Replay Webhook from DLQ / Logs
  const handleReplayLog = (logItem) => {
    showInfo(`Replaying payload for [${logItem.event}] to ${logItem.url}...`)
    setTimeout(() => {
      const updatedLogs = logs.map(l => {
        if (l.id === logItem.id) {
          return {
            ...l,
            time: 'Just now (Replayed)',
            httpStatus: 200,
            status: 'SUCCESS'
          }
        }
        return l
      })
      setLogs(updatedLogs)
      if (selectedLog?.id === logItem.id) {
        setSelectedLog({ ...logItem, time: 'Just now (Replayed)', httpStatus: 200, status: 'SUCCESS' })
      }
      showSuccess(`Replay successful! Endpoint returned 200 OK.`)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Webhook className="w-5 h-5 text-indigo-600" />
              Event Webhook Platform & Dead Letter Queue (DLQ)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Stream real-time event notifications with HMAC SHA-256 signatures, delivery inspection, and automated retry mechanisms.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus size={14} /> Add Webhook Subscription
          </button>
        </div>
      </div>

      {/* Grid: Webhook Endpoints (Left) + Payload Inspector & Logs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Endpoints List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Configured Webhook Endpoints ({webhooks.length})
          </span>

          <div className="space-y-4">
            {webhooks.map(wh => (
              <div
                key={wh.id}
                className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {wh.name}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {wh.status}
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 truncate mt-0.5">
                      {wh.url}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setRevealedSecretId(revealedSecretId === wh.id ? null : wh.id)}
                      className="btn-secondary text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {revealedSecretId === wh.id ? <EyeOff size={14} /> : <Eye size={14} />}
                      {revealedSecretId === wh.id ? 'Hide Secret' : 'Signing Secret'}
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(wh.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Secret display */}
                {revealedSecretId === wh.id && (
                  <div className="p-3 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs flex items-center justify-between border border-slate-800">
                    <span className="truncate pr-2">{wh.secret}</span>
                    <button onClick={() => handleCopySecret(wh.secret)} className="btn-primary text-[10px] py-1 cursor-pointer shrink-0">
                      Copy HMAC Secret
                    </button>
                  </div>
                )}

                {/* Event tags & delivery stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {wh.events.map(e => (
                      <span key={e} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                        {e}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 shrink-0">
                    Success Rate: <strong className="text-emerald-600 dark:text-emerald-400">{wh.successRate}</strong> • Last: {wh.lastDelivery}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Logs & Payload Inspector (1 col) */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Webhook Delivery Logs & DLQ
          </span>

          <div className="card p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {logs.map(log => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                    selectedLog?.id === log.id
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">{log.event}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      HTTP {log.httpStatus}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>{log.webhookName}</span>
                    <span>{log.latency}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Payload Inspector */}
            {selectedLog && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileCode size={14} className="text-indigo-600" /> Payload JSON Inspector
                  </h4>
                  {selectedLog.status !== 'SUCCESS' && (
                    <button
                      onClick={() => handleReplayLog(selectedLog)}
                      className="btn-primary text-[10px] py-1 px-2.5 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={12} /> Replay to Endpoint
                    </button>
                  )}
                </div>

                <pre className="p-3 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-[10px] max-h-52 overflow-x-auto border border-slate-800 leading-relaxed">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal: Add Webhook */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Register Webhook Endpoint</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Subscription Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Lambda Payroll Ingestion Hook"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input text-xs w-full bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Target HTTPS URL Endpoint
                </label>
                <input
                  type="url"
                  placeholder="https://api.company.com/webhooks/staffroom"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input text-xs w-full bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="label text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                  Subscribed Domain Events
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  {WEBHOOK_EVENTS.map(ev => (
                    <label key={ev} className="flex items-center gap-1.5 text-[11px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedEvents([...selectedEvents, ev])
                          else setSelectedEvents(selectedEvents.filter(x => x !== ev))
                        }}
                        className="rounded text-indigo-600"
                      />
                      <span className="font-mono text-slate-800 dark:text-slate-200">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs cursor-pointer">
                Cancel
              </button>
              <button onClick={handleCreateWebhook} className="btn-primary text-xs cursor-pointer">
                Register Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
