import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = body;

        // Use server client to get authenticated user
        const supabaseUser = await createServerClient();
        const {
            data: { user },
        } = await supabaseUser.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Use Service Role Client to bypass RLS for updating order status
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Payment is successful
        // 1. Update Order Status
        const { data: order, error: orderError } = await supabaseUser
            .from('orders')
            .update({
                status: 'paid',
                razorpay_payment_id,
                razorpay_signature
            })
            .eq('razorpay_order_id', razorpay_order_id)
            .select()
            .single();

        if (orderError || !order) {
            console.error('Error updating order:', orderError);
            throw new Error('Error updating order status');
        }

        // 2. Move Cart Items to Order Items
        const { data: cartItems, error: cartError } = await supabaseAdmin
            .from('cart_items')
            .select('*, products(price), product_variants(price)')
            .eq('user_id', user.id);

        if (cartError) throw cartError;

        if (cartItems && cartItems.length > 0) {
            const orderItems = cartItems.map((item: any) => {
                const price = item.variant_id ? item.product_variants.price : item.products.price;
                return {
                    order_id: order.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: price
                };
            });

            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear Cart
            await supabaseAdmin
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);
        }

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
