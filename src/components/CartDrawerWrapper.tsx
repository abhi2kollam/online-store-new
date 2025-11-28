'use client';

import { ReactNode } from 'react';
import CartDrawerContent from './CartDrawerContent';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function CartDrawerWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const checkboxRef = useRef<HTMLInputElement>(null);

    // Close drawer on route change
    useEffect(() => {
        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
    }, [pathname]);

    return (
        <div className="drawer drawer-end">
            <input id="cart-drawer" type="checkbox" className="drawer-toggle" ref={checkboxRef} />
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Page content here */}
                {children}
            </div>
            <div className="drawer-side z-100">
                <label htmlFor="cart-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <CartDrawerContent />
            </div>
        </div>
    );
}
