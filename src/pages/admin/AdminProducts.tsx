import React, { useEffect, useState } from "react";
import { IoAddOutline, IoSearchOutline, IoFilterOutline, IoEllipsisVertical, IoCloseOutline, IoCloudUploadOutline, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import { products, brands, categories, subCategories } from "../../data/products";
import { apiRequest } from "../../services/apiService";
const AdminProducts = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [editProductId, setEditProductId] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productList, setProductList] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [activeTab, setActiveTab] = useState<'general' | 'variants' | 'inventory' | 'shipping' | 'seo'>('general');

    // General
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [brandId, setBrandId] = useState("");
    const [tags, setTags] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [status, setStatus] = useState("Active");

    // Images
    const [productImages, setProductImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Flags
    const [featured, setFeatured] = useState(false);
    const [newArrival, setNewArrival] = useState(false);
    const [trending, setTrending] = useState(false);

    // Variants
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [material, setMaterial] = useState("");

    // Inventory
    const [stock, setStock] = useState("0");
    const [lowStock, setLowStock] = useState("0");
    const [warehouseLocation, setWarehouseLocation] = useState("");
    const [trackInventory, setTrackInventory] = useState(true);
    const [backorders, setBackorders] = useState(false);

    // Shipping
    const [shippingRequired, setShippingRequired] = useState(true);
    const [weight, setWeight] = useState("");
    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [HSCode, setHSCode] = useState("");

    // SEO
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    // API data
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [subcategoryOptions, setSubcategoryOptions] = useState<any[]>([]);
    const [brandOptions, setBrandOptions] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const [variants, setVariants] = useState<any[]>([]);

    useEffect(() => {
        const generated: any[] = [];

        // Jo size ane color banne select hoy
        if (selectedSizes.length && selectedColors.length) {
            selectedColors.forEach((color) => {
                selectedSizes.forEach((size) => {
                    generated.push({
                        name: `${color}/${size}`,
                        price: "",
                        stock: "",
                        sku: "",
                    });
                });
            });
        }

        // Jo size j select hoy
        else if (selectedSizes.length) {
            selectedSizes.forEach((size) => {
                generated.push({
                    name: size,
                    price: "",
                    stock: "",
                    sku: "",
                });
            });
        }

        // Jo color j select hoy
        else if (selectedColors.length) {
            selectedColors.forEach((color) => {
                generated.push({
                    name: color,
                    price: "",
                    stock: "",
                    sku: "",
                });
            });
        }

        setVariants(generated);
    }, [selectedSizes, selectedColors]);
    const tabs = [
        { key: 'general', label: 'General Info' },
        { key: 'variants', label: 'Variants' },
        { key: 'inventory', label: 'Inventory' },
        { key: 'shipping', label: 'Shipping' },
        { key: 'seo', label: 'SEO' },
    ];


    const fetchCategories = async () => {
        try {
            const res = await apiRequest("/admin/api/v1/category/get", "GET");
            setCategoryOptions(res.categories || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSubCategories = async (categoryId: string) => {
        try {
            const res = await apiRequest(
                `/admin/api/v1/subcategory/get?categoryId=${categoryId}`,
                "GET"
            );
            setSubcategoryOptions(res.subcategories || []);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await apiRequest("/admin/api/v1/brand/get", "GET");
            setBrandOptions(res.brands || []);
        } catch (error) {
            console.log(error);
        }
    };


    const fetchProducts = async (currentPage = 1) => {
        try {
            const res = await apiRequest(
                `/admin/api/v1/product/get?page=${currentPage}&limit=10`,
                "GET"
            );
            console.log(res)
            // backend response પ્રમાણે adjust કર
            setProductList(res.products || []);
            setCurrentPage(res.pagination?.page || 1);
            setTotalPages(res.pagination?.totalPages || 1);
            setTotalProducts(res.pagination?.total || 0);

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchProducts();
    }, []);



    const handlePublishProduct = async () => {
        try {
            setLoading(true);

            if (editProductId) {
                const flags: string[] = [];
            const formData = new FormData();
            formData.append("name", productName);
            formData.append("categoryId", selectedCategory);
            formData.append("subcategoryId", selectedSubCategory);
            formData.append("brandId", brandId);
            formData.append("price", price);
            formData.append("salePrice", salePrice || "0");
            formData.append("itemCost", costPrice || "0");
            formData.append("tags", tags);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("status", status);



            if (featured) flags.push("Featured");
            if (newArrival) flags.push("New Arrival");
            if (trending) flags.push("Trending");
            formData.append("flags", JSON.stringify(flags));
            formData.append("size", JSON.stringify(selectedSizes));
            formData.append("colors", JSON.stringify(selectedColors));
            formData.append("material", material);
            formData.append("stock", stock);
            formData.append("lowStock", lowStock);
            formData.append("warehouseLocation", warehouseLocation);
            formData.append("trackInventory", String(trackInventory));
            formData.append("backorders", String(backorders));
            formData.append("shipping", String(shippingRequired));
            formData.append("weight", weight);
            formData.append("metaTitle", metaTitle);
            formData.append("metaDescription", metaDescription);
            formData.append("variant", JSON.stringify(variants));
            formData.append("weight", weight);
            formData.append("dimensions", JSON.stringify({ length, width, height, }));
            formData.append("HSCode", HSCode);



            productImages.forEach((file) => {
                formData.append("productImage", file);
            });
                await apiRequest(
                    `/admin/api/v1/product/update/${editProductId}`,
                    "PATCH",
                    formData
                );

                alert("Product updated successfully");
                resetForm()
return      
            }

            const flags: string[] = [];
            const formData = new FormData();
            formData.append("name", productName);
            formData.append("categoryId", selectedCategory);
            formData.append("subcategoryId", selectedSubCategory);
            formData.append("brandId", brandId);
            formData.append("price", price);
            formData.append("salePrice", salePrice || "0");
            formData.append("itemCost", costPrice || "0");
            formData.append("tags", tags);
            formData.append("shortDescription", shortDescription);
            formData.append("longDescription", longDescription);
            formData.append("status", status);



            if (featured) flags.push("Featured");
            if (newArrival) flags.push("New Arrival");
            if (trending) flags.push("Trending");
            formData.append("flags", JSON.stringify(flags));
            formData.append("size", JSON.stringify(selectedSizes));
            formData.append("colors", JSON.stringify(selectedColors));
            formData.append("material", material);
            formData.append("stock", stock);
            formData.append("lowStock", lowStock);
            formData.append("warehouseLocation", warehouseLocation);
            formData.append("trackInventory", String(trackInventory));
            formData.append("backorders", String(backorders));
            formData.append("shipping", String(shippingRequired));
            formData.append("weight", weight);
            formData.append("metaTitle", metaTitle);
            formData.append("metaDescription", metaDescription);
            formData.append("variant", JSON.stringify(variants));
            formData.append("weight", weight);
            formData.append("dimensions", JSON.stringify({ length, width, height, }));
            formData.append("HSCode", HSCode);



            productImages.forEach((file) => {
                formData.append("productImage", file);
            });

            await apiRequest(
                "/admin/api/v1/product/add",
                "POST",
                formData
            );

            alert("Product added successfully");
            await fetchProducts();
            setIsAddModalOpen(false);
            
        } catch (error) {
            console.log(error);
            alert("Failed to add product");
        } finally {
            setLoading(false);
        }
    };



    const handleEditProduct = async (id: string) => {
        try {
            const res = await apiRequest(
                `/admin/api/v1/product/edit/${id}`,
                "GET"
            );

            const { product, variant, inventory, shipping } = res;

            // edit mode
            setEditProductId(product._id);

            // ---------- Product ----------
            setProductName(product.name || "");
            setSelectedCategory(product.categoryId || "");

            // subcategory options load
            await fetchSubCategories(product.categoryId);

            setSelectedSubCategory(product.subcategoryId || "");
            setBrandId(product.brandId || "");

            setPrice(String(product.price || ""));
            setSalePrice(String(product.salePrice || ""));
            setCostPrice(String(product.itemCost || ""));

            setTags(product.tags?.join(", ") || "");

            setShortDescription(product.shortDescription || "");
            setLongDescription(product.longDescription || "");

            setStatus(product.status || "Draft");

            // ---------- Images ----------
            setImagePreviews(product.productImage || []);
            setProductImages([]); // existing images only preview

            // ---------- Flags ----------
            setFeatured(product.flags?.includes("Featured") || false);
            setNewArrival(product.flags?.includes("New Arrival") || false);
            setTrending(product.flags?.includes("Trending") || false);

            // ---------- Variant ----------
            setSelectedSizes(variant?.size || []);
            setSelectedColors(variant?.colorOptions || []);
            setMaterial(variant?.material || "");

            // existing variant rows
            setVariants(
                (variant?.variant || []).map((v: any) => ({
                    name: v.name,
                    price: String(v.price || ""),
                    stock: String(v.stock || ""),
                    sku: v.sku || ""
                }))
            );

            // ---------- Inventory ----------
            setStock(String(inventory?.stock || 0));
            setLowStock(String(inventory?.lowStock || 0));
            setWarehouseLocation(inventory?.warehouseLocation || "");
            setTrackInventory(Boolean(inventory?.trackInventory));
            setBackorders(Boolean(inventory?.backorders));

            // ---------- Shipping ----------
            setShippingRequired(Boolean(shipping?.shipping));
            setWeight(String(shipping?.weight || ""));
            setLength(String(shipping?.dimensions?.length || ""));
            setWidth(String(shipping?.dimensions?.width || ""));
            setHeight(String(shipping?.dimensions?.height || ""));
            setHSCode(shipping?.HSCode || "");

            // ---------- SEO ----------
            setMetaTitle(product.metaTitle || "");
            setMetaDescription(product.metaDescription || "");

            // open modal
            setIsAddModalOpen(true);

        } catch (error) {
            console.log(error);
            alert("Failed to load product details");
        }
    };


    const resetForm = () => {
        setEditProductId(null);

        setProductName("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setBrandId("");

        setPrice("");
        setSalePrice("");
        setCostPrice("");

        setTags("");

        setShortDescription("");
        setLongDescription("");

        setStatus("Draft");

        setProductImages([]);
        setImagePreviews([]);

        setFeatured(false);
        setNewArrival(false);
        setTrending(false);

        setSelectedSizes([]);
        setSelectedColors([]);
        setMaterial("");
        setVariants([]);

        setStock("0");
        setLowStock("0");
        setWarehouseLocation("");
        setTrackInventory(true);
        setBackorders(false);

        setShippingRequired(true);
        setWeight("");
        setLength("");
        setWidth("");
        setHeight("");
        setHSCode("");

        setMetaTitle("");
        setMetaDescription("");
    };
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your product inventory and listings.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Add Product
                </button>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editProductId ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                                <IoCloseOutline size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-100 px-6 flex gap-1 overflow-x-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key as any)}
                                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key
                                        ? 'border-brand text-brand'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 space-y-6">
                            {activeTab === 'general' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                                            <input
                                                type="text"
                                                value={productName}
                                                onChange={(e) => setProductName(e.target.value)}
                                                placeholder="e.g. Classic White Tee"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/20"
                                            />                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
                                            <input type="text" placeholder="e.g. TEE-WH-001" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Barcode (ISBN, UPC, EAN)</label>
                                            <input type="text" placeholder="e.g. 8901234567890" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Price (₹) *</label>
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sale Price (₹)</label>
                                            <input
                                                type="number"
                                                value={salePrice}
                                                onChange={(e) => setSalePrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cost per Item (₹)</label>
                                            <input
                                                type="number"
                                                value={costPrice}
                                                onChange={(e) => setCostPrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                            <p className="text-xs text-gray-400 mt-1">Used for profit margin calculation</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Main Category *</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => {
                                                    setSelectedCategory(e.target.value);
                                                    setSelectedSubCategory("");
                                                    fetchSubCategories(e.target.value);
                                                }}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            >
                                                <option value="">Select Main Category</option>

                                                {categoryOptions.map((cat: any) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Category</label>
                                            <select
                                                value={selectedSubCategory}
                                                onChange={(e) => setSelectedSubCategory(e.target.value)}
                                                disabled={!selectedCategory}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand disabled:opacity-50"
                                            >
                                                <option value="">
                                                    {selectedCategory ? "Select Sub-Category" : "Select Main Category First"}
                                                </option>

                                                {subcategoryOptions.map((sub: any) => (
                                                    <option key={sub._id} value={sub._id}>
                                                        {sub.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                                            <select
                                                value={brandId}
                                                onChange={(e) => setBrandId(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            >
                                                <option value="">Select Brand</option>

                                                {brandOptions.map((brand: any) => (
                                                    <option key={brand._id} value={brand._id}>
                                                        {brand.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
                                            <input
                                                type="text"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                placeholder="e.g. summer, casual, cotton"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                            <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Product Images *
                                            </label>

                                            <label
                                                htmlFor="productImages"
                                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer block"
                                            >
                                                <IoCloudUploadOutline size={40} className="mx-auto text-gray-400 mb-3" />

                                                <p className="text-sm font-semibold text-gray-600">
                                                    Drag & Drop or Click to upload images
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    PNG, JPG, WEBP up to 5MB each • First image will be the featured image
                                                </p>

                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="productImages"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);

                                                        setProductImages(files);
                                                        setImagePreviews(files.map(file => URL.createObjectURL(file)));
                                                    }}
                                                />
                                            </label>

                                            {/* Preview Images */}
                                            <div className="flex gap-3 mt-4 flex-wrap">
                                                {imagePreviews.map((img, i) => (
                                                    <div
                                                        key={i}
                                                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`preview-${i}`}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProductImages(prev => prev.filter((_, index) => index !== i));
                                                                setImagePreviews(prev => prev.filter((_, index) => index !== i));
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                                        >
                                                            <IoTrashOutline size={12} />
                                                        </button>

                                                        {i === 0 && (
                                                            <span className="absolute bottom-0 left-0 right-0 text-[10px] font-bold text-center bg-brand text-white py-0.5">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
                                            <textarea
                                                rows={2}
                                                value={shortDescription}
                                                onChange={(e) => setShortDescription(e.target.value)}
                                                placeholder="Brief product summary (shown on product cards)..."
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Long Description *</label>
                                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1 flex-wrap">
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm font-bold hover:bg-gray-100">B</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm italic hover:bg-gray-100">I</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm underline hover:bg-gray-100">U</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">H1</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">H2</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">• List</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">1. List</button>
                                                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">Link</button>
                                                    <button className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-100">Image</button>
                                                </div>
                                                <textarea
                                                    rows={6}
                                                    value={longDescription}
                                                    onChange={(e) => setLongDescription(e.target.value)}
                                                    placeholder="Write detailed product description..."
                                                    className="w-full p-4 focus:outline-none"
                                                />                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Status *</label>
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Draft">Draft</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand">
                                                <option>Visible (Listed on store)</option>
                                                <option>Hidden (Only via direct link)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 space-y-4">
                                        <h3 className="text-sm font-bold text-gray-700">Product Flags</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" checked={featured}
                                                    onChange={(e) => setFeatured(e.target.checked)} />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                                                    <p className="text-xs text-gray-400">Show on homepage</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" checked={newArrival}
                                                    onChange={(e) => setNewArrival(e.target.checked)} />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">New Arrival</span>
                                                    <p className="text-xs text-gray-400">Show "New" badge</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" checked={trending}
                                                    onChange={(e) => setTrending(e.target.checked)} />
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">Trending</span>
                                                    <p className="text-xs text-gray-400">Show in trending section</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'variants' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Size Options</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map(size => (
                                                <label key={size} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSizes.includes(size)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedSizes(prev => [...prev, size]);
                                                            } else {
                                                                setSelectedSizes(prev => prev.filter(s => s !== size));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
                                                    />
                                                    <span className="text-sm font-semibold text-gray-700">{size}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Color Options</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { name: "White", color: "#FFFFFF" },
                                                { name: "Black", color: "#000000" },
                                                { name: "Navy", color: "#1B2A4A" },
                                                { name: "Red", color: "#DC2626" },
                                                { name: "Blue", color: "#3B82F6" },
                                                { name: "Green", color: "#22C55E" },
                                                { name: "Beige", color: "#D2B48C" },
                                                { name: "Grey", color: "#9CA3AF" },
                                            ].map(c => (
                                                <label key={c.name} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-brand transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedColors.includes(c.name)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedColors(prev => [...prev, c.name]);
                                                            } else {
                                                                setSelectedColors(prev => prev.filter(color => color !== c.name));
                                                            }
                                                        }}
                                                        className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand"
                                                    />
                                                    <span
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: c.color }}
                                                    ></span>
                                                    <span className="text-sm font-semibold text-gray-700">{c.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <div className="mt-3">
                                            <input type="text" placeholder="Add custom color (e.g. Olive Green)" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm w-64" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Material</h3>
                                        <select
                                            value={material}
                                            onChange={(e) => setMaterial(e.target.value)}
                                            className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        >
                                            <option value="">Select Material</option>
                                            <option>100% Cotton</option>
                                            <option>Cotton Blend</option>
                                            <option>Polyester</option>
                                            <option>Silk</option>
                                            <option>Linen</option>
                                            <option>Denim</option>
                                            <option>Wool</option>
                                            <option>Leather</option>
                                        </select>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <h3 className="text-sm font-bold text-blue-700 mb-2">Variant Price Table</h3>
                                        <p className="text-xs text-blue-600 mb-4">Set individual prices and stock for each variant combination. Leave blank to use default price.</p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="text-xs text-gray-500 uppercase">
                                                    <tr>
                                                        <th className="text-left py-2 pr-4">Variant</th>
                                                        <th className="text-left py-2 pr-4">Price (₹)</th>
                                                        <th className="text-left py-2 pr-4">Stock</th>
                                                        <th className="text-left py-2">SKU</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-blue-100">
                                                    {variants.map((variant, i) => (
                                                        <tr key={i}>
                                                            <td className="py-2 pr-4 font-medium text-gray-700">
                                                                {variant.name}
                                                            </td>

                                                            <td className="py-2 pr-4">
                                                                <input
                                                                    type="number"
                                                                    value={variant.price}
                                                                    onChange={(e) => {
                                                                        const updated = [...variants];
                                                                        updated[i].price = e.target.value;
                                                                        setVariants(updated);
                                                                    }}
                                                                    placeholder="—"
                                                                    className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                                                                />
                                                            </td>

                                                            <td className="py-2 pr-4">
                                                                <input
                                                                    type="number"
                                                                    value={variant.stock}
                                                                    onChange={(e) => {
                                                                        const updated = [...variants];
                                                                        updated[i].stock = e.target.value;
                                                                        setVariants(updated);
                                                                    }}
                                                                    placeholder="0"
                                                                    className="w-20 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                                                                />
                                                            </td>

                                                            <td className="py-2">
                                                                <input
                                                                    type="text"
                                                                    value={variant.sku}
                                                                    onChange={(e) => {
                                                                        const updated = [...variants];
                                                                        updated[i].sku = e.target.value;
                                                                        setVariants(updated);
                                                                    }}
                                                                    placeholder="Auto"
                                                                    className="w-28 px-2 py-1 bg-white border border-gray-200 rounded text-sm"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'inventory' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                placeholder="0"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Low Stock Threshold</label>
                                            <input
                                                type="number"
                                                value={lowStock}
                                                onChange={(e) => setLowStock(e.target.value)}
                                                placeholder="10"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                            <p className="text-xs text-gray-400 mt-1">Alert when stock falls below this number</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Warehouse Location</label>
                                            <input
                                                type="text"
                                                value={warehouseLocation}
                                                onChange={(e) => setWarehouseLocation(e.target.value)}
                                                placeholder="e.g. Warehouse A, Shelf B3"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Track Inventory</p>
                                                <p className="text-xs text-gray-500">Automatically track stock levels and prevent overselling</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={trackInventory}
                                                    onChange={(e) => setTrackInventory(e.target.checked)}
                                                    className="sr-only peer"
                                                />                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                            </label>
                                        </label>
                                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Allow Backorders</p>
                                                <p className="text-xs text-gray-500">Allow customers to order even when out of stock</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={backorders}
                                                    onChange={(e) => setBackorders(e.target.checked)}
                                                    className="sr-only peer"
                                                />                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                            </label>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'shipping' && (
                                <div className="space-y-6">
                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">This product requires shipping</p>
                                            <p className="text-xs text-gray-500">Uncheck for digital products or services</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                            />                                       </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Dimensions (cm)</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                    placeholder="Length"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
                                                />                                                <p className="text-xs text-gray-400 mt-1 text-center">Length</p>
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={width}
                                                    onChange={(e) => setWidth(e.target.value)}
                                                    placeholder="Width"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
                                                />                                                <p className="text-xs text-gray-400 mt-1 text-center">Width</p>
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    placeholder="Height"
                                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
                                                />                                                <p className="text-xs text-gray-400 mt-1 text-center">Height</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">HS Code (for international shipping)</label>
                                        <input
                                            type="text"
                                            value={HSCode}
                                            onChange={(e) => setHSCode(e.target.value)}
                                            placeholder="e.g. 6109.10"
                                            className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />                                    </div>
                                </div>
                            )}

                            {activeTab === 'seo' && (
                                <div className="space-y-6">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                        <h3 className="text-sm font-bold text-green-700 mb-1">Search Engine Preview</h3>
                                        <div className="mt-2">
                                            <p className="text-blue-700 text-lg font-medium">Classic White Tee — NEHDO</p>
                                            <p className="text-green-700 text-sm">https://nehdo.com/product/classic-white-tee</p>
                                            <p className="text-gray-600 text-sm mt-1">Premium quality cotton t-shirt perfect for everyday wear. Available in multiple sizes and colors.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-400">nehdo.com/product/</span>
                                            <input type="text" placeholder="classic-white-tee" className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            value={metaTitle}
                                            onChange={(e) => setMetaTitle(e.target.value)}
                                            placeholder="e.g. Classic White Tee — NEHDO"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />                                        <p className="text-xs text-gray-400 mt-1">0/60 characters recommended</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                                        <textarea
                                            rows={3}
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                            placeholder="Brief description for search engine results..."
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />                                        <p className="text-xs text-gray-400 mt-1">0/160 characters recommended</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white z-10">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Save as Draft</button>
                                <button
                                    onClick={handlePublishProduct}
                                    disabled={loading}
                                    className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm disabled:opacity-50"
                                >
                                    {loading
                                        ? editProductId
                                            ? "Updating..."
                                            : "Publishing..."
                                        : editProductId
                                            ? "Update Product"
                                            : "Publish Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Categories</option>
                            <option>T-Shirts</option>
                            <option>Shirts</option>
                            <option>Jeans</option>
                        </select>
                        <select className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Draft</option>
                            <option>Archived</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 whitespace-nowrap">
                            <IoFilterOutline size={18} />
                            More Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                </th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {productList.slice(0, 10).map((product, idx) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img src={product.productImage} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">PRD-{product.sku}</td>
                                    <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">₹{product.salePrice.toFixed(2)}</p>
                                            {product.price && <p className="text-xs text-gray-400 line-through">₹{product.price.toFixed(2)}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-medium ${idx === 4 ? 'text-red-600' : idx === 1 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.isTrending ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditProduct(product._id)}
                                                className="text-brand text-sm font-semibold hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => setProductList(prev => prev.filter(p => p.id !== product.id))} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <IoTrashOutline size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>
                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalProducts)} of {totalProducts} entries
                    </span>

                    <div className="flex gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded border text-sm ${currentPage === page
                                    ? "bg-brand text-white border-brand"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
