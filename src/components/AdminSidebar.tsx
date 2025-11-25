'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/categories', label: 'Categories' },
        { href: '/admin/products', label: 'Products' },
        { href: '/admin/orders', label: 'Orders' },
        { href: '/admin/users', label: 'Users' },
    ];

    return (
        <div className="drawer-side z-20">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li className="mb-4">
                    <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
                </li>
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={pathname === link.href ? 'menu-active' : ''}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
                <div className="divider"></div>
                <li><Link href="/">Back to Store</Link></li>
            </ul>
        </div>
    );
}
