import Link from 'next/link';

export default function AdminSidebar() {
    return (
        <div className="drawer-side z-20">
            <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <li className="mb-4">
                    <Link href="/admin" className="text-xl font-bold">Admin Panel</Link>
                </li>
                <li><Link href="/admin">Dashboard</Link></li>
                <li><Link href="/admin/products">Products</Link></li>
                <li><Link href="/admin/categories">Categories</Link></li>
                <li><Link href="/admin/orders">Orders</Link></li>
                <li><Link href="/admin/users">Users</Link></li>
                <div className="divider"></div>
                <li><Link href="/">Back to Store</Link></li>
            </ul>
        </div>
    );
}
