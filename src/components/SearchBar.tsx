'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.replace(`/?${params.toString()}`);
        });
    };

    return (
        <div className="form-control w-full max-w-xs">
            <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered w-full md:w-auto"
                defaultValue={searchParams.get('q')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {isPending && <span className="loading loading-spinner loading-xs absolute right-2 top-3"></span>}
        </div>
    );
}
