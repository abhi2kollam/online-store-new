'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { getOrders, MockOrder } from '@/services/mockData';
import OrderList from '@/components/OrderList';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<MockOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address: '',
    });
    const router = useRouter();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address_line1: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                    setFormData({
                        full_name: profileData.full_name || '',
                        phone: profileData.phone || '',
                        address: profileData.address || '',
                    });
                }

                // Fetch addresses
                const { data: addressData } = await supabase
                    .from('addresses')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (addressData) {
                    setAddresses(addressData);
                }
            }

            // Fetch mock orders
            const mockOrders = await getOrders();
            setOrders(mockOrders);
            setLoading(false);
        };

        getUser();
    }, [router]);

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
                    address: formData.address,
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
            const { data, error } = await supabase
                .from('addresses')
                .insert({
                    user_id: user.id,
                    ...newAddress,
                })
                .select()
                .single();

            if (error) throw error;

            setAddresses([data, ...addresses]);
            setShowAddressForm(false);
            setNewAddress({
                address_line1: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
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
                    <button onClick={handleLogout} className="btn btn-outline btn-error">
                        Logout
                    </button>
                ) : (
                    <button onClick={() => router.push('/login')} className="btn btn-primary">
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
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="textarea textarea-bordered h-24"
                                placeholder="123 Main St, City, Country"
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary" disabled={updating}>
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
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                    >
                        {showAddressForm ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="mb-8 p-4 bg-base-200 rounded-lg space-y-4">
                        <div className="form-control">
                            <label className="label">Address Line 1</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                required
                                value={newAddress.address_line1}
                                onChange={e => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">City</label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    required
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">State</label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    required
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">Postal Code</label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    required
                                    value={newAddress.postal_code}
                                    onChange={e => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">Country</label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    required
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success btn-block">Save Address</button>
                    </form>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="card bg-base-200">
                            <div className="card-body p-4">
                                <p className="font-bold">{addr.address_line1}</p>
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
