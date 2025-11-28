import { createClient } from '@/utils/supabase/server';
import { Order } from '@/types';

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: totalCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin');
    const { count: totalCategories } = await supabase.from('categories').select('*', { count: 'exact', head: true });

    // Fetch Orders Data
    const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'paid');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    const { data: recentOrders } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                quantity,
                price,
                products (name)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    const orders: Order[] = recentOrders?.map(order => ({
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
    })) || [];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Revenue</div>
                        <div className="stat-value text-primary">${totalRevenue.toFixed(2)}</div>
                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Orders</div>
                        <div className="stat-value text-secondary">{totalOrders}</div>
                        <div className="stat-desc">↗︎ 0 (0%)</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Products</div>
                        <div className="stat-value">{totalProducts || 0}</div>
                        <div className="stat-desc">In stock</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Customers</div>
                        <div className="stat-value">{totalCustomers || 0}</div>
                        <div className="stat-desc">Registered users</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Categories</div>
                        <div className="stat-value">{totalCategories || 0}</div>
                        <div className="stat-desc">Active categories</div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.date}</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="text-center">No orders found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
