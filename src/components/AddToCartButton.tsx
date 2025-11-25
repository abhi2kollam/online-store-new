'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/services/mockData';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <button
            className="btn btn-primary flex-1"
            onClick={() => addToCart(product)}
        >
            Add to Cart
        </button>
    );
}
