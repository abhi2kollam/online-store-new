import { getAllReviews } from '@/app/actions/review';
import AdminReviewList from '@/components/admin/AdminReviewList';

export default async function AdminReviewsPage() {
    const { reviews, error } = await getAllReviews();

    if (error) {
        return <div className="p-8 text-red-600">Error loading reviews: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Review Management</h1>
            <AdminReviewList reviews={reviews || []} />
        </div>
    );
}
