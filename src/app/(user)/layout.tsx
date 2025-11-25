import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
                <Footer />
            </div>
        </CartProvider>
    );
}
