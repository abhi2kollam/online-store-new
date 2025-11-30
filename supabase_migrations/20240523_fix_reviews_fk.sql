
-- Drop the existing foreign key constraint
alter table public.reviews
drop constraint if exists reviews_user_id_fkey;

-- Add new foreign key constraint referencing profiles
alter table public.reviews
add constraint reviews_user_id_fkey
foreign key (user_id)
references public.profiles(id)
on delete cascade;
