import random

categories = [
    "Casual Dresses",
    "Formal Dresses",
    "Summer Dresses",
    "Party Dresses",
    "Maxi Dresses"
]

images = [
    "0.054354837418367.jpg",
    "0.08902415383315998.jpg",
    "0.10796541305743634.jpg",
    "0.11201350155646206.jpg",
    "0.12646860312930785.jpg",
    "0.13270008229203478.jpg",
    "0.13528034897592078.jpg",
    "0.13738111785148932.jpg",
    "0.1807194634331175.jpg",
    "0.18503822163122274.jpg",
    "0.2662802622052274.jpg",
    "0.32220015773900945.jpg",
    "0.37917896344293744.jpg",
    "0.40489139597205337.jpg",
    "0.4465124063653019.jpg",
    "0.4891674829369299.jpg",
    "0.5577636737594567.jpg",
    "0.6218381708127152.jpg",
    "0.6698165052957298.jpg",
    "0.6990864953820005.jpg",
    "0.776923536993383.jpg",
    "0.8460123405529756.jpg",
    "0.8800437671947461.jpg",
    "0.9934294335176832.jpg",
    "product_1.jpg"
]

base_url = "https://ratbdnwoflqefzvdolvx.supabase.co/storage/v1/object/public/products/"

attributes = {
    "Color": {"id": 9, "values": ["Red", "Blue", "Green", "Black", "White", "Pink", "Yellow"]},
    "Size": {"id": 13, "values": ["XS", "S", "M", "L", "XL"]},
    "Material": {"id": 15, "values": ["Cotton", "Polyester", "Silk", "Linen", "Velvet"]}
}

sql = []

# Clean up existing data (optional, but good for seeding)
sql.append("TRUNCATE TABLE public.product_variant_attributes CASCADE;")
sql.append("TRUNCATE TABLE public.product_variants CASCADE;")
sql.append("TRUNCATE TABLE public.products CASCADE;")
sql.append("TRUNCATE TABLE public.categories CASCADE;")

# Insert Categories
for i, cat in enumerate(categories):
    sql.append(f"INSERT INTO public.categories (id, name) VALUES ({i+1}, '{cat}');")

# Insert Products
for i in range(1, 26):
    name = f"Dress Product {i}"
    slug = f"dress-product-{i}"
    description = f"This is a beautiful dress product {i}. Perfect for any occasion."
    price = round(random.uniform(20.0, 200.0), 2)
    stock = random.randint(10, 100)
    category_id = random.randint(1, 5)
    
    # Select random images
    num_images = random.randint(1, 4)
    selected_images = random.sample(images, num_images)
    image_url = base_url + selected_images[0]
    additional_images = [base_url + img for img in selected_images[1:]]
    
    # Determine type
    product_type = "variant" if i % 2 == 0 else "simple" # Alternate
    
    images_array_str = "{" + ",".join([f'"{img}"' for img in additional_images]) + "}"
    
    sql.append(f"""
INSERT INTO public.products (id, name, slug, description, price, stock, category_id, image_url, images, product_type)
VALUES ({i}, '{name}', '{slug}', '{description}', {price}, {stock}, {category_id}, '{image_url}', '{images_array_str}', '{product_type}');
""")

    if product_type == "variant":
        # Create variants
        # Let's say we vary by Size and Color
        sizes = random.sample(attributes["Size"]["values"], 3)
        colors = random.sample(attributes["Color"]["values"], 2)
        
        variant_id_counter = i * 100 # Just to have unique IDs
        
        for size in sizes:
            for color in colors:
                variant_id_counter += 1
                v_sku = f"SKU-{i}-{size}-{color}"
                v_price = price + random.choice([0, 5, 10])
                v_stock = random.randint(0, 20)
                
                # Variant images (maybe same as product or random subset)
                v_img = base_url + random.choice(images)
                
                sql.append(f"""
INSERT INTO public.product_variants (id, product_id, sku, price, stock, image_url)
VALUES ({variant_id_counter}, {i}, '{v_sku}', {v_price}, {v_stock}, '{v_img}');
""")
                
                # Variant Attributes
                # Size
                sql.append(f"""
INSERT INTO public.product_variant_attributes (variant_id, attribute_id, value)
VALUES ({variant_id_counter}, {attributes['Size']['id']}, '{size}');
""")
                # Color
                sql.append(f"""
INSERT INTO public.product_variant_attributes (variant_id, attribute_id, value)
VALUES ({variant_id_counter}, {attributes['Color']['id']}, '{color}');
""")

print("\n".join(sql))
