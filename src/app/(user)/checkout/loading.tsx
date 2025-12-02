import React from 'react';

export default function CheckoutLoading() {
    return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="skeleton h-10 w-48 mb-8"></div>

            <div className="grid gap-8">
                {/* Order Summary Skeleton */}
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <div className="skeleton h-6 w-32 mb-4"></div>
                    <div className="space-y-4 mb-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="skeleton h-4 w-48"></div>
                                <div className="skeleton h-4 w-16"></div>
                            </div>
                        ))}
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between">
                        <div className="skeleton h-6 w-16"></div>
                        <div className="skeleton h-6 w-24"></div>
                    </div>
                </div>

                {/* Shipping Form Skeleton */}
                <div className="bg-base-100 p-6 rounded-lg shadow space-y-4">
                    <div className="skeleton h-6 w-48 mb-4"></div>

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

                    <div className="space-y-2">
                        <div className="skeleton h-4 w-20"></div>
                        <div className="skeleton h-24 w-full rounded-btn"></div>
                    </div>

                    <div className="skeleton h-12 w-full rounded-btn mt-4"></div>
                </div>
            </div>
        </div>
    );
}
