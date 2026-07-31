# STAFFROOM ENTERPRISE DESIGN SYSTEM (PHASE 2 FOUNDATION)

## Overview & Design Philosophy
STAFFROOM Enterprise Design System is a single source of truth for visual tokens, UI primitives, and application components. Inspired by Linear, Stripe Dashboard, Notion, Atlassian, and Microsoft 365, the system balances dense enterprise data presentation with clean typography, calm surfaces, subtle elevations, and WCAG AA accessibility.

---

## 1. Design Token Structure

### Color System (Semantic Tokens)
- **Primary**: Indigo (`#4f46e5`, hover `#4338ca`, subtle `#eef2ff`). Primary actions, active navigation tabs, interactive focus rings.
- **Secondary**: Slate (`#0f172a`, hover `#1e293b`, subtle `#f1f5f9`). Dark headers, primary neutral text, solid neutral buttons.
- **Success**: Emerald (`#10b981`, hover `#059669`, subtle `#ecfdf5`). Paid payrolls, active statuses, positive performance reviews, completion badges.
- **Warning**: Amber (`#f59e0b`, hover `#d97706`, subtle `#fffbeb`). Pending approvals, draft payrolls, expiring certifications.
- **Danger / Destructive**: Rose (`#f43f5e`, hover `#e11d48`, subtle `#fff1f2`). Terminations, deletions, compliance errors, failed transactions.
- **Information**: Sky (`#0284c7`, hover `#0369a1`, subtle `#f0f9ff`). Informational toasts, remote work tags, system status banners.
- **Neutrals**: Slate 50-950 scale (`#f8fafc` to `#020617`).
- **Focus Ring**: `ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900`.

### Typography Scale
- **Display**: 30px - 36px / Black / `tracking-tight` (Executive stats, hero banners).
- **Heading 1**: 24px / Extrabold / `tracking-tight` (Page titles).
- **Heading 2**: 20px / Bold / `tracking-tight` (Card titles, section headers).
- **Heading 3**: 18px / Bold (Sub-section headings).
- **Heading 4**: 16px / Bold (Modal titles, drawer headers).
- **Heading 5**: 14px / Bold (List item titles, table column headers).
- **Heading 6**: 12px / Bold / `uppercase tracking-wider` (Metric labels, table column titles).
- **Body Large**: 16px / Normal / `leading-relaxed` (Bio, executive summaries).
- **Body**: 14px / Normal / `leading-normal` (Standard UI body text, notes).
- **Small**: 12px / Medium / `leading-normal` (Secondary metadata, badge labels).
- **Caption**: 11px / Medium / `leading-tight` (Timestamp labels, serial numbers).
- **Button / Nav / Table**: 12px / Bold / `tracking-wide`.

### Spacing Tokens
- **xs**: 4px (`gap-1`, `p-1`)
- **sm**: 8px (`gap-2`, `p-2`)
- **md**: 12px (`gap-3`, `p-3`)
- **base**: 16px (`gap-4`, `p-4`)
- **lg**: 20px (`gap-5`, `p-5`)
- **xl**: 24px (`gap-6`, `p-6`)
- **2xl**: 32px (`gap-8`, `p-8`)
- **3xl**: 40px (`gap-10`, `p-10`)
- **4xl**: 48px (`gap-12`, `p-12`)
- **5xl**: 64px (`gap-16`, `p-16`)
- **6xl**: 80px (`gap-20`, `p-20`)
- **7xl**: 96px (`gap-24`, `p-24`)

### Border Radius Tokens
- **Small (`rounded-lg`)**: 6px (Badges, small icon buttons).
- **Medium (`rounded-xl`)**: 12px (Input fields, standard buttons, dropdown menus).
- **Large (`rounded-2xl`)**: 16px (Cards, table containers, popover dialogs).
- **Extra Large (`rounded-3xl`)**: 24px (Executive KPI cards, primary workspace containers).
- **Pill (`rounded-full`)**: 9999px (Avatars, status pills, filter chips).

### Elevation & Shadow Levels
- **Level 0 (`shadow-none`)**: Flat layouts, nested lists.
- **Level 1 (`shadow-xs`)**: Standard cards, table rows on hover.
- **Level 2 (`shadow-sm`)**: Primary interactive buttons, inputs.
- **Level 3 (`shadow-md`)**: Floating action menus, popovers.
- **Level 4 (`shadow-xl`)**: Executive modal dialogs, slide-over drawers.

### Motion Tokens
- **Fast (`150ms ease-in-out`)**: Button press states, checkbox toggles, hover color shifts.
- **Normal (`200ms cubic-bezier(0.16, 1, 0.3, 1)`)**: Dropdowns, tab switches, card elevation changes.
- **Slow (`300ms cubic-bezier(0.16, 1, 0.3, 1)`)**: Modal open/close, drawer slide-ins, accordions.

---

## 2. Component Inventory

| Component Family | Variants / Sub-components | Primary Token Usage |
| :--- | :--- | :--- |
| **Buttons** | Primary, Secondary, Ghost, Outline, Danger, Success, Icon, Split, Loading | `RADIUS.md`, `TYPOGRAPHY.button`, `COLORS.primary` |
| **Inputs** | Text, Email, Phone, Search, Select, Date, Checkbox, Radio, Switch, FileUpload | `RADIUS.md`, `COLORS.focusRing`, `TYPOGRAPHY.small` |
| **Cards** | Dashboard Card, Metric Card (`StatCard`), Profile Card, Info Card, Action Card | `RADIUS.xl`, `SHADOWS.card`, `COLORS.neutral` |
| **Tables** | `DataTable`, `Table`, Sticky Header, Sorting, Filtering, Density, Pagination, Export | `RADIUS.2xl`, `TYPOGRAPHY.table`, `COLORS.border` |
| **Modals** | `Modal`, `Dialog`, `ConfirmDialog`, `Drawer`, `Sheet` | `RADIUS.2xl`, `SHADOWS.dialog`, Backdrop blur |
| **Badges** | `StatusBadge`, `Badge` (Active, On Leave, Paid, Pending, Terminated, Dept, Role) | `RADIUS.pill`, `TYPOGRAPHY.caption` |
| **Alerts & Toasts** | `Alert`, `Toast`, `Sonner`, Inline Alerts | `RADIUS.2xl`, Functional colors |
| **Empty & Loading** | `EmptyState`, `Spinner`, `SkeletonCard`, `SkeletonRow`, `SkeletonTable` | Animated shimmer, `COLORS.neutral` |

---

## 3. Accessibility Report (WCAG AA Compliance)
- **Contrast Ratio**: All body text achieves >= 4.5:1 contrast against light (`#ffffff`, `#f8fafc`) and dark (`#0f172a`, `#020617`) backgrounds.
- **Keyboard Navigation**: Standard focus rings (`focus:ring-2 focus:ring-indigo-500 focus:outline-none`) implemented on all buttons, inputs, tabs, and interactive table rows.
- **Screen Reader Support**: ARIA attributes applied to dialogs (`role="dialog"`), modal backdrops (`aria-modal="true"`), icons (`aria-hidden="true"`), and status indicators.

---

## 4. Responsive Audit
- **Desktop / Ultra-Wide (1280px - 1920px+)**: Multi-column executive dashboard grids, sticky table headers, side-by-side profile tabs.
- **Laptop / Tablet (768px - 1024px)**: 2-column KPI grids, responsive navigation tabs with horizontal scrollbars, responsive drawers.
- **Mobile (320px - 640px)**: 1-column layout, touch target size >= 44px, full-screen slide-over modals, collapsable table cards.

---

## 5. Styling Cleanup & Migration Summary
- Replaced hardcoded inline colors with semantic Tailwind classes and design tokens.
- Standardized border radii on cards (`rounded-3xl`), inputs/buttons (`rounded-xl` / `rounded-2xl`), and badges (`rounded-full`).
- Re-exported token structure in `src/packages/ui/tokens.js` and `src/packages/ui/index.js` for modular consumption across Phase 2 and future enterprise expansion.
