import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';
import { createClient } from '@/utils/supabase/client';
import { Category } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function MobileSidebar() {
    const pathname = usePathname();
    const { closeMenu } = useMobileMenu();
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

    const CategoryItem = ({ category }: { category: Category }) => {
        const [isOpen, setIsOpen] = useState(false);
        const hasChildren = category.children && category.children.length > 0;

        return (
            <li>
                {hasChildren ? (
                    <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
                        <summary className="justify-between">
                            <Link href={`/shop?category=${category.slug}`} onClick={closeMenu}>
                                {category.name}
                            </Link>
                        </summary>
                        <ul>
                            {category.children!.map((child) => (
                                <CategoryItem key={child.id} category={child} />
                            ))}
                        </ul>
                    </details>
                ) : (
                    <Link href={`/shop?category=${category.slug}`} onClick={closeMenu} className={pathname === `/shop?category=${category.slug}` ? 'active' : ''}>
                        {category.name}
                    </Link>
                )}
            </li>
        );
    };

    return (
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
            <li><Link href="/" onClick={closeMenu} className={pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link href="/shop" onClick={closeMenu} className={pathname === '/shop' ? 'active' : ''}>Shop All</Link></li>
            <div className="divider">Categories</div>
            {categories.map((category) => (
                <CategoryItem key={category.id} category={category} />
            ))}
        </ul>
    );
}
