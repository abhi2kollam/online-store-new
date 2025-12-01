import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortSelect from '@/components/SortSelect';
import ShopFilters from '@/components/ShopFilters';
import { createClient } from '@/utils/supabase/server';

import Pagination from '@/components/Pagination';
import ScrollAnimation from '@/components/ScrollAnimation';

interface ShopProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        page?: string;
        sort?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopProps) {
    const { q, category, page, sort } = await searchParams;
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

    // Sorting
    switch (sort) {
        case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
        case 'rating':
            query = query.order('rating_avg', { ascending: false });
            break;
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false });
            break;
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
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-2">
                {/* Filters (Sidebar on Desktop, Drawer on Mobile) */}
                <ShopFilters />

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Toolbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <p className="text-sm text-gray-500">
                            Showing {products?.length || 0} of {count || 0} results
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Sort by:</span>
                            <SortSelect />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {transformedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {transformedProducts.map((product, index) => (
                                    <ScrollAnimation key={product.id} delay={index * 0.05} className="h-full">
                                        <ProductCard product={product} />
                                    </ScrollAnimation>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Pagination totalPages={totalPages} currentPage={currentPage} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 bg-base-100 rounded-box">
                            <h3 className="text-lg font-medium">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
