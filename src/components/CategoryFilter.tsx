'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CategoryFilterProps {
    vertical?: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
    children?: Category[];
}

export default function CategoryFilter({ vertical = false }: CategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();
    const [categories, setCategories] = useState<Category[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, slug, parent_id')
                .order('name');

            if (data) {
                const categoryMap = new Map<number, Category>();
                const roots: Category[] = [];

                // First pass: create nodes
                data.forEach((cat) => {
                    categoryMap.set(cat.id, { ...cat, children: [] });
                });

                // Second pass: build tree
                data.forEach((cat) => {
                    const node = categoryMap.get(cat.id)!;
                    if (cat.parent_id) {
                        const parent = categoryMap.get(cat.parent_id);
                        if (parent) {
                            parent.children?.push(node);
                        } else {
                            // Handle orphan or missing parent case if necessary
                            roots.push(node);
                        }
                    } else {
                        roots.push(node);
                    }
                });

                setCategories(roots);
            }
            if (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

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

    const renderCategoryItem = (category: Category) => {
        const hasChildren = category.children && category.children.length > 0;
        const isActive = activeCategorySlug === category.slug;

        if (hasChildren) {
            return (
                <li key={category.slug}>
                    <details open={true}>
                        <summary
                            className={`${isActive ? 'active font-bold' : ''}`}
                        >
                            <span onClick={(e) => {
                                e.preventDefault();
                                handleCategoryChange(category.slug);
                            }}>
                                {category.name}
                            </span>
                        </summary>
                        <ul>
                            {category.children!.map((child) => renderCategoryItem(child))}
                        </ul>
                    </details>
                </li>
            );
        }

        return (
            <li key={category.slug}>
                <a
                    className={isActive ? 'active' : ''}
                    onClick={() => handleCategoryChange(category.slug)}
                >
                    {category.name}
                </a>
            </li>
        );
    };

    if (vertical) {
        return (
            <ul className="menu bg-base-100 w-full rounded-box p-0">
                <li>
                    <a
                        className={activeCategorySlug === 'all' ? 'active' : ''}
                        onClick={() => handleCategoryChange('all')}
                    >
                        All Categories
                    </a>
                </li>
                {categories.map((category) => renderCategoryItem(category))}
            </ul>
        );
    }

    // Fallback for horizontal view (flattened or just top level? Keeping simple for now)
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
