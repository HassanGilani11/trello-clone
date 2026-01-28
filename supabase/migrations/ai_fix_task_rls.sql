-- Fix RLS policies for Tasks to allow Board Members to collaborate

-- 1. Drop ALL potential policies (Old & New) to prevent errors and ensure clean state
drop policy if exists "Users can view their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

drop policy if exists "Board members can view tasks" on public.tasks;
drop policy if exists "Board members can insert tasks" on public.tasks;
drop policy if exists "Board members can update tasks" on public.tasks;
drop policy if exists "Board members can delete tasks" on public.tasks;

-- 2. Create new permissive policies based on Board Membership
-- CRITICAL CHECK: We use (select auth.jwt() ->> 'sub') because Clerk IDs are text ("user_...").
-- Using auth.uid() causes "invalid input syntax for type uuid" errors.

create policy "Board members can view tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.columns c
      join public.boards b on b.id = c.board_id
      left join public.board_members bm on bm.board_id = b.id and bm.user_id = (select auth.jwt() ->> 'sub')
      where c.id = tasks.column_id
      and (
        b.user_id = (select auth.jwt() ->> 'sub') -- Owner
        or bm.id is not null -- Member
      )
    )
  );

create policy "Board members can insert tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.columns c
      join public.boards b on b.id = c.board_id
      left join public.board_members bm on bm.board_id = b.id and bm.user_id = (select auth.jwt() ->> 'sub')
      where c.id = column_id
      and (
        b.user_id = (select auth.jwt() ->> 'sub')
        or (bm.id is not null and bm.role in ('owner', 'admin', 'member'))
      )
    )
  );

create policy "Board members can update tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.columns c
      join public.boards b on b.id = c.board_id
      left join public.board_members bm on bm.board_id = b.id and bm.user_id = (select auth.jwt() ->> 'sub')
      where c.id = tasks.column_id
      and (
        b.user_id = (select auth.jwt() ->> 'sub')
        or (bm.id is not null and bm.role in ('owner', 'admin', 'member'))
      )
    )
  );

create policy "Board members can delete tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.columns c
      join public.boards b on b.id = c.board_id
      left join public.board_members bm on bm.board_id = b.id and bm.user_id = (select auth.jwt() ->> 'sub')
      where c.id = tasks.column_id
      and (
        b.user_id = (select auth.jwt() ->> 'sub')
        or (bm.id is not null and bm.role in ('owner', 'admin', 'member'))
      )
    )
  );
