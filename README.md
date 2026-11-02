<<<<<<< HEAD
# PROMNEXA — Stage 1 starter

A dark, cinematic red 3D React website for a gamified prompt-engineering learning platform.

## What is included now

- React + TypeScript + Vite application
- Interactive Three.js / React Three Fiber landing visual
- Responsive landing page and app dashboard shell
- Email registration and sign-in UI wired to Supabase Auth
- Google OAuth flow wired to Supabase Auth (requires provider configuration)
- Forgot-password email flow and reset-password page
- Supabase SQL schema with initial tables, trigger, indexes, and Row Level Security policies
- Six game routes with starter interfaces
- 10-second Memory Vision timer
- Prompt formula, AI Lab prompt composer, learning catalogue, leaderboard placeholder
- Edge Function starter files for secure image generation and evaluation
- `.env.example` with browser-safe configuration only

## Honest status

This is **Stage 1**, not a finished production application yet. The UI and navigation are implemented, but live AI image generation, semantic image comparison, server-validated XP, real challenge content, multiplayer battles, and full lesson content still need provider adapters and testing. The game page's current feedback is explicitly a local keyword-based demo checklist, not a real AI score. Reference images are CSS demo art, not a reference-image dataset.

## Requirements

- Node.js 20 LTS or a currently supported Node.js version
- npm
- A Supabase project for live authentication/database functionality
- A provider account/API key with available image-generation quota for live AI images

## Run locally

1. Extract the ZIP.
2. Open a terminal in the extracted `PROMNEXA` folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local`.
5. Fill in your Supabase Project URL and publishable/anon key.
6. Start the dev server:

   ```bash
   npm run dev
   ```

7. Open the local URL Vite prints in the terminal.

Without Supabase environment variables, the public landing page and UI preview work, but authentication is not active.

## Supabase setup

1. Create a project at https://supabase.com.
2. In Project Settings → API, copy the Project URL and publishable/anon key (or legacy anon key) into `.env.local`.
3. In Supabase SQL Editor, run `supabase/migrations/0001_initial_schema.sql`.
4. In Authentication → Providers, enable Email.
5. For Google login, configure Google OAuth credentials in the Google Cloud console, then enter the client ID/secret in Supabase Authentication → Providers → Google.
6. In Authentication → URL Configuration, set your local Site URL, e.g. `http://localhost:5173`, and add redirect URLs:
   - `http://localhost:5173/dashboard`
   - `http://localhost:5173/reset-password`
   - Your eventual deployed domain and matching paths.
7. Configure email verification and password-reset email templates to suit your deployment.

Do not expose a Supabase service-role key in frontend variables.

## Storage setup

Create private buckets in Supabase Storage for:
- `generated-images`
- `challenge-images`
- `avatars`

Add Storage RLS policies before using them. Keep generated images private by default; use authenticated downloads or short-lived signed URLs. Do not upload secret keys or user-private images to public buckets without a clear reason.

## AI provider setup (free-tier preference)

Free tiers, quotas, supported models, and terms change. This starter does not promise unlimited free image generation. Choose a provider whose current terms allow your intended use and whose free tier is available to your account. Add the provider-specific request adapter in `supabase/functions/generate-image/index.ts` and store the key as a Supabase Edge Function secret, for example:

```bash
supabase secrets set IMAGE_PROVIDER=your-provider
supabase secrets set IMAGE_PROVIDER_API_KEY=your-secret-key
```

Never put an AI provider key in `VITE_*` variables or client-side code. Update `APP_ORIGIN` to your deployed origin and restrict CORS before production.

For actual AI evaluation, implement `supabase/functions/evaluate-prompt/index.ts` with a vision-capable model. Return separate scores for prompt quality and reference-image match, plus captured/missing/incorrect details and actionable hints. Do not treat a keyword checklist as semantic image understanding.

## Deployment outline

1. Push this folder to a private or public GitHub repository.
2. Import the repository into Vercel (or another static frontend host).
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting project's environment settings.
4. Deploy the frontend.
5. Deploy/configure Supabase migrations, Storage policies, and Edge Functions.
6. Add the deployed domain to Supabase Auth redirect URLs.
7. Test registration, email verification, Google login, password reset, sign out, and protected routes on the deployed domain.
8. Configure the AI provider and run end-to-end tests before describing generation as live.

## Next implementation stage

- Integrate one currently available free-tier image provider, with clear quota/error handling
- Build image upload/storage and history
- Implement vision-based prompt evaluation and reference-image matching
- Add a real challenge/reference-image dataset
- Persist game attempts and award XP through trusted server-side logic
- Add skill tree, achievements, leaderboard population, and lesson completion
- Implement multiplayer Prompt Battle if desired
- Add automated tests and production security review
=======
# PROMNEXA
>>>>>>> 0da4066cf18d8ff22a2cd21c964c4eeb8ab7ecf9
