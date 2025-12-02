import React from 'react';

export default function ProfileLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center bg-base-100 p-6 rounded-lg shadow">
                <div className="space-y-2">
                    <div className="skeleton h-8 w-48"></div>
                    <div className="skeleton h-4 w-32"></div>
                </div>
                <div className="flex gap-2">
                    <div className="skeleton h-12 w-24 rounded-btn"></div>
                </div>
            </div>

            {/* Profile Details Skeleton */}
            <div className="bg-base-100 p-6 rounded-lg shadow space-y-6">
                <div className="skeleton h-8 w-40"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-12 w-full rounded-btn"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-12 w-full rounded-btn"></div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="skeleton h-12 w-32 rounded-btn"></div>
                </div>
            </div>

            {/* Order History Skeleton */}
            <div className="bg-base-100 p-6 rounded-lg shadow space-y-4">
                <div className="skeleton h-8 w-40 mb-4"></div>
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
                ))}
            </div>

            {/* Addresses Skeleton */}
            <div className="bg-base-100 p-6 rounded-lg shadow space-y-4">
                <div className="flex justify-between mb-6">
                    <div className="skeleton h-8 w-40"></div>
                    <div className="skeleton h-8 w-32 rounded-btn"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="skeleton h-40 w-full rounded-lg"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
