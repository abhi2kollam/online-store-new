import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable caching for admin page

export default async function AdminCategoriesPage() {
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
                <Link href="/admin/categories/new" className="btn btn-primary">
                    Add New Category
                </Link>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
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
                                    <div className="font-bold">{category.name}</div>
                                </td>
                                <td>{category.slug}</td>
                                <td className="flex gap-2">
                                    <button className="btn btn-sm btn-ghost">Edit</button>
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
