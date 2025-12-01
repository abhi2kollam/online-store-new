'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="flex justify-center mb-6">
                        <AlertTriangle className="w-24 h-24 text-error" />
                    </div>
                    <h1 className="text-5xl font-bold">Something went wrong!</h1>
                    <p className="py-6">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={
                                // Attempt to recover by trying to re-render the segment
                                () => reset()
                            }
                            className="btn btn-accent"
                        >
                            Try again
                        </button>
                        <Link href="/" className="btn btn-neutral">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
