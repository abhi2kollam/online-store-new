import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { createClient } from '@/utils/supabase/server';

interface ShopProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
    const { q, category } = await searchParams;
    const supabase = await createClient();

    let query = supabase.from('products').select('*');

    if (category && category !== 'All') {
        // We need to filter by category name, but products table has category_id.
        // We can join with categories table.
        // Or fetch category id first.
        const { data: catData } = await supabase.from('categories').select('id').eq('name', category).single();
        if (catData) {
            query = query.eq('category_id', catData.id);
        }
    }

    if (q) {
        query = query.ilike('name', `%${q}%`);
    }

    const { data: products } = await query;

    // Transform products to match Product interface
    // We need to fetch category names for each product to match the interface?
    // ProductCard uses 'category' string.
    // We can fetch categories and map them.

    const { data: categories } = await supabase.from('categories').select('id, name');
    const categoryMap = new Map(categories?.map(c => [c.id, c.name]));

    const transformedProducts = products?.map(p => ({
        ...p,
        id: p.id.toString(),
        image: p.image_url,
        category: categoryMap.get(p.category_id) || 'Uncategorized',
    })) || [];

    return (
        <div className="space-y-8">
            <section className="text-center">

                <div className="mt-8 flex flex-col items-center gap-4">
                    <SearchBar />
                    <CategoryFilter />
                </div>
            </section>

            <section>
                {transformedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {transformedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg">No products found.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
