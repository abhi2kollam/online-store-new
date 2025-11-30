'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types';

export default function CategoryMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (data) {
                const categoryMap = new Map<number, Category>();
                const roots: Category[] = [];

                // First pass: create nodes
                data.forEach((cat: any) => {
                    categoryMap.set(cat.id, { ...cat, children: [] });
                });

                // Second pass: build tree
                data.forEach((cat: any) => {
                    if (cat.parent_id) {
                        const parent = categoryMap.get(cat.parent_id);
                        if (parent) {
                            parent.children?.push(categoryMap.get(cat.id)!);
                        }
                    } else {
                        roots.push(categoryMap.get(cat.id)!);
                    }
                });

                setCategories(roots);
            }
        };
        fetchCategories();
    }, []);

    const renderCategory = (category: Category) => {
        if (category.children && category.children.length > 0) {
            return (
                <li key={category.id}>
                    <details>
                        <summary>
                            <Link href={`/shop?category=${category.slug}`}>{category.name}</Link>
                        </summary>
                        <ul className="p-2 bg-base-100 min-w-[200px] z-[60]">
                            {category.children.map(renderCategory)}
                        </ul>
                    </details>
                </li>
            );
        }
        return (
            <li key={category.id}>
                <Link href={`/shop?category=${category.slug}`}>{category.name}</Link>
            </li>
        );
    };

    const detailsRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
                detailsRef.current.open = false;
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (categories.length === 0) return null;

    return (
        <li>
            <details ref={detailsRef}>
                <summary className='hover:text-accent font-semibold text-xl'>Categories</summary>
                <ul className="p-2 bg-base-100 rounded-t-none min-w-[200px] z-50">
                    {categories.map(renderCategory)}
                </ul>
            </details>
        </li>
    );
}
