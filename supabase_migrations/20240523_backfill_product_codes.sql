-- Update product codes based on the last numeric value in the product name.
-- Format: DRESS-P-{number}
-- Example: "Summer Dress 123" -> "DRESS-P-123"

-- Note: This operation might fail if multiple products result in the same product_code
-- (e.g., "Dress 1" and "Shirt 1" would both try to be "DRESS-P-1").
-- Ensure your product names have unique ending numbers or modify the logic to include ID.

UPDATE public.products
SET product_code = 'DRESS-P-' || substring(name from '([0-9]+)[^0-9]*$')
WHERE name ~ '[0-9]';
