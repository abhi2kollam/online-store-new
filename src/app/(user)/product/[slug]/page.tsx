import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import TrendingSection from '@/components/TrendingSection';
import ProductDetails from '@/components/ProductDetails';
import ReviewList from '@/components/ReviewList';
import ReviewForm from '@/components/ReviewForm';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('name, description')
        .eq('slug', slug)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found',
            description: 'The product you are looking for does not exist.',
        };
    }

    return {
        title: product.name,
        description: product.description || `Buy ${product.name} at Online Store.`,
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch product from Supabase
    const { data: product, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('slug', slug)
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
        .neq('id', product.id)
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

            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7">
                        <ReviewList
                            productId={product.id.toString()}
                            initialAverage={product.rating_avg}
                            initialCount={product.rating_count}
                        />
                    </div>
                    <div className="lg:col-span-5">
                        <div className="sticky top-24">
                            <ReviewForm productId={product.id.toString()} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Explore More Section */}
            <div className="my-8">
                {relatedProducts.length > 0 && (
                    <TrendingSection title="Explore More" products={relatedProducts} />
                )}
            </div>
        </div>
    );
}
