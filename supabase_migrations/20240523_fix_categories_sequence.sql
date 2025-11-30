-- Fix categories id sequence to match the max id in the table
SELECT setval(pg_get_serial_sequence('public.categories', 'id'), COALESCE((SELECT MAX(id) FROM public.categories), 0) + 1, false);
