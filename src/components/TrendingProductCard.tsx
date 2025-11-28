import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface TrendingProductCardProps {
    product: Product;
}

const TrendingProductCard = ({ product }: TrendingProductCardProps) => {
    // Calculate a fake original price for the "Sale" look
    const originalPrice = (product.price * 1.2).toFixed(2);

    return (
        <Link href={`/product/${product.id}`} className="relative w-full h-[400px] rounded-3xl overflow-hidden group block">
            {/* Background Image */}
            <div className="absolute inset-0 bg-gray-200">
                <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Sale Badge */}
            <div className="absolute top-4 left-0">
                <span className="badge badge-accent text-white px-3 py-1 font-medium rounded-l-none">Sale</span>
            </div>

            {/* Floating Bottom Bar */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90  rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <div>
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        <span className="text-gray-400 line-through text-sm">${originalPrice}</span>
                    </div>
                </div>
                <div className="btn btn-circle btn-sm btn-ghost bg-gray-100 hover:bg-gray-200 text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
};

export default TrendingProductCard;
