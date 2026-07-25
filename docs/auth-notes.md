# Auth Notes

## Supabase setup checklist

1. Add `NEXT_PUBLIC_SUPABASE_URL`.
2. Add `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Add `NEXT_PUBLIC_SITE_URL`.
4. In Supabase Auth settings, add the site URL.
5. In Supabase Auth settings, add the callback URL:
   `http://localhost:3000/auth/callback`
6. For production, add the production callback URL too:
   `https://your-domain.com/auth/callback`

## Email/password flow

1. Use a server-side Supabase client for auth actions.
   File: `lib/supabase.ts`
2. Read `email` and `password` from `FormData`.
   File: `lib/auth.ts`
3. Call `supabase.auth.signUp()` for sign-up.
   File: `lib/auth.ts`
4. Call `supabase.auth.signInWithPassword()` for sign-in.
   File: `lib/auth.ts`
5. Use `emailRedirectTo` for email confirmation flows.
   File: `lib/auth.ts`
6. Use `supabase.auth.signOut()` for logout.
   File: `lib/auth.ts`
7. Use `supabase.auth.getUser()` on the server when checking the current user.
   File: `lib/auth.ts`
8. Connect the form UI to the auth server action.
   Files: `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`

## OAuth flow

1. Use `supabase.auth.signInWithOAuth()` on the server.
   File: `lib/auth.ts`
2. Pass `provider: "google"` or `provider: "github"`.
   File: `lib/auth.ts`
3. Pass `redirectTo` pointing to `/auth/callback`.
   File: `lib/auth.ts`
4. Use `skipBrowserRedirect: true` so the server action gets the provider URL.
   File: `lib/auth.ts`
5. Redirect the user to `data.url`.
   File: `lib/auth.ts`
6. Wire the Google/GitHub buttons to the OAuth server actions.
   Files: `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`

## Callback route steps

1. Create `app/auth/callback/route.ts`.
   File: `app/auth/callback/route.ts`
2. Read `code` from the request URL.
   File: `app/auth/callback/route.ts`
3. Call `supabase.auth.exchangeCodeForSession(code)`.
   File: `app/auth/callback/route.ts`
4. If success, redirect to the post-login page.
   File: `app/auth/callback/route.ts`
5. If failure, redirect back to `/sign-in`.
   File: `app/auth/callback/route.ts`

## App Router reminders

1. In `app/`, use `useRouter` from `next/navigation`, not `next/router`.
   Files: `app/(auth)/sign-in/page.tsx`, other client pages in `app/`
2. Don’t use one global shared Supabase client for everything.
   Files: avoid this in `lib/supabase.ts`, `lib/auth.ts`
3. Use a browser client in client components only when needed.
   File: `lib/supabase.ts`
4. Use a fresh server client per request for server actions and route handlers.
   Files: `lib/supabase.ts`, `lib/auth.ts`, `app/auth/callback/route.ts`
5. Cookie writes happen in server actions and route handlers, not during normal render.
   Files: `lib/auth.ts`, `app/auth/callback/route.ts`

## File placement guide

- `lib/supabase.ts`
  Purpose: shared helpers to create Supabase browser and server clients.
- `lib/auth.ts`
  Purpose: auth server actions and server-side auth helpers.
- `app/auth/callback/route.ts`
  Purpose: OAuth callback handler that exchanges `code` for a session.
- `app/(auth)/sign-in/page.tsx`
  Purpose: sign-in page UI, sign-in form, and provider buttons.
- `app/(auth)/sign-up/page.tsx`
  Purpose: sign-up page UI and provider buttons.
- `middleware.ts`
  Purpose: optional session refresh middleware if you later need global protected-route handling.

## Current project files

- `lib/supabase.ts`: browser/server Supabase client helpers
- `lib/auth.ts`: auth server actions
- `app/auth/callback/route.ts`: OAuth callback exchange
- `app/(auth)/sign-in/page.tsx`: sign-in UI
- `app/(auth)/sign-up/page.tsx`: sign-up UI

## Common mistakes

- Using `next/router` inside App Router pages
- Forgetting to add `/auth/callback` to Supabase redirect URLs
- Using the wrong site URL in local vs production
- Trying to handle OAuth entirely in a client button without a callback exchange
- Reusing one singleton auth client on the server
- Expecting cookies to update correctly without SSR-aware Supabase setup
