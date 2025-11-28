'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export interface CartItem extends Product {
    quantity: number;
    variantId?: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, variantId?: number) => Promise<void>;
    removeFromCart: (productId: string, variantId?: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    // Check auth state and load cart
    useEffect(() => {
        const initializeCart = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Load from Supabase
                const { data: cartData, error } = await supabase
                    .from('cart_items')
                    .select(`
                        quantity,
                        variant_id,
                        product:products ( * ),
                        variant:product_variants ( * )
                    `);

                if (error) {
                    console.error('Error loading cart from Supabase:', error);
                } else if (cartData) {
                    // Map and deduplicate items
                    const mappedItemsMap = new Map<string, CartItem>();

                    cartData.forEach((item: any) => {
                        const product = item.product;
                        const variant = item.variant;
                        const variantId = item.variant_id; // Can be null

                        // If variant exists, use its price and stock, but keep product details
                        const finalProduct = {
                            ...product,
                            id: product.id.toString(), // Ensure ID is string
                            price: variant ? variant.price : product.price,
                            stock: variant ? variant.stock : product.stock,
                            image: variant?.image_url || product.image_url || product.image, // Handle image fallback
                        };

                        const cartItem: CartItem = {
                            ...finalProduct,
                            quantity: item.quantity,
                            variantId: variantId,
                        };

                        // Create a unique key for deduplication
                        // Treat null and undefined variantId as 'null' string for key
                        const key = `${cartItem.id}-${variantId ?? 'null'}`;

                        if (mappedItemsMap.has(key)) {
                            // Merge duplicates
                            const existing = mappedItemsMap.get(key)!;
                            existing.quantity += cartItem.quantity;
                        } else {
                            mappedItemsMap.set(key, cartItem);
                        }
                    });

                    setItems(Array.from(mappedItemsMap.values()));
                }
            } else {
                // Load from localStorage
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    setItems(JSON.parse(savedCart));
                }
            }
            setLoading(false);
        };

        initializeCart();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(session.user);
                // Reload page to sync cart (simple strategy for now)
                // window.location.reload();
                await initializeCart();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setItems([]);
                localStorage.removeItem('cart');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Save to localStorage if guest
    useEffect(() => {
        if (!loading && !user) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, loading, user]);

    const addToCart = async (product: Product, variantId?: number) => {
        // Normalize variantId to null if undefined for consistent comparison
        const targetVariantId = variantId ?? null;

        // Optimistic update
        const newItem = { ...product, quantity: 1, variantId: targetVariantId ?? undefined };

        setItems((prevItems) => {
            // Find existing item matching product ID and variant ID (handling nulls)
            const existingItemIndex = prevItems.findIndex((item) =>
                item.id === product.id && (item.variantId ?? null) === targetVariantId
            );

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += 1;
                return newItems;
            }
            return [...prevItems, newItem];
        });

        if (user) {
            // Sync with Supabase
            const currentItem = items.find(i => i.id === product.id && (i.variantId ?? null) === targetVariantId);
            const newQuantity = currentItem ? currentItem.quantity + 1 : 1;

            const { error } = await supabase
                .from('cart_items')
                .upsert({
                    user_id: user.id,
                    product_id: parseInt(product.id),
                    variant_id: targetVariantId, // Pass null explicitly if needed
                    quantity: newQuantity
                }, { onConflict: 'user_id, product_id, variant_id' });

            if (error) {
                console.error('Error adding to cart in Supabase:', error);
            }
        }
    };

    const removeFromCart = async (productId: string, variantId?: number) => {
        const targetVariantId = variantId ?? null;

        setItems((prevItems) => prevItems.filter((item) =>
            !(item.id === productId && (item.variantId ?? null) === targetVariantId)
        ));

        if (user) {
            let query = supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', parseInt(productId));

            if (targetVariantId !== null) {
                query = query.eq('variant_id', targetVariantId);
            } else {
                query = query.is('variant_id', null);
            }

            const { error } = await query;

            if (error) {
                console.error('Error removing from cart in Supabase:', error);
            }
        }
    };

    const clearCart = async () => {
        setItems([]);
        if (user) {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                console.error('Error clearing cart in Supabase:', error);
            }
        } else {
            localStorage.removeItem('cart');
        }
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
