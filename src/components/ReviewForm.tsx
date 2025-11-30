'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import { addReview } from '@/app/actions/review';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { Upload, X } from 'lucide-react';

interface ReviewFormProps {
    productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const supabase = createClient();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${productId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('review-images')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('review-images')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            }
            setImages([...images, ...newImages]);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addReview(productId, rating, comment, title, images);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message || 'Review submitted successfully!');
                setRating(0);
                setTitle('');
                setComment('');
                setImages([]);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <StarRating rating={rating} onRatingChange={setRating} size={24} />
            </div>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                </label>
                <input
                    type="text"
                    id="title"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Summarize your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Comment
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <div className="flex items-center space-x-2">
                    <label className="cursor-pointer flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    </label>
                    {images.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden">
                            <img src={url} alt="Review" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-0.5 rounded-bl-md hover:bg-opacity-70"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                    {isUploading && <div className="text-sm text-gray-500">Uploading...</div>}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    );
}
