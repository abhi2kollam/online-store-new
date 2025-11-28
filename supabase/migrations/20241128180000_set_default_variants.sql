-- 1. Reset all defaults to ensure clean state
UPDATE product_variants SET is_default = false;

-- 2. Set the last variant (by created_at) as default for each product
WITH last_variants AS (
  SELECT DISTINCT ON (product_id) id
  FROM product_variants
  ORDER BY product_id, created_at DESC
)
UPDATE product_variants
SET is_default = true
WHERE id IN (SELECT id FROM last_variants);

-- 3. Update parent product's price and stock (and image) from the default variant
WITH default_variants AS (
  SELECT product_id, price, stock, image_url
  FROM product_variants
  WHERE is_default = true
)
UPDATE products p
SET
  price = dv.price,
  stock = dv.stock,
  -- Optional: Update image if the variant has one
  image_url = COALESCE(dv.image_url, p.image_url)
FROM default_variants dv
WHERE p.id = dv.product_id;
