'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SearchResult {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    price: number;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const router = useRouter();

    // Focus input when drawer opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.trim().length > 1) {
                setIsLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('id, name, slug, image_url, price')
                        .ilike('name', `%${searchTerm}%`)
                        .limit(6);

                    if (data) {
                        setResults(data);
                    }
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, supabase]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm) {
            onClose();
            router.push(`/shop?q=${encodeURIComponent(searchTerm)}`);
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal modal-top ${isOpen ? 'modal-open' : ''} items-start`}>
            <div className="modal-box w-full max-w-none rounded-none p-0 bg-base-100 shadow-xl">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4" onClick={onClose}>✕</button>
                </form>

                <div className="container mx-auto px-4 py-6">
                    {/* Search Header */}
                    <div className="flex items-center gap-4 mb-6 pr-12">
                        <Search className="w-6 h-6 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for products..."
                            className="flex-1 text-2xl font-medium bg-transparent border-none focus:ring-0 placeholder:text-gray-300 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="divider mt-0"></div>

                    {/* Results Area */}
                    <div className="min-h-[200px] max-h-[60vh] overflow-y-auto pb-8">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : results.length > 0 ? (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                                    Products
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.slug}`}
                                            onClick={onClose}
                                            className="group block"
                                        >
                                            <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 mb-3">
                                                {product.image_url ? (
                                                    <Image
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 768px) 50vw, 16vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Search className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-sm font-bold mt-1">
                                                ${product.price}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            router.push(`/shop?q=${encodeURIComponent(searchTerm)}`);
                                        }}
                                        className="btn btn-link no-underline text-primary"
                                    >
                                        View all results for "{searchTerm}"
                                    </button>
                                </div>
                            </div>
                        ) : searchTerm.length > 1 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>No products found for "{searchTerm}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>Start typing to search...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </div>
    );
}
