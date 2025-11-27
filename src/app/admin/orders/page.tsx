export default async function AdminOrdersPage() {
    // Orders not implemented yet
    const orders: any[] = [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Orders</h1>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>Guest User</td>
                                    <td>${order.total.toFixed(2)}</td>
                                    <td>
                                        <div className={`badge ${order.status === 'Delivered' ? 'badge-success' :
                                            order.status === 'Processing' ? 'badge-warning' : 'badge-info'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn btn-xs btn-outline">View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
