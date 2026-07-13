import React, { useState } from "react";
import { 
    IoAddOutline, IoSearchOutline, IoTrashOutline, 
    IoCloseOutline, IoCloudUploadOutline, IoImageOutline, IoPencilOutline,
    IoFolderOutline, IoGitBranchOutline, IoFilterOutline
} from "react-icons/io5";

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    parentCategory: string | null; // null means Main Category
    description: string;
    image?: string;
    displayOrder: number;
    status: "Active" | "Hidden";
    showOnHome: boolean;
    showInNav: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

const initialCategories: CategoryItem[] = [
    { id: 1, name: "Men", slug: "men", parentCategory: null, description: "Men's fashion and apparel", displayOrder: 1, status: "Active", showOnHome: true, showInNav: true },
    { id: 2, name: "T-Shirts", slug: "t-shirts", parentCategory: "Men", description: "Casual and graphic tees for men", displayOrder: 1, status: "Active", showOnHome: true, showInNav: true },
    { id: 3, name: "Shirts", slug: "shirts", parentCategory: "Men", description: "Formal and casual shirts for men", displayOrder: 2, status: "Active", showOnHome: false, showInNav: true },
    { id: 4, name: "Jeans", slug: "jeans", parentCategory: "Men", description: "Denim jeans and trousers", displayOrder: 3, status: "Active", showOnHome: false, showInNav: true },
    { id: 5, name: "Women", slug: "women", parentCategory: null, description: "Women's fashion and collection", displayOrder: 2, status: "Active", showOnHome: true, showInNav: true },
    { id: 6, name: "Dresses", slug: "dresses", parentCategory: "Women", description: "Designer dresses and evening wear", displayOrder: 1, status: "Active", showOnHome: true, showInNav: true },
    { id: 7, name: "Tops & Tees", slug: "tops-tees", parentCategory: "Women", description: "Women's tops, tees, and blouses", displayOrder: 2, status: "Active", showOnHome: false, showInNav: true },
    { id: 8, name: "Kids", slug: "kids", parentCategory: null, description: "Children and infant clothing", displayOrder: 3, status: "Active", showOnHome: true, showInNav: true },
    { id: 9, name: "Boys (3-12 Yrs)", slug: "boys", parentCategory: "Kids", description: "Clothing for boys", displayOrder: 1, status: "Active", showOnHome: false, showInNav: true },
    { id: 10, name: "Girls (3-12 Yrs)", slug: "girls", parentCategory: "Kids", description: "Clothing for girls", displayOrder: 2, status: "Active", showOnHome: false, showInNav: true },
    { id: 11, name: "Shoes", slug: "shoes", parentCategory: null, description: "Footwear collection", displayOrder: 4, status: "Active", showOnHome: true, showInNav: true },
    { id: 12, name: "Sneakers", slug: "sneakers", parentCategory: "Shoes", description: "Casual and sports sneakers", displayOrder: 1, status: "Active", showOnHome: true, showInNav: true },
    { id: 13, name: "Bags", slug: "bags", parentCategory: null, description: "Handbags, backpacks, and accessories", displayOrder: 5, status: "Active", showOnHome: true, showInNav: true },
];

const AdminCategories = () => {
    const [categoryList, setCategoryList] = useState<CategoryItem[]>(initialCategories);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [filterType, setFilterType] = useState<"All" | "Main" | "Sub">("All");
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [categoryType, setCategoryType] = useState<"main" | "sub">("main");
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [description, setDescription] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);
    const [status, setStatus] = useState<"Active" | "Hidden">("Active");
    const [showOnHome, setShowOnHome] = useState(true);
    const [showInNav, setShowInNav] = useState(true);

    const mainCategories = categoryList.filter(c => c.parentCategory === null);

    const resetForm = () => {
        setEditingCategory(null);
        setCategoryType("main");
        setName("");
        setSlug("");
        setParentCategory("");
        setDescription("");
        setDisplayOrder(0);
        setStatus("Active");
        setShowOnHome(true);
        setShowInNav(true);
    };

    const handleOpenAddModal = (type: "main" | "sub" = "main") => {
        resetForm();
        setCategoryType(type);
        setIsAddModalOpen(true);
    };

    const handleEditCategory = (cat: CategoryItem) => {
        setEditingCategory(cat);
        setCategoryType(cat.parentCategory ? "sub" : "main");
        setName(cat.name);
        setSlug(cat.slug);
        setParentCategory(cat.parentCategory || "");
        setDescription(cat.description);
        setDisplayOrder(cat.displayOrder);
        setStatus(cat.status);
        setShowOnHome(cat.showOnHome);
        setShowInNav(cat.showInNav);
        setIsAddModalOpen(true);
    };

    const handleDeleteCategory = (id: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setCategoryList(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleSaveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const autoSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const parent = categoryType === "sub" ? (parentCategory || mainCategories[0]?.name || null) : null;

        if (editingCategory) {
            setCategoryList(prev => prev.map(item => item.id === editingCategory.id ? {
                ...item,
                name: name.trim(),
                slug: autoSlug,
                parentCategory: parent,
                description: description.trim(),
                displayOrder: Number(displayOrder),
                status,
                showOnHome,
                showInNav
            } : item));
        } else {
            const newCat: CategoryItem = {
                id: Date.now(),
                name: name.trim(),
                slug: autoSlug,
                parentCategory: parent,
                description: description.trim(),
                displayOrder: Number(displayOrder),
                status,
                showOnHome,
                showInNav
            };
            setCategoryList(prev => [newCat, ...prev]);
        }

        setIsAddModalOpen(false);
        resetForm();
    };

    const filteredCategories = categoryList.filter(cat => {
        const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (cat.parentCategory && cat.parentCategory.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesSearch) return false;
        if (filterType === "Main") return cat.parentCategory === null;
        if (filterType === "Sub") return cat.parentCategory !== null;
        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header & Primary Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Categories & Sub-Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage main store categories and nested sub-categories.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => handleOpenAddModal("main")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-brand-light transition-colors"
                    >
                        <IoFolderOutline size={18} />
                        Add Main Category
                    </button>
                    <button 
                        onClick={() => handleOpenAddModal("sub")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-800 transition-colors"
                    >
                        <IoGitBranchOutline size={18} />
                        Add Sub-Category
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <IoFolderOutline size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Main Categories</p>
                        <p className="text-2xl font-bold text-gray-900">{categoryList.filter(c => c.parentCategory === null).length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <IoGitBranchOutline size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Sub-Categories</p>
                        <p className="text-2xl font-bold text-gray-900">{categoryList.filter(c => c.parentCategory !== null).length}</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <IoFilterOutline size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Active</p>
                        <p className="text-2xl font-bold text-gray-900">{categoryList.filter(c => c.status === "Active").length}</p>
                    </div>
                </div>
            </div>

            {/* Add / Edit Category Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSaveCategory}>
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingCategory ? "Edit Category" : (categoryType === "main" ? "Add Main Category" : "Add Sub-Category")}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {categoryType === "main" ? "Top-level category displayed in store navigation" : "Nested sub-category assigned under a parent category"}
                                    </p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)} 
                                    className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <IoCloseOutline size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Category Type Selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category Classification *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setCategoryType("main")}
                                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                                                categoryType === "main"
                                                    ? "bg-brand/10 border-brand text-brand shadow-sm"
                                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            <IoFolderOutline size={18} />
                                            Main Category
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCategoryType("sub")}
                                            className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                                                categoryType === "sub"
                                                    ? "bg-purple-50 border-purple-500 text-purple-700 shadow-sm"
                                                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            <IoGitBranchOutline size={18} />
                                            Sub-Category
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Parent Category Field (Only shown if Sub-Category) */}
                                    {categoryType === "sub" && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Main Category *</label>
                                            <select 
                                                value={parentCategory}
                                                onChange={e => setParentCategory(e.target.value)}
                                                required={categoryType === "sub"}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            >
                                                <option value="">Select Parent Category...</option>
                                                {mainCategories.map((cat) => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-400 mt-1">Sub-category will be grouped under this main category</p>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {categoryType === "main" ? "Main Category Name *" : "Sub-Category Name *"}
                                        </label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                            placeholder={categoryType === "main" ? "e.g. Men, Women, Electronics" : "e.g. T-Shirts, Dresses, Laptops"} 
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand font-medium" 
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 font-mono">/collection/</span>
                                            <input 
                                                type="text" 
                                                value={slug}
                                                onChange={e => setSlug(e.target.value)}
                                                placeholder={name ? name.toLowerCase().replace(/\s+/g, "-") : "auto-generated"} 
                                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm font-mono" 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order / Priority</label>
                                        <input 
                                            type="number" 
                                            value={displayOrder}
                                            onChange={e => setDisplayOrder(Number(e.target.value))}
                                            placeholder="0" 
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" 
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea 
                                            rows={3} 
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            placeholder="Short summary for shop banner or search engines..." 
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image / Icon</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                            <IoCloudUploadOutline size={32} className="mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm font-semibold text-gray-600">Click to upload category image</p>
                                            <p className="text-xs text-gray-400 mt-1">Recommended: 800×400px, PNG, JPG or WEBP</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                        <select 
                                            value={status}
                                            onChange={e => setStatus(e.target.value as any)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        >
                                            <option value="Active">Active (Visible)</option>
                                            <option value="Hidden">Hidden (Disabled)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Visibility Toggles */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-sm font-bold text-gray-700 mb-4">Display Options</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Show on Homepage</p>
                                                <p className="text-xs text-gray-500">Feature this category in the homepage slider or grid</p>
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                checked={showOnHome}
                                                onChange={e => setShowOnHome(e.target.checked)}
                                                className="w-5 h-5 text-brand rounded border-gray-300 focus:ring-brand" 
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Show in Navbar Menu</p>
                                                <p className="text-xs text-gray-500">Include in main navigation bar dropdowns</p>
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                checked={showInNav}
                                                onChange={e => setShowInNav(e.target.checked)}
                                                className="w-5 h-5 text-brand rounded border-gray-300 focus:ring-brand" 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)} 
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm"
                                >
                                    {editingCategory ? "Update Category" : "Save Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filter & Search Header */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <IoSearchOutline size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search categories & sub-categories..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl w-full sm:w-auto">
                        {(["All", "Main", "Sub"] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                                    filterType === type 
                                        ? "bg-white text-gray-900 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {type === "All" ? "All Categories" : (type === "Main" ? "Main Categories Only" : "Sub-Categories Only")}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Parent Category</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400 font-medium">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => {
                                    const isSub = category.parentCategory !== null;
                                    return (
                                        <tr key={category.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                                    {isSub ? <IoGitBranchOutline size={18} className="text-purple-500" /> : <IoFolderOutline size={18} className="text-brand" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900">{category.name}</span>
                                                </div>
                                                {category.description && (
                                                    <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{category.description}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isSub ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/50">
                                                        <IoGitBranchOutline size={12} />
                                                        Sub-Category
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/50">
                                                        <IoFolderOutline size={12} />
                                                        Main Category
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {category.parentCategory ? (
                                                    <span className="font-semibold text-gray-700">{category.parentCategory}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">— Top Level —</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                                /{category.slug}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    category.status === "Active" 
                                                        ? "bg-emerald-100 text-emerald-700" 
                                                        : "bg-gray-100 text-gray-600"
                                                }`}>
                                                    {category.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEditCategory(category)}
                                                        className="p-2 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                        title="Edit Category"
                                                    >
                                                        <IoPencilOutline size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Category"
                                                    >
                                                        <IoTrashOutline size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCategories;
