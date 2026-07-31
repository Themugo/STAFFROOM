# STAFFROOM Enterprise Architecture Documentation (Phase 1)

## Executive Summary
STAFFROOM is a high-performance Human Resource Management System (HRMS) built on a consolidated React 18 + Vite foundation, utilizing Tailwind CSS, Lucide icons, and Recharts for enterprise data visualization.

---

## Workspace Structure & Module Boundaries

```
src/
├── api/                   # Centralized API client abstractions & Base44 ORM mapping
│   ├── base44Client.js    # Primary entity client wrapper with error handling & fallback
│   └── mockData.js        # Seed mock data generator & initial entity state
├── components/            # Visual presentation layer & domain components
│   ├── dashboard/         # Command Center KPI metrics & payroll analysis
│   ├── staff/             # Unified Employee Profile, Modals & Onboarding
│   ├── ui/                # Shared enterprise UI components (Badges, Headers, Modals)
│   └── website/           # Marketing & Public Portal views
├── contexts/              # Global state providers (Auth, Theme, Toast, Org)
├── hooks/                 # Custom reactive state hooks
├── lib/                   # Utility libraries, export engines & audit loggers
├── packages/              # Micro-package architecture for modular domain engines
│   ├── core/              # Domain calculation algorithms (leave, payroll, document security)
│   └── services/          # Business logic service abstractions
├── pages/                 # Route entry pages (Dashboard, EmployeeProfile, Payroll, Staff, etc.)
├── services/              # Dedicated microservice handlers
├── types/                 # Centralized TypeScript interface definitions
└── utils/                 # Utility helpers and domain calculation functions
```

---

## Architectural Principles & Standards

### 1. Unified Employee Profile Workspace
- **360° Employee State**: All employee data views (Bio, Documents, Assigned Hardware Assets, Leave History, Payroll Statements, Certifications, Emergency Contacts, Performance Reviews) are organized under a single profile route (`/EmployeeProfile?id=XYZ`).
- **Deep Linking**: Seamless URL query parameter resolution allows deep linking into specific employee workspaces from the Staff Directory or Command Center.

### 2. Error Handling & Resilience Layer
- **Graceful Degradation**: Real-time entities utilize fallback state handlers for network or database interruptions.
- **Audit Tracking**: Modifications to employee records or payroll states produce formatted audit trails.

### 3. State Management & API Design
- **Single Source of Truth**: Data access is routed through `base44.entities.<EntityName>` with typed schemas.
- **Lazy Initialization**: External clients and service SDKs execute lazily upon first invocation.
