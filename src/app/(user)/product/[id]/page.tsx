import { notFound } from 'next/navigation';
import TrendingSection from '@/components/TrendingSection';
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
    const { data: relatedProductsData } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .limit(8);

    // Map to Product type
    const relatedProducts = relatedProductsData?.map(p => ({
        ...p,
        id: p.id.toString(),
        image_url: p.image_url,
        category: 'Uncategorized', // Default or fetch if needed
        images: p.images || [],
        description: p.description || '',
        stock: p.stock || 0
    })) || [];

    return (
        <div className="mt-8">
            <ProductDetails product={product} initialImages={images} />

            {/* Explore More Section */}
            <div className="my-8">
                {relatedProducts.length > 0 && (
                    <TrendingSection title="Explore More" products={relatedProducts} />
                )}
            </div>
        </div>
    );
}
