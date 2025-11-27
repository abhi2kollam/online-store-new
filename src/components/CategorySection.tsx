'use client';

import { useRef } from 'react';
import Link from 'next/link';

interface Category {
    id: string;
    name: string;
    image_url: string;
}

interface CategorySectionProps {
    categories: Category[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Shop By Categories</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="btn btn-circle btn-sm bg-gray-200 hover:bg-gray-300 border-none text-gray-700 transition-colors"
                        aria-label="Previous categories"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="btn btn-circle btn-sm bg-gray-200 hover:bg-gray-300 border-none text-gray-700 transition-colors"
                        aria-label="Next categories"
                    >
                        ❯
                    </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => (
                    <div key={category.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                        <Link href={`/shop?category=${category.name}`} className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer block">
                            <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full flex items-center gap-2 transition-transform group-hover:scale-105">
                                <span className="font-semibold text-black whitespace-nowrap">{category.name}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
