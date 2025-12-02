import React from 'react';

export default function ProductLoading() {
    return (
        <div className="mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                    {/* Image Gallery Skeleton */}
                    <div className="flex flex-col-reverse">
                        <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                            <div className="grid grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="relative h-24 bg-base-200 rounded-md flex items-center justify-center text-sm font-medium uppercase text-base-content cursor-pointer hover:bg-base-300 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50">
                                        <div className="skeleton w-full h-full rounded-md"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full aspect-square skeleton rounded-lg"></div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className="skeleton h-10 w-3/4 mb-4"></div>
                        <div className="skeleton h-8 w-1/4 mb-6"></div>

                        {/* Rating Skeleton */}
                        <div className="flex items-center mb-6">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="skeleton w-5 h-5 rounded-full"></div>
                                ))}
                            </div>
                            <div className="skeleton h-4 w-24 ml-4"></div>
                        </div>

                        <div className="skeleton h-32 w-full mb-8"></div>

                        {/* Add to Cart Skeleton */}
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="skeleton h-12 w-32 rounded-btn"></div>
                                <div className="skeleton h-12 w-full rounded-btn"></div>
                            </div>
                        </div>

                        {/* Additional Info Skeleton */}
                        <div className="mt-8 space-y-4">
                            <div className="skeleton h-6 w-1/3"></div>
                            <div className="skeleton h-6 w-1/2"></div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section Skeleton */}
                <div className="mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="skeleton h-8 w-48 mb-6"></div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="skeleton w-10 h-10 rounded-full"></div>
                                        <div className="space-y-2">
                                            <div className="skeleton h-4 w-32"></div>
                                            <div className="skeleton h-3 w-24"></div>
                                        </div>
                                    </div>
                                    <div className="skeleton h-16 w-full"></div>
                                </div>
                            ))}
                        </div>
                        <div className="lg:col-span-5">
                            <div className="skeleton h-64 w-full rounded-lg"></div>
                        </div>
                    </div>
                </div>

                {/* Related Products Skeleton */}
                <div className="my-16">
                    <div className="flex justify-between items-end mb-8">
                        <div className="skeleton h-8 w-48"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-3/4 w-full skeleton rounded-lg"></div>
                                <div className="space-y-2">
                                    <div className="skeleton h-4 w-3/4"></div>
                                    <div className="skeleton h-4 w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
