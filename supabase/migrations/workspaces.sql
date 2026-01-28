-- 1. Create Workspaces Table
create table if not exists public.workspaces (
  id uuid not null default gen_random_uuid(),
  name text not null,
  slug text null,
  owner_id text not null, -- Clerk User ID
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_pkey primary key (id)
);

-- 2. Create Workspace Members Table
create table if not exists public.workspace_members (
  id uuid not null default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id text not null, -- Clerk User ID
  email text not null,
  role text not null default 'member', -- admin, member
  created_at timestamptz not null default now(),
  constraint workspace_members_pkey primary key (id),
  constraint workspace_members_workspace_user_unique unique (workspace_id, user_id)
);

-- 3. Update Boards Table to link to Workspaces
-- If we want existing boards to belong to a default workspace, we'd need more logic.
-- For now, we'll allow workspace_id to be nullable or added later.
alter table public.boards add column if not exists workspace_id uuid references public.workspaces(id) on delete set null;

-- 4. Enable RLS
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- 5. Helper Functions for RLS
create or replace function public.is_workspace_member(ws_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
    and user_id = (select auth.jwt() ->> 'sub')
  );
end;
$$ language plpgsql security definer;

create or replace function public.is_workspace_admin(ws_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.workspace_members
    where workspace_id = ws_id
    and user_id = (select auth.jwt() ->> 'sub')
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 6. Workspace Policies
drop policy if exists "Users can view workspaces they are members of" on public.workspaces;
create policy "Users can view workspaces they are members of"
  on public.workspaces for select
  using (public.is_workspace_member(id));

drop policy if exists "Owners can view their workspaces" on public.workspaces;
create policy "Owners can view their workspaces"
  on public.workspaces for select
  using (owner_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Users can create workspaces" on public.workspaces;
create policy "Users can create workspaces"
  on public.workspaces for insert
  with check (owner_id = (select auth.jwt() ->> 'sub'));

drop policy if exists "Admins can update workspaces" on public.workspaces;
create policy "Admins can update workspaces"
  on public.workspaces for update
  using (public.is_workspace_admin(id));

drop policy if exists "Owners can delete workspaces" on public.workspaces;
create policy "Owners can delete workspaces"
  on public.workspaces for delete
  using (owner_id = (select auth.jwt() ->> 'sub'));

-- 7. Workspace Member Policies
drop policy if exists "Members can view other members in same workspace" on public.workspace_members;
create policy "Members can view other members in same workspace"
  on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

drop policy if exists "Admins can manage members" on public.workspace_members;
create policy "Admins can manage members"
  on public.workspace_members for all
  using (public.is_workspace_admin(workspace_id));

-- New policy to allow the owner to add the first member record
drop policy if exists "Owners can add themselves as first member" on public.workspace_members;
create policy "Owners can add themselves as first member"
  on public.workspace_members for insert
  with check (
    exists (
      select 1 from public.workspaces
      where id = workspace_id
      and owner_id = (select auth.jwt() ->> 'sub')
    )
  );

-- 8. Update Board Policies to respect Workspace RLS
-- Existing board policies use user_id = auth.uid() which we mapped to sub.
-- We should also allow workspace members to see boards.
drop policy if exists "Workspace members can view boards" on public.boards;
create policy "Workspace members can view boards"
  on public.boards for select
  using (workspace_id is not null and public.is_workspace_member(workspace_id));
