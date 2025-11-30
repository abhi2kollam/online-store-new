'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';

const Navbar = () => {
    const { items } = useCart();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const { isOpen, toggleMenu } = useMobileMenu();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const isActive = (path: string) => {
        return pathname === path ? 'text-accent font-semibold text-xl' : 'hover:text-accent font-semibold text-xl';
    };

    return (
        <>
            <div className="navbar glass shadow-md sticky top-0 z-50">
                <div className="navbar-start">
                    <button
                        className="btn btn-ghost md:hidden"
                        onClick={toggleMenu}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <Link href="/" className="btn btn-ghost text-accent text-2xl font-extrabold tracking-tight">Online Store</Link>
                </div>
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal px-1 gap-4 ">
                        <li><Link href="/" className={isActive('/')}>Home</Link></li>
                        <li><Link href="/shop" className={isActive('/shop')}>Shop</Link></li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <ul className="menu menu-horizontal items-center px-1 gap-2">
                        <li>
                            <label htmlFor="cart-drawer" className="btn btn-ghost btn-circle drawer-button">
                                <div className="indicator">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    {itemCount > 0 && (
                                        <span className="badge badge-sm badge-accent indicator-item">{itemCount}</span>
                                    )}
                                </div>
                            </label>
                        </li>
                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                                    <div className=" rounded-full w-10 flex items-center justify-center">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                    <li>
                                        <Link href="/profile" className="justify-between">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-4 h-4" />
                                                Profile
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-error">
                                            <div className="flex items-center gap-2">
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <li><Link href="/login" className="btn btn-neutral btn-sm">Login</Link></li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
