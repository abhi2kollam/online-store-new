'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
    const { items, removeFromCart, clearCart, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/" className="btn btn-neutral">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-base-100 p-4 rounded-lg shadow">
                        <div className="relative h-24 w-24 shrink-0">
                            <Image
                                src={item.image || item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                            />
                        </div>
                        <div className="grow">
                            <h3 className="font-bold text-lg">{item.name}</h3>
                            <p className="text-sm text-base-content/70">{item.category}</p>
                            <p className="font-semibold">${item.price.toFixed(2)} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                                className="btn btn-error btn-xs mt-2"
                                onClick={() => removeFromCart(item.id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="divider my-8"></div>

            <div className="flex justify-between items-center">
                <button className="btn btn-ghost text-error" onClick={clearCart}>
                    Clear Cart
                </button>
                <div className="text-right">
                    <p className="text-2xl font-bold mb-4">Total: ${total.toFixed(2)}</p>
                    <Link href="/checkout" className="btn btn-neutral btn-lg">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
