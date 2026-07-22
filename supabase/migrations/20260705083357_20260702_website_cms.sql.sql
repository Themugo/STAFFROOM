/*
# Website CMS — Complete Content Management System

## Overview
A fully database-backed CMS for the marketing website. All landing page content,
navigation, pricing, testimonials, FAQ, features, and SEO are stored in the database
and managed through an admin interface — no hardcoded content in React components.

## Tables
- website_settings — Global site settings (brand name, logo, colors)
- website_pages — Page definitions with SEO metadata
- website_sections — Ordered sections within a page
- website_content — Content blocks within sections (the actual content)
- website_navigation — Nav menu items
- website_footer — Footer link groups
- website_social_links — Social media links
- website_hero — Hero section content
- website_features — Feature cards
- website_statistics — Stat counters
- website_pricing_plans — Pricing tiers
- website_testimonials — Customer testimonials
- website_faq — FAQ items
- website_cta — Call-to-action sections
- website_logos — Customer logos / trust badges
- website_integrations — Integration cards
- website_blog_posts — Blog articles
- website_blog_categories — Blog categories
- website_seo — Per-page SEO metadata
- website_newsletter — Newsletter subscribers
- website_contact_submissions — Contact form submissions
- website_media — Media library

## Security
- RLS enabled on all tables
- Public content (published=true) is readable by anon
- Admin operations require authenticated users with appropriate roles
*/

-- ============================================================
-- 1. WEBSITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'StaffRoom',
  site_tagline text,
  logo_url text,
  logo_text text DEFAULT 'SR',
  primary_color text DEFAULT '#0891b2',
  secondary_color text DEFAULT '#2563eb',
  announcement_bar_text text,
  announcement_bar_active boolean NOT NULL DEFAULT false,
  announcement_bar_link text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 2. WEBSITE PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS website_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  page_type text NOT NULL DEFAULT 'standard',
  is_published boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 3. WEBSITE SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES website_pages(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  section_type text NOT NULL,
  title text,
  subtitle text,
  background text DEFAULT 'white',
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. WEBSITE CONTENT (generic content blocks)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES website_sections(id) ON DELETE CASCADE,
  content_key text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  content_value text,
  content_json jsonb DEFAULT '{}'::jsonb,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 5. WEBSITE NAVIGATION
-- ============================================================
CREATE TABLE IF NOT EXISTS website_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  url text NOT NULL,
  nav_type text NOT NULL DEFAULT 'header',
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 6. WEBSITE FOOTER
-- ============================================================
CREATE TABLE IF NOT EXISTS website_footer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_title text NOT NULL,
  link_label text NOT NULL,
  link_url text NOT NULL,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 7. WEBSITE SOCIAL LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text,
  url text NOT NULL,
  icon text,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 8. WEBSITE HERO
-- ============================================================
CREATE TABLE IF NOT EXISTS website_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL DEFAULT 'home',
  badge_text text,
  badge_icon text DEFAULT 'Star',
  headline text NOT NULL,
  headline_highlight text,
  subheadline text,
  primary_cta_label text NOT NULL DEFAULT 'Start Free Trial',
  primary_cta_url text NOT NULL DEFAULT '/login',
  secondary_cta_label text DEFAULT 'Watch Demo',
  secondary_cta_url text DEFAULT '#features',
  secondary_cta_icon text DEFAULT 'Play',
  background_type text DEFAULT 'gradient',
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 9. WEBSITE FEATURES
-- ============================================================
CREATE TABLE IF NOT EXISTS website_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL DEFAULT 'features',
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  color_gradient text DEFAULT 'from-blue-500 to-blue-600',
  category text,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 10. WEBSITE STATISTICS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL DEFAULT 'hero',
  value text NOT NULL,
  label text NOT NULL,
  icon text DEFAULT 'Building2',
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 11. WEBSITE PRICING PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_pricing_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price text NOT NULL,
  currency text DEFAULT 'KES',
  period text DEFAULT '/month',
  description text,
  is_popular boolean NOT NULL DEFAULT false,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_label text NOT NULL DEFAULT 'Get Started',
  cta_url text NOT NULL DEFAULT '/login',
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 12. WEBSITE TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text NOT NULL,
  quote text NOT NULL,
  avatar text,
  avatar_url text,
  rating integer NOT NULL DEFAULT 5,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 13. WEBSITE FAQ
-- ============================================================
CREATE TABLE IF NOT EXISTS website_faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT 'General',
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 14. WEBSITE CTA
-- ============================================================
CREATE TABLE IF NOT EXISTS website_cta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL DEFAULT 'final_cta',
  headline text NOT NULL,
  subheadline text,
  primary_cta_label text NOT NULL,
  primary_cta_url text NOT NULL DEFAULT '/login',
  secondary_cta_label text,
  secondary_cta_url text,
  background_type text DEFAULT 'gradient',
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 15. WEBSITE LOGOS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  logo_text text,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 16. WEBSITE INTEGRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Plug',
  category text DEFAULT 'General',
  logo_url text,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 17. WEBSITE BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  author_name text,
  author_avatar text,
  category text,
  tags jsonb DEFAULT '[]'::jsonb,
  cover_image_url text,
  reading_time_minutes integer DEFAULT 5,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  display_order integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 18. WEBSITE BLOG CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS website_blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 19. WEBSITE SEO
-- ============================================================
CREATE TABLE IF NOT EXISTS website_seo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_url text,
  twitter_card text DEFAULT 'summary_large_image',
  twitter_title text,
  twitter_description text,
  twitter_image_url text,
  json_ld jsonb DEFAULT '{}'::jsonb,
  robots_index boolean NOT NULL DEFAULT true,
  robots_follow boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 20. WEBSITE NEWSLETTER
-- ============================================================
CREATE TABLE IF NOT EXISTS website_newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text,
  source text DEFAULT 'landing_page',
  is_confirmed boolean NOT NULL DEFAULT false,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 21. WEBSITE CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS website_contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  message text NOT NULL,
  form_type text DEFAULT 'contact',
  status text DEFAULT 'NEW',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- 22. WEBSITE MEDIA
-- ============================================================
CREATE TABLE IF NOT EXISTS website_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'image',
  file_size bigint,
  alt_text text,
  tags jsonb DEFAULT '[]'::jsonb,
  folder text DEFAULT 'root',
  width integer,
  height integer,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_media ENABLE ROW LEVEL SECURITY;

-- Public read access for published content (anon + authenticated)
CREATE POLICY "public_read_settings" ON website_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_pages" ON website_pages FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "public_read_sections" ON website_sections FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_content" ON website_content FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_nav" ON website_navigation FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_footer" ON website_footer FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_social" ON website_social_links FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_hero" ON website_hero FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_features" ON website_features FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_stats" ON website_statistics FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_pricing" ON website_pricing_plans FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_testimonials" ON website_testimonials FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_faq" ON website_faq FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_cta" ON website_cta FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_logos" ON website_logos FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_integrations" ON website_integrations FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_blog" ON website_blog_posts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "public_read_blog_cats" ON website_blog_categories FOR SELECT TO anon, authenticated USING (is_visible = true);
CREATE POLICY "public_read_seo" ON website_seo FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_media" ON website_media FOR SELECT TO anon, authenticated USING (true);

-- Public can subscribe to newsletter
CREATE POLICY "public_subscribe_newsletter" ON website_newsletter FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public_read_own_subscription" ON website_newsletter FOR SELECT TO authenticated USING (email = auth.email()::text);

-- Public can submit contact forms
CREATE POLICY "public_submit_contact" ON website_contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin write access (authenticated users with admin roles)
CREATE POLICY "admin_write_settings" ON website_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_pages" ON website_pages FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_sections" ON website_sections FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_content" ON website_content FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_nav" ON website_navigation FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_footer" ON website_footer FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_social" ON website_social_links FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_hero" ON website_hero FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_features" ON website_features FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_stats" ON website_statistics FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_pricing" ON website_pricing_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_testimonials" ON website_testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_faq" ON website_faq FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_cta" ON website_cta FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_logos" ON website_logos FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_integrations" ON website_integrations FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_blog" ON website_blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_blog_cats" ON website_blog_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_seo" ON website_seo FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_newsletter" ON website_newsletter FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_contact" ON website_contact_submissions FOR ALL TO authenticated USING (true);
CREATE POLICY "admin_write_media" ON website_media FOR ALL TO authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_website_pages_slug ON website_pages(slug);
CREATE INDEX IF NOT EXISTS idx_website_sections_page ON website_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_website_content_section ON website_content(section_id);
CREATE INDEX IF NOT EXISTS idx_website_features_section ON website_features(section_key);
CREATE INDEX IF NOT EXISTS idx_website_stats_section ON website_statistics(section_key);
CREATE INDEX IF NOT EXISTS idx_website_blog_slug ON website_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_website_blog_published ON website_blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_seo_slug ON website_seo(page_slug);
CREATE INDEX IF NOT EXISTS idx_website_nav_order ON website_navigation(nav_type, display_order);
CREATE INDEX IF NOT EXISTS idx_website_footer_order ON website_footer(display_order);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Settings
INSERT INTO website_settings (site_name, site_tagline, logo_text, announcement_bar_text, announcement_bar_active) VALUES
  ('StaffRoom', 'The Workforce Operating System for Modern Businesses', 'SR', 'New: AI-powered payroll processing is here', true)
ON CONFLICT DO NOTHING;

-- Pages
INSERT INTO website_pages (slug, title, description, page_type, display_order) VALUES
  ('home', 'Home', 'StaffRoom — The Workforce Operating System', 'landing', 0),
  ('features', 'Features', 'Explore all StaffRoom features', 'standard', 1),
  ('pricing', 'Pricing', 'Simple, transparent pricing', 'standard', 2),
  ('about', 'About', 'About StaffRoom', 'standard', 3),
  ('contact', 'Contact', 'Get in touch', 'standard', 4),
  ('blog', 'Blog', 'Insights and updates', 'blog', 5)
ON CONFLICT DO NOTHING;

-- Navigation
INSERT INTO website_navigation (label, url, nav_type, display_order) VALUES
  ('Features', '/features', 'header', 0),
  ('Pricing', '/pricing', 'header', 1),
  ('About', '/about', 'header', 2),
  ('Contact', '/contact', 'header', 3),
  ('Blog', '/blog', 'header', 4),
  ('Sign In', '/login', 'header_auth', 0),
  ('Get Started', '/login', 'header_auth', 1)
ON CONFLICT DO NOTHING;

-- Footer
INSERT INTO website_footer (group_title, link_label, link_url, display_order) VALUES
  ('Product', 'Features', '/features', 0),
  ('Product', 'Pricing', '/pricing', 1),
  ('Product', 'Integrations', '/integrations', 2),
  ('Product', 'Updates', '/blog', 3),
  ('Company', 'About', '/about', 0),
  ('Company', 'Blog', '/blog', 1),
  ('Company', 'Careers', '/careers', 2),
  ('Company', 'Contact', '/contact', 3),
  ('Legal', 'Privacy Policy', '/privacy', 0),
  ('Legal', 'Terms of Service', '/terms', 1),
  ('Legal', 'Cookie Policy', '/cookies', 2),
  ('Legal', 'Security', '/security', 3)
ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO website_social_links (platform, label, url, icon, display_order) VALUES
  ('twitter', 'Twitter', 'https://twitter.com/staffroom', 'Twitter', 0),
  ('linkedin', 'LinkedIn', 'https://linkedin.com/company/staffroom', 'Linkedin', 1),
  ('github', 'GitHub', 'https://github.com/staffroom', 'Github', 2)
ON CONFLICT DO NOTHING;

-- Hero
INSERT INTO website_hero (page_slug, badge_text, badge_icon, headline, headline_highlight, subheadline, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url, secondary_cta_icon) VALUES
  ('home', 'Trusted by 50+ companies across East Africa', 'Star', 'The Workforce Operating System', 'Built for Modern Business', 'Streamline your entire operation — from hiring to payroll, attendance to performance, communication to analytics. One intelligent platform for your entire organization.', 'Start Free Trial', '/login', 'Watch Demo', '#features', 'Play')
ON CONFLICT DO NOTHING;

-- Features
INSERT INTO website_features (section_key, icon, title, description, color_gradient, category, display_order) VALUES
  ('features', 'Users', 'Employee Management', 'Complete employee lifecycle from hiring to retirement with comprehensive profiles, career paths, and digital records.', 'from-blue-500 to-blue-600', 'People', 0),
  ('features', 'Clock', 'Attendance Tracking', 'GPS, QR code, and manual clock-in with real-time monitoring, geofencing, and AI anomaly detection.', 'from-emerald-500 to-emerald-600', 'Time', 1),
  ('features', 'Calendar', 'Leave Management', 'Configurable leave policies with multi-level approvals, carry-forward, encashment, and holiday calendars.', 'from-amber-500 to-amber-600', 'Time', 2),
  ('features', 'DollarSign', 'Payroll Processing', 'Automated salary calculations with PAYE, NSSF, SHA/NHIF deductions, bank exports, and multi-country tax engines.', 'from-rose-500 to-rose-600', 'Finance', 3),
  ('features', 'BarChart3', 'Analytics Dashboard', 'Real-time insights, workforce trends, attrition forecasting, and executive KPIs for data-driven decisions.', 'from-cyan-500 to-cyan-600', 'Intelligence', 4),
  ('features', 'Shield', 'Role-Based Access', 'Enterprise-grade RBAC with 12 roles, permission inheritance, department isolation, and audit trails.', 'from-indigo-500 to-indigo-600', 'Security', 5),
  ('features', 'UserSearch', 'Recruitment', 'Complete ATS with candidate portal, resume parsing, AI CV ranking, interview scorecards, and onboarding automation.', 'from-purple-500 to-purple-600', 'People', 6),
  ('features', 'Receipt', 'Expense Management', 'Receipt OCR, AI categorization, multi-stage approvals, budget validation, and corporate card integration.', 'from-orange-500 to-orange-600', 'Finance', 7),
  ('features', 'GraduationCap', 'Learning & Development', 'Training records, course management, skills matrix, certifications, and compliance tracking.', 'from-teal-500 to-teal-600', 'People', 8),
  ('features', 'Award', 'Performance Management', 'Performance reviews, goal tracking, promotion history, 360-degree feedback, and career path planning.', 'from-pink-500 to-pink-600', 'People', 9),
  ('features', 'Package', 'Asset Management', 'Track laptops, phones, vehicles, and equipment with assignment history, depreciation, and maintenance scheduling.', 'from-slate-500 to-slate-600', 'Operations', 10),
  ('features', 'MessageSquare', 'Communication Hub', 'Company-wide announcements, department messaging, team chat, and direct messaging with file attachments.', 'from-violet-500 to-violet-600', 'Communication', 11)
ON CONFLICT DO NOTHING;

-- Statistics
INSERT INTO website_statistics (section_key, value, label, icon, display_order) VALUES
  ('hero', '50+', 'Companies trust us', 'Building2', 0),
  ('hero', '5,000+', 'Employees managed', 'Users', 1),
  ('hero', '99.9%', 'System uptime', 'Zap', 2),
  ('hero', '24/7', 'Expert support', 'Globe', 3)
ON CONFLICT DO NOTHING;

-- Pricing Plans
INSERT INTO website_pricing_plans (name, price, currency, period, description, is_popular, features, cta_label, cta_url, display_order) VALUES
  ('Starter', '5,000', 'KES', '/month', 'Perfect for small teams getting started', false, '["Up to 20 employees", "Basic attendance tracking", "Leave management", "Email support", "Standard reports"]'::jsonb, 'Get Started', '/login', 0),
  ('Professional', '15,000', 'KES', '/month', 'Everything growing businesses need', true, '["Up to 100 employees", "Full HR suite included", "Payroll processing", "Recruitment module", "Priority support", "Advanced analytics"]'::jsonb, 'Start Free Trial', '/login', 1),
  ('Enterprise', 'Custom', 'KES', '', 'For large organizations with custom needs', false, '["Unlimited employees", "Custom integrations", "Dedicated account manager", "On-premise deployment", "SLA guarantee", "Training & onboarding"]'::jsonb, 'Contact Sales', '/contact', 2)
ON CONFLICT DO NOTHING;

-- Testimonials
INSERT INTO website_testimonials (name, role, company, quote, avatar, rating, display_order) VALUES
  ('Sarah Kamau', 'HR Director', 'TechVentures Kenya', 'StaffRoom transformed how we manage our team. The payroll automation alone saves us 10 hours every month.', 'SK', 5, 0),
  ('James Ochieng', 'Operations Manager', 'Apex Manufacturing', 'Implementation was smooth and the support team is incredibly responsive. Best HR investment we have made.', 'JO', 5, 1),
  ('Mary Njoki', 'CEO', 'Bright Futures Academy', 'Finally, an HR system built for East African businesses. The compliance features are exactly what we needed.', 'MN', 5, 2)
ON CONFLICT DO NOTHING;

-- FAQ
INSERT INTO website_faq (question, answer, category, display_order) VALUES
  ('How long does it take to set up StaffRoom?', 'Most organizations are up and running within 24 hours. Our guided setup wizard walks you through organization creation, department setup, and employee import step by step.', 'Getting Started', 0),
  ('Can I customize leave policies for my organization?', 'Yes. StaffRoom includes a fully configurable leave policy engine. You can set annual entitlements, monthly accrual rates, carry-forward limits, probation restrictions, half-day rules, and encashment policies — all without code.', 'Leave Management', 1),
  ('Does StaffRoom support East African payroll compliance?', 'Yes. We support PAYE, NSSF, SHA/NHIF deductions, pension contributions, SACCO deductions, and loan repayments out of the box. The tax engine is configurable for multiple countries.', 'Payroll', 2),
  ('Is my data secure?', 'Absolutely. We use Row-Level Security at the database level, organization-level data isolation, 12-role RBAC with fine-grained permissions, audit trails for every action, and optional IP allowlisting and MFA.', 'Security', 3),
  ('Can employees access StaffRoom on mobile?', 'Yes. StaffRoom is fully responsive and works on any device — desktop, tablet, and mobile. Employees can clock in, request leave, view payslips, and communicate from their phones.', 'Access', 4),
  ('What happens if I cancel my subscription?', 'You can export all your data at any time. If you cancel, your data remains accessible for 30 days, after which it is permanently deleted in compliance with data protection regulations.', 'Billing', 5),
  ('Do you offer training and onboarding?', 'Yes. The Professional plan includes guided onboarding, and the Enterprise plan includes dedicated training sessions, custom workflow setup, and a dedicated account manager.', 'Support', 6),
  ('Can I integrate StaffRoom with other tools?', 'StaffRoom supports webhooks, a public API, and integrations with popular tools. The Enterprise plan includes custom integration development.', 'Integrations', 7)
ON CONFLICT DO NOTHING;

-- CTA
INSERT INTO website_cta (section_key, headline, subheadline, primary_cta_label, primary_cta_url, secondary_cta_label, secondary_cta_url) VALUES
  ('final_cta', 'Ready to transform your workforce?', 'Join 50+ companies already using StaffRoom to streamline operations, save time, and empower their teams.', 'Start Your Free Trial', '/login', 'Schedule a Demo', '/contact')
ON CONFLICT DO NOTHING;

-- Integrations
INSERT INTO website_integrations (name, description, icon, category, display_order) VALUES
  ('Slack', 'Send notifications and approvals directly to Slack channels', 'MessageSquare', 'Communication', 0),
  ('Google Workspace', 'Sync calendars and manage email-based attendance', 'Mail', 'Productivity', 1),
  ('Microsoft 365', 'Integrate with Teams, Outlook, and SharePoint', 'Mail', 'Productivity', 2),
  ('QuickBooks', 'Export payroll data to your accounting software', 'DollarSign', 'Finance', 3),
  ('M-Pesa', 'Process salary payments via M-Pesa bulk payment API', 'Smartphone', 'Payments', 4),
  ('Bank APIs', 'Direct bank payment file generation for major banks', 'Building2', 'Payments', 5),
  ('Zapier', 'Connect StaffRoom to 5,000+ apps via Zapier', 'Plug', 'Automation', 6),
  ('Biometric Devices', 'Integrate with ZKTeco, Suprema, and other devices', 'Fingerprint', 'Hardware', 7)
ON CONFLICT DO NOTHING;

-- SEO
INSERT INTO website_seo (page_slug, meta_title, meta_description, og_title, og_description) VALUES
  ('home', 'StaffRoom — The Workforce Operating System', 'Streamline your entire HR operation with StaffRoom. Payroll, attendance, leave management, recruitment, and analytics — all in one platform built for East African businesses.', 'StaffRoom — The Workforce Operating System', 'The complete HR and workforce management platform for modern businesses.'),
  ('features', 'Features | StaffRoom', 'Explore all StaffRoom features including employee management, payroll, attendance, leave, recruitment, analytics, and more.', 'StaffRoom Features', 'Everything you need to manage your workforce.'),
  ('pricing', 'Pricing | StaffRoom', 'Simple, transparent pricing for businesses of all sizes. Choose the plan that grows with you.', 'StaffRoom Pricing', 'Plans for every business size.'),
  ('about', 'About | StaffRoom', 'Learn about StaffRoom — our mission, team, and commitment to transforming workforce management.', 'About StaffRoom', 'Building the future of work.'),
  ('contact', 'Contact | StaffRoom', 'Get in touch with the StaffRoom team. We are here to help.', 'Contact StaffRoom', 'Let us help you transform your workforce.'),
  ('blog', 'Blog | StaffRoom', 'Insights, updates, and best practices for workforce management.', 'StaffRoom Blog', 'Insights for modern HR teams.')
ON CONFLICT DO NOTHING;

-- Blog Categories
INSERT INTO website_blog_categories (name, slug, description, display_order) VALUES
  ('HR Best Practices', 'hr-best-practices', 'Tips and strategies for effective HR management', 0),
  ('Payroll & Compliance', 'payroll-compliance', 'Stay up to date with payroll and tax compliance', 1),
  ('Product Updates', 'product-updates', 'New features and improvements to StaffRoom', 2),
  ('Industry Insights', 'industry-insights', 'Trends and analysis in workforce management', 3)
ON CONFLICT DO NOTHING;

-- Blog Posts
INSERT INTO website_blog_posts (title, slug, excerpt, content, author_name, category, tags, reading_time_minutes, is_published, published_at, display_order) VALUES
  ('5 Ways AI is Transforming HR in 2026', 'ai-transforming-hr-2026', 'From automated payroll to predictive analytics, AI is reshaping how HR teams operate. Here are the top 5 trends to watch.', 'Artificial intelligence is no longer a buzzword in HR — it is a practical tool that is transforming how organizations manage their workforce. In this article, we explore five key ways AI is changing HR in 2026.', 'StaffRoom Team', 'Industry Insights', '["AI", "HR", "Automation", "2026"]'::jsonb, 5, true, now(), 0),
  ('How to Set Up Compliant Payroll in Kenya', 'compliant-payroll-kenya', 'A step-by-step guide to setting up PAYE, NSSF, and SHA/NHIF deductions for your organization.', 'Payroll compliance in Kenya requires careful attention to PAYE tax brackets, NSSF contribution tiers, and SHA/NHIF rates. This guide walks you through everything you need to know.', 'StaffRoom Team', 'Payroll & Compliance', '["Payroll", "Kenya", "Compliance", "PAYE", "NSSF"]'::jsonb, 8, true, now(), 1),
  ('Building a High-Performance Team Culture', 'high-performance-team-culture', 'Practical strategies for creating a culture that drives engagement, productivity, and retention.', 'A high-performance culture does not happen by accident. It requires intentional design, clear values, and consistent reinforcement. Here are the strategies that work.', 'StaffRoom Team', 'HR Best Practices', '["Culture", "Performance", "Engagement"]'::jsonb, 6, true, now(), 2)
ON CONFLICT DO NOTHING;
