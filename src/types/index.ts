export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    images: string[];
    description: string;
    stock: number;
    product_type?: 'simple' | 'variant';
    categories?: { name: string };
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'Delivered' | 'Processing' | 'Shipped';
    items: { name: string; quantity: number; price: number }[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    status: 'Active' | 'Inactive';
}

export interface Category {
    id: string;
    name: string;
    count: number;
    image: string;
}

export interface Profile {
    id: string;
    full_name: string;
    phone: string;
    role: string;
    status?: string;
    created_at?: string;
}

export interface Address {
    id: string;
    user_id: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
}
