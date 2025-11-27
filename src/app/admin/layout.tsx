import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return redirect('/');
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar for mobile */}
                <div className="w-full navbar bg-base-100 lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2">Admin Panel</div>
                </div>

                <main className="p-8">
                    {children}
                </main>
            </div>
            <AdminSidebar />
        </div>
    );
}
