import { getProducts } from '@/services/mockData';
import Link from 'next/link';
import Image from 'next/image';

export default async function AdminProductsPage() {
    const products = await getProducts();

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
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold">{product.name}</div>
                                </td>
                                <td>{product.category}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.stock}</td>
                                <td className="flex gap-2">
                                    <Link href={`/admin/products/${product.id}`} className="btn btn-sm btn-ghost">
                                        Edit
                                    </Link>
                                    <button className="btn btn-sm btn-ghost text-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
