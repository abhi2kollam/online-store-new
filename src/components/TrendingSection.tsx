'use client';

import { useRef } from 'react';
import TrendingProductCard from './TrendingProductCard';
import { Product } from '@/types';
import ScrollAnimation from './ScrollAnimation';

interface TrendingSectionProps {
    title: string;
    products: Product[];
}

const TrendingSection = ({ title, products }: TrendingSectionProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // Adjust scroll amount as needed
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
                <h2 className="text-3xl font-bold">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="btn btn-circle btn-sm bg-gray-200 hover:bg-gray-300 border-none text-gray-700 transition-colors"
                        aria-label="Previous items"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="btn btn-circle btn-sm bg-gray-200 hover:bg-gray-300 border-none text-gray-700 transition-colors"
                        aria-label="Next items"
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
                {products.map((product, index) => (
                    <ScrollAnimation key={product.id} delay={index * 0.1} className="min-w-[280px] sm:min-w-[320px] snap-start h-full">
                        <TrendingProductCard product={product} />
                    </ScrollAnimation>
                ))}
            </div>
        </section>
    );
};

export default TrendingSection;
