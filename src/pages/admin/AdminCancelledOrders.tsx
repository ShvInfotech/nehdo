import React, { useEffect, useMemo, useState } from "react";
import {
  IoSearchOutline,
  IoChevronBackOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCardOutline,
  IoPersonOutline,
  IoInformationCircleOutline,
  IoCubeOutline,
  IoPrintOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import { apiRequest } from "../../services/apiService";

// =====================================================
// TYPES
// =====================================================

interface BankDetails {
  holderName: string | null;
  accountNumber: string | null;
  ifscCode: string | null;
}

interface Refund {
  isRequired: boolean;

  provider: "razorpay" | "upi" | "bank_transfer" | "manual" | null;

  paymentId: string | null;
  refundId: string | null;

  amount: number;

  status: "not_required" | "pending" | "processing" | "processed" | "failed";

  refundedAt: string | null;

  bankDetails: BankDetails;
}

interface OrderTracking {
  status: string | null;
  shiprocketOrderId: string | null;
  shiprocketShipmentId: string | null;
  trackingNumber: string | null;
  deliveredAt: string | null;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profile: string | null;
}

interface OrderRequest {
  _id: string;

  orderId: string;
  orderNumber: string;

  userId: string;
  user: User;

  type: "cancel" | "return" | "rto";

  initiatedBy: "customer" | "admin" | "courier" | "system";

  reason: string | null;

  status: "requested" | "approved" | "rejected" | "processing" | "completed";

  refund: Refund;

  order?: OrderTracking;

  completedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

// =====================================================
// LABELS
// =====================================================

const requestStatusLabels: Record<string, string> = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  processing: "Processing",
  completed: "Completed",
};

const refundStatusLabels: Record<string, string> = {
  not_required: "Not Required",
  pending: "Pending",
  processing: "Processing",
  processed: "Processed",
  failed: "Failed",
};

const typeLabels: Record<string, string> = {
  cancel: "Cancel",
  return: "Return",
  rto: "RTO",
};

// =====================================================
// REQUEST STATUS COLORS
// =====================================================

const getRequestStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";

    case "approved":
    case "processing":
      return "bg-blue-100 text-blue-700";

    case "requested":
      return "bg-orange-100 text-orange-700";

    case "rejected":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// =====================================================
// REFUND STATUS COLORS
// =====================================================

const getRefundStatusColor = (status: string) => {
  switch (status) {
    case "processed":
      return "bg-green-100 text-green-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    case "pending":
      return "bg-orange-100 text-orange-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "not_required":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// =====================================================
// ORDER TRACKING STATUS COLORS
// =====================================================

const getOrderTrackingStatusColor = (status?: string | null) => {
  if (!status) {
    return "bg-gray-100 text-gray-600";
  }

  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700";

    case "return pending":
    case "return_pending":
      return "bg-orange-100 text-orange-700";

    case "out_for_delivery":
    case "out for delivery":
      return "bg-blue-100 text-blue-700";

    case "shipped":
      return "bg-blue-100 text-blue-700";

    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-700";

    case "processing":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// =====================================================
// DATE FORMAT
// =====================================================

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// =====================================================
// BANK DETAILS CHECK
// =====================================================

const hasBankDetails = (bankDetails?: BankDetails | null) => {
  if (!bankDetails) return false;

  return Boolean(
    bankDetails.holderName || bankDetails.accountNumber || bankDetails.ifscCode,
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

const AdminCancelledOrders = () => {
  const [cancelledOrders, setCancelledOrders] = useState<OrderRequest[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<OrderRequest | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [activeStatus, setActiveStatus] = useState<string>("all");

  const [activeType, setActiveType] = useState<string>("all");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // FETCH CANCELLED / RETURN / RTO ORDERS
  // =====================================================

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    try {
      setLoading(true);

      const response = await apiRequest("/admin/api/v1/order/canceled", "GET");

      if (response?.success) {
        setCancelledOrders(response.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch cancelled orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return cancelledOrders.filter((request) => {
      // STATUS
      const matchesStatus =
        activeStatus === "all" || request.status === activeStatus;

      if (!matchesStatus) {
        return false;
      }

      // TYPE
      const matchesType = activeType === "all" || request.type === activeType;

      if (!matchesType) {
        return false;
      }

      // SEARCH
      if (!search) {
        return true;
      }

      const orderId = request.orderId?.toLowerCase() || "";

      const orderNumber = request.orderNumber?.toLowerCase() || "";

      const requestId = request._id?.toLowerCase() || "";

      const userId = request.userId?.toLowerCase() || "";

      const userName = request.user?.name?.toLowerCase() || "";

      const userEmail = request.user?.email?.toLowerCase() || "";

      const userPhone = request.user?.phone?.toLowerCase() || "";

      const reason = request.reason?.toLowerCase() || "";

      const initiatedBy = request.initiatedBy?.toLowerCase() || "";

      const refundId = request.refund?.refundId?.toLowerCase() || "";

      const paymentId = request.refund?.paymentId?.toLowerCase() || "";

      const provider = request.refund?.provider?.toLowerCase() || "";

      const type = request.type?.toLowerCase() || "";

      const trackingNumber = request.order?.trackingNumber?.toLowerCase() || "";

      const shiprocketOrderId =
        request.order?.shiprocketOrderId?.toLowerCase() || "";

      const shiprocketShipmentId =
        request.order?.shiprocketShipmentId?.toLowerCase() || "";

      const orderStatus = request.order?.status?.toLowerCase() || "";

      return (
        orderId.includes(search) ||
        orderNumber.includes(search) ||
        requestId.includes(search) ||
        userId.includes(search) ||
        userName.includes(search) ||
        userEmail.includes(search) ||
        userPhone.includes(search) ||
        reason.includes(search) ||
        initiatedBy.includes(search) ||
        refundId.includes(search) ||
        paymentId.includes(search) ||
        provider.includes(search) ||
        type.includes(search) ||
        trackingNumber.includes(search) ||
        shiprocketOrderId.includes(search) ||
        shiprocketShipmentId.includes(search) ||
        orderStatus.includes(search)
      );
    });
  }, [cancelledOrders, searchTerm, activeStatus, activeType]);

  // =====================================================
  // STATUS COUNT
  // =====================================================

  const getStatusCount = (status: string) => {
    if (status === "all") {
      return cancelledOrders.length;
    }

    return cancelledOrders.filter((item) => item.status === status).length;
  };

  // =====================================================
  // TYPE COUNT
  // =====================================================

  const getTypeCount = (type: string) => {
    if (type === "all") {
      return cancelledOrders.length;
    }

    return cancelledOrders.filter((item) => item.type === type).length;
  };

  // =====================================================
  // PRINT BANK DETAILS
  // =====================================================

  const printBankDetails = (request: OrderRequest) => {
    const bank = request.refund?.bankDetails;
console.log(request)

    
  };

  // =====================================================
  // DETAIL VIEW
  // =====================================================

  if (selectedRequest) {
    const request = selectedRequest;

    const isReturnOrRto = request.type === "return" || request.type === "rto";

    const showBankDetails =
      request.refund?.provider === "manual" &&
      hasBankDetails(request.refund?.bankDetails);

    return (
      <div className="space-y-6">
        {/* =====================================================
                    HEADER
                ===================================================== */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedRequest(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <IoChevronBackOutline size={22} />
            </button>

            <div>
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {request.type === "cancel"
                  ? "Cancelled Order"
                  : request.type === "return"
                    ? "Return Request"
                    : "RTO Request"}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Order Number:{" "}
                <span className="font-semibold text-brand">
                  {request.orderNumber}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {typeLabels[request.type]}
            </span>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getRequestStatusColor(
                request.status,
              )}`}
            >
              {requestStatusLabels[request.status] || request.status}
            </span>
          </div>
        </div>

        {/* =====================================================
                    MAIN GRID
                ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* =================================================
                        LEFT
                    ================================================= */}

          <div className="lg:col-span-2 space-y-6">
            {/* =================================================
                            REQUEST INFORMATION
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <IoCloseOutline size={20} className="text-red-600" />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Request Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* ORDER NUMBER */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Order Number
                  </p>

                  <p className="text-sm font-semibold text-brand mt-1 break-all">
                    {request.orderNumber}
                  </p>
                </div>

                {/* ORDER ID */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Order ID
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                    {request.orderId}
                  </p>
                </div>

                {/* TYPE */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Type
                  </p>

                  <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
                    {typeLabels[request.type] || request.type}
                  </p>
                </div>

                {/* INITIATED BY */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Initiated By
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <IoPersonOutline size={16} className="text-gray-400" />

                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {request.initiatedBy}
                    </p>
                  </div>
                </div>

                {/* REQUEST DATE */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Request Date
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(request.createdAt)}
                  </p>
                </div>

                {/* REASON */}

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Reason
                  </p>

                  <div className="mt-2 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <p className="text-sm text-gray-700">
                      {request.reason || "No reason provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                            ORDER DETAILS - RETURN + RTO
                        ================================================= */}

            {isReturnOrRto && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                    <IoCubeOutline size={20} className="text-purple-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Details
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {request.type === "rto"
                        ? "RTO order and shipment information"
                        : "Return order and shipment information"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* ORDER ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Order ID
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                      {request.orderId || "-"}
                    </p>
                  </div>

                  {/* ORDER NUMBER */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Order Number
                    </p>

                    <p className="text-sm font-semibold text-brand mt-1">
                      {request.orderNumber || "-"}
                    </p>
                  </div>

                  {/* ORDER STATUS */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Order Status
                    </p>

                    <div className="mt-1">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getOrderTrackingStatusColor(
                          request.order?.status,
                        )}`}
                      >
                        {request.order?.status || "-"}
                      </span>
                    </div>
                  </div>

                  {/* TRACKING NUMBER */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Tracking Number
                    </p>

                    <p className="text-sm font-semibold text-brand mt-1 break-all">
                      {request.order?.trackingNumber || "-"}
                    </p>
                  </div>

                  {/* SHIPROCKET ORDER ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Shiprocket Order ID
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                      {request.order?.shiprocketOrderId || "-"}
                    </p>
                  </div>

                  {/* SHIPROCKET SHIPMENT ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Shiprocket Shipment ID
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                      {request.order?.shiprocketShipmentId || "-"}
                    </p>
                  </div>

                  {/* DELIVERED AT */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Delivered At
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(request.order?.deliveredAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                            REQUEST STATUS
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Request Status
              </h2>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {["requested", "approved", "processing", "completed"].map(
                  (status, index) => {
                    const flowIndex = [
                      "requested",
                      "approved",
                      "processing",
                      "completed",
                    ].indexOf(request.status);

                    const currentIndex = flowIndex;

                    const isPast = index < currentIndex;

                    const isCurrent = status === request.status;

                    return (
                      <React.Fragment key={status}>
                        {index > 0 && (
                          <div
                            className={`h-0.5 w-8 flex-shrink-0 ${
                              index <= currentIndex ? "bg-brand" : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            isCurrent
                              ? "bg-brand text-white"
                              : isPast
                                ? "bg-brand/10 text-brand"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isPast && <IoCheckmarkCircleOutline size={14} />}

                          {requestStatusLabels[status]}
                        </div>
                      </React.Fragment>
                    );
                  },
                )}

                {request.status === "rejected" && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-red-100 text-red-700">
                    <IoCloseOutline size={14} />
                    Rejected
                  </div>
                )}
              </div>

              {request.completedAt && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-semibold">
                    Completed At
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(request.completedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                            REFUND INFORMATION
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <IoCardOutline size={19} className="text-blue-600" />
                  </div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Refund Information
                  </h2>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRefundStatusColor(
                    request.refund?.status,
                  )}`}
                >
                  {refundStatusLabels[request.refund?.status]}
                </span>
              </div>

              {!request.refund?.isRequired ? (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <IoInformationCircleOutline
                      size={20}
                      className="text-gray-400 mt-0.5"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Refund not required
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        No refund is required for this request.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* AMOUNT */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Refund Amount
                    </p>

                    <p className="text-xl font-bold text-brand mt-1">
                      ₹{Number(request.refund.amount || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* PROVIDER */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Provider
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1 uppercase">
                      {request.refund.provider || "-"}
                    </p>
                  </div>

                  {/* PAYMENT ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Payment ID
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                      {request.refund.paymentId || "-"}
                    </p>
                  </div>

                  {/* REFUND ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Refund ID
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                      {request.refund.refundId || "-"}
                    </p>
                  </div>

                  {/* REFUND STATUS */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Refund Status
                    </p>

                    <span
                      className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getRefundStatusColor(
                        request.refund.status,
                      )}`}
                    >
                      {refundStatusLabels[request.refund.status]}
                    </span>
                  </div>

                  {/* REFUNDED AT */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Refunded At
                    </p>

                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatDate(request.refund.refundedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                            BANK DETAILS
                        ================================================= */}

            {showBankDetails && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                      <IoBusinessOutline size={19} className="text-green-600" />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Bank Details
                      </h2>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Manual refund bank account
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => printBankDetails(request)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
                  >
                    Pay now
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* HOLDER */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Account Holder
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {request.refund.bankDetails?.holderName || "-"}
                    </p>
                  </div>

                  {/* ACCOUNT NUMBER */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Account Number
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1 break-all">
                      {request.refund.bankDetails?.accountNumber || "-"}
                    </p>
                  </div>

                  {/* IFSC */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      IFSC Code
                    </p>

                    <p className="text-sm font-semibold text-gray-900 mt-1 uppercase">
                      {request.refund.bankDetails?.ifscCode || "-"}
                    </p>
                  </div>

                  {/* ORDER ID */}

                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase">
                      Order ID
                    </p>

                    <p className="text-sm font-semibold text-brand mt-1 break-all">
                      {request.orderId}
                    </p>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-xs text-yellow-700">
                    This bank account is used for manual refund processing.
                    Verify the account details before transferring the refund
                    amount.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* =====================================================
                        RIGHT SIDEBAR
                    ===================================================== */}

          <div className="space-y-6">
            {/* =================================================
                            REQUEST SUMMARY
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Request Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Order Number</span>

                  <span className="text-sm font-semibold text-brand text-right">
                    {request.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Type</span>

                  <span className="text-sm font-semibold text-gray-900">
                    {typeLabels[request.type]}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Initiated By</span>

                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {request.initiatedBy}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Status</span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRequestStatusColor(
                      request.status,
                    )}`}
                  >
                    {requestStatusLabels[request.status]}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Refund</span>

                  <span className="text-sm font-bold text-gray-900">
                    {request.refund?.isRequired
                      ? `₹${Number(request.refund.amount || 0).toFixed(2)}`
                      : "Not Required"}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                            CUSTOMER
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Customer</h2>

              <div className="space-y-4">
                {/* PROFILE */}

                <div className="flex items-center gap-3">
                  {request.user?.profile ? (
                    <img
                      src={request.user.profile}
                      alt={request.user.name}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center">
                      <IoPersonOutline size={26} className="text-brand" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-base font-bold text-gray-900">
                      {request.user?.name || "-"}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {request.user?.email || "-"}
                    </p>
                  </div>
                </div>

                {/* USER ID */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    User ID
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                    {request.userId}
                  </p>
                </div>

                {/* EMAIL */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Email
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1 break-all">
                    {request.user?.email || "-"}
                  </p>
                </div>

                {/* PHONE */}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {request.user?.phone || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                            TIMELINE
                        ================================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Timeline</h2>

              <div className="space-y-5">
                {/* REQUESTED */}

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <IoTimeOutline size={16} className="text-orange-600" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {request.type === "cancel"
                        ? "Cancellation Requested"
                        : request.type === "return"
                          ? "Return Requested"
                          : "RTO Requested"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>

                {/* COMPLETED */}

                {request.completedAt && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <IoCheckmarkCircleOutline
                        size={16}
                        className="text-green-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Request Completed
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(request.completedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* REJECTED */}

                {request.status === "rejected" && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <IoCloseOutline size={16} className="text-red-600" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Request Rejected
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Request was rejected.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // STATUS TABS
  // =====================================================

  const tabs = [
    {
      value: "all",
      label: "All",
    },

    {
      value: "processing",
      label: "Processing",
    },
    {
      value: "completed",
      label: "Completed",
    },
    {
      value: "rejected",
      label: "Rejected",
    },
  ];

  // =====================================================
  // TYPE OPTIONS
  // =====================================================

  const typeOptions = [
    {
      value: "all",
      label: "All Types",
    },
    {
      value: "cancel",
      label: "Cancel",
    },
    {
      value: "return",
      label: "Return",
    },
    {
      value: "rto",
      label: "RTO",
    },
  ];

  // =====================================================
  // MAIN LIST
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
                PAGE HEADER
            ================================================= */}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Cancelled Orders
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage cancelled, return and RTO requests.
          </p>
        </div>

        <div className="px-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm">
          <p className="text-xs text-gray-400">Total Requests</p>

          <p className="text-lg font-bold text-gray-900">
            {cancelledOrders.length}
          </p>
        </div>
      </div>

      {/* =================================================
                MAIN CONTAINER
            ================================================= */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* =================================================
                    STATUS TABS
                ================================================= */}

        <div className="flex gap-2 overflow-x-auto px-4 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveStatus(tab.value)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${
                activeStatus === tab.value
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}

              <span className="ml-1.5 text-xs text-gray-400">
                ({getStatusCount(tab.value)})
              </span>
            </button>
          ))}
        </div>

        {/* =================================================
                    SEARCH + TYPE
                ================================================= */}

        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* SEARCH */}

            <div className="relative w-full sm:w-96">
              <IoSearchOutline
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search order, customer, tracking..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <IoCloseOutline size={18} />
                </button>
              )}
            </div>

            {/* TYPE */}

            <div className="relative w-full sm:w-44">
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand cursor-pointer"
              >
                {typeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({getTypeCount(type.value)})
                  </option>
                ))}
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* RESULT COUNT */}

          <div className="text-sm text-gray-500 whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredOrders.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {getStatusCount(activeStatus)}
            </span>{" "}
            requests
          </div>
        </div>

        {/* =================================================
                    ACTIVE TYPE FILTER
                ================================================= */}

        {activeType !== "all" && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Type:</span>

              <span className="px-2.5 py-1 bg-brand/10 text-brand rounded-full text-xs font-semibold">
                {typeLabels[activeType]}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveType("all")}
              className="text-xs text-brand font-semibold hover:underline"
            >
              Clear type
            </button>
          </div>
        )}

        {/* =================================================
                    TABLE
                ================================================= */}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Order Number</th>

                <th className="px-6 py-4">Type</th>

                <th className="px-6 py-4">Date</th>

                <th className="px-6 py-4">Initiated By</th>

                <th className="px-6 py-4">Reason</th>

                <th className="px-6 py-4">Refund</th>

                <th className="px-6 py-4">Refund Status</th>

                <th className="px-6 py-4">Request Status</th>

                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-3" />

                      <p className="text-sm text-gray-500">
                        Loading cancelled orders...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* ORDER */}

                    <td className="px-6 py-4">
                      <p className="font-semibold text-brand">
                        {request.orderNumber}
                      </p>
                    </td>

                    {/* TYPE */}

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {typeLabels[request.type]}
                      </span>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(request.createdAt)}
                    </td>

                    {/* INITIATED */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                          <IoPersonOutline
                            size={14}
                            className="text-gray-500"
                          />
                        </div>

                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {request.initiatedBy}
                        </span>
                      </div>
                    </td>

                    {/* REASON */}

                    <td className="px-6 py-4 max-w-[220px]">
                      <p
                        className="text-gray-600 truncate"
                        title={request.reason || ""}
                      >
                        {request.reason || "No reason provided"}
                      </p>
                    </td>

                    {/* REFUND */}
                    <td className="px-6 py-4">
                      {request.refund?.isRequired ? (
                        <div>
                          <p className="font-semibold text-gray-900">
                            ₹ {Number(request.refund.amount || 0).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 uppercase mt-0.5">
                            {request.refund.provider || "-"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not Required
                        </span>
                      )}
                    </td>

                    {/* REFUND STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRefundStatusColor(
                          request.refund?.status,
                        )}`}
                      >
                        {refundStatusLabels[request.refund?.status]}
                      </span>
                    </td>

                    {/* REQUEST STATUS */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRequestStatusColor(
                          request.status,
                        )}`}
                      >
                        {requestStatusLabels[request.status]}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="text-brand text-sm font-semibold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {/* EMPTY */}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <IoSearchOutline
                        size={40}
                        className="text-gray-300 mb-3"
                      />
                      <p className="text-gray-500 font-medium">
                        {searchTerm || activeType !== "all"
                          ? "No requests found for your filters."
                          : "No cancelled orders found."}
                      </p>
                      {(searchTerm || activeType !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setActiveType("all");
                          }}
                          className="mt-2 text-sm text-brand font-semibold hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCancelledOrders;
