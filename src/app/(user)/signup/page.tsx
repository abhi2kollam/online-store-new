import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <AuthForm type="signup" />
            <div className="mt-4">
                <p>
                    Already have an account?{' '}
                    <Link href="/login" className="link link-primary">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
