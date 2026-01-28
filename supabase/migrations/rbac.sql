-- Create board_members table
create table if not exists public.board_members (
  id uuid default gen_random_uuid() primary key,
  board_id uuid references public.boards(id) on delete cascade not null,
  user_id text not null, -- Clerk ID
  email text not null,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(board_id, user_id)
);

-- Enable RLS
alter table public.board_members enable row level security;

-- Policies for board_members

-- 1. View Members:
-- Use a secure function or direct policy to allow viewing members if you are a member of the board (or the owner).
-- Since we are querying this table to determine access, we need to be careful about recursion.
-- A user can see members of a board if they constitute a row in board_members for that board.
-- BUT, initially, only the creator is in board_members (we'll need to auto-add them).
-- Or, the board owner (from boards table) should always have access.

create policy "Users can view members of boards they belong to"
  on public.board_members for select
  using (
    -- User is the board owner
    exists (
      select 1 from public.boards b
      where b.id = board_members.board_id
      and b.user_id = (select auth.jwt() ->> 'sub')
    )
    OR
    -- User is a member of the board
    exists (
      select 1 from public.board_members bm
      where bm.board_id = board_members.board_id
      and bm.user_id = (select auth.jwt() ->> 'sub')
    )
  );

-- 2. Add/Invite Members:
-- Only Owners or Admins should be able to add members.
create policy "Owners and Admins can add members"
  on public.board_members for insert
  with check (
    -- User is the board owner
    exists (
      select 1 from public.boards b
      where b.id = board_id
      and b.user_id = (select auth.jwt() ->> 'sub')
    )
    OR
    -- User is an admin or owner in board_members
    exists (
      select 1 from public.board_members bm
      where bm.board_id = board_id
      and bm.user_id = (select auth.jwt() ->> 'sub')
      and bm.role in ('owner', 'admin')
    )
  );

-- 3. Update Members (change roles):
-- Owners can update anyone. Admins can update members/viewers?
-- For simplicity, let's say Owners and Admins can update roles.
create policy "Owners and Admins can update members"
  on public.board_members for update
  using (
    exists (
      select 1 from public.boards b
      where b.id = board_members.board_id
      and b.user_id = (select auth.jwt() ->> 'sub')
    )
    OR
    exists (
      select 1 from public.board_members bm
      where bm.board_id = board_members.board_id
      and bm.user_id = (select auth.jwt() ->> 'sub')
      and bm.role in ('owner', 'admin')
    )
  );

-- 4. Delete Members (remove):
create policy "Owners and Admins can remove members"
  on public.board_members for delete
  using (
    exists (
      select 1 from public.boards b
      where b.id = board_members.board_id
      and b.user_id = (select auth.jwt() ->> 'sub')
    )
    OR
    exists (
      select 1 from public.board_members bm
      where bm.board_id = board_members.board_id
      and bm.user_id = (select auth.jwt() ->> 'sub')
      and bm.role in ('owner', 'admin')
    )
  );

-- We also need to auto-add the board creator as an 'owner' in board_members when a board is created.
-- Or we handle this in the application logic. Application logic is easier for now.
