import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="btn btn-ghost p-0 hover:bg-transparent">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                                <path d="M10 3H6C4.34315 3 3 4.34315 3 6V10C3 11.6569 4.34315 13 6 13H10C11.6569 13 13 11.6569 13 10V6C13 4.34315 11.6569 3 10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18 3H14C12.3431 3 11 4.34315 11 6V10C11 11.6569 12.3431 13 14 13H18C19.6569 13 21 11.6569 21 10V6C21 4.34315 19.6569 3 18 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 11H6C4.34315 11 3 12.3431 3 14V18C3 19.6569 4.34315 21 6 21H10C11.6569 21 13 19.6569 13 18V14C13 12.3431 11.6569 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18 11H14C12.3431 11 11 12.3431 11 14V18C11 19.6569 12.3431 21 14 21H18C19.6569 21 21 19.6569 21 18V14C21 12.3431 19.6569 11 18 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <h3 className="text-xl font-bold text-black">Online Store</h3>
                        <p className="text-sm text-gray-500">
                            Copyright 2025 © All rights reserved
                        </p>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Collections</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shop?category=Men" className="hover:text-black transition-colors">Men&apos;s Wear</Link></li>
                            <li><Link href="/shop?category=Women" className="hover:text-black transition-colors">Women&apos;s Wear</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Trending collections</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Best sellers</Link></li>
                        </ul>
                    </div>

                    {/* Pages */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Pages</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-black transition-colors">About us</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/" className="hover:text-black transition-colors">Terms of use</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Privacy policy</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Cookie policy</Link></li>
                        </ul>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
