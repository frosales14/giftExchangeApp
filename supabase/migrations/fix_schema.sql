-- 1. Create a trigger to automatically create a profile for every new user (Essential for Google Auth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Backfill profiles for existing users (so your current user works)
insert into public.profiles (id, full_name, avatar_url)
select id, raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'avatar_url'
from auth.users
on conflict (id) do nothing;

-- 3. Fix Foreign Key relationships to allow checking 'profiles' from 'participants'
-- First, drop the old constraints that referenced auth.users
alter table participants drop constraint if exists participants_user_id_fkey;
alter table participants drop constraint if exists participants_target_id_fkey;

-- Add new constraints referencing profiles
alter table participants
  add constraint participants_user_id_fkey
  foreign key (user_id)
  references profiles(id)
  on delete cascade;

alter table participants
  add constraint participants_target_id_fkey
  foreign key (target_id)
  references profiles(id);
