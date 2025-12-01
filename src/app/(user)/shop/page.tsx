import ProductCard from '@/components/ProductCard';
import { Metadata } from 'next';
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

export async function generateMetadata({ searchParams }: ShopProps): Promise<Metadata> {
    const { q, category } = await searchParams;

    let title = 'Shop';
    if (q) {
        title = `Search results for "${q}"`;
    } else if (category && category !== 'all') {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        title = categoryName;
    }

    return {
        title,
        description: 'Browse our collection of products.',
    };
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
        <div className="drawer lg:drawer-open">
            <input id="shop-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col px-4 py-8">
                {/* Mobile Filter Button */}


                {/* Top Toolbar */}
                <div className="flex flex-row justify-between items-center mb-6 gap-4">
                    <div className='flex flex-col'>
                        <div className="lg:hidden mb-4">
                            <label htmlFor="shop-drawer" className="btn btn-outline btn-sm gap-2 drawer-button">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                Filters
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">
                            Showing {products?.length || 0} of {count || 0} results
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Sort by:</span>
                        <SortSelect />
                    </div>
                </div>

                {/* Product Grid */}
                {transformedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

            <div className="drawer-side z-40 top-[68px] h-[calc(100vh-68px)]">
                <label htmlFor="shop-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ShopFilters />
            </div>
        </div>
    );
}
