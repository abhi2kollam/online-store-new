'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import QuantitySelector from '@/components/QuantitySelector';

export default function CartPage() {
    const { items, removeFromCart, clearCart, total, updateQuantity } = useCart();

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
                {items.map((item, index) => (
                    <div key={`${item.id}-${item.variantId ?? 'default'}`} className="flex items-center gap-4 bg-base-100 p-4 rounded-lg shadow">
                        <div className="relative h-24 w-24 shrink-0">
                            <Image
                                src={item.image || item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover rounded"
                                sizes="96px"
                                priority={index === 0}
                            />
                        </div>
                        <div className="grow">
                            <Link href={`/product/${item.id}`} className="font-bold text-lg hover:underline">
                                {item.name}
                            </Link>
                            {item.attributes && (
                                <div className="text-sm text-base-content/70 mt-1">
                                    {Object.entries(item.attributes).map(([key, value]) => (
                                        <span key={key} className="mr-3">
                                            <span className="font-semibold">{key}:</span> {value}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2">
                                <QuantitySelector
                                    quantity={item.quantity}
                                    onIncrease={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                                    onDecrease={() => updateQuantity(item.id, item.variantId, item.quantity - 1)}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            {item.quantity > 1 && (
                                <p className="text-sm text-base-content/70 mb-1">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                </p>
                            )}
                            <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                                className="btn btn-error btn-xs mt-2"
                                onClick={() => removeFromCart(item.id, item.variantId)}
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
