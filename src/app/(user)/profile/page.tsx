'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Order, Profile, Address } from '@/types';
import { User } from '@supabase/supabase-js';
import OrderList from '@/components/OrderList';

export default function ProfilePage() {
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
    });
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address_line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false,
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                console.log('Fetching user...');
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError) {
                    console.error('Auth error:', authError);
                    throw authError;
                }

                if (!user) {
                    console.log('No user found');
                    return;
                }

                setUser(user);
                console.log('User found:', user.id);

                console.log('Fetching profile, addresses, and orders...');
                const [profileResult, addressResult, ordersResult] = await Promise.all([
                    // Fetch profile
                    supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single(),

                    // Fetch addresses
                    supabase
                        .from('addresses')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false }),

                    // Fetch orders
                    supabase
                        .from('orders')
                        .select(`
                        *,
                        order_items (
                            quantity,
                            price,
                            products (name)
                        )
                    `)
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                ]);

                console.log('Data fetch completed');

                // Handle Profile Data
                const { data: profileData, error: profileError } = profileResult;
                if (profileError) console.error('Profile fetch error:', profileError);
                if (profileData) {
                    setProfile(profileData);
                    setFormData({
                        full_name: profileData.full_name || '',
                        phone: profileData.phone || '',
                    });
                }

                // Handle Address Data
                const { data: addressData, error: addressError } = addressResult;
                if (addressError) console.error('Address fetch error:', addressError);
                if (addressData) {
                    setAddresses(addressData);
                }

                // Handle Orders Data
                const { data: ordersData, error: ordersError } = ordersResult;
                if (ordersError) console.error('Orders fetch error:', ordersError);
                if (ordersData) {
                    const formattedOrders: Order[] = ordersData.map(order => ({
                        id: order.id,
                        date: new Date(order.created_at).toLocaleDateString(),
                        total: order.total_amount,
                        status: order.status,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        items: order.order_items.map((item: any) => ({
                            name: item.products?.name || 'Unknown Product',
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }));
                    setOrders(formattedOrders);
                }
            } catch (error) {
                console.error('Error in getUser:', error);
            } finally {
                console.log('Setting loading to false');
                setLoading(false);
            }
        };

        getUser();
    }, [router, supabase]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUpdating(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // If setting as default, unset other defaults first
            if (newAddress.is_default) {
                await supabase
                    .from('addresses')
                    .update({ is_default: false })
                    .eq('user_id', user.id);
            }

            const { data, error } = await supabase
                .from('addresses')
                .insert({
                    user_id: user.id,
                    ...newAddress,
                })
                .select()
                .single();

            if (error) throw error;

            // If we just added a default address, we need to refresh the list to show others as non-default
            // or we can just manually update the local state
            let updatedAddresses = [data, ...addresses];
            if (newAddress.is_default) {
                updatedAddresses = updatedAddresses.map(addr =>
                    addr.id === data.id ? addr : { ...addr, is_default: false }
                );
            }

            setAddresses(updatedAddresses);
            setShowAddressForm(false);
            setNewAddress({
                address_line1: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
                is_default: false,
            });
            alert('Address added successfully!');
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const { error } = await supabase
                .from('addresses')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setAddresses(addresses.filter(addr => addr.id !== id));
        } catch (error) {
            console.error('Error deleting address:', error);
            alert('Failed to delete address');
        }
    };

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
                    <div className="flex gap-2">
                        {profile?.role === 'admin' && (
                            <button onClick={() => router.push('/admin')} className="btn btn-neutral">
                                Admin Dashboard
                            </button>
                        )}
                        <button onClick={handleLogout} className="btn btn-outline btn-error">
                            Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={() => router.push('/login')} className="btn btn-neutral">
                        Login
                    </button>
                )}
            </div>

            {user && (
                <div className="bg-base-100 p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-6">Profile Details</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="input input-bordered w-full"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input input-bordered w-full"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-neutral" disabled={updating}>
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-base-100 p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>
                <OrderList orders={orders} />
            </div>

            <div className="bg-base-100 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Saved Addresses</h2>
                    <button
                        className="btn btn-neutral btn-sm"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                    >
                        {showAddressForm ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-base-200 rounded-lg space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Line 1</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                required
                                value={newAddress.address_line1}
                                onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    required
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">State</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    required
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Postal Code</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    required
                                    value={newAddress.postal_code}
                                    onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Country</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    required
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={newAddress.is_default}
                                    onChange={e => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                                />
                                <span className="label-text">Set as default address</span>
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-success">Save Address</button>
                        </div>
                    </form>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="card bg-base-200">
                            <div className="card-body p-4">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold">{addr.address_line1}</p>
                                    {addr.is_default && <span className="badge badge-primary badge-sm">Default</span>}
                                </div>
                                <p className="text-sm">{addr.city}, {addr.state} {addr.postal_code}</p>
                                <p className="text-sm">{addr.country}</p>
                                <div className="card-actions justify-end mt-2">
                                    <button
                                        className="btn btn-xs btn-error btn-outline"
                                        onClick={() => handleDeleteAddress(addr.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {addresses.length === 0 && !showAddressForm && (
                        <p className="text-base-content/70 col-span-2 text-center py-4">No addresses saved yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
