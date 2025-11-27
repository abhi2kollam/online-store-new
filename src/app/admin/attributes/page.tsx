import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export default async function AdminAttributesPage() {
    const supabase = await createClient();
    const { data: attributes, error } = await supabase
        .from('attributes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching attributes:', error);
        return <div>Error loading attributes</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Attributes</h1>
                <Link href="/admin/attributes/new" className="btn btn-neutral">
                    Add New Attribute
                </Link>
            </div>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attributes?.map((attribute: any) => (
                            <tr key={attribute.id}>
                                <td className="font-bold">{attribute.name}</td>
                                <td>
                                    <div className="badge badge-ghost">{attribute.type}</div>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-ghost text-error">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {attributes?.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-4">No attributes found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
