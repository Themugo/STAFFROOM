import React, { useEffect } from 'react'
import { SEO_CONFIG } from '@/config/seo.config'

/**
 * Reusable SEO Head component for updating Document metadata, Open Graph,
 * Twitter Cards, Canonical links, Robots directives, and JSON-LD Structured Data.
 */
export default function SEO({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage,
  noindex = false,
  article,
  breadcrumbs,
  schema,
}) {
  const fullTitle = title
    ? (title.includes(SEO_CONFIG.siteName) ? title : `${title} | ${SEO_CONFIG.siteName}`)
    : SEO_CONFIG.defaultTitle

  const metaDesc = description || SEO_CONFIG.defaultDescription
  const currentPath = canonical || (typeof window !== 'undefined' ? window.location.pathname : '/')
  const canonicalUrl = `${SEO_CONFIG.canonicalBaseUrl}${currentPath}`
  const imageUrl = ogImage || SEO_CONFIG.defaultOgImage
  const robotsValue = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle

    // Helper to update or create meta tag
    const setMetaTag = (attribute, nameValue, contentValue) => {
      if (!contentValue) return
      let element = document.querySelector(`meta[${attribute}="${nameValue}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, nameValue)
        document.head.appendChild(element)
      }
      element.setAttribute('content', contentValue)
    }

    // Helper to update or create link tag
    const setLinkTag = (relValue, hrefValue) => {
      if (!hrefValue) return
      let element = document.querySelector(`link[rel="${relValue}"]`)
      if (!element) {
        element = document.createElement('link')
        element.setAttribute('rel', relValue)
        document.head.appendChild(element)
      }
      element.setAttribute('href', hrefValue)
    }

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', metaDesc)
    setMetaTag('name', 'robots', robotsValue)
    setLinkTag('canonical', canonicalUrl)

    // 3. Open Graph
    setMetaTag('property', 'og:site_name', SEO_CONFIG.siteName)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', metaDesc)
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', imageUrl)

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:site', SEO_CONFIG.twitterHandle)
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', metaDesc)
    setMetaTag('name', 'twitter:image', imageUrl)

    // 5. JSON-LD Structured Data
    const schemasToInject = []

    // Global Organization schema on indexable public pages
    if (!noindex) {
      schemasToInject.push(SEO_CONFIG.organizationSchema)
      if (currentPath === '/' || currentPath === '') {
        schemasToInject.push(SEO_CONFIG.websiteSchema)
      }
    }

    // Article schema if provided
    if (article) {
      schemasToInject.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title || fullTitle,
        description: article.description || metaDesc,
        image: article.image || imageUrl,
        datePublished: article.publishedTime || new Date().toISOString(),
        dateModified: article.modifiedTime || article.publishedTime || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: article.author || 'STAFFROOM Editorial Team',
        },
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: 'https://staffroom.ke/logo.png',
          },
        },
        mainEntityOfPage: canonicalUrl,
      })
    }

    // BreadcrumbList schema if provided
    if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      schemasToInject.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((bc, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: bc.name,
          item: bc.item ? `${SEO_CONFIG.canonicalBaseUrl}${bc.item}` : canonicalUrl,
        })),
      })
    }

    // Custom extra schema
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema)
      } else {
        schemasToInject.push(schema)
      }
    }

    if (schemasToInject.length > 0) {
      let scriptTag = document.getElementById('seo-jsonld-script')
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.id = 'seo-jsonld-script'
        scriptTag.type = 'application/ld+json'
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : schemasToInject
      )
    }

  }, [fullTitle, metaDesc, canonicalUrl, robotsValue, ogType, imageUrl, noindex, article, breadcrumbs, schema, currentPath])

  return null
}
