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
        <Link href={`/product/${product.slug}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer block group">
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
            </figure>
            <div className="card-body p-4">
                <h2 className="card-title text-lg">
                    {product.name}
                    <span className="badge badge-accent badge-sm">{product.category}</span>
                </h2>
                <div className={`flex items-center mt-1 ${(!product.rating_count || product.rating_count === 0) ? 'invisible' : ''}`}>
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600 ml-1">{product.rating_avg || '0.0'} ({product.rating_count || 0})</span>
                </div>
                <div className="card-actions justify-between items-center mt-2">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    {product.product_type === 'simple' ? (
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-sm btn-neutral z-10"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <span className="btn btn-sm btn-outline btn-accent pointer-events-none">
                            More Options Available
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
