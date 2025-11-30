'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function CategoryFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();
    const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            console.log('Fetching categories...');
            const { data, error } = await supabase.from('categories').select('name, slug').order('name');
            if (data) {
                setCategories(data);
            }
            if (error) {
                console.error('Error fetching categories:', error);
            }
            console.log('fteching Categories: complted with', data);
        };
        fetchCategories();
    }, [supabase]);

    const activeCategorySlug = searchParams.get('category') || 'all';

    const handleCategoryChange = (slug: string) => {
        const params = new URLSearchParams(searchParams);
        if (slug && slug !== 'all') {
            params.set('category', slug);
        } else {
            params.delete('category');
        }

        startTransition(() => {
            router.replace(`/shop?${params.toString()}`);
        });
    };

    return (
        <div className="tabs tabs-boxed bg-base-100 flex-wrap h-auto">
            <a
                className={`tab ${activeCategorySlug === 'all' ? 'tab-active' : ''}`}
                onClick={() => handleCategoryChange('all')}
            >
                All
            </a>
            {categories.map((category) => (
                <a
                    key={category.slug}
                    className={`tab ${activeCategorySlug === category.slug ? 'tab-active' : ''}`}
                    onClick={() => handleCategoryChange(category.slug)}
                >
                    {category.name}
                </a>
            ))}
        </div>
    );
}
