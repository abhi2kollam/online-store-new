'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface AddToCartButtonProps {
    product: Product;
    variantId?: number;
    disabled?: boolean;
    quantity?: number;
}

export default function AddToCartButton({ product, variantId, disabled, quantity = 1 }: AddToCartButtonProps) {
    const { addToCart, loading } = useCart();

    return (
        <button
            className="btn btn-neutral"
            onClick={() => addToCart(product, variantId, quantity)}
            disabled={loading || disabled}
        >
            Add to Cart
        </button>
    );
}
