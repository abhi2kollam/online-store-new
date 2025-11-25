import { getProductById } from '@/services/mockData';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-96 md:h-[600px] w-full">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                />
            </div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <div className="badge badge-secondary mt-2">{product.category}</div>
                </div>
                <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                <p className="text-lg text-base-content/80">{product.description}</p>

                <div className="divider"></div>

                <div className="flex gap-4">
                    <AddToCartButton product={product} />
                    <button className="btn btn-outline btn-secondary">Add to Wishlist</button>
                </div>

                <div className="alert alert-info mt-4">
                    <span>Stock: {product.stock} available</span>
                </div>

                <div className="mt-8">
                    <Link href="/" className="btn btn-ghost">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
