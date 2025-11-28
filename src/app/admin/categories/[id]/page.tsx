'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { createClient } from '@/utils/supabase/client';
import MediaGallery from '@/components/MediaGallery';
import Image from 'next/image';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const supabase = createClient();
    const router = useRouter();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchCategory = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching category:', error);
                alert('Error fetching category');
                router.push('/admin/categories');
                return;
            }

            if (data) {
                setName(data.name);
                setImage(data.image || '');
            }
            setLoading(false);
        };

        fetchCategory();
    }, [id, router, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        try {
            const { error } = await supabase
                .from('categories')
                .update({ name, slug, image_url: image })
                .eq('id', id);

            if (error) throw error;

            alert('Category updated successfully!');
            router.push('/admin/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Error updating category. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        try {
            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            setImage(publicUrl);
            setRefreshTrigger(prev => prev + 1);
        } catch (error: unknown) {
            console.error('Error uploading image:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            alert(`Error uploading image: ${message}`);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Category</h1>

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

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Category Image</span>
                    </label>

                    <div className="flex flex-col gap-4">
                        {image && (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                <Image src={image} alt="Category preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                                    onClick={() => setImage('')}
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="Image URL"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex gap-2">
                            <label className="btn btn-outline flex-1 cursor-pointer">
                                {uploading ? 'Uploading...' : 'Upload New'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <button
                                type="button"
                                className="btn btn-outline flex-1"
                                onClick={() => setShowGallery(true)}
                            >
                                Select Existing
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={saving}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-neutral" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Media Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-base-100 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Select Image</h3>
                            <button className="btn btn-circle btn-sm btn-ghost" onClick={() => setShowGallery(false)}>✕</button>
                        </div>
                        <MediaGallery
                            selectable
                            onSelect={(url: string | string[]) => {
                                setImage(url as string);
                                setShowGallery(false);
                            }}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
