import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { loadProducts } from "./data/products";
import { FaWhatsapp } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storefrontRoutes } from "./routes";
import { SUPPORT_WHATSAPP } from "./config";

/**
 * Floating WhatsApp chat for shoppers. Desktop only (lg+): on phones it would
 * cover products and prices, so the header shows a WhatsApp icon instead.
 * Never shown inside the admin panel.
 */
const WhatsAppFab = () => {
  const { pathname } = useLocation();
  if (pathname.toLowerCase().startsWith("/admin")) return null;
  return (
    <a
      href={`https://wa.me/${SUPPORT_WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] hidden h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-green-600 lg:flex"
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
};

const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminProtectedRoute = lazy(
  () => import("./components/AdminProtectedRoute"),
);
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminBrands = lazy(() => import("./pages/admin/AdminBrands"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminCancelledOrders = lazy(
  () => import("./pages/admin/AdminCancelledOrders"),
);
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminInventory = lazy(() => import("./pages/admin/AdminInventory"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminCMS = lazy(() => import("./pages/admin/AdminCMS"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminShipping = lazy(() => import("./pages/admin/AdminShipping"));
const AdminPayment = lazy(() => import("./pages/admin/AdminPayment"));
const AdminTax = lazy(() => import("./pages/admin/AdminTax"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-3 border-brand/20 border-t-brand rounded-full animate-spin" />
      <p className="text-sm text-muted font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      await loadProducts();
      setProductsLoaded(true);
    };

    fetchProducts();
  }, []);

  if (!productsLoaded) {
    return <PageLoader />;
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Storefront (shop, product, cart, account, info pages) */}
          {storefrontRoutes}

          {/* Admin Login (No Layout, No Protection) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes — Protected */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="canceledorders" element={<AdminCancelledOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="cms" element={<AdminCMS />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="shipping" element={<AdminShipping />} />
              <Route path="payment" element={<AdminPayment />} />
              <Route path="tax" element={<AdminTax />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Catch-all for undefined admin routes */}
              <Route
                path="*"
                element={
                  <div className="p-8 text-xl font-bold text-gray-400">
                    Admin Page Under Construction
                  </div>
                }
              />
            </Route>
          </Route>
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <WhatsAppFab />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
