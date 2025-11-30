
-- Add rating columns to products table
alter table public.products
add column if not exists rating_avg numeric(2,1) default 0.0,
add column if not exists rating_count integer default 0;

-- Function to update product rating
create or replace function public.update_product_rating()
returns trigger as $$
begin
  update public.products
  set rating_avg = (
      select coalesce(avg(rating), 0)::numeric(2,1)
      from public.reviews 
      where product_id = coalesce(new.product_id, old.product_id) 
      and is_approved = true
  ),
  rating_count = (
      select count(*) 
      from public.reviews 
      where product_id = coalesce(new.product_id, old.product_id) 
      and is_approved = true
  )
  where id = coalesce(new.product_id, old.product_id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update rating on insert/update/delete of reviews
drop trigger if exists trigger_update_rating on public.reviews;
create trigger trigger_update_rating
after insert or update or delete on public.reviews
for each row execute procedure public.update_product_rating();

-- Backfill existing ratings
do $$
declare
  r record;
begin
  for r in select id from public.products loop
    update public.products
    set rating_avg = (
        select coalesce(avg(rating), 0)::numeric(2,1)
        from public.reviews 
        where product_id = r.id 
        and is_approved = true
    ),
    rating_count = (
        select count(*) 
        from public.reviews 
        where product_id = r.id 
        and is_approved = true
    )
    where id = r.id;
  end loop;
end;
$$;
