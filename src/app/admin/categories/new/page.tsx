'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function NewCategoryPage() {
    const supabase = createClient();
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        try {
            const { error } = await supabase
                .from('categories')
                .insert([{ name, slug }]);

            if (error) throw error;

            alert('Category created successfully!');
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Error creating category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Category</h1>

            <form onSubmit={handleSubmit} className="max-w-md bg-base-100 p-6 rounded-lg shadow space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Category Name</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-neutral" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    );
}
