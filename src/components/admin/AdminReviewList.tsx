'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toggleReviewApproval, deleteReview } from '@/app/actions/review';
import { toast } from 'sonner';
import StarRating from '../StarRating';
import AdminReplyForm from '../AdminReplyForm';
import { MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Review {
    id: number;
    rating: number;
    comment: string;
    title?: string;
    is_approved: boolean;
    created_at: string;
    reply_text?: string;
    profiles: {
        full_name: string;
        email: string;
    };
    products: {
        name: string;
    };
}

interface AdminReviewListProps {
    reviews: Review[];
}

export default function AdminReviewList({ reviews: initialReviews }: AdminReviewListProps) {
    const [reviews, setReviews] = useState(initialReviews);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);

    const handleToggleApproval = async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const result = await toggleReviewApproval(id, newStatus);

        if (result.success) {
            setReviews(reviews.map(r => r.id === id ? { ...r, is_approved: newStatus } : r));
            toast.success(`Review ${newStatus ? 'approved' : 'rejected'}`);
        } else {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        const result = await deleteReview(id);
        if (result.success) {
            setReviews(reviews.filter(r => r.id !== id));
            toast.success('Review deleted');
        } else {
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {review.products?.name || 'Unknown Product'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="font-medium text-gray-900">{review.profiles?.full_name || 'Anonymous'}</div>
                                    <div className="text-xs">{review.profiles?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                                    <div className="flex items-center mb-1">
                                        <StarRating rating={review.rating} readOnly size={14} />
                                        <span className="ml-2 text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {review.title && <div className="font-semibold text-gray-900">{review.title}</div>}
                                    <p className="truncate">{review.comment}</p>
                                    {review.reply_text && (
                                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                            <span className="font-semibold">Reply:</span> {review.reply_text}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {review.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleToggleApproval(review.id, review.is_approved)}
                                        className={`text-${review.is_approved ? 'yellow' : 'green'}-600 hover:text-${review.is_approved ? 'yellow' : 'green'}-900`}
                                        title={review.is_approved ? 'Reject' : 'Approve'}
                                    >
                                        {review.is_approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                    <button
                                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Reply"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {replyingTo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Reply to Review</h3>
                        <AdminReplyForm
                            reviewId={replyingTo}
                            onCancel={() => setReplyingTo(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
