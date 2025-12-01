'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import StarRating from './StarRating';
import ProductDetails from './ProductDetails';
import { X } from 'lucide-react';

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

    const [showDetails, setShowDetails] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const handleViewOptions = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDetails(true);
        dialogRef.current?.showModal();
    };

    const handleClose = () => {
        dialogRef.current?.close();
        setShowDetails(false);
    };

    return (
        <>
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
                    </h2>
                    {product.product_code && <p className="text-xs text-gray-500 mb-1">Code: {product.product_code}</p>}
                    <div className={`flex items-center mt-1 ${(!product.rating_count || product.rating_count === 0) ? 'invisible' : ''}`}>
                        <StarRating rating={product.rating_avg || 0} readOnly size={14} />
                        <span className="text-xs text-gray-600 ml-1">({product.rating_count || 0})</span>
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
                            <button
                                onClick={handleViewOptions}
                                className="btn btn-sm btn-outline btn-accent z-10"
                            >
                                View Options
                            </button>
                        )}
                    </div>
                </div>
            </Link>

            {/* Quick View Modal */}
            <dialog ref={dialogRef} className="modal" onClose={() => setShowDetails(false)} onClick={(e) => {
                if (e.target === dialogRef.current) handleClose();
            }}>
                <div className="modal-box w-11/12 max-w-5xl max-h-[90vh] p-0 relative bg-base-100">
                    <button
                        className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost z-10"
                        onClick={handleClose}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="p-6">
                        {showDetails && (
                            <ProductDetails
                                product={product}
                                initialImages={[product.image_url, ...(product.images || [])].filter(Boolean)}
                            />
                        )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => setShowDetails(false)}>close</button>
                </form>
            </dialog>
        </>
    );
};

export default ProductCard;
