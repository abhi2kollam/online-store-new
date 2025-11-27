'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';

export interface CartItem extends Product {
    quantity: number;
    variantId?: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, variantId?: number) => void;
    removeFromCart: (productId: string, variantId?: number) => void;
    clearCart: () => void;
    total: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
        setLoading(false);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, loading]);

    const addToCart = (product: Product, variantId?: number) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id && item.variantId === variantId);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id && item.variantId === variantId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1, variantId }];
        });
    };

    const removeFromCart = (productId: string, variantId?: number) => {
        setItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.variantId === variantId)));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total, loading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
