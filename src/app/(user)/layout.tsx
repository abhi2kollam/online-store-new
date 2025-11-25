import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="footer footer-center p-4 bg-base-300 text-base-content">
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All right reserved by Online Store Ltd</p>
                    </aside>
                </footer>
            </div>
        </CartProvider>
    );
}
