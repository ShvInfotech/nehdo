/**
 * Auth form logic, lifted from the old UI AuthModal (same calls, same order):
 * FCM device token → login/signup → refresh wishlist + cart → redirect.
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { userapiRequest } from "../services/apiService";
import { auth, googleProvider, getDeviceToken } from "../services/firebase";

// Device token comes from services/firebase (shared with old AuthModal / admin).

export type AuthView = "login" | "signup" | "forgot";

export function useAuthFlow() {
  const { authModalMode, openAuthModal, closeAuthModal, login, signup } = useAuth() as any;
  const { refreshWishlist } = useWishlist();
  const { refreshCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState<null | "form" | "google" | "forgot">(null);

  const view: AuthView = forgot ? "forgot" : authModalMode === "signup" ? "signup" : "login";

  const afterAuth = async () => {
    await refreshWishlist();
    await refreshCart();
    if (location.pathname !== "/cart" && location.pathname !== "/checkout") navigate("/account");
  };

  const submit = async (values: { name: string; email: string; password: string }) => {
    setBusy("form");
    try {
      const deviceToken: any = await getDeviceToken();
      const res =
        view === "signup"
          ? await signup(values.name, values.email, values.password, deviceToken)
          : await login(values.email, values.password, deviceToken);
      if (res) {
        if (res.message) toast.success(res.message);
        await afterAuth();
        return true;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
    return false;
  };

  const googleLogin = async () => {
    setBusy("google");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const GoogleIdToken = await result.user.getIdToken();
      const deviceToken: any = await getDeviceToken();
      const res = await login("", "", deviceToken, GoogleIdToken, "google");
      if (res) await afterAuth();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  const sendReset = async (email: string) => {
    setBusy("forgot");
    try {
      const res: any = await userapiRequest("/user/api/v1/auth/forgot-password", "POST", { email });
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  return {
    open: !!authModalMode,
    view,
    busy,
    close: () => {
      setForgot(false);
      closeAuthModal();
    },
    switchTo: (next: AuthView) => {
      setForgot(next === "forgot");
      if (next !== "forgot") openAuthModal(next);
    },
    submit,
    googleLogin,
    sendReset,
  };
}
