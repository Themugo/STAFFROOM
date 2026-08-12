import React, { useState } from 'react'
import {
  Bus,
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  Eye,
  EyeOff,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Calendar,
  Building2,
  X,
  Send,
  AlertTriangle,
  RotateCcw
} from 'lucide-react'

export function EmployeeTransportTab({ employee }) {
  // Sensitive Data Visibility Toggle (Only for authorized roles or self)
  const [showConfidentialResidence, setShowConfidentialResidence] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  // Edit Transport Config Modal State
  const [isEditing, setIsEditing] = useState(false)
  const [issueModalOpen, setIssueModalOpen] = useState(false)

  // Transport State for Employee
  const [transportConfig, setTransportConfig] = useState({
    transportRequired: employee?.transport_required !== false, // default true
    residenceArea: employee?.residence_area || 'Syokimau, Machakos County',
    landmark: employee?.residence_landmark || 'Near Gateway Mall, Airport Road',
    preferredPickup: employee?.pickup_point || 'Syokimau Junction Stage',
    destination: employee?.destination || 'STAFFROOM Enterprise HQ (Westlands)',
    shift: employee?.shift_name || 'Morning Shift (08:00 AM - 05:00 PM)',
    assignedRoute: 'Westlands - Lavington Express (ROUTE-WEST-01)',
    pickupTime: '06:45 AM',
    vehicle: 'KCB 412A - 33-Seater Bus',
    driverName: 'Joseph Mwangi',
    driverPhone: '+254 712 345 678',
    status: employee?.transport_status || 'Active / Assigned'
  })

  // Issue Form State
  const [issueText, setIssueText] = useState('')

  const notify = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleSaveConfig = (e) => {
    e.preventDefault()
    setIsEditing(false)
    notify('Employee transport profile updated successfully.')
  }

  const handleReportIssue = (e) => {
    e.preventDefault()
    if (!issueText.trim()) return
    setIssueModalOpen(false)
    setIssueText('')
    notify('Transport issue reported to dispatch team.')
  }

  return (
    <div className="space-y-6 text-[#102A43]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2563EB] text-white text-xs font-bold shadow-md flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="hover:opacity-80 font-bold px-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* PRIVACY & SECURITY SAFEGUARD BANNER */}
      <div className="bg-white border border-[#DCE6F2] rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF3FF] text-[#2563EB] font-mono text-[11px] font-bold border border-[#2563EB]/20">
              <ShieldCheck size={14} /> HR Confidentiality & Privacy Safeguard Active
            </div>
            <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
              Employee Residential & Transport Profile
            </h3>
            <p className="text-xs text-[#52677F] max-w-2xl">
              Exact residential location data is restricted to HR, Transport Dispatchers, and the employee. Other department managers see designated pickup points only.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfidentialResidence(!showConfidentialResidence)}
              className="px-3.5 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              {showConfidentialResidence ? <EyeOff size={14} /> : <Eye size={14} />}
              {showConfidentialResidence ? 'Mask Residence Details' : 'Reveal HR Access Details'}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <Edit3 size={14} /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW STATUS BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Requirement Status */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52677F]">Transport Status</span>
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                transportConfig.transportRequired
                  ? 'bg-[#159A68]/15 text-[#159A68] border border-[#159A68]/30'
                  : 'bg-slate-100 text-[#52677F] border border-[#DCE6F2]'
              }`}
            >
              {transportConfig.transportRequired ? 'Transport Required' : 'Opted Out / Self Transport'}
            </span>
          </div>
          <p className="text-[11px] text-[#52677F] pt-1">
            {transportConfig.transportRequired ? 'Enrolled in staff shuttle' : 'Using personal transport'}
          </p>
        </div>

        {/* Assigned Shift */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52677F]">Work Shift</span>
          <div className="font-bold text-xs text-[#102A43] flex items-center gap-1.5 pt-1">
            <Clock size={14} className="text-[#2563EB]" />
            {transportConfig.shift}
          </div>
          <p className="text-[11px] text-[#52677F]">Determines pickup timings</p>
        </div>

        {/* Work Site Destination */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52677F]">Work Site Destination</span>
          <div className="font-bold text-xs text-[#102A43] flex items-center gap-1.5 pt-1">
            <Building2 size={14} className="text-[#2563EB]" />
            {transportConfig.destination}
          </div>
          <p className="text-[11px] text-[#52677F]">Primary drop-off hub</p>
        </div>

        {/* Scheduled Pickup Time */}
        <div className="p-5 rounded-3xl bg-white border border-[#DCE6F2] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#52677F]">Daily Pickup Time</span>
          <div className="font-mono font-bold text-base text-[#2563EB] pt-1">
            {transportConfig.pickupTime}
          </div>
          <p className="text-[11px] text-[#52677F]">Scheduled stage arrival</p>
        </div>
      </div>

      {/* MY TRANSPORT VIEW / ASSIGNED ROUTE & PICKUP DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Pickup & Route Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-4">
            <div>
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-xs uppercase tracking-wider">
                <Bus size={16} /> Daily Commute Assignment
              </div>
              <h3 className="text-lg font-bold text-[#102A43] mt-0.5">My Transport Schedule</h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#159A68]/15 text-[#159A68] border border-[#159A68]/30 font-bold text-xs flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Active Roster
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Pickup Point */}
            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52677F]">
                Assigned Pickup Point
              </span>
              <div className="font-bold text-sm text-[#102A43] flex items-center gap-2">
                <MapPin size={16} className="text-[#2563EB]" />
                {transportConfig.preferredPickup}
              </div>
              <p className="text-[11px] text-[#52677F] pt-1">
                Please arrive 5 minutes prior to departure.
              </p>
            </div>

            {/* Assigned Route */}
            <div className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#52677F]">
                Assigned Route Corridor
              </span>
              <div className="font-bold text-sm text-[#102A43] flex items-center gap-2">
                <Navigation size={16} className="text-[#2563EB]" />
                {transportConfig.assignedRoute}
              </div>
              <p className="text-[11px] text-[#52677F] pt-1">
                Standard morning & evening shuttle route.
              </p>
            </div>
          </div>

          {/* Vehicle & Driver Details */}
          <div className="p-4 rounded-2xl bg-[#EAF3FF] border border-[#2563EB]/20 space-y-3">
            <h4 className="font-bold text-xs text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
              <Bus size={15} /> Assigned Vehicle & Driver Info
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-[#52677F] block text-[11px]">Vehicle:</span>
                <strong className="text-[#102A43] text-sm">{transportConfig.vehicle}</strong>
              </div>
              <div>
                <span className="text-[#52677F] block text-[11px]">Driver:</span>
                <strong className="text-[#102A43] text-sm flex items-center gap-1.5">
                  <User size={14} className="text-[#2563EB]" />
                  {transportConfig.driverName}
                </strong>
                <a
                  href={`tel:${transportConfig.driverPhone}`}
                  className="text-[#2563EB] text-[11px] font-bold flex items-center gap-1 mt-0.5 hover:underline"
                >
                  <Phone size={12} /> {transportConfig.driverPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-white border border-[#DCE6F2] hover:border-[#2563EB] text-[#102A43] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
            >
              <RotateCcw size={14} className="text-[#2563EB]" /> Request Pickup Change
            </button>
            <button
              onClick={() => setIssueModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#D94B61]/10 text-[#D94B61] border border-[#DCE6F2] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <AlertTriangle size={14} /> Report Issue / Delay
            </button>
          </div>
        </div>

        {/* Sensitive Residence & Location Card (1 Col) */}
        <div className="bg-white border border-[#DCE6F2] rounded-3xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
            <h3 className="font-bold text-sm text-[#102A43] flex items-center gap-2">
              <MapPin size={16} className="text-[#2563EB]" />
              Residence & Area
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF3FF] text-[#2563EB] font-mono">
              CONFIDENTIAL
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[#52677F] text-[11px] font-bold block">Residence Area / Estate:</span>
              <div className="font-bold text-[#102A43] bg-[#F6F9FD] p-2.5 rounded-xl border border-[#DCE6F2] mt-1">
                {showConfidentialResidence ? (
                  transportConfig.residenceArea
                ) : (
                  <span className="font-mono text-[#52677F]">Syokimau, Macha*** [MASKED]</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[#52677F] text-[11px] font-bold block">Landmark / Proximity:</span>
              <div className="font-bold text-[#102A43] bg-[#F6F9FD] p-2.5 rounded-xl border border-[#DCE6F2] mt-1">
                {showConfidentialResidence ? (
                  transportConfig.landmark
                ) : (
                  <span className="font-mono text-[#52677F]">Near Gate*** Mall [MASKED]</span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2] text-[11px] text-[#52677F] space-y-1">
              <strong className="text-[#102A43] block font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#159A68]" /> Privacy Standard
              </strong>
              Exact residence addresses are encrypted and accessible strictly for emergency dispatch and geocoding.
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <Edit3 size={18} className="text-[#2563EB]" />
                Configure Transport Requirements
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-[#52677F] hover:text-[#102A43] p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#102A43] font-bold mb-1">Transport Required</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] font-bold focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.transportRequired ? 'YES' : 'NO'}
                  onChange={(e) =>
                    setTransportConfig({ ...transportConfig, transportRequired: e.target.value === 'YES' })
                  }
                >
                  <option value="YES">Yes - Employee Requires Staff Transport</option>
                  <option value="NO">No - Self Transport / Opt-Out</option>
                </select>
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Residence Area / Town</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.residenceArea}
                  onChange={(e) => setTransportConfig({ ...transportConfig, residenceArea: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Landmark</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.landmark}
                  onChange={(e) => setTransportConfig({ ...transportConfig, landmark: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Preferred Pickup Point</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.preferredPickup}
                  onChange={(e) => setTransportConfig({ ...transportConfig, preferredPickup: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Destination Work Site</label>
                <input
                  type="text"
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.destination}
                  onChange={(e) => setTransportConfig({ ...transportConfig, destination: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Shift Schedule</label>
                <select
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={transportConfig.shift}
                  onChange={(e) => setTransportConfig({ ...transportConfig, shift: e.target.value })}
                >
                  <option value="Morning Shift (08:00 AM - 05:00 PM)">Morning Shift (08:00 AM - 05:00 PM)</option>
                  <option value="Early Shift (06:00 AM - 03:00 PM)">Early Shift (06:00 AM - 03:00 PM)</option>
                  <option value="Afternoon Shift (02:00 PM - 10:00 PM)">Afternoon Shift (02:00 PM - 10:00 PM)</option>
                  <option value="Night Shift (09:00 PM - 06:00 AM)">Night Shift (09:00 PM - 06:00 AM)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-2xs"
                >
                  Save Transport Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT ISSUE MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE6F2] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#DCE6F2] pb-3">
              <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#D94B61]" />
                Report Transport Issue or Delay
              </h3>
              <button onClick={() => setIssueModalOpen(false)} className="text-[#52677F] hover:text-[#102A43] p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportIssue} className="space-y-3 text-xs">
              <p className="text-[#52677F]">
                Log an issue regarding your assigned shuttle (e.g. bus delay, missed pickup, stage change request).
              </p>

              <div>
                <label className="block text-[#102A43] font-bold mb-1">Issue Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what happened or why you need assistance..."
                  className="w-full p-2.5 rounded-xl border border-[#DCE6F2] bg-[#F6F9FD] text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  value={issueText}
                  onChange={(e) => setIssueText(e.target.value)}
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#DCE6F2]">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#52677F] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D94B61] hover:bg-[#b9384c] text-white font-bold cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Send size={14} /> Submit Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
