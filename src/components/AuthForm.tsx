'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
    type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (type === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                alert('Signup successful! Please check your email for verification.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-sm shadow-2xl bg-base-100">
            <form onSubmit={handleAuth} className="card-body">
                <h2 className="card-title justify-center mb-4">
                    {type === 'login' ? 'Login' : 'Sign Up'}
                </h2>

                {error && (
                    <div className="alert alert-error text-sm mb-4">
                        <span>{error}</span>
                    </div>
                )}

                {type === 'signup' && (
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Full Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="input input-bordered"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        className="input input-bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        className="input input-bordered"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {type === 'login' && (
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                    )}
                </div>
                <div className="form-control mt-6">
                    <button className="btn btn-primary" disabled={loading}>
                        {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
}
