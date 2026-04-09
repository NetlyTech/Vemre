# Vemre Project Memory

## Stack
Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI, TanStack Query, Axios, React Hook Form + Zod

## Folder Structure
```
app/
  (website)/          # Public website — has Navbar + Footer layout
    page.tsx          → /
    contact/          → /contact
    privacy/          → /privacy
    terms/            → /terms
    layout.tsx
  admin/
    login/            → /admin/login (no sidenav, redirects if already authed)
    (platform)/       # Admin platform — has AdminSidenav layout + auth check
      dashboard/      → /admin/dashboard
      users/          → /admin/users  (User Management)
      kyc/            → /admin/kyc    (KYC Review — NEW)
      requests/       → /admin/requests
      transactions/   → /admin/transactions (international admin only)
      fx/             → /admin/fx (international admin only)
      export/         → /admin/export (Export Data — NEW)
      admins/         → /admin/admins (international admin only)
      settings/       → /admin/settings
      layout.tsx
  api/contact/        → /api/contact
  layout.tsx          # Root layout — no Navbar/Footer, just QueryClientWrapper
```

## Auth
- Login endpoint: POST /api/admin/login
- Response: `{ token, admin: { _id, email, fullname, role: "international"|"local", isActive } }`
- Stored in localStorage: `accessToken`, `adminRole`, `adminName`
- Cookie: `auth=authenticated` (max-age 86400)
- Two admin roles: `international` (full access) | `local` (no transactions/fx/admins)

## Theme
- Primary color: `hsl(145 35% 16%)` — dark forest green `#1B3828`
- Set in `app/globals.css` via `--primary` and `--ring` CSS variables
- Sidebar background: hardcoded `bg-[#1B3828]` in AdminSidenav

## Reusable Admin Components (`components/admin/`)
- `StatCard.tsx` — metric card with label, value, subtext, icon, colored accent bottom bar
- `StatusBadge.tsx` — colored pill: active/approved/completed=green, pending=amber, processing=blue, suspended/failed/rejected=red
- `UserAvatar.tsx` — initials avatar with deterministic color from name hash
- `AdminSidenav.tsx` — dark green sidebar, MAIN nav (Dashboard, Users, KYC Review, Transactions, FX Rates, Export Data) + SYSTEM (Settings)
- `NotificationBell.tsx` — bell icon with red unread-count badge, dropdown with up to 20 notifications (relative timestamps), "Mark all read" button, click-outside dismiss

## Key Files
- `lib/auth.type.ts` — Zod schemas; userSchema has admin.fullname (not name)
- `middleware.ts` — Protects /admin/* routes, redirects to /admin/login
- `requestapi/axiosinstance.ts` — Axios with Bearer token from localStorage
- `requestapi/queries/userQueries.ts` — useAlTransactions, useAllKycs, setKycStatus, useBulkPayout
- `requestapi/queries/adminQueries.ts` — useCurrentFxRate, usePayoutPreflight(enabled), useAdminNotifications, useMarkNotificationsRead, useDeletedUsers
- `requestapi/queries/fxQueries.ts` — useCurrentRate, useRateHistory, useUpdateRate

## Payout Preflight Pattern
The bulk payout dialog uses an `enabled` flag to control when the preflight query fires:
```ts
const [preflightEnabled, setPreflightEnabled] = useState(false)
const { data: preflight, isLoading: preflightLoading } = usePayoutPreflight(preflightEnabled)

// Open dialog:
setBulkPayoutOpen(true); setPreflightEnabled(true)

// Close dialog:
setBulkPayoutOpen(false); setPreflightEnabled(false)
```
`usePayoutPreflight` uses `staleTime: 0` and `gcTime: 0` so it always fetches fresh data when enabled.
The Confirm button is disabled while `preflightLoading` or when `preflight?.blocked` is true.

## Sidenav Items (new design)
MAIN: Dashboard, Users, KYC Review, Transactions (intl), FX Rates (intl), Export Data
SYSTEM: Settings
Bottom: Admin avatar + name + role + Logout
