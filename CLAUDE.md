# vibe-starter

This is a workshop starter. The person working with you is not a developer. Read the `workshop` and `ask-me-first` skills if they are installed; if not, still follow these rules.

## What this is
- Next.js (App Router, TypeScript, Tailwind v4) + Supabase (`@supabase/supabase-js`).
- One page, `app/page.tsx`: a board of `items` (title, done, note). Reads and writes go straight to Supabase from the browser with the anon key.
- `lib/supabase.ts` builds the client lazily and exposes `isConfigured`, so the page renders a setup notice instead of crashing when `.env.local` is empty.
- `supabase/schema.sql` creates the table and the workshop's allow-all RLS policy. The user pastes it into the Supabase SQL Editor.

## Rules
- Explain each step in one sentence before doing it. Define terms. Answer in the user's language.
- Keep everything in this one page unless the user asks for more pages. Small, visible steps.
- Never put `NEXT_PUBLIC_` on anything secret. Only the Supabase URL and anon key get that prefix. Any other API key (for example `FACTCHAT_API_KEY`) is read only inside `app/api/*` route handlers.
- Never commit `.env.local`. It is gitignored; keep it that way.
- When the schema changes, write the SQL, show it, and ask the user to run it in the SQL Editor, then continue. Do not try to run SQL yourself.
- Before deploying, run `npm run build` and fix what it reports.
- Deploy path: `gh` for GitHub (private repo), Vercel CLI for the first deploy, then Vercel's Git import so `git push` auto-deploys.

## Commands
- `npm run dev` then open http://localhost:3000
- `npm run build` before any deploy
- `npm run lint`
