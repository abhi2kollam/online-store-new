'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Upload } from 'lucide-react';
import MediaGallery from '@/components/MediaGallery';

export default function ProductsMediaPage() {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);
                if (error) throw error;
            });

            await Promise.all(uploadPromises);

            setRefreshTrigger(prev => prev + 1);
            alert(`${files.length} image(s) uploaded successfully!`);
        } catch (error: any) {
            console.error('Error uploading images:', error);
            alert(`Error uploading images: ${error.message}`);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Product Media</h1>
                <div className="form-control">
                    <label className="btn btn-primary gap-2 cursor-pointer">
                        <Upload size={20} />
                        {uploading ? 'Uploading...' : 'Upload Images'}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            <MediaGallery refreshTrigger={refreshTrigger} />
        </div>
    );
}
