'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
    const { items } = useCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? 'text-accent font-semibold text-xl' : 'hover:text-accent font-semibold text-xl';
    };

    return (
        <div className="navbar glass shadow-md sticky top-0 z-50">
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-2xl font-extrabold tracking-tight">Online Store</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-4 ">
                    <li><Link href="/" className={isActive('/')}>Home</Link></li>
                    <li><Link href="/shop" className={isActive('/shop')}>Shop</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <Link href="/cart" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                {itemCount > 0 && (
                                    <span className="badge badge-sm badge-accent indicator-item">{itemCount}</span>
                                )}
                            </div>
                        </Link>
                    </li>
                    <li><Link href="/login">Login</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
