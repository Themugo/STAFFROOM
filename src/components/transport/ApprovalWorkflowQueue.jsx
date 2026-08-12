import React, { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Zap,
  UserCheck,
  FileCheck,
  MessageSquare,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ChevronDown
} from 'lucide-react'

export const MOCK_APPROVAL_QUEUE = [
  {
    id: 'TR-REQ-9012',
    requester: 'Dr. John Kamau',
    department: 'Engineering & IT',
    purpose: 'Project Site Visit',
    destination: 'Mombasa Road Site B',
    priority: 'HIGH',
    date: '2026-08-02',
    time: '09:00 AM - 02:00 PM',
    passengerCount: 4,
    costCentre: 'CC-ENG-402',
    stage: 'Supervisor Review',
    status: 'PENDING_SUPERVISOR',
    estimatedCost: '$85.00',
    needs4x4: true,
    autoApproveEligible: false
  },
  {
    id: 'TR-REQ-9014',
    requester: 'Sarah Jenkins',
    department: 'Finance & Accounting',
    purpose: 'Bank Errands',
    destination: 'KCB Bank HQ (CBD)',
    priority: 'STANDARD',
    date: '2026-08-01',
    time: '11:00 AM - 12:30 PM',
    passengerCount: 1,
    costCentre: 'CC-FIN-201',
    stage: 'Transport Manager Dispatch Review',
    status: 'PENDING_TRANSPORT_MGR',
    estimatedCost: '$24.00',
    needs4x4: false,
    autoApproveEligible: true
  },
  {
    id: 'TR-REQ-9015',
    requester: 'Marcus Vance',
    department: 'Executive Office',
    purpose: 'VIP Transport',
    destination: 'Jomo Kenyatta Intl Airport (JKIA)',
    priority: 'EMERGENCY',
    date: '2026-08-01',
    time: '02:00 PM - 04:30 PM',
    passengerCount: 2,
    costCentre: 'CC-EXEC-101',
    stage: 'Emergency Override Auto-Approved',
    status: 'APPROVED',
    estimatedCost: '$110.00',
    needs4x4: false,
    autoApproveEligible: true
  }
]

export default function ApprovalWorkflowQueue({ onApprove, onReject, onNotify }) {
  const toast = useToast()
  const [queue, setQueue] = useState(MOCK_APPROVAL_QUEUE)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  // Automatic Approval Rules Toggle
  const [autoApprovalRules, setAutoApprovalRules] = useState({
    localTripUnder2Hours: true,
    bankErrandsUnder50: true,
    vipExecutiveOverride: true
  })

  const handleApproveAction = (req, overrideStage = null) => {
    setQueue(prev =>
      prev.map(item =>
        item.id === req.id
          ? {
              ...item,
              status: 'APPROVED',
              stage: overrideStage || 'Fully Approved (Dispatched to Transport Office)'
            }
          : item
      )
    )
    if (onApprove) onApprove(req)
    if (onNotify) onNotify(`Transport Request ${req.id} for ${req.requester} approved!`)
  }

  const handleRejectSubmit = (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason.')
      return
    }

    setQueue(prev =>
      prev.map(item =>
        item.id === selectedRequest.id
          ? {
              ...item,
              status: 'REJECTED',
              stage: `Rejected: ${rejectReason}`
            }
          : item
      )
    )

    if (onReject) onReject(selectedRequest, rejectReason)
    if (onNotify) onNotify(`Transport Request ${selectedRequest.id} rejected. Rejection reason logged.`)

    setIsRejectModalOpen(false)
    setRejectReason('')
    setSelectedRequest(null)
  }

  return (
    <div className="space-y-6">
      {/* Configurable Rules Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={20} className="text-amber-500" />
              Automated Approval Policy & Rule Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure business rules to automatically clear routine transport requests while enforcing strict executive overrides.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              3 Rules Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprovalRules.localTripUnder2Hours}
              onChange={(e) => setAutoApprovalRules({ ...autoApprovalRules, localTripUnder2Hours: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <strong className="text-slate-900 dark:text-white block">Local Trips &lt; 2 Hours</strong>
              <span className="text-[11px] text-slate-500">Auto-approves standard CBD & local shuttle trips.</span>
            </div>
          </label>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprovalRules.bankErrandsUnder50}
              onChange={(e) => setAutoApprovalRules({ ...autoApprovalRules, bankErrandsUnder50: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <strong className="text-slate-900 dark:text-white block">Document & Bank Errands</strong>
              <span className="text-[11px] text-slate-500">Auto-clears routine mail & bank delivery errands.</span>
            </div>
          </label>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoApprovalRules.vipExecutiveOverride}
              onChange={(e) => setAutoApprovalRules({ ...autoApprovalRules, vipExecutiveOverride: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <strong className="text-slate-900 dark:text-white block">VIP & Emergency Override</strong>
              <span className="text-[11px] text-slate-500">Auto-bypasses standard stages for VIP/Emergency.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Approval Queue Data List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-600 dark:text-indigo-400" />
            Pending Transport Requisition Approval Queue ({queue.filter(q => q.status !== 'APPROVED' && q.status !== 'REJECTED').length})
          </h3>

          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              placeholder="Search requester or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {queue
            .filter(q =>
              q.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.id.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-indigo-300"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.id}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      {item.department}
                    </span>
                    <span className="text-slate-400">• Est. Cost: {item.estimatedCost}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-slate-900 dark:text-white">{item.purpose}</strong>
                    <span className="text-slate-400">for</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-300">{item.requester}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" /> {item.date} ({item.time})
                    </span>
                    <span>Destination: <strong className="text-slate-700 dark:text-slate-200">{item.destination}</strong></span>
                    <span>Passengers: <strong className="text-slate-700 dark:text-slate-200">{item.passengerCount}</strong></span>
                  </div>
                </div>

                {/* Status & Approval Actions */}
                <div className="flex flex-col sm:flex-row items-end md:items-center gap-2 shrink-0">
                  {item.status === 'APPROVED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Approved & Dispatched
                    </span>
                  ) : item.status === 'REJECTED' ? (
                    <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold flex items-center gap-1.5">
                      <XCircle size={14} /> Rejected
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(item)
                          setIsRejectModalOpen(true)
                        }}
                        className="btn-secondary px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      <button
                        onClick={() => handleApproveAction(item)}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <CheckCircle2 size={14} /> Approve Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle size={18} className="text-rose-500" />
              Reject Transport Requisition {selectedRequest.id}
            </h3>
            <p className="text-xs text-slate-500">Provide a mandatory justification note to inform the employee and department head.</p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                required
                placeholder="e.g. Budget cap reached / Alternative corporate shuttle bus available at 08:30 AM..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
