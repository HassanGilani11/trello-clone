
-- 1. Create Activity Logs Table
create table if not exists public.activity_logs (
  id uuid not null default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id text not null, -- Stores the Clerk User ID
  action_type text not null, -- 'move', 'update', 'create', 'delete', 'mention'
  entity_title text, -- 'Task Title' at the time of log
  details jsonb, -- { from: 'Col A', to: 'Col B', field: 'description' }
  created_at timestamptz not null default now(),
  constraint activity_logs_pkey primary key (id)
);

-- 2. Enable RLS
alter table public.activity_logs enable row level security;

-- 3. Create Policies (Dependencies: tasks, columns, board_members)
-- Uses existing helper functions is_board_owner / is_board_member

create policy "Members can view activity logs"
  on public.activity_logs for select
  using (
    exists (
      select 1 from public.tasks t
      join public.columns c on c.id = t.column_id
      where t.id = activity_logs.task_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );

create policy "Members can insert activity logs"
  on public.activity_logs for insert
  with check (
    exists (
      select 1 from public.tasks t
      join public.columns c on c.id = t.column_id
      where t.id = task_id
      and (public.is_board_owner(c.board_id) OR public.is_board_member(c.board_id))
    )
  );
