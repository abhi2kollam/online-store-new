export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    stock: number;
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Classic White T-Shirt',
        price: 19.99,
        category: 'Men',
        image: 'https://placehold.co/400x600?text=White+T-Shirt',
        description: 'A comfortable and stylish classic white t-shirt.',
        stock: 50,
    },
    {
        id: '2',
        name: 'Denim Jacket',
        price: 49.99,
        category: 'Women',
        image: 'https://placehold.co/400x600?text=Denim+Jacket',
        description: 'A trendy denim jacket for all seasons.',
        stock: 30,
    },
    {
        id: '3',
        name: 'Running Shoes',
        price: 79.99,
        category: 'Sports',
        image: 'https://placehold.co/400x600?text=Running+Shoes',
        description: 'High-performance running shoes.',
        stock: 20,
    },
];

export const getProducts = async (query?: string, category?: string): Promise<Product[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = mockProducts;

    if (category && category !== 'All') {
        filteredProducts = filteredProducts.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
        );
    }

    if (query) {
        const lowerQuery = query.toLowerCase();
        filteredProducts = filteredProducts.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
        );
    }

    return filteredProducts;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockProducts.find((p) => p.id === id);
};

export interface MockOrder {
    id: string;
    date: string;
    total: number;
    status: 'Delivered' | 'Processing' | 'Shipped';
    items: { name: string; quantity: number; price: number }[];
}

export const mockOrders: MockOrder[] = [
    {
        id: 'ORD-001',
        date: '2023-10-15',
        total: 89.97,
        status: 'Delivered',
        items: [
            { name: 'Classic White T-Shirt', quantity: 2, price: 19.99 },
            { name: 'Denim Jacket', quantity: 1, price: 49.99 },
        ],
    },
    {
        id: 'ORD-002',
        date: '2023-11-05',
        total: 79.99,
        status: 'Processing',
        items: [
            { name: 'Running Shoes', quantity: 1, price: 79.99 },
        ],
    },
];

export const getOrders = async (): Promise<MockOrder[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders;
};

export interface MockUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'User';
    status: 'Active' | 'Inactive';
}

export const mockUsers: MockUser[] = [
    {
        id: 'USR-001',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'User',
        status: 'Active',
    },
    {
        id: 'USR-002',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Admin',
        status: 'Active',
    },
    {
        id: 'USR-003',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'User',
        status: 'Inactive',
    },
];

export const getUsers = async (): Promise<MockUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUsers;
};

export interface MockCategory {
    id: string;
    name: string;
    count: number;
}

export const mockCategories: MockCategory[] = [
    { id: '1', name: 'Men', count: 15 },
    { id: '2', name: 'Women', count: 25 },
    { id: '3', name: 'Sports', count: 10 },
    { id: '4', name: 'Electronics', count: 5 },
];

export const getCategories = async (): Promise<MockCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCategories;
};
