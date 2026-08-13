import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoPersonOutline, IoBagHandleOutline, IoHeartOutline, IoLocationOutline, IoSettingsOutline, IoLogOutOutline, IoCameraOutline } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { userapiRequest } from '../services/apiService';
import { useWishlist } from '../context/WishlistContext';

const SidebarNav = ({
    active,
    onLogout
}: {
    active: string;
    onLogout: () => void;
}) => {
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
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
                >
                    <IoLogOutOutline size={20} /> Logout
                </button>
            </nav>
        </div>
    );
};

const Account = () => {
    const { user, updateProfile, openAuthModal, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddressEditMode, setIsAddressEditMode] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const { clear } = useWishlist();
    const [addressForm, setAddressForm] = useState({
        addressline: '',
        landmark: '',
        city: '',
        state: '',
        postalCode: '',
        defaultaddress: false,
    });
    useEffect(() => {
        if (!user) {
            navigate("/");
            openAuthModal('login');
        }
    }, [user, navigate, openAuthModal]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleLogout = () => {
        logout();
        clear();
        navigate('/');
    };
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);

        if (profileImage) {
            data.append('profile', profileImage); // backend field name
        }

        await updateProfile(data);

        setIsEditing(false);
    };



    const handleAddAddress = async () => {
        try {
            const payload = {
                userId: user?._id,
                addressline: addressForm.addressline,
                landmark: addressForm.landmark,
                city: addressForm.city,
                state: addressForm.state,
                postalCode: addressForm.postalCode,
                defaultaddress: addressForm.defaultaddress,
            };

            let res: any;

            if (isAddressEditMode && editingAddressId) {
                // UPDATE API
                res = await userapiRequest(
                    `/user/api/v1/address/update/${editingAddressId}`,
                    'PATCH',
                    payload
                );

                updateProfile({
                    address: user?.address.map((a: any) =>
                        a._id === editingAddressId ? res.address : a
                    ) || []
                });

                alert('Address updated successfully');

            } else {
                // ADD API
                res = await userapiRequest(
                    '/user/api/v1/address/add',
                    'POST',
                    payload
                );

                updateProfile({
                    address: [...(user?.address || []), res.address]
                });

                alert('Address added successfully');
            }

            setAddressForm({
                addressline: '',
                landmark: '',
                city: '',
                state: '',
                postalCode: '',
                defaultaddress: false,
            });

            setIsAddressEditMode(false);
            setEditingAddressId(null);
            setIsAddressModalOpen(false);

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to save address');
        }
    };


    const handleEditAddress = (addr: any) => {
        setIsAddressEditMode(true);
        setEditingAddressId(addr._id);

        setAddressForm({
            addressline: addr.addressline || '',
            landmark: addr.landmark || '',
            city: addr.city || '',
            state: addr.state || '',
            postalCode: addr.postalCode || '',
            defaultaddress: addr.defaultaddress || false,
        });

        setIsAddressModalOpen(true);
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this address?');

            if (!confirmDelete) return;

            await userapiRequest(
                `/user/api/v1/address/delete/${id}`,
                'DELETE'
            );

            // local state update
            updateProfile({
                address: user?.address.filter((a: any) => a._id !== id) || []
            });

            alert('Address deleted successfully');

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to delete address');
        }
    };

    if (!user) return null;




    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Account" }]} /></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <SidebarNav active="profile" onLogout={handleLogout} />
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
                                    {imagePreview || user?.profile ? (
                                        <img
                                            src={imagePreview || user.profile}
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

                            {/* Form */}
                            <div className="flex-1 w-full">
                                {isEditing ? (
                                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
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
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-sm font-semibold text-brand hover:underline"
                                >
                                    Add New
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user.address && user.address.length > 0 ? (
                                    user.address.map((addr: any) => (
                                        <div
                                            key={addr._id}
                                            className={`border rounded-2xl p-5 relative ${addr.defaultaddress
                                                ? 'border-brand bg-brand/5'
                                                : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            {addr.defaultaddress && (
                                                <span className="absolute top-4 right-4 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                                    Default
                                                </span>
                                            )}


                                            <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">
                                                {addr.addressline}
                                                {addr.landmark && `, ${addr.landmark}`}
                                                {addr.city && `, ${addr.city}`}
                                                {addr.state && `, ${addr.state}`}
                                                {addr.postalCode && ` - ${addr.postalCode}`}
                                            </p>

                                            <div className="flex gap-4">
                                               <button
  onClick={() => handleEditAddress(addr)}
  className="text-sm font-semibold text-brand hover:underline"
>
  Edit
</button>

                                                <button
  onClick={() => handleDeleteAddress(addr._id)}
  className="text-sm font-semibold text-red-500 hover:underline"
>
  Delete
</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500 text-sm">
                                        No address found
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h3 className="font-heading text-xl font-bold text-gray-900">
                                {isAddressEditMode ? 'Edit Address' : 'Add New Address'}
                            </h3>

                            <button
                                onClick={() => setIsAddressModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Address Line
                                </label>

                                <textarea
                                    rows={3}
                                    value={addressForm.addressline}
                                    onChange={(e) =>
                                        setAddressForm({
                                            ...addressForm,
                                            addressline: e.target.value,
                                        })
                                    }
                                    placeholder="Enter house number, street, area"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Landmark
                                </label>

                                <input
                                    type="text"
                                    value={addressForm.landmark}
                                    onChange={(e) =>
                                        setAddressForm({
                                            ...addressForm,
                                            landmark: e.target.value,
                                        })
                                    }
                                    placeholder="Nearby landmark"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) =>
                                            setAddressForm({
                                                ...addressForm,
                                                city: e.target.value,
                                            })
                                        }
                                        placeholder="City"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) =>
                                            setAddressForm({
                                                ...addressForm,
                                                state: e.target.value,
                                            })
                                        }
                                        placeholder="State"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Postal Code
                                </label>

                                <input
                                    type="text"
                                    value={addressForm.postalCode}
                                    onChange={(e) =>
                                        setAddressForm({
                                            ...addressForm,
                                            postalCode: e.target.value,
                                        })
                                    }
                                    placeholder="Postal Code"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand"
                                />
                            </div>

                            <label className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={addressForm.defaultaddress}
                                    onChange={(e) =>
                                        setAddressForm({
                                            ...addressForm,
                                            defaultaddress: e.target.checked,
                                        })
                                    }
                                    className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                                />

                                <span className="text-sm font-medium text-gray-700">
                                    Set as default address
                                </span>
                            </label>

                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-white">

                            <button
                                type="button"
                                onClick={() => setIsAddressModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="px-6 py-2.5 rounded-xl bg-brand text-white font-semibold shadow-button hover:bg-brand-light transition-all"
                            >
                               {isAddressEditMode ? 'Update Address' : 'Save Address'}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>



    );
};

export default Account;
