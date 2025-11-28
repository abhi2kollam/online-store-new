'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <Link href={`/product/${product.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer block group">
            <figure className="relative h-64 overflow-hidden">
                <Image
                    src={product.image_url}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center text-sm font-medium line-clamp-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {product.description}
                    </p>
                </div>
                {product.product_type === 'simple' && (
                    <button
                        onClick={handleAddToCart}
                        className="absolute top-3 right-3 btn btn-circle btn-sm btn-accent opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10 hover:scale-110"
                        aria-label="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                )}
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-lg">
                    {product.name}
                    <span className="badge badge-accent badge-sm">{product.category}</span>
                </h2>
                <div className="card-actions justify-between items-center mt-2">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
