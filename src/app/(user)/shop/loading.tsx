import React from 'react';

export default function ShopLoading() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="shop-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col px-4 py-8">
                {/* Top Toolbar Skeleton */}
                <div className="flex flex-row justify-between items-center mb-6 gap-4">
                    <div className='flex flex-col gap-2'>
                        {/* Mobile Filter Button Skeleton */}
                        <div className="lg:hidden mb-2">
                            <div className="skeleton h-8 w-24 rounded-btn"></div>
                        </div>
                        {/* Results Count Skeleton */}
                        <div className="skeleton h-4 w-48"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Sort Icon Skeleton */}
                        <div className="skeleton w-8 h-8 rounded-full"></div>
                        {/* Sort Select Skeleton */}
                        <div className="skeleton h-10 w-40 rounded-btn"></div>
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl h-full">
                            <figure className="relative pt-[100%]">
                                <div className="absolute top-0 left-0 w-full h-full skeleton rounded-none"></div>
                            </figure>
                            <div className="card-body p-4">
                                {/* Category Skeleton */}
                                <div className="skeleton h-3 w-20 mb-2"></div>
                                {/* Title Skeleton */}
                                <div className="skeleton h-6 w-full mb-2"></div>
                                <div className="skeleton h-6 w-3/4 mb-2"></div>
                                {/* Rating Skeleton */}
                                <div className="flex gap-1 mb-3">
                                    <div className="skeleton w-4 h-4 rounded-full"></div>
                                    <div className="skeleton w-4 h-4 rounded-full"></div>
                                    <div className="skeleton w-4 h-4 rounded-full"></div>
                                    <div className="skeleton w-4 h-4 rounded-full"></div>
                                    <div className="skeleton w-4 h-4 rounded-full"></div>
                                </div>
                                {/* Price Skeleton */}
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="skeleton h-8 w-24"></div>
                                    <div className="skeleton h-10 w-10 rounded-btn"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="mt-8 flex justify-center gap-2">
                    <div className="skeleton h-10 w-10 rounded-btn"></div>
                    <div className="skeleton h-10 w-10 rounded-btn"></div>
                    <div className="skeleton h-10 w-10 rounded-btn"></div>
                    <div className="skeleton h-10 w-10 rounded-btn"></div>
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="drawer-side z-40 top-[68px] h-[calc(100vh-68px)]">
                <label htmlFor="shop-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-6">
                    {/* Search Skeleton */}
                    <div className="skeleton h-10 w-full rounded-btn"></div>

                    {/* Categories Skeleton */}
                    <div className="space-y-3">
                        <div className="skeleton h-6 w-32 mb-4"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-4 w-5/6"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>

                    {/* Price Range Skeleton */}
                    <div className="space-y-3">
                        <div className="skeleton h-6 w-24 mb-4"></div>
                        <div className="skeleton h-12 w-full rounded-btn"></div>
                    </div>

                    {/* Rating Filter Skeleton */}
                    <div className="space-y-3">
                        <div className="skeleton h-6 w-24 mb-4"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
