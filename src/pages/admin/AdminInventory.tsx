import React, { useEffect, useMemo, useState } from "react";
import {
    IoWarningOutline,
    IoSearchOutline,
    IoCloudDownloadOutline,
    IoCloudUploadOutline
} from "react-icons/io5";

import { apiRequest } from "../../services/apiService";

interface Variant {
    _id: string;
    name: string;
    stock: number;
}

interface InventoryProduct {
    _id: string;
    productname: string;
    productsku: string;
    variants: Variant[];
    warehouseLocation: string;
    lowStock: number;
}

interface InventoryRow {
    inventoryId: string;
    productname: string;
    productsku: string;
    variantId: string;
    variantName: string;
    stock: number;
    warehouseLocation: string;
}

const AdminInventory = () => {

    const [showBulkUpdate, setShowBulkUpdate] = useState(false);

    const [inventoryProducts, setInventoryProducts] =
        useState<InventoryProduct[]>([]);

    const [search, setSearch] = useState("");

    const [stockFilter, setStockFilter] =
        useState("All Stock Levels");

    const [warehouseFilter, setWarehouseFilter] =
        useState("All Warehouses");

    const [updatedStocks, setUpdatedStocks] =
        useState<Record<string, number>>({});


    // ==========================================
    // GET INVENTORY
    // ==========================================

    const GetInventory = async () => {

        try {

            const response = await apiRequest("/admin/api/v1/product/inventory/get","GET");

            if (response?.success) {
                setInventoryProducts(response.products || []);
            }
        } catch (error) {
            console.log(error);
        }

    };


    useEffect(() => {

        GetInventory();

    }, []);


    // ==========================================
    // FLAT PRODUCT VARIANTS
    // ==========================================

    const inventoryRows = useMemo<InventoryRow[]>(() => {
    return inventoryProducts.flatMap((product) =>
        (product.variants || []).map((variant) => ({
            inventoryId: product._id,
            productname: product.productname,
            productsku: product.productsku,
            variantId: variant._id,
            variantName: variant.name,
            stock: variant.stock,
            warehouseLocation: product.warehouseLocation || "Not Assigned"
        }))
    );
}, [inventoryProducts]);


    // ==========================================
    // STOCK STATUS
    //
    // stock = 0
    //      -> Out of Stock
    //
    // stock > 0 && stock <= lowStock
    //      -> Low Stock
    //
    // stock > lowStock
    //      -> In Stock
    //
    // lowStock = 0 hoy to:
    //
    // stock = 0 -> Out of Stock
    // stock > 0 -> In Stock
    // ==========================================

   const getStockStatus = (stock: number) => {
    if (stock === 0) {
        return {
            text: "Out of Stock",
            color: "bg-red-100 text-red-700"
        };
    }

    if (stock < 3) {
        return {
            text: "Low Stock",
            color: "bg-orange-100 text-orange-700"
        };
    }

    return {
        text: "In Stock",
        color: "bg-green-100 text-green-700"
    };
};


    // ==========================================
    // DYNAMIC WAREHOUSES
    // ==========================================

    const warehouses = useMemo(() => {

        return [

            ...new Set(

                inventoryProducts

                    .map(
                        (product) =>
                            product.warehouseLocation
                    )

                    .filter(
                        (warehouse) =>
                            warehouse
                    )

            )

        ];

    }, [inventoryProducts]);


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

   const filteredRows = useMemo(() => {
    return inventoryRows.filter((row) => {

        const searchValue = search.toLowerCase().trim();

        const matchesSearch =
            !searchValue ||
            row.productsku.toLowerCase().includes(searchValue) ||
            row.productname.toLowerCase().includes(searchValue);

        let matchesStock = true;

        if (stockFilter === "In Stock") {
            matchesStock = row.stock >= 3;
        }

        if (stockFilter === "Low Stock") {
            matchesStock = row.stock > 0 && row.stock < 3;
        }

        if (stockFilter === "Out of Stock") {
            matchesStock = row.stock === 0;
        }

        const matchesWarehouse =
            warehouseFilter === "All Warehouses" ||
            row.warehouseLocation === warehouseFilter;

        return (
            matchesSearch &&
            matchesStock &&
            matchesWarehouse
        );
    });
}, [
    inventoryRows,
    search,
    stockFilter,
    warehouseFilter
]);


    // ==========================================
    // SUMMARY
    // ==========================================

   const summary = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryRows.forEach((row) => {
        if (row.stock === 0) {
            outOfStock++;
        } else if (row.stock < 3) {
            lowStock++;
        } else {
            inStock++;
        }
    });

    return {
        totalProducts: inventoryProducts.length,
        inStock,
        lowStock,
        outOfStock
    };
}, [inventoryRows, inventoryProducts.length]);


    // ==========================================
    // SAVE VARIANT STOCK
    // ==========================================

    const handleSave = async (
        variantId: string,
        currentStock: number
    ) => {

        const newStock =
            updatedStocks[variantId] !== undefined
                ? updatedStocks[variantId]
                : currentStock;


        console.log(
            "Variant ID:",
            variantId
        );

        console.log(
            "New Stock:",
            newStock
        );


        // ======================================
        // VALIDATION
        // ======================================

        if (newStock < 0) {

            alert(
                "Stock cannot be negative"
            );

            return;

        }


        try {

            const response = await apiRequest(
                "/admin/api/v1/product/inventory/update-stock",
                "PATCH",
                {
                    variantId,
                    stock: newStock
                }
            );


            console.log(
                "Update Stock Response:",
                response
            );


            if (response?.success) {

                // ==================================
                // REFRESH INVENTORY
                // ==================================

                await GetInventory();


                // ==================================
                // REMOVE TEMP STOCK
                // ==================================

                setUpdatedStocks((prev) => {

                    const newData = {
                        ...prev
                    };

                    delete newData[
                        variantId
                    ];

                    return newData;

                });

            }

        } catch (error) {

            console.log(error);

        }

    };


    return (

        <div className="space-y-6">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>

                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Inventory
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage stock levels and receive alerts.
                    </p>

                </div>


                <div className="flex gap-2">

                    <button
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            bg-white
                            border border-gray-200
                            text-sm font-semibold
                            text-gray-700
                            rounded-lg
                            hover:bg-gray-50
                        "
                    >

                        <IoCloudDownloadOutline size={18} />

                        Export CSV

                    </button>


                    <button
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            bg-white
                            border border-gray-200
                            text-sm font-semibold
                            text-gray-700
                            rounded-lg
                            hover:bg-gray-50
                        "
                    >

                        <IoCloudUploadOutline size={18} />

                        Import CSV

                    </button>


                    <button
                        onClick={() =>
                            setShowBulkUpdate(
                                !showBulkUpdate
                            )
                        }
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            bg-brand
                            text-white
                            text-sm font-semibold
                            rounded-lg
                            shadow-sm
                            hover:bg-brand-light
                            transition-colors
                        "
                    >

                        Bulk Update

                    </button>

                </div>

            </div>


            {/* ==========================================
                SUMMARY
            ========================================== */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">


                {/* TOTAL PRODUCTS */}

                <div className="bg-white rounded-xl border border-gray-100 p-4">

                    <p className="text-sm font-semibold text-gray-500">
                        Total Products
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {summary.totalProducts}
                    </p>

                </div>


                {/* IN STOCK */}

                <div className="bg-white rounded-xl border border-gray-100 p-4">

                    <p className="text-sm font-semibold text-gray-500">
                        In Stock
                    </p>

                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {summary.inStock}
                    </p>

                </div>


                {/* LOW STOCK */}

                <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">

                    <p className="text-sm font-semibold text-orange-600">
                        Low Stock
                    </p>

                    <p className="text-2xl font-bold text-orange-600 mt-1">
                        {summary.lowStock}
                    </p>

                </div>


                {/* OUT OF STOCK */}

                <div className="bg-red-50 rounded-xl border border-red-200 p-4">

                    <p className="text-sm font-semibold text-red-600">
                        Out of Stock
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-1">
                        {summary.outOfStock}
                    </p>

                </div>

            </div>


            {/* ==========================================
                STOCK ALERT
            ========================================== */}

            {(summary.lowStock > 0 ||
                summary.outOfStock > 0) && (

                <div
                    className="
                        bg-orange-50
                        border border-orange-200
                        rounded-xl
                        p-4
                        flex items-center gap-3
                    "
                >

                    <IoWarningOutline
                        size={24}
                        className="
                            text-orange-500
                            flex-shrink-0
                        "
                    />


                    <div>

                        <p className="text-sm font-semibold text-orange-700">
                            Stock Alert
                        </p>

                        <p className="text-xs text-orange-600">

                            {summary.lowStock} low stock and{" "}

                            {summary.outOfStock} out of stock
                            variants need attention.

                        </p>

                    </div>

                </div>

            )}


            {/* ==========================================
                BULK UPDATE
            ========================================== */}

            {showBulkUpdate && (

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

                    <h3 className="text-sm font-bold text-blue-700 mb-4">
                        Bulk Stock Update
                    </h3>


                    <p className="text-xs text-blue-600 mb-4">
                        Upload a CSV file to update stock quantities for multiple products at once.
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload CSV File
                            </label>


                            <div
                                className="
                                    border-2
                                    border-dashed
                                    border-blue-300
                                    rounded-xl
                                    p-4
                                    text-center
                                    bg-white
                                    cursor-pointer
                                    hover:bg-blue-50
                                    transition-colors
                                "
                            >

                                <IoCloudUploadOutline
                                    size={24}
                                    className="
                                        mx-auto
                                        text-blue-400
                                        mb-1
                                    "
                                />

                                <p className="text-sm font-semibold text-blue-600">
                                    Click to upload
                                </p>

                                <p className="text-xs text-blue-400 mt-1">
                                    Format: SKU, Quantity
                                </p>

                            </div>

                        </div>


                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Update Type
                            </label>


                            <select
                                className="
                                    w-full
                                    px-4 py-2.5
                                    bg-white
                                    border border-blue-200
                                    rounded-xl
                                    focus:outline-none
                                    focus:border-brand
                                    mb-3
                                "
                            >

                                <option>
                                    Set absolute quantity
                                </option>

                                <option>
                                    Add to existing stock
                                </option>

                                <option>
                                    Subtract from stock
                                </option>

                            </select>


                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes / Reason
                            </label>


                            <input
                                type="text"
                                placeholder="e.g. Restock from supplier"
                                className="
                                    w-full
                                    px-4 py-2.5
                                    bg-white
                                    border border-blue-200
                                    rounded-xl
                                    focus:outline-none
                                    focus:border-brand
                                "
                            />

                        </div>

                    </div>


                    <div className="flex gap-3">

                        <button
                            className="
                                px-6 py-2.5
                                bg-blue-600
                                text-white
                                text-sm
                                font-bold
                                rounded-xl
                                hover:bg-blue-700
                                shadow-sm
                            "
                        >
                            Apply Update
                        </button>


                        <button
                            onClick={() =>
                                setShowBulkUpdate(false)
                            }
                            className="
                                px-6 py-2.5
                                border border-blue-200
                                text-sm
                                font-bold
                                text-blue-600
                                rounded-xl
                                hover:bg-blue-100
                            "
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}


            {/* ==========================================
                INVENTORY TABLE
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">


                {/* SEARCH + FILTER */}

                <div
                    className="
                        p-4
                        border-b border-gray-100
                        flex flex-col
                        sm:flex-row
                        items-center
                        justify-between
                        gap-4
                    "
                >


                    {/* SEARCH */}

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />


                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by product or SKU..."
                            className="
                                w-full
                                pl-10 pr-4 py-2
                                bg-gray-50
                                border border-gray-200
                                rounded-xl
                                text-sm
                                focus:outline-none
                                focus:border-brand
                                focus:ring-1
                                focus:ring-brand
                            "
                        />

                    </div>


                    <div className="flex gap-2">


                        {/* STOCK FILTER */}

                        <select
                            value={stockFilter}
                            onChange={(e) =>
                                setStockFilter(
                                    e.target.value
                                )
                            }
                            className="
                                px-3 py-2
                                bg-white
                                border border-gray-200
                                text-sm
                                rounded-xl
                                focus:outline-none
                                focus:border-brand
                            "
                        >

                            <option>
                                All Stock Levels
                            </option>

                            <option>
                                In Stock
                            </option>

                            <option>
                                Low Stock
                            </option>

                            <option>
                                Out of Stock
                            </option>

                        </select>


                        {/* WAREHOUSE */}

                        <select
                            value={warehouseFilter}
                            onChange={(e) =>
                                setWarehouseFilter(
                                    e.target.value
                                )
                            }
                            className="
                                px-3 py-2
                                bg-white
                                border border-gray-200
                                text-sm
                                rounded-xl
                                focus:outline-none
                                focus:border-brand
                            "
                        >

                            <option>
                                All Warehouses
                            </option>


                            {warehouses.map(
                                (warehouse) => (

                                    <option
                                        key={warehouse}
                                        value={warehouse}
                                    >
                                        {warehouse}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>


                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-left">


                        <thead
                            className="
                                bg-gray-50
                                text-gray-500
                                font-semibold
                                uppercase
                                text-xs
                                tracking-wider
                            "
                        >

                            <tr>

                                <th className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        className="
                                            w-4 h-4
                                            rounded
                                            border-gray-300
                                            text-brand
                                            focus:ring-brand
                                        "
                                    />
                                </th>


                                <th className="px-6 py-4">
                                    Product
                                </th>


                                <th className="px-6 py-4">
                                    SKU
                                </th>


                                <th className="px-6 py-4">
                                    Variant
                                </th>


                                <th className="px-6 py-4">
                                    Current Stock
                                </th>


                                <th className="px-6 py-4">
                                    Low Stock Limit
                                </th>


                                <th className="px-6 py-4">
                                    Warehouse
                                </th>


                                <th className="px-6 py-4">
                                    Status
                                </th>


                                <th className="px-6 py-4 text-right">
                                    Quick Update
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-100">


                            {filteredRows.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={9}
                                        className="
                                            px-6 py-10
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        No inventory found
                                    </td>

                                </tr>

                            ) : (

                                filteredRows.map((row:any) => {

                                    const status = getStockStatus(row.stock);


                                    return (

                                        <tr
                                            key={row.variantId}
                                            className="
                                                hover:bg-gray-50
                                                transition-colors
                                            "
                                        >


                                            {/* CHECKBOX */}

                                            <td className="px-6 py-4">

                                                <input
                                                    type="checkbox"
                                                    className="
                                                        w-4 h-4
                                                        rounded
                                                        border-gray-300
                                                        text-brand
                                                        focus:ring-brand
                                                    "
                                                />

                                            </td>


                                            {/* PRODUCT */}

                                            <td className="px-6 py-4 font-medium text-gray-900">

                                                {row.productname}

                                            </td>


                                            {/* SKU */}

                                            <td className="
                                                px-6 py-4
                                                text-gray-500
                                                font-mono
                                                text-xs
                                            ">

                                                {row.productsku}

                                            </td>


                                            {/* VARIANT */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {row.variantName}

                                            </td>


                                            {/* STOCK */}

                                            <td className="
                                                px-6 py-4
                                                font-semibold
                                                text-gray-900
                                            ">

                                                {row.stock}

                                            </td>


                                            {/* LOW STOCK LIMIT */}

                                            <td className="
                                                px-6 py-4
                                                text-gray-500
                                            ">

                                                {row.lowStock > 0
                                                    ? row.lowStock
                                                    : "-"
                                                }

                                            </td>


                                            {/* WAREHOUSE */}

                                            <td className="
                                                px-6 py-4
                                                text-gray-500
                                            ">

                                                {row.warehouseLocation}

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`
                                                        px-2.5
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        ${status.color}
                                                    `}
                                                >
                                                    {status.text}
                                                </span>

                                            </td>


                                            {/* QUICK UPDATE */}

                                            <td className="
                                                px-6 py-4
                                                text-right
                                            ">

                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    justify-end
                                                ">


                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={
                                                            updatedStocks[
                                                                row.variantId
                                                            ] !== undefined
                                                                ? updatedStocks[
                                                                    row.variantId
                                                                ]
                                                                : row.stock
                                                        }
                                                        onChange={(e) => {

                                                            const value =
                                                                Number(
                                                                    e.target.value
                                                                );


                                                            setUpdatedStocks(
                                                                (prev) => ({

                                                                    ...prev,

                                                                    [row.variantId]:
                                                                        Math.max(
                                                                            0,
                                                                            value
                                                                        )

                                                                })
                                                            );

                                                        }}
                                                        className="
                                                            w-20
                                                            px-2 py-1
                                                            bg-gray-50
                                                            border border-gray-200
                                                            rounded
                                                            text-sm
                                                            text-center
                                                        "
                                                    />


                                                    <button
                                                        onClick={() =>
                                                            handleSave(
                                                                row.variantId,
                                                                row.stock
                                                            )
                                                        }
                                                        className="
                                                            text-brand
                                                            text-sm
                                                            font-semibold
                                                            hover:underline
                                                        "
                                                    >
                                                        Save
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

export default AdminInventory;