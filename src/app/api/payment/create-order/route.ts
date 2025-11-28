import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items, shippingAddress } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
        }

        // Calculate total amount from server-side to prevent tampering
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of items) {
            const { data: product } = await supabase
                .from('products')
                .select('price, name')
                .eq('id', item.productId)
                .single();

            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }

            let price = product.price;

            // If variant, fetch variant price
            if (item.variantId) {
                const { data: variant } = await supabase
                    .from('product_variants')
                    .select('price')
                    .eq('id', item.variantId)
                    .single();

                if (variant) {
                    price = variant.price;
                }
            }

            totalAmount += price * item.quantity;
            orderItemsData.push({
                product_id: item.productId,
                variant_id: item.variantId,
                quantity: item.quantity,
                price: price
            });
        }

        // Create Razorpay Order
        const options = {
            amount: Math.round(totalAmount * 100), // amount in smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create Order in Supabase
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                status: 'pending',
                total_amount: totalAmount,
                currency: 'INR',
                razorpay_order_id: order.id,
                shipping_address: shippingAddress,
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order in DB:', orderError);
            throw orderError;
        }

        return NextResponse.json({
            orderId: order.id,
            razorpayOrderId: order.id,
            amount: totalAmount,
            currency: 'INR',
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
