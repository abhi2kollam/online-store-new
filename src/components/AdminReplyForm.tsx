'use client';

import { useState } from 'react';
import { addReply } from '@/app/actions/review';
import { toast } from 'sonner';

interface AdminReplyFormProps {
    reviewId: number;
    onCancel?: () => void;
}

export default function AdminReplyForm({ reviewId, onCancel }: AdminReplyFormProps) {
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            const result = await addReply(reviewId, replyText);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Reply added successfully!');
                if (onCancel) onCancel();
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
            <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                rows={3}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                required
            />
            <div className="flex justify-end space-x-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-black text-white text-sm px-3 py-1.5 rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                    {isSubmitting ? 'Replying...' : 'Post Reply'}
                </button>
            </div>
        </form>
    );
}
