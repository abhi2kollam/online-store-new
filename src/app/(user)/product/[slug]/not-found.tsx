import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="hero min-h-[70vh] bg-base-200 rounded-lg">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="flex justify-center mb-6">
                        <ShoppingBag className="w-24 h-24 text-base-content/20" />
                    </div>
                    <h1 className="text-5xl font-bold">Product Not Found</h1>
                    <p className="py-6">
                        The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/shop" className="btn btn-accent">
                            Back to Shop
                        </Link>
                        <Link href="/" className="btn btn-ghost">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
