'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function NewAttributePage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'text',
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('attributes')
                .insert(formData);

            if (insertError) throw insertError;

            router.push('/admin/attributes');
            router.refresh();
        } catch (err: unknown) {
            console.error('Error creating attribute:', err);
            const message = err instanceof Error ? err.message : 'Failed to create attribute';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/attributes" className="btn btn-ghost btn-sm">
                    ← Back
                </Link>
                <h1 className="text-3xl font-bold">New Attribute</h1>
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow">
                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Attribute Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Color, Size, Material"
                            className="input input-bordered"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="select">Select</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/attributes" className="btn btn-ghost">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-neutral" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Attribute'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
