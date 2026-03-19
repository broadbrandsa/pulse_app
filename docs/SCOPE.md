# PulseApp — Scope

## Target User
Solo personal trainer managing their own client base. No multi-staff, no multi-location.

## Pages (App Routes — authenticated mock)
- `/dashboard` — KPI overview, schedule, quick actions
- `/calendar` — Day/week view scheduling
- `/clients` — Client list with search, filter, sort
- `/clients/[id]` — Client profile (Overview, Sessions, Payments, Progress, Notes, Forms, Programme, Documents)
- `/messages` — In-app messaging with clients
- `/pos` — Payments / POS checkout
- `/store` — E-commerce store management (Products, Orders, Settings)
- `/programmes` — Workout programme management
- `/programmes/[id]` — Programme detail with week/day breakdown
- `/programmes/library` — Exercise library (50+ exercises)
- `/nutrition` — Nutrition plan management
- `/forms` — Digital intake forms and waivers
- `/loyalty` — Loyalty programme with referral tracking
- `/reports` — Revenue, member metrics, attendance
- `/profile` — PT profile, reviews, business settings, reminders
- `/notifications` — Notification centre

## Public Routes (no auth)
- `/book/[username]` — Client-facing booking page
- `/store/[username]` — Public storefront with shopping cart

## Excluded
- Auth/login screens
- Marketing/landing pages
- Real backend / API calls
- Actual payment processing

## Data
- All data is static mock data from `src/lib/mock-data.ts`
- No backend, no API calls, no database
- All interactivity is client-side state only

## Mobile-First
- Optimised for 375-430px screens (iPhone 14/15)
- Bottom navigation on mobile, sidebar on desktop (>=1024px)
- Bottom sheets replace modals on mobile
- All tap targets >=44px
