'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        email: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch Profile for Name (fallback)
                // Fetch Profile and Address in parallel
                const [profileResult, addressResult] = await Promise.all([
                    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
                    supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).limit(1)
                ]);

                const profile = profileResult.data;
                const addresses = addressResult.data;

                let addressStr = '';
                let fullName = profile?.full_name || '';

                if (addresses && addresses.length > 0) {
                    const addr = addresses[0];
                    addressStr = `${addr.address_line1}, ${addr.address_line2 ? addr.address_line2 + ', ' : ''}${addr.city}, ${addr.state} ${addr.postal_code}, ${addr.country}`;
                    if (addr.full_name) fullName = addr.full_name;
                }

                setShippingInfo(prev => ({
                    ...prev,
                    email: user.email || '',
                    fullName: fullName,
                    address: addressStr
                }));
            }
        };
        fetchUserProfile();
    }, [supabase]);


    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Create Order
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        productId: item.id,
                        variantId: item.variantId,
                        quantity: item.quantity
                    })),
                    shippingAddress: shippingInfo
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // 2. Open Razorpay Modal
            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "Online Store",
                description: "Order Payment",
                order_id: data.razorpayOrderId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyResponse = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyResponse.ok) {
                            clearCart();
                            toast('Payment Successful! Order placed.');
                            router.push('/'); // Redirect to success page or orders
                        } else {
                            toast('Payment Verification Failed: ' + verifyData.error);
                        }
                    } catch (error) {
                        console.error('Verification Error:', error);
                        toast('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: shippingInfo.fullName,
                    email: shippingInfo.email,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error: any) {
            console.error('Checkout Error:', error);
            toast('Checkout Failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid gap-8">
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2 mb-4">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.variantId}`} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <form onSubmit={handleCheckout} className="bg-base-100 p-6 rounded-lg shadow space-y-4">
                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                required
                                className="input input-bordered w-full"
                                value={shippingInfo.fullName}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                required
                                className="input input-bordered w-full"
                                value={shippingInfo.email}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <textarea
                            required
                            className="textarea textarea-bordered h-24 w-full"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-neutral w-full mt-4"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}
