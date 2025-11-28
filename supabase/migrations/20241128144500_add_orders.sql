-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  status text not null check (status in ('pending', 'paid', 'failed')),
  total_amount numeric not null,
  currency text default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id bigint references public.products(id) on delete set null,
  variant_id bigint references public.product_variants(id) on delete set null,
  quantity integer not null,
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders
create policy "Users can view their own orders."
  on public.orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders."
  on public.orders for insert
  with check ( auth.uid() = user_id );

create policy "Admins can view all orders."
  on public.orders for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Admins can update orders."
  on public.orders for update
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

-- Policies for Order Items
create policy "Users can view their own order items."
  on public.order_items for select
  using ( exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid()) );

create policy "Users can insert their own order items."
  on public.order_items for insert
  with check ( exists (select 1 from public.orders where id = order_items.order_id and user_id = auth.uid()) );

create policy "Admins can view all order items."
  on public.order_items for select
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );
