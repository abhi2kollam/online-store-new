'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, Layers, Package, ShoppingCart, Users, Store } from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/categories', label: 'Categories', icon: Layers },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/users', label: 'Users', icon: Users },
    ];

    return (
        <div className="drawer-side z-20">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li className="mb-4">
                    <Link href="/admin" className="text-xl font-bold px-2">Admin Panel</Link>
                </li>
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={pathname === link.href ? 'active' : ''}
                            >
                                <Icon size={20} />
                                {link.label}
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
            </ul>
        </div>
    );
}
