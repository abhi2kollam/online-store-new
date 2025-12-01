import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'Manage your profile, orders, and addresses.',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
