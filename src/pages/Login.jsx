import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import SEO from '@/components/common/SEO'
import { SEO_CONFIG } from '@/config/seo.config'
import { Mail, Lock, ArrowRight, Eye, EyeOff, User, Sparkles, KeyRound, Shield, CheckCircle2, Building2 } from 'lucide-react'

export default function Login() {
  const { signIn, signUp, resetPasswordForEmail, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin') // 'signin', 'signup', or 'forgot'
  
  // Sign In fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Sign Up fields
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('Staff Member')
  const [department, setDepartment] = useState('Engineering')
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    let res
    if (mode === 'signin') {
      res = await signIn(email, password)
      if (!res?.error) {
        navigate('/Dashboard')
      }
    } else if (mode === 'signup') {
      res = await signUp({
        email,
        password,
        full_name: fullName,
        role,
        department,
      })
      if (!res?.error) {
        navigate('/Dashboard')
      }
    } else if (mode === 'forgot') {
      res = await resetPasswordForEmail(email)
      if (res?.error) {
        setError(res.error.message)
      } else {
        setSuccessMsg(res.message || 'Password reset link sent to your work email.')
      }
    }

    setLoading(false)
    if (res?.error) {
      setError(res.error.message)
    }
  }

  async function handleSSO(provider) {
    setError('')
    setSuccessMsg('')
    const { error } = await signInWithOAuth(provider)
    if (error) {
      setError(error.message)
    }
  }

  function handleQuickFill(demoEmail) {
    setEmail(demoEmail)
    setPassword('Demo@123')
    setMode('signin')
    setError('')
    setSuccessMsg('')
  }

  return (
    <div className="min-h-screen flex bg-[#F6F9FD] text-[#102A43] font-sans">
      <SEO
        title={SEO_CONFIG.pages.login.title}
        description={SEO_CONFIG.pages.login.description}
        canonical={SEO_CONFIG.pages.login.canonical}
        noindex={true}
      />
      {/* Left Side - Enterprise Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white border-r border-[#DCE6F2]">
        <div className="relative flex flex-col justify-between p-12 w-full z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xl shadow-sm">
              SR
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-[#102A43] block">STAFFROOM</span>
              <span className="text-[10px] text-[#2563EB] font-bold uppercase tracking-widest block -mt-1 font-mono">Enterprise Operating Platform</span>
            </div>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-xs font-bold mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>Production Enterprise Auth & RBAC</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#102A43] tracking-tight leading-tight mb-4">
              The Intelligent Workforce & Operations OS
            </h2>
            <p className="text-[#52677F] text-sm leading-relaxed mb-8">
              Empower your multi-department teams with automated rosters, localized payroll, performance management, and AI copilot intelligence.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '500+', label: 'Enterprise Tenants' },
                { value: '250k+', label: 'Active Staff' },
                { value: '99.99%', label: 'SLA Uptime' },
              ].map(({ value, label }) => (
                <div key={label} className="p-4 rounded-2xl bg-[#F6F9FD] border border-[#DCE6F2]">
                  <p className="text-xl font-black text-[#102A43]">{value}</p>
                  <p className="text-[11px] text-[#52677F] font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-[#52677F] flex items-center gap-4">
            <span>© 2026 StaffRoom Platform</span>
            <span>•</span>
            <span>WCAG 2.2 AA Compliant</span>
            <span>•</span>
            <span>SOC 2 Type II Certified</span>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xl shadow-sm">
                SR
              </div>
              <span className="text-xl font-black text-[#102A43] tracking-tight">STAFFROOM</span>
            </Link>
          </div>

          <div className="bg-white border border-[#DCE6F2] rounded-3xl p-8 shadow-sm">
            {/* Mode Selector Tabs */}
            <div className="flex rounded-2xl bg-[#F6F9FD] p-1 mb-6 border border-[#DCE6F2]">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#52677F] hover:text-[#102A43]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#52677F] hover:text-[#102A43]'
                }`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'forgot'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'text-[#52677F] hover:text-[#102A43]'
                }`}
              >
                Reset
              </button>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-black text-[#102A43] tracking-tight">
                {mode === 'signin' && 'Welcome to StaffRoom'}
                {mode === 'signup' && 'Create Staff Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h1>
              <p className="text-[#52677F] mt-1 text-xs font-medium">
                {mode === 'signin' && 'Enter your work credentials to access your enterprise workspace'}
                {mode === 'signup' && 'Register your profile to join your organization space'}
                {mode === 'forgot' && 'Enter your registered work email to receive password reset instructions'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-[#102A43] mb-1">Full Name</label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7890A8] pointer-events-none"
                    />
                    <input
                      id="fullName"
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] placeholder-[#7890A8] focus:outline-none focus:border-[#2563EB]"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-[#102A43] mb-1">Work Email Address</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7890A8] pointer-events-none"
                  />
                  <input
                    id="email"
                    type="email"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] placeholder-[#7890A8] focus:outline-none focus:border-[#2563EB]"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-xs font-bold text-[#102A43]">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); }}
                        className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7890A8] pointer-events-none"
                    />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] placeholder-[#7890A8] focus:outline-none focus:border-[#2563EB]"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7890A8] hover:text-[#102A43] transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="role" className="block text-xs font-bold text-[#102A43] mb-1">Role</label>
                    <select
                      id="role"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Staff Member">Staff Member</option>
                      <option value="Department Admin">Department Admin</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="department" className="block text-xs font-bold text-[#102A43] mb-1">Department</label>
                    <select
                      id="department"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#DCE6F2] rounded-xl text-xs text-[#102A43] focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="HR">People Operations</option>
                      <option value="Finance">Finance & Payroll</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 font-semibold flex items-center gap-2">
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl py-3 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    {mode === 'signin' && <><span>Sign In to Workspace</span> <ArrowRight size={16} /></>}
                    {mode === 'signup' && <><span>Complete Registration</span> <ArrowRight size={16} /></>}
                    {mode === 'forgot' && <><span>Send Password Reset Email</span> <KeyRound size={16} /></>}
                  </>
                )}
              </button>
            </form>

            {/* SSO Options */}
            {mode === 'signin' && (
              <div className="mt-6 pt-5 border-t border-[#DCE6F2]">
                <p className="text-[10px] font-bold text-[#7890A8] uppercase tracking-wider mb-3 text-center">
                  Or Sign In with Single Sign-On (SSO)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSSO('google')}
                    className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-white border border-[#DCE6F2] text-xs font-bold text-[#102A43] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Google Workspace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSSO('azure')}
                    className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-white border border-[#DCE6F2] text-xs font-bold text-[#102A43] transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Microsoft / Entra ID</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Demo Credentials Selection */}
            <div className="mt-6 pt-5 border-t border-[#DCE6F2]">
              <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider mb-3">
                Pre-configured Verified Demo Profiles
              </p>
              <div className="space-y-2">
                <DemoAccount
                  role="System Owner (Alex Vance)"
                  email="owner@staffroom.demo"
                  onClick={() => handleQuickFill('owner@staffroom.demo')}
                />
                <DemoAccount
                  role="HR Director (Sarah Jenkins)"
                  email="admin@acmecorp.demo"
                  onClick={() => handleQuickFill('admin@acmecorp.demo')}
                  highlight
                />
                <DemoAccount
                  role="HR Manager (Michael Chen)"
                  email="hr.admin@acmecorp.demo"
                  onClick={() => handleQuickFill('hr.admin@acmecorp.demo')}
                />
                <DemoAccount
                  role="Staff Member (Elena Rostova)"
                  email="staff@acmecorp.demo"
                  onClick={() => handleQuickFill('staff@acmecorp.demo')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoAccount({ role, email, onClick, highlight }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
        highlight
          ? 'bg-[#2563EB]/10 border-[#2563EB]/30 hover:border-[#2563EB]'
          : 'bg-[#F6F9FD] border-[#DCE6F2] hover:border-[#2563EB]/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#102A43]">{role}</p>
          <p className="text-[11px] text-[#52677F]">{email}</p>
        </div>
        <span className="text-[10px] bg-white border border-[#DCE6F2] text-[#2563EB] px-2 py-0.5 rounded-full font-bold">Select</span>
      </div>
    </button>
  )
}



