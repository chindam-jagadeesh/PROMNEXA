# PROMNEXA build roadmap

## Stage 1 — Foundation (this ZIP)
- React/TypeScript/Vite project
- Cinematic red design system and responsive layout
- 3D orb scene
- Supabase Auth flows and initial database schema/RLS
- Game routes, timer demo, AI Lab prompt composer, learning and leaderboard placeholders

## Stage 2 — Real AI image generation
- Select a currently available free-tier provider
- Implement provider adapter in Supabase Edge Function
- Store images in private Supabase Storage
- Save prompt/image metadata and history
- Add loading, quota, timeout, retry, and error states

## Stage 3 — Real evaluation
- Connect a vision-capable model
- Score prompt quality separately from image-reference match
- Return captured, missing, and incorrect visual details
- Generate specific hints and revised prompt suggestions
- Evaluate with a reference test set to calibrate scores

## Stage 4 — Game logic and progress
- Add curated challenge images and hidden reference handling
- Implement Rebuild, Memory Vision, Detective, Repair, and Battle challenge rules
- Persist attempts and validated XP
- Add level thresholds, streaks, achievements, and skill tree
- Add leaderboard with privacy controls and anti-cheat rules

## Stage 5 — Production readiness
- Accessibility, reduced motion, mobile performance
- Unit/integration/end-to-end tests
- Rate limiting and usage caps
- Secure storage policies and CORS
- Error monitoring, deployment verification, backups, and privacy policy
