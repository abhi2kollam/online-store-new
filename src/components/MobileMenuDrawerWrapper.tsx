'use client';

import { ReactNode } from 'react';
import { useMobileMenu } from '@/context/MobileMenuContext';
import MobileSidebar from './MobileSidebar';

export default function MobileMenuDrawerWrapper({ children }: { children: ReactNode }) {
    const { isOpen, closeMenu } = useMobileMenu();

    return (
        <div className="drawer">
            <input
                id="mobile-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={() => { }} // Handled by context
            />
            <div className="drawer-content flex flex-col min-h-screen">
                {children}
            </div>
            <div className="drawer-side z-50 top-[64px] h-[calc(100vh-64px)]">
                <label
                    htmlFor="mobile-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                    onClick={closeMenu}
                ></label>
                <MobileSidebar />
            </div>
        </div>
    );
}
