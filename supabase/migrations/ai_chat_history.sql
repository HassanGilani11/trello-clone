-- Create AI Chat Messages Table
create table if not exists public.ai_chat_messages (
  id uuid not null default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  user_id text not null, -- Clerk User ID
  role text not null check (role in ('user', 'assistant')), -- Normalized roles
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_chat_messages_pkey primary key (id)
);

-- Enable RLS
alter table public.ai_chat_messages enable row level security;

-- Policy: View messages (Board Owner + Members)
create policy "Board members can view chat history"
  on public.ai_chat_messages for select
  using (
    exists (
      select 1 from public.boards b
      left join public.board_members bm on b.id = bm.board_id
      where b.id = ai_chat_messages.board_id
      and (b.user_id = auth.uid()::text or bm.user_id = auth.uid()::text)
    )
  );

-- Policy: Insert messages (Board Owner + Members)
create policy "Board members can send messages"
  on public.ai_chat_messages for insert
  with check (
    exists (
      select 1 from public.boards b
      left join public.board_members bm on b.id = bm.board_id
      where b.id = board_id
      and (b.user_id = auth.uid()::text or bm.user_id = auth.uid()::text)
    )
  );
