import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    IoPersonOutline,
    IoBagHandleOutline,
    IoHeartOutline,
    IoLogOutOutline,
    IoCameraOutline,
} from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from "../services/apiService";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const SidebarNav = ({
    active,
    onLogout,
}: {
    active: string;
    onLogout: () => void;
}) => {
    const navs = [
        {
            id: "profile",
            label: "My Profile",
            icon: IoPersonOutline,
            href: "/account",
        },
        {
            id: "orders",
            label: "My Orders",
            icon: IoBagHandleOutline,
            href: "/orders",
        },
        {
            id: "wishlist",
            label: "Wishlist",
            icon: IoHeartOutline,
            href: "/wishlist",
        },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 shadow-card border border-gray-100">
            <nav className="flex flex-col gap-2">
                {navs.map((n) => (
                    <Link
                        key={n.id}
                        to={n.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${active === n.id
                                ? "bg-brand text-white shadow-button"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <n.icon size={20} />
                        {n.label}
                    </Link>
                ))}

                <div className="h-px bg-gray-100 my-2 mx-4" />

                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
                >
                    <IoLogOutOutline size={20} />
                    Logout
                </button>
            </nav>
        </div>
    );
};

const Account = () => {
    const { user, updateProfile, openAuthModal, logout } = useAuth();

    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { clear } = useWishlist();

    const { clearCart } = useCart();

    /*
     * If user is not logged in
     */

    useEffect(() => {
        if (!user) {
            navigate("/");
            openAuthModal("login");
        }
    }, [user, navigate, openAuthModal]);

    /*
     * Update form data when user changes
     */

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    /*
     * Profile Image Change
     */

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    /*
     * Logout
     */

    const handleLogout = () => {
        logout();
        clear();
        clearCart();

        navigate("/");
    };

    /*
     * Save Profile
     */

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter your name");
            return;
        }

        if (!formData.email.trim()) {
            alert("Please enter your email");
            return;
        }

        const data = new FormData();

        data.append("name", formData.name);
        data.append("email", formData.email);

        if (formData.phone.trim()) {
            data.append("phone", formData.phone.trim());
        }

        if (profileImage) {
            data.append("profile", profileImage);
        }

        try {
            await updateProfile(data);

            setIsEditing(false);

            alert("Profile updated successfully");
        } catch (error: any) {
            console.error(error);

            alert(
                error?.message ||
                "Failed to update profile"
            );
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6">
                <Breadcrumb items={[{ label: "Account" }]} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}

                <div className="lg:col-span-1">
                    <SidebarNav
                        active="profile"
                        onLogout={handleLogout}
                    />
                </div>

                {/* Profile Content */}

                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-6 md:p-10 shadow-card border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-heading text-2xl md:text-3xl font-bold">
                                My Profile
                            </h1>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2.5 bg-brand/10 text-brand font-semibold rounded-xl hover:bg-brand hover:text-white transition-all text-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Profile */}

                        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                            {/* Avatar */}

                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-brand/20 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                    {imagePreview || user?.profile ? (
                                        <img
                                            src={
                                                imagePreview ||
                                                user.profile
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-heading text-3xl font-bold text-brand uppercase">
                                            {user.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profileImageInput"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />

                                <label
                                    htmlFor="profileImageInput"
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <IoCameraOutline size={16} />
                                </label>
                            </div>

                            {/* Profile Form */}

                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <form
                                        onSubmit={handleSave}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                Phone Number
                                            </label>

                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                placeholder="Enter mobile number"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex gap-3 mt-4">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light"
                                            >
                                                Save Changes
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);

                                                    setFormData({
                                                        name:
                                                            user?.name || "",
                                                        email:
                                                            user?.email || "",
                                                        phone:
                                                            user?.phone || "",
                                                    });
                                                }}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Full Name
                                            </p>

                                            <p className="font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Email Address
                                            </p>

                                            <p className="font-medium text-gray-900">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                                Phone Number
                                            </p>

                                            <p
                                                className={`font-medium ${user.phone?.trim()
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                    }`}
                                            >
                                                {user.phone ||
                                                    "Not added yet"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Account;