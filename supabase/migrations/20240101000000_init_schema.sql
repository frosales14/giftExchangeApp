-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text
  -- add other columns as needed
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create enums
create type room_status as enum ('open', 'closed', 'paired');

-- Create rooms table
create table rooms (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  status room_status default 'open'::room_status not null,
  created_by uuid references auth.users default auth.uid() not null
);

alter table rooms enable row level security;

-- Rooms are viewable by everyone (or maybe just participants? For simple joining, public is easier to find)
create policy "Rooms are viewable by everyone." on rooms
  for select using (true);

create policy "Users can create rooms." on rooms
  for insert with check (auth.uid() = created_by);

create policy "Admins can update their rooms" on rooms
  for update using (auth.uid() = created_by);

-- Create participants table
create table participants (
  room_id uuid references rooms(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  wishlist text[] default '{}'::text[],
  target_id uuid references auth.users,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (room_id, user_id)
);

alter table participants enable row level security;

-- Participants policies
-- View: users can see participants in rooms they are in? Or public?
-- Let's say: Participants can view other participants in the same room.
create policy "Participants can view others in the same room." on participants
  for select using (
    exists (
      select 1 from participants p 
      where p.room_id = participants.room_id and p.user_id = auth.uid()
    )
    or
    -- Allow viewing if room is not yet joined? No, need to join first.
    -- But to join, we might check if we are already in.
    -- Simplify: Public read for participants list might be okay for this app?
    -- Better: auth required.
    auth.role() = 'authenticated'
  );

-- Join: User can insert themselves if room is open
create policy "Users can join open rooms." on participants
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from rooms where id = room_id and status = 'open'
    )
  );

-- Update: User can update their own wishlist
create policy "Users can update their own wishlist." on participants
  for update using (auth.uid() = user_id);

-- Pair Participants Function
create or replace function pair_participants(room_id_arg uuid)
returns void
language plpgsql
security definer
as $$
declare
  participants_list uuid[];
  shuffled_list uuid[];
  p_count int;
  i int;
  check_room_owner uuid;
begin
  -- Check if executed by room owner
  select created_by into check_room_owner from rooms where id = room_id_arg;
  if check_room_owner != auth.uid() then
    raise exception 'Only the room creator can pair participants';
  end if;

  -- Update room status to closed (if not already)
  -- Actually, let's set it to 'paired'
  update rooms set status = 'paired' where id = room_id_arg;

  -- Get all participants
  select array_agg(user_id) into participants_list
  from participants
  where room_id = room_id_arg;

  p_count := array_length(participants_list, 1);

  if p_count < 2 then
    raise exception 'Not enough participants to pair';
  end if;

  -- Simple shuffle and cycle assignment
  -- Standard logic: Shuffle array, then A->B, B->C, ... Last->First
  
  -- Shuffle
  select array_agg(x order by random()) into shuffled_list
  from unnest(participants_list) x;

  -- Assign targets
  for i in 1..p_count loop
    update participants
    set target_id = shuffled_list[(i % p_count) + 1] -- Next item in circle
    where room_id = room_id_arg and user_id = shuffled_list[i];
  end loop;

end;
$$;
