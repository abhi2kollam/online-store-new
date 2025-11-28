'use client';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    size?: 'sm' | 'md' | 'lg';
}

export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max,
    size = 'md'
}: QuantitySelectorProps) {
    const btnSize = size === 'sm' ? 'btn-xs' : size === 'lg' ? 'btn-md' : 'btn-sm';
    const iconSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

    return (
        <div className="flex items-center border rounded-lg overflow-hidden w-fit">
            <button
                type="button"
                onClick={onDecrease}
                disabled={quantity <= min}
                className={`btn btn-ghost btn-square ${btnSize} rounded-none`}
            >
                <Minus size={iconSize} />
            </button>
            <div className={`px-2 font-medium text-center min-w-8 ${size === 'sm' ? 'text-xs' : ''}`}>
                {quantity}
            </div>
            <button
                type="button"
                onClick={onIncrease}
                disabled={max !== undefined && quantity >= max}
                className={`btn btn-ghost btn-square ${btnSize} rounded-none`}
            >
                <Plus size={iconSize} />
            </button>
        </div>
    );
}
