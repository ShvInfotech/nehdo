import React from "react";
import { motion } from "framer-motion";
import { IoArrowForward, IoCalendarOutline } from "react-icons/io5";

const blogPosts = [
    {
        id: 1,
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/hx1j3bab_expires_30_days.png",
        date: "May 20, 2026",
        category: "Fashion",
        title: "5 Summer Fashion Trends You Need to Know",
        excerpt: "Explore the hottest styles this season. From bold colors to minimalist pieces, here's what's trending.",
    },
    {
        id: 2,
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/jeuxipik_expires_30_days.png",
        date: "May 18, 2026",
        category: "Style Guide",
        title: "How to Build a Capsule Wardrobe",
        excerpt: "Less is more. Learn how to curate a versatile wardrobe with just 30 essential pieces.",
    },
    {
        id: 3,
        image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/hurs0BoZOo/d66dk56o_expires_30_days.png",
        date: "May 15, 2026",
        category: "Sustainability",
        title: "Sustainable Fashion: A Guide to Ethical Shopping",
        excerpt: "Discover how to make conscious fashion choices without compromising on style.",
    },
];

const BlogSection = () => {
    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 mb-16 md:mb-28">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12"
            >
                <div>
                    <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        Latest From Our Blog
                    </h2>
                    <div className="w-16 h-1 bg-brand rounded-full mt-3" />
                </div>
                <a href="/blog" className="group flex items-center gap-2 text-muted hover:text-brand transition-colors text-sm md:text-base font-medium">
                    View all posts
                    <IoArrowForward className="group-hover:translate-x-1 transition-transform" size={16} />
                </a>
            </motion.div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {blogPosts.map((post, i) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group cursor-pointer bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-card hover:shadow-card-hover transition-all"
                    >
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[16/10]">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-brand/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-3 text-muted">
                                <IoCalendarOutline size={14} />
                                <span className="text-xs font-medium">{post.date}</span>
                            </div>

                            <h3 className="font-heading font-bold text-base md:text-lg text-gray-900 mb-2 group-hover:text-brand transition-colors leading-snug line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                                {post.excerpt}
                            </p>

                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
                                Read More
                                <IoArrowForward size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
};

export default BlogSection;
