/**
 * Centralized SEO & Meta Configuration for STAFFROOM
 * Defines site defaults, canonical base URLs, organization schema, and page-level SEO defaults.
 */

export const SEO_CONFIG = {
  siteName: 'STAFFROOM',
  brandName: 'STAFFROOM Enterprise HR & Staff Operations Platform',
  domain: 'staffroom.ke',
  canonicalBaseUrl: 'https://staffroom.ke',
  defaultOgImage: 'https://staffroom.ke/og-image.png',
  twitterHandle: '@staffroom_hr',
  defaultTitle: 'STAFFROOM | Enterprise HR & Staff Operations System',
  defaultDescription:
    'STAFFROOM is the all-in-one enterprise HR, payroll, attendance, compliance, and staff operations platform designed for public sector and corporate organizations.',
  
  // Organization Schema.org structured data
  organizationSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'STAFFROOM Technologies',
    legalName: 'STAFFROOM HR & Operations Systems Ltd',
    url: 'https://staffroom.ke',
    logo: 'https://staffroom.ke/logo.png',
    description:
      'Enterprise HR, Automated Payroll, Attendance Intelligence, Statutory Compliance, and Staff Operations Platform.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    sameAs: [
      'https://twitter.com/staffroom_hr',
      'https://linkedin.com/company/staffroom-hr',
      'https://github.com/staffroom-hr',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@staffroom.ke',
      url: 'https://staffroom.ke/contact',
    },
  },

  // WebSite Schema.org structured data
  websiteSchema: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'STAFFROOM',
    url: 'https://staffroom.ke',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://staffroom.ke/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },

  // Per-page metadata overrides
  pages: {
    home: {
      title: 'STAFFROOM | Enterprise HR & Staff Operations Platform',
      description:
        'Transform enterprise workforce operations with STAFFROOM. Unified HR, automated payroll, biometric attendance, statutory compliance, and AI workflow automation.',
      canonical: '/',
      ogType: 'website',
    },
    about: {
      title: 'About STAFFROOM | Building Modern Public & Enterprise HR Technology',
      description:
        'Learn how STAFFROOM is modernizing HR, payroll, governance, and workforce intelligence across East Africa and enterprise organizations.',
      canonical: '/about',
      ogType: 'website',
    },
    features: {
      title: 'Platform Features & Modules | STAFFROOM Enterprise HR',
      description:
        'Explore STAFFROOM core capabilities: Automated Payroll, Time & Attendance, Performance Appraisals, Onboarding, Asset Management, and Statutory Reporting.',
      canonical: '/features',
      ogType: 'website',
    },
    pricing: {
      title: 'Pricing & Deployment Plans | STAFFROOM Enterprise HR',
      description:
        'Transparent subscription plans for growing companies and custom enterprise government deployments. Dedicated support, SLA guarantees, and local statutory compliance.',
      canonical: '/pricing',
      ogType: 'website',
    },
    contact: {
      title: 'Contact Sales & Support | STAFFROOM Enterprise HR',
      description:
        'Get in touch with the STAFFROOM team for enterprise product demos, custom deployment proposals, or technical assistance.',
      canonical: '/contact',
      ogType: 'website',
    },
    blog: {
      title: 'Staff Operations & HR Tech Insights | STAFFROOM Official Blog',
      description:
        'Articles, statutory compliance updates, payroll automation guides, and workforce management best practices from the STAFFROOM team.',
      canonical: '/blog',
      ogType: 'website',
    },
    privacy: {
      title: 'Privacy Policy & Data Security | STAFFROOM Enterprise HR',
      description:
        'STAFFROOM commitment to data protection, encryption standards, statutory compliance, and user data privacy.',
      canonical: '/privacy',
      ogType: 'website',
    },
    terms: {
      title: 'Terms of Service | STAFFROOM Enterprise HR',
      description:
        'Master service agreement, SLA terms, acceptable use policy, and platform subscription terms for STAFFROOM.',
      canonical: '/terms',
      ogType: 'website',
    },
    login: {
      title: 'Sign In | STAFFROOM Enterprise Portal',
      description:
        'Access your STAFFROOM workspace securely. Single Sign-On (SSO) and multi-factor authentication for employees and administrators.',
      canonical: '/login',
      noindex: true,
      ogType: 'website',
    },
  },
}
