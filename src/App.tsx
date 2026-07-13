import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Account = lazy(() => import('./pages/Account'));
const Orders = lazy(() => import('./pages/Orders'));
const Search = lazy(() => import('./pages/Search'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Returns = lazy(() => import('./pages/Returns'));
const Shipping = lazy(() => import('./pages/Shipping'));
const Brands = lazy(() => import('./pages/Brands'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminProtectedRoute = lazy(() => import('./components/AdminProtectedRoute'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminShipping = lazy(() => import('./pages/admin/AdminShipping'));
const AdminPayment = lazy(() => import('./pages/admin/AdminPayment'));
const AdminTax = lazy(() => import('./pages/admin/AdminTax'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-sm text-muted font-medium">Loading...</p>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter basename="/nehdo">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/collection/:slug" element={<Collection />} />
                        <Route path="/brands" element={<Collection />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/returns" element={<Returns />} />
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/contact" element={<Contact />} />
                    </Route>

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
                            <Route path="*" element={<div className="p-8 text-xl font-bold text-gray-400">Admin Page Under Construction</div>} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;