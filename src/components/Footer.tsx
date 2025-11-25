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
                        <h3 className="text-xl font-bold">Online Store</h3>
                        <p className="text-sm text-gray-500">
                            Copyright 2025 © All rights reserved
                        </p>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Collections</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shop?category=Men" className="hover:text-black transition-colors">Men's Wear</Link></li>
                            <li><Link href="/shop?category=Women" className="hover:text-black transition-colors">Women's Wear</Link></li>
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

                {/* Payment Methods */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-gray-900 uppercase text-sm tracking-wider">Payments Methods</h4>
                        <div className="flex gap-4">
                            {/* Mastercard */}
                            <div className="w-10 h-6 border rounded flex items-center justify-center">
                                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="24" height="24"><path d="M22.5 12c0-2.3-1.1-4.4-2.9-5.8 1.6-1.1 3.5-1.8 5.6-1.8 5.5 0 10 4.5 10 10s-4.5 10-10 10c-2.1 0-4-.7-5.6-1.8 1.8-1.4 2.9-3.5 2.9-5.8zm-9 0c0 2.3 1.1 4.4 2.9 5.8-1.6 1.1-3.5 1.8-5.6 1.8-5.5 0-10-4.5-10-10S5.3 4.4 10.8 4.4c2.1 0 4 .7 5.6 1.8-1.8 1.4-2.9 3.5-2.9 5.8z" fill="#EB001B" /><path d="M22.5 12c0-2.3-1.1-4.4-2.9-5.8-1.8 1.4-2.9 3.5-2.9 5.8s1.1 4.4 2.9 5.8c1.8-1.4 2.9-3.5 2.9-5.8z" fill="#F79E1B" /></svg>
                            </div>
                            {/* Visa */}
                            <div className="w-10 h-6 border rounded flex items-center justify-center">
                                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="24" height="24"><path d="M14.7 19.9l2.3-14.2h3.7l-2.3 14.2zm10.7-13.8c-.5-.2-1.3-.3-2.4-.3-2.6 0-4.5 1.4-4.5 3.3 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.4.8 1.4 1.3 0 .7-.8 1-1.6 1-1.1 0-1.6-.2-2.5-.5l-.4-.2-.4 2.5c.7.3 1.9.6 3.2.6 3 0 5-1.5 5-3.8 0-1.3-.8-2.3-2.5-3.1-1-.5-1.7-.8-1.7-1.3 0-.4.5-.9 1.5-.9.9 0 1.5.1 2 .3l.3 1.4zm6.6-3.1h-2.8c-.9 0-1.6.3-1.9 1.3l-5.5 13h3.9l.8-2.2h4.7l.4 2.2h3.5l-3.1-14.3zm-3.3 9.7l1.6-7.7h.1l.9 4.4-2.6 3.3zm-16.7-9.7h-3.9l-2.5 11.2c-.1.3-.2.5-.2.8h4.1l2.5-12z" fill="#1434CB" /><path d="M6.9 6.1l-2.5 12h-4.1l2.5-12z" fill="#1434CB" /></svg>
                            </div>
                            {/* PayPal */}
                            <div className="w-10 h-6 flex items-center justify-center">
                                <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="24" height="24"><path d="M13.6 17.8h-2.6c-.3 0-.5.2-.6.5l-3.2 14.8c-.1.3.2.6.5.6h2.2c.3 0 .5-.2.6-.5l.5-2.6h1.2c3.4 0 6.1-2.7 6.1-6.1 0-3.3-2.7-6.1-6.1-6.1-.2 0-.4 0-.6.1l-.2.1-.2.1c-.2.1-.4.1-.6.1zm0 0" fill="#003087" /><path d="M13.6 17.8h-2.6c-.3 0-.5.2-.6.5l-3.2 14.8c-.1.3.2.6.5.6h2.2c.3 0 .5-.2.6-.5l.5-2.6h1.2c3.4 0 6.1-2.7 6.1-6.1 0-3.3-2.7-6.1-6.1-6.1-.2 0-.4 0-.6.1l-.2.1-.2.1c-.2.1-.4.1-.6.1zm0 0" fill="#003087" /><path d="M13.6 17.8h-2.6c-.3 0-.5.2-.6.5l-3.2 14.8c-.1.3.2.6.5.6h2.2c.3 0 .5-.2.6-.5l.5-2.6h1.2c3.4 0 6.1-2.7 6.1-6.1 0-3.3-2.7-6.1-6.1-6.1-.2 0-.4 0-.6.1l-.2.1-.2.1c-.2.1-.4.1-.6.1zm0 0" fill="#003087" /><path d="M13.6 17.8h-2.6c-.3 0-.5.2-.6.5l-3.2 14.8c-.1.3.2.6.5.6h2.2c.3 0 .5-.2.6-.5l.5-2.6h1.2c3.4 0 6.1-2.7 6.1-6.1 0-3.3-2.7-6.1-6.1-6.1-.2 0-.4 0-.6.1l-.2.1-.2.1c-.2.1-.4.1-.6.1zm0 0" fill="#003087" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
