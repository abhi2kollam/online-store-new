'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface UserRowProps {
    user: any;
}

export default function UserRow({ user }: UserRowProps) {
    const [status, setStatus] = useState(user.status || 'active');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const toggleStatus = async () => {
        setLoading(true);
        const newStatus = status === 'active' ? 'inactive' : 'active';

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', user.id);

            if (error) throw error;
            setStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr>
            <td>
                <div className="font-bold">{user.full_name || 'N/A'}</div>
            </td>
            <td>
                <div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>
                    {user.role}
                </div>
            </td>
            <td>
                <div className={`badge ${status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {status}
                </div>
            </td>
            <td>{new Date(user.created_at).toLocaleDateString()}</td>
            <td>
                <button
                    onClick={toggleStatus}
                    className={`btn btn-xs btn-outline ${status === 'active' ? 'btn-error' : 'btn-success'}`}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : (status === 'active' ? 'Deactivate' : 'Activate')}
                </button>
            </td>
        </tr>
    );
}
