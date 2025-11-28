import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import AdminProductRow from '@/components/AdminProductRow';

export const revalidate = 0;

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const supabase = await createClient();
    const { page: pageParam } = await searchParams;
    const page = parseInt(pageParam || '1');
    const ITEMS_PER_PAGE = 10;
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data: products, count, error } = await supabase
        .from('products')
        .select(`
            *, 
            categories(name), 
            product_variants(
                id, sku, price, stock, image_url,is_default,    
                product_variant_attributes(value)
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching products:', error);
        return <div>Error loading products</div>;
    }

    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="btn btn-neutral">
                    Add New Product
                </Link>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products?.map((product) => (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            <AdminProductRow key={product.id} product={product as any} />
                        ))}
                        {products?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <div className="join">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                href={`/admin/products?page=${p}`}
                                className={`join-item btn ${page === p ? 'btn-active' : ''}`}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
