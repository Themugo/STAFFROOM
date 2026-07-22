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
} from 'lucide-react'

import {
  useLanding, usePricing, useFaq, useCTA, useSettings, useNavigation,
  useFooter, useSEO,
} from '../hooks/useWebsite'
import { websiteService } from '../services/website'
import { formatCurrency } from '../lib/format'

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
        <div className="max-w-6xl mx-auto px-4 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-96 rounded-2xl" />
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
            <Sparkles className="h-4 w-4 text-brand-500 dark:text-brand-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Pricing
            </span>
          </div>
          <h1
            data-reveal
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight text-balance animate-fade-in-up"
          >
            Simple, transparent pricing
          </h1>
          <p
            data-reveal
            className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-balance animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            Choose the plan that grows with your business. No hidden fees, cancel anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                    */
/* -------------------------------------------------------------------------- */

function Pricing({ plans }) {
  if (!plans || plans.length === 0) return null
  return (
    <section id="pricing" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
/*  FAQ (filtered to pricing/billing categories)                              */
/* -------------------------------------------------------------------------- */

function PricingFaq({ faq }) {
  const [openId, setOpenId] = useState(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  // Filter to pricing/billing-related FAQs
  const pricingFaq = useMemo(() => {
    if (!faq) return []
    const pricingCats = ['pricing', 'billing', 'payment', 'plans', 'subscription']
    return faq.filter((item) => {
      const cat = (item.category || '').toLowerCase()
      return pricingCats.some((pc) => cat.includes(pc))
    })
  }, [faq])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(pricingFaq.map(f => f.category).filter(Boolean)))
    return ['All', ...cats]
  }, [pricingFaq])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pricingFaq.filter((item) => {
      const matchesCat = category === 'All' || item.category === category
      const matchesQuery =
        !q ||
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [pricingFaq, query, category])

  if (pricingFaq.length === 0) return null

  return (
    <section id="faq" className="py-20 lg:py-32 bg-gray-50 dark:bg-slate-900/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Pricing & billing questions"
          subtitle="Everything you need to know about plans, payments, and billing."
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
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */

function FinalCTA({ cta }) {
  if (!cta) return null
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '0.7s' }} />
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

export default function PricingPage() {
  const { loading, error, refresh } = useLanding()
  const pricing = usePricing()
  const faq = useFaq()
  const cta = useCTA()
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
        <Pricing plans={pricing} />
        <PricingFaq faq={faq} />
        <FinalCTA cta={cta} />
      </main>

      <Footer settings={settings} footer={footer} social={social} />
    </div>
  )
}
