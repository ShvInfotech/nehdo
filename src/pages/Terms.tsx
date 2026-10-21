import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import { HiOutlineMail, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh } from "react-icons/hi";

const LegalPage = ({
    title,
    subtitle,
    lastUpdated,
    badge,
    children,
}: {
    title: string;
    subtitle?: string;
    lastUpdated: string;
    badge?: string;
    children: React.ReactNode;
}) => (
    <div className="min-h-screen bg-gray-50/50 py-10 md:py-16">
        <div className="max-w-[960px] mx-auto px-4 md:px-8">
            <div className="mb-6">
                <Breadcrumb items={[{ label: title }]} />
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-12 mb-8">
                <div className="border-b border-gray-100 pb-8 mb-8">
                    {badge && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand/10 text-brand mb-3">
                            {badge}
                        </span>
                    )}
                    <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                            {subtitle}
                        </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 font-medium">
                        <span>Last Updated: <strong className="text-gray-700">{lastUpdated}</strong></span>
                        <span>•</span>
                        <span>Official Contact: <a href="mailto:nehdoshopping@gmail.com" className="text-brand hover:underline font-semibold">nehdoshopping@gmail.com</a></span>
                    </div>
                </div>

                <div className="legal-content text-gray-700 leading-relaxed text-[15px] space-y-8">
                    {children}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50/70 -mx-6 -mb-6 md:-mx-12 md:-mb-12 p-6 md:p-8 rounded-b-3xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-bold text-gray-900 text-base">Have questions regarding this policy?</h4>
                            <p className="text-sm text-gray-500 mt-0.5">Our legal and customer support desk is available to assist you.</p>
                        </div>
                        <a
                            href="mailto:nehdoshopping@gmail.com"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white hover:bg-black font-semibold text-sm transition-colors shadow-sm shrink-0"
                        >
                            <HiOutlineMail className="text-lg" />
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

/* ==========================================================================
   TERMS & CONDITIONS
   ========================================================================== */
export const Terms = () => (
    <LegalPage
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before accessing or making purchases through Nehdo Wellness."
        lastUpdated="October 2026"
        badge="Legal Agreement"
    >
        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p>
                Welcome to <strong>Nehdo Wellness</strong> (<a href="https://nehdowellness.com" className="text-brand hover:underline">nehdowellness.com</a>). By accessing, browsing, or purchasing from our platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions, alongside our Privacy Policy, Return & Refund Policy, and Shipping Policy.
            </p>
            <p>
                If you do not agree with any portion of these terms, please discontinue using our website and services immediately.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Eligibility & Account Responsibilities</h2>
            <p>
                By using this site, you represent that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>You are responsible for safeguarding your account credentials, passwords, and restricting access to your computer/devices.</li>
                <li>You agree to provide true, accurate, current, and complete information during registration and checkout.</li>
                <li>Nehdo reserves the right to suspend or terminate accounts, remove content, or cancel orders at its discretion if unauthorized or fraudulent activity is suspected.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Products, Pricing & Accuracy</h2>
            <p>
                We strive to display product colors, fabrics, and descriptions as accurately as possible. However, actual colors may vary slightly due to monitor calibration and photography lighting.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>All prices listed on the website are in <strong>Indian Rupees (INR)</strong> and are inclusive of applicable taxes unless stated otherwise.</li>
                <li>We reserve the right to modify prices, discontinue products, or update specifications at any time without prior notice.</li>
                <li>In the event a product is listed at an incorrect price due to a typographical error, we reserve the right to cancel orders placed for the mispriced product.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Orders, Payment & Verification</h2>
            <p>
                When you place an order, you agree to purchase the selected items under these terms. All orders are subject to acceptance and product availability.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>We accept payments via trusted and authorized payment gateways (including Razorpay, Credit/Debit Cards, UPI, Net Banking, and approved Digital Wallets).</li>
                <li>All transactions are encrypted and processed securely. Nehdo does not store your complete card or banking credentials on its servers.</li>
                <li>We reserve the right to cancel any order if fraudulent transaction flags are raised by the payment gateway or bank.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Intellectual Property Rights</h2>
            <p>
                All content, trademarks, logos, brand names, product photographs, text, designs, graphics, and code on this website are the proprietary property of <strong>Nehdo Wellness</strong> and are protected by applicable intellectual property and copyright laws. Unauthorized reproduction, distribution, or commercial exploitation is strictly prohibited.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Limitation of Liability</h2>
            <p>
                To the fullest extent permitted by applicable law, Nehdo Wellness and its directors, employees, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of or inability to use our products or services.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">7. Governing Law & Jurisdiction</h2>
            <p>
                These Terms and Conditions and any disputes arising out of or related to your transactions with Nehdo shall be governed by and construed in accordance with the laws of <strong>India</strong>. The courts in <strong>Surat, Gujarat, India</strong> shall have exclusive jurisdiction over all matters and proceedings.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">8. Contact Information</h2>
            <p>
                For questions, concerns, or legal notices regarding these Terms, please reach out to us:
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <p><strong>Brand / Business:</strong> Nehdo Wellness</p>
                <p><strong>Website:</strong> https://nehdowellness.com</p>
                <p><strong>Official Email:</strong> <a href="mailto:nehdoshopping@gmail.com" className="text-brand font-semibold underline">nehdoshopping@gmail.com</a></p>
            </div>
        </section>
    </LegalPage>
);

/* ==========================================================================
   PRIVACY POLICY
   ========================================================================== */
export const Privacy = () => (
    <LegalPage
        title="Privacy Policy"
        subtitle="We value your trust and are committed to safeguarding your personal data and privacy."
        lastUpdated="October 2026"
        badge="Data Protection"
    >
        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Overview</h2>
            <p>
                This Privacy Policy describes how <strong>Nehdo Wellness</strong> ("we", "us", or "our") collects, uses, stores, and protects your personal information when you visit or make a purchase from <a href="https://nehdowellness.com" className="text-brand hover:underline">nehdowellness.com</a>. We adhere to the Information Technology Act, 2000, and the relevant data protection guidelines applicable in India.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
            <p>When you interact with our website, we may collect the following categories of information:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <strong className="block text-gray-900 mb-1">Personal Details</strong>
                    Name, email address, mobile/contact number, date of birth (optional), and login credentials.
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <strong className="block text-gray-900 mb-1">Shipping & Billing Data</strong>
                    Complete physical delivery address, billing address, PIN code, and contact person details.
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <strong className="block text-gray-900 mb-1">Transaction Information</strong>
                    Order items, order ID, amount paid, payment method, and transaction identifiers provided by payment processors.
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <strong className="block text-gray-900 mb-1">Device & Usage Analytics</strong>
                    IP address, browser type, device information, operating system, pages viewed, and session timestamps.
                </div>
            </div>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. How We Use Your Information</h2>
            <p>We utilize the collected information strictly for legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>To process, fulfill, package, and deliver your orders accurately.</li>
                <li>To send transactional notifications, order confirmations, invoices, and shipping tracking updates via SMS, WhatsApp, or Email.</li>
                <li>To securely verify payments and prevent fraudulent transactions or chargebacks.</li>
                <li>To provide dedicated customer support, resolve complaints, and handle return/refund requests.</li>
                <li>To improve website performance, user experience, and curated recommendations (you may opt out of promotional messages anytime).</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Sharing with Trusted Third Parties</h2>
            <p>
                <strong>We do not sell, rent, or trade your personal data to any third parties.</strong> Data is shared only with vetted third-party service providers essential for service delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Payment Processors:</strong> RBI-licensed gateways (e.g. Razorpay) to process encrypted, secure transactions.</li>
                <li><strong>Logistics & Courier Partners:</strong> Delivery agencies (e.g. Shiprocket, Delhivery, Bluedart) for delivering your parcels to your doorstep.</li>
                <li><strong>Statutory Authorities:</strong> When required by Indian law, subpoena, court order, or official governmental investigation.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Cookies & Tracking Technologies</h2>
            <p>
                Our website uses cookies and similar session technologies to retain your shopping cart, remember your login preferences, and optimize loading times. You can modify your browser settings to refuse cookies, though some features of the store may operate with reduced functionality.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Data Security & Storage</h2>
            <p>
                We implement industry-standard SSL (Secure Sockets Layer) 256-bit encryption for all data transfers. Sensitive information is stored behind secure firewalls with restricted access controls.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">7. Your Rights & Grievance Redressal</h2>
            <p>
                You have the right to access, correct, or request deletion of your personal information stored with us. For inquiries or data grievances, contact our designated Grievance Officer:
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <p><strong>Grievance & Privacy Officer:</strong> Nehdo Support Desk</p>
                <p><strong>Email:</strong> <a href="mailto:nehdoshopping@gmail.com" className="text-brand font-semibold underline">nehdoshopping@gmail.com</a></p>
                <p><strong>Response Timeline:</strong> Within 48 business hours</p>
            </div>
        </section>
    </LegalPage>
);

/* ==========================================================================
   RETURN & REFUND POLICY
   ========================================================================== */
export const Returns = () => (
    <LegalPage
        title="Return & Refund Policy"
        subtitle="Transparent, fair, and hassle-free returns for our valued customers."
        lastUpdated="October 2026"
        badge="Customer Protection"
    >
        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Return Window & Eligibility</h2>
            <p>
                We take immense pride in the quality and craftsmanship of our products. If you are not completely satisfied with your purchase, you may initiate a return request within <strong>7 days</strong> from the date of package delivery.
            </p>
            <p className="font-semibold text-gray-900">To be eligible for a return and full refund, items must fulfill the following criteria:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>The item must be completely <strong>unused, unwashed, unworn, and undamaged</strong>.</li>
                <li>All original brand tags, price tags, barcodes, and authenticity labels must remain attached.</li>
                <li>The item must be in its original brand packaging along with any accessories, dust bags, or freebies included.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Non-Returnable & Non-Refundable Items</h2>
            <p>Due to hygiene, personal care, and safety standards, the following products cannot be returned or exchanged:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>Innerwear, lingerie, swimwear, bodysuits, and socks.</li>
                <li>Fragrances, cosmetics, and personal grooming/wellness goods where the security seal is opened.</li>
                <li>Items marked as "Final Sale", "Clearance", or customized/altered products.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Damaged, Defective, or Incorrect Items</h2>
            <p>
                In the rare instance that you receive a defective, damaged, or incorrect item:
            </p>
            <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-amber-900 text-sm space-y-2">
                <p className="font-semibold">⚠️ Mandatory Notice:</p>
                <p>
                    Please notify us within <strong>48 hours of delivery</strong> by emailing <a href="mailto:nehdoshopping@gmail.com" className="font-bold underline">nehdoshopping@gmail.com</a> with your Order ID, clear photos of the defect, and outer courier packaging / unboxing video.
                </p>
                <p>
                    Once verified, we will arrange a complimentary priority replacement or full refund with zero additional fees.
                </p>
            </div>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. How to Request a Return</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>Log in to your account at <a href="https://nehdowellness.com" className="text-brand hover:underline font-medium">nehdowellness.com</a>, navigate to <strong>My Orders</strong>, and select the item you wish to return.</li>
                <li>Alternatively, send an email to <a href="mailto:nehdoshopping@gmail.com" className="text-brand font-semibold underline">nehdoshopping@gmail.com</a> with your <strong>Order Number</strong>, item name, and reason for return.</li>
                <li>Our support team will validate the request and schedule a doorstep reverse pickup via our logistics partner within 2-3 business days.</li>
                <li>Please securely pack the item in its original box with all tags intact. Hand the package to the pickup agent.</li>
            </ol>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Refund Processing Timelines</h2>
            <p>
                Once the returned item arrives at our fulfillment facility and passes quality inspection (usually within <strong>24 to 48 hours of receipt</strong>):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Prepaid Orders (Cards / Net Banking / UPI / Wallets):</strong> The refund will be credited directly back to the original source account within <strong>5 to 7 business days</strong>.</li>
                <li><strong>Cash on Delivery (COD) Orders:</strong> Our customer support will contact you to collect your preferred bank account details (Account Name, Account Number, IFSC code) or UPI ID. The refund will be credited via NEFT/UPI within 3 to 5 business days.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Order Cancellation Policy</h2>
            <p>
                You can cancel your order anytime <strong>before it is dispatched</strong> from our warehouse directly through your account dashboard or by promptly emailing <a href="mailto:nehdoshopping@gmail.com" className="text-brand font-semibold underline">nehdoshopping@gmail.com</a>. Once an order is handed over to the courier, it cannot be canceled mid-transit and must be processed under the standard return policy.
            </p>
        </section>
    </LegalPage>
);

/* ==========================================================================
   SHIPPING POLICY
   ========================================================================== */
export const Shipping = () => (
    <LegalPage
        title="Shipping & Delivery Policy"
        subtitle="Prompt, secure, and reliable nationwide deliveries directly to your doorstep."
        lastUpdated="October 2026"
        badge="Logistics & Delivery"
    >
        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">1. Order Processing Time</h2>
            <p>
                All orders placed on <strong>Nehdo Wellness</strong> (<a href="https://nehdowellness.com" className="text-brand hover:underline">nehdowellness.com</a>) are processed and dispatched within <strong>24 to 48 business hours</strong> (excluding Sundays and national holidays), subject to product availability and payment verification.
            </p>
            <p className="text-sm text-gray-500">
                *During major festive sales or promotional events, dispatch may take an additional 24 hours.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">2. Estimated Delivery Timelines (Domestic India)</h2>
            <p>We partner with premier courier networks (including Shiprocket, Delhivery, Bluedart, and Ekart) to guarantee swift delivery:</p>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden my-3">
                    <thead className="bg-gray-100/75 text-gray-900 font-bold">
                        <tr>
                            <th className="p-3.5 border-b border-gray-200">Destination</th>
                            <th className="p-3.5 border-b border-gray-200">Estimated Delivery Time</th>
                            <th className="p-3.5 border-b border-gray-200">Service Coverage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        <tr>
                            <td className="p-3.5 font-semibold">Tier 1 Metro Cities</td>
                            <td className="p-3.5">2 – 4 Business Days</td>
                            <td className="p-3.5">Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad</td>
                        </tr>
                        <tr>
                            <td className="p-3.5 font-semibold">Tier 2 & Tier 3 Cities</td>
                            <td className="p-3.5">4 – 6 Business Days</td>
                            <td className="p-3.5">State Capitals & Major Towns across India</td>
                        </tr>
                        <tr>
                            <td className="p-3.5 font-semibold">Remote / Regional Areas</td>
                            <td className="p-3.5">5 – 8 Business Days</td>
                            <td className="p-3.5">North East, J&K, Island territories and remote pin codes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">3. Shipping Charges</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li><strong>Prepaid Orders:</strong> Free standard shipping across India on orders above ₹999. A nominal shipping fee of ₹49 applies on orders below ₹999.</li>
                <li><strong>Cash on Delivery (COD):</strong> An additional handling charge of ₹50 to ₹90 may apply on COD orders to cover courier cash collection fees.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">4. Real-Time Order Tracking</h2>
            <p>
                As soon as your package is dispatched from our fulfillment facility, you will receive an automated notification via <strong>SMS, WhatsApp, and Email</strong> containing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                <li>Courier partner name (e.g. Delhivery, Bluedart, etc.)</li>
                <li>Air Waybill (AWB) / Tracking Number</li>
                <li>Direct live tracking link to monitor your parcel in real-time</li>
            </ul>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">5. Undelivered Shipments & Address Accuracy</h2>
            <p>
                Our courier partners will make up to <strong>3 delivery attempts</strong> before returning the package to our hub (Return to Origin - RTO).
            </p>
            <p className="text-gray-600">
                Please ensure that you provide complete, precise shipping address details, landmark, and a working mobile phone number at checkout. Nehdo is not responsible for delayed or failed deliveries resulting from inaccurate addresses or recipient unavailability.
            </p>
        </section>

        <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">6. Shipping Inquiries & Support</h2>
            <p>
                If your package is delayed, shows delivered but not received, or if you need assistance updating your address prior to dispatch, please reach out immediately:
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                <p><strong>Logistics Support:</strong> Nehdo Shipping Desk</p>
                <p><strong>Email:</strong> <a href="mailto:nehdoshopping@gmail.com" className="text-brand font-semibold underline">nehdoshopping@gmail.com</a></p>
                <p><strong>Operating Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
        </section>
    </LegalPage>
);

export default Terms;
