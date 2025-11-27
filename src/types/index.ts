export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    images: string[];
    description: string;
    stock: number;
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
