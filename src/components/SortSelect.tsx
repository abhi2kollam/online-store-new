'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', sort);

        startTransition(() => {
            router.replace(`/shop?${params.toString()}`);
        });
    };

    return (
        <select
            className="select select-bordered w-full max-w-xs"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
        >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rating</option>
        </select>
    );
}
