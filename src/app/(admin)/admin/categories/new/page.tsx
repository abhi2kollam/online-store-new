'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewCategoryPage() {
    const router = useRouter();
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert('Category created successfully!');
        router.push('/admin/categories');
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
                    <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}
