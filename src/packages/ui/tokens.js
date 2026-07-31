/**
 * STAFFROOM ENTERPRISE DESIGN SYSTEM TOKENS
 * Single Source of Truth for Colors, Typography, Spacing, Radius, Elevation & Motion
 */

export const COLORS = {
  primary: {
    DEFAULT: "#4f46e5", // Indigo-600 (Microsoft 365 / Linear Inspired)
    hover: "#4338ca",   // Indigo-700
    light: "#e0e7ff",   // Indigo-100
    subtle: "#eef2ff",  // Indigo-50
  },
  secondary: {
    DEFAULT: "#0f172a", // Slate-900
    hover: "#1e293b",   // Slate-800
    light: "#f1f5f9",   // Slate-100
  },
  success: {
    DEFAULT: "#10b981", // Emerald-500
    hover: "#059669",   // Emerald-600
    light: "#d1fae5",   // Emerald-100
    subtle: "#ecfdf5",  // Emerald-50
  },
  warning: {
    DEFAULT: "#f59e0b", // Amber-500
    hover: "#d97706",   // Amber-600
    light: "#fef3c7",   // Amber-100
    subtle: "#fffbeb",  // Amber-50
  },
  danger: {
    DEFAULT: "#f43f5e", // Rose-500
    hover: "#e11d48",   // Rose-600
    light: "#ffe4e6",   // Rose-100
    subtle: "#fff1f2",  // Rose-50
  },
  info: {
    DEFAULT: "#0284c7", // Sky-600
    hover: "#0369a1",   // Sky-700
    light: "#e0f2fe",   // Sky-100
    subtle: "#f0f9ff",  // Sky-50
  },
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  focusRing: "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900",
};

export const TYPOGRAPHY = {
  display: "text-3xl sm:text-4xl font-black tracking-tight",
  h1: "text-2xl font-extrabold tracking-tight",
  h2: "text-xl font-bold tracking-tight",
  h3: "text-lg font-bold",
  h4: "text-base font-bold",
  h5: "text-sm font-bold",
  h6: "text-xs font-bold uppercase tracking-wider",
  bodyLarge: "text-base font-normal leading-relaxed",
  body: "text-sm font-normal leading-normal",
  small: "text-xs font-medium leading-normal",
  caption: "text-[11px] font-medium leading-tight text-slate-500 dark:text-slate-400",
  label: "text-xs font-semibold text-slate-700 dark:text-slate-300",
  button: "text-xs font-bold tracking-wide",
  table: "text-xs font-semibold",
  nav: "text-xs font-bold tracking-wide",
};

export const SPACING = {
  xs: "4px",   // 1
  sm: "8px",   // 2
  md: "12px",  // 3
  base: "16px",// 4
  lg: "20px",  // 5
  xl: "24px",  // 6
  "2xl": "32px", // 8
  "3xl": "40px", // 10
  "4xl": "48px", // 12
  "5xl": "64px", // 16
  "6xl": "80px", // 20
  "7xl": "96px", // 24
};

export const RADIUS = {
  sm: "rounded-lg",      // 6px
  md: "rounded-xl",      // 12px
  lg: "rounded-2xl",     // 16px
  xl: "rounded-3xl",     // 24px
  pill: "rounded-full",  // 9999px
};

export const SHADOWS = {
  level0: "shadow-none",
  level1: "shadow-xs",
  level2: "shadow-sm",
  level3: "shadow-md",
  level4: "shadow-xl",
  card: "shadow-xs hover:shadow-md transition-shadow duration-200",
  dialog: "shadow-2xl border border-slate-100 dark:border-slate-800",
};

export const MOTION = {
  fast: "transition-all duration-150 ease-in-out",
  normal: "transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1)",
  slow: "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
};

export const DESIGN_TOKENS = {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  MOTION,
};

export default DESIGN_TOKENS;
