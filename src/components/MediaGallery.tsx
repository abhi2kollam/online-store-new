'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Copy, Check } from 'lucide-react';

interface MediaGalleryProps {
    onSelect?: (url: string | string[]) => void;
    selectable?: boolean;
    allowMultiple?: boolean;
    refreshTrigger?: number;
}

export default function MediaGallery({ onSelect, selectable = false, allowMultiple = false, refreshTrigger = 0 }: MediaGalleryProps) {
    const supabase = createClient();
    const [images, setImages] = useState<{ name: string; url: string }[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.storage.from('products').list();
            if (error) throw error;

            if (data) {
                const imageUrls = data.map(file => {
                    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(file.name);
                    return { name: file.name, url: publicUrl };
                });
                setImages(imageUrls);
            }
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [refreshTrigger]);

    const handleImageClick = (url: string) => {
        if (!selectable || !onSelect) return;

        if (allowMultiple) {
            if (selectedImages.includes(url)) {
                setSelectedImages(selectedImages.filter(img => img !== url));
            } else {
                setSelectedImages([...selectedImages, url]);
            }
        } else {
            onSelect(url);
        }
    };

    const confirmSelection = () => {
        if (onSelect) {
            onSelect(selectedImages);
            setSelectedImages([]); // Reset after confirm
        }
    };

    const handleDelete = async (fileName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const { error } = await supabase.storage
                .from('products')
                .remove([fileName]);

            if (error) throw error;

            setImages(images.filter(img => img.name !== fileName));
        } catch (error: any) {
            console.error('Error deleting image:', error);
            alert(`Error deleting image: ${error.message}`);
        }
    };

    const copyToClipboard = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center p-12 bg-base-200 rounded-lg">
                <p className="text-lg opacity-60">No images found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {selectable && allowMultiple && (
                <div className="flex justify-between items-center sticky top-0 bg-base-100 z-10 p-2 border-b">
                    <span className="font-bold">{selectedImages.length} selected</span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={confirmSelection}
                        disabled={selectedImages.length === 0}
                    >
                        Confirm Selection
                    </button>
                </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => {
                    const isSelected = selectedImages.includes(img.url);
                    return (
                        <div
                            key={img.name}
                            className={`card bg-base-100 shadow-sm border group relative cursor-pointer transition-all ${isSelected ? 'ring-4 ring-primary' : 'hover:ring-2 hover:ring-primary'}`}
                            onClick={() => handleImageClick(img.url)}
                        >
                            <figure className="aspect-square bg-base-200">
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            </figure>

                            {/* Overlay Actions */}
                            <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center gap-2 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {!selectable && (
                                    <>
                                        <button
                                            onClick={(e) => copyToClipboard(img.url, e)}
                                            className="btn btn-circle btn-sm btn-ghost text-white hover:bg-white/20"
                                            title="Copy URL"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(img.name, e)}
                                            className="btn btn-circle btn-sm btn-ghost text-error hover:bg-white/20"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </>
                                )}
                                {selectable && (
                                    <div className="text-white font-bold flex items-center gap-2">
                                        <Check size={24} />
                                        {allowMultiple ? (isSelected ? 'Selected' : 'Select') : 'Select'}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
