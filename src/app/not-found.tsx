import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="flex justify-center mb-6">
                        <FileQuestion className="w-24 h-24 text-base-content/20" />
                    </div>
                    <h1 className="text-5xl font-bold">Page Not Found</h1>
                    <p className="py-6">
                        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                    <Link href="/" className="btn btn-accent">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
