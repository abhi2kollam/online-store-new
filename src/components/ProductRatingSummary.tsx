'use client';

import StarRating from './StarRating';

interface ProductRatingSummaryProps {
    average: number;
    count: number;
    distribution: { [key: number]: number };
}

export default function ProductRatingSummary({ average, count, distribution }: ProductRatingSummaryProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl font-bold text-gray-900">{average.toFixed(1)}</div>
                <div>
                    <StarRating rating={Math.round(average)} readOnly size={20} />
                    <div className="text-sm text-gray-500 mt-1">{count} reviews</div>
                </div>
            </div>

            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                    const starCount = distribution[star] || 0;
                    const percentage = count > 0 ? (starCount / count) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center text-sm">
                            <div className="w-12 text-gray-600">{star} stars</div>
                            <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-yellow-400 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="w-8 text-right text-gray-500">{starCount}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
