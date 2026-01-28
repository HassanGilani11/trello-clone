-- Fix Infinite Recursion and Enable RBAC for all tables

-- 1. Helper Functions (Security Definer to bypass RLS and avoid recursion)
-- These functions run with privileges of the creator (postgres), effectively bypassing RLS checks to prevent infinite loops.

create or replace function public.is_board_member(p_board_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from public.board_members
    where board_id = p_board_id
    and user_id = (select auth.jwt() ->> 'sub')
  );
$$;

create or replace function public.is_board_admin(p_board_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from public.board_members
    where board_id = p_board_id
    and user_id = (select auth.jwt() ->> 'sub')
    and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_board_owner(p_board_id uuid)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from public.boards
    where id = p_board_id
    and user_id = (select auth.jwt() ->> 'sub')
  );
$$;

-- 2. Update Board Members Policies
alter table public.board_members enable row level security;

drop policy if exists "Users can view members of boards they belong to" on public.board_members;
drop policy if exists "Owners and Admins can add members" on public.board_members;
drop policy if exists "Owners and Admins can update members" on public.board_members;
drop policy if exists "Owners and Admins can remove members" on public.board_members;

create policy "Users can view members of boards they belong to"
  on public.board_members for select
  using (
    public.is_board_owner(board_id) OR public.is_board_member(board_id)
  );

create policy "Owners and Admins can add members"
  on public.board_members for insert
  with check (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );

create policy "Owners and Admins can update members"
  on public.board_members for update
  using (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );

create policy "Owners and Admins can remove members"
  on public.board_members for delete
  using (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );

-- 3. Update Boards Policies
-- Dropping old "own" policies to replace with "own OR member"
drop policy if exists "Users can view their own boards" on public.boards;
drop policy if exists "Users can update their own boards" on public.boards;
-- Keep insert/delete for owners only (already checked by user_id = auth.jwt)
-- But ensuring we don't duplicate if they exist
drop policy if exists "Users can insert their own boards" on public.boards;
drop policy if exists "Users can delete their own boards" on public.boards;


create policy "Users can view boards they own or are members of"
  on public.boards for select
  using (
    user_id = (select auth.jwt() ->> 'sub') OR public.is_board_member(id)
  );

create policy "Users can update boards they own or are admins of"
  on public.boards for update
  using (
    user_id = (select auth.jwt() ->> 'sub') OR public.is_board_admin(id)
  );

create policy "Users can insert their own boards"
  on public.boards for insert
  with check (user_id = (select auth.jwt() ->> 'sub'));

create policy "Users can delete their own boards"
  on public.boards for delete
  using (user_id = (select auth.jwt() ->> 'sub'));


-- 4. Update Columns Policies
drop policy if exists "Users can view their own columns" on public.columns;
drop policy if exists "Users can insert their own columns" on public.columns;
drop policy if exists "Users can update their own columns" on public.columns;
drop policy if exists "Users can delete their own columns" on public.columns;

create policy "Members can view columns"
  on public.columns for select
  using (
    public.is_board_owner(board_id) OR public.is_board_member(board_id)
  );

create policy "Admins/Owners can insert columns"
  on public.columns for insert
  with check (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );

create policy "Admins/Owners can update columns"
  on public.columns for update
  using (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );

create policy "Admins/Owners can delete columns"
  on public.columns for delete
  using (
    public.is_board_owner(board_id) OR public.is_board_admin(board_id)
  );


-- 5. Update Tasks Policies
drop policy if exists "Users can view their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

create policy "Members can view tasks"
  on public.tasks for select
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

create policy "Members can insert tasks"
  on public.tasks for insert
  with check (
    exists (
      select 1 from public.columns c
      where c.id = column_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

create policy "Members can update tasks"
  on public.tasks for update
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

create policy "Members can delete tasks"
  on public.tasks for delete
  using (
    exists (
      select 1 from public.columns c
      where c.id = tasks.column_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );
