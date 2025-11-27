import Link from 'next/link';
import { notFound } from 'next/navigation';
import ImageGallery from '@/components/ImageGallery';
import TrendingProductCard from '@/components/TrendingProductCard';
import ProductDetails from '@/components/ProductDetails';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch product from Supabase
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .single();

    if (error || !product) {
        console.error('Error fetching product:', error);
        notFound();
    }

    // Fallback if images array is empty
    const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

    // Fetch related products (simple implementation for now)
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(4);

    return (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
            <ImageGallery images={images} name={product.name} />

            <ProductDetails product={product} />

            {/* Explore More Section */}
            <div className="col-span-1 md:col-span-2 my-8">
                <h2 className="text-3xl font-bold mb-8">Explore More</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts?.map((relatedProduct: any) => (
                        <TrendingProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
            </div>
        </div>
    );
}
