import React, { useEffect, useRef, useState } from "react";
import {
    IoAddOutline,
    IoSearchOutline,
    IoEllipsisVertical,
    IoImageOutline,
    IoCloseOutline,
    IoCloudUploadOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

type Placement = "Hero Slider" | "Promotional Strip";
type BannerStatus = "Active" | "Inactive" | "Scheduled";

interface Banner {
    id: string;
    title: string;
    subtitle: string;

    desktopImage: string;
    mobileImage: string;

    desktopImageName?: string;
    mobileImageName?: string;

    ctaButtonText: string;
    productSku: string;

    placement: Placement;
    priority: number;

    status: BannerStatus;

    startDate: string;
    endDate: string;
}

interface BannerForm {
    title: string;
    subtitle: string;

    desktopImage: string;
    mobileImage: string;

    desktopImageFile: File | null;
    mobileImageFile: File | null;

    desktopImageName: string;
    mobileImageName: string;

    ctaButtonText: string;
    productSku: string;

    placement: Placement;
    priority: string;

    status: BannerStatus;

    startDate: string;
    endDate: string;
}

// ======================================================
// INITIAL FORM
// ======================================================

const createInitialForm = (): BannerForm => ({
    title: "",
    subtitle: "",

    desktopImage: "",
    mobileImage: "",

    desktopImageFile: null,
    mobileImageFile: null,

    desktopImageName: "",
    mobileImageName: "",

    ctaButtonText: "",
    productSku: "",

    placement: "Promotional Strip",
    priority: "",

    status: "Active",

    startDate: "",
    endDate: "",
});

// ======================================================
// DATE FORMAT
// ======================================================

const formatDateTimeLocal = (date?: string | null) => {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// ======================================================
// COMPONENT
// ======================================================

const AdminBanners = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingBannerId, setEditingBannerId] = useState<string | null>(
        null
    );

    const [formData, setFormData] = useState<BannerForm>(
        createInitialForm()
    );

    const [banners, setBanners] = useState<Banner[]>([]);

    const [search, setSearch] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);

    const desktopInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const isEditing = editingBannerId !== null;

    // ======================================================
    // GET BANNERS
    // Backend already returns complete image URL
    // ======================================================

    const fetchBanners = async () => {
        try {
            setIsFetching(true);

            const response = await apiRequest(
                "/admin/api/v1/banner/get",
                "GET"
            );

            if (response?.success) {
                const formattedBanners: Banner[] = (
                    response.banners || []
                ).map((item: any) => ({
                    id: item._id,

                    title: item.title || "",
                    subtitle: item.subtitle || "",

                    // Backend gives full URL
                    desktopImage: item.desktopImage || "",
                    mobileImage: item.mobileImage || "",

                    desktopImageName: "",
                    mobileImageName: "",

                    ctaButtonText: item.ctaButtonText || "",
                    productSku: item.productSku || "",

                    placement: item.placement as Placement,

                    priority: Number(item.priority || 0),

                    status: item.status as BannerStatus,

                    startDate: item.startDate || "",
                    endDate: item.endDate || "",
                }));

                setBanners(formattedBanners);
            }
        } catch (error) {
            console.error("GET BANNERS ERROR:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // ======================================================
    // FETCH ON COMPONENT LOAD
    // ======================================================

    useEffect(() => {
        fetchBanners();
    }, []);

    // ======================================================
    // OPEN ADD MODAL
    // ======================================================

    const openAddModal = () => {
        setEditingBannerId(null);

        setFormData(createInitialForm());

        setIsModalOpen(true);
    };

    // ======================================================
    // OPEN EDIT MODAL
    // ======================================================

    const openEditModal = (banner: Banner) => {
        setEditingBannerId(banner.id);

        setFormData({
            title: banner.title || "",

            subtitle: banner.subtitle || "",

            desktopImage: banner.desktopImage || "",
            mobileImage: banner.mobileImage || "",

            desktopImageFile: null,
            mobileImageFile: null,

            desktopImageName: banner.desktopImageName || "",
            mobileImageName: banner.mobileImageName || "",

            ctaButtonText: banner.ctaButtonText || "",
            productSku: banner.productSku || "",

            placement: banner.placement,

            priority: String(banner.priority ?? ""),

            status: banner.status,

            startDate: formatDateTimeLocal(banner.startDate),
            endDate: formatDateTimeLocal(banner.endDate),
        });

        setIsModalOpen(true);
    };

    // ======================================================
    // CLOSE MODAL
    // ======================================================

    const closeModal = () => {
        setIsModalOpen(false);

        setEditingBannerId(null);

        setFormData(createInitialForm());

        if (desktopInputRef.current) {
            desktopInputRef.current.value = "";
        }

        if (mobileInputRef.current) {
            mobileInputRef.current.value = "";
        }
    };

    // ======================================================
    // NORMAL INPUT CHANGE
    // ======================================================

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ======================================================
    // PLACEMENT CHANGE
    // ======================================================

    const handlePlacementChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const placement = e.target.value as Placement;

        setFormData((prev) => ({
            ...prev,

            placement,

            ctaButtonText:
                placement === "Hero Slider"
                    ? ""
                    : prev.ctaButtonText,

            productSku:
                placement === "Promotional Strip"
                    ? ""
                    : prev.productSku,
        }));
    };

    // ======================================================
    // IMAGE CHANGE
    // ======================================================

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "desktop" | "mobile"
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Browser preview URL
        const previewUrl = URL.createObjectURL(file);

        if (type === "desktop") {
            setFormData((prev) => ({
                ...prev,

                desktopImage: previewUrl,

                desktopImageFile: file,

                desktopImageName: file.name,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,

                mobileImage: previewUrl,

                mobileImageFile: file,

                mobileImageName: file.name,
            }));
        }
    };

    // ======================================================
    // REMOVE IMAGE
    // ======================================================

    const removeImage = (type: "desktop" | "mobile") => {
        if (type === "desktop") {
            setFormData((prev) => ({
                ...prev,

                desktopImage: "",

                desktopImageFile: null,

                desktopImageName: "",
            }));

            if (desktopInputRef.current) {
                desktopInputRef.current.value = "";
            }
        } else {
            setFormData((prev) => ({
                ...prev,

                mobileImage: "",

                mobileImageFile: null,

                mobileImageName: "",
            }));

            if (mobileInputRef.current) {
                mobileInputRef.current.value = "";
            }
        }
    };

    // ======================================================
    // SAVE BANNER
    // ======================================================

    const handleSave = async () => {
        try {
            // --------------------------------------------------
            // TITLE VALIDATION
            // --------------------------------------------------

            if (!formData.title.trim()) {
                alert("Please enter banner title.");
                return;
            }

            // --------------------------------------------------
            // DESKTOP IMAGE REQUIRED ON ADD
            // --------------------------------------------------

            if (!isEditing && !formData.desktopImageFile) {
                alert("Please select desktop image.");
                return;
            }

            // --------------------------------------------------
            // HERO SKU
            // --------------------------------------------------

            if (
                formData.placement === "Hero Slider" &&
                !formData.productSku.trim()
            ) {
                alert("Please enter product SKU.");
                return;
            }

            // --------------------------------------------------
            // DATE VALIDATION
            // --------------------------------------------------

            if (formData.startDate && formData.endDate) {
                const start = new Date(formData.startDate);

                const end = new Date(formData.endDate);

                if (end <= start) {
                    alert(
                        "End date must be greater than start date."
                    );

                    return;
                }
            }

            setIsLoading(true);

            // --------------------------------------------------
            // FORMDATA
            // --------------------------------------------------

            const payload = new FormData();

            // --------------------------------------------------
            // NORMAL FIELDS
            // --------------------------------------------------

            payload.append(
                "title",
                formData.title.trim()
            );

            payload.append(
                "subtitle",
                formData.subtitle.trim()
            );

            payload.append(
                "placement",
                formData.placement
            );

            payload.append(
                "priority",
                formData.priority || "0"
            );

            payload.append(
                "status",
                formData.status
            );

            // --------------------------------------------------
            // DATES
            // --------------------------------------------------

            if (formData.startDate) {
                payload.append(
                    "startDate",
                    formData.startDate
                );
            }

            if (formData.endDate) {
                payload.append(
                    "endDate",
                    formData.endDate
                );
            }

            // --------------------------------------------------
            // PROMOTIONAL STRIP
            // --------------------------------------------------

            if (
                formData.placement ===
                "Promotional Strip"
            ) {
                payload.append(
                    "ctaButtonText",
                    formData.ctaButtonText.trim()
                );
            }

            // --------------------------------------------------
            // HERO SLIDER
            // --------------------------------------------------

            if (
                formData.placement ===
                "Hero Slider"
            ) {
                payload.append(
                    "productSku",
                    formData.productSku.trim()
                );
            }

            // --------------------------------------------------
            // DESKTOP IMAGE
            // --------------------------------------------------

            if (formData.desktopImageFile) {
                payload.append(
                    "desktopImage",
                    formData.desktopImageFile
                );
            }

            // --------------------------------------------------
            // MOBILE IMAGE
            // --------------------------------------------------

            if (formData.mobileImageFile) {
                payload.append(
                    "mobileImage",
                    formData.mobileImageFile
                );
            }

            console.log(
                "FORM DATA:",
                Array.from(payload.entries())
            );

            // ==================================================
            // ADD
            // ==================================================

            if (!isEditing) {
                const response = await apiRequest(
                    "/admin/api/v1/banner/add",
                    "POST",
                    payload
                );

                console.log(
                    "ADD BANNER RESPONSE:",
                    response
                );

                if (response?.success) {
                    alert(
                        response.message ||
                            "Banner added successfully"
                    );

                    closeModal();

                    await fetchBanners();
                }

                return;
            }

            // ==================================================
            // UPDATE
            // ==================================================

            const response = await apiRequest(
                `/admin/api/v1/banner/update/${editingBannerId}`,
                "PATCH",
                payload
            );

            console.log(
                "UPDATE BANNER RESPONSE:",
                response
            );

            if (response?.success) {
                alert(
                    response.message ||
                        "Banner updated successfully"
                );

                closeModal();

                await fetchBanners();
            }
        } catch (error) {
            console.error(
                "SAVE BANNER ERROR:",
                error
            );

            alert("Failed to save banner.");
        } finally {
            setIsLoading(false);
        }
    };

    // ======================================================
    // SCHEDULE TEXT
    // ======================================================

    const getScheduleText = (banner: Banner) => {
        if (
            !banner.startDate &&
            !banner.endDate
        ) {
            return "Always";
        }

        if (banner.status === "Inactive") {
            return "Ended";
        }

        const start = banner.startDate
            ? new Date(
                  banner.startDate
              ).toLocaleDateString()
            : "-";

        const end = banner.endDate
            ? new Date(
                  banner.endDate
              ).toLocaleDateString()
            : "-";

        return `${start} — ${end}`;
    };

    // ======================================================
    // SEARCH
    // ======================================================

    const filteredBanners = banners.filter(
        (banner) => {
            const searchValue =
                search.toLowerCase();

            return (
                banner.title
                    .toLowerCase()
                    .includes(searchValue) ||

                banner.placement
                    .toLowerCase()
                    .includes(searchValue) ||

                (banner.productSku || "")
                    .toLowerCase()
                    .includes(searchValue)
            );
        }
    );

    // ======================================================
    // UI
    // ======================================================

    return (
        <div className="space-y-6">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Banners & Sliders
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage homepage hero banners and
                        promotional sliders.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                >
                    <IoAddOutline size={20} />

                    Add Banner
                </button>

            </div>

            {/* ==================================================
                MODAL
            ================================================== */}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        {/* HEADER */}

                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">

                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing
                                    ? "Edit Banner"
                                    : "Add New Banner"}
                            </h2>

                            <button
                                onClick={closeModal}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
                            >
                                <IoCloseOutline
                                    size={24}
                                />
                            </button>

                        </div>

                        {/* BODY */}

                        <div className="p-6 space-y-6">

                            {/* ==================================================
                                IMAGES
                            ================================================== */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* DESKTOP */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Desktop Image *
                                    </label>

                                    <input
                                        ref={
                                            desktopInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                "desktop"
                                            )
                                        }
                                    />

                                    {formData.desktopImage ? (
                                        <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">

                                            <img
                                                src={
                                                    formData.desktopImage
                                                }
                                                alt="Desktop preview"
                                                className="w-full h-40 object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        "desktop"
                                                    )
                                                }
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                                            >
                                                <IoCloseOutline
                                                    size={18}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    desktopInputRef.current?.click()
                                                }
                                                className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-xs font-semibold text-gray-700 rounded-lg shadow"
                                            >
                                                Change Image
                                            </button>

                                        </div>
                                    ) : (
                                        <div
                                            onClick={() =>
                                                desktopInputRef.current?.click()
                                            }
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                        >

                                            <IoCloudUploadOutline
                                                size={28}
                                                className="mx-auto text-gray-400 mb-2"
                                            />

                                            <p className="text-xs font-semibold text-gray-600">
                                                Click to upload
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                1920×800px recommended
                                            </p>

                                        </div>
                                    )}

                                </div>

                                {/* MOBILE */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Image
                                    </label>

                                    <input
                                        ref={
                                            mobileInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageChange(
                                                e,
                                                "mobile"
                                            )
                                        }
                                    />

                                    {formData.mobileImage ? (
                                        <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">

                                            <img
                                                src={
                                                    formData.mobileImage
                                                }
                                                alt="Mobile preview"
                                                className="w-full h-40 object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        "mobile"
                                                    )
                                                }
                                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
                                            >
                                                <IoCloseOutline
                                                    size={18}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    mobileInputRef.current?.click()
                                                }
                                                className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white text-xs font-semibold text-gray-700 rounded-lg shadow"
                                            >
                                                Change Image
                                            </button>

                                        </div>
                                    ) : (
                                        <div
                                            onClick={() =>
                                                mobileInputRef.current?.click()
                                            }
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                        >

                                            <IoCloudUploadOutline
                                                size={28}
                                                className="mx-auto text-gray-400 mb-2"
                                            />

                                            <p className="text-xs font-semibold text-gray-600">
                                                Click to upload
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                750×1000px recommended
                                            </p>

                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* ==================================================
                                CONTENT
                            ================================================== */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* TITLE */}

                                <div className="md:col-span-2">

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Title Text *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Summer Sale 2026"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                {/* SUBTITLE */}

                                <div className="md:col-span-2">

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subtitle Text
                                    </label>

                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={
                                            formData.subtitle
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Up to 50% off"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                {/* CTA */}

                                {formData.placement ===
                                    "Promotional Strip" && (
                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            CTA Button Text
                                        </label>

                                        <input
                                            type="text"
                                            name="ctaButtonText"
                                            value={
                                                formData.ctaButtonText
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Shop Now"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />

                                    </div>
                                )}

                                {/* SKU */}

                                {formData.placement ===
                                    "Hero Slider" && (
                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Product SKU *
                                        </label>

                                        <input
                                            type="text"
                                            name="productSku"
                                            value={
                                                formData.productSku
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. PROD-001"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />

                                        <p className="text-xs text-gray-400 mt-1">
                                            Enter the SKU of the
                                            product linked to this
                                            hero slider.
                                        </p>

                                    </div>
                                )}

                            </div>

                            {/* ==================================================
                                SETTINGS
                            ================================================== */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* PLACEMENT */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Placement *
                                    </label>

                                    <select
                                        value={
                                            formData.placement
                                        }
                                        onChange={
                                            handlePlacementChange
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    >

                                        <option value="Promotional Strip">
                                            Promotional Strip
                                        </option>

                                        <option value="Hero Slider">
                                            Hero Slider
                                        </option>

                                    </select>

                                </div>

                                {/* PRIORITY */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Display Order / Priority
                                    </label>

                                    <input
                                        type="number"
                                        name="priority"
                                        value={
                                            formData.priority
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="1"
                                        min="0"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                {/* STATUS */}

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    >

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                        <option value="Scheduled">
                                            Scheduled
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* ==================================================
                                SCHEDULE
                            ================================================== */}

                            <div className="border-t border-gray-100 pt-6">

                                <h3 className="text-sm font-bold text-gray-700 mb-4">
                                    Schedule (Optional)
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* START */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Start Date
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="startDate"
                                            value={
                                                formData.startDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />

                                    </div>

                                    {/* END */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            End Date
                                        </label>

                                        <input
                                            type="datetime-local"
                                            name="endDate"
                                            value={
                                                formData.endDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">

                            <button
                                onClick={closeModal}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm disabled:opacity-50"
                            >
                                {isLoading
                                    ? "Saving..."
                                    : isEditing
                                    ? "Update Banner"
                                    : "Save Banner"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================================
                TABLE
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* SEARCH */}

                <div className="p-4 border-b border-gray-100">

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search banners..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand"
                        />

                    </div>

                </div>

                {/* LOADING */}

                {isFetching ? (
                    <div className="px-6 py-12 text-center text-sm text-gray-500">
                        Loading banners...
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm text-left">

                            {/* HEAD */}

                            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                                <tr>

                                    <th className="px-6 py-4">
                                        Preview
                                    </th>

                                    <th className="px-6 py-4">
                                        Title / Placement
                                    </th>

                                    <th className="px-6 py-4">
                                        CTA / Product SKU
                                    </th>

                                    <th className="px-6 py-4">
                                        Schedule
                                    </th>

                                    <th className="px-6 py-4">
                                        Priority
                                    </th>

                                    <th className="px-6 py-4">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* BODY */}

                            <tbody className="divide-y divide-gray-100">

                                {filteredBanners.map(
                                    (banner) => (
                                        <tr
                                            key={
                                                banner.id
                                            }
                                            className="hover:bg-gray-50 transition-colors"
                                        >

                                            {/* PREVIEW */}

                                            <td className="px-6 py-4">

                                                <div className="w-24 h-12 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-gray-400">

                                                    {banner.desktopImage ? (
                                                        <img
                                                            src={
                                                                banner.desktopImage
                                                            }
                                                            alt={
                                                                banner.title
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <IoImageOutline
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    )}

                                                </div>

                                            </td>

                                            {/* TITLE */}

                                            <td className="px-6 py-4">

                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        banner.title
                                                    }
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {
                                                        banner.placement
                                                    }
                                                </p>

                                            </td>

                                            {/* CTA / SKU */}

                                            <td className="px-6 py-4 text-gray-500 text-xs">

                                                {banner.placement ===
                                                "Hero Slider"
                                                    ? banner.productSku ||
                                                      "No Product SKU"
                                                    : banner.ctaButtonText ||
                                                      "No CTA"}

                                            </td>

                                            {/* SCHEDULE */}

                                            <td className="px-6 py-4 text-gray-500 text-xs">

                                                {
                                                    getScheduleText(
                                                        banner
                                                    )
                                                }

                                            </td>

                                            {/* PRIORITY */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {
                                                    banner.priority
                                                }

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        banner.status ===
                                                        "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : banner.status ===
                                                              "Scheduled"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {
                                                        banner.status
                                                    }
                                                </span>

                                            </td>

                                            {/* ACTION */}

                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            banner
                                                        )
                                                    }
                                                    className="text-brand text-sm font-semibold hover:underline mr-3"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                >
                                                    <IoEllipsisVertical
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                                {/* EMPTY */}

                                {filteredBanners.length ===
                                    0 && (
                                    <tr>

                                        <td
                                            colSpan={
                                                7
                                            }
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            No banners found.
                                        </td>

                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminBanners;