import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { createClient } from '@/utils/supabase/server';

import Pagination from '@/components/Pagination';

interface ShopProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        page?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
    const { q, category, page } = await searchParams;
    const supabase = await createClient();
    const currentPage = Number(page) || 1;
    const itemsPerPage = 12;
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase.from('products').select('*', { count: 'exact' });

    // Fetch all categories to build the tree and map
    const { data: allCategories } = await supabase.from('categories').select('id, name, slug, parent_id');
    const categoryMap = new Map(allCategories?.map(c => [c.id, c.name]));

    if (category && category !== 'all') {
        const targetCategory = allCategories?.find(c => c.slug === category);

        if (targetCategory) {
            // Find all descendant IDs
            const getDescendantIds = (parentId: number): number[] => {
                const children = allCategories?.filter(c => c.parent_id === parentId) || [];
                let ids = children.map(c => c.id);
                children.forEach(child => {
                    ids = [...ids, ...getDescendantIds(child.id)];
                });
                return ids;
            };

            const categoryIds = [targetCategory.id, ...getDescendantIds(targetCategory.id)];
            query = query.in('category_id', categoryIds);
        }
    }

    if (q) {
        query = query.ilike('name', `%${q}%`);
    }

    const { data: products, count } = await query.range(from, to);
    const totalPages = count ? Math.ceil(count / itemsPerPage) : 0;

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
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {transformedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <Pagination totalPages={totalPages} currentPage={currentPage} />
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg">No products found.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
