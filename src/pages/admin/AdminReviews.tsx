import React, { useEffect, useState } from "react";
import {
    IoSearchOutline,
    IoStarOutline,
    IoStar,
    IoCheckmarkOutline,
    IoCloseOutline,
    IoTrashOutline
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

interface Review {
    _id: string;
    userId: string;
    orderId: string;
    productId: string;
    rating: number;
    review: string;
    status: "pending" | "approved" | "rejected";
    reply: string;
    createdAt: string;
    updatedAt: string;
    userName: string;
    productName: string;
}

interface ReviewResponse {
    success: boolean;
    message: string;
    averageRating: number;
    totalReviews: number;

    ratingSummary: {
        "1": number;
        "2": number;
        "3": number;
        "4": number;
        "5": number;
    };

    statusSummary: {
        pending: number;
        approved: number;
        rejected: number;
    };

    reviews: Review[];
}

const AdminReviews = () => {

    // ==========================================
    // STATES
    // ==========================================

    const [reviews, setReviews] = useState<Review[]>([]);

    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const [ratingSummary, setRatingSummary] = useState({
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0
    });

    const [statusSummary, setStatusSummary] = useState({
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [ratingFilter, setRatingFilter] = useState("All Ratings");

    // Modal form states
    const [reply, setReply] = useState("");
    const [reviewStatus, setReviewStatus] = useState<
        "pending" | "approved" | "rejected"
    >("pending");

    // Loading states
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    // ==========================================
    // GET REVIEWS
    // ==========================================

    const fetchReviews = async () => {
        try {

            const response: ReviewResponse = await apiRequest(
                "/admin/api/v1/reviews/get",
                "GET"
            );

            if (response?.success) {

                setReviews(response.reviews || []);

                setAverageRating(response.averageRating || 0);

                setTotalReviews(response.totalReviews || 0);

                setRatingSummary(
                    response.ratingSummary || {
                        "1": 0,
                        "2": 0,
                        "3": 0,
                        "4": 0,
                        "5": 0
                    }
                );

                setStatusSummary(
                    response.statusSummary || {
                        pending: 0,
                        approved: 0,
                        rejected: 0
                    }
                );
            }

        } catch (error) {

            console.error("Get reviews error:", error);

        }
    };


    useEffect(() => {
        fetchReviews();
    }, []);


    // ==========================================
    // OPEN REVIEW MODAL
    // ==========================================

    const handleOpenReview = (review: Review) => {

        setSelectedReview(review);

        setReply(review.reply || "");

        setReviewStatus(review.status);

    };


    // ==========================================
    // CLOSE REVIEW MODAL
    // ==========================================

    const handleCloseModal = () => {

        if (isUpdating || isDeleting) {
            return;
        }

        setSelectedReview(null);

        setReply("");

        setReviewStatus("pending");
    };


    // ==========================================
    // UPDATE REVIEW
    // ==========================================

    const handleUpdateReview = async () => {

        if (!selectedReview) {
            return;
        }

        try {

            setIsUpdating(true);
            const payload = {
                    status: reviewStatus,
                    reply: reply
                }
            const response = await apiRequest(
                `/admin/api/v1/reviews/update/${selectedReview._id}`,"PATCH",payload);
            if (response?.success) {

                // Close modal
                setSelectedReview(null);

                setReply("");

                setReviewStatus("pending");

                // Refresh complete review data
                await fetchReviews();

            } else {

                console.error(
                    response?.message || "Failed to update review"
                );

            }

        } catch (error) {

            console.error("Update review error:", error);

        } finally {

            setIsUpdating(false);

        }
    };


    // ==========================================
    // DELETE REVIEW
    // ==========================================

    const handleDeleteReview = async () => {

        if (!selectedReview) {
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setIsDeleting(true);

            const response = await apiRequest(`/admin/api/v1/reviews/delete/${selectedReview._id}`,"DELETE");

            if (response?.success) {

                // Remove immediately from UI
                setReviews((prevReviews) =>
                    prevReviews.filter(
                        (review) =>
                            review._id !== selectedReview._id
                    )
                );

                // Close modal
                setSelectedReview(null);

                setReply("");

                setReviewStatus("pending");

                // Refresh summary:
                // totalReviews
                // averageRating
                // ratingSummary
                // statusSummary
                await fetchReviews();

            } else {

                console.error(
                    response?.message || "Failed to delete review"
                );

            }

        } catch (error) {

            console.error("Delete review error:", error);

        } finally {

            setIsDeleting(false);

        }
    };


    // ==========================================
    // QUICK APPROVE
    // ==========================================

    const handleQuickApprove = async (
        review: Review,
        event: React.MouseEvent
    ) => {

        event.stopPropagation();

        try {
        
            const response = await apiRequest(
                `/admin/api/v1/reviews/update/${review._id}`,
                "PATCH",
                {
                    status: "approved",
                    reply: review.reply || ""
                }
            );


            if (response?.success) {

                await fetchReviews();

            }

        } catch (error) {

            console.error("Approve review error:", error);

        }
    };


    // ==========================================
    // QUICK REJECT
    // ==========================================

    const handleQuickReject = async (
        review: Review,
        event: React.MouseEvent
    ) => {

        event.stopPropagation();

        try {

            const response = await apiRequest(
                `/admin/api/v1/reviews/update/${review._id}`,
                "PATCH",
                {
                    status: "rejected",
                    reply: review.reply || ""
                }
            );

            if (response?.success) {

                await fetchReviews();

            }

        } catch (error) {

            console.error("Reject review error:", error);

        }
    };


    const handleApproveAllPending = async () => {
    try {
        if (statusSummary.pending === 0) {
            alert("No pending reviews found.");
            return;
        }

        const response = await apiRequest(
            "/admin/api/v1/reviews/approve-all",
            "PATCH"
        );

        if (response?.success) {
            alert(response.message || "All pending reviews approved successfully.");

            // Refresh reviews + summary
            await fetchReviews();

            // જો modal open હોય તો close કરી દો
            setSelectedReview(null);
        }

    } catch (error) {
        console.error("Approve all reviews error:", error);
        alert("Failed to approve pending reviews.");
    }
};

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date: string) => {

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    };


    // ==========================================
    // FILTER REVIEWS
    // ==========================================

    const filteredReviews = reviews.filter((review) => {

        const searchText = search.toLowerCase();

        const matchesSearch =
            review.userName
                ?.toLowerCase()
                .includes(searchText) ||

            review.productName
                ?.toLowerCase()
                .includes(searchText) ||

            review.review
                ?.toLowerCase()
                .includes(searchText);


        const matchesStatus =
            statusFilter === "All Status" ||
            review.status.toLowerCase() ===
            statusFilter.toLowerCase();


        const selectedRating =
            ratingFilter === "All Ratings"
                ? true
                : review.rating === Number(
                    ratingFilter
                        .replace(" Stars", "")
                        .replace(" Star", "")
                );


        return (
            matchesSearch &&
            matchesStatus &&
            selectedRating
        );

    });


    // ==========================================
    // RATING PERCENTAGE
    // ==========================================

    const getRatingPercentage = (rating: number) => {

        if (!totalReviews) {
            return 0;
        }

        return Math.round(
            (
                ratingSummary[
                    rating as keyof typeof ratingSummary
                ] /
                totalReviews
            ) * 100
        );

    };


    return (

        <div className="space-y-6">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                <div>

                    <h1 className="font-heading text-2xl font-bold text-gray-900">
                        Reviews & Ratings
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Manage product reviews submitted by customers.
                    </p>

                </div>

                <div className="flex gap-2">

                   <button
    onClick={handleApproveAllPending}
    disabled={statusSummary.pending === 0}
    className={`px-4 py-2 text-sm font-semibold rounded-lg border ${
        statusSummary.pending === 0
            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
    }`}
>
    Approve All Pending
</button>

                </div>

            </div>


            {/* ==========================================
                SUMMARY STATS
            ========================================== */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                {/* Average Rating */}

                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                    <p className="text-2xl font-bold text-gray-900">
                        {averageRating.toFixed(1)}
                    </p>

                    <div className="flex justify-center text-yellow-400 mt-1">

                        {[1, 2, 3, 4, 5].map((i) => (

                            i <= Math.round(averageRating) ? (

                                <IoStar
                                    key={i}
                                    size={14}
                                />

                            ) : (

                                <IoStarOutline
                                    key={i}
                                    size={14}
                                    className="text-gray-300"
                                />

                            )

                        ))}

                    </div>

                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Average Rating
                    </p>

                </div>


                {/* Total Reviews */}

                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                    <p className="text-2xl font-bold text-gray-900">
                        {totalReviews}
                    </p>

                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Total Reviews
                    </p>

                </div>


                {/* Pending */}

                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                    <p className="text-2xl font-bold text-orange-600">
                        {statusSummary.pending}
                    </p>

                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Pending
                    </p>

                </div>


                {/* Approved */}

                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                    <p className="text-2xl font-bold text-green-600">
                        {statusSummary.approved}
                    </p>

                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Approved
                    </p>

                </div>


                {/* Rejected */}

                <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">

                    <p className="text-2xl font-bold text-red-600">
                        {statusSummary.rejected}
                    </p>

                    <p className="text-xs text-gray-500 font-semibold mt-1">
                        Rejected
                    </p>

                </div>

            </div>


            {/* ==========================================
                RATING DISTRIBUTION
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Rating Distribution
                </h2>

                <div className="space-y-2">

                    {[5, 4, 3, 2, 1].map((stars) => {

                        const count =
                            ratingSummary[
                                stars as keyof typeof ratingSummary
                            ];

                        const pct =
                            getRatingPercentage(stars);

                        return (

                            <div
                                key={stars}
                                className="flex items-center gap-3"
                            >

                                <span className="text-sm font-semibold text-gray-700 w-6">
                                    {stars}★
                                </span>

                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{
                                            width: `${pct}%`
                                        }}
                                    />

                                </div>

                                <span className="text-sm text-gray-500 w-16 text-right">
                                    {count} ({pct}%)
                                </span>

                            </div>

                        );

                    })}

                </div>

            </div>


            {/* ==========================================
                REVIEW DETAIL MODAL
            ========================================== */}

            {selectedReview && (

                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        {/* Modal Header */}

                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">

                            <h2 className="text-xl font-bold text-gray-900">
                                Review Details
                            </h2>

                            <button
                                onClick={handleCloseModal}
                                disabled={isUpdating || isDeleting}
                                className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 disabled:opacity-50"
                            >
                                <IoCloseOutline size={24} />
                            </button>

                        </div>


                        <div className="p-6 space-y-4">

                            {/* Customer */}

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="font-bold text-gray-900">
                                        {selectedReview.userName ||
                                            "Unknown User"}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {formatDate(
                                            selectedReview.createdAt
                                        )}
                                    </p>

                                </div>

                            </div>


                            {/* Product */}

                            <div>

                                <p className="text-xs text-gray-500 mb-1">
                                    Product
                                </p>

                                <p className="font-medium text-gray-900">
                                    {selectedReview.productName ||
                                        "Unknown Product"}
                                </p>

                            </div>


                            {/* Rating */}

                            <div className="flex text-yellow-400">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    star <= selectedReview.rating ? (

                                        <IoStar
                                            key={star}
                                            size={20}
                                        />

                                    ) : (

                                        <IoStarOutline
                                            key={star}
                                            size={20}
                                            className="text-gray-300"
                                        />

                                    )

                                ))}

                                <span className="ml-2 text-sm font-semibold text-gray-700">
                                    {selectedReview.rating}/5
                                </span>

                            </div>


                            {/* Review */}

                            <div className="bg-gray-50 rounded-xl p-4">

                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {selectedReview.review}
                                </p>

                            </div>


                            {/* Admin Reply */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Admin Reply
                                </label>

                                <textarea
                                    rows={3}
                                    value={reply}
                                    onChange={(e) =>
                                        setReply(e.target.value)
                                    }
                                    placeholder="Write a reply to this review..."
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand text-sm"
                                />

                            </div>


                            {/* Status */}

                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>

                                <select
                                    value={reviewStatus}
                                    onChange={(e) =>
                                        setReviewStatus(
                                            e.target.value as
                                            | "pending"
                                            | "approved"
                                            | "rejected"
                                        )
                                    }
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="approved">
                                        Approved
                                    </option>

                                    <option value="rejected">
                                        Rejected
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* Modal Footer */}

                        <div className="p-6 border-t border-gray-100 flex justify-between items-center sticky bottom-0 bg-white z-10">

                            {/* Delete */}

                            <button
                                onClick={handleDeleteReview}
                                disabled={isDeleting || isUpdating}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded-xl disabled:opacity-50"
                            >

                                <IoTrashOutline size={16} />

                                {isDeleting
                                    ? "Deleting..."
                                    : "Delete Review"}

                            </button>


                            <div className="flex gap-3">

                                {/* Cancel */}

                                <button
                                    onClick={handleCloseModal}
                                    disabled={isUpdating || isDeleting}
                                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                {/* Save */}

                                <button
                                    onClick={handleUpdateReview}
                                    disabled={
                                        isUpdating ||
                                        isDeleting
                                    }
                                    className="px-6 py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light shadow-sm disabled:opacity-50"
                                >

                                    {isUpdating
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ==========================================
                REVIEWS TABLE
            ========================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">

                    {/* Search */}

                    <div className="relative w-full sm:w-72">

                        <IoSearchOutline
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search reviews..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand"
                        />

                    </div>


                    <div className="flex gap-2">

                        {/* Status Filter */}

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand"
                        >

                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>

                        </select>


                        {/* Rating Filter */}

                        <select
                            value={ratingFilter}
                            onChange={(e) =>
                                setRatingFilter(e.target.value)
                            }
                            className="px-3 py-2 bg-white border border-gray-200 text-sm rounded-xl focus:outline-none focus:border-brand"
                        >

                            <option>All Ratings</option>
                            <option>5 Stars</option>
                            <option>4 Stars</option>
                            <option>3 Stars</option>
                            <option>2 Stars</option>
                            <option>1 Star</option>

                        </select>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full text-sm text-left">

                        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">

                            <tr>

                                <th className="px-6 py-4">

                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                    />

                                </th>

                                <th className="px-6 py-4">
                                    Customer
                                </th>

                                <th className="px-6 py-4">
                                    Product
                                </th>

                                <th className="px-6 py-4">
                                    Rating
                                </th>

                                <th className="px-6 py-4">
                                    Review
                                </th>

                                <th className="px-6 py-4">
                                    Date
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

                            {filteredReviews.map((review) => (

                                <tr
                                    key={review._id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() =>
                                        handleOpenReview(review)
                                    }
                                >

                                    {/* Checkbox */}

                                    <td
                                        className="px-6 py-4"
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >

                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                        />

                                    </td>


                                    {/* Customer */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-2">

                                            <span className="font-medium text-gray-900">
                                                {review.userName ||
                                                    "Unknown User"}
                                            </span>

                                        </div>

                                    </td>


                                    {/* Product */}

                                    <td className="px-6 py-4 text-gray-600">

                                        {review.productName ||
                                            "Unknown Product"}

                                    </td>


                                    {/* Rating */}

                                    <td className="px-6 py-4">

                                        <div className="flex text-yellow-400">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                    star <=
                                                        review.rating ? (

                                                        <IoStar
                                                            key={star}
                                                            size={14}
                                                        />

                                                    ) : (

                                                        <IoStarOutline
                                                            key={star}
                                                            size={14}
                                                            className="text-gray-300"
                                                        />

                                                    )

                                                )
                                            )}

                                        </div>

                                    </td>


                                    {/* Review */}

                                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">

                                        {review.review}

                                    </td>


                                    {/* Date */}

                                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">

                                        {formatDate(
                                            review.createdAt
                                        )}

                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4">

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                review.status ===
                                                "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : review.status ===
                                                        "pending"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-red-100 text-red-700"
                                            }`}
                                        >

                                            {review.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                review.status.slice(1)}

                                        </span>

                                    </td>


                                    {/* Actions */}

                                    <td
                                        className="px-6 py-4 text-right"
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >

                                        <div className="flex items-center justify-end gap-1">

                                            {/* Approve */}

                                            <button
                                                onClick={(e) =>
                                                    handleQuickApprove(
                                                        review,
                                                        e
                                                    )
                                                }
                                                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"
                                                title="Approve"
                                            >

                                                <IoCheckmarkOutline
                                                    size={16}
                                                />

                                            </button>


                                            {/* Reject */}

                                            <button
                                                onClick={(e) =>
                                                    handleQuickReject(
                                                        review,
                                                        e
                                                    )
                                                }
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                                title="Reject"
                                            >

                                                <IoCloseOutline
                                                    size={16}
                                                />

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

export default AdminReviews;