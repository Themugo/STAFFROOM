/**
 * @typedef {Object} WebsiteSettings
 * @property {string} site_name
 * @property {string} site_tagline
 * @property {string} logo_text
 * @property {string} primary_color
 * @property {string} secondary_color
 * @property {string} announcement_bar_text
 * @property {boolean} announcement_bar_active
 * @property {string} announcement_bar_link
 */

/**
 * @typedef {Object} WebsiteHero
 * @property {string} badge_text
 * @property {string} badge_icon
 * @property {string} headline
 * @property {string} headline_highlight
 * @property {string} subheadline
 * @property {string} primary_cta_label
 * @property {string} primary_cta_url
 * @property {string} secondary_cta_label
 * @property {string} secondary_cta_url
 * @property {string} secondary_cta_icon
 */

/**
 * @typedef {Object} WebsiteFeature
 * @property {string} icon
 * @property {string} title
 * @property {string} description
 * @property {string} color_gradient
 * @property {string} category
 */

/**
 * @typedef {Object} WebsiteStatistic
 * @property {string} value
 * @property {string} label
 * @property {string} icon
 */

/**
 * @typedef {Object} WebsitePricingPlan
 * @property {string} name
 * @property {string} price
 * @property {string} currency
 * @property {string} period
 * @property {boolean} is_popular
 * @property {string[]} features
 * @property {string} cta_label
 * @property {string} cta_url
 */

/**
 * @typedef {Object} WebsiteTestimonial
 * @property {string} name
 * @property {string} role
 * @property {string} company
 * @property {string} quote
 * @property {string} avatar
 * @property {number} rating
 */

/**
 * @typedef {Object} WebsiteFAQItem
 * @property {string} question
 * @property {string} answer
 * @property {string} category
 */

/**
 * @typedef {Object} WebsiteCTA
 * @property {string} headline
 * @property {string} subheadline
 * @property {string} primary_cta_label
 * @property {string} primary_cta_url
 * @property {string} secondary_cta_label
 * @property {string} secondary_cta_url
 */

/**
 * @typedef {Object} WebsiteNavItem
 * @property {string} label
 * @property {string} url
 * @property {string} nav_type
 */

/**
 * @typedef {Object} WebsiteFooterLink
 * @property {string} group_title
 * @property {string} link_label
 * @property {string} link_url
 */

/**
 * @typedef {Object} WebsiteSocialLink
 * @property {string} platform
 * @property {string} label
 * @property {string} url
 * @property {string} icon
 */

/**
 * @typedef {Object} WebsiteIntegration
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} category
 */

/**
 * @typedef {Object} WebsiteBlogPost
 * @property {string} title
 * @property {string} slug
 * @property {string} excerpt
 * @property {string} content
 * @property {string} author_name
 * @property {string} category
 * @property {string[]} tags
 * @property {number} reading_time_minutes
 * @property {string} published_at
 */

/**
 * @typedef {Object} WebsiteSEO
 * @property {string} page_slug
 * @property {string} meta_title
 * @property {string} meta_description
 * @property {string} og_title
 * @property {string} og_description
 */

export const WEBSITE_TABLES = {
  SETTINGS: 'website_settings',
  PAGES: 'website_pages',
  SECTIONS: 'website_sections',
  CONTENT: 'website_content',
  NAVIGATION: 'website_navigation',
  FOOTER: 'website_footer',
  SOCIAL: 'website_social_links',
  HERO: 'website_hero',
  FEATURES: 'website_features',
  STATISTICS: 'website_statistics',
  PRICING: 'website_pricing_plans',
  TESTIMONIALS: 'website_testimonials',
  FAQ: 'website_faq',
  CTA: 'website_cta',
  LOGOS: 'website_logos',
  INTEGRATIONS: 'website_integrations',
  BLOG_POSTS: 'website_blog_posts',
  BLOG_CATEGORIES: 'website_blog_categories',
  SEO: 'website_seo',
  NEWSLETTER: 'website_newsletter',
  CONTACT: 'website_contact_submissions',
  MEDIA: 'website_media',
}
