# Return App — Project Guide

> **Last Updated:** February 2026
> **Version:** 1.0.0
> **Status:** Active Development (Early Stage)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Folder & File Structure](#4-folder--file-structure)
5. [Navigation System](#5-navigation-system)
6. [UI & Design System](#6-ui--design-system)
7. [Screen Specifications](#7-screen-specifications)
8. [Component System](#8-component-system)
9. [State Management](#9-state-management)
10. [Database & Models](#10-database--models)
11. [API / Backend Contracts](#11-api--backend-contracts)
12. [Environment Variables](#12-environment-variables)
13. [Scripts & Commands](#13-scripts--commands)
14. [Testing Strategy](#14-testing-strategy)
15. [CI/CD Overview](#15-cicd-overview)
16. [Security & Performance Notes](#16-security--performance-notes)
17. [Onboarding Guide](#17-onboarding-guide-for-new-developer)
18. [Immediate TODOs](#18-immediate-todos)
19. [Quick Start](#19-quick-start-copy-paste-section)

---

# 1. Project Overview

- **App Name:** Return App
- **Short Description:** A screen-time management and focus-routine builder for mobile. Users set daily focus blocks (Work, Study, Meditation), track screen time, and build healthy digital habits through a cute, cartoonistic, professional UI.
- **Target Users:** Young adults (primarily female audience, ages 15–30) who want to take control of their screen time and build productive routines.
- **Core Problem:** Excessive screen time and lack of structured focus routines. Existing tools are either too clinical or too complex. Return App makes routine-building feel approachable, fun, and rewarding.
- **Key Features:**
  - 3-step onboarding flow collecting screen time, age, and focus preferences
  - Local authentication (email/password) with SecureStore — designed for easy backend swap
  - Home dashboard with screen time stats, focus score, weekly calendar strip
  - "Upcoming" routine list (Work Hours, Study Session, Weekend Zen)
  - "More Ideas" horizontal carousel with pre-built routine templates
  - Bottom sheet for adding custom focus blocks (name, start time, repeat cycle)
  - Bottom sheet for configuring pre-built routine templates
  - Local SQLite database (Drizzle ORM) for persistent settings
  - Flat, cartoonistic illustration system with custom SVG icons

---

# 2. Tech Stack

| Technology | Version | Role |
|---|---|---|
| **Expo** | ~54.0 | Universal app framework (iOS, Android, Web) |
| **Expo Router** | ~6.0 | File-based navigation (Stack navigator) |
| **React Native** | 0.81.5 | Cross-platform UI framework |
| **React** | 19.1.0 | UI rendering engine |
| **TypeScript** | ~5.9 | Type safety across the entire codebase |
| **NativeWind** | 4.2 | Tailwind CSS for React Native |
| **Tailwind CSS** | 3.4 | Utility-first CSS design system |
| **Zustand** | 5.0 | Lightweight global state management |
| **Drizzle ORM** | 0.45 | Type-safe SQLite ORM |
| **Expo SQLite** | ~16.0 | Local SQLite database engine |
| **Expo SecureStore** | ~15.0 | Encrypted key-value storage (auth tokens, credentials) |
| **React Native Reanimated** | ~4.1 | High-performance animations (bottom sheets) |
| **React Native Gesture Handler** | ~2.28 | Touch gesture system (pan, swipe) |
| **React Native SVG** | 15.12 | SVG rendering for icons and illustrations |
| **react-native-svg-transformer** | 1.5 | Import `.svg` files as React components |
| **DM Sans** (Google Fonts) | — | Primary typeface (100–900 weights) |
| **ESLint** | 9.x | Code linting (Expo flat config) |
| **Prettier** | — | Code formatting (via `prettier-plugin-tailwindcss`) |
| **Expo Haptics** | ~15.0 | Tactile feedback (available, not yet used) |
| **Expo Image** | ~3.0 | Optimized image component (available) |
| **Expo Linear Gradient** | ~15.0 | Gradient backgrounds (available) |

---

# 3. Architecture Overview

## High-Level System Structure

```
┌─────────────────────────────────────────────────────────┐
│                    EXPO ROUTER (Stack)                   │
│  ┌─────────┐  ┌──────────┐  ┌───────┐  ┌────────────┐  │
│  │  index   │→│(onboarding)│→│(auth) │→│   (app)    │  │
│  │EntryGate│  │ 3 steps  │  │sign-in│  │ HomeScreen │  │
│  └─────────┘  │          │  │sign-up│  │            │  │
│               │          │  │forgot │  │            │  │
│               └──────────┘  └───────┘  └────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    STATE (Zustand)                       │
│  useAuthStore: user, isAuthenticated, isOnboarded,      │
│                isReady, signIn, signUp, signOut          │
├─────────────────────────────────────────────────────────┤
│                  SERVICES LAYER                         │
│  auth.ts: signIn, signUp, signOut, getSession,          │
│           resetPassword (SecureStore-backed)             │
├─────────────────────────────────────────────────────────┤
│               PERSISTENCE LAYER                         │
│  ┌──────────────────┐  ┌────────────────────┐           │
│  │  Expo SecureStore │  │  SQLite (Drizzle)  │           │
│  │  (credentials,    │  │  (settings,        │           │
│  │   sessions)       │  │   onboarding_resp) │           │
│  └──────────────────┘  └────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

1. **App Launch** → `_layout.tsx` loads fonts, renders `AuthProvider`
2. **AuthProvider** → calls `useAuthStore.initialize()` → reads SQLite for `has_onboarded`, reads SecureStore for session
3. **EntryGate** (`app/index.tsx`) → redirects based on `isOnboarded` and `isAuthenticated`
4. **User Action** (e.g., sign in) → Screen calls `useAuthStore.signIn()` → calls `authService.signIn()` → validates against SecureStore → updates Zustand state → router navigates
5. **Settings Persistence** → Zustand actions write to SQLite via Drizzle (`settings` table)

## Subsystems

| Subsystem | Location | Purpose |
|---|---|---|
| **UI Layer** | `src/components/`, `app/` screens | All visual components and screens |
| **Navigation** | `app/` directory (file-based) | Expo Router Stack navigators |
| **State** | `src/stores/auth-store.ts` | Zustand store for global auth state |
| **Data** | `src/db/` | Drizzle ORM + SQLite for local persistence |
| **Services** | `src/services/auth.ts` | Business logic layer (auth operations) |
| **Design Tokens** | `src/constants/colors.ts`, `tailwind.config.js` | Color system, typography, spacing |
| **Assets** | `assets/illustrations/`, `src/components/icons/` | SVG illustrations and icon components |

---

# 4. Folder & File Structure

```
return-app/
├── app/                          # Expo Router — file-based routes
│   ├── _layout.tsx               # Root layout: fonts, providers, Stack
│   ├── index.tsx                 # Entry gate: redirect logic
│   ├── (onboarding)/             # Onboarding flow (group)
│   │   ├── _layout.tsx           # Stack with slide_from_right
│   │   ├── index.tsx             # Step 1: Screen time question
│   │   ├── age.tsx               # Step 2: Age picker
│   │   └── focus-time.tsx        # Step 3: Focus time preference
│   ├── (auth)/                   # Auth flow (group)
│   │   ├── _layout.tsx           # Stack with slide_from_right
│   │   ├── sign-in.tsx           # Sign in screen
│   │   ├── sign-up.tsx           # Sign up screen
│   │   └── forgot-password.tsx   # Password reset screen
│   └── (app)/                    # Main app (group)
│       ├── _layout.tsx           # App Stack
│       └── index.tsx             # Home screen (dashboard)
├── src/                          # Application source code
│   ├── components/               # Reusable UI components
│   │   ├── BottomSheet.tsx        # Animated bottom sheet (Reanimated + Gesture)
│   │   ├── icons/                # Custom SVG icon components
│   │   │   ├── Icon.tsx           # Base IconShell wrapper
│   │   │   ├── ArrowLeft.tsx
│   │   │   ├── ArrowRight.tsx
│   │   │   ├── ChevronRight.tsx
│   │   │   ├── Meditate.tsx
│   │   │   ├── Minus.tsx
│   │   │   ├── Plus.tsx
│   │   │   ├── Study.tsx
│   │   │   └── Work.tsx
│   │   ├── illustrations/        # SVG illustration wrapper
│   │   │   └── Illustration.tsx   # Base IllustrationShell
│   │   ├── onboarding/           # Onboarding-specific components
│   │   │   ├── OnboardingShell.tsx # Shared shell (header, progress, footer)
│   │   │   ├── ProgressBar.tsx    # Step indicator dots
│   │   │   ├── SelectList.tsx     # Single-select option list
│   │   │   └── NumberPicker.tsx   # Increment/decrement picker
│   │   └── sheets/               # Bottom sheet content
│   │       ├── AddBlockSheet.tsx   # "Add block" form
│   │       └── RoutineDetailSheet.tsx # Pre-built routine config
│   ├── constants/                # App-wide constants
│   │   ├── colors.ts             # Color palette (mirrors Tailwind)
│   │   └── onboarding.ts         # Onboarding step definitions
│   ├── db/                       # Database layer
│   │   ├── index.ts              # Drizzle instance + SQLite connection
│   │   └── schema.ts             # Table definitions (settings, onboarding_responses)
│   ├── services/                 # Business logic
│   │   └── auth.ts               # Auth service (SecureStore-backed)
│   ├── stores/                   # Global state
│   │   └── auth-store.ts         # Zustand auth store
│   └── types/                    # TypeScript declarations
│       └── svg.d.ts              # SVG module declaration
├── providers/                    # React providers
│   └── AuthProvider.tsx          # Initializes auth + hides splash
├── assets/                       # Static assets
│   ├── illustrations/            # SVG illustrations (bookSet, dumbells, etc.)
│   ├── images/                   # App icons, splash, favicon
│   └── logo/                     # Brand logo SVG
├── app.json                      # Expo config (plugins, splash, icons)
├── babel.config.js               # Babel config (NativeWind preset)
├── drizzle.config.ts             # Drizzle Kit config
├── eslint.config.js              # ESLint flat config (Expo)
├── global.css                    # Tailwind directives (@tailwind base/components/utilities)
├── metro.config.js               # Metro bundler (NativeWind + SVG transformer)
├── tailwind.config.js            # Full color system + DM Sans font families
├── tsconfig.json                 # TypeScript config (strict, path alias @/*)
└── package.json                  # Dependencies + scripts
```

---

# 5. Navigation System

## Routing Engine

Expo Router with **file-based routing**. Every file in `app/` becomes a route. Parenthesized folders like `(onboarding)` are **route groups** — they create layout nesting without affecting the URL.

## Route Structure

| Route | File | Description |
|---|---|---|
| `/` | `app/index.tsx` | Entry gate — redirects based on auth/onboarding state |
| `/(onboarding)` | `app/(onboarding)/index.tsx` | Step 1: Screen time question |
| `/(onboarding)/age` | `app/(onboarding)/age.tsx` | Step 2: Age picker |
| `/(onboarding)/focus-time` | `app/(onboarding)/focus-time.tsx` | Step 3: Focus time preference |
| `/(auth)/sign-in` | `app/(auth)/sign-in.tsx` | Sign in form |
| `/(auth)/sign-up` | `app/(auth)/sign-up.tsx` | Sign up form |
| `/(auth)/forgot-password` | `app/(auth)/forgot-password.tsx` | Password reset |
| `/(app)` | `app/(app)/index.tsx` | Home screen (main dashboard) |

## Navigation Flow

```
App Launch
    │
    ▼
EntryGate (app/index.tsx)
    │
    ├── !isOnboarded ──→ (onboarding)/index → age → focus-time ──→ (auth)/sign-in
    │
    ├── !isAuthenticated ──→ (auth)/sign-in ←→ (auth)/sign-up
    │                                │
    │                                ├── Forgot password → (auth)/forgot-password
    │                                │
    │                                └── Success → (app)/
    │
    └── isAuthenticated ──→ (app)/ (Home Screen)
```

All navigators use `Stack` with `headerShown: false`. Onboarding and auth groups use `slide_from_right` animation. The root Stack uses `fade`.

---

# 6. UI & Design System

## Design Philosophy

**"Flat, cartoonistic, cute aesthetic — professional UI."** The app targets a female audience interested in self-improvement and screen time control. Think: soft pastels, rounded corners, playful SVG illustrations, and clean typography.

## Color System

The app uses a comprehensive Tailwind-compatible color palette defined in both `tailwind.config.js` and `src/constants/colors.ts` (they mirror each other).

**Primary Accent:** `sky` palette (blues)
**Secondary Accents:** `pink`, `amber`, `emerald`, `lime` (for stat cards and routine themes)
**Neutrals:** `slate` palette (for text, borders, backgrounds)

### Key Color Roles

| Role | Token | Hex |
|---|---|---|
| Primary action | `sky-400` / `sky-500` | `#00bcff` / `#00a6f4` |
| Primary text | `slate-800` | `#1d293d` |
| Secondary text | `slate-400` / `slate-500` | `#90a1b9` / `#62748e` |
| Page background | `slate-100` (app), `sky-100` (onboarding) | `#f1f5f9` / `#dff2fe` |
| Card background | `white` | `#ffffff` |
| Error | `red-50` bg / `red-600` text | `#fef2f2` / `#e7000b` |
| Success | `emerald-50` bg / `emerald-700` text | `#ecfdf5` / `#007a55` |

## Typography

**Font Family:** DM Sans (Google Fonts) — all 9 weights loaded (100–900).

```json
{
  "fontFamily": {
    "sans-thin": "DMSans_100Thin",
    "sans-extralight": "DMSans_200ExtraLight",
    "sans-light": "DMSans_300Light",
    "sans": "DMSans_400Regular",
    "sans-medium": "DMSans_500Medium",
    "sans-semibold": "DMSans_600SemiBold",
    "sans-bold": "DMSans_700Bold",
    "sans-extrabold": "DMSans_800ExtraBold",
    "sans-black": "DMSans_900Black"
  }
}
```

| Element | Classes |
|---|---|
| Screen title | `text-4xl font-medium tracking-tight text-slate-900` |
| Section heading | `text-xl font-bold text-slate-800` |
| Card title | `text-lg font-medium text-slate-700` |
| Body text | `text-base text-slate-600` |
| Caption / label | `text-sm font-medium text-slate-500` |
| Tag / badge | `text-xs font-semibold` |

## Spacing

Standard Tailwind spacing (4px base). Most common values:

| Token | Value | Usage |
|---|---|---|
| `px-7` | 28px | Screen horizontal padding (auth) |
| `px-6` | 24px | Screen horizontal padding (onboarding, sheets) |
| `px-4` / `p-4` | 16px | Card padding, input padding |
| `gap-3` | 12px | Card list gaps |
| `mb-6` | 24px | Section spacing |
| `rounded-2xl` | 16px | Cards, inputs, buttons |
| `rounded-3xl` | 24px | Large cards, routine items |
| `rounded-[30px]` | 30px | Stat cards, idea cards |
| `rounded-full` | 9999px | Avatars, circular buttons, day indicators |

## Radius & Shadows

| Element | Radius | Shadow |
|---|---|---|
| Stat cards | `rounded-[30px]` | None |
| Routine cards | `rounded-3xl` | None |
| Input fields | `rounded-xl` | None |
| Buttons (CTA) | `rounded-2xl` + `border-b-[5px]` | Faux-3D bottom border |
| Bottom sheet | `rounded-t-[32px]` | Backdrop overlay |
| Select list items | `rounded-2xl` | `shadow-md shadow-slate-400` |

### Design Token Example (JSON)

```json
{
  "colors": {
    "primary": { "light": "#dff2fe", "DEFAULT": "#00bcff", "dark": "#0069a8" },
    "background": { "main": "#f1f5f9", "card": "#ffffff", "onboarding": "#dff2fe" },
    "text": { "primary": "#1d293d", "secondary": "#90a1b9", "muted": "#62748e" },
    "accent": {
      "pink": "#fda5d5",
      "amber": "#ffd230",
      "emerald": "#5ee9b5",
      "lime": "#d8f999"
    },
    "semantic": {
      "error": { "bg": "#fef2f2", "text": "#e7000b" },
      "success": { "bg": "#ecfdf5", "text": "#007a55" }
    }
  },
  "typography": { "fontFamily": "DM Sans", "weights": [100, 200, 300, 400, 500, 600, 700, 800, 900] },
  "spacing": { "base": 4, "screenPadding": 16, "sectionGap": 24 },
  "radius": { "sm": 8, "md": 12, "lg": 16, "xl": 24, "xxl": 30, "full": 9999 }
}
```

---

# 7. Screen Specifications

## 7.1 Entry Gate (`app/index.tsx`)

- **Route:** `/`
- **Purpose:** Silent redirect based on auth/onboarding state
- **Components:** `ActivityIndicator` (loading only)
- **User Actions:** None (automatic redirect)
- **Edge States:** Loading spinner while `isReady === false`

## 7.2 Onboarding — Screen Time (`app/(onboarding)/index.tsx`)

- **Route:** `/(onboarding)`
- **Purpose:** Ask daily screen time usage
- **Components:** `OnboardingShell`, `SelectList`
- **User Actions:** Select one option, tap Continue, or Skip
- **Edge States:** Continue disabled until selection made

## 7.3 Onboarding — Age (`app/(onboarding)/age.tsx`)

- **Route:** `/(onboarding)/age`
- **Purpose:** Collect user age
- **Components:** `OnboardingShell`, `NumberPicker`
- **User Actions:** Increment/decrement age (10–80), Back, Continue, Skip
- **Edge States:** Always valid (default 17)

## 7.4 Onboarding — Focus Time (`app/(onboarding)/focus-time.tsx`)

- **Route:** `/(onboarding)/focus-time`
- **Purpose:** Select preferred focus time window
- **Components:** `OnboardingShell`, `SelectList`
- **User Actions:** Select option, Continue (marks onboarded, redirects to sign-in)
- **Edge States:** Continue disabled until selection

## 7.5 Sign In (`app/(auth)/sign-in.tsx`)

- **Route:** `/(auth)/sign-in`
- **Purpose:** Email/password authentication
- **Components:** `TextInput` (email, password), error banner, CTA button
- **User Actions:** Enter credentials, sign in, navigate to sign-up or forgot-password
- **Edge States:** Loading spinner on button, inline error message, form validation

## 7.6 Sign Up (`app/(auth)/sign-up.tsx`)

- **Route:** `/(auth)/sign-up`
- **Purpose:** Create new account
- **Components:** `TextInput` (name, email, password, confirm), error banner, CTA
- **User Actions:** Fill form, create account (auto-signs in)
- **Edge States:** Validation (email format, 6+ char password, match confirm), loading, error

## 7.7 Forgot Password (`app/(auth)/forgot-password.tsx`)

- **Route:** `/(auth)/forgot-password`
- **Purpose:** Request password reset
- **Components:** Back button, email input, success/error banners
- **User Actions:** Enter email, send reset link
- **Edge States:** Success view ("Check your email"), error, loading. Currently a no-op for local auth.

## 7.8 Home Screen (`app/(app)/index.tsx`)

- **Route:** `/(app)`
- **Purpose:** Main dashboard — stats, routines, ideas
- **Components:** Week strip, stat cards (Screen Time, Focus Score), upcoming routine list, horizontal idea carousel, FAB ("Add block"), `BottomSheet` with `AddBlockSheet` / `RoutineDetailSheet`
- **User Actions:** View stats, tap routine → detail sheet, tap idea → config sheet, tap FAB → add block sheet
- **Edge States:** All data currently hardcoded (no loading/empty/error states yet)

---

# 8. Component System

## 8.1 BottomSheet

- **Path:** `src/components/BottomSheet.tsx`
- **Props:**
  ```typescript
  interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }
  ```
- **Usage:**
  ```tsx
  <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
    <AddBlockSheet onAdd={() => setShowSheet(false)} />
  </BottomSheet>
  ```
- **Notes:** Uses Reanimated for slide-up/down animation. Gesture Handler for swipe-to-dismiss. 62% screen height. Semi-transparent backdrop. Drag handle at top.

## 8.2 OnboardingShell

- **Path:** `src/components/onboarding/OnboardingShell.tsx`
- **Props:**
  ```typescript
  interface Props {
    step: number;
    totalSteps: number;
    question: string;
    canContinue: boolean;
    onContinue: () => void;
    showBack?: boolean;  // default: true
    onBack?: () => void;
    children: React.ReactNode;
  }
  ```
- **Notes:** Provides consistent onboarding layout: back button, progress bar, skip link, question heading, scrollable content area, and a "Continue" CTA with faux-3D button style.

## 8.3 SelectList

- **Path:** `src/components/onboarding/SelectList.tsx`
- **Props:**
  ```typescript
  interface Props {
    options: { label: string; subtitle?: string; value: string }[];
    selected: string | null;
    onSelect: (value: string) => void;
  }
  ```

## 8.4 NumberPicker

- **Path:** `src/components/onboarding/NumberPicker.tsx`
- **Props:**
  ```typescript
  interface Props {
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (value: number) => void;
  }
  ```

## 8.5 ProgressBar

- **Path:** `src/components/onboarding/ProgressBar.tsx`
- **Props:** `{ total: number; current: number }`

## 8.6 AddBlockSheet

- **Path:** `src/components/sheets/AddBlockSheet.tsx`
- **Props:** `{ onAdd: () => void }`
- **Notes:** Form with block name input, time picker (hour/minute/AM-PM), weekday repeat cycle selector.

## 8.7 RoutineDetailSheet

- **Path:** `src/components/sheets/RoutineDetailSheet.tsx`
- **Props:** `{ idea: IdeaConfig; onClose: () => void }`
- **Notes:** Shows illustration, routine title, time picker, repeat cycle. Colors are themed per-idea.

## 8.8 Icon System

- **Base:** `src/components/icons/Icon.tsx` — `IconShell` wrapper with `IconProps { size?: number; color?: string }`
- **Icons:** `ArrowLeft`, `ArrowRight`, `ChevronRight`, `Meditate`, `Minus`, `Plus`, `Study`, `Work`
- **Usage:** `<ArrowLeft size={20} color={colors.slate[600]} />`

## 8.9 IllustrationShell

- **Path:** `src/components/illustrations/Illustration.tsx`
- **Props:** `{ width?: number | string; height?: number | string; viewBox: string; children: ReactNode }`

---

# 9. State Management

## System: Zustand (v5)

Single store: `useAuthStore` in `src/stores/auth-store.ts`

### Store Shape

```typescript
interface AuthState {
  // State
  user: User | null;         // { id, name, email }
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isReady: boolean;          // true after initialization

  // Actions
  initialize: () => Promise<void>;   // Load from DB + SecureStore
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
}
```

### Data Flow

```
Component ──calls──→ useAuthStore.action()
                          │
                          ├──→ authService (SecureStore I/O)
                          │
                          ├──→ SQLite (settings table via Drizzle)
                          │
                          └──→ set() ──→ Zustand state update ──→ React re-render
```

### Usage Pattern

```tsx
// Read state
const user = useAuthStore((s) => s.user);
const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

// Call actions
const signIn = useAuthStore((s) => s.signIn);
await signIn(email, password);
```

---

# 10. Database & Models

## Database Engine

**SQLite** via `expo-sqlite` with **Drizzle ORM**.

- **Database file:** `screentime.db` (created automatically on device)
- **Connection:** `src/db/index.ts`
- **Schema:** `src/db/schema.ts`
- **Drizzle config:** `drizzle.config.ts`

## Tables

### `settings`

Key-value store for persisting app state.

```typescript
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),      // e.g. "has_onboarded"
  value: text('value').notNull(),     // e.g. "true"
});
```

### `onboarding_responses`

Stores user answers from onboarding.

```typescript
export const onboardingResponses = sqliteTable('onboarding_responses', {
  key: text('key').primaryKey(),      // e.g. "screen_time", "age", "focus_time"
  value: text('value').notNull(),     // e.g. "3_4", "17", "morning"
});
```

### Sample Queries

```typescript
import { db } from '@/src/db';
import { settings } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Read a setting
const result = await db.select().from(settings).where(eq(settings.key, 'has_onboarded')).limit(1);

// Write a setting (upsert)
await db.insert(settings).values({ key: 'has_onboarded', value: 'true' })
  .onConflictDoUpdate({ target: settings.key, set: { value: 'true' } });
```

> **Note:** The `settings` table is also created manually via raw SQL in `auth-store.ts` (`ensureSettingsTable()`) as a safety net, since Drizzle migrations are not yet configured for runtime.

---

# 11. API / Backend Contracts

## Current State: **No Remote Backend**

Authentication is entirely local using Expo SecureStore:

| Operation | Method | Notes |
|---|---|---|
| **Sign Up** | `SecureStore.setItemAsync(sanitizeKey(email), JSON.stringify(userData))` | Stores `{id, name, email, password}` |
| **Sign In** | `SecureStore.getItemAsync(sanitizeKey(email))` | Validates password, creates session |
| **Sign Out** | `SecureStore.deleteItemAsync('auth_session')` | Clears session |
| **Get Session** | `SecureStore.getItemAsync('auth_session')` | Returns `{user, token}` or `null` |
| **Reset Password** | No-op | Validates email exists, simulates success |

## Future Backend Integration

The auth service (`src/services/auth.ts`) is designed as a **clean interface boundary**. To integrate a real backend (Supabase, Firebase, custom API):

1. Keep the same function signatures (`signIn`, `signUp`, `signOut`, `getSession`, `resetPassword`)
2. Replace the SecureStore logic with API calls
3. Store the real JWT/session token in SecureStore
4. The Zustand store and all screens remain unchanged

---

# 12. Environment Variables

Currently **no `.env` file exists**. When adding backend integration, create `.env.local`:

| Variable | Purpose | Example |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `https://api.returnapp.com` |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGciOiJ...` |

> Prefix with `EXPO_PUBLIC_` to expose to the client bundle.

---

# 13. Scripts & Commands

```bash
# Install dependencies
npm install

# Start Expo dev server (pick iOS / Android / Web from terminal menu)
npm start
# or
npx expo start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Lint
npm run lint

# Generate Drizzle migrations (if schema changes)
npx drizzle-kit generate

# Push migrations (development)
npx drizzle-kit push

# Reset project (moves starter code to app-example/)
npm run reset-project

# Build for production (EAS)
npx eas build --platform ios
npx eas build --platform android

# Build for web (static output)
npx expo export --platform web
```

---

# 14. Testing Strategy

> **Current State:** No tests exist yet. This is a priority TODO.

### Recommended Setup

| Layer | Tool | Coverage Target |
|---|---|---|
| **Unit** | Jest + `@testing-library/react-native` | Zustand store, auth service, utility functions |
| **Component** | Jest + RNTL | All shared components (BottomSheet, SelectList, NumberPicker) |
| **Integration** | Jest + RNTL | Screen-level flows (onboarding, auth) |
| **E2E** | Detox (mobile) or Maestro | Full user journeys |

### Example Test File (Recommended)

```typescript
// __tests__/stores/auth-store.test.ts
import { useAuthStore } from '@/src/stores/auth-store';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      isReady: false,
    });
  });

  it('should start unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('should set onboarded flag', async () => {
    await useAuthStore.getState().setOnboarded(true);
    expect(useAuthStore.getState().isOnboarded).toBe(true);
  });
});
```

---

# 15. CI/CD Overview

> **Current State:** No CI/CD pipeline configured.

### Recommended Git Workflow

1. **Branching:** `main` (production), `develop` (integration), `feature/*` (work branches)
2. **PR Process:** Feature branch → PR to `develop` → code review → merge → `develop` → PR to `main` for releases
3. **Commit Convention:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

### Recommended Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm test
  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: expo/expo-github-action@v8
      - run: npx eas build --platform all --non-interactive
```

---

# 16. Security & Performance Notes

## Security

| Concern | Current Implementation | Notes |
|---|---|---|
| **Credential Storage** | Expo SecureStore (encrypted keychain) | ✅ Good for device-local |
| **Passwords** | Stored as plaintext in SecureStore | ⚠️ **Must hash before production** |
| **Session Tokens** | Locally generated pseudo-tokens | Replace with real JWT from backend |
| **No HTTPS** | No network calls yet | Enforce HTTPS when backend added |
| **Input Validation** | Basic email regex + length checks | Add server-side validation with backend |

## Performance

| Area | Status | Notes |
|---|---|---|
| **Font Loading** | ✅ Splash screen held until fonts ready | No flash of unstyled text |
| **Animations** | ✅ Reanimated (UI thread) | Bottom sheet runs at 60fps |
| **SVG Illustrations** | ⚠️ Some are large (300KB+) | Consider optimizing `dinnerFood.svg` (309KB) and `dumbells.svg` (113KB) |
| **Re-renders** | ✅ Zustand selectors prevent unnecessary re-renders | Good pattern |
| **Images** | Uses `expo-image` (available) but `Image` from RN still used | Migrate to `expo-image` for caching |
| **React Compiler** | ✅ Enabled (`experiments.reactCompiler: true`) | Automatic memoization |

---

# 17. Onboarding Guide (for new developer)

## First 2 Hours

1. **Clone & Install:** `git clone <repo> && cd return-app && npm install`
2. **Run the app:** `npx expo start` → press `i` for iOS simulator or `a` for Android
3. **Walk through the app:** Complete onboarding → sign up → explore home screen
4. **Read this guide:** Understand the folder structure and architecture
5. **Explore the codebase:** Start with `app/index.tsx` (entry gate) → follow the redirect logic → read each screen

## Day 1

1. **Understand the state flow:** Read `src/stores/auth-store.ts` and `src/services/auth.ts` completely
2. **Understand the design system:** Read `tailwind.config.js` and `src/constants/colors.ts`
3. **Understand the component system:** Read `BottomSheet.tsx`, `OnboardingShell.tsx`, `Icon.tsx`
4. **Trace a full user journey:** Sign up → home screen → tap idea → configure routine → add block
5. **Make a small change:** Modify a color, add a new icon, or change onboarding copy

## Week 1

1. **Set up testing:** Install Jest + RNTL, write first unit tests for the auth store
2. **Plan backend integration:** Choose Supabase/Firebase/custom and design the API contract
3. **Create a new screen:** Add a Profile or Settings screen under `(app)/`
4. **Implement data persistence:** Save routine blocks to SQLite, display them on the home screen
5. **Review TODOs below** and start working through the priority list

---

# 18. Immediate TODOs

| # | Task | Effort | Acceptance Criteria |
|---|---|---|---|
| 1 | **Connect routine data to SQLite** — Create `routines` table, save/load user-created blocks | L | Blocks persist across app restarts; home screen reads from DB |
| 2 | **Integrate real backend auth** — Replace SecureStore auth with Supabase/Firebase/custom API | L | Users can sign up/in from any device; passwords hashed server-side |
| 3 | **Add Profile/Settings screen** — User can view profile, edit name, sign out, change preferences | M | New tab or screen at `(app)/profile`; sign out works |
| 4 | **Persist onboarding responses** — Save answers to `onboarding_responses` table during onboarding flow | S | All 3 answers saved to SQLite; usable in personalization |
| 5 | **Build real Screen Time tracking** — Integrate platform APIs or manual entry for actual screen time data | L | Home stat card shows real data instead of hardcoded "2h 43m" |
| 6 | **Add tab navigation** — Replace single-screen app layout with bottom tab bar (Home, Stats, Settings) | M | 3+ tabs with proper icons; active state styling |
| 7 | **Set up testing infrastructure** — Install Jest + RNTL, configure, write first 10 tests | M | `npm test` runs; auth store + 2 components covered |
| 8 | **Optimize SVG assets** — Compress `dinnerFood.svg` (309KB) and `dumbells.svg` (113KB) | S | SVGs under 50KB each; no visual quality loss |
| 9 | **Add push notifications** — Remind users when a focus block is about to start | M | `expo-notifications` configured; test notification fires |
| 10 | **Set up CI/CD** — GitHub Actions for lint + test on PR; EAS Build for releases | M | PRs auto-checked; builds triggered on `main` merge |

---

# 19. Quick Start (copy-paste section)

```bash
# 1. Clone the repo
git clone https://github.com/your-org/return-app.git
cd return-app

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npx expo start

# 4. Run on your preferred platform:
#    Press 'i' for iOS Simulator
#    Press 'a' for Android Emulator
#    Press 'w' for Web Browser

# 5. (Optional) Run directly on a platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

**Requirements:**
- Node.js ≥ 18
- npm ≥ 9
- Xcode (for iOS) or Android Studio (for Android)
- Expo Go app on your physical device (optional, for on-device testing)

**No environment variables needed** for the current local-auth version.

---

> _This guide was generated from the codebase at commit HEAD on February 16, 2026. Keep it updated as the project evolves._
