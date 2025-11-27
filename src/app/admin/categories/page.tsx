import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0; // Disable caching for admin page

export default async function AdminCategoriesPage() {
    const supabase = await createClient();
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching categories:', error);
        return <div>Error loading categories</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Categories</h1>
                <Link href="/admin/categories/new" className="btn btn-neutral">
                    Add New Category
                </Link>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories?.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            {category.image_url ? (
                                                <img src={category.image_url} alt={category.name} />
                                            ) : (
                                                <div className="bg-base-200 w-full h-full flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="font-bold">{category.name}</div>
                                </td>
                                <td>{category.slug}</td>
                                <td>
                                    <Link href={`/admin/categories/${category.id}`} className="btn btn-sm btn-ghost">Edit</Link>
                                    <button className="btn btn-sm btn-ghost text-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {categories?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4">No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
