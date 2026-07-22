import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Clock, Calendar, DollarSign, BarChart3, Shield, UserSearch, Receipt,
  GraduationCap, Award, Package, MessageSquare, Building2, Zap, Globe, Star,
  Play, ArrowRight, ChevronRight, CheckCircle, Mail, Plug, Smartphone,
  Fingerprint, Twitter, Linkedin, Github, Sparkles, BrainCircuit, Lock,
  Server, Cloud, Workflow, PieChart, TrendingUp, Bell, FileText, Search,
  Menu, X, Plus, Minus, Send, Loader2, Cpu, Bot, Wand2, LineChart,
  Database, KeyRound, FileCheck, HardDrive, Network, ShieldCheck,
} from 'lucide-react'

import {
  useLanding, useHero, useFeatures, useStatistics, usePricing,
  useTestimonials, useFaq, useCTA, useSettings, useNavigation,
  useFooter, useIntegrations, useSEO,
} from '../hooks/useWebsite'
import { websiteService } from '../services/website'
import { formatCurrency, initials } from '../lib/format'

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
/*  Static content for AI & Security showcase sections                        */
/*  (These are product capabilities, not CMS-managed editorial content.)       */
/* -------------------------------------------------------------------------- */

const AI_CAPABILITIES = [
  { icon: 'Bot', title: 'AI Copilot', description: 'Conversational assistant that drafts policies, answers HR queries, and guides managers through complex decisions in natural language.' },
  { icon: 'TrendingUp', title: 'Predictive Insights', description: 'Forecast attrition risk, absenteeism trends, and headcount needs with ML models trained on your workforce data.' },
  { icon: 'Workflow', title: 'Smart Automation', description: 'Auto-route approvals, trigger reminders, and resolve routine requests without lifting a finger.' },
  { icon: 'Wand2', title: 'Natural Language', description: 'Ask “Who took the most sick days this quarter?” in plain English and get instant, accurate answers.' },
  { icon: 'PieChart', title: 'Advanced Analytics', description: 'Dynamic dashboards that surface anomalies, benchmark performance, and explain the “why” behind every metric.' },
  { icon: 'BrainCircuit', title: 'Actionable Insights', description: 'Proactive recommendations that tell you what to do next — not just what happened.' },
]

const AI_CHAT_PREVIEW = [
  { role: 'user', text: 'Which departments are over budget on overtime this month?' },
  { role: 'ai', text: 'Operations (+18%) and Logistics (+12%) are over budget. The main driver is weekend shifts at the Mombasa depot. Want me to draft a policy tweak?' },
  { role: 'user', text: 'Yes, and flag anyone at risk of burnout.' },
  { role: 'ai', text: 'Done — 3 employees flagged. Policy draft saved in your inbox for review.' },
]

const SECURITY_FEATURES = [
  { icon: 'Lock', title: 'End-to-End Encryption', description: 'AES-256 at rest and TLS 1.3 in transit. Your data is encrypted everywhere it lives.' },
  { icon: 'KeyRound', title: 'Role-Based Access Control', description: 'Granular, hierarchical permissions down to the field level — people only see what they should.' },
  { icon: 'FileCheck', title: 'Audit Logs', description: 'Tamper-evident, immutable logs of every action for full traceability and compliance.' },
  { icon: 'ShieldCheck', title: 'Compliance Ready', description: 'GDPR, PDPA, and local labour-law aligned. Data residency controls for regulated industries.' },
  { icon: 'HardDrive', title: 'Automated Backups', description: 'Continuous, encrypted backups with point-in-time recovery. Your history is never lost.' },
  { icon: 'Network', title: 'Multi-Tenancy Isolation', description: 'Logical tenant isolation with per-tenant encryption keys. Your data never crosses boundaries.' },
]

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/** Detect whether a URL is internal (use <Link>) or external (use <a>). */
function isInternal(url) {
  if (!url) return false
  return url.startsWith('/') && !url.startsWith('//')
}

/** Render a link, choosing <Link> for internal routes and <a> for external URLs. */
function SmartLink({ to, children, className, ...rest }) {
  if (isInternal(to)) {
    return <Link to={to} className={className} {...rest}>{children}</Link>
  }
  return <a href={to} className={className} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
}

/** Group an array of objects by a key. */
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other'
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}

/** Intersection-observer hook for scroll-triggered reveal animations. */
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

function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Nav skeleton */}
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

      {/* Hero skeleton */}
      <div className="pt-32 lg:pt-40 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="skeleton h-8 w-56 mx-auto rounded-full" />
          <div className="space-y-4">
            <div className="skeleton h-14 w-full max-w-2xl mx-auto" />
            <div className="skeleton h-14 w-3/4 mx-auto" />
          </div>
          <div className="skeleton h-6 w-full max-w-xl mx-auto" />
          <div className="flex justify-center gap-4 pt-2">
            <div className="skeleton h-12 w-40 rounded-lg" />
            <div className="skeleton h-12 w-40 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Features skeleton */}
      <div className="py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="skeleton h-10 w-72 mx-auto" />
          <div className="skeleton h-5 w-96 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-44 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Error state                                                                */
/* -------------------------------------------------------------------------- */

function LandingError({ onRetry }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 dark:bg-danger-900/30">
          <X className="h-8 w-8 text-danger-600 dark:text-danger-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          We couldn’t load the page
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
/*  Small UI atoms                                                             */
/* -------------------------------------------------------------------------- */

function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div
      data-reveal
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} mb-14 lg:mb-20`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 text-balance">
          {subtitle}
        </p>
      )}
    </div>
  )
}

function StarRating({ rating = 5, size = 16 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-slate-700'}
        />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  1. Announcement Bar                                                        */
/* -------------------------------------------------------------------------- */

function AnnouncementBar({ settings }) {
  if (!settings?.announcementBarActive || !settings?.announcementBarText) return null
  return (
    <div className="relative z-[60] bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3 py-2.5 text-sm">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <p className="font-medium">
            {settings.announcementBarText}
            {settings.announcementBarLink && (
              <SmartLink
                to={settings.announcementBarLink}
                className="ml-2 inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline opacity-90 hover:opacity-100 transition"
              >
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </SmartLink>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  2. Navigation                                                             */
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-accent-500 rounded-xl blur opacity-60 group-hover:opacity-90 transition" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold text-lg shadow-lg">
                {logoText}
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {siteName}
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Desktop auth */}
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

          {/* Mobile toggle */}
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

      {/* Mobile menu */}
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
/*  3. Hero                                                                    */
/* -------------------------------------------------------------------------- */

function Hero({ hero, statistics }) {
  const BadgeIcon = getIcon(hero?.badgeIcon)
  const SecondaryIcon = getIcon(hero?.secondaryCtaIcon)

  return (
    <section className="relative pt-32 lg:pt-44 pb-20 lg:pb-32 overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[36rem] h-[36rem] bg-brand-500/20 dark:bg-brand-500/15 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-20 right-1/4 w-[30rem] h-[30rem] bg-accent-500/20 dark:bg-accent-500/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-slate-950" />
        {/* grid overlay */}
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
          {/* Badge */}
          {hero?.badgeText && (
            <div
              data-reveal
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur border border-gray-200 dark:border-slate-700/60 shadow-sm mb-8 animate-fade-in-down"
            >
              <BadgeIcon className="h-4 w-4 text-brand-500 dark:text-brand-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                {hero.badgeText}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1
            data-reveal
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight text-balance animate-fade-in-up"
          >
            {hero?.headline}
            {hero?.headlineHighlight && (
              <span className="block mt-2 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-600 bg-clip-text text-transparent">
                {hero.headlineHighlight}
              </span>
            )}
          </h1>

          {/* Subheadline */}
          {hero?.subheadline && (
            <p
              data-reveal
              className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-balance animate-fade-in-up"
              style={{ animationDelay: '0.05s' }}
            >
              {hero.subheadline}
            </p>
          )}

          {/* CTAs */}
          <div
            data-reveal
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            {hero?.primaryCtaLabel && (
              <SmartLink to={hero.primaryCtaUrl} className="btn-primary btn-lg group">
                {hero.primaryCtaLabel}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </SmartLink>
            )}
            {hero?.secondaryCtaLabel && (
              <SmartLink to={hero.secondaryCtaUrl} className="btn-secondary btn-lg group">
                <SecondaryIcon className="h-5 w-5 text-brand-500 dark:text-brand-400" />
                {hero.secondaryCtaLabel}
              </SmartLink>
            )}
          </div>

          {/* Statistics grid */}
          {statistics.length > 0 && (
            <div
              data-reveal
              className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {statistics.map((stat) => {
                const Icon = getIcon(stat.icon)
                return (
                  <div
                    key={stat.id}
                    className="group relative p-5 rounded-2xl bg-white/60 dark:bg-slate-900/50 backdrop-blur border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-lg transition-all"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-accent-500/0 group-hover:from-brand-500/5 group-hover:to-accent-500/5 transition-all" />
                    <Icon className="relative h-5 w-5 text-brand-500 dark:text-brand-400 mb-3" />
                    <p className="relative text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="relative text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Floating glassmorphism cards */}
          <div className="hidden lg:block">
            <div
              data-reveal
              className="absolute left-4 top-1/3 w-56 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-2xl rotate-[-6deg] animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/20">
                  <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">Payroll run</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">KSh 4.2M</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">+12% vs last month</p>
            </div>
            <div
              data-reveal
              className="absolute right-4 top-1/2 w-56 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-2xl rotate-[5deg] animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/20">
                  <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">Active staff</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,284</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">across 12 sites</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  4. Features                                                                */
/* -------------------------------------------------------------------------- */

function Features({ features }) {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to manage your workforce"
          subtitle="Powerful, modular tools that work together — so your team can focus on people, not paperwork."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = getIcon(feature.icon)
            return (
              <div
                key={feature.id}
                data-reveal
                className="group relative p-6 lg:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* gradient glow on hover */}
                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${feature.colorGradient || 'from-brand-500 to-accent-500'} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}
                />
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.colorGradient || 'from-brand-500 to-accent-500'} text-white shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
                {feature.category && (
                  <span className="mt-4 inline-flex items-center text-xs font-medium text-brand-600 dark:text-brand-400">
                    {feature.category}
                  </span>
                )}
                <div className="mt-4 flex items-center gap-1 text-brand-600 dark:text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  5. AI Section                                                              */
/* -------------------------------------------------------------------------- */

function AISection() {
  return (
    <section id="ai" className="relative py-20 lg:py-32 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Artificial Intelligence"
          title="Your AI-powered HR copilot"
          subtitle="From predictive analytics to natural-language queries, AI is woven into every workflow — so insights find you."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: capabilities */}
          <div className="grid sm:grid-cols-2 gap-5">
            {AI_CAPABILITIES.map((cap, i) => {
              const Icon = getIcon(cap.icon)
              return (
                <div
                  key={cap.title}
                  data-reveal
                  className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-lg transition-all animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-brand-500 text-white shadow-md mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right: AI chat preview */}
          <div data-reveal className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/20 to-brand-500/20 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-2xl overflow-hidden">
              {/* header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-brand-500 text-white">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">StaffRoom AI</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
                  </p>
                </div>
                <div className="ml-auto flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-700" />
                  <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-700" />
                  <span className="h-3 w-3 rounded-full bg-gray-300 dark:bg-slate-700" />
                </div>
              </div>
              {/* messages */}
              <div className="p-5 space-y-4 min-h-[20rem]">
                {AI_CHAT_PREVIEW.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-600 text-white rounded-br-sm'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <div className="flex items-center gap-1.5 mb-1 text-xs font-medium text-purple-600 dark:text-purple-400">
                          <Sparkles className="h-3 w-3" /> AI
                        </div>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* typing indicator */}
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-slate-800 flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-slate-500 animate-pulse" />
                    <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-slate-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
              {/* input */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-sm text-gray-400 dark:text-slate-500">
                  Ask anything about your workforce…
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  6. Security Section                                                        */
/* -------------------------------------------------------------------------- */

function SecuritySection() {
  return (
    <section id="security" className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Security"
          title="Enterprise-grade security by default"
          subtitle="Your people data is sacred. We protect it with the same standards trusted by banks and governments."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECURITY_FEATURES.map((feat, i) => {
            const Icon = getIcon(feat.icon)
            return (
              <div
                key={feat.title}
                data-reveal
                className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* compliance badges row */}
        <div data-reveal className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-gray-400 dark:text-slate-600">
          {['GDPR', 'SOC 2 Type II', 'ISO 27001', 'PDPA', 'AES-256'].map((badge) => (
            <span key={badge} className="text-sm font-semibold tracking-wide uppercase">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  7. Integrations                                                           */
/* -------------------------------------------------------------------------- */

function Integrations({ integrations }) {
  if (!integrations || integrations.length === 0) return null
  return (
    <section id="integrations" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Integrations"
          title="Connects with the tools you already use"
          subtitle="Slack, accounting software, biometric devices, and more — StaffRoom fits right into your stack."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item, i) => {
            const Icon = getIcon(item.icon)
            return (
              <div
                key={item.id}
                data-reveal
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    {item.category && (
                      <span className="badge badge-gray">{item.category}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  8. Testimonials                                                            */
/* -------------------------------------------------------------------------- */

function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by HR teams everywhere"
          subtitle="See what our customers say about transforming their HR operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              data-reveal
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* quote mark */}
              <div className="absolute top-5 right-5 text-6xl leading-none font-serif text-gray-100 dark:text-slate-800 select-none">
                &ldquo;
              </div>
              <StarRating rating={t.rating} />
              <p className="mt-4 text-gray-700 dark:text-slate-300 leading-relaxed relative z-10">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-slate-800">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold text-sm">
                    {t.avatar || initials(t.name)}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    {t.role}{t.company ? `, ${t.company}` : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  9. Pricing                                                                 */
/* -------------------------------------------------------------------------- */

function Pricing({ plans }) {
  if (!plans || plans.length === 0) return null
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Choose the plan that grows with your business. No hidden fees, cancel anytime."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => {
            const isCustom = String(plan.price).toLowerCase() === 'custom'
            const priceDisplay = isCustom
              ? 'Custom'
              : formatCurrency(plan.price, plan.currency)
            return (
              <div
                key={plan.id}
                data-reveal
                className={`relative flex flex-col p-6 lg:p-8 rounded-2xl transition-all animate-fade-in-up ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 border-2 border-brand-500/50 shadow-2xl lg:scale-105'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:shadow-lg'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-lg">
                      <Award className="h-4 w-4" /> Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {plan.description}
                  </p>
                )}

                <div className="mt-6 mb-6">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {priceDisplay}
                  </span>
                  {!isCustom && plan.period && (
                    <span className="text-gray-500 dark:text-slate-400 ml-1">{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-gray-700 dark:text-slate-300">
                      <CheckCircle className="h-5 w-5 text-brand-500 dark:text-brand-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <SmartLink
                  to={plan.ctaUrl}
                  className={plan.isPopular ? 'btn-primary btn-lg w-full' : 'btn-secondary btn-lg w-full'}
                >
                  {plan.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </SmartLink>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  10. FAQ                                                                    */
/* -------------------------------------------------------------------------- */

function Faq({ faq }) {
  const [openId, setOpenId] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set((faq || []).map(f => f.category).filter(Boolean)))
    return ['All', ...cats]
  }, [faq])

  const filtered = useMemo(() => {
    if (!faq) return []
    const q = query.trim().toLowerCase()
    return faq.filter((item) => {
      const matchesCat = category === 'All' || item.category === category
      const matchesQuery =
        !q ||
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [faq, query, category])

  if (!faq || faq.length === 0) return null

  return (
    <section id="faq" className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about the product and billing."
        />

        {/* Search */}
        <div data-reveal className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="input pl-11"
          />
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div data-reveal className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  category === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 dark:text-slate-400 py-8">
              No questions match your search.
            </p>
          )}
          {filtered.map((item, i) => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                data-reveal
                className={`rounded-2xl border transition-all animate-fade-in-up ${
                  isOpen
                    ? 'bg-white dark:bg-slate-900 border-brand-200 dark:border-brand-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800'
                }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-gray-600 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  11. Final CTA                                                              */
/* -------------------------------------------------------------------------- */

function FinalCTA({ cta }) {
  if (!cta) return null
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.7s' }} />
        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          }}
        />
      </div>

      <div data-reveal className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance">
          {cta.headline}
        </h2>
        {cta.subheadline && (
          <p className="mt-5 text-lg lg:text-xl text-white/80 max-w-2xl mx-auto text-balance">
            {cta.subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {cta.primaryCtaLabel && (
            <SmartLink
              to={cta.primaryCtaUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all group"
            >
              {cta.primaryCtaLabel}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </SmartLink>
          )}
          {cta.secondaryCtaLabel && (
            <SmartLink
              to={cta.secondaryCtaUrl}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-base font-semibold text-white hover:bg-white/20 transition-all"
            >
              {cta.secondaryCtaLabel}
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  12. Newsletter                                                             */
/* -------------------------------------------------------------------------- */

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      await websiteService.subscribeNewsletter(email)
      setStatus('success')
      setMessage('Thanks! Check your inbox to confirm your subscription.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }, [email, status])

  return (
    <section className="py-16 lg:py-20 border-t border-gray-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-reveal className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-5">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Stay in the loop
        </h2>
        <p className="mt-3 text-gray-600 dark:text-slate-400">
          Product updates, HR insights, and best practices — delivered monthly. No spam.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="input flex-1"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary btn-lg whitespace-nowrap disabled:opacity-60"
          >
            {status === 'loading' ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Subscribe
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm font-medium animate-fade-in ${
              status === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger-600 dark:text-danger-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  13. Footer                                                                 */
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
          {/* Brand */}
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
            {/* Social */}
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

          {/* Link groups */}
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
/*  Main page                                                                  */
/* -------------------------------------------------------------------------- */

export default function Landing() {
  const { loading, error, refresh } = useLanding()
  const hero = useHero()
  const features = useFeatures()
  const statistics = useStatistics()
  const pricing = usePricing()
  const testimonials = useTestimonials()
  const faq = useFaq()
  const cta = useCTA()
  const settings = useSettings()
  const { navHeader, navAuth } = useNavigation()
  const { footer, social } = useFooter()
  const integrations = useIntegrations()
  const seo = useSEO()

  useReveal()

  // SEO: set document title + meta description from CMS
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

  if (loading) return <LandingSkeleton />
  if (error) return <LandingError onRetry={refresh} />

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <AnnouncementBar settings={settings} />
      <Navigation settings={settings} navHeader={navHeader} navAuth={navAuth} />

      <main>
        <Hero hero={hero} statistics={statistics} />
        <Features features={features} />
        <AISection />
        <SecuritySection />
        <Integrations integrations={integrations} />
        <Testimonials testimonials={testimonials} />
        <Pricing plans={pricing} />
        <Faq faq={faq} />
        <FinalCTA cta={cta} />
        <Newsletter />
      </main>

      <Footer settings={settings} footer={footer} social={social} />
    </div>
  )
}
