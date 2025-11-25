import { getProductById, getProducts } from '@/services/mockData';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
import ImageGallery from '@/components/ImageGallery';
import TrendingProductCard from '@/components/TrendingProductCard';

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

    // Fallback if images array is empty (shouldn't happen with updated mock data but good for safety)
    const images = product.images && product.images.length > 0 ? product.images : [product.image];

    return (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
            <ImageGallery images={images} name={product.name} />
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

                <div className="text-info mt-4">
                    <span>Stock: {product.stock} available</span>
                </div>

                <div className="mt-8">
                    <Link href="/" className="btn btn-ghost">
                        ← Back to Products
                    </Link>
                </div>
            </div>

            {/* Explore More Section */}
            <div className="col-span-1 md:col-span-2 my-8">
                <h2 className="text-3xl font-bold mb-8">Explore More</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Filter out current product and show up to 4 related products */}
                    {(await getProducts(undefined, product.category))
                        .filter((p) => p.id !== product.id)
                        .slice(0, 4)
                        .map((relatedProduct) => (
                            <TrendingProductCard key={relatedProduct.id} product={relatedProduct} />
                        ))}
                </div>
            </div>
        </div>
    );
}
