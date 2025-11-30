'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addReview(
    productId: string,
    rating: number,
    comment: string,
    title?: string,
    images: string[] = []
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to leave a review.' };
    }

    const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment,
        title,
        images,
        is_approved: false, // Default to unapproved
    });

    if (error) {
        console.error('Error adding review:', error);
        if (error.code === '23505') {
            return { error: 'You have already reviewed this product.' };
        }
        return { error: 'Failed to add review.' };
    }

    revalidatePath(`/product/${productId}`);
    return { success: true, message: 'Review submitted for approval.' };
}

export async function addReply(reviewId: number, replyText: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in.' };
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { error: 'Unauthorized. Only admins can reply.' };
    }

    const { error } = await supabase
        .from('reviews')
        .update({
            reply_text: replyText,
            replied_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

    if (error) {
        console.error('Error adding reply:', error);
        return { error: 'Failed to add reply.' };
    }

    const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).single();

    if (review) {
        revalidatePath(`/product/${review.product_id}`);
    }

    return { success: true };
}

export async function getReviewStats(productId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId)
        .eq('is_approved', true);

    if (error || !data) {
        return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }

    const count = data.length;
    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    const average = count > 0 ? sum / count : 0;

    const distribution = data.reduce((acc: any, curr) => {
        acc[curr.rating] = (acc[curr.rating] || 0) + 1;
        return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return { average, count, distribution };
}

export async function toggleReviewApproval(reviewId: number, isApproved: boolean) {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Unauthorized' };

    const { error } = await supabase.from('reviews').update({ is_approved: isApproved }).eq('id', reviewId);

    if (error) return { error: 'Failed to update status' };

    // Revalidate
    const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).single();
    if (review) revalidatePath(`/product/${review.product_id}`);
    revalidatePath('/admin/reviews');

    return { success: true };
}

export async function getAllReviews() {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Unauthorized' };

    const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*, profiles(full_name, email), products(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all reviews:', error);
        return { error: 'Failed to fetch reviews' };
    }

    return { reviews };
}

export async function deleteReview(reviewId: number) {
    const supabase = await createClient();

    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Unauthorized' };

    // Get product ID before deleting for revalidation
    const { data: review } = await supabase.from('reviews').select('product_id').eq('id', reviewId).single();

    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (error) {
        console.error('Error deleting review:', error);
        return { error: 'Failed to delete review' };
    }

    if (review) {
        revalidatePath(`/product/${review.product_id}`);
    }
    revalidatePath('/admin/reviews');

    return { success: true };
}
