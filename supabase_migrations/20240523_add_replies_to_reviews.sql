
-- Add reply columns to reviews table
alter table public.reviews
add column if not exists reply_text text,
add column if not exists replied_at timestamp with time zone;

-- Policy for Admins to update reviews (add replies)
create policy "Admins can update any review."
  on public.reviews for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
