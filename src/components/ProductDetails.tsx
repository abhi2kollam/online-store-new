'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/utils/supabase/client';
import ImageGallery from '@/components/ImageGallery';

interface Variant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
    image_url?: string;
    images?: string[];
}

interface ProductDetailsProps {
    product: Product;
    initialImages: string[];
}

export default function ProductDetails({ product, initialImages }: ProductDetailsProps) {
    const supabase = createClient();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
    const [availableAttributes, setAvailableAttributes] = useState<Record<string, string[]>>({});
    const [loadingVariants, setLoadingVariants] = useState(false);

    useEffect(() => {
        const fetchVariants = async () => {
            if (product.product_type !== 'variant') return;

            setLoadingVariants(true);
            const { data: variantsData, error } = await supabase
                .from('product_variants')
                .select(`
                    id, sku, price, stock, image_url, images,
                    product_variant_attributes (
                        value,
                        attributes (name)
                    )
                `)
                .eq('product_id', product.id);

            if (error) {
                console.error('Error fetching variants:', error);
                setLoadingVariants(false);
                return;
            }

            // Transform data
            const formattedVariants: Variant[] = variantsData.map((v) => {
                const attributes: Record<string, string> = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                v.product_variant_attributes.forEach((pva: any) => {
                    attributes[pva.attributes.name] = pva.value;
                });
                return {
                    id: v.id,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    image_url: v.image_url,
                    images: v.images,
                    attributes
                };
            });

            setVariants(formattedVariants);

            // Extract available attributes
            const attrs: Record<string, Set<string>> = {};
            formattedVariants.forEach(v => {
                Object.entries(v.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            });

            const finalAttrs: Record<string, string[]> = {};
            Object.entries(attrs).forEach(([key, values]) => {
                finalAttrs[key] = Array.from(values);
            });
            setAvailableAttributes(finalAttrs);

            // Select first variant by default
            if (formattedVariants.length > 0) {
                const first = formattedVariants[0];
                setSelectedAttributes(first.attributes);
                setCurrentVariant(first);
            }
            setLoadingVariants(false);
        };

        fetchVariants();
    }, [product.id, product.product_type, supabase]);

    const handleAttributeSelect = (key: string, value: string) => {
        const newAttributes = { ...selectedAttributes, [key]: value };
        setSelectedAttributes(newAttributes);

        // Find matching variant
        const match = variants.find(v => {
            return Object.entries(newAttributes).every(([k, val]) => v.attributes[k] === val);
        });
        setCurrentVariant(match || null);
    };

    const displayPrice = currentVariant ? currentVariant.price : product.price;
    const displayStock = currentVariant ? currentVariant.stock : product.stock;
    const isOutOfStock = displayStock <= 0;

    // Determine images to display
    const displayImages = currentVariant?.images && currentVariant.images.length > 0
        ? currentVariant.images
        : (currentVariant?.image_url ? [currentVariant.image_url] : initialImages);

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <ImageGallery images={displayImages} name={product.name} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <div className="badge badge-accent mt-2">{product.categories?.name || product.category}</div>
                </div>
                <p className="text-2xl font-bold text-primary">${displayPrice.toFixed(2)}</p>
                <p className="text-lg text-base-content/80">{product.description}</p>

                {/* Variant Selectors */}
                {product.product_type === 'variant' && (
                    <div className="space-y-4">
                        {loadingVariants ? (
                            <div className="space-y-4 animate-pulse">
                                <div>
                                    <div className="h-6 bg-base-300 rounded w-20 mb-2"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-base-300 rounded w-16"></div>
                                        <div className="h-8 bg-base-300 rounded w-16"></div>
                                        <div className="h-8 bg-base-300 rounded w-16"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-6 bg-base-300 rounded w-20 mb-2"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 bg-base-300 rounded w-16"></div>
                                        <div className="h-8 bg-base-300 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            Object.entries(availableAttributes).map(([name, values]) => (
                                <div key={name}>
                                    <h3 className="font-bold mb-2">{name}</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {values.map(value => (
                                            <button
                                                key={value}
                                                className={`btn btn-sm ${selectedAttributes[name] === value ? 'btn-neutral' : 'btn-outline'}`}
                                                onClick={() => handleAttributeSelect(name, value)}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="divider"></div>

                <div className="flex gap-4">
                    <AddToCartButton
                        product={{
                            ...product,
                            price: displayPrice,
                            id: product.id // Ensure ID is passed
                        }}
                        variantId={currentVariant?.id}
                        disabled={isOutOfStock || (product.product_type === 'variant' && !currentVariant)}
                    />
                    <button className="btn btn-outline btn-accent">Add to Wishlist</button>
                </div>

                <div className={`mt-4 ${isOutOfStock ? 'text-error' : 'text-info'}`}>
                    <span>{isOutOfStock ? 'Out of Stock' : `Stock: ${displayStock} available`}</span>
                </div>
            </div>
        </div>
    );
}
