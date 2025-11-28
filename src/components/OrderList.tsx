import { Order } from '@/types';

interface OrderListProps {
    orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.date}</td>
                            <td>
                                <div className={`badge ${order.status === 'Delivered' || order.status === 'paid' ? 'badge-success' :
                                        order.status === 'Processing' || order.status === 'pending' ? 'badge-warning' :
                                            order.status === 'failed' ? 'badge-error' : 'badge-info'
                                    }`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </div>
                            </td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                                <ul className="list-disc list-inside text-sm">
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
