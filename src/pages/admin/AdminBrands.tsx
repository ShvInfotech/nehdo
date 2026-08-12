import React, { useEffect, useState } from "react";
import { IoAddOutline, IoSearchOutline, IoEllipsisVertical, IoCloseOutline, IoCloudUploadOutline, IoImageOutline } from "react-icons/io5";
// import { brands } from "../../data/products";
import { apiRequest } from "../../services/apiService"
const AdminBrands = () => {

    interface Brand {
        _id: string;
        name: string;
        slug: string;
        description: string;
        logo: string;
        homepageDisplay: boolean;
        status: 'active' | 'inactive';
        productCount: number;
    }
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [homepageDisplay, setHomepageDisplay] = useState(false);
    const [status, setStatus] = useState('active');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [logoPreview, setLogoPreview] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editBrandId, setEditBrandId] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        slug: '',
        description: '',
        logo: '',
    });


    const validateForm = () => {
        const newErrors = {
            name: '',
            slug: '',
            description: '',
            logo: '',
        };

        let isValid = true;

        // Brand Name
        if (!name.trim()) {
            newErrors.name = 'Brand name is required';
            isValid = false;
        }

        // Slug
        if (!slug.trim()) {
            newErrors.slug = 'Slug is required';
            isValid = false;
        } else if (slug.includes(' ')) {
            newErrors.slug = 'Slug cannot contain spaces';
            isValid = false;
        }

        // Description
        if (!description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        // Logo
        if (!isEditMode && !logo) {
            newErrors.logo = 'Brand logo is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleSaveBrand = async () => {
        if (!validateForm()) return;

        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('homepageDisplay', String(homepageDisplay));
            formData.append('status', status);

            if (logo) {
                formData.append('brandlogo', logo);
            }

            if (isEditMode) {
                // UPDATE API
                await apiRequest(`/admin/api/v1/brand/update/${editBrandId}`, 'PATCH', formData, {});
            } else {
                // ADD API
                await apiRequest('/admin/api/v1/brand/add', 'POST', formData, {});
            }

            // reset form
            resetForm();
            await getbrand();
            setIsAddModalOpen(false);
        } catch (err: any) {
            alert(err.message);
        }
    };


    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setLogo(null);
        setHomepageDisplay(false);
        setStatus('active');

        setIsEditMode(false);
        setEditBrandId('');
setLogoPreview('');
        setErrors({
            name: '',
            slug: '',
            description: '',
            logo: '',
        });
    };


    const handleEditBrand = (brand: Brand) => {
        setIsEditMode(true);
        setEditBrandId(brand._id);

        setName(brand.name);
        setSlug(brand.slug);
        setDescription(brand.description);
        setHomepageDisplay(brand.homepageDisplay);
        setStatus(brand.status);
         setLogoPreview(brand.logo || '');

        // existing logo string URL છે, File નથી
        setLogo(null);

        setIsAddModalOpen(true);
    };

    const getbrand = async () => {
        try {
            const data = await apiRequest('/admin/api/v1/brand/get', "GET")
            setBrands(data.brands)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getbrand()
    }, [])


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">Brands</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage product brands and their details.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />
                    Add Brand
                </button>
            </div>

            {/* Add Brand Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditMode ? 'Edit Brand' : 'Add New Brand'}
                            </h2>

                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <IoCloseOutline size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Brand Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Brand Name *
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="e.g. Nike"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        URL Slug *
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">/brands/</span>

                                        <input
                                            type="text"
                                            placeholder="nike"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />
                                        {errors.slug && (
                                            <p className="text-red-500 text-xs mt-1">{errors.slug}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>

                                    <textarea
                                        rows={3}
                                        placeholder="Brand description (shown on brand page)..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Logo */}
                                <div className="md:col-span-2">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Brand Logo
  </label>

  <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer block">

    <input
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0] || null;
        setLogo(file);

        if (file) {
          setLogoPreview(URL.createObjectURL(file));
        }
      }}
    />

    {logoPreview ? (
      <div className="flex flex-col items-center gap-3">
        <img
          src={logoPreview}
          alt="Brand preview"
          className="w-24 h-24 object-cover rounded-xl border border-gray-200"
        />

        <p className="text-sm font-medium text-gray-700">
          {logo ? logo.name : 'Current logo'}
        </p>

        <p className="text-xs text-brand font-semibold">
          Click to change logo
        </p>
      </div>
    ) : (
      <>
        <IoCloudUploadOutline
          size={32}
          className="mx-auto text-gray-400 mb-2"
        />

        <p className="text-sm font-semibold text-gray-600">
          Click to upload brand logo
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Recommended: 400×400px, PNG or JPG
        </p>
      </>
    )}
  </label>

  {errors.logo && (
    <p className="text-red-500 text-xs mt-2">{errors.logo}</p>
  )}
</div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status
                                    </label>

                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                            </div>

                            {/* Display Settings */}
                            <div className="border-t border-gray-100 pt-6">

                                <h3 className="text-sm font-bold text-gray-700 mb-4">
                                    Display Settings
                                </h3>

                                <div className="space-y-3">

                                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">

                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">
                                                Show on Homepage
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Display this brand in the homepage top brands section
                                            </p>
                                        </div>

                                        <label className="relative inline-flex items-center cursor-pointer">

                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={homepageDisplay}
                                                onChange={(e) => setHomepageDisplay(e.target.checked)}
                                            />

                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>

                                        </label>

                                    </label>

                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">

                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsAddModalOpen(false);
                                }}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveBrand}
                                className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm"
                            >
                                {isEditMode ? 'Update Brand' : 'Save Brand'}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-72">
                        <IoSearchOutline size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                </th>
                                <th className="px-6 py-4">Logo</th>
                                <th className="px-6 py-4">Brand Name</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {brands.map((brand, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {brand.logo ? (
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <IoImageOutline size={16} className="text-gray-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{brand?.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{brand.productCount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            {brand.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">

                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditBrand(brand)}
                                                className="text-brand text-sm font-semibold hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
                                                <IoEllipsisVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBrands;
