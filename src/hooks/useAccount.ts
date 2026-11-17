/**
 * Account-area logic, lifted from the old UI:
 *   useWishlistPage   ← pages/Wishlist.tsx
 *   useProfile        ← pages/Account.tsx   (alert() → toast)
 *   useOrders         ← pages/Orders.tsx    (Orders component)
 *   useOrderActions   ← pages/Orders.tsx    (OrderCard: cancel / return / review)
 * API endpoints, payloads and validation are unchanged. Removed: the old UI's
 * console.log of the return payload, which printed customers' bank details.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { products, type Product } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { userapiRequest } from "../services/apiService";

/* ── Wishlist ──────────────────────────────────────────────── */

export function useWishlistPage() {
  const { items, toggle, count } = useWishlist();
  const { addItem } = useCart();
  const ids = items.map((i) => String(i.productId));
  const list = products.filter((p) => ids.includes(String(p.id)));

  // old handleMoveToCart: add with first size/colour, then remove from wishlist
  const moveToCart = async (p: Product) => {
    await addItem({
      shipping: false,
      productId: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image,
      price: p.price,
      originalPrice: p.originalPrice,
      size: p.sizes[0],
      color: p.colors[0]?.name || "",
    });
    await toggle(p.id);
  };

  return { products: list, count, moveToCart, remove: (p: Product) => toggle(p.id) };
}

/* ── Profile ───────────────────────────────────────────────── */

export function useProfile() {
  const { user, updateProfile, logout } = useAuth();
  const { clear } = useWishlist();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const blank = { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  }, [user]);

  const pickImage = (file?: File) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setEditing(true);
  };

  const cancel = () => {
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
    setImage(null);
    setPreview(null);
    setEditing(false);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Please enter your name");
    if (!form.email.trim()) return toast.error("Please enter your email");

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    if (form.phone.trim()) data.append("phone", form.phone.trim());
    if (image) data.append("profile", image);

    setSaving(true);
    try {
      await updateProfile(data);
      setEditing(false);
      setImage(null);
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // old handleLogout
  const signOut = () => {
    logout();
    clear();
    clearCart();
    navigate("/");
  };

  return {
    user,
    form,
    setField: (k: keyof typeof blank, v: string) => setForm((f) => ({ ...f, [k]: v })),
    editing,
    setEditing,
    saving,
    preview,
    pickImage,
    cancel,
    save,
    signOut,
  };
}

/* ── Orders ────────────────────────────────────────────────── */

export interface OrderItem {
  productId: string;
  variantId?: string;
  sku?: string;
  size?: string;
  color?: string;
  quantity: number;
  image: string;
  price: number;
  total: number;
  _id: string;
}

export interface ApiOrder {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalAmount: number;
  status: string;
  shippingAddress: { addressline: string; landmark?: string; city: string; state: string; postalCode: string };
  payment: { orderId: string; paymentId: string; method: string; status: string };
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  deliveredAt?: string;
  createdAt: string;
}

export type DisplayStatus = "Processing" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

/** old getDisplayStatus */
export const displayStatus = (status: string): DisplayStatus => {
  switch (status) {
    case "shipped":
      return "Shipped";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return "Processing"; // pending / accepted / processing / unknown
  }
};

export const ORDER_TABS = ["All", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"] as const;

/** Order items carry no name; look it up from the catalogue, fall back to SKU. */
export const itemName = (item: OrderItem) =>
  products.find((p) => p.id === String(item.productId))?.name || item.sku || "Product";

export function useOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<(typeof ORDER_TABS)[number]>("All");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response: any = await userapiRequest("/user/api/v1/orders/get", "GET");
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        toast.error(response.message);
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: orders.length };
    orders.forEach((o) => {
      const s = displayStatus(o.status);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [orders]);

  const filtered = useMemo(
    () => (tab === "All" ? orders : orders.filter((o) => displayStatus(o.status) === tab)),
    [orders, tab],
  );

  return { orders: filtered, all: orders, counts, loading, error, tab, setTab, refetch: fetchOrders };
}

/* ── Order actions (old OrderCard) ──────────────────────────── */

export const CANCEL_REASONS = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "ordered_by_mistake", label: "Ordered by mistake" },
  { value: "found_better_price", label: "Found a better price" },
  { value: "delivery_too_long", label: "Delivery is taking too long" },
  { value: "other", label: "Other" },
];

export const RETURN_REASONS = [
  { value: "size_issue", label: "Size issue" },
  { value: "color_issue", label: "Color issue" },
  { value: "damaged", label: "Product damaged" },
  { value: "wrong_product", label: "Wrong product received" },
  { value: "quality_issue", label: "Quality issue" },
  { value: "not_as_expected", label: "Not as expected" },
  { value: "other", label: "Other" },
];

export interface BankDetails {
  holderName: string;
  accountNumber: string;
  ifscCode: string;
}

const emptyBank: BankDetails = { holderName: "", accountNumber: "", ifscCode: "" };

export function useOrderActions(order: ApiOrder, onUpdated: () => void) {
  const [modal, setModal] = useState<"cancel" | "return" | null>(null);
  const [reason, setReason] = useState("");
  const [bank, setBank] = useState<BankDetails>(emptyBank);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState({ rating: 5, review: "" });
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const status = displayStatus(order.status);
  const isCodPaid = order.payment?.method?.toLowerCase() === "cod" && order.payment?.status?.toLowerCase() === "paid";

  const open = (kind: "cancel" | "return") => {
    setReason("");
    setBank(emptyBank);
    setModal(kind);
  };
  const reset = () => {
    setModal(null);
    setReason("");
    setBank(emptyBank);
  };
  // user-initiated close is blocked mid-request; success paths call reset() directly
  const close = () => {
    if (!busy) reset();
  };

  const submitCancel = async () => {
    if (!reason) return toast.error("Please select a cancellation reason");
    try {
      setBusy(true);
      const response: any = await userapiRequest("/user/api/v1/orders/cancelle", "POST", { orderId: order._id, reason });
      if (response?.success === false) throw new Error(response?.message || "Failed to cancel order");
      toast.success(response?.message || "Order cancelled successfully");
      reset();
      onUpdated();
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setBusy(false);
    }
  };

  const submitReturn = async () => {
    if (!reason) return toast.error("Please select a return reason");
    if (isCodPaid) {
      if (!bank.holderName.trim()) return toast.error("Please enter account holder name");
      if (!bank.accountNumber.trim()) return toast.error("Please enter account number");
      if (!bank.ifscCode.trim()) return toast.error("Please enter IFSC code");
      if (!/^[0-9]{6,20}$/.test(bank.accountNumber.trim())) return toast.error("Please enter a valid account number");
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bank.ifscCode.trim().toUpperCase()))
        return toast.error("Please enter a valid IFSC code");
    }
    try {
      setBusy(true);
      const payload: { orderId: string; reason: string; bankDetails?: BankDetails } = { orderId: order._id, reason };
      if (isCodPaid) {
        payload.bankDetails = {
          holderName: bank.holderName.trim(),
          accountNumber: bank.accountNumber.trim(),
          ifscCode: bank.ifscCode.trim().toUpperCase(),
        };
      }
      const response: any = await userapiRequest("/user/api/v1/orders/return", "POST", payload);
      if (response?.success === false) throw new Error(response?.message || "Failed to submit return request");
      toast.success(response?.message || "Return request submitted successfully");
      reset();
      onUpdated();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit return request");
    } finally {
      setBusy(false);
    }
  };

  const submitReview = async () => {
    try {
      setReviewBusy(true);
      await userapiRequest("/user/api/v1/product/review/create", "POST", {
        orderId: order._id,
        productIds: [...new Set(order.items.map((i) => i.productId))],
        rating: review.rating,
        review: review.review,
      });
      setReviewSubmitted(true);
      toast.success("Review submitted successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit review");
    } finally {
      setReviewBusy(false);
    }
  };

  const canSubmit =
    !!reason &&
    !busy &&
    !(modal === "return" && isCodPaid && (!bank.holderName.trim() || !bank.accountNumber.trim() || !bank.ifscCode.trim()));

  return {
    status,
    isCodPaid,
    canCancel: status === "Processing",
    canReturn: status === "Delivered",
    canReview: status === "Delivered",
    modal,
    open,
    close,
    reason,
    setReason,
    bank,
    setBank: (k: keyof BankDetails, v: string) => setBank((b) => ({ ...b, [k]: v })),
    busy,
    canSubmit,
    submit: () => (modal === "cancel" ? submitCancel() : submitReturn()),
    review,
    setReview,
    reviewBusy,
    reviewSubmitted,
    submitReview,
  };
}
