/**
 * Checkout logic. Payment code is kept verbatim from the original pages — do not
 * "improve" it here without testing a real Razorpay order end to end.
 *
 *  useCartCheckout  ← old pages/Cart.tsx (uses utils/magicCheckout.ts)
 *  useCheckoutPage  ← old pages/Checkout.tsx (its own inline Razorpay flow,
 *                     sends discount/shipping from sessionStorage, auto-launches)
 *  useLastOrder     ← old pages/OrderConfirmation.tsx (minus the made-up number)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { triggerMagicCheckout } from "../utils/magicCheckout";
import { userapiRequest } from "../services/apiService";

/* ── Cart → Magic Checkout (old Cart.tsx) ───────────────────── */

export function useCartCheckout() {
  const { items, clearCart } = useCart();
  const { user, setSession } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("appliedCoupon");
    sessionStorage.removeItem("shippingCharge");
  }, []);

  const checkout = useCallback(() => {
    setCheckingOut(true);
    triggerMagicCheckout({
      items,
      user,
      onSuccess: (res) => {
        setCheckingOut(false);
        if (res.accessToken && res.user) {
          setSession(res.user, res.accessToken);
        }
        clearCart();
        sessionStorage.removeItem("appliedCoupon");
        sessionStorage.removeItem("shippingCharge");
        toast.success("Order placed successfully!");
        navigate("/order-confirmation");
      },
      onError: () => {
        setCheckingOut(false);
      },
      onClose: () => {
        setCheckingOut(false);
      },
    });
  }, [items, user, setSession, clearCart, navigate]);

  return { checkout, checkingOut };
}

/** Per-line pending state around the context's async cart mutations. */
export function useCartLines() {
  const { updateQuantity, removeItem } = useCart();
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const wrap = (id: string, fn: () => Promise<void>) => async () => {
    setPending((p) => ({ ...p, [id]: true }));
    try {
      await fn();
    } finally {
      setPending((p) => ({ ...p, [id]: false }));
    }
  };
  return {
    pending,
    setQty: (id: string, qty: number) => wrap(id, () => updateQuantity(id, qty))(),
    remove: (id: string) => wrap(id, () => removeItem(id))(),
  };
}

/* ── /checkout page (old Checkout.tsx, verbatim flow) ───────── */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpay = (): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.errors === "string") return data.errors;
  }
  if (typeof error?.message === "string") return error.message;
  if (typeof error === "string") return error;
  return "Failed to complete checkout. Please try again.";
};

export function useCheckoutPage() {
  const { items, subtotal, shipping, clearCart, setShippingCharge } = useCart();
  const { user, setSession } = useAuth();
  const navigate = useNavigate();

  const [discount, setDiscount] = useState<number>(0);
  const [couponId, setCouponId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const autoLaunchTriggered = useRef<boolean>(false);

  useEffect(() => {
    const storedShipping = sessionStorage.getItem("shippingCharge");
    if (storedShipping !== null) {
      setShippingCharge(Number(storedShipping));
    }
    const storedCoupon = sessionStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      try {
        const parsed = JSON.parse(storedCoupon);
        if (parsed?.discount) setDiscount(Number(parsed.discount));
        if (parsed?.couponId) setCouponId(parsed.couponId);
      } catch (err) {
        console.error("Coupon parse error:", err);
      }
    }
  }, [setShippingCharge]);

  const handleRazorpayMagicCheckout = async () => {
    try {
      setErrorMessage("");
      setIsProcessing(true);

      if (!items.length) {
        toast.error("Cart is empty.");
        setIsProcessing(false);
        return;
      }

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const cartIds = items.map((item) => item._id).filter(Boolean);
      const itemsPayload = items.map((item) => ({
        productId: (item.productId as any)?._id || item.productId || item._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }));

      const result = await userapiRequest("/api/v1/magic-checkout/create-order", "POST", {
        cartIds,
        items: itemsPayload,
        discount,
        shippingcharge: shipping,
        couponId: couponId,
        magic: true,
        contact: user?.phone || "",
        email: user?.email || "",
        name: user?.name || "",
      });

      if (result?.success === false || !result?.order?.id) {
        toast.error(result?.message || "Unable to initiate Magic Checkout.");
        setIsProcessing(false);
        return;
      }

      // NOTE: old fallback key, kept as-is. The server normally returns `key`.
      const razorpayKey = result.key || result.key_id || "rzp_live_TlHEi6zwAq3CaX";

      const clientLineItems = (result?.line_items || []).map((li: any) => ({
        item_id: li.variant_id || li.sku,
        variant_id: li.variant_id || li.sku,
        name: li.name,
        amount: li.price,
        price: li.price,
        offer_price: li.offer_price || li.price,
        currency: "INR",
        quantity: li.quantity,
        sku: li.sku,
        image: li.image_url,
        image_url: li.image_url,
      }));

      const cleanPhone = user?.phone ? String(user.phone).replace(/\D/g, "").slice(-10) : "";
      const prefill: Record<string, string> = {};
      if (cleanPhone && cleanPhone.length === 10) prefill.contact = cleanPhone;
      if (user?.email && typeof user.email === "string" && user.email.includes("@")) prefill.email = user.email;
      if (user?.name && typeof user.name === "string" && user.name.trim()) prefill.name = user.name.trim();

      const options = {
        key: razorpayKey,
        amount: result.order.amount,
        currency: result.order.currency,
        order_id: result.order.id,
        name: "NEHDO",
        description: "1-Click Magic Checkout (Prepaid / COD)",
        image: `${window.location.origin}/logo.png`,
        one_click_checkout: true,
        show_coupons: true,
        line_items: clientLineItems,
        prefill,
        notes: {
          userId: user?._id || "",
          cartIds: cartIds.join(","),
          couponId: couponId || "",
          discount: String(discount || 0),
          shippingcharge: String(shipping || 0),
          contact: cleanPhone || "",
          phone: cleanPhone || "",
          email: user?.email || "",
          name: user?.name || "",
          magic_checkout: "true",
        },
        theme: { color: "#000000" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
        handler: async function (response: any) {
          try {
            setErrorMessage("");
            setIsProcessing(true);

            const isCod = Boolean(response?.method === "cod" || !response?.razorpay_signature);

            const completeRes = await userapiRequest("/api/v1/magic-checkout/verify-order", "POST", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id || (isCod ? `cod_${Date.now()}` : ""),
              razorpay_signature: response.razorpay_signature || "",
              isCod,
              method: isCod ? "cod" : "online",
              couponId: couponId,
              cartIds,
              items: itemsPayload,
              shipping,
              discount,
              contact: response?.contact || user?.phone || "",
              email: response?.email || user?.email || "",
              customer: {
                contact: response?.contact || user?.phone || "",
                email: response?.email || user?.email || "",
                name: response?.name || user?.name || "",
              },
            });

            if (completeRes?.success) {
              if (completeRes?.accessToken && completeRes?.user) {
                setSession(completeRes.user, completeRes.accessToken);
              }
              if (completeRes?.order?.orderNumber) {
                localStorage.setItem("orderId", completeRes.order.orderNumber);
              }
              toast.success(completeRes.message || "Order placed successfully!");
              clearCart();
              sessionStorage.removeItem("shippingCharge");
              sessionStorage.removeItem("appliedCoupon");
              setIsProcessing(false);
              navigate("/order-confirmation");
            } else {
              toast.error(completeRes?.message || "Order completion failed.");
              setIsProcessing(false);
            }
          } catch (error: any) {
            toast.error(getErrorMessage(error));
            setErrorMessage(getErrorMessage(error));
            setIsProcessing(false);
          }
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error(response?.error?.description || response?.error?.reason || "Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpay.open();
      setIsProcessing(false);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
      setErrorMessage(getErrorMessage(error));
      setIsProcessing(false);
    }
  };

  // the old UI: auto-launch Magic Checkout once if items exist
  useEffect(() => {
    if (!autoLaunchTriggered.current && items.length > 0) {
      autoLaunchTriggered.current = true;
      const timer = setTimeout(() => {
        handleRazorpayMagicCheckout();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return {
    items,
    subtotal,
    shipping,
    discount,
    finalTotal: Math.max(0, subtotal - discount + shipping),
    errorMessage,
    dismissError: () => setErrorMessage(""),
    isProcessing,
    pay: handleRazorpayMagicCheckout,
  };
}

/* ── Order confirmation ─────────────────────────────────────── */

/** The old page invented a random "ORD-2026-xxxx" when nothing was saved; now none is shown. */
export function useLastOrder() {
  let orderNumber: string | null = null;
  try {
    orderNumber = localStorage.getItem("orderId");
  } catch {
    /* storage blocked */
  }
  return { orderNumber };
}
