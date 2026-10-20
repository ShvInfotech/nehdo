import { userapiRequest } from "../services/apiService";
import { toast } from "react-toastify";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const loadRazorpayMagicScript = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
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
};

interface TriggerMagicCheckoutParams {
  items: any[];
  couponId?: string;
  user?: any;
  onSuccess: (data: any) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
}

export const triggerMagicCheckout = async ({
  items,
  couponId,
  user,
  onSuccess,
  onError,
  onClose
}: TriggerMagicCheckoutParams) => {
  try {
    if (!items || !items.length) {
      toast.error("Cart is empty");
      return;
    }

    const isLoaded = await loadRazorpayMagicScript();
    if (!isLoaded) {
      toast.error("Could not load Razorpay Magic Checkout");
      return;
    }

    const cartIds = items.map((item) => item._id).filter(Boolean);
    const itemsPayload = items.map((item) => ({
      productId: item.productId?._id || item.productId || item._id,
      size: item.size,
      color: item.color,
      quantity: Number(item.quantity || 1),
      price: item.price
    }));

    // 1. Create Magic Order on Server
    const createRes = await userapiRequest("/api/v1/magic-checkout/create-order", "POST", {
      cartIds,
      items: itemsPayload,
      couponId: couponId || "",
      contact: user?.phone || "",
      email: user?.email || "",
      name: user?.name || ""
    });

    if (!createRes?.success || !createRes?.order?.id) {
      toast.error(createRes?.message || "Unable to initiate Magic Checkout");
      if (onError) onError(createRes);
      return;
    }

    const order = createRes.order;
    const razorpayKey = createRes.key || "rzp_test_Tq3OqflGmz0kiC";

    const clientLineItems = (createRes?.line_items || []).map((li: any) => ({
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
      image_url: li.image_url
    }));

    // 2. Open Razorpay Magic Modal
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "NEHDO",
      description: "1-Click Magic Checkout",
      image: `${window.location.origin}/logo.png`,
      one_click_checkout: true,
      show_coupons: true,
      line_items: clientLineItems,
      prefill: {
        contact: user?.phone || "",
        email: user?.email || "",
        name: user?.name || ""
      },
      notes: {
        userId: user?._id || "",
        cartIds: cartIds.join(","),
        couponId: couponId || "",
        contact: user?.phone || "",
        phone: user?.phone || "",
        email: user?.email || "",
        name: user?.name || "",
        magic_checkout: "true"
      },
      theme: { color: "#000000" },
      modal: {
        ondismiss: function () {
          if (onClose) onClose();
        }
      },
      handler: async function (response: any) {
        try {
          const isCod = Boolean(response?.method === "cod" || !response?.razorpay_signature);

          // 3. Verify & Finalize Order
          const verifyRes = await userapiRequest("/api/v1/magic-checkout/verify-order", "POST", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id || (isCod ? `cod_${Date.now()}` : ""),
            razorpay_signature: response.razorpay_signature || "",
            isCod,
            method: isCod ? "cod" : "online",
            cartIds,
            items: itemsPayload,
            couponId,
            contact: response?.contact || user?.phone || "",
            email: response?.email || user?.email || "",
            customer: {
              contact: response?.contact || user?.phone || "",
              email: response?.email || user?.email || "",
              name: response?.name || user?.name || ""
            }
          });

          if (verifyRes?.success) {
            if (verifyRes.accessToken && verifyRes.user) {
              localStorage.setItem("accessToken", verifyRes.accessToken);
              localStorage.setItem("user", JSON.stringify(verifyRes.user));
            }
            if (verifyRes.order?.orderNumber) {
              localStorage.setItem("orderId", verifyRes.order.orderNumber);
            }
            onSuccess(verifyRes);
          } else {
            toast.error(verifyRes?.message || "Order verification failed");
            if (onError) onError(verifyRes);
          }
        } catch (vErr: any) {
          toast.error(vErr?.message || "Error verifying order");
          if (onError) onError(vErr);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast.error(response?.error?.description || "Payment failed");
      if (onError) onError(response?.error);
    });
    rzp.open();
  } catch (err: any) {
    toast.error(err?.message || "Something went wrong initiating Magic Checkout");
    if (onError) onError(err);
  }
};
