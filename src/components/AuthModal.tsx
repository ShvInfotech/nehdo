
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoCloseOutline,
  IoLogoGoogle,
  IoLogoFacebook,
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userapiRequest } from '../services/apiService';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, messaging } from "../services/firebase";
import { getToken } from "firebase/messaging";
// import {messaging} from "../../public/"

const AuthModal = () => {
  const {
    authModalMode,
    openAuthModal,
    closeAuthModal,
    login,
    signup,
  }:any = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  // Forgot password states
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  if (!authModalMode) return null;

  const isLogin = authModalMode === 'login';
const { refreshWishlist } = useWishlist();
const { refreshCart } = useCart();



const getDeviceToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    const swPath = `${import.meta.env.BASE_URL}firebase-messaging-sw.js`;

  

    const registration = await navigator.serviceWorker.register(
  "/nehdo/firebase-messaging-sw.js"
);
    const token = await getToken(messaging, {
      vapidKey: "BJ9rA0mIYGOm2eoQIY5w3CX3iUf_jf8Hl_TU4BZYEtWCW6NSdITn5CRY0Bz25Fa1CYyfbTdt1xWEh7ylwru0BiY",
      serviceWorkerRegistration: registration,
    });
    return token;
  } catch (error) {
    console.error("FCM Token Error:", error);
    return null;
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');

      let res;
    const deviceToken:any = await getDeviceToken();

      if (isLogin) {
        res = await login(email, password,deviceToken);
      } else {
        res = await signup(name, email, password,deviceToken);
      }

      if (res) {
        setName('');
        setEmail('');
        setPassword('');
         await refreshWishlist();
         await refreshCart()
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  const handalgoogleLogin = async ()=>{
    try {
 const result = await signInWithPopup(auth, googleProvider);
 const user = result.user;

    // Real Firebase ID Token
    const GoogleIdToken = await user.getIdToken();
    const deviceToken:any = await getDeviceToken();
     let res = await login("","",deviceToken,GoogleIdToken,'google')
      if(res){
        setName('');
        setEmail('');
        setPassword('');
         await refreshWishlist();
         await refreshCart()
        navigate('/account');
      }
    } catch (error:any) {
      setError(error.message || 'Something went wrong');
      
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setForgotLoading(true);
      setForgotMessage('');

      const res: any = await userapiRequest(
        '/user/api/v1/auth/forgot-password',
        'POST',
        { email: forgotEmail }
      );

      setForgotMessage(
        res.message || 'Reset link sent to your email'
      );
    } catch (error: any) {
      setForgotMessage(
        error.message || 'Failed to send reset email'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: 'spring',
            duration: 0.5,
            bounce: 0.2,
          }}
          className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 min-h-[550px]"
        >

          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-20 p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>

          {/* Left Side */}
          <div className="hidden md:flex flex-col justify-center w-[45%] bg-brand p-12 text-white relative overflow-hidden">

            <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-gradient-to-br from-white/10 to-transparent -translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />

            <div className="relative z-10">

              <h2 className="font-heading text-4xl font-bold mb-4 leading-tight">
                {forgotMode
                  ? 'Recover your account.'
                  : isLogin
                  ? 'Elevate your shopping experience.'
                  : 'Join our fashion community.'}
              </h2>

              <p className="text-white/80 font-medium">
                {forgotMode
                  ? 'Enter your registered email and we will send you a password reset link.'
                  : isLogin
                  ? 'Access your saved items, track your orders, and discover new styles tailored just for you.'
                  : 'Create an account to track orders, save favorites to your wishlist, and check out faster.'}
              </p>

            </div>

          </div>

          {/* Right Side */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white relative">

            <div className="w-full max-w-sm mx-auto">

              {forgotMode ? (
                <>
                  {/* Forgot Password UI */}
                  <div className="text-center mb-8">

                    <h1 className="font-heading text-3xl font-extrabold text-brand tracking-tight mb-4">
                      NEHDO
                    </h1>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Forgot Password
                    </h2>

                    <p className="text-sm text-gray-500">
                      Enter your email address and we'll send you a reset link.
                    </p>

                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">

                    <div className="relative">

                      <IoMailOutline
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />

                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) =>
                          setForgotEmail(e.target.value)
                        }
                        placeholder="Email address"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm font-medium transition-all"
                      />

                    </div>

                    {forgotMessage && (
                      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-700">
                        {forgotMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 bg-brand text-white text-sm font-bold rounded-xl shadow-button hover:bg-brand-light disabled:opacity-60 transition-all"
                    >
                      {forgotLoading
                        ? 'Sending...'
                        : 'Send Reset Link'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(false);
                        setForgotMessage('');
                      }}
                      className="w-full py-3.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Back to Login
                    </button>

                  </form>
                </>
              ) : (
                <>
                  {/* Login / Signup UI */}
                  <div className="text-center mb-8">

                    <h1 className="font-heading text-3xl font-extrabold text-brand tracking-tight mb-4">
                      NEHDO
                    </h1>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {isLogin
                        ? 'Welcome Back'
                        : 'Create an Account'}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {isLogin
                        ? 'Please login to your account'
                        : 'Enter your details to register'}
                    </p>

                  </div>

                  {error && (
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {!isLogin && (
                      <div className="relative">

                        <IoPersonOutline
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />

                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                          placeholder="Full Name"
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm font-medium transition-all"
                        />

                      </div>
                    )}

                    <div className="relative">

                      <IoMailOutline
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />

                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm font-medium transition-all"
                      />

                    </div>

                    <div className="relative">

                      <IoLockClosedOutline
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />

                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        placeholder="Password"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm font-medium transition-all"
                      />

                    </div>

                    {isLogin && (
                      <div className="flex justify-end pt-1">

                        <button
                          type="button"
                          onClick={() => {
                            setForgotMode(true);
                            setForgotMessage('');
                          }}
                          className="text-xs font-semibold text-gray-500 hover:text-brand transition-colors"
                        >
                          Forgot password?
                        </button>

                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand text-white text-sm font-bold rounded-xl shadow-button hover:bg-brand-light hover:shadow-button-hover transition-all mt-4"
                    >
                      {isLogin
                        ? 'Login'
                        : 'Create Account'}
                    </button>

                  </form>

                  {/* Social Login Buttons */}
                  <div className="mt-8">

                    <div className="relative flex items-center justify-center">

                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100" />
                      </div>

                      <span className="relative bg-white px-4 text-xs font-medium text-gray-400">
                        Or {isLogin ? 'Login' : 'Sign up'} with
                      </span>

                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">

                      <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors" onClick={handalgoogleLogin}>
                        <IoLogoGoogle
                          size={18}
                          className="text-[#DB4437]"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Google
                        </span>
                      </button>

                      <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <IoLogoFacebook
                          size={18}
                          className="text-[#4267B2]"
                        />
                        <span className="text-sm font-semibold text-gray-700">
                          Facebook
                        </span>
                      </button>

                    </div>

                  </div>

                  <p className="mt-8 text-center text-sm font-medium text-gray-500">

                    {isLogin
                      ? "Don't have an account? "
                      : 'Already have an account? '}

                    <button
                      onClick={() =>
                        openAuthModal(
                          isLogin ? 'signup' : 'login'
                        )
                      }
                      className="text-brand font-bold hover:underline"
                    >
                      {isLogin ? 'Signup' : 'Login'}
                    </button>

                  </p>
                </>
              )}

            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default AuthModal;

