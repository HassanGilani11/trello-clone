-- Fix RLS policies to handle Clerk IDs (Validation Strings) instead of UUIDs.
-- This replaces auth.uid() which forces UUID casting, with auth.jwt() ->> 'sub' which treats it as text.

-- 1. Drop existing policies
drop policy if exists "Users can view their own boards" on public.boards;
drop policy if exists "Users can insert their own boards" on public.boards;
drop policy if exists "Users can update their own boards" on public.boards;
drop policy if exists "Users can delete their own boards" on public.boards;

drop policy if exists "Users can view their own columns" on public.columns;
drop policy if exists "Users can insert their own columns" on public.columns;
drop policy if exists "Users can update their own columns" on public.columns;
drop policy if exists "Users can delete their own columns" on public.columns;

drop policy if exists "Users can view their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

-- 2. New Policies for Boards
create policy "Users can view their own boards"
  on public.boards for select
  using (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can insert their own boards"
  on public.boards for insert
  with check (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can update their own boards"
  on public.boards for update
  using (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can delete their own boards"
  on public.boards for delete
  using (user_id = (select auth.jwt() ->> 'sub'));


-- 3. New Policies for Columns
create policy "Users can view their own columns"
  on public.columns for select
  using (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can insert their own columns"
  on public.columns for insert
  with check (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can update their own columns"
  on public.columns for update
  using (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can delete their own columns"
  on public.columns for delete
  using (user_id = (select auth.jwt() ->> 'sub'));


-- 4. New Policies for Tasks
-- Task ownership is inferred from the column/board
create policy "Users can view their own tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = (select auth.jwt() ->> 'sub')
    )
  );

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.columns c
      where c.id = column_id
      and c.user_id = (select auth.jwt() ->> 'sub')
    )
  );

create policy "Users can update their own tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = (select auth.jwt() ->> 'sub')
    )
  );

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and c.user_id = (select auth.jwt() ->> 'sub')
    )
  );
