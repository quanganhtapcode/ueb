# Copilot Instructions for `ueb`

## Build, lint, and test commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview production build: `npm run preview`

Current repository state to account for during sessions:
- `npm run lint` currently fails on existing repo issues (`react-refresh/only-export-components` and `no-explicit-any` in current source).
- `npm run build` currently fails because Tailwind v4 PostCSS integration is not updated (`postcss.config.js` still uses `tailwindcss` plugin directly).

Testing:
- There is currently no test script in `package.json` and no test files (`*.test.*` / `*.spec.*`), so single-test execution is not available yet.

## High-level architecture

- App entry is `src/main.tsx`, rendering `App` inside `StrictMode`.
- `src/App.tsx` defines route structure:
  - `/login` -> `LoginPage`
  - `/dashboard` -> `ProtectedRoute(DashboardPage)`
  - `/` -> redirect to `/dashboard`
- Auth is centralized in `src/contexts/AuthContext.tsx`:
  - Subscribes to Firebase auth state via `onAuthStateChanged`.
  - Exposes `user`, `loading`, `signInWithGoogle`, `signOut` through `useAuth()`.
- Route guarding is handled by `src/components/ProtectedRoute.tsx`:
  - Shows full-screen spinner while auth state initializes.
  - Redirects unauthenticated users to `/login`.
- Firebase integration is in `src/lib/firebase.ts`:
  - Initializes app/auth/firestore.
  - Configures `GoogleAuthProvider` with hosted-domain hint `hd: 'vnu.edu.vn'`.
- Pages are thin UI layers over auth:
  - `LoginPage` calls `signInWithGoogle` and renders auth errors.
  - `DashboardPage` reads current user and calls `signOut`.

## Key repository conventions

- Use `@` path alias for internal imports (configured in both `vite.config.ts` and `tsconfig.app.json`): `@/* -> src/*`.
- UI primitives follow shadcn/ui patterns:
  - Shared `cn()` utility in `src/lib/utils.ts` (`clsx` + `tailwind-merge`).
  - Variant-driven components with `class-variance-authority` (see `src/components/ui/button.tsx`).
- Styling is Tailwind-first:
  - Theme tokens are defined as CSS variables in `src/index.css`.
  - Components should prefer semantic utility classes (`bg-background`, `text-foreground`, etc.) over hard-coded colors.
- Domain restriction for sign-in is intentionally enforced in multiple client-side layers:
  - Google provider custom parameter (`hd`),
  - Auth state listener check (invalid domain -> sign out + alert),
  - Post-sign-in double check in `signInWithGoogle`.
  Keep these checks aligned when changing auth logic.
- README and QUICKSTART are source-of-truth docs for Firebase setup and expected login flow (`/login` -> Google sign-in -> `/dashboard`).
