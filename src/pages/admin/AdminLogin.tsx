import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoAlertCircleOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { adminLogin, isAdminLoggedIn } = useAdminAuth();

    // If already logged in, redirect to dashboard
    useEffect(() => {
        if (isAdminLoggedIn) {
            navigate('/admin', { replace: true });
        }
    }, [isAdminLoggedIn, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result =await adminLogin(email, password);
        if (result.success) {
            navigate('/admin', { replace: true });
        } else {
            setError(result.error || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center">
                            <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="NEHDO" className="h-8" onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-2xl font-bold text-white">N</span>';
                            }} />
                        </div>
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-heading font-extrabold text-white">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Sign in to manage your store
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/10">
                        {error && (
                            <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <IoAlertCircleOutline className="h-5 w-5 text-red-400 flex-shrink-0" />
                                <p className="text-sm text-red-300 font-medium">{error}</p>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoMailOutline className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 sm:text-sm transition-all"
                                        placeholder="admin@nehdo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoLockClosedOutline className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                        className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 sm:text-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-brand focus:ring-brand border-gray-600 rounded bg-white/10"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-brand hover:text-brand-light transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand hover:bg-brand-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-xs text-gray-500 text-center">
                                Demo: admin@nehdo.com / admin123
                            </p>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-gray-600">
                        <a href="/" className="hover:text-gray-400 transition-colors">← Back to Store</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
