import { createClient } from '@/utils/supabase/server';
import ReviewItem from './ReviewItem';
import ProductRatingSummary from './ProductRatingSummary';
import { getReviewStats } from '@/app/actions/review';

interface ReviewListProps {
    productId: string;
}

export default async function ReviewList({ productId }: ReviewListProps) {
    const supabase = await createClient();

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    // Fetch reviews based on role
    const query = supabase
        .from('reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        // If not admin, show approved reviews OR user's own reviews
        // RLS handles this mostly, but we can be explicit or rely on RLS.
        // RLS policy: "Public approved reviews are viewable by everyone." AND "Users can view their own reviews"
        // So simple select is fine, RLS will filter.
    }

    const { data: reviews, error } = await query;

    if (error) {
        console.error('Error fetching reviews:', error);
        return <div>Failed to load reviews.</div>;
    }

    const stats = await getReviewStats(productId);

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <ProductRatingSummary average={stats.average} count={stats.count} distribution={stats.distribution} />

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">Customer Reviews ({reviews.length})</h3>
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} isAdmin={isAdmin} currentUserId={user?.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
