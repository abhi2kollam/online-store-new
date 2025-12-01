import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileMenuDrawerWrapper from '@/components/MobileMenuDrawerWrapper';
import { MobileMenuProvider } from '@/context/MobileMenuContext';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MobileMenuProvider>
            <MobileMenuDrawerWrapper>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="grow container mx-auto px-4 py-4">
                        {children}
                    </main>
                    <Footer />
                </div>
            </MobileMenuDrawerWrapper>
        </MobileMenuProvider>
    );
}
