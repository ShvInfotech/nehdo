import React, { useEffect, useState } from "react";
import {
    IoCloudDownloadOutline,
    IoStatsChartOutline,
    IoBagCheckOutline,
    IoTrendingUpOutline,
    IoPeopleOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

// =====================================================
// TYPES
// =====================================================

interface Overview {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
}

interface SalesChart {
    label: string;
    revenue: number;
    orders: number;
}

interface SalesTable {
    date: string;
    orders: number;
    grossSales: number;
    discounts: number;
    shipping: number;
    netRevenue: number;
}

interface ProductReport {
    productId: string;
    name: string | null;
    image: string;
    unitsSold: number;
    revenue: number;
    averageRating: number;
}

interface CustomerSegment {
    segment: string;
    count: number;
    revenueShare: number;
    averageOrders: number;
}

interface CustomerReport {
    totalCustomers: number;
    newCustomers: number;
    repeatRate: number;
    averageCLV: number;
    segments: CustomerSegment[];
}

interface Reports {
    overview: Overview;

    sales: {
        chart: SalesChart[];
        table: SalesTable[];
    };

    products: ProductReport[];

    customers: CustomerReport;
}

interface ReportResponse {
    success: boolean;
    message: string;
    range: string;
    startDate: string;
    endDate: string;
    reports: Reports;
}

// =====================================================
// COMPONENT
// =====================================================

const AdminReports = () => {
    // =====================================================
    // STATES
    // =====================================================

    const [dateRange, setDateRange] = useState("7d");
    const [activeReport, setActiveReport] = useState("sales");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [reports, setReports] = useState<Reports | null>(null);

    const [loading, setLoading] = useState(false);

    // =====================================================
    // REPORT TABS
    // =====================================================

    const reportTabs = [
        {
            key: "sales",
            label: "Sales Report",
        },
        {
            key: "products",
            label: "Product Performance",
        },
        {
            key: "customers",
            label: "Customer Analytics",
        },
    ];

    // =====================================================
    // FETCH REPORTS
    // =====================================================

    const fetchReports = async (
        range: string = "7d",
        customStartDate: string = "",
        customEndDate: string = ""
    ) => {
        try {
            setLoading(true);

            let url = "/admin/api/v1/dashboard/get-eeports";

            // =============================================
            // CUSTOM DATE
            // =============================================

            if (customStartDate && customEndDate) {
                url +=
                    `?startDate=${customStartDate}` +
                    `&endDate=${customEndDate}`;
            }

            // =============================================
            // PREDEFINED RANGE
            // =============================================

            else {
                url += `?range=${range}`;
            }

            const response: ReportResponse =
                await apiRequest(url,"GET");

            if (response?.success) {
                setReports(response.reports);

                // Backend થી actual range આવે તો પણ update
                setDateRange(response.range);
            }
        } catch (error) {
            console.error("Reports fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchReports("7d");
    }, []);

    // =====================================================
    // RANGE CHANGE
    // =====================================================

    const handleRangeChange = (selectedRange: string) => {
        // Active range તરત update
        setDateRange(selectedRange);

        // Custom dates clear
        setStartDate("");
        setEndDate("");

        // New range data fetch
        fetchReports(selectedRange);
    };

    // =====================================================
    // CUSTOM DATE APPLY
    // =====================================================

    const handleCustomDateApply = () => {
        // Both required
        if (!startDate || !endDate) {
            alert("Please select start date and end date");
            return;
        }

        // Validation
        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be greater than end date");
            return;
        }

        setDateRange("custom");

        fetchReports(
            "custom",
            startDate,
            endDate
        );
    };

    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (amount: number = 0) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(Number(amount || 0));
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // PRODUCT IMAGE URL
    // =====================================================

    const getImageUrl = (image: string) => {
        if (!image) return "";

        // Already full URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "";

        return `${backendUrl}${image}`;
    };

    // =====================================================
    // MAX REVENUE FOR CHART
    // =====================================================

    const maxRevenue = Math.max(
        ...(
            reports?.sales?.chart?.map(
                (item) => item.revenue
            ) || []
        ),
        1
    );

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (!reports && loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="mt-3 text-sm text-gray-500">
                        Loading reports...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <div className="space-y-6">

            {/* =============================================
                HEADER
            ============================================= */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Reports & Analytics
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Track your store performance and business insights.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        <IoCloudDownloadOutline size={18} />
                        Export
                    </button>
                </div>

            </div>


            {/* =============================================
                DATE RANGE SECTION
            ============================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

                    {/* PREDEFINED RANGE */}

                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleRangeChange("today")
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                dateRange === "today"
                                    ? "bg-brand text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Today
                        </button>


                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleRangeChange("7d")
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                dateRange === "7d"
                                    ? "bg-brand text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Last 7 Days
                        </button>


                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleRangeChange("30d")
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                dateRange === "30d"
                                    ? "bg-brand text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Last 30 Days
                        </button>


                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleRangeChange("90d")
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                dateRange === "90d"
                                    ? "bg-brand text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Last 90 Days
                        </button>


                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                handleRangeChange("year")
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                dateRange === "year"
                                    ? "bg-brand text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            This Year
                        </button>

                    </div>


                    {/* CUSTOM DATE */}

                    <div className="flex flex-wrap items-center gap-2">

                        <input
                            type="date"
                            value={startDate}
                            max={endDate || undefined}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                            }}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-brand"
                        />


                        <span className="text-sm text-gray-400">
                            to
                        </span>


                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                            }}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:border-brand"
                        />


                        <button
                            type="button"
                            onClick={handleCustomDateApply}
                            disabled={
                                loading ||
                                !startDate ||
                                !endDate
                            }
                            className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Loading..."
                                : "Apply"}
                        </button>

                    </div>

                </div>

            </div>


            {/* =============================================
                OVERVIEW CARDS
            ============================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


                {/* TOTAL REVENUE */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div className="p-3 rounded-xl bg-green-100 text-green-600">
                            <IoStatsChartOutline size={22} />
                        </div>

                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">

                        {loading
                            ? "..."
                            : formatCurrency(
                                reports?.overview
                                    ?.totalRevenue || 0
                            )}

                    </h3>

                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Total Revenue
                    </p>

                </div>


                {/* TOTAL ORDERS */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                            <IoBagCheckOutline size={22} />
                        </div>

                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">

                        {loading
                            ? "..."
                            : (
                                reports?.overview
                                    ?.totalOrders || 0
                            )}

                    </h3>

                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Total Orders
                    </p>

                </div>


                {/* AVERAGE ORDER VALUE */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                    <div className="flex items-center justify-between mb-4">

                        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                            <IoTrendingUpOutline size={22} />
                        </div>

                    </div>

                    <h3 className="text-2xl font-bold text-gray-900">

                        {loading
                            ? "..."
                            : formatCurrency(
                                reports?.overview
                                    ?.averageOrderValue || 0
                            )}

                    </h3>

                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Average Order Value
                    </p>

                </div>

            </div>


            {/* =============================================
                REPORT TABS
            ============================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="border-b border-gray-100 px-4 sm:px-6 flex gap-1 overflow-x-auto">

                    {reportTabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() =>
                                setActiveReport(tab.key)
                            }
                            className={`px-4 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                                activeReport === tab.key
                                    ? "border-brand text-brand"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}

                </div>


                {/* =========================================
                    SALES REPORT
                ========================================= */}

                {activeReport === "sales" && (
                    <div className="p-4 sm:p-6 space-y-6">


                        {/* SALES CHART */}

                        <div>

                            <div className="flex items-center justify-between mb-5">

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Revenue Overview
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Revenue for selected date range
                                    </p>
                                </div>

                            </div>


                            <div className="h-72 bg-gray-50 rounded-xl border border-gray-100 p-4">

                                {reports?.sales?.chart?.length ? (

                                    <div className="h-full flex items-end gap-2">

                                        {reports.sales.chart.map(
                                            (item, index) => {

                                                const height =
                                                    maxRevenue > 0
                                                        ? (
                                                            item.revenue /
                                                            maxRevenue
                                                        ) * 100
                                                        : 0;

                                                return (
                                                    <div
                                                        key={`${item.label}-${index}`}
                                                        className="h-full flex-1 min-w-0 flex flex-col items-center justify-end group relative"
                                                    >

                                                        {/* TOOLTIP */}

                                                        <div className="absolute bottom-full mb-2 z-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">

                                                            {formatCurrency(
                                                                item.revenue
                                                            )}

                                                            {" • "}

                                                            {item.orders} Orders

                                                        </div>


                                                        {/* BAR */}

                                                        <div
                                                            className="w-full max-w-12 bg-brand rounded-t-md hover:opacity-80 transition-all cursor-pointer"
                                                            style={{
                                                                height: `${Math.max(
                                                                    height,
                                                                    item.revenue > 0
                                                                        ? 4
                                                                        : 0
                                                                )}%`,
                                                            }}
                                                        />


                                                        {/* LABEL */}

                                                        <p className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">

                                                            {new Date(
                                                                item.label
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "short",
                                                                }
                                                            )}

                                                        </p>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                ) : (

                                    <div className="h-full flex items-center justify-center text-sm text-gray-400">
                                        No sales data found
                                    </div>

                                )}

                            </div>

                        </div>


                        {/* SALES TABLE */}

                        <div>

                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Sales Details
                            </h2>


                            <div className="overflow-x-auto border border-gray-100 rounded-xl">

                                <table className="w-full text-sm text-left">

                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">

                                        <tr>

                                            <th className="px-5 py-4">
                                                Date
                                            </th>

                                            <th className="px-5 py-4">
                                                Orders
                                            </th>

                                            <th className="px-5 py-4">
                                                Gross Sales
                                            </th>

                                            <th className="px-5 py-4">
                                                Discounts
                                            </th>

                                            <th className="px-5 py-4">
                                                Shipping
                                            </th>

                                            <th className="px-5 py-4">
                                                Net Revenue
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {reports?.sales?.table?.length ? (

                                            reports.sales.table.map(
                                                (row, index) => (

                                                    <tr
                                                        key={`${row.date}-${index}`}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >

                                                        <td className="px-5 py-4 font-medium text-gray-900">

                                                            {formatDate(
                                                                row.date
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 text-gray-700">

                                                            {row.orders}

                                                        </td>


                                                        <td className="px-5 py-4 text-gray-700">

                                                            {formatCurrency(
                                                                row.grossSales
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 text-red-500">

                                                            -
                                                            {formatCurrency(
                                                                row.discounts
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 text-gray-700">

                                                            {formatCurrency(
                                                                row.shipping
                                                            )}

                                                        </td>


                                                        <td className="px-5 py-4 font-bold text-green-600">

                                                            {formatCurrency(
                                                                row.netRevenue
                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-5 py-12 text-center text-gray-400"
                                                >
                                                    No sales data found
                                                </td>
                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>
                )}


                {/* =========================================
                    PRODUCT PERFORMANCE
                ========================================= */}

                {activeReport === "products" && (
                    <div className="p-4 sm:p-6">

                        <div className="flex items-center justify-between mb-5">

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Product Performance
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Product sales and ratings
                                </p>
                            </div>

                        </div>


                        <div className="overflow-x-auto border border-gray-100 rounded-xl">

                            <table className="w-full text-sm text-left">

                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">

                                    <tr>

                                        <th className="px-5 py-4">
                                            Product
                                        </th>

                                        <th className="px-5 py-4">
                                            Units Sold
                                        </th>

                                        <th className="px-5 py-4">
                                            Revenue
                                        </th>

                                        <th className="px-5 py-4">
                                            Avg Rating
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {reports?.products?.length ? (

                                        reports.products.map(
                                            (product) => (

                                                <tr
                                                    key={product.productId}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >

                                                    {/* PRODUCT */}

                                                    <td className="px-5 py-4">

                                                        <div className="flex items-center gap-3">

                                                            <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">

                                                                {product.image ? (

                                                                    <img
                                                                        src={getImageUrl(
                                                                            product.image
                                                                        )}
                                                                        alt={
                                                                            product.name ||
                                                                            "Product"
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />

                                                                ) : (

                                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                                        No Image
                                                                    </div>

                                                                )}

                                                            </div>


                                                            <div>

                                                                <p className="font-semibold text-gray-900">

                                                                    {product.name ||
                                                                        "Unknown Product"}

                                                                </p>

                                                                <p className="text-xs text-gray-400">

                                                                    ID:{" "}

                                                                    {product.productId}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* UNITS SOLD */}

                                                    <td className="px-5 py-4 font-medium text-gray-700">

                                                        {product.unitsSold}

                                                    </td>


                                                    {/* REVENUE */}

                                                    <td className="px-5 py-4 font-semibold text-green-600">

                                                        {formatCurrency(
                                                            product.revenue
                                                        )}

                                                    </td>


                                                    {/* RATING */}

                                                    <td className="px-5 py-4">

                                                        {product.averageRating >
                                                        0 ? (

                                                            <span className="font-semibold text-yellow-600">

                                                                ⭐{" "}

                                                                {
                                                                    product.averageRating
                                                                }

                                                                /5

                                                            </span>

                                                        ) : (

                                                            <span className="text-gray-400">
                                                                No ratings
                                                            </span>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-5 py-12 text-center text-gray-400"
                                            >
                                                No product data found
                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}


                {/* =========================================
                    CUSTOMER ANALYTICS
                ========================================= */}

                {activeReport === "customers" && (
                    <div className="p-4 sm:p-6 space-y-6">


                        {/* CUSTOMER OVERVIEW */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


                            {/* TOTAL CUSTOMERS */}

                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">

                                <div className="p-2.5 w-fit bg-blue-100 text-blue-600 rounded-lg mb-3">
                                    <IoPeopleOutline size={20} />
                                </div>

                                <p className="text-2xl font-bold text-gray-900">

                                    {reports?.customers
                                        ?.totalCustomers || 0}

                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Total Customers
                                </p>

                            </div>


                            {/* NEW CUSTOMERS */}

                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">

                                <div className="p-2.5 w-fit bg-green-100 text-green-600 rounded-lg mb-3">
                                    <IoPeopleOutline size={20} />
                                </div>

                                <p className="text-2xl font-bold text-gray-900">

                                    {reports?.customers
                                        ?.newCustomers || 0}

                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    New Customers
                                </p>

                            </div>


                            {/* REPEAT RATE */}

                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">

                                <div className="p-2.5 w-fit bg-purple-100 text-purple-600 rounded-lg mb-3">
                                    <IoTrendingUpOutline size={20} />
                                </div>

                                <p className="text-2xl font-bold text-gray-900">

                                    {reports?.customers
                                        ?.repeatRate || 0}
                                    %

                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Repeat Rate
                                </p>

                            </div>


                            {/* AVERAGE CLV */}

                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">

                                <div className="p-2.5 w-fit bg-orange-100 text-orange-600 rounded-lg mb-3">
                                    <IoStatsChartOutline size={20} />
                                </div>

                                <p className="text-2xl font-bold text-gray-900">

                                    {formatCurrency(
                                        reports?.customers
                                            ?.averageCLV || 0
                                    )}

                                </p>

                                <p className="text-sm text-gray-500 mt-1">
                                    Average CLV
                                </p>

                            </div>

                        </div>


                        {/* CUSTOMER SEGMENTS */}

                        <div>

                            <div className="mb-5">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Customer Segments
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Customer segmentation based on orders
                                </p>

                            </div>


                            <div className="overflow-x-auto border border-gray-100 rounded-xl">

                                <table className="w-full text-sm text-left">

                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">

                                        <tr>

                                            <th className="px-5 py-4">
                                                Segment
                                            </th>

                                            <th className="px-5 py-4">
                                                Customers
                                            </th>

                                            <th className="px-5 py-4">
                                                Revenue Share
                                            </th>

                                            <th className="px-5 py-4">
                                                Average Orders
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {reports?.customers
                                            ?.segments?.length ? (

                                            reports.customers.segments.map(
                                                (
                                                    segment,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={`${segment.segment}-${index}`}
                                                        className="hover:bg-gray-50 transition-colors"
                                                    >

                                                        <td className="px-5 py-4 font-semibold text-gray-900">

                                                            {
                                                                segment.segment
                                                            }

                                                        </td>


                                                        <td className="px-5 py-4 text-gray-700">

                                                            {
                                                                segment.count
                                                            }

                                                        </td>


                                                        <td className="px-5 py-4">

                                                            <span className="font-semibold text-green-600">

                                                                {
                                                                    segment.revenueShare
                                                                }

                                                                %

                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-4 text-gray-700">

                                                            {
                                                                segment.averageOrders
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-5 py-12 text-center text-gray-400"
                                                >
                                                    No customer data found
                                                </td>
                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default AdminReports;