-- Enable Row Level Security (RLS) for all tables
-- This assumes you are using Clerk with Supabase via JWT templates, where auth.uid() maps to the Clerk User ID.

-- 1. Create Boards Table
create table if not exists public.boards (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text null,
  color text not null default 'bg-blue-500',
  user_id text not null, -- Stores the Clerk User ID
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint boards_pkey primary key (id)
);

alter table public.boards enable row level security;

create policy "Users can view their own boards"
  on public.boards for select
  using (user_id = auth.uid()::text);

create policy "Users can insert their own boards"
  on public.boards for insert
  with check (user_id = auth.uid()::text);

create policy "Users can update their own boards"
  on public.boards for update
  using (user_id = auth.uid()::text);

create policy "Users can delete their own boards"
  on public.boards for delete
  using (user_id = auth.uid()::text);


-- 2. Create Columns Table
create table if not exists public.columns (
  id uuid not null default gen_random_uuid(),
  board_id uuid not null,
  title text not null,
  sort_order integer not null default 0,
  user_id text not null, -- Stores the Clerk User ID (duplicated for easier RLS, based on models.ts)
  created_at timestamptz not null default now(),
  constraint columns_pkey primary key (id),
  constraint columns_board_id_fkey foreign key (board_id) references public.boards(id) on delete cascade
);

alter table public.columns enable row level security;

create policy "Users can view their own columns"
  on public.columns for select
  using (user_id = auth.uid()::text);

create policy "Users can insert their own columns"
  on public.columns for insert
  with check (user_id = auth.uid()::text);

create policy "Users can update their own columns"
  on public.columns for update
  using (user_id = auth.uid()::text);

create policy "Users can delete their own columns"
  on public.columns for delete
  using (user_id = auth.uid()::text);


-- 3. Create Tasks Table
create table if not exists public.tasks (
  id uuid not null default gen_random_uuid(),
  column_id uuid not null,
  title text not null,
  description text null,
  assignee text null,
  due_date timestamptz null,
  priority text not null default 'medium',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), -- Inferred from service usage
  constraint tasks_pkey primary key (id),
  constraint tasks_column_id_fkey foreign key (column_id) references public.columns(id) on delete cascade,
  constraint tasks_priority_check check (priority in ('low', 'medium', 'high'))
);

alter table public.tasks enable row level security;

-- RLS for tasks requires checking the parent column/board ownership
-- Since we rely on column_id, we check if the column belongs to the user
create policy "Users can view their own tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = auth.uid()::text
    )
  );

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.columns c
      where c.id = column_id
      and c.user_id = auth.uid()::text
    )
  );

create policy "Users can update their own tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = auth.uid()::text
    )
  );

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = auth.uid()::text
    )
  );
