export const websiteMapper = {
  mapSettings(raw) {
    if (!raw) return null
    return {
      siteName: raw.site_name,
      siteTagline: raw.site_tagline,
      logoUrl: raw.logo_url,
      logoText: raw.logo_text || 'SR',
      primaryColor: raw.primary_color,
      secondaryColor: raw.secondary_color,
      announcementBarText: raw.announcement_bar_text,
      announcementBarActive: raw.announcement_bar_active,
      announcementBarLink: raw.announcement_bar_link,
    }
  },

  mapHero(raw) {
    if (!raw) return null
    return {
      id: raw.id,
      badgeText: raw.badge_text,
      badgeIcon: raw.badge_icon || 'Star',
      headline: raw.headline,
      headlineHighlight: raw.headline_highlight,
      subheadline: raw.subheadline,
      primaryCtaLabel: raw.primary_cta_label || 'Start Free Trial',
      primaryCtaUrl: raw.primary_cta_url || '/login',
      secondaryCtaLabel: raw.secondary_cta_label,
      secondaryCtaUrl: raw.secondary_cta_url,
      secondaryCtaIcon: raw.secondary_cta_icon || 'Play',
    }
  },

  mapFeature(raw) {
    return {
      id: raw.id,
      icon: raw.icon,
      title: raw.title,
      description: raw.description,
      colorGradient: raw.color_gradient || 'from-blue-500 to-blue-600',
      category: raw.category,
      displayOrder: raw.display_order,
      isVisible: raw.is_visible,
    }
  },

  mapStatistic(raw) {
    return {
      id: raw.id,
      value: raw.value,
      label: raw.label,
      icon: raw.icon || 'Building2',
    }
  },

  mapPricingPlan(raw) {
    return {
      id: raw.id,
      name: raw.name,
      price: raw.price,
      currency: raw.currency || 'KES',
      period: raw.period || '/month',
      description: raw.description,
      isPopular: raw.is_popular,
      features: Array.isArray(raw.features) ? raw.features : [],
      ctaLabel: raw.cta_label || 'Get Started',
      ctaUrl: raw.cta_url || '/login',
    }
  },

  mapTestimonial(raw) {
    return {
      id: raw.id,
      name: raw.name,
      role: raw.role,
      company: raw.company,
      quote: raw.quote,
      avatar: raw.avatar,
      avatarUrl: raw.avatar_url,
      rating: raw.rating || 5,
    }
  },

  mapFAQ(raw) {
    return {
      id: raw.id,
      question: raw.question,
      answer: raw.answer,
      category: raw.category || 'General',
    }
  },

  mapCTA(raw) {
    if (!raw) return null
    return {
      id: raw.id,
      headline: raw.headline,
      subheadline: raw.subheadline,
      primaryCtaLabel: raw.primary_cta_label,
      primaryCtaUrl: raw.primary_cta_url || '/login',
      secondaryCtaLabel: raw.secondary_cta_label,
      secondaryCtaUrl: raw.secondary_cta_url,
    }
  },

  mapNavItem(raw) {
    return {
      id: raw.id,
      label: raw.label,
      url: raw.url,
      navType: raw.nav_type,
    }
  },

  mapFooterLink(raw) {
    return {
      id: raw.id,
      groupTitle: raw.group_title,
      label: raw.link_label,
      url: raw.link_url,
    }
  },

  mapSocialLink(raw) {
    return {
      id: raw.id,
      platform: raw.platform,
      label: raw.label,
      url: raw.url,
      icon: raw.icon,
    }
  },

  mapIntegration(raw) {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      icon: raw.icon || 'Plug',
      category: raw.category,
      logoUrl: raw.logo_url,
    }
  },

  mapBlogPost(raw) {
    return {
      id: raw.id,
      title: raw.title,
      slug: raw.slug,
      excerpt: raw.excerpt,
      content: raw.content,
      authorName: raw.author_name,
      authorAvatar: raw.author_avatar,
      category: raw.category,
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      coverImageUrl: raw.cover_image_url,
      readingTime: raw.reading_time_minutes || 5,
      publishedAt: raw.published_at,
    }
  },

  mapSEO(raw) {
    if (!raw) return null
    return {
      metaTitle: raw.meta_title,
      metaDescription: raw.meta_description,
      canonicalUrl: raw.canonical_url,
      ogTitle: raw.og_title,
      ogDescription: raw.og_description,
      ogImageUrl: raw.og_image_url,
      twitterCard: raw.twitter_card,
      twitterTitle: raw.twitter_title,
      twitterDescription: raw.twitter_description,
      twitterImageUrl: raw.twitter_image_url,
      jsonLd: raw.json_ld,
      robotsIndex: raw.robots_index,
      robotsFollow: raw.robots_follow,
    }
  },
}
