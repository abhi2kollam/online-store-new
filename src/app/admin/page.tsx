import { getOrders, getProducts } from '@/services/mockData';

export default async function AdminDashboard() {
    const products = await getProducts();
    const orders = await getOrders();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;

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
                        <div className="stat-desc">↗︎ 400 (22%)</div>
                    </div>
                </div>

                <div className="stats shadow">
                    <div className="stat">
                        <div className="stat-title">Total Products</div>
                        <div className="stat-value">{totalProducts}</div>
                        <div className="stat-desc">In stock</div>
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
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.date}</td>
                                            <td>${order.total.toFixed(2)}</td>
                                            <td>{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
