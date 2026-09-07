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
import { toast } from "react-toastify";

type Placement = "Hero Slider" | "Promotional Strip";
type BannerStatus = "Active" | "Inactive" | "Scheduled";
type PromoStatus = "Active" | "Inactive" | "Scheduled";

type ActiveTab = "banner" | "promo";

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

interface PromoBanner {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: PromoStatus;
}

interface PromoBannerForm {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: PromoStatus;
}

/* =========================================================
   INITIAL FORMS
========================================================= */

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

const createInitialPromoForm = (): PromoBannerForm => ({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Active",
});

/* =========================================================
   DATE FORMATTER
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

const AdminBanners = () => {
    /* =====================================================
       BANNER STATES
    ===================================================== */

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingBannerId, setEditingBannerId] =
        useState<string | null>(null);

    const [formData, setFormData] = useState<BannerForm>(
        createInitialForm()
    );

    const [banners, setBanners] = useState<Banner[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isFetching, setIsFetching] = useState(false);

    /* =====================================================
       PROMO STATES
    ===================================================== */

    const [isPromoModalOpen, setIsPromoModalOpen] =
        useState(false);

    const [editingPromoId, setEditingPromoId] =
        useState<string | null>(null);

    const [promoFormData, setPromoFormData] =
        useState<PromoBannerForm>(
            createInitialPromoForm()
        );

    const [promos, setPromos] = useState<PromoBanner[]>([]);

    const [isPromoLoading, setIsPromoLoading] =
        useState(false);

    const [isPromoFetching, setIsPromoFetching] =
        useState(false);

    /* =====================================================
       COMMON STATES
    ===================================================== */

    const [search, setSearch] = useState("");

    const [activeTab, setActiveTab] =
        useState<ActiveTab>("banner");

    const [openActionMenu, setOpenActionMenu] =
        useState<string | null>(null);

    const [isDeleting, setIsDeleting] =
        useState(false);

    /* =====================================================
       REFS
    ===================================================== */

    const desktopInputRef =
        useRef<HTMLInputElement>(null);

    const mobileInputRef =
        useRef<HTMLInputElement>(null);

    /* =====================================================
       EDIT FLAGS
    ===================================================== */

    const isEditing =
        editingBannerId !== null;

    const isEditingPromo =
        editingPromoId !== null;

    /* =====================================================
       FETCH BANNERS
    ===================================================== */

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

                    desktopImage:
                        item.desktopImage || "",

                    mobileImage:
                        item.mobileImage || "",

                    desktopImageName: "",

                    mobileImageName: "",

                    ctaButtonText:
                        item.ctaButtonText || "",

                    productSku:
                        item.productSku || "",

                    placement:
                        item.placement as Placement,

                    priority:
                        Number(item.priority || 0),

                    status:
                        item.status as BannerStatus,

                    startDate:
                        item.startDate || "",

                    endDate:
                        item.endDate || "",
                }));

                setBanners(formattedBanners);
            }
        } catch (error: any) {
            console.error(
                "FETCH BANNERS ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to fetch banners."
            );
        } finally {
            setIsFetching(false);
        }
    };

    /* =====================================================
       FETCH PROMOS
    ===================================================== */

    const fetchPromos = async () => {
        try {
            setIsPromoFetching(true);

            const response = await apiRequest("/admin/api/v1/banner/promo/get", "GET");

            if (response?.success) {
                const formattedPromos: PromoBanner[] = (
                    response.promos || []
                ).map((item: any) => ({
                    id: item._id,

                    title: item.title || "",

                    description:
                        item.description || "",

                    startDate:
                        item.startDate || "",

                    endDate:
                        item.endDate || "",

                    status:
                        item.status as PromoStatus,
                }));

                setPromos(formattedPromos);
            }
        } catch (error: any) {
            console.error(
                "FETCH PROMOS ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to fetch promos."
            );
        } finally {
            setIsPromoFetching(false);
        }
    };

    /* =====================================================
       INITIAL API CALL
    ===================================================== */

    useEffect(() => {
        fetchBanners();
        fetchPromos();
    }, []);

    /* =====================================================
       ACTION MENU
    ===================================================== */

    const toggleActionMenu = (id: string) => {
        setOpenActionMenu((prev) =>
            prev === id ? null : id
        );
    };

    const closeActionMenu = () => {
        setOpenActionMenu(null);
    };

    /* =====================================================
       DELETE BANNER
    ===================================================== */

    const handleDeleteBanner = async (bannerId: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this banner?");

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            closeActionMenu();

            const response = await apiRequest(
                `/admin/api/v1/banner/delete/${bannerId}`,
                "DELETE"
            );

            if (response?.success) {
                toast.success(
                    response.message || "Banner deleted successfully"
                );

                setBanners((prev) =>
                    prev.filter((banner) => banner.id !== bannerId)
                );

                await fetchBanners();
            } else {
                toast.error(
                    response?.message || "Failed to delete banner."
                );
            }
        } catch (error: any) {
            console.error("DELETE BANNER ERROR:", error);

            toast.error(
                error?.message || "Failed to delete banner."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    /* =====================================================
       DELETE PROMO
    ===================================================== */

    const handleDeletePromo = async (promoId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this promo banner?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            closeActionMenu();

            const response = await apiRequest(
                `/admin/api/v1/banner/promo/delete/${promoId}`,
                "DELETE"
            );

            if (response?.success) {
                toast.success(
                    response.message || "Promo deleted successfully"
                );

                setPromos((prev) =>
                    prev.filter((promo) => promo.id !== promoId)
                );

                await fetchPromos();
            } else {
                toast.error(
                    response?.message || "Failed to delete promo banner."
                );
            }
        } catch (error: any) {
            console.error("DELETE PROMO ERROR:", error);

            toast.error(
                error?.message || "Failed to delete promo banner."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    /* =====================================================
       BANNER ADD
    ===================================================== */

    const openAddModal = () => {
        setEditingBannerId(null);

        setFormData(
            createInitialForm()
        );

        setIsModalOpen(true);
    };

    /* =====================================================
       BANNER EDIT
    ===================================================== */

    const openEditModal = (
        banner: Banner
    ) => {
        setEditingBannerId(
            banner.id
        );

        setFormData({
            title: banner.title || "",

            subtitle:
                banner.subtitle || "",

            desktopImage:
                banner.desktopImage || "",

            mobileImage:
                banner.mobileImage || "",

            desktopImageFile: null,

            mobileImageFile: null,

            desktopImageName:
                banner.desktopImageName || "",

            mobileImageName:
                banner.mobileImageName || "",

            ctaButtonText:
                banner.ctaButtonText || "",

            productSku:
                banner.productSku || "",

            placement:
                banner.placement,

            priority:
                String(
                    banner.priority ?? ""
                ),

            status:
                banner.status,

            startDate:
                formatDateTimeLocal(
                    banner.startDate
                ),

            endDate:
                formatDateTimeLocal(
                    banner.endDate
                ),
        });

        setIsModalOpen(true);
    };

    /* =====================================================
       CLOSE BANNER MODAL
    ===================================================== */

    const closeModal = () => {
        setIsModalOpen(false);

        setEditingBannerId(null);

        setFormData(
            createInitialForm()
        );

        if (
            desktopInputRef.current
        ) {
            desktopInputRef.current.value =
                "";
        }

        if (
            mobileInputRef.current
        ) {
            mobileInputRef.current.value =
                "";
        }
    };

    /* =====================================================
       BANNER CHANGE
    ===================================================== */

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ) => {
        const {
            name,
            value,
        } = e.target;

        setFormData(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );
    };

    /* =====================================================
       PLACEMENT CHANGE
    ===================================================== */

    const handlePlacementChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const placement =
            e.target.value as Placement;

        setFormData(
            (prev) => ({
                ...prev,

                placement,

                ctaButtonText:
                    placement ===
                        "Hero Slider"
                        ? ""
                        : prev.ctaButtonText,

                productSku:
                    placement ===
                        "Promotional Strip"
                        ? ""
                        : prev.productSku,
            })
        );
    };

    /* =====================================================
       IMAGE CHANGE
    ===================================================== */

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "desktop" | "mobile"
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        const previewUrl =
            URL.createObjectURL(file);

        if (type === "desktop") {
            setFormData(
                (prev) => ({
                    ...prev,

                    desktopImage:
                        previewUrl,

                    desktopImageFile:
                        file,

                    desktopImageName:
                        file.name,
                })
            );
        } else {
            setFormData(
                (prev) => ({
                    ...prev,

                    mobileImage:
                        previewUrl,

                    mobileImageFile:
                        file,

                    mobileImageName:
                        file.name,
                })
            );
        }
    };

    /* =====================================================
       REMOVE IMAGE
    ===================================================== */

    const removeImage = (
        type: "desktop" | "mobile"
    ) => {
        if (
            type === "desktop"
        ) {
            setFormData(
                (prev) => ({
                    ...prev,

                    desktopImage:
                        "",

                    desktopImageFile:
                        null,

                    desktopImageName:
                        "",
                })
            );

            if (
                desktopInputRef.current
            ) {
                desktopInputRef.current.value =
                    "";
            }
        } else {
            setFormData(
                (prev) => ({
                    ...prev,

                    mobileImage:
                        "",

                    mobileImageFile:
                        null,

                    mobileImageName:
                        "",
                })
            );

            if (
                mobileInputRef.current
            ) {
                mobileInputRef.current.value =
                    "";
            }
        }
    };

    /* =====================================================
       SAVE BANNER
    ===================================================== */

    const handleSave = async () => {
        try {
            if (
                !formData.title.trim()
            ) {
                toast.warning(
                    "Please enter banner title."
                );

                return;
            }

            if (
                !isEditing &&
                !formData.desktopImageFile
            ) {
                toast.warning(
                    "Please select desktop image."
                );

                return;
            }

            if (
                formData.placement ===
                "Hero Slider" &&
                !formData.productSku.trim()
            ) {
                toast.warning(
                    "Please enter product SKU."
                );

                return;
            }

            if (
                formData.startDate &&
                formData.endDate
            ) {
                const start =
                    new Date(
                        formData.startDate
                    );

                const end =
                    new Date(
                        formData.endDate
                    );

                if (end <= start) {
                    toast.warning(
                        "End date must be greater than start date."
                    );

                    return;
                }
            }

            setIsLoading(true);

            const payload =
                new FormData();

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

            if (
                formData.startDate
            ) {
                payload.append(
                    "startDate",
                    formData.startDate
                );
            }

            if (
                formData.endDate
            ) {
                payload.append(
                    "endDate",
                    formData.endDate
                );
            }

            if (
                formData.placement ===
                "Promotional Strip"
            ) {
                payload.append(
                    "ctaButtonText",
                    formData.ctaButtonText.trim()
                );
            }

            if (
                formData.placement ===
                "Hero Slider"
            ) {
                payload.append(
                    "productSku",
                    formData.productSku.trim()
                );
            }

            if (
                formData.desktopImageFile
            ) {
                payload.append(
                    "desktopImage",
                    formData.desktopImageFile
                );
            }

            if (
                formData.mobileImageFile
            ) {
                payload.append(
                    "mobileImage",
                    formData.mobileImageFile
                );
            }

            if (!isEditing) {
                const response =
                    await apiRequest(
                        "/admin/api/v1/banner/add",
                        "POST",
                        payload
                    );

                if (
                    response?.success
                ) {
                    toast.success(
                        response.message ||
                        "Banner added successfully"
                    );

                    closeModal();

                    await fetchBanners();
                }

                return;
            }

            const response =
                await apiRequest(
                    `/admin/api/v1/banner/update/${editingBannerId}`,
                    "PATCH",
                    payload
                );

            if (
                response?.success
            ) {
                toast.success(
                    response.message ||
                    "Banner updated successfully"
                );

                closeModal();

                await fetchBanners();
            }
        } catch (error: any) {
            console.error(
                "SAVE BANNER ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save banner."
            );
        } finally {
            setIsLoading(false);
        }
    };

    /* =====================================================
       PROMO ADD
    ===================================================== */

    const openAddPromoModal = () => {
        setEditingPromoId(null);

        setPromoFormData(
            createInitialPromoForm()
        );

        setIsPromoModalOpen(true);
    };

    /* =====================================================
       PROMO EDIT
    ===================================================== */

    const openEditPromoModal = (
        promo: PromoBanner
    ) => {
        setEditingPromoId(
            promo.id
        );

        setPromoFormData({
            title:
                promo.title || "",

            description:
                promo.description || "",

            startDate:
                formatDateTimeLocal(
                    promo.startDate
                ),

            endDate:
                formatDateTimeLocal(
                    promo.endDate
                ),

            status:
                promo.status ||
                "Active",
        });

        setIsPromoModalOpen(true);
    };

    /* =====================================================
       CLOSE PROMO MODAL
    ===================================================== */

    const closePromoModal = () => {
        setIsPromoModalOpen(false);

        setEditingPromoId(null);

        setPromoFormData(
            createInitialPromoForm()
        );
    };

    /* =====================================================
       PROMO CHANGE
    ===================================================== */

    const handlePromoChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const {
            name,
            value,
        } = e.target;

        setPromoFormData(
            (prev) => ({
                ...prev,
                [name]: value,
            })
        );
    };

    /* =====================================================
       SAVE PROMO
    ===================================================== */

    const handlePromoSave = async () => {
        try {
            if (!promoFormData.title.trim()) {
                toast.warning("Please enter promo title.");
                return;
            }

            if (promoFormData.status === "Scheduled" && (!promoFormData.startDate || !promoFormData.endDate)) {
                toast.warning("Start date and end date are required for scheduled promo.");
                return;
            }

            if (promoFormData.startDate && promoFormData.endDate) {
                const start = new Date(promoFormData.startDate);
                const end = new Date(promoFormData.endDate);

                if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                    toast.warning("Please select valid schedule dates.");
                    return;
                }

                if (end <= start) {
                    toast.warning("End date must be greater than start date.");
                    return;
                }
            }

            setIsPromoLoading(true);

            const payload = {
                title:promoFormData.title.trim(),
                description:promoFormData.description.trim(),
                startDate:promoFormData.startDate ||null,
                endDate:promoFormData.endDate ||null,
                status:promoFormData.status,
            };

            /* ADD */

            if (!isEditingPromo) {
                const response =
                    await apiRequest("/admin/api/v1/banner/promo/add", "POST",payload);

                if (response?.success) {
                    toast.success(response.message ||"Promo added successfully");
                    closePromoModal();
                    await fetchPromos();
                }

                return;
            }

            /* UPDATE */

            const response =await apiRequest(`/admin/api/v1/banner/promo/update/${editingPromoId}`,"PATCH",
                    payload
                );

            if (
                response?.success
            ) {
                toast.success(
                    response.message ||
                    "Promo updated successfully"
                );

                closePromoModal();

                await fetchPromos();
            }
        } catch (error: any) {
            console.error(
                "SAVE PROMO ERROR:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to save promo."
            );
        } finally {
            setIsPromoLoading(
                false
            );
        }
    };

    /* =====================================================
       SCHEDULE TEXT
    ===================================================== */

    const getScheduleText = (
        banner: Banner
    ) => {
        if (!banner.startDate && !banner.endDate) {
            return "Always";
        }

        if (banner.status === "Inactive") {
            return "Ended";
        }

        const start = banner.startDate ? new Date(banner.startDate).toLocaleDateString() : "-";

        const end = banner.endDate ? new Date(banner.endDate).toLocaleDateString() : "-";

        return `${start} — ${end}`;
    };

    /* =====================================================
       FILTER BANNERS
    ===================================================== */

    const filteredBanners =
        banners.filter(
            (banner) => {
                const searchValue =
                    search.toLowerCase();

                return (
                    banner.title
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    banner.placement
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    (
                        banner.productSku ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchValue
                        )
                );
            }
        );

    /* =====================================================
       FILTER PROMOS
    ===================================================== */

    const filteredPromos =
        promos.filter(
            (promo) => {
                const searchValue =
                    search.toLowerCase();

                return (
                    promo.title
                        .toLowerCase()
                        .includes(
                            searchValue
                        ) ||

                    promo.description
                        .toLowerCase()
                        .includes(
                            searchValue
                        )
                );
            }
        );

    /* =====================================================
       RETURN
    ===================================================== */

    return (
        <div className="space-y-6">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Banners & Sliders
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage homepage hero banners,
                        promotional sliders and promo banners.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">

                    {/* ADD BANNER */}

                    <button
                        onClick={
                            openAddModal
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-brand-light transition-colors"
                    >
                        <IoAddOutline
                            size={20}
                        />

                        Add Banner
                    </button>

                    {/* ADD PROMO */}

                    <button
                        onClick={
                            openAddPromoModal
                        }
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-800 transition-colors"
                    >
                        <IoAddOutline
                            size={20}
                        />

                        Add Promo
                    </button>

                </div>
            </div>

            {/* =================================================
                BANNER MODAL
            ================================================= */}

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
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    isLoading
                                }
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
                            >
                                <IoCloseOutline
                                    size={24}
                                />
                            </button>

                        </div>

                        {/* FORM */}

                        <div className="p-6 space-y-6">

                            {/* IMAGES */}

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
                                        onChange={(
                                            e
                                        ) =>
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
                                                    size={
                                                        18
                                                    }
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
                                                size={
                                                    28
                                                }
                                                className="mx-auto text-gray-400 mb-2"
                                            />

                                            <p className="text-xs font-semibold text-gray-600">
                                                Click to upload
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                1920×800px
                                                recommended
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
                                        onChange={(
                                            e
                                        ) =>
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
                                                    size={
                                                        18
                                                    }
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
                                                size={
                                                    28
                                                }
                                                className="mx-auto text-gray-400 mb-2"
                                            />

                                            <p className="text-xs font-semibold text-gray-600">
                                                Click to upload
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                750×1000px
                                                recommended
                                            </p>
                                        </div>
                                    )}

                                </div>

                            </div>

                            {/* TITLE / SUBTITLE */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                                Enter the SKU
                                                of the product
                                                linked to this
                                                hero slider.
                                            </p>

                                        </div>
                                    )}

                            </div>

                            {/* PLACEMENT / PRIORITY / STATUS */}

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

                            {/* SCHEDULE */}

                            <div className="border-t border-gray-100 pt-6">

                                <h3 className="text-sm font-bold text-gray-700 mb-4">
                                    Schedule (Optional)
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                        {/* FOOTER */}

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">

                            <button
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    isLoading
                                }
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleSave
                                }
                                disabled={
                                    isLoading
                                }
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

            {/* =================================================
                PROMO MODAL
            ================================================= */}

            {isPromoModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        {/* HEADER */}

                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">

                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditingPromo
                                    ? "Edit Promo Banner"
                                    : "Add New Promo Banner"}
                            </h2>

                            <button
                                onClick={
                                    closePromoModal
                                }
                                disabled={
                                    isPromoLoading
                                }
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
                            >
                                <IoCloseOutline
                                    size={24}
                                />
                            </button>

                        </div>

                        {/* FORM */}

                        <div className="p-6 space-y-6">

                            {/* TITLE */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        promoFormData.title
                                    }
                                    onChange={
                                        handlePromoChange
                                    }
                                    placeholder="e.g. Big Summer Sale"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        promoFormData.description
                                    }
                                    onChange={
                                        handlePromoChange
                                    }
                                    rows={4}
                                    placeholder="Enter promo description..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand resize-none"
                                />

                            </div>

                            {/* DATES */}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Start Date
                                        {promoFormData.status === "Scheduled" && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={
                                            promoFormData.startDate
                                        }
                                        onChange={
                                            handlePromoChange
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        End Date
                                        {promoFormData.status === "Scheduled" && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </label>

                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={promoFormData.endDate}
                                        min={promoFormData.startDate || undefined}
                                        onChange={
                                            handlePromoChange
                                        }
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    />

                                </div>

                            </div>

                            {/* STATUS */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        promoFormData.status
                                    }
                                    onChange={
                                        handlePromoChange
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

                                {promoFormData.status === "Scheduled" && (
                                    <p className="text-xs text-blue-600 mt-2">
                                        Scheduled promo requires both start and end date.
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white z-10">

                            <button
                                onClick={
                                    closePromoModal
                                }
                                disabled={
                                    isPromoLoading
                                }
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handlePromoSave
                                }
                                disabled={
                                    isPromoLoading
                                }
                                className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm disabled:opacity-50"
                            >
                                {isPromoLoading
                                    ? "Saving..."
                                    : isEditingPromo
                                        ? "Update Promo"
                                        : "Save Promo"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* =================================================
                TABLE CARD
            ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                {/* SEARCH + TABS */}

                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* TABS */}

                    <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit">

                        <button
                            onClick={() => {
                                setActiveTab(
                                    "banner"
                                );
                                setSearch("");
                                closeActionMenu();
                            }}
                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab ===
                                    "banner"
                                    ? "bg-white text-brand shadow-sm"
                                    : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Banner
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab(
                                    "promo"
                                );
                                setSearch("");
                                closeActionMenu();
                            }}
                            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab ===
                                    "promo"
                                    ? "bg-white text-brand shadow-sm"
                                    : "text-gray-500 hover:text-gray-800"
                                }`}
                        >
                            Promo Banner
                        </button>

                    </div>

                    {/* SEARCH */}

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={
                                search
                            }
                            onChange={(
                                e
                            ) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder={
                                activeTab ===
                                    "banner"
                                    ? "Search banners..."
                                    : "Search promos..."
                            }
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand"
                        />

                    </div>

                </div>

                {/* =================================================
                    BANNER TABLE
                ================================================= */}

                {activeTab ===
                    "banner" && (
                        <>
                            {isFetching ? (
                                <div className="px-6 py-12 text-center text-sm text-gray-500">
                                    Loading banners...
                                </div>
                            ) : (
                                <div className="overflow-x-auto">

                                    <table className="w-full text-sm text-left">

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

                                        <tbody className="divide-y divide-gray-100">

                                            {filteredBanners.map(
                                                (
                                                    banner
                                                ) => (
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

                                                            {getScheduleText(
                                                                banner
                                                            )}

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
                                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${banner.status ===
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

                                                            <div className="relative inline-block">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleActionMenu(
                                                                            banner.id
                                                                        )
                                                                    }
                                                                    className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                                >
                                                                    <IoEllipsisVertical
                                                                        size={18}
                                                                    />
                                                                </button>

                                                                {openActionMenu === banner.id && (
                                                                    <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-left">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                closeActionMenu();
                                                                                openEditModal(banner);
                                                                            }}
                                                                            disabled={isDeleting}
                                                                            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteBanner(
                                                                                    banner.id
                                                                                )
                                                                            }
                                                                            disabled={isDeleting}
                                                                            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </div>
                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                            {filteredBanners.length ===
                                                0 && (
                                                    <tr>

                                                        <td
                                                            colSpan={
                                                                7
                                                            }
                                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                                        >
                                                            No banners
                                                            found.
                                                        </td>

                                                    </tr>
                                                )}

                                        </tbody>

                                    </table>

                                </div>
                            )}
                        </>
                    )}

                {/* =================================================
                    PROMO TABLE
                ================================================= */}

                {activeTab ===
                    "promo" && (
                        <>
                            {isPromoFetching ? (
                                <div className="px-6 py-12 text-center text-sm text-gray-500">
                                    Loading promos...
                                </div>
                            ) : (
                                <div className="overflow-x-auto">

                                    <table className="w-full text-sm text-left">

                                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                                            <tr>

                                                <th className="px-6 py-4">
                                                    Title
                                                </th>

                                                <th className="px-6 py-4">
                                                    Description
                                                </th>

                                                <th className="px-6 py-4">
                                                    Schedule
                                                </th>

                                                <th className="px-6 py-4">
                                                    Status
                                                </th>

                                                <th className="px-6 py-4 text-right">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y divide-gray-100">

                                            {filteredPromos.map(
                                                (
                                                    promo
                                                ) => (
                                                    <tr
                                                        key={
                                                            promo.id
                                                        }
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >

                                                        {/* TITLE */}

                                                        <td className="px-6 py-4">

                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    promo.title
                                                                }
                                                            </p>

                                                        </td>

                                                        {/* DESCRIPTION */}

                                                        <td className="px-6 py-4 text-gray-500">

                                                            <p className="max-w-md truncate">

                                                                {
                                                                    promo.description ||
                                                                    "No description"
                                                                }

                                                            </p>

                                                        </td>

                                                        {/* SCHEDULE */}

                                                        <td className="px-6 py-4 text-gray-500 text-xs">

                                                            {promo.startDate ||
                                                                promo.endDate
                                                                ? `${promo.startDate
                                                                    ? new Date(
                                                                        promo.startDate
                                                                    ).toLocaleDateString()
                                                                    : "-"
                                                                } — ${promo.endDate
                                                                    ? new Date(
                                                                        promo.endDate
                                                                    ).toLocaleDateString()
                                                                    : "-"
                                                                }`
                                                                : "Always"}

                                                        </td>

                                                        {/* STATUS */}

                                                        <td className="px-6 py-4">

                                                            <span
                                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${promo.status ===
                                                                        "Active"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : promo.status ===
                                                                            "Scheduled"
                                                                            ? "bg-blue-100 text-blue-700"
                                                                            : "bg-gray-100 text-gray-600"
                                                                    }`}
                                                            >
                                                                {
                                                                    promo.status
                                                                }
                                                            </span>

                                                        </td>

                                                        {/* ACTION */}

                                                        <td className="px-6 py-4 text-right">

                                                            <div className="relative inline-block">

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleActionMenu(
                                                                            promo.id
                                                                        )
                                                                    }
                                                                    className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                                                                >
                                                                    <IoEllipsisVertical
                                                                        size={18}
                                                                    />
                                                                </button>

                                                                {openActionMenu === promo.id && (
                                                                    <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden text-left">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                closeActionMenu();
                                                                                openEditPromoModal(promo);
                                                                            }}
                                                                            disabled={isDeleting}
                                                                            className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeletePromo(
                                                                                    promo.id
                                                                                )
                                                                            }
                                                                            disabled={isDeleting}
                                                                            className="w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </div>
                                                                )}

                                                            </div>

                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                            {filteredPromos.length ===
                                                0 && (
                                                    <tr>

                                                        <td
                                                            colSpan={
                                                                5
                                                            }
                                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                                        >
                                                            No promos
                                                            found.
                                                        </td>

                                                    </tr>
                                                )}

                                        </tbody>

                                    </table>

                                </div>
                            )}
                        </>
                    )}

            </div>

        </div>
    );
};

export default AdminBanners;