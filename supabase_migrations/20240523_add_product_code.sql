-- Add product_code to products table
alter table public.products
add column if not exists product_code text;

-- Add unique constraint
alter table public.products
add constraint products_product_code_key unique (product_code);
