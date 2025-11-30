'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, Layers, Package, ShoppingCart, Users, Store, LogOut, Image } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        {
            label: 'Products',
            icon: Package,
            children: [
                { href: '/admin/products', label: 'List' },
                { href: '/admin/attributes', label: 'Attributes' },
                { href: '/admin/reviews', label: 'Reviews' },
            ]
        },
        { href: '/admin/categories', label: 'Categories', icon: Layers },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/users', label: 'Users', icon: Users },
        {
            label: 'Media',
            icon: Image,
            children: [
                { href: '/admin/media/products', label: 'Products' },
                { href: '/admin/media/promotions', label: 'Promotions' },
            ]
        },
    ];

    return (
        <div className="drawer-side z-20">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li className="mb-4">
                    <Link href="/admin" className="text-xl font-bold px-2">Admin Panel</Link>
                </li>
                {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || (link.children && link.children.some(child => pathname === child.href));

                    if (link.children) {
                        return (
                            <li key={index}>
                                <details open>
                                    <summary>
                                        <Icon size={20} />
                                        {link.label}
                                    </summary>
                                    <ul>
                                        {link.children.map((child) => (
                                            <li key={child.href}>
                                                <Link
                                                    href={child.href}
                                                    className={pathname === child.href ? 'menu-active' : ''}
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </li>
                        );
                    }

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href!}
                                className={pathname === link.href ? 'menu-active' : ''}
                            >
                                <Icon size={20} />
                                <span className="flex-1">{link.label}</span>
                            </Link>
                        </li>
                    );
                })}
                <div className="divider"></div>
                <li>
                    <Link href="/">
                        <Store size={20} />
                        Back to Store
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="text-error">
                        <LogOut size={20} />
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}
