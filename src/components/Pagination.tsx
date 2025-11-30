'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="join flex justify-center mt-8">
            <button
                className="join-item btn"
                disabled={currentPage <= 1}
                onClick={() => router.push(createPageURL(currentPage - 1))}
            >
                «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    className={`join-item btn ${currentPage === page ? 'btn-active' : ''}`}
                    onClick={() => router.push(createPageURL(page))}
                >
                    {page}
                </button>
            ))}

            <button
                className="join-item btn"
                disabled={currentPage >= totalPages}
                onClick={() => router.push(createPageURL(currentPage + 1))}
            >
                »
            </button>
        </div>
    );
}
