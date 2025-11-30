'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';

export default function MobileSidebar() {
    const pathname = usePathname();
    const { closeMenu } = useMobileMenu();

    return (
        <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
            <li><Link href="/" onClick={closeMenu} className={pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link href="/shop" onClick={closeMenu} className={pathname === '/shop' ? 'active' : ''}>Shop</Link></li>
        </ul>
    );
}
