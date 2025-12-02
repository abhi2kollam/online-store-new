import React from 'react';

export default function CartLoading() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="skeleton h-10 w-48 mb-8"></div>

            <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4 bg-base-100 p-4 rounded-lg shadow">
                        <div className="relative h-24 w-24 shrink-0">
                            <div className="skeleton w-full h-full rounded"></div>
                        </div>
                        <div className="grow space-y-2">
                            <div className="skeleton h-6 w-3/4"></div>
                            <div className="skeleton h-4 w-1/2"></div>
                            <div className="mt-2">
                                <div className="skeleton h-8 w-24 rounded-btn"></div>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <div className="skeleton h-4 w-16 ml-auto"></div>
                            <div className="skeleton h-6 w-20 ml-auto"></div>
                            <div className="skeleton h-6 w-16 ml-auto rounded-btn"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="divider my-8"></div>

            <div className="flex justify-between items-center">
                <div className="skeleton h-12 w-24 rounded-btn"></div>
                <div className="text-right space-y-4">
                    <div className="skeleton h-8 w-32 ml-auto"></div>
                    <div className="skeleton h-12 w-48 rounded-btn"></div>
                </div>
            </div>
        </div>
    );
}
