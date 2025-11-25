import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/services/mockData';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure>
                <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {product.name}
                    <div className="badge badge-secondary">{product.category}</div>
                </h2>
                <p className="line-clamp-2">{product.description}</p>
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    <Link href={`/product/${product.id}`} className="btn btn-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
