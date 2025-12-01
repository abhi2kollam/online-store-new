'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

export default function ShopFilters() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
                <button
                    className="btn btn-outline btn-sm gap-2"
                    onClick={toggleDrawer}
                >
                    <Filter size={16} />
                    Filters
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0 space-y-6">
                <div>
                    <h3 className="font-bold text-lg mb-4">Search</h3>
                    <SearchBar />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Categories</h3>
                    <CategoryFilter vertical />
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={toggleDrawer}
                    />

                    {/* Drawer Content */}
                    <div className="absolute inset-y-0 left-0 w-80 bg-base-100 shadow-xl p-6 overflow-y-auto transition-transform">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button
                                onClick={toggleDrawer}
                                className="btn btn-ghost btn-circle btn-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-lg mb-4">Search</h3>
                                <SearchBar />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">Categories</h3>
                                <CategoryFilter vertical />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
