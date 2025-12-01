'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

export default function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasFilters = searchParams.has('q') || (searchParams.has('category') && searchParams.get('category') !== 'all');

    const clearFilters = () => {
        router.push('/shop');
    };

    return (
        <div className="space-y-6 p-4 min-h-full bg-base-100 text-base-content w-80">
            {hasFilters && (
                <button
                    onClick={clearFilters}
                    className="btn btn-error btn-outline btn-sm w-full"
                >
                    Clear Filters
                </button>
            )}
            <div>
                <h3 className="font-bold text-lg mb-4">Search</h3>
                <SearchBar />
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4">Categories</h3>
                <CategoryFilter vertical />
            </div>
        </div>
    );
}
