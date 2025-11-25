import React from 'react';

const FeatureCards = () => {
    const features = [
        {
            title: 'Free Shipping',
            description: 'Free shipping on order above $100',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            ), // Placeholder icon, will replace with specific ones below
        },
        {
            title: 'Flexible Payments',
            description: 'Pay with multiple credit cards',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
        {
            title: 'Easy Return',
            description: '15 Days easy return',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            ),
        },
        {
            title: 'New Arrivals Everyday',
            description: 'We update our collection everyday',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
    ];

    // Specific icon for Free Shipping (Truck)
    features[0].icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-7xl mx-auto px-4">
            {features.map((feature, index) => (
                <div key={index} className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body items-center text-center">
                        <div className="p-3 bg-base-200 rounded-full mb-2">
                            {feature.icon}
                        </div>
                        <h3 className="card-title text-lg font-bold">{feature.title}</h3>
                        <p className="text-base-content/70 text-sm">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeatureCards;
