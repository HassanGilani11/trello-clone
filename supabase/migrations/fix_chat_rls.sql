-- Drop existing policies
drop policy "Board members can view chat history" on public.ai_chat_messages;
drop policy "Board members can send messages" on public.ai_chat_messages;

-- Recreate Policy: View messages (Board Owner + Members)
create policy "Board members can view chat history"
  on public.ai_chat_messages for select
  using (
    exists (
      select 1 from public.boards b
      left join public.board_members bm on b.id = bm.board_id
      where b.id = ai_chat_messages.board_id
      and (b.user_id = (select auth.jwt() ->> 'sub') or bm.user_id = (select auth.jwt() ->> 'sub'))
    )
  );

-- Recreate Policy: Insert messages (Board Owner + Members)
create policy "Board members can send messages"
  on public.ai_chat_messages for insert
  with check (
    exists (
      select 1 from public.boards b
      left join public.board_members bm on b.id = bm.board_id
      where b.id = board_id
      and (b.user_id = (select auth.jwt() ->> 'sub') or bm.user_id = (select auth.jwt() ->> 'sub'))
    )
  );
