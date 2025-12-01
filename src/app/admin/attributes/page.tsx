'use client';

import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface Attribute {
    id: number;
    name: string;
    type: string;
    created_at: string;
}

export default function AdminAttributesPage() {
    const supabase = createClient();
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAttributes = async () => {
            console.log('AdminAttributesPage: Starting fetchAttributes');
            try {
                const { data, error } = await supabase
                    .from('attributes')
                    .select('*')
                    .order('created_at', { ascending: false });

                console.log('AdminAttributesPage: Fetch complete', { data, error });

                if (error) {
                    console.error('Error fetching attributes:', error);
                } else {
                    setAttributes(data || []);
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            } finally {
                console.log('AdminAttributesPage: Setting loading to false');
                setLoading(false);
            }
        };

        fetchAttributes();

    }, [supabase]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this attribute?')) return;

        const supabase = createClient();
        try {
            const { error } = await supabase.from('attributes').delete().eq('id', id);
            if (error) throw error;
            setAttributes(attributes.filter((attr) => attr.id !== id));
        } catch (error: unknown) {
            console.error('Error deleting attribute:', error);
            alert('Error deleting attribute');
        }
    };

    if (loading) return <div>Loading...</div>;

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
                        {attributes.map((attribute) => (
                            <tr key={attribute.id}>
                                <td className="font-bold">{attribute.name}</td>
                                <td>
                                    <div className="badge badge-ghost">{attribute.type}</div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(attribute.id)}
                                        className="btn btn-sm btn-ghost text-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {attributes.length === 0 && (
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
