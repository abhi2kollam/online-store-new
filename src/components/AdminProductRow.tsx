'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Product } from '@/types';

interface AdminProductRowProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: Product & { categories: { name: string } | null; product_variants: any[] };
}

export default function AdminProductRow({ product }: AdminProductRowProps) {
    const [expanded, setExpanded] = useState(false);
    const isVariant = product.product_type === 'variant';

    return (
        <>
            <tr className="hover">
                <td>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center">
                            {isVariant && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="btn btn-ghost btn-xs btn-circle"
                                >
                                    {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            )}
                        </div>
                        <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-base-300 flex items-center justify-center text-xs">No Img</div>
                                )}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div className="font-bold">{product.name}</div>
                </td>
                <td>{product.categories?.name || 'Uncategorized'}</td>
                <td>
                    {isVariant ? (
                        (() => {
                            const variants = product.product_variants;
                            if (!variants || variants.length === 0) return 'N/A';
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const prices = variants.map((v: any) => v.price);
                            const min = Math.min(...prices);
                            const max = Math.max(...prices);
                            return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
                        })()
                    ) : (
                        `$${product.price.toFixed(2)}`
                    )}
                </td>
                <td>
                    {isVariant ? (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        product.product_variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0
                    ) : (
                        product.stock
                    )}
                </td>
                <td>
                    <Link href={`/admin/products/${product.id}`} className="btn btn-sm btn-ghost">
                        Edit
                    </Link>
                    <button className="btn btn-sm btn-ghost text-error">Delete</button>
                </td>
            </tr>
            {expanded && isVariant && (
                <tr>
                    <td colSpan={6} className="bg-base-200/50 p-0">
                        <div className="p-4 pl-16">
                            <table className="table table-sm bg-base-100 rounded-lg">
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Attributes</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {product.product_variants?.map((variant: any) => (
                                        <tr key={variant.id}>
                                            <td className="font-mono text-xs">{variant.sku}</td>
                                            <td>
                                                {/* Fetching attributes might require joining in the parent query or we can just show what we have if we fetched it */}
                                                {/* For now, we might not have attribute names if we didn't fetch deep enough. 
                                                    Let's check the query in page.tsx. It fetches product_variants(price, stock). 
                                                    We need to update page.tsx to fetch more details if we want to show them here.
                                                    Assuming we will update the query to fetch sku and attributes.
                                                */}
                                                {variant.product_variant_attributes?.map((pva: any) => (
                                                    <span key={pva.id} className="badge badge-ghost badge-sm mr-1">
                                                        {pva.value}
                                                    </span>
                                                ))}
                                            </td>
                                            <td>${variant.price.toFixed(2)}</td>
                                            <td>{variant.stock}</td>
                                            <td>
                                                {variant.image_url && (
                                                    <div className="avatar">
                                                        <div className="w-8 h-8 rounded">
                                                            <Image src={variant.image_url} alt={variant.sku} width={32} height={32} />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
