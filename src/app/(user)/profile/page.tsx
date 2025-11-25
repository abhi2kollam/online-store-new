'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getOrders, MockOrder } from '@/services/mockData';
import OrderList from '@/components/OrderList';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<MockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // For demo purposes, we might want to allow viewing without login or redirect
                // router.push('/login');
                // But let's just show a message or mock user if not logged in for testing UI
            }
            setUser(user);

            // Fetch mock orders
            const mockOrders = await getOrders();
            setOrders(mockOrders);
            setLoading(false);
        };

        getUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return <div className="text-center py-12"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-base-100 p-6 rounded-lg shadow">
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-base-content/70 mt-2">
                        {user ? user.email : 'Guest User (Not logged in)'}
                    </p>
                </div>
                {user ? (
                    <button onClick={handleLogout} className="btn btn-outline btn-error">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => router.push('/login')} className="btn btn-primary">
                        Login
                    </button>
                )}
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                <OrderList orders={orders} />
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
                <p className="text-base-content/70">No addresses saved yet.</p>
                <button className="btn btn-outline btn-sm mt-4">Add New Address</button>
            </div>
        </div>
    );
}
