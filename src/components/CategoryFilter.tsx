'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [categories, setCategories] = useState<string[]>(['All']);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('name');
            if (data) {
                setCategories(['All', ...data.map(c => c.name)]);
            }
        };
        fetchCategories();
    }, []);

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
        <div className="tabs tabs-boxed bg-base-100 flex-wrap h-auto">
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
