import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account.',
};

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AuthForm type="login" />
            <div className="mt-4">
                <p>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="link link-primary">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
