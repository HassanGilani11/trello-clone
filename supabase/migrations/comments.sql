-- 1. Create Comments Table
create table if not exists public.comments (
  id uuid not null default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id text not null, -- Clerk User ID
  content text not null,
  created_at timestamptz not null default now(),
  constraint comments_pkey primary key (id)
);

-- 1.1 Add user_email column if it doesn't exist
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='comments' and column_name='user_email') then
    alter table public.comments add column user_email text;
  end if;
end $$;

-- 2. Enable RLS
alter table public.comments enable row level security;

-- 3. Create Policies (Dependencies: tasks, columns, board_members)
-- Reuse existing helper functions to ensure access is correct

drop policy if exists "Members can view comments" on public.comments;
create policy "Members can view comments"
  on public.comments for select
  using (
    exists (
      select 1 from public.tasks t
      join public.columns c on c.id = t.column_id
      where t.id = comments.task_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

drop policy if exists "Members can insert comments" on public.comments;
create policy "Members can insert comments"
  on public.comments for insert
  with check (
    exists (
      select 1 from public.tasks t
      join public.columns c on c.id = t.column_id
      where t.id = task_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
  on public.comments for delete
  using (user_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Users can update their own comments" on public.comments;
create policy "Users can update their own comments"
  on public.comments for update
  using (user_id = (select auth.jwt() ->> 'sub'))
  with check (user_id = (select auth.jwt() ->> 'sub'));
