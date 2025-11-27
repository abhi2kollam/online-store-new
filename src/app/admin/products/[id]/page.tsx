import ProductForm from '@/components/ProductForm';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !product) {
        notFound();
    }

    // Transform database product to match ProductForm expected format if needed
    // But ProductForm expects Product interface which matches DB mostly.
    // However, ProductForm expects 'images' as string[], DB has it as string[] (jsonb or array).
    // Let's check DB schema. 'images' is text[] or jsonb?
    // In schema it is text[].
    // ProductForm expects 'category' as string name. DB has 'category_id'.
    // We need to fetch category name.

    const { data: categoryData } = await supabase
        .from('categories')
        .select('name')
        .eq('id', product.category_id)
        .single();

    const transformedProduct = {
        ...product,
        category: categoryData?.name || '',
        image: product.image_url, // DB has image_url, Form expects image
        images: product.images || [],
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <ProductForm initialData={transformedProduct} isEdit />
        </div>
    );
}
