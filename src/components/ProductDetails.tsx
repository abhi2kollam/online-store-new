'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/utils/supabase/client';
import ImageGallery from '@/components/ImageGallery';
import QuantitySelector from '@/components/QuantitySelector';

interface Variant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
    attributes_metadata?: Record<string, { type: string }>;
    image_url?: string;
    images?: string[];
    is_default?: boolean;
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
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchVariants = async () => {
            const supabase = createClient();
            if (product.product_type !== 'variant') return;

            setLoadingVariants(true);
            const { data: variantsData, error } = await supabase
                .from('product_variants')
                .select(`
                    id, sku, price, stock, image_url, images, is_default,
                    product_variant_attributes (
                        value,
                        attributes (name, type)
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
                const attributes_metadata: Record<string, { type: string }> = {};

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                v.product_variant_attributes.forEach((pva: any) => {
                    attributes[pva.attributes.name] = pva.value;
                    attributes_metadata[pva.attributes.name] = { type: pva.attributes.type };
                });
                return {
                    id: v.id,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    image_url: v.image_url,
                    images: v.images,
                    is_default: v.is_default,
                    attributes,
                    attributes_metadata
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

            // Select default variant or first variant
            if (formattedVariants.length > 0) {
                const defaultVariant = formattedVariants.find(v => v.is_default) || formattedVariants[0];
                setSelectedAttributes(defaultVariant.attributes);
                setCurrentVariant(defaultVariant);
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
    const variantImages = currentVariant
        ? Array.from(new Set([currentVariant.image_url, ...(currentVariant.images || [])])).filter(Boolean) as string[]
        : [];

    const displayImages = variantImages.length > 0 ? variantImages : initialImages;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="w-full overflow-hidden">
                <ImageGallery images={displayImages} name={product.name} />
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <div className="badge badge-accent mt-2">{product.categories?.name || product.category}</div>
                    {product.product_code && <p className="text-sm text-gray-500 mt-1">Product Code: {product.product_code}</p>}
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
                            Object.entries(availableAttributes).map(([name, values]) => {
                                // Find the attribute type from the first variant that has this attribute
                                const attributeType = variants.find(v => v.attributes[name])?.attributes_metadata?.[name]?.type || 'text';
                                const selectedValue = selectedAttributes[name];

                                return (
                                    <div key={name}>
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            {name}
                                            {attributeType === 'color' && selectedValue && (
                                                <span className="font-normal text-base-content/60 text-sm">
                                                    {selectedValue.includes('|') ? selectedValue.split('|')[0] : selectedValue}
                                                </span>
                                            )}
                                        </h3>
                                        <div className="flex gap-4 flex-wrap">
                                            {values.map(value => {
                                                const isSelected = selectedAttributes[name] === value;

                                                if (attributeType === 'color') {
                                                    const [colorName, hex] = value.includes('|') ? value.split('|') : [value, value];
                                                    return (
                                                        <button
                                                            key={value}
                                                            className={`w-10 h-10 rounded-full border border-base-300 shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isSelected ? 'ring-2 ring-primary ring-offset-2 scale-110' : ''
                                                                }`}
                                                            style={{ backgroundColor: hex }}
                                                            onClick={() => handleAttributeSelect(name, value)}
                                                            title={colorName}
                                                            aria-label={`Select color ${colorName}`}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={value}
                                                        className={`btn btn-sm ${isSelected ? 'btn-neutral' : 'btn-outline'}`}
                                                        onClick={() => handleAttributeSelect(name, value)}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                <div className="divider"></div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">Quantity:</span>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={() => setQuantity(q => q + 1)}
                            onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
                            max={isOutOfStock ? 0 : displayStock}
                        />
                    </div>

                    <div className="flex gap-4">
                        <AddToCartButton
                            product={{
                                ...product,
                                price: displayPrice,
                                id: product.id // Ensure ID is passed
                            }}
                            variantId={currentVariant?.id}
                            disabled={isOutOfStock || (product.product_type === 'variant' && !currentVariant)}
                            quantity={quantity}
                        />
                        <button className="btn btn-outline btn-accent">Add to Wishlist</button>
                    </div>
                </div>

                <div className={`mt-4 ${isOutOfStock ? 'text-error' : 'text-info'}`}>
                    <span>{isOutOfStock ? 'Out of Stock' : `Stock: ${displayStock} available`}</span>
                </div>
            </div>
        </div>
    );
}
