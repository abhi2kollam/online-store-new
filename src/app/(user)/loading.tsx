import React from 'react';

export default function Loading() {
    return (
        <div className="space-y-16 pb-12">
            {/* Hero Section Skeleton */}
            <div className="w-full h-[600px] skeleton rounded-none"></div>

            {/* Service Highlights Skeleton */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 skeleton rounded-full"></div>
                            <div className="space-y-2 w-full flex flex-col items-center">
                                <div className="h-4 w-32 skeleton"></div>
                                <div className="h-3 w-48 skeleton"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Section Skeleton */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div className="h-8 w-48 skeleton"></div>
                    <div className="h-4 w-24 skeleton"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-3/4 w-full skeleton"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 skeleton"></div>
                                <div className="h-4 w-1/4 skeleton"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Section Skeleton */}
            <div className="container mx-auto px-4">
                <div className="h-8 w-48 skeleton mb-8 mx-auto"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="aspect-4/5 w-full skeleton"></div>
                    ))}
                </div>
            </div>

            {/* Deal Banner Skeleton */}
            <div className="w-full h-[400px] skeleton"></div>

            {/* New Arrivals Skeleton */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                    <div className="h-8 w-48 skeleton"></div>
                    <div className="h-4 w-24 skeleton"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-3/4 w-full skeleton"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 skeleton"></div>
                                <div className="h-4 w-1/4 skeleton"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter Skeleton */}
            <div className="container mx-auto px-4">
                <div className="w-full h-64 skeleton rounded-box"></div>
            </div>
        </div>
    );
}
