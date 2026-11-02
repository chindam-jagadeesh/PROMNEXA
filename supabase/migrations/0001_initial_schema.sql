-- PROMNEXA initial schema. Apply with Supabase CLI or SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.game_challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  game_type text not null check (game_type in ('freestyle','rebuild','memory','detective','repair','battle')),
  difficulty text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced','expert')),
  reference_image_path text,
  challenge_data jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.game_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid references public.game_challenges(id) on delete set null,
  game_type text not null check (game_type in ('freestyle','rebuild','memory','detective','repair','battle')),
  prompt text not null,
  generated_image_path text,
  prompt_quality_score numeric(5,2) check (prompt_quality_score between 0 and 100),
  image_match_score numeric(5,2) check (image_match_score between 0 and 100),
  feedback jsonb not null default '{}'::jsonb,
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.prompt_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  provider text,
  model text,
  created_at timestamptz not null default now()
);

create table if not exists public.generated_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  prompt text not null,
  provider text,
  model text,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp bigint not null default 0 check (total_xp >= 0),
  current_level integer not null default 1 check (current_level >= 1),
  current_streak integer not null default 0 check (current_streak >= 0),
  last_activity_date date,
  challenges_completed integer not null default 0 check (challenges_completed >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null default 'sparkles',
  xp_reward integer not null default 0 check (xp_reward >= 0)
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.leaderboard_entries (
  user_id uuid primary key references auth.users(id) on delete cascade,
  public_display_name text not null default 'Prompt Explorer',
  total_xp bigint not null default 0 check (total_xp >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  level text not null default 'beginner',
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_completions (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists game_attempts_user_created_idx on public.game_attempts(user_id, created_at desc);
create index if not exists generated_images_user_created_idx on public.generated_images(user_id, created_at desc);
create index if not exists leaderboard_xp_idx on public.leaderboard_entries(total_xp desc);

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.game_challenges enable row level security;
alter table public.game_attempts enable row level security;
alter table public.prompt_history enable row level security;
alter table public.generated_images enable row level security;
alter table public.user_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.notifications enable row level security;

create policy "Profiles readable by owner" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Profiles insertable by owner" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Profiles updatable by owner" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Settings owner read" on public.user_settings for select to authenticated using (auth.uid() = user_id);
create policy "Settings owner insert" on public.user_settings for insert to authenticated with check (auth.uid() = user_id);
create policy "Settings owner update" on public.user_settings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Published challenges readable" on public.game_challenges for select to authenticated using (is_published = true);
create policy "Attempts owner read" on public.game_attempts for select to authenticated using (auth.uid() = user_id);
create policy "Attempts owner insert" on public.game_attempts for insert to authenticated with check (auth.uid() = user_id);
create policy "Attempts owner update" on public.game_attempts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Prompt history owner read" on public.prompt_history for select to authenticated using (auth.uid() = user_id);
create policy "Prompt history owner insert" on public.prompt_history for insert to authenticated with check (auth.uid() = user_id);
create policy "Generated images owner read" on public.generated_images for select to authenticated using (auth.uid() = user_id);
create policy "Generated images owner insert" on public.generated_images for insert to authenticated with check (auth.uid() = user_id);

create policy "Progress owner read" on public.user_progress for select to authenticated using (auth.uid() = user_id);
-- Client-side users intentionally cannot update XP/progress directly; use a trusted server function.
create policy "Achievements readable by signed-in users" on public.achievements for select to authenticated using (true);
create policy "Own achievements readable" on public.user_achievements for select to authenticated using (auth.uid() = user_id);

create policy "Leaderboard visible to signed-in users" on public.leaderboard_entries for select to authenticated using (true);
-- No client insert/update policies on leaderboard: publish validated scores through trusted server-side logic.

create policy "Published lessons readable" on public.lessons for select to authenticated using (is_published = true);
create policy "Lesson completions owner read" on public.lesson_completions for select to authenticated using (auth.uid() = user_id);
create policy "Lesson completions owner insert" on public.lesson_completions for insert to authenticated with check (auth.uid() = user_id);
create policy "Notifications owner read" on public.notifications for select to authenticated using (auth.uid() = user_id);
create policy "Notifications owner update" on public.notifications for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Create profile/progress/settings automatically when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  insert into public.user_settings (user_id) values (new.id) on conflict (user_id) do nothing;
  insert into public.user_progress (user_id) values (new.id) on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.achievements (slug,title,description,icon,xp_reward) values
('first-image','First Image','Generate your first image.','image',20),
('keen-eye','Keen Eye','Complete your first observation challenge.','eye',25),
('prompt-repairer','Prompt Repairer','Improve a starter prompt.','wrench',25),
('week-of-practice','Week of Practice','Practice on seven separate days.','flame',100)
on conflict (slug) do nothing;
