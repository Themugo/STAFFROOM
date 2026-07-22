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
  useLanding, useSettings, useNavigation, useFooter, useSEO,
} from '../hooks/useWebsite'
import { websiteService } from '../services/website'
import { formatDate, initials } from '../lib/format'

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
        <div className="max-w-7xl mx-auto px-4 mt-16">
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-9 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
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
          We couldn't load the blog
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          Something went wrong while fetching the latest posts. Please check your
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
            <FileText className="h-4 w-4 text-brand-500 dark:text-brand-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Blog
            </span>
          </div>
          <h1
            data-reveal
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-[1.05] tracking-tight text-balance animate-fade-in-up"
          >
            Insights & resources
          </h1>
          <p
            data-reveal
            className="mt-6 text-lg lg:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-balance animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            HR best practices, product updates, and thought leadership from the StaffRoom team.
          </p>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Blog post card                                                            */
/* -------------------------------------------------------------------------- */

function BlogPostCard({ post, i }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      data-reveal
      className="group flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-xl transition-all overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${i * 0.05}s` }}
    >
      {/* Cover image */}
      {post.coverImageUrl ? (
        <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-brand-500/10 to-accent-500/10 dark:from-brand-500/10 dark:to-accent-500/10 flex items-center justify-center">
          <FileText className="h-12 w-12 text-brand-500/40 dark:text-brand-400/40" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-5">
        {/* Category + reading time */}
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <span className="badge badge-brand">{post.category}</span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Footer: author + date */}
        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {post.authorAvatar ? (
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white text-xs font-semibold flex-shrink-0">
                {initials(post.authorName)}
              </div>
            )}
            <span className="text-sm text-gray-700 dark:text-slate-300 truncate">
              {post.authorName || 'StaffRoom'}
            </span>
          </div>
          {post.publishedAt && (
            <span className="text-xs text-gray-500 dark:text-slate-400 flex-shrink-0">
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  Blog list with category filter                                            */
/* -------------------------------------------------------------------------- */

function BlogList({ posts, loading, error, onRetry }) {
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set((posts || []).map(p => p.category).filter(Boolean)))
    return ['All', ...cats]
  }, [posts])

  const filtered = useMemo(() => {
    if (!posts) return []
    if (category === 'All') return posts
    return posts.filter((p) => p.category === category)
  }, [posts, category])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center px-4 py-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 dark:bg-danger-900/30">
          <X className="h-8 w-8 text-danger-600 dark:text-danger-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Couldn't load posts
        </h3>
        <p className="text-gray-600 dark:text-slate-400 mb-6">
          {error?.message || 'Something went wrong while fetching blog posts.'}
        </p>
        <button onClick={onRetry} className="btn-primary">
          <Loader2 className="h-4 w-4" />
          Try again
        </button>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center px-4 py-16">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800">
          <FileText className="h-8 w-8 text-gray-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No posts yet
        </h3>
        <p className="text-gray-600 dark:text-slate-400">
          Check back soon — we're working on fresh content.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category filter */}
      {categories.length > 1 && (
        <div data-reveal className="flex flex-wrap gap-2 mb-10 justify-center">
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

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-slate-400 py-12">
          No posts in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <BlogPostCard key={post.id || post.slug} post={post} i={i} />
          ))}
        </div>
      )}
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

export default function BlogPage() {
  const { loading: siteLoading, error: siteError, refresh } = useLanding()
  const settings = useSettings()
  const { navHeader, navAuth } = useNavigation()
  const { footer, social } = useFooter()
  const seo = useSEO()

  // Blog posts are fetched separately (not part of the landing bundle)
  const [posts, setPosts] = useState(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState(null)

  const loadPosts = async () => {
    setPostsLoading(true)
    setPostsError(null)
    try {
      const data = await websiteService.getBlogPosts(20)
      setPosts(data)
    } catch (err) {
      setPostsError(err)
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

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

  if (siteLoading) return <PageSkeleton />
  if (siteError) return <PageError onRetry={refresh} />

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation settings={settings} navHeader={navHeader} navAuth={navAuth} />

      <main>
        <PageHero />
        <section className="pb-20 lg:py-24">
          <BlogList
            posts={posts}
            loading={postsLoading}
            error={postsError}
            onRetry={loadPosts}
          />
        </section>
      </main>

      <Footer settings={settings} footer={footer} social={social} />
    </div>
  )
}
