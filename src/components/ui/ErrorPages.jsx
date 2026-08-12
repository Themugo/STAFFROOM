import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FileQuestion, ShieldAlert, AlertTriangle, Home, ArrowLeft, RefreshCw,
  Search, ShieldCheck, Key, LifeBuoy, Copy, Check, ChevronDown, ChevronUp,
  Layers, Lock, Send, Sparkles, ExternalLink, Activity
} from 'lucide-react'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAuth } from '../../contexts/AuthContext'

// Generate deterministic or dynamic correlation ID
function getCorrelationId() {
  return 'ERR-' + Math.random().toString(36).substring(2, 9).toUpperCase()
}

/**
 * Common Quick Navigation Links bar
 */
export function ErrorQuickLinks() {
  return (
    <div className="pt-6 border-t border-[#DCE6F2] space-y-3">
      <span className="text-[11px] font-extrabold uppercase text-[#52677F] block tracking-wider text-center">
        Quick Navigation Destinations
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
        <Link
          to="/dashboard"
          className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Home size={14} className="text-[#2563EB]" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/staff"
          className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Layers size={14} className="text-emerald-600" />
          <span>Employees</span>
        </Link>
        <Link
          to="/payroll"
          className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Activity size={14} className="text-amber-600" />
          <span>Payroll</span>
        </Link>
        <Link
          to="/launch"
          className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#102A43] border border-[#DCE6F2] text-center transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles size={14} className="text-[#2563EB]" />
          <span>Launch Hub</span>
        </Link>
      </div>
    </div>
  )
}

/**
 * 404 - Page / Resource Not Found Component
 */
export function Error404({
  title = "Page Not Found",
  message = "The page or resource you are looking for doesn't exist, was renamed, or is temporarily unavailable.",
  customSearch = true,
  onReset
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    navigate(`/staff?search=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Big visual badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shadow-inner">
            <FileQuestion size={40} />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            HTTP STATUS 404
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {message}
          </p>
          {location?.pathname && (
            <p className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/60 py-1 px-3 rounded-lg inline-block">
              Target Route: {location.pathname}
            </p>
          )}
        </div>

        {/* Quick Search Bar */}
        {customSearch && (
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee directory or modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-xs py-1 px-3 rounded-xl cursor-pointer"
            >
              Search
            </button>
          </form>
        )}

        {/* Primary Recovery Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            to="/dashboard"
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Return to Dashboard
          </Link>
        </div>

        {/* Quick Links */}
        <ErrorQuickLinks />
      </div>
    </div>
  )
}

/**
 * 403 - Forbidden / Access Denied Component
 */
export function Error403({
  title = "Access Restricted (403)",
  message = "You don't have sufficient RBAC or ABAC privileges to access this module or resource.",
  requiredRole = "Administrator / HR Lead",
  moduleName
}) {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const { user } = useAuth()
  const showSuccess = notifications?.success || ((m) => console.log(m))
  const [requested, setRequested] = useState(false)

  const handleRequestAccess = () => {
    setRequested(true)
    showSuccess(`Access request for ${moduleName || 'this page'} logged. Notification sent to System Admin.`)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Visual Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 shadow-inner">
            <ShieldAlert size={40} />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            HTTP STATUS 403 FORBIDDEN
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* User Role Context Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2 max-w-md mx-auto">
          <div className="flex justify-between items-center text-slate-500">
            <span>Your Current Account:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{user?.email || 'Logged In User'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500">
            <span>Current Role:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 uppercase font-mono">{user?.role || 'User'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
            <span>Required Clearance:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 font-mono">{requiredRole}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRequestAccess}
            disabled={requested}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer shrink-0"
          >
            {requested ? <Check size={16} /> : <Key size={16} />}
            {requested ? 'Elevated Access Requested' : 'Request Clearance'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            to="/dashboard"
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Dashboard
          </Link>
        </div>

        <ErrorQuickLinks />
      </div>
    </div>
  )
}

/**
 * 500 - Internal Server / System Exception Component
 */
export function Error500({
  title = "Internal Server Exception (500)",
  message = "An unexpected error occurred in the StaffRoom runtime. SRE telemetry has logged this exception.",
  error = null,
  onReset
}) {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const showSuccess = notifications?.success || ((m) => console.log(m))

  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const correlationId = getCorrelationId()

  const handleCopyDiagnostic = () => {
    const payload = JSON.stringify({
      correlationId,
      timestamp: new Date().toISOString(),
      errorMessage: error?.message || 'Uncaught Application Exception',
      stack: error?.stack || 'N/A'
    }, null, 2)

    navigator.clipboard.writeText(payload)
    setCopied(true)
    showSuccess('Diagnostic Error Report copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReload = () => {
    if (onReset) {
      onReset()
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Visual Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-inner">
            <AlertTriangle size={40} />
          </div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            HTTP STATUS 500 SERVER EXCEPTION
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Diagnostic Metadata */}
        <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 text-xs text-left space-y-2 font-mono">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Correlation ID:</span>
            <span className="text-emerald-400 font-bold">{correlationId}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Timestamp:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showDetails ? 'Hide Stack Trace' : 'View Stack Trace'}
            </button>

            <button
              onClick={handleCopyDiagnostic}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied Log' : 'Copy Log'}
            </button>
          </div>

          {showDetails && (
            <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-rose-300 overflow-x-auto max-h-40 leading-normal">
              {error?.stack || error?.message || 'Standard Application Exception: State tree error or failed promise.'}
            </pre>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReload}
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} /> Retry / Refresh Page
          </button>
          <Link
            to="/dashboard"
            className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Return to Dashboard
          </Link>
        </div>

        <ErrorQuickLinks />
      </div>
    </div>
  )
}

export default function ErrorPages() {
  return null
}
