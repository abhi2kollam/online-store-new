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

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Classic White T-Shirt',
        price: 19.99,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'A comfortable and stylish classic white t-shirt made from 100% cotton.',
        stock: 50,
    },
    {
        id: '2',
        name: 'Denim Jacket',
        price: 49.99,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1527719327859-ac9b0739c270?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'A trendy denim jacket perfect for layering in any season.',
        stock: 30,
    },
    {
        id: '3',
        name: 'Running Shoes',
        price: 79.99,
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'High-performance running shoes designed for speed and comfort.',
        stock: 20,
    },
    {
        id: '4',
        name: 'Leather Backpack',
        price: 89.99,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Durable and stylish leather backpack for daily commute or travel.',
        stock: 15,
    },
    {
        id: '5',
        name: 'Smart Watch',
        price: 199.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Feature-rich smart watch to track your fitness and notifications.',
        stock: 10,
    },
    {
        id: '6',
        name: 'Summer Dress',
        price: 39.99,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Light and breezy summer dress with a floral pattern.',
        stock: 25,
    },
    {
        id: '7',
        name: 'Wireless Headphones',
        price: 129.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1524678606372-87139ee986e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Noise-cancelling wireless headphones for immersive audio experience.',
        stock: 18,
    },
    {
        id: '8',
        name: 'Men\'s Chinos',
        price: 45.00,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1504198458649-3128b932f49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Versatile chinos that look great with both casual and formal shirts.',
        stock: 40,
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
    image: string;
}

export const mockCategories: MockCategory[] = [
    { id: '1', name: 'Men', count: 15, image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '2', name: 'Women', count: 25, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '3', name: 'Sports', count: 10, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: '4', name: 'Electronics', count: 5, image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
];

export const getCategories = async (): Promise<MockCategory[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCategories;
};
