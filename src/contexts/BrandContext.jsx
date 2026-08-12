import React, { createContext, useContext, useState, useEffect } from 'react'

export const DEFAULT_BRAND_CONFIG = {
  // 1. BRAND & VISUAL IDENTITY
  orgName: 'StaffRoom Enterprise',
  shortName: 'StaffRoom',
  logoUrl: '',
  faviconUrl: '',
  appIcon: 'Building2',
  loginBg: 'gradient-slate',
  dashboardBg: 'default',
  loadingMessage: 'Securing workforce context...',
  splashMessage: 'StaffRoom Operating System v4.8',

  // 2. EMAIL & NOTIFICATION BRANDING
  emailHeaderBg: '#0f172a',
  emailLogoUrl: '',
  emailHeaderTitle: 'StaffRoom Official Communication',
  emailFooterText: '© 2026 StaffRoom Enterprise Inc. All rights reserved.',
  emailPrimaryButtonBg: '#2563eb',
  pdfHeaderTitle: 'StaffRoom Official Document',
  reportWatermark: 'CONFIDENTIAL — INTERNAL USE ONLY',
  systemFooter: '© 2026 StaffRoom Enterprise Inc. All rights reserved.',
  copyrightNotice: 'Protected under Enterprise Multi-Tenant License.',

  notificationToastStyle: 'modern-slate',
  notificationPushTitle: 'StaffRoom Alert System',
  notificationSound: 'chime',
  notificationEmailFooter: 'Sent via StaffRoom Enterprise White Label Notification Gateway.',

  // 3. THEME & COLOR TOKENS
  presetTheme: 'corporate-blue',
  primaryColor: '#2563eb',
  secondaryColor: '#4f46e5',
  accentColor: '#06b6d4',
  successColor: '#10b981',
  warningColor: '#f59e0b',
  dangerColor: '#ef4444',
  infoColor: '#3b82f6',
  neutralColor: '#64748b',
  surfaceBg: '#ffffff',
  textColor: '#0f172a',
  borderRadius: '16px',
  cardShadow: 'shadow-sm',
  glassmorphism: false,
  spacingDensity: 'normal', // compact, normal, relaxed

  // 4. TYPOGRAPHY STUDIO
  fontFamily: 'Inter',
  headingFont: 'Plus Jakarta Sans',
  bodyFont: 'Inter',
  letterSpacing: 'normal',
  lineHeight: 'relaxed',
  buttonStyle: 'rounded-xl',
  inputStyle: 'rounded-xl',

  // 5. CUSTOM TERMINOLOGY DICTIONARY
  terminology: {
    Employee: 'Employee',
    Employees: 'Employees',
    Department: 'Department',
    Departments: 'Departments',
    Manager: 'Manager',
    Managers: 'Managers',
    Leave: 'Leave',
    HR: 'HR & People',
    Branch: 'Branch',
    Branches: 'Branches',
    Company: 'Company',
    Vehicle: 'Vehicle',
    Vehicles: 'Vehicles',
    Project: 'Project',
    Approval: 'Approval',
    Approvals: 'Approvals',
    Payroll: 'Payroll & Compensation',
    Attendance: 'Attendance & Time Logs',
    Shift: 'Shift & Roster',
    Performance: 'Performance & Reviews'
  },

  // 6. LOCALIZATION & FORMATTING
  language: 'en-US',
  rtl: false,
  dateFormat: 'YYYY-MM-DD', // YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, D MMM YYYY
  timeFormat: '12h', // 12h, 24h
  currency: 'USD',
  currencySymbol: '$',
  numberFormat: '1,000.00',

  // 7. NAVIGATION CONFIGURATION (Labels, Visibility, Order)
  navConfig: {
    Dashboard: { label: 'Executive Dashboard', visible: true, order: 1 },
    Staff: { label: 'Staff Directory', visible: true, order: 2 },
    Departments: { label: 'Departments', visible: true, order: 3 },
    Recruitment: { label: 'Recruitment & ATS', visible: true, order: 4 },
    Onboarding: { label: 'Employee Onboarding', visible: true, order: 5 },
    Attendance: { label: 'Attendance Logs', visible: true, order: 6 },
    Leave: { label: 'Leave Planner', visible: true, order: 7 },
    DutyRoster: { label: 'Duty Roster & Shifts', visible: true, order: 8 },
    Payroll: { label: 'Payroll & Compensation', visible: true, order: 9 },
    ExpenseClaims: { label: 'Expense Claims', visible: true, order: 10 },
    AssetManagement: { label: 'Assets & Logistics', visible: true, order: 11 },
    ApprovalCenter: { label: 'Approval Hub', visible: true, order: 12 },
    Performance: { label: 'Performance Management', visible: true, order: 13 },
    Documents: { label: 'Document Vault', visible: true, order: 14 },
    GovernanceRiskCompliance: { label: 'GRC & Audit', visible: true, order: 15 },
    Settings: { label: 'Platform Settings', visible: true, order: 16 }
  },

  // 8. PAGE SECTIONS & CARD EXPERIENCE CONFIGURATION
  cardConfig: {
    kpi_summary: { label: 'Key Workforce Metrics', description: 'Real-time headcount, active shifts, and attendance SLA', visible: true, order: 1, section: 'Executive Highlights' },
    headcount_trend: { label: 'Headcount Growth & Attrition', description: '12-month staffing velocity trajectory', visible: true, order: 2, section: 'Executive Highlights' },
    budget_burn: { label: 'Department Budget Variance', description: 'Operating expense vs allocated budget limits', visible: true, order: 3, section: 'Financial Operations' },
    strategic_goals: { label: 'OKRs & Strategic Objectives', description: 'Quarterly organizational key result completion rate', visible: true, order: 4, section: 'Strategic Performance' },
    team_attendance: { label: 'Today Shift Fulfillment', description: 'Department roster check-in status', visible: true, order: 5, section: 'Operations' },
    pending_leaves: { label: 'Pending Leave Sign-offs', description: 'Approvals requiring manager signature', visible: true, order: 6, section: 'Operations' },
    project_status: { label: 'Active Department Initiatives', description: 'Milestone tracking across projects', visible: true, order: 7, section: 'Operations' }
  },

  // 9. SELECTED PAGE CONTENT CONFIGURATION
  pageContentConfig: {
    Dashboard: { title: 'Enterprise Workforce Operating System', subtitle: 'Real-time intelligence and operational control across all departments.' },
    Employees: { title: 'Global Staff Directory', subtitle: 'Centralized talent profiles, credentials, and organizational mapping.' },
    Departments: { title: 'Department Workspaces', subtitle: 'Isolated operational hubs with custom SOPs, budgets, rosters, and KPIs.' },
    Payroll: { title: 'Enterprise Payroll Suite', subtitle: 'Compliant tax calculation, salary disbursements, and line-item audits.' },
    Leave: { title: 'Leave & Time-Off Management', subtitle: 'Policy-enforced leave requests, accruals, and shift coverage checks.' }
  },

  // 10. LOGIN EXPERIENCE BUILDER
  loginStyle: 'split-hero', // split-hero, centered-card, fullscreen-bg, minimal
  loginLogoUrl: '',
  loginTagline: 'Enterprise Workforce Intelligence & Operating Platform',
  securityNotice: 'Authorized personnel only. All access is logged and audited.',
  announcementBanner: 'Notice: Scheduled system upgrade planned for Sunday 02:00 UTC.',
  maintenanceMode: false,

  // 11. ACCESSIBILITY & CONTRAST
  highContrast: false,
  reducedMotion: false,
  fontScale: 100,

  // 12. VERSION MANAGEMENT & PUBLISH INFO
  currentVersion: 'v2.4.0 (Published)',
  lastPublishedAt: '2026-08-01 01:20:00',
  lastPublishedBy: 'Sarah Jenkins (Chief Technology Officer)'
}

export const PRESET_THEMES = {
  'corporate-blue': {
    name: 'Corporate Blue',
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
    accentColor: '#06b6d4',
    neutralColor: '#64748b'
  },
  'executive-navy': {
    name: 'Executive Navy',
    primaryColor: '#0f172a',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    neutralColor: '#475569'
  },
  'modern-cyan': {
    name: 'Modern Cyan',
    primaryColor: '#0891b2',
    secondaryColor: '#0284c7',
    accentColor: '#06b6d4',
    neutralColor: '#64748b'
  },
  'government-green': {
    name: 'Government Green',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10b981',
    neutralColor: '#4b5563'
  },
  'healthcare-teal': {
    name: 'Healthcare Teal',
    primaryColor: '#0d9488',
    secondaryColor: '#0f766e',
    accentColor: '#14b8a6',
    neutralColor: '#64748b'
  },
  'education-indigo': {
    name: 'Education Indigo',
    primaryColor: '#4338ca',
    secondaryColor: '#3730a3',
    accentColor: '#6366f1',
    neutralColor: '#64748b'
  },
  'ngo-purple': {
    name: 'NGO Purple',
    primaryColor: '#7e22ce',
    secondaryColor: '#6b21a8',
    accentColor: '#a855f7',
    neutralColor: '#64748b'
  },
  'minimal-light': {
    name: 'Minimal Light',
    primaryColor: '#18181b',
    secondaryColor: '#27272a',
    accentColor: '#3f3f46',
    neutralColor: '#71717a'
  },
  'minimal-dark': {
    name: 'Minimal Dark Canvas',
    primaryColor: '#3f3f46',
    secondaryColor: '#27272a',
    accentColor: '#e4e4e7',
    neutralColor: '#a1a1aa'
  },
  'high-contrast': {
    name: 'High Contrast WCAG AAA',
    primaryColor: '#000000',
    secondaryColor: '#002244',
    accentColor: '#00ffff',
    neutralColor: '#222222'
  }
}

// WCAG 2.1 Contrast Calculation Algorithm
export function calculateContrastRatio(hex1 = '#2563eb', hex2 = '#ffffff') {
  function getLuminance(hex) {
    if (!hex || typeof hex !== 'string') return 0.5
    const cleanHex = hex.replace('#', '')
    if (cleanHex.length < 6) return 0.5
    let r = parseInt(cleanHex.substring(0, 2), 16) / 255
    let g = parseInt(cleanHex.substring(2, 4), 16) / 255
    let b = parseInt(cleanHex.substring(4, 6), 16) / 255

    r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  const ratio = (lighter + 0.05) / (darker + 0.05)
  const roundedRatio = Math.round(ratio * 100) / 100

  return {
    ratio: roundedRatio,
    passAA: roundedRatio >= 4.5,
    passAALarge: roundedRatio >= 3.0,
    passAAA: roundedRatio >= 7.0,
    status: roundedRatio >= 7.0 ? 'EXCELLENT (AAA)' : roundedRatio >= 4.5 ? 'COMPLIANT (AA)' : roundedRatio >= 3.0 ? 'LARGE TEXT ONLY (3:1)' : 'FAIL (< 3:1)'
  }
}

const INITIAL_VERSIONS = [
  {
    id: 'v-240',
    version: 'v2.4.0',
    publishedAt: '2026-08-01 01:20:00',
    publishedBy: 'Sarah Jenkins (Chief Technology Officer)',
    changelog: 'Updated corporate blue theme, updated navigation labels for ATS & GRC, and verified WCAG AA contrast standards.',
    config: DEFAULT_BRAND_CONFIG
  },
  {
    id: 'v-230',
    version: 'v2.3.0',
    publishedAt: '2026-07-15 14:00:00',
    publishedBy: 'Alex Rivers (System Admin)',
    changelog: 'Initial White Label deployment, default StaffRoom tokens, and localized USD currency settings.',
    config: { ...DEFAULT_BRAND_CONFIG, orgName: 'StaffRoom Core' }
  }
]

const INITIAL_AUDIT_LOGS = [
  { id: 'al-1', action: 'CONFIG_PUBLISHED', details: 'Published version v2.4.0 with updated corporate theme', user: 'Sarah Jenkins', timestamp: '2026-08-01 01:20:00' },
  { id: 'al-2', action: 'TERMINOLOGY_UPDATED', details: 'Mapped "Department" -> "Department Workspace"', user: 'Alex Rivers', timestamp: '2026-07-28 11:15:00' },
  { id: 'al-3', action: 'CARD_VISIBILITY_CHANGED', details: 'Hidden "headcount_trend" on Employee view', user: 'David Miller', timestamp: '2026-07-20 09:30:00' }
]

const BrandContext = createContext(null)

export function BrandProvider({ children }) {
  // Published Production Config
  const [activeConfig, setActiveConfig] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_BRAND_CONFIG
    try {
      const saved = localStorage.getItem('staffroom_brand_experience_config')
      return saved ? { ...DEFAULT_BRAND_CONFIG, ...JSON.parse(saved) } : DEFAULT_BRAND_CONFIG
    } catch {
      return DEFAULT_BRAND_CONFIG
    }
  })

  // Uncommitted Draft Config
  const [draftConfig, setDraftConfig] = useState(activeConfig)

  // Preview Mode Flag
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Version Snapshots & Audit Logs
  const [versions, setVersions] = useState(INITIAL_VERSIONS)
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS)

  // Effective config currently displayed
  const effectiveConfig = isPreviewMode ? draftConfig : activeConfig

  // Apply CSS Variables to Document Root
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    root.style.setProperty('--brand-primary', effectiveConfig.primaryColor)
    root.style.setProperty('--brand-secondary', effectiveConfig.secondaryColor)
    root.style.setProperty('--brand-accent', effectiveConfig.accentColor)
    root.style.setProperty('--brand-bg', effectiveConfig.surfaceBg)
    root.style.setProperty('--brand-text', effectiveConfig.textColor)
    root.style.setProperty('--brand-radius', effectiveConfig.borderRadius)

    // Save Active Published Config to Local Storage
    try {
      localStorage.setItem('staffroom_brand_experience_config', JSON.stringify(activeConfig))
    } catch {
      // ignore
    }
  }, [effectiveConfig, activeConfig])

  // Custom Terminology Translator
  const t = (termKey, defaultValue = '') => {
    if (effectiveConfig.terminology && effectiveConfig.terminology[termKey]) {
      return effectiveConfig.terminology[termKey]
    }
    return defaultValue || termKey
  }

  // Formatting Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr

      const format = effectiveConfig.dateFormat || 'YYYY-MM-DD'
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`
      if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`
      if (format === 'D MMM YYYY') return date.toLocaleDateString(effectiveConfig.language || 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      return `${year}-${month}-${day}`
    } catch {
      return dateStr
    }
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    if (effectiveConfig.timeFormat === '24h') return timeStr
    return timeStr // default 12h representation
  }

  const formatCurrency = (amount) => {
    const sym = effectiveConfig.currencySymbol || '$'
    const num = Number(amount) || 0
    return `${sym}${num.toLocaleString(effectiveConfig.language || 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Navigation Config Helper
  const getNavConfig = (navId) => {
    if (effectiveConfig.navConfig && effectiveConfig.navConfig[navId]) {
      return effectiveConfig.navConfig[navId]
    }
    return { label: navId, visible: true, order: 99 }
  }

  // Card Config Helper
  const getCardConfig = (cardId) => {
    if (effectiveConfig.cardConfig && effectiveConfig.cardConfig[cardId]) {
      return effectiveConfig.cardConfig[cardId]
    }
    return { label: cardId, description: '', visible: true, order: 99, section: 'General' }
  }

  // Selected Page Content Helper
  const getPageContent = (pageId) => {
    if (effectiveConfig.pageContentConfig && effectiveConfig.pageContentConfig[pageId]) {
      return effectiveConfig.pageContentConfig[pageId]
    }
    return { title: pageId, subtitle: '' }
  }

  // Draft Config Actions
  const updateDraftConfig = (updates) => {
    setDraftConfig((prev) => {
      const next = { ...prev }
      Object.keys(updates).forEach((key) => {
        if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
          next[key] = { ...prev[key], ...updates[key] }
        } else {
          next[key] = updates[key]
        }
      })
      return next
    })
  }

  const updateBrandConfig = (updates) => {
    updateDraftConfig(updates)
  }

  // Preset Theme Helper
  const applyPresetTheme = (presetKey) => {
    if (!PRESET_THEMES[presetKey]) return
    const preset = PRESET_THEMES[presetKey]
    updateDraftConfig({
      presetTheme: presetKey,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      neutralColor: preset.neutralColor
    })
  }

  // AI Theme Generator
  const generateAITheme = (prompt) => {
    const lower = prompt.toLowerCase()
    let primary = '#2563eb'
    let secondary = '#4f46e5'
    let accent = '#06b6d4'

    if (lower.includes('teal') || lower.includes('health') || lower.includes('clinic')) {
      primary = '#0d9488'
      secondary = '#0f766e'
      accent = '#14b8a6'
    } else if (lower.includes('emerald') || lower.includes('green') || lower.includes('eco')) {
      primary = '#059669'
      secondary = '#047857'
      accent = '#10b981'
    } else if (lower.includes('purple') || lower.includes('creative') || lower.includes('luxury')) {
      primary = '#7e22ce'
      secondary = '#6b21a8'
      accent = '#a855f7'
    } else if (lower.includes('dark') || lower.includes('midnight') || lower.includes('noir')) {
      primary = '#0f172a'
      secondary = '#1e293b'
      accent = '#38bdf8'
    } else if (lower.includes('orange') || lower.includes('warm') || lower.includes('sun')) {
      primary = '#ea580c'
      secondary = '#c2410c'
      accent = '#f97316'
    }

    updateDraftConfig({
      presetTheme: 'ai-generated',
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent
    })

    return { primary, secondary, accent }
  }

  // Publish Draft to Production Version
  const publishDraft = (changelogNotes = 'Updated organization white-labeling', publishedBy = 'System Admin') => {
    const versionNum = versions.length + 1
    const versionTag = `v2.${versionNum + 3}.0`
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    const publishedConfig = {
      ...draftConfig,
      currentVersion: `${versionTag} (Published)`,
      lastPublishedAt: now,
      lastPublishedBy: publishedBy
    }

    setActiveConfig(publishedConfig)
    setDraftConfig(publishedConfig)
    setIsPreviewMode(false)

    // Append to Versions History
    const newVersionSnap = {
      id: `v-${Date.now()}`,
      version: versionTag,
      publishedAt: now,
      publishedBy,
      changelog: changelogNotes,
      config: publishedConfig
    }
    setVersions([newVersionSnap, ...versions])

    // Append to Audit Logs
    const newAuditEntry = {
      id: `al-${Date.now()}`,
      action: 'CONFIG_PUBLISHED',
      details: `Published ${versionTag}: ${changelogNotes}`,
      user: publishedBy,
      timestamp: now
    }
    setAuditLogs([newAuditEntry, ...auditLogs])

    return versionTag
  }

  // Discard Draft
  const discardDraft = () => {
    setDraftConfig(activeConfig)
  }

  // Restore Historical Version
  const restoreVersion = (versionId, restoredBy = 'System Admin') => {
    const targetVer = versions.find((v) => v.id === versionId)
    if (!targetVer) return false

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    const restoredConfig = {
      ...targetVer.config,
      currentVersion: `${targetVer.version}-restored`,
      lastPublishedAt: now,
      lastPublishedBy: restoredBy
    }

    setActiveConfig(restoredConfig)
    setDraftConfig(restoredConfig)

    // Log Audit Event
    const newAuditEntry = {
      id: `al-${Date.now()}`,
      action: 'VERSION_RESTORED',
      details: `Restored historical snapshot ${targetVer.version}`,
      user: restoredBy,
      timestamp: now
    }
    setAuditLogs([newAuditEntry, ...auditLogs])

    return true
  }

  // Reset to StaffRoom Defaults
  const resetToDefaults = () => {
    setActiveConfig(DEFAULT_BRAND_CONFIG)
    setDraftConfig(DEFAULT_BRAND_CONFIG)
    setIsPreviewMode(false)

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    const newAuditEntry = {
      id: `al-${Date.now()}`,
      action: 'CONFIG_RESET_DEFAULTS',
      details: 'Reset configuration to StaffRoom default base tokens',
      user: 'System Admin',
      timestamp: now
    }
    setAuditLogs([newAuditEntry, ...auditLogs])
  }

  const togglePreviewMode = () => {
    setIsPreviewMode((prev) => !prev)
  }

  return (
    <BrandContext.Provider
      value={{
        brandConfig: effectiveConfig,
        activeConfig,
        draftConfig,
        isPreviewMode,
        versions,
        auditLogs,
        t,
        formatDate,
        formatTime,
        formatCurrency,
        getNavConfig,
        getCardConfig,
        getPageContent,
        checkContrast: calculateContrastRatio,
        updateDraftConfig,
        updateBrandConfig,
        applyPresetTheme,
        generateAITheme,
        publishDraft,
        discardDraft,
        restoreVersion,
        resetToDefaults,
        togglePreviewMode
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    return {
      brandConfig: DEFAULT_BRAND_CONFIG,
      activeConfig: DEFAULT_BRAND_CONFIG,
      draftConfig: DEFAULT_BRAND_CONFIG,
      isPreviewMode: false,
      versions: [],
      auditLogs: [],
      t: (key) => key,
      formatDate: (d) => d,
      formatTime: (t) => t,
      formatCurrency: (a) => `$${a}`,
      getNavConfig: (k) => ({ label: k, visible: true, order: 99 }),
      getCardConfig: (k) => ({ label: k, description: '', visible: true, order: 99 }),
      getPageContent: (p) => ({ title: p, subtitle: '' }),
      checkContrast: calculateContrastRatio,
      updateDraftConfig: () => {},
      updateBrandConfig: () => {},
      applyPresetTheme: () => {},
      generateAITheme: () => ({}),
      publishDraft: () => 'v2.4.0',
      discardDraft: () => {},
      restoreVersion: () => {},
      resetToDefaults: () => {},
      togglePreviewMode: () => {}
    }
  }
  return context
}
