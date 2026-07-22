import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Clock, Calendar, DollarSign, BarChart3, Shield, UserSearch, Receipt,
  GraduationCap, Award, Package, MessageSquare, Building2, Zap, Globe, Star,
  Play, ArrowRight, ChevronRight, CheckCircle, Mail, Plug, Smartphone,
  Fingerprint, Twitter, Linkedin, Github, Sparkles, BrainCircuit, Lock,
  Server, Cloud, Workflow, PieChart, TrendingUp, Bell, FileText, Search,
  Menu, X, Plus, Minus, Send, Loader2, Cpu, Bot, Wand2, LineChart,
  Database, KeyRound, FileCheck, HardDrive, Network, ShieldCheck,
  Phone, MapPin, User,
} from 'lucide-react'

import {
  useLanding, useSettings, useNavigation, useFooter, useSEO,
} from '../hooks/useWebsite'
import { websiteService } from '../services/website'

/* -------------------------------------------------------------------------- */
/*  Icon mapping — DB stores icon names as strings                            */
/* -------------------------------------------------------------------------- */

const ICON_MAP = {
  Users, Clock, Calendar, DollarSign, BarChart3, Shield, UserSearch, Receipt,
  GraduationCap, Award, Package, MessageSquare, Building2, Zap, Globe, Star,
  Play, Mail, Plug, Smartphone, Fingerprint, Twitter, Linkedin, Github,
  Sparkles, BrainCircuit, Lock, Server, Cloud, Workflow, PieChart, TrendingUp,
  Bell, FileText, Search, ArrowRight, ChevronRight, CheckCircle, Cpu, Bot,
  Wand2, LineChart, Database, KeyRound, FileCheck, HardDrive, Network,
  ShieldCheck,
}

function getIcon(name) {
  return ICON_MAP[name] || Sparkles
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function isInternal(url) {
  if (!url) return false
  return url.startsWith('/') && !url.startsWith('//')
}

function SmartLink({ to, children, className, ...rest }) {
  if (isInternal(to)) {
    return <Link to={to} className={className} {...rest}>{children}</Link>
  }
  return <a href={to} className={className} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
}

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other'
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('reveal-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* -------------------------------------------------------------------------- */
/*  Loading skeleton                                                           */
/* -------------------------------------------------------------------------- */

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="fixed top-0 inset-x-0 z-50 h-16 lg:h-20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton h-10 w-10 rounded-xl" />
            <div className="skeleton h-5 w-28" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-9 w-24 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="pt-32 lg:pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="skeleton h-8 w-40 mx-auto rounded-full" />
          <div className="skeleton h-14 w-full max-w-2xl mx-auto" />
          <div className="skeleton h-6 w-full max-w-xl mx-auto" />
        </div>
        <div className="max-w-3xl mx-auto px-4 mt-16">
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Error state                                                                */
/* -------------------------------------------------------------------------- */

function PageError({ onRetry }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 dark:bg-danger-900/30">
          <X className="h-8 w-8 text-danger-600 dark:text-danger-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          We couldn't load the page
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          Something went wrong while fetching the latest content. Please check your
          connection and try again.
        </p>
        <button onClick={onRetry} className="btn-primary btn-lg">
          <Loader2 className="h-5 w-5" />
          Try again
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Navigation                                                                 */
/* -------------------------------------------------------------------------- */

function Navigation({ settings, navHeader, navAuth }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const logoText = settings?.logoText || 'SR'
  const siteName = settings?.siteName || 'StaffRoom'

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl blur opacity-60 group-hover:opacity-89 transition" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold text-lg shadow-lg">
                {logoText}
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {siteName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navHeader.map((item) => (
              <SmartLink
                key={item.id || item.label}
                to={item.url}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800/60 transition"
              >
                {item.label}
              </SmartLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 ml-4">
            {navAuth.map((item, i) => {
              const isPrimary = i === navAuth.length - 1
              return (
                <SmartLink
                  key={item.id || item.label}
                  to={item.url}
                  className={isPrimary ? 'btn-primary' : 'text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-white transition'}
                >
                  {isPrimary && <ArrowRight className="h-4 w-4" />}
                  {item.label}
                </SmartLink>
              )
            })}
          </div>

          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white dark:bg-slate-950 overflow-y-auto animate-fade-in">
          <div className="px-4 py-6 space-y-1">
            {navHeader.map((item) => (
              <SmartLink
                key={item.id || item.label}
                to={item.url}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                {item.label}
              </SmartLink>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
              {navAuth.map((item, i) => (
                <SmartLink
                  key={item.id || item.label}
                  to={item.url}
                  onClick={() => setMobileOpen(false)}
                  className={i === navAuth.length - 1 ? 'btn-primary btn-lg w-full' : 'btn-secondary btn-lg w-full'}
                >
                  {item.label}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

function PageHero() {
  return (
    <section className="relative pt-32 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-brand-500/20 dark:bg-brand-500/15 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-20 right-1/4 w-[30rem] h-[30rem] bg-accent-500/20 dark:bg-accent-500/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.7s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            color: 'rgb(120 120 140)',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div
            data-reveal
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-gray-200 dark:border-slate-700/60 shadow-sm mb-8 animate-fade-in-down"
          >
            <Mail className="h-4 w-4 text-brand-500 dark:text-brand-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Contact
            </span>
          </div>
          <h1
            data-reveal
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight text-balance animate-fade-in-up"
          >
            Get in touch
          </h1>
          <p
            data-reveal
            className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-balance animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            Have a question, need a demo, or want to talk partnerships? We'd love to hear from you.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Contact form                                                              */
/* -------------------------------------------------------------------------- */

const INITIAL_FORM = {
  name: '',
  email: '',
  company: '',
  phone: '',
  message: '',
}

function validate(values) {
  const errors = {}
  if (!values.name.trim()) {
    errors.name = 'Name is required'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  // Optional fields — only validate if provided
  if (values.phone.trim() && !/^[+]?[\d\s()-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number'
  }

  return errors
}

function ContactForm() {
  const [values, setValues] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // live-clear errors for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldErrors = validate(values)
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fieldErrors = validate(values)
    setErrors(fieldErrors)
    setTouched({ name: true, email: true, company: true, phone: true, message: true })

    if (Object.keys(fieldErrors).length > 0) return

    setStatus('submitting')
    setSubmitError('')
    try {
      await websiteService.submitContact(values)
      setStatus('success')
      setValues(INITIAL_FORM)
      setTouched({})
      setErrors({})
    } catch (err) {
      setStatus('error')
      setSubmitError(err?.message || 'Something went wrong. Please try again.')
    }
  }

  /* Success state */
  if (status === 'success') {
    return (
      <div
        data-reveal
        className="max-w-2xl mx-auto p-8 lg:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl text-center animate-fade-in"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/20">
          <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Message sent!
        </h3>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          Thanks for reaching out. Our team will get back to you within 1–2 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-secondary btn-lg"
        >
          Send another message
        </button>
      </div>
    )
  }

  const fieldClass = (name) =>
    `input ${touched[name] && errors[name] ? 'border-danger-500 dark:border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : ''}`

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-6 lg:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl space-y-5"
      >
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Name <span className="text-danger-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={status === 'submitting'}
            className={fieldClass('name')}
            placeholder="Jane Doe"
          />
          {touched.name && errors.name && (
            <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Email <span className="text-danger-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={status === 'submitting'}
            className={fieldClass('email')}
            placeholder="jane@company.com"
          />
          {touched.email && errors.email && (
            <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{errors.email}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={values.company}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={status === 'submitting'}
            className={fieldClass('company')}
            placeholder="Acme Ltd."
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={status === 'submitting'}
            className={fieldClass('phone')}
            placeholder="+254 712 345 678"
          />
          {touched.phone && errors.phone && (
            <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{errors.phone}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
            Message <span className="text-danger-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={status === 'submitting'}
            className={fieldClass('message') + ' resize-y'}
            placeholder="Tell us how we can help…"
          />
          {touched.message && errors.message && (
            <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">{errors.message}</p>
          )}
        </div>

        {/* Submit error */}
        {status === 'error' && submitError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-500/30">
            <X className="h-5 w-5 text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger-700 dark:text-danger-300">{submitError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary btn-lg w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </button>
      </form>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Contact info cards                                                        */
/* -------------------------------------------------------------------------- */

function ContactInfo() {
  const items = [
    { icon: Mail, label: 'Email', value: 'hello@staffroom.io', href: 'mailto:hello@staffroom.io' },
    { icon: Phone, label: 'Phone', value: '+254 712 345 678', href: 'tel:+254712345678' },
    { icon: MapPin, label: 'Office', value: 'Nairobi, Kenya', href: null },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
      {items.map((item) => {
        const Icon = item.icon
        const content = (
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-lg transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-3">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-1 font-semibold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        )
        return item.href ? (
          <a key={item.label} href={item.href} className="block">{content}</a>
        ) : (
          <div key={item.label}>{content}</div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer({ settings, footer, social }) {
  const logoText = settings?.logoText || 'SR'
  const siteName = settings?.siteName || 'StaffRoom'
  const tagline = settings?.siteTagline || ''
  const grouped = useMemo(() => groupBy(footer || [], 'groupTitle'), [footer])

  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold text-lg shadow-lg">
                {logoText}
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">{siteName}</span>
            </Link>
            {tagline && (
              <p className="text-gray-600 dark:text-slate-400 max-w-sm leading-relaxed">
                {tagline}
              </p>
            )}
            {social.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {social.map((s) => {
                  const Icon = getIcon(s.icon)
                  return (
                    <SmartLink
                      key={s.id || s.platform}
                      to={s.url}
                      aria-label={s.label || s.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 dark:hover:text-white transition-all"
                    >
                      <Icon className="h-4 w-4" />
                    </SmartLink>
                  )
                })}
              </div>
            )}
          </div>

          {Object.entries(grouped).map(([groupTitle, links]) => (
            <div key={groupTitle}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                {groupTitle}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.id || link.label}>
                    <SmartLink
                      to={link.url}
                      className="text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-slate-500">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <SmartLink to="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition">
              Privacy Policy
            </SmartLink>
            <SmartLink to="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition">
              Terms of Service
            </SmartLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main page                                                                 */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  const { loading, error, refresh } = useLanding()
  const settings = useSettings()
  const { navHeader, navAuth } = useNavigation()
  const { footer, social } = useFooter()
  const seo = useSEO()

  useReveal()

  useEffect(() => {
    if (seo?.metaTitle) document.title = seo.metaTitle
    if (seo?.metaDescription) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', seo.metaDescription)
    }
  }, [seo])

  if (loading) return <PageSkeleton />
  if (error) return <PageError onRetry={refresh} />

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation settings={settings} navHeader={navHeader} navAuth={navAuth} />

      <main>
        <PageHero />
        <section className="pb-20 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactInfo />
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer settings={settings} footer={footer} social={social} />
    </div>
  )
}
