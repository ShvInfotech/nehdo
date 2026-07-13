import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoPersonOutline, IoBagHandleOutline, IoHeartOutline, IoLocationOutline, IoSettingsOutline, IoLogOutOutline, IoCameraOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";

const SidebarNav = ({ active }: { active: string }) => {
    const navs = [
        { id: "profile", label: "My Profile", icon: IoPersonOutline, href: "/account" },
        { id: "orders", label: "My Orders", icon: IoBagHandleOutline, href: "/orders" },
        { id: "wishlist", label: "Wishlist", icon: IoHeartOutline, href: "/wishlist" },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100">
            <nav className="flex flex-col gap-2">
                {navs.map(n => (
                    <Link key={n.id} to={n.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active === n.id ? "bg-brand text-white shadow-button" : "text-gray-600 hover:bg-gray-100"}`}>
                        <n.icon size={20} /> {n.label}
                    </Link>
                ))}
                <div className="h-px bg-gray-100 my-2 mx-4" />
                <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left">
                    <IoLogOutOutline size={20} /> Logout
                </button>
            </nav>
        </div>
    );
};

const Account = () => {
    const { user, updateProfile, openAuthModal } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });

    useEffect(() => {
        if (!user) {
            navigate("/");
            openAuthModal('login');
        }
    }, [user, navigate, openAuthModal]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
    };

    if (!user) return null;

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Account" }]} /></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <SidebarNav active="profile" />
                </div>
                
                <div className="lg:col-span-3">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-heading text-2xl md:text-3xl font-bold">My Profile</h1>
                            {!isEditing && <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-brand/10 text-brand font-semibold rounded-xl hover:bg-brand hover:text-white transition-all text-sm">Edit Profile</button>}
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    <span className="font-heading text-3xl font-bold text-brand uppercase">{user.name.charAt(0)}</span>
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                                    <IoCameraOutline size={16} />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div className="md:col-span-2 flex gap-3 mt-4">
                                            <button type="submit" className="px-6 py-3 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light">Save Changes</button>
                                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300">Cancel</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                                            <p className="font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-8" />

                        {/* Addresses */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-xl font-bold">Saved Addresses</h2>
                                <button className="text-sm font-semibold text-brand hover:underline">Add New</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-brand rounded-2xl p-5 relative bg-brand/5">
                                    <span className="absolute top-4 right-4 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Default</span>
                                    <p className="font-bold mb-1">{user.name}</p>
                                    <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{user.address}</p>
                                    <div className="flex gap-4">
                                        <button className="text-sm font-semibold text-brand hover:underline">Edit</button>
                                        <button className="text-sm font-semibold text-red-500 hover:underline">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Account;
