'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/services/mockData';

interface AddToCartButtonProps {
    product: Product;
    variantId?: number;
    disabled?: boolean;
}

export default function AddToCartButton({ product, variantId, disabled }: AddToCartButtonProps) {
    const { addToCart, loading } = useCart();

    return (
        <button
            className="btn btn-neutral"
            onClick={() => addToCart(product, variantId)}
            disabled={loading || disabled}
        >
            Add to Cart
        </button>
    );
}
