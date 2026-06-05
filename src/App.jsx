create table tech_packs (
  id uuid default gen_random_uuid() primary key,
  name text,
  model_no text,
  season text,
  machine text,
  gauge text,
  supervisor text,
  img text,
  status text default 'draft',
  pieces jsonb default '{}',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

alter table tech_packs enable row level security;

create policy "allow all" on tech_packs
  for all using (true) with check (true);
