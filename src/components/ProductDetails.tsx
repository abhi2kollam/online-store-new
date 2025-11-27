'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/services/mockData'; // We'll update this type later
import AddToCartButton from '@/components/AddToCartButton';
import { createClient } from '@/utils/supabase/client';

interface Variant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
}

interface ProductDetailsProps {
    product: any; // Using any for now to handle Supabase data structure
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const supabase = createClient();
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [currentVariant, setCurrentVariant] = useState<Variant | null>(null);
    const [availableAttributes, setAvailableAttributes] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchVariants = async () => {
            if (product.product_type !== 'variant') return;

            const { data: variantsData, error } = await supabase
                .from('product_variants')
                .select(`
                    id, sku, price, stock,
                    product_variant_attributes (
                        value,
                        attributes (name)
                    )
                `)
                .eq('product_id', product.id);

            if (error) {
                console.error('Error fetching variants:', error);
                return;
            }

            // Transform data
            const formattedVariants: Variant[] = variantsData.map((v: any) => {
                const attributes: Record<string, string> = {};
                v.product_variant_attributes.forEach((pva: any) => {
                    attributes[pva.attributes.name] = pva.value;
                });
                return {
                    id: v.id,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
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
        };

        fetchVariants();
    }, [product.id, product.product_type]);

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

    return (
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
                    {Object.entries(availableAttributes).map(([name, values]) => (
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
                    ))}
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
    );
}
