import { getUsers } from '@/services/mockData';

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Users</h1>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="font-bold">{user.name}</div>
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <div className={`badge ${user.role === 'Admin' ? 'badge-primary' : 'badge-ghost'}`}>
                                        {user.role}
                                    </div>
                                </td>
                                <td>
                                    <div className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-error'}`}>
                                        {user.status}
                                    </div>
                                </td>
                                <td>
                                    {user.status === 'Active' ? (
                                        <button className="btn btn-xs btn-error btn-outline">Deactivate</button>
                                    ) : (
                                        <button className="btn btn-xs btn-success btn-outline">Activate</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
