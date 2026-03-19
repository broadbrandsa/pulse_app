# PulseApp — Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (Rubik font, dark mode)
│   ├── page.tsx                # Redirects to /dashboard
│   ├── not-found.tsx           # 404 page
│   ├── book/                   # Public booking flow
│   │   ├── page.tsx            # Redirects to demo booking
│   │   └── [username]/page.tsx # Multi-step booking form
│   ├── store/                  # Public storefront
│   │   └── [username]/page.tsx # Shopping cart + checkout
│   └── (app)/                  # Authenticated app routes
│       ├── layout.tsx          # Shared sidebar + topbar layout
│       ├── page.tsx            # Redirects to /dashboard
│       ├── dashboard/page.tsx
│       ├── calendar/page.tsx
│       ├── clients/page.tsx
│       ├── clients/[id]/page.tsx
│       ├── messages/page.tsx
│       ├── pos/page.tsx
│       ├── store/page.tsx
│       ├── programmes/page.tsx
│       ├── programmes/[id]/page.tsx
│       ├── programmes/library/page.tsx
│       ├── nutrition/page.tsx
│       ├── forms/page.tsx
│       ├── loyalty/page.tsx
│       ├── reports/page.tsx
│       ├── profile/page.tsx
│       └── notifications/page.tsx
├── components/
│   ├── layout/                 # App shell components
│   │   ├── app-layout.tsx
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── bottom-nav.tsx
│   │   └── bottom-sheet.tsx
│   ├── ui/                     # Shared reusable UI
│   │   ├── stat-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── initials-avatar.tsx
│   │   ├── data-table.tsx
│   │   ├── empty-state.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── modal.tsx
│   │   └── page-header.tsx
│   ├── application/            # Complex UI patterns (Untitled UI)
│   ├── base/                   # Core UI components (Untitled UI)
│   ├── foundations/            # Design tokens (Untitled UI)
│   └── shared-assets/         # Illustrations, patterns
├── lib/
│   ├── mock-data.ts           # All mock data
│   ├── types.ts               # TypeScript interfaces
│   └── utils.ts               # Utility functions
├── hooks/                     # Custom React hooks
├── providers/                 # React context providers
├── styles/                    # Global CSS, theme, typography
└── utils/                     # Utility functions (cx, etc.)
```
