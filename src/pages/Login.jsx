import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 dark:from-cyan-500/20 dark:via-blue-600/20 dark:to-purple-600/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl dark:bg-blue-500/10" />

        <div className="relative flex flex-col justify-center items-center px-12 text-center">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-50 dark:opacity-50" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl">
                SR
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">StaffRoom</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Modern HR Management</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-md">
            Streamline your HR operations with powerful tools for attendance, payroll, leave management, and more.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-md">
            {[
              { value: '50+', label: 'Companies' },
              { value: '5,000+', label: 'Employees' },
              { value: '99.9%', label: 'Uptime' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-white/50 border border-gray-200 dark:bg-slate-800/50 dark:border-slate-700"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-50 dark:opacity-50" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xl">
                  SR
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">StaffRoom</span>
            </Link>
            <p className="text-gray-600 dark:text-slate-400">Welcome back! Sign in to continue.</p>
          </div>

          <div className="card p-8 shadow-xl">
            <div className="hidden lg:block mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
              <p className="text-gray-600 dark:text-slate-400 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="label">Email address</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                  <input
                    id="email"
                    type="email"
                    className="input pl-10"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label">Password</label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-10 pr-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm px-4 py-3 dark:bg-danger-900/30 dark:border-danger-800/50 dark:text-danger-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials — only visible in development */}
            {import.meta.env.DEV && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wide mb-4">
                Demo Credentials (Dev Only)
              </p>
              <div className="space-y-3">
                <DemoAccount
                  role="System Owner"
                  email="owner@staffroom.demo"
                  note="Must change password on first login"
                  highlight
                />
                <DemoAccount role="Client Admin" email="admin@acmecorp.demo" />
                <DemoAccount role="Department Admin" email="hr.admin@acmecorp.demo" />
                <DemoAccount role="Staff Member" email="staff@acmecorp.demo" />
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-4 text-center">
                Password for all: <span className="text-gray-700 dark:text-slate-400">Demo@123</span>
              </p>
            </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-500">
            Don't have an account?{' '}
            <Link to="/" className="text-brand-600 hover:text-brand-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-medium">
              Contact sales
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function DemoAccount({ role, email, note, highlight }) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        highlight
          ? 'bg-brand-50 border-brand-200 dark:bg-cyan-500/10 dark:border-cyan-500/30'
          : 'bg-gray-50 border-gray-200 dark:bg-slate-800/50 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-medium ${
              highlight ? 'text-brand-700 dark:text-cyan-400' : 'text-gray-700 dark:text-slate-300'
            }`}
          >
            {role}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-500">{email}</p>
        </div>
        {note && <span className="text-xs text-warning-600 dark:text-amber-400">{note}</span>}
      </div>
    </div>
  )
}
