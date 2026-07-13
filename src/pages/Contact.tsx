import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoLocationOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";
import Breadcrumb from "../components/Breadcrumb";

const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => setIsSubmitted(true), 500);
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-8">
            <div className="mb-6"><Breadcrumb items={[{ label: "Contact Us" }]} /></div>

            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
                <p className="text-muted text-lg">
                    Have a question or just want to say hi? We'd love to hear from you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
                {/* Contact Information */}
                <div className="space-y-10">
                    <div>
                        <h2 className="font-heading text-3xl font-bold mb-6">Contact Information</h2>
                        <p className="text-muted mb-8">Fill up the form and our Team will get back to you within 24 hours.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                                <IoCallOutline size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Phone Number</h3>
                                <p className="text-muted">+91 98765 43210</p>
                                <p className="text-muted">+91 12345 67890</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                                <IoMailOutline size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Email Address</h3>
                                <p className="text-muted">support@nehdo.com</p>
                                <p className="text-muted">info@nehdo.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                                <IoLocationOutline size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">Office Address</h3>
                                <p className="text-muted">123 Fashion Street, Bandra West<br/>Mumbai, Maharashtra 400050<br/>India</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inquiry Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-8 md:p-10 shadow-card border border-gray-100"
                >
                    {isSubmitted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10">
                            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                                <IoMailOutline size={40} />
                            </div>
                            <h3 className="font-heading text-2xl font-bold">Message Sent!</h3>
                            <p className="text-muted">Thank you for contacting us. We will get back to you shortly.</p>
                            <button onClick={() => setIsSubmitted(false)} className="mt-4 px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-brand-light transition-colors">
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h3 className="font-heading text-2xl font-bold mb-6">Send us a message</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                                <textarea 
                                    required 
                                    rows={5}
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-4 bg-brand text-white font-bold rounded-xl shadow-button hover:bg-brand-light hover:shadow-button-hover transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
