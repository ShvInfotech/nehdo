import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoStar, IoHeartOutline, IoHeart, IoRemoveOutline, IoAddOutline, IoArrowForward, IoShieldCheckmarkOutline, IoCarOutline, IoRefreshOutline } from "react-icons/io5";
import { getProductById, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Breadcrumb from "../components/Breadcrumb";
import ProductCard from "../components/ProductCard";
import { userapiRequest } from "../services/apiService";

const tabs = ["Description", "Reviews", "Shipping"];
interface Review {
    _id: string;
    rating: number;
    review: string;
    userName: string;
}
const ProductDetail = () => {
    const { id } = useParams();
    const product = getProductById(id || "");
    const { addItem } = useCart();
    const { toggle, has } = useWishlist();
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Description");
    const [mainImage, setMainImage] = useState(0);
    const [added, setAdded] = useState(false);


    const [reviews, setReviews] = useState<Review[]>([]);

    // Review form state
    const [reviewForm, setReviewForm] = useState({ rating: 5, name: "", title: "", text: "" });
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    if (!product) return <div className="max-w-[1440px] mx-auto px-4 py-20 text-center"><h2 className="font-heading text-2xl font-bold">Product not found</h2><Link to="/shop" className="text-brand mt-4 inline-block">Back to Shop</Link></div>;

    const inWishlist = has(product.id);
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    // const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;


    const selectedVariant = product.variants?.find(
        (v) => v.name === `${selectedColor}/${selectedSize}`
    );

    const displayPrice = selectedVariant?.price ?? product.price;

    // original/base price
    const originalPrice = product.originalPrice ?? product.price;

    const discount =
        originalPrice > displayPrice
            ? Math.round((1 - displayPrice / originalPrice) * 100)
            : null;
    const handleAddToCart = () => {
        addItem({ productId: product.id, name: product.name, brand: product.brand, image: product.image, price: product.price, originalPrice: product.originalPrice, size: selectedSize || product.sizes[0], color: selectedColor || product.colors[0]?.name || "", shipping: product.shipping ?? true });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setReviewSubmitted(true);
    };


    const getreview = async () => {
        const respons = await userapiRequest(`/user/api/v1/product/reviews/${product.id}`, "GET")
        setReviews(respons.reviews)

    }

    useEffect(() => {
        getreview()
    }, [])

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Shop", href: "/shop" }, { label: product.category, href: "/shop" }, { label: product.name }]} /></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-20">
                {/* Images */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[600px]">
                        {product.images.map((img, i) => (
                            <button key={i} onClick={() => setMainImage(i)} className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all ${mainImage === i ? "border-brand" : "border-transparent hover:border-gray-300"}`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 relative rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 aspect-[3/4] group">
                        <img src={product.images[mainImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {product.isNew && <span className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-full">NEW</span>}
                        {discount && <span className="absolute top-4 left-4 mt-8 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full">-{discount}%</span>}
                    </div>
                </motion.div>

                {/* Info */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                    <p className="text-sm text-muted font-medium uppercase tracking-wider mb-1">{product.brand}</p>
                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <IoStar key={i} size={16} className={i < Math.floor(product.rating) ? "text-gold" : "text-gray-200"} />)}</div>
                        <span className="text-sm font-semibold text-gray-900">{product.rating}</span>
                        <span className="text-sm text-muted">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="font-heading text-3xl font-bold text-accent">
                            ₹{displayPrice.toFixed(2)}
                        </span>

                        {originalPrice > displayPrice && (
                            <span className="text-lg text-muted line-through">
                                ₹{originalPrice.toFixed(2)}
                            </span>
                        )}

                        {discount && (
                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                {discount}% OFF
                            </span>
                        )}
                    </div>
                    <p className="text-muted text-sm leading-relaxed mb-6">{product.description}</p>
                    <div className="h-px bg-gray-200 mb-6" />

                    {/* Size */}
                    <div className="mb-5">
                        <h3 className="font-heading font-bold text-sm text-gray-900 mb-3">Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(s => (
                                <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${selectedSize === s ? "border-brand bg-brand text-white" : "border-gray-200 hover:border-brand text-gray-700"}`}>{s}</button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    {product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-heading font-bold text-sm text-gray-900 mb-3">Color: <span className="font-normal text-muted">{selectedColor || product.colors[0].name}</span></h3>
                            <div className="flex gap-3">
                                {product.colors.map(c => (
                                    <button key={c.name} onClick={() => setSelectedColor(c.name)} className={`w-10 h-10 rounded-full border-2 transition-all ${(selectedColor || product.colors[0].name) === c.name ? "border-brand scale-110 ring-2 ring-brand/30" : "border-gray-200 hover:border-gray-400"}`} style={{ backgroundColor: c.hex }} title={c.name} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity + Add to Cart */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors"><IoRemoveOutline size={18} /></button>
                            <span className="px-4 py-3 font-semibold text-sm min-w-[48px] text-center">{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 hover:bg-gray-100 transition-colors"><IoAddOutline size={18} /></button>
                        </div>
                        <button onClick={handleAddToCart} className={`flex-1 py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white" : "bg-brand text-white shadow-button hover:shadow-button-hover hover:bg-brand-light"}`}>
                            {added ? "✓ Added to Cart!" : "Add to Cart"}
                        </button>
                        <button onClick={() => toggle(product.id)} className={`p-4 rounded-2xl border-2 transition-all ${inWishlist ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-brand"}`}>
                            {inWishlist ? <IoHeart size={22} className="text-red-500" /> : <IoHeartOutline size={22} className="text-gray-600" />}
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-3">
                        {[{ icon: IoCarOutline, label: "Free Shipping", sub: "Orders ₹250+" }, { icon: IoRefreshOutline, label: "Easy Returns", sub: "30 days" }, { icon: IoShieldCheckmarkOutline, label: "Secure Pay", sub: "100% safe" }].map(b => (
                            <div key={b.label} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                                <b.icon size={20} className="text-brand mb-1" />
                                <span className="text-[11px] font-semibold text-gray-800">{b.label}</span>
                                <span className="text-[10px] text-muted">{b.sub}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="mb-20">
                <div className="flex gap-1 border-b border-gray-200 mb-6">
                    {tabs.map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === t ? "border-brand text-brand" : "border-transparent text-muted hover:text-gray-900"}`}>{t}</button>
                    ))}
                </div>
                {activeTab === "Description" && <div className="prose max-w-3xl text-muted text-sm leading-relaxed"><p>{product.description}</p><p className="mt-3">Each piece is carefully crafted using premium materials sourced from the finest suppliers. Our commitment to quality ensures durability and comfort that lasts through every season.</p></div>}
                {activeTab === "Reviews" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-heading font-bold text-xl mb-6">Customer Reviews</h3>



                            {reviews.map((r) => (
                                <div
                                    key={r._id}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, s) => (
                                                <IoStar
                                                    key={s}
                                                    size={14}
                                                    className={
                                                        s < r.rating
                                                            ? "text-gold"
                                                            : "text-gray-200"
                                                    }
                                                />
                                            ))}
                                        </div>

                                        <span className="font-semibold text-sm">
                                            {r.userName}
                                        </span>
                                    </div>

                                    <p className="text-sm text-muted">
                                        {r.review}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === "Shipping" && <div className="text-sm text-muted space-y-2 max-w-2xl"><p>• Free standard shipping on orders above ₹250</p><p>• Standard delivery: 5-7 business days</p><p>• Express delivery: 2-3 business days (₹14.99)</p><p>• International shipping available</p><p>• <Link to="/shipping" className="text-brand underline">View full shipping policy</Link></p></div>}
            </div>

            {/* Related */}
            {related.length > 0 && (
                <div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">{related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
