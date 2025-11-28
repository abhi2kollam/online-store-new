
// const fs = require('fs');

const categories = [
    "Casual Dresses",
    "Formal Dresses",
    "Summer Dresses",
    "Party Dresses",
    "Maxi Dresses"
];

const images = [
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
];

const baseUrl = "https://ratbdnwoflqefzvdolvx.supabase.co/storage/v1/object/public/products/";

const attributes = {
    "Color": { id: 9, values: ["Red", "Blue", "Green", "Black", "White", "Pink", "Yellow"] },
    "Size": { id: 13, values: ["XS", "S", "M", "L", "XL"] },
    "Material": { id: 15, values: ["Cotton", "Polyester", "Silk", "Linen", "Velvet"] }
};

const sql = [];

// Clean up existing data
sql.push("TRUNCATE TABLE public.product_variant_attributes CASCADE;");
sql.push("TRUNCATE TABLE public.product_variants CASCADE;");
sql.push("TRUNCATE TABLE public.products CASCADE;");
sql.push("TRUNCATE TABLE public.categories CASCADE;");

// Insert Categories
categories.forEach((cat, i) => {
    const slug = cat.toLowerCase().replace(/ /g, '-');
    sql.push(`INSERT INTO public.categories (id, name, slug) VALUES (${i + 1}, '${cat}', '${slug}');`);
});

// Helper to get random item
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Insert Products
for (let i = 1; i <= 25; i++) {
    const name = `Dress Product ${i}`;
    const slug = `dress-product-${i}`;
    const description = `This is a beautiful dress product ${i}. Perfect for any occasion.`;
    const price = getRandomFloat(20, 200);
    const stock = getRandomInt(10, 100);
    const categoryId = getRandomInt(1, 5);

    // Select random images
    const numImages = getRandomInt(1, 4);
    const selectedImages = getRandomSubset(images, numImages);
    const imageUrl = baseUrl + selectedImages[0];
    const additionalImages = selectedImages.slice(1).map(img => baseUrl + img);

    // Determine type
    const productType = i % 2 === 0 ? "variant" : "simple";

    const imagesArrayStr = "{" + additionalImages.map(img => `"${img}"`).join(",") + "}";

    sql.push(`
INSERT INTO public.products (id, name, slug, description, price, stock, category_id, image_url, images, product_type)
VALUES (${i}, '${name}', '${slug}', '${description}', ${price}, ${stock}, ${categoryId}, '${imageUrl}', '${imagesArrayStr}', '${productType}');
`);

    if (productType === "variant") {
        // Create variants
        const sizes = getRandomSubset(attributes["Size"].values, 3);
        const colors = getRandomSubset(attributes["Color"].values, 2);

        let variantIdCounter = i * 100;

        sizes.forEach(size => {
            colors.forEach(color => {
                variantIdCounter++;
                const vSku = `SKU-${i}-${size}-${color}`;
                const vPrice = (parseFloat(price) + getRandomInt(0, 10)).toFixed(2);
                const vStock = getRandomInt(0, 20);
                const vImg = baseUrl + getRandom(images);

                sql.push(`
INSERT INTO public.product_variants (id, product_id, sku, price, stock, image_url)
VALUES (${variantIdCounter}, ${i}, '${vSku}', ${vPrice}, ${vStock}, '${vImg}');
`);

                // Variant Attributes
                sql.push(`
INSERT INTO public.product_variant_attributes (variant_id, attribute_id, value)
VALUES (${variantIdCounter}, ${attributes['Size'].id}, '${size}');
`);
                sql.push(`
INSERT INTO public.product_variant_attributes (variant_id, attribute_id, value)
VALUES (${variantIdCounter}, ${attributes['Color'].id}, '${color}');
`);
            });
        });
    }
}

console.log(sql.join('\n'));
