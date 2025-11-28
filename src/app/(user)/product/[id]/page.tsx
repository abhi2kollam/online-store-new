import { notFound } from 'next/navigation';
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

    // Ensure main image is first and remove duplicates
    const images = Array.from(new Set([product.image_url, ...(product.images || [])])).filter(Boolean) as string[];

    // Fetch related products (simple implementation for now)
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(4);

    return (
        <div className="mt-8">
            <ProductDetails product={product} initialImages={images} />

            {/* Explore More Section */}
            <div className="my-8">
                <h2 className="text-3xl font-bold mb-8">Explore More</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts?.map((relatedProduct) => (
                        <TrendingProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                </div>
            </div>
        </div>
    );
}
