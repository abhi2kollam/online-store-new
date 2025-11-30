
-- Add parent_id to categories table
alter table public.categories
add column if not exists parent_id bigint references public.categories(id);

-- Add index for performance
create index if not exists idx_categories_parent_id on public.categories(parent_id);
