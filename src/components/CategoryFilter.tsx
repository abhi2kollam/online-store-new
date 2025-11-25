'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const categories = ['All', 'Men', 'Women', 'Sports', 'Electronics', 'Accessories'];

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const activeCategory = searchParams.get('category') || 'All';

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        if (category && category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }

        startTransition(() => {
            router.replace(`/shop?${params.toString()}`);
        });
    };

    return (
        <div className="tabs tabs-boxed bg-base-100">
            {categories.map((category) => (
                <a
                    key={category}
                    className={`tab ${activeCategory === category ? 'tab-active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                >
                    {category}
                </a>
            ))}
        </div>
    );
}
