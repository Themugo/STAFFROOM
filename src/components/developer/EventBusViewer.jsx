import { useState } from 'react'
import {
  Radio, RefreshCw, Play, ShieldAlert, CheckCircle2, Clock, Database,
  FileCode, Layers, Search, Filter, RotateCcw, Zap, Copy
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'

const SAMPLE_EVENTS = [
  {
    id: 'evt_9812301',
    topic: 'domain.employee.created',
    category: 'Domain Event',
    source: 'StaffDirectoryModule',
    timestamp: '2026-07-31T19:41:00Z',
    correlationId: 'corr_998123-abc',
    schemaVersion: '1.2.0',
    status: 'PROCESSED',
    payload: {
      employee_id: 'EMP-2026-001',
      full_name: 'Marcus Vance',
      email: 'm.vance@company.com',
      department: 'Executive Leadership',
      hire_date: '2026-08-01'
    }
  },
  {
    id: 'evt_9812302',
    topic: 'integration.slack.leave_notified',
    category: 'Integration Event',
    source: 'SlackConnectorEngine',
    timestamp: '2026-07-31T19:40:15Z',
    correlationId: 'corr_881234-xyz',
    schemaVersion: '2.0.0',
    status: 'PROCESSED',
    payload: {
      channel_id: 'C08129312',
      message_ts: '1722454815.000100',
      action: 'posted_approval_card'
    }
  },
  {
    id: 'evt_9812303',
    topic: 'async.payroll.ledger_calculate',
    category: 'Async System Event',
    source: 'PayrollCalculationWorker',
    timestamp: '2026-07-31T19:35:00Z',
    correlationId: 'corr_771239-pay',
    schemaVersion: '1.0.0',
    status: 'DLQ_FAILED',
    payload: {
      batch_id: 'BATCH-2026-07-MAIN',
      total_gross: 542900.00,
      error_cause: 'Tax table matrix for EU jurisdiction timeout'
    }
  },
  {
    id: 'evt_9812304',
    topic: 'domain.leave.policy_published',
    category: 'Domain Event',
    source: 'LeavePolicyEngine',
    timestamp: '2026-07-31T19:28:40Z',
    correlationId: 'corr_551203-pol',
    schemaVersion: '1.1.0',
    status: 'PROCESSED',
    payload: {
      policy_id: 'POL-LEAVE-2026-GLOBAL',
      version: 'v4.0',
      effective_date: '2026-08-01'
    }
  }
]

const EVENT_SCHEMAS = {
  'domain.employee.created': {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "EmployeeCreatedEvent",
    "type": "object",
    "required": ["employee_id", "full_name", "email", "department"],
    "properties": {
      "employee_id": { "type": "string" },
      "full_name": { "type": "string" },
      "email": { "type": "string", "format": "email" },
      "department": { "type": "string" }
    }
  },
  'async.payroll.ledger_calculate': {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "PayrollLedgerCalculateEvent",
    "type": "object",
    "required": ["batch_id", "total_gross"],
    "properties": {
      "batch_id": { "type": "string" },
      "total_gross": { "type": "number" }
    }
  }
}

export default function EventBusViewer() {
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const showInfo = notifications?.info || ((m) => console.log(m))

  const [events, setEvents] = useState(SAMPLE_EVENTS)
  const [selectedEvent, setSelectedEvent] = useState(SAMPLE_EVENTS[0])
  const [activeTab, setActiveTab] = useState('stream') // 'stream' | 'schemas'
  const [filterTopic, setFilterTopic] = useState('')

  // Replay event
  const handleReplayEvent = (evt) => {
    showInfo(`Re-publishing event [${evt.topic}] to Kafka/EventBus topic...`)
    setTimeout(() => {
      const updated = events.map(e => {
        if (e.id === evt.id) {
          return { ...e, status: 'PROCESSED', timestamp: new Date().toISOString() }
        }
        return e
      })
      setEvents(updated)
      if (selectedEvent?.id === evt.id) {
        setSelectedEvent({ ...evt, status: 'PROCESSED', timestamp: new Date().toISOString() })
      }
      showSuccess(`Event ${evt.id} replayed successfully!`)
    }, 1000)
  }

  const filteredEvents = events.filter(e =>
    e.topic.toLowerCase().includes(filterTopic.toLowerCase()) ||
    e.source.toLowerCase().includes(filterTopic.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-indigo-600 animate-pulse" />
              Event Bus Architecture & Real-Time Domain Event Stream
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor async event topologies, replay failed dead-letter messages, and manage JSON event schemas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'stream' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Event Stream
            </button>
            <button
              onClick={() => setActiveTab('schemas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'schemas' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Schema Registry
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Event Stream List (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Event Telemetry Stream ({filteredEvents.length})
              </span>
              <input
                type="text"
                placeholder="Filter topic or source..."
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="input text-xs w-56 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-3">
              {filteredEvents.map(evt => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`card p-4 bg-white dark:bg-slate-900 border rounded-2xl cursor-pointer transition-all ${
                    selectedEvent?.id === evt.id
                      ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{evt.topic}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.status === 'PROCESSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {evt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source: <strong className="text-slate-700 dark:text-slate-300">{evt.source}</strong></span>
                    <span>{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Detail & Replay Panel (1 col) */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Event Payload & Correlation Trace
            </span>

            {selectedEvent && (
              <div className="card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono">{selectedEvent.id}</h4>
                    <span className="text-[10px] text-slate-400">Correlation ID: {selectedEvent.correlationId}</span>
                  </div>

                  {selectedEvent.status !== 'PROCESSED' && (
                    <button
                      onClick={() => handleReplayEvent(selectedEvent)}
                      className="btn-primary text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={12} /> Replay Event
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Payload JSON:</span>
                  <pre className="p-3 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-[10px] max-h-64 overflow-x-auto border border-slate-800">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: SCHEMA REGISTRY */}
      {activeTab === 'schemas' && (
        <div className="card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode size={16} className="text-indigo-600" /> Event Schema Registry & Contract Validation
          </h3>

          <div className="space-y-4">
            {Object.entries(EVENT_SCHEMAS).map(([topic, schema]) => (
              <div key={topic} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">{topic}</h4>
                <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[10px] max-h-48 overflow-x-auto border border-slate-800">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
