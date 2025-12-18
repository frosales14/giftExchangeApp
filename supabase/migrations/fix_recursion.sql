-- Fix 42P17 Infinite Recursion error
-- We use a SECURITY DEFINER function to check membership without triggering RLS recursively

create or replace function public.is_member_of_room(_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 
    from participants 
    where room_id = _room_id 
    and user_id = auth.uid()
  );
$$;

-- Drop the buggy policy
drop policy if exists "Participants can view others in the same room." on participants;

-- Create the new, safe policy
create policy "Participants can view others in the same room." on participants
  for select using (
    -- You can always see your own row
    auth.uid() = user_id
    or
    -- You can see others if you are in the room (checked safely)
    is_member_of_room(room_id)
  );
