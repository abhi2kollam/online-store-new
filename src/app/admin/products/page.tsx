import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminProductsPage() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return <div>Error loading products</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link href="/admin/products/new" className="btn btn-primary">
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
                        {products?.map((product: any) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    width={48}
                                                    height={48}
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-base-300 flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold">{product.name}</div>
                                </td>
                                <td>{product.categories?.name || 'Uncategorized'}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <Link href={`/admin/products/${product.id}`} className="btn btn-sm btn-ghost">
                                        Edit
                                    </Link>
                                    <button className="btn btn-sm btn-ghost text-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {products?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
