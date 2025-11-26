import { createClient } from '@/utils/supabase/server';
import UserRow from '@/components/UserRow';

export const revalidate = 0;

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return <div>Error loading users</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Users</h1>

            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user: any) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                        {users?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
