'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import QuantitySelector from '@/components/QuantitySelector';

export default function CartDrawerContent() {
    const { items, total, removeFromCart, updateQuantity } = useCart();

    const closeDrawer = () => {
        const checkbox = document.getElementById('cart-drawer') as HTMLInputElement;
        if (checkbox) checkbox.checked = false;
    };

    return (
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Shopping Cart ({items.length})</h2>
                </div>
                <button onClick={closeDrawer} className="btn btn-ghost btn-circle btn-sm">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-base-content/50 gap-4 py-10">
                        <ShoppingBag className="w-16 h-16 opacity-20" />
                        <p>Your cart is empty</p>
                        <button onClick={closeDrawer} className="btn btn-neutral btn-sm">
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={`${item.id}-${item.variantId ?? 'default'}`} className="flex gap-4 p-3 bg-base-200/50 rounded-lg group relative">
                            <div className="w-16 h-16 relative rounded-md overflow-hidden bg-base-300 shrink-0">
                                <Image
                                    src={item.image || item.image_url}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                    {item.attributes && (
                                        <div className="text-xs text-base-content/70 mt-1 flex flex-wrap gap-x-2">
                                            {Object.entries(item.attributes).map(([key, value]) => (
                                                <span key={key}>
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
                                            size="sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-primary text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id, item.variantId)}
                                className="absolute top-2 right-2 p-1 text-base-content/40 hover:text-error transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="border-t pt-4 space-y-4 mt-auto">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/cart"
                            onClick={closeDrawer}
                            className="btn btn-outline w-full btn-sm"
                        >
                            View Cart
                        </Link>
                        <button className="btn btn-primary w-full btn-sm">
                            Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
