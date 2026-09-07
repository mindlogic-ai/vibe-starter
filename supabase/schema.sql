-- Paste this whole file into Supabase → SQL Editor → New query → Run.
create table if not exists items (
  id bigint generated always as identity primary key,
  title text not null,
  done boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

-- Row Level Security stays on. This one policy allows everything,
-- which is fine for a personal workshop app. A real service would add
-- login and narrow this policy to the signed-in user.
alter table items enable row level security;
drop policy if exists "anyone can do anything (workshop)" on items;
create policy "anyone can do anything (workshop)" on items
  for all using (true) with check (true);
