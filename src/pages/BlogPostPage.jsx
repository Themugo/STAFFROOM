import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Users, Clock, Calendar, DollarSign, BarChart3, Shield, UserSearch, Receipt,
  GraduationCap, Award, Package, MessageSquare, Building2, Zap, Globe, Star,
  Play, ArrowRight, ChevronRight, CheckCircle, Mail, Plug, Smartphone,
  Fingerprint, Twitter, Linkedin, Github, Sparkles, BrainCircuit, Lock,
  Server, Cloud, Workflow, PieChart, TrendingUp, Bell, FileText, Search,
  Menu, X, Plus, Minus, Send, Loader2, Cpu, Bot, Wand2, LineChart,
  Database, KeyRound, FileCheck, HardDrive, Network, ShieldCheck,
  ArrowLeft,
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
      <div className="pt-32 lg:pt-40 pb-24 max-w-3xl mx-auto px-4">
        <div className="skeleton h-5 w-24 mb-6" />
        <div className="skeleton h-12 w-full mb-4" />
        <div className="skeleton h-12 w-3/4 mb-8" />
        <div className="flex items-center gap-3 mb-10">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-24" />
          </div>
        </div>
        <div className="skeleton h-64 w-full rounded-2xl mb-10" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-4 w-full" />
          ))}
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
          We couldn't load this post
        </h2>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          The article you're looking for may have been moved or deleted. Please try again or head back to the blog.
        </p>
        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button onClick={onRetry} className="btn-secondary btn-lg">
              <Loader2 className="h-5 w-5" />
              Try again
            </button>
          )}
          <Link to="/blog" className="btn-primary btn-lg">
            <ArrowLeft className="h-5 w-5" />
            Back to blog
          </Link>
        </div>
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
/*  Article header                                                            */
/* -------------------------------------------------------------------------- */

function ArticleHeader({ post }) {
  return (
    <header className="pt-32 lg:pt-40 pb-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/blog"
          data-reveal
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition mb-8 animate-fade-in"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        {/* Category + reading time */}
        <div data-reveal className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="badge badge-brand">{post.category}</span>
          )}
          <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h1
          data-reveal
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight text-balance animate-fade-in-up"
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            data-reveal
            className="mt-4 text-lg text-gray-600 dark:text-slate-400 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Author + date */}
        <div
          data-reveal
          className="mt-8 flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-slate-800 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {post.authorAvatar ? (
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold text-sm">
              {initials(post.authorName)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {post.authorName || 'StaffRoom'}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {post.publishedAt ? formatDate(post.publishedAt) : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/*  Article cover image                                                       */
/* -------------------------------------------------------------------------- */

function ArticleCover({ post }) {
  if (!post.coverImageUrl) return null
  return (
    <div data-reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 shadow-lg">
        <img
          src={post.coverImageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Article content                                                           */
/* -------------------------------------------------------------------------- */

function ArticleContent({ post }) {
  if (!post.content) return null

  // If content is an array of blocks, render them; otherwise render as HTML/paragraphs
  if (Array.isArray(post.content)) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.map((block, i) => {
            if (typeof block === 'string') {
              return <p key={i} className="mb-5 text-gray-700 dark:text-slate-300 leading-relaxed">{block}</p>
            }
            if (block?.type === 'heading') {
              const Tag = `h${block.level || 2}`
              return <Tag key={i} className="mt-10 mb-4 font-bold text-gray-900 dark:text-white">{block.text}</Tag>
            }
            if (block?.type === 'paragraph') {
              return <p key={i} className="mb-5 text-gray-700 dark:text-slate-300 leading-relaxed">{block.text}</p>
            }
            if (block?.type === 'list') {
              return (
                <ul key={i} className="mb-5 space-y-2 list-disc list-inside text-gray-700 dark:text-slate-300">
                  {(block.items || []).map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )
            }
            if (block?.type === 'quote') {
              return (
                <blockquote key={i} className="my-8 pl-6 border-l-4 border-brand-500 dark:border-brand-400 italic text-gray-700 dark:text-slate-300">
                  {block.text}
                </blockquote>
              )
            }
            if (block?.type === 'image' && block.url) {
              return (
                <figure key={i} className="my-8">
                  <img src={block.url} alt={block.alt || ''} className="w-full rounded-xl" />
                  {block.caption && (
                    <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-slate-400">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              )
            }
            return null
          })}
        </article>
      </div>
    )
  }

  // String content — render as HTML if it looks like HTML, otherwise split into paragraphs
  if (typeof post.content === 'string') {
    const isHtml = /<[a-z][\s\S]*>/i.test(post.content)
    if (isHtml) {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <article
            className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      )
    }
    const paragraphs = post.content.split(/\n\n+/).filter(Boolean)
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-5 text-gray-700 dark:text-slate-300 leading-relaxed">{p}</p>
          ))}
        </article>
      </div>
    )
  }

  return null
}

/* -------------------------------------------------------------------------- */
/*  Article tags                                                              */
/* -------------------------------------------------------------------------- */

function ArticleTags({ post }) {
  if (!post.tags || post.tags.length === 0) return null
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-gray-200 dark:border-slate-800">
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="badge badge-gray">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Back to blog CTA                                                          */
/* -------------------------------------------------------------------------- */

function BackToBlogCta() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Link
          to="/blog"
          data-reveal
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to all posts
        </Link>
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

export default function BlogPostPage() {
  const { slug } = useParams()
  const { loading: siteLoading, error: siteError, refresh } = useLanding()
  const settings = useSettings()
  const { navHeader, navAuth } = useNavigation()
  const { footer, social } = useFooter()
  const seo = useSEO()

  // Single post fetched separately by slug
  const [post, setPost] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(null)

  const loadPost = async () => {
    setPostLoading(true)
    setPostError(null)
    try {
      const data = await websiteService.getBlogPost(slug)
      if (!data) {
        setPostError(new Error('Post not found'))
      } else {
        setPost(data)
      }
    } catch (err) {
      setPostError(err)
    } finally {
      setPostLoading(false)
    }
  }

  useEffect(() => {
    loadPost()
    // Scroll to top on slug change
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useReveal()

  // SEO: use post-specific meta if available, fall back to site SEO
  useEffect(() => {
    if (post?.title) document.title = post.title
    if (post?.excerpt) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', post.excerpt)
    }
  }, [post, seo])

  if (siteLoading || postLoading) return <PageSkeleton />
  if (siteError) return <PageError onRetry={refresh} />
  if (postError || !post) return <PageError onRetry={loadPost} />

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navigation settings={settings} navHeader={navHeader} navAuth={navAuth} />

      <main>
        <ArticleHeader post={post} />
        <ArticleCover post={post} />
        <section className="pb-10">
          <ArticleContent post={post} />
        </section>
        <ArticleTags post={post} />
        <BackToBlogCta />
      </main>

      <Footer settings={settings} footer={footer} social={social} />
    </div>
  )
}
