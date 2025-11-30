
-- Update reviews table with new columns
alter table public.reviews
add column if not exists title text,
add column if not exists images text[] default array[]::text[],
add column if not exists updated_at timestamp with time zone,
add column if not exists is_approved boolean default false;

-- Create Storage Bucket for Review Images
insert into storage.buckets (id, name, public)
values ('review-images', 'review-images', true)
on conflict (id) do nothing;

-- Storage Policies for Review Images
create policy "Public review images are viewable by everyone."
  on storage.objects for select
  using ( bucket_id = 'review-images' );

create policy "Authenticated users can upload review images."
  on storage.objects for insert
  with check ( bucket_id = 'review-images' and auth.role() = 'authenticated' );

create policy "Users can update their own review images."
  on storage.objects for update
  using ( bucket_id = 'review-images' and auth.uid() = owner );

create policy "Users can delete their own review images."
  on storage.objects for delete
  using ( bucket_id = 'review-images' and auth.uid() = owner );

-- Update Reviews Policies for Moderation
drop policy if exists "Public reviews are viewable by everyone." on public.reviews;

create policy "Public approved reviews are viewable by everyone."
  on public.reviews for select
  using ( is_approved = true );

create policy "Users can view their own reviews (even if unapproved)."
  on public.reviews for select
  using ( auth.uid() = user_id );

create policy "Admins can view all reviews."
  on public.reviews for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
