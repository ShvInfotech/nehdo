import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoAlertCircleOutline, IoEyeOutline, IoEyeOffOutline, IoArrowBack } from 'react-icons/io5';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { toast } from 'react-toastify';
import { getDeviceToken } from '../../services/firebase';

/*
 * Removed from the previous screen: a visible "Demo: admin@… / password" line
 * (credentials shown publicly on the live site), and "Remember me" /
 * "Forgot password?" controls that had no behaviour behind them.
 */
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

        try {
            const deviceToken = await getDeviceToken();
            const result = await adminLogin(email, password, deviceToken);
            if (result.success) {
                toast.success("Login Success");
                navigate('/admin', { replace: true });
            } else {
                const errMsg = result.error || "Login failed";
                toast.error(errMsg);
                setError(errMsg);
            }
        } catch (err: any) {
            const errMsg = err?.message || "Login failed";
            toast.error(errMsg);
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const field =
        "block h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 text-gray-900 placeholder:text-gray-400 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";

    return (
        <div className="grid min-h-screen bg-[#f6f4f8] lg:grid-cols-[1fr_1.1fr]">
            {/* Brand panel */}
            <div className="relative hidden overflow-hidden bg-brand-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand blur-2xl" />
                <div aria-hidden className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-accent/40 blur-3xl" />
                <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="Nehdo" style={{ filter: "brightness(0) invert(1)" }} className="relative h-10 w-auto self-start" />
                <div className="relative max-w-md">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/50">Admin portal</p>
                    <h1 className="mt-3 text-[40px] leading-[1.05] text-white">Run your store from one place.</h1>
                    <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                        Orders, products, customers, banners and reports — everything you need to keep Nehdo running smoothly.
                    </p>
                </div>
                <p className="relative text-xs text-white/40">Authorised staff only.</p>
            </div>

            {/* Form */}
            <div className="flex items-center justify-center px-5 py-12 sm:px-8">
                <div className="w-full max-w-[400px]">
                    <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="Nehdo" className="mb-8 h-9 w-auto lg:hidden" />
                    <h2 className="text-[28px]">Sign in</h2>
                    <p className="mt-1 text-sm text-gray-500">Use your admin account to continue.</p>

                    {error && (
                        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                            <IoAlertCircleOutline className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                            <p className="text-sm font-medium text-rose-700">{error}</p>
                        </div>
                    )}

                    <form className="mt-7 space-y-5" onSubmit={handleLogin}>
                        <label className="block">
                            <span className="mb-1.5 block text-[13px] font-semibold text-gray-700">Email address</span>
                            <span className="relative block">
                                <IoMailOutline className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    className={`${field} pr-4`}
                                    placeholder="you@company.com"
                                />
                            </span>
                        </label>

                        <label className="block">
                            <span className="mb-1.5 block text-[13px] font-semibold text-gray-700">Password</span>
                            <span className="relative block">
                                <IoLockClosedOutline className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    className={`${field} pr-12`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                                </button>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white shadow-button transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Signing in…
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <a href="/" className="mt-8 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800">
                        <IoArrowBack /> Back to store
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
