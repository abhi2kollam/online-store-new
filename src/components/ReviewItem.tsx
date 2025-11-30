'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import AdminReplyForm from './AdminReplyForm';
import { formatDistanceToNow } from 'date-fns';
import { toggleReviewApproval } from '@/app/actions/review';
import { toast } from 'sonner';

interface ReviewItemProps {
    review: any;
    isAdmin: boolean;
    currentUserId?: string;
}

export default function ReviewItem({ review, isAdmin, currentUserId }: ReviewItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isApproved, setIsApproved] = useState(review.is_approved);

    const handleToggleApproval = async () => {
        const newStatus = !isApproved;
        const result = await toggleReviewApproval(review.id, newStatus);
        if (result.success) {
            setIsApproved(newStatus);
            toast.success(`Review ${newStatus ? 'approved' : 'rejected'}`);
        } else {
            toast.error('Failed to update status');
        }
    };

    if (!isApproved && !isAdmin && currentUserId !== review.user_id) {
        return null; // Should be filtered on server, but double check
    }

    return (
        <div className={`border-b border-gray-100 pb-6 last:border-0 ${!isApproved ? 'opacity-75 bg-gray-50 p-4 rounded-md' : ''}`}>
            {!isApproved && (
                <div className="mb-2 inline-block px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                    Pending Approval
                </div>
            )}

            <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">
                    {review.profiles?.full_name || 'Anonymous User'}
                </div>
                <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </div>
            </div>

            <div className="mb-2">
                <StarRating rating={review.rating} readOnly size={16} />
            </div>

            {review.title && <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>}

            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

            {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-3 overflow-x-auto">
                    {review.images.map((url: string, index: number) => (
                        <img key={index} src={url} alt={`Review image ${index + 1}`} className="w-20 h-20 object-cover rounded-md border border-gray-200" />
                    ))}
                </div>
            )}

            {/* Admin Controls */}
            {isAdmin && (
                <div className="flex items-center space-x-4 mt-2 border-t border-gray-200 pt-2">
                    <button
                        onClick={handleToggleApproval}
                        className={`text-sm font-medium ${isApproved ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                    >
                        {isApproved ? 'Reject / Unapprove' : 'Approve Review'}
                    </button>

                    {!review.reply_text && !showReplyForm && (
                        <button
                            onClick={() => setShowReplyForm(true)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Reply
                        </button>
                    )}
                </div>
            )}

            {/* Admin Reply Section */}
            {review.reply_text && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-100 ml-8">
                    <div className="text-sm font-semibold text-gray-900 mb-1">Response from Store</div>
                    <p className="text-gray-700 text-sm">{review.reply_text}</p>
                    <div className="text-xs text-gray-400 mt-2">
                        {review.replied_at && formatDistanceToNow(new Date(review.replied_at), { addSuffix: true })}
                    </div>
                </div>
            )}

            {showReplyForm && (
                <div className="ml-8">
                    <AdminReplyForm reviewId={review.id} onCancel={() => setShowReplyForm(false)} />
                </div>
            )}
        </div>
    );
}
