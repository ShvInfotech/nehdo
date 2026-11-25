/*
 * Store policy text (Terms, Privacy, Returns, Shipping). This file is the
 * single source of truth — edit wording here. Styled via .v2-legal in
 * styles/theme.css.
 */
import React from "react";

export interface Policy {
  slug: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  badge: string;
  sections: { id: string; title: string }[];
  body: React.ReactNode;
}

export const POLICIES: Record<"terms" | "privacy" | "returns" | "shipping", Policy> = {
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    subtitle: "Please read these terms carefully before accessing or making purchases through Nehdo Wellness.",
    lastUpdated: "November 2026",
    badge: "Legal Agreement",
    sections: [
    { id: "acceptance-of-terms", title: "1. Acceptance of Terms" },
    { id: "eligibility-account-responsibilities", title: "2. Eligibility & Account Responsibilities" },
    { id: "products-pricing-accuracy", title: "3. Products, Pricing & Accuracy" },
    { id: "orders-payment-verification", title: "4. Orders, Payment & Verification" },
    { id: "intellectual-property-rights", title: "5. Intellectual Property Rights" },
    { id: "limitation-of-liability", title: "6. Limitation of Liability" },
    { id: "governing-law-jurisdiction", title: "7. Governing Law & Jurisdiction" },
    { id: "contact-information", title: "8. Contact Information" }
    ],
    body: (
      <>
        <section>
            <h2 id="acceptance-of-terms">1. Acceptance of Terms</h2>
            <p>
                Welcome to <strong>Nehdo Wellness</strong> (<a href="https://nehdowellness.com">nehdowellness.com</a>). By accessing, browsing, or purchasing from our platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions, alongside our Privacy Policy, Return & Refund Policy, and Shipping Policy.
            </p>
            <p>
                If you do not agree with any portion of these terms, please discontinue using our website and services immediately.
            </p>
        </section>

        <section>
            <h2 id="eligibility-account-responsibilities">2. Eligibility & Account Responsibilities</h2>
            <p>
                By using this site, you represent that you are at least 18 years of age or accessing under the supervision of a parent or legal guardian.
            </p>
            <ul>
                <li>You are responsible for safeguarding your account credentials, passwords, and restricting access to your computer/devices.</li>
                <li>You agree to provide true, accurate, current, and complete information during registration and checkout.</li>
                <li>Nehdo reserves the right to suspend or terminate accounts, remove content, or cancel orders at its discretion if unauthorized or fraudulent activity is suspected.</li>
            </ul>
        </section>

        <section>
            <h2 id="products-pricing-accuracy">3. Products, Pricing & Accuracy</h2>
            <p>
                We strive to display product colors, materials, and descriptions as accurately as possible. However, actual colors may vary slightly due to monitor calibration and photography lighting.
            </p>
            <ul>
                <li>All prices listed on the website are in <strong>Indian Rupees (INR)</strong> and are inclusive of applicable taxes unless stated otherwise.</li>
                <li>We reserve the right to modify prices, discontinue products, or update specifications at any time without prior notice.</li>
                <li>In the event a product is listed at an incorrect price due to a typographical error, we reserve the right to cancel orders placed for the mispriced product.</li>
            </ul>
        </section>

        <section>
            <h2 id="orders-payment-verification">4. Orders, Payment & Verification</h2>
            <p>
                When you place an order, you agree to purchase the selected items under these terms. All orders are subject to acceptance and product availability.
            </p>
            <ul>
                <li>We accept payments via trusted and authorized payment gateways (including Razorpay, Credit/Debit Cards, UPI, Net Banking, and approved Digital Wallets).</li>
                <li>All transactions are encrypted and processed securely. Nehdo does not store your complete card or banking credentials on its servers.</li>
                <li>We reserve the right to cancel any order if fraudulent transaction flags are raised by the payment gateway or bank.</li>
            </ul>
        </section>

        <section>
            <h2 id="intellectual-property-rights">5. Intellectual Property Rights</h2>
            <p>
                All content, trademarks, logos, brand names, product photographs, text, designs, graphics, and code on this website are the proprietary property of <strong>Nehdo Wellness</strong> and are protected by applicable intellectual property and copyright laws. Unauthorized reproduction, distribution, or commercial exploitation is strictly prohibited.
            </p>
        </section>

        <section>
            <h2 id="limitation-of-liability">6. Limitation of Liability</h2>
            <p>
                To the fullest extent permitted by applicable law, Nehdo Wellness and its directors, employees, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use of or inability to use our products or services.
            </p>
        </section>

        <section>
            <h2 id="governing-law-jurisdiction">7. Governing Law & Jurisdiction</h2>
            <p>
                These Terms and Conditions and any disputes arising out of or related to your transactions with Nehdo shall be governed by and construed in accordance with the laws of <strong>India</strong>. The courts in <strong>Surat, Gujarat, India</strong> shall have exclusive jurisdiction over all matters and proceedings.
            </p>
        </section>

        <section>
            <h2 id="contact-information">8. Contact Information</h2>
            <p>
                For questions, concerns, or legal notices regarding these Terms, please reach out to us:
            </p>
            <div>
                <p><strong>Brand / Business:</strong> Nehdo Wellness</p>
                <p><strong>Website:</strong> https://nehdowellness.com</p>
                <p><strong>Official Email:</strong> <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a></p>
            </div>
        </section>
    </>
    ),
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "We value your trust and are committed to safeguarding your personal data and privacy.",
    lastUpdated: "October 2026",
    badge: "Data Protection",
    sections: [
    { id: "overview", title: "1. Overview" },
    { id: "information-we-collect", title: "2. Information We Collect" },
    { id: "how-we-use-your-information", title: "3. How We Use Your Information" },
    { id: "sharing-with-trusted-third-parties", title: "4. Sharing with Trusted Third Parties" },
    { id: "cookies-tracking-technologies", title: "5. Cookies & Tracking Technologies" },
    { id: "data-security-storage", title: "6. Data Security & Storage" },
    { id: "your-rights-grievance-redressal", title: "7. Your Rights & Grievance Redressal" }
    ],
    body: (
      <>
        <section>
            <h2 id="overview">1. Overview</h2>
            <p>
                This Privacy Policy describes how <strong>Nehdo Wellness</strong> ("we", "us", or "our") collects, uses, stores, and protects your personal information when you visit or make a purchase from <a href="https://nehdowellness.com">nehdowellness.com</a>. We adhere to the Information Technology Act, 2000, and the relevant data protection guidelines applicable in India.
            </p>
        </section>

        <section>
            <h2 id="information-we-collect">2. Information We Collect</h2>
            <p>When you interact with our website, we may collect the following categories of information:</p>
            <div>
                <div>
                    <strong>Personal Details</strong>
                    Name, email address, mobile/contact number, date of birth (optional), and login credentials.
                </div>
                <div>
                    <strong>Shipping & Billing Data</strong>
                    Complete physical delivery address, billing address, PIN code, and contact person details.
                </div>
                <div>
                    <strong>Transaction Information</strong>
                    Order items, order ID, amount paid, payment method, and transaction identifiers provided by payment processors.
                </div>
                <div>
                    <strong>Device & Usage Analytics</strong>
                    IP address, browser type, device information, operating system, pages viewed, and session timestamps.
                </div>
            </div>
        </section>

        <section>
            <h2 id="how-we-use-your-information">3. How We Use Your Information</h2>
            <p>We utilize the collected information strictly for legitimate business purposes:</p>
            <ul>
                <li>To process, fulfill, package, and deliver your orders accurately.</li>
                <li>To send transactional notifications, order confirmations, invoices, and shipping tracking updates via SMS, WhatsApp, or Email.</li>
                <li>To securely verify payments and prevent fraudulent transactions or chargebacks.</li>
                <li>To provide dedicated customer support, resolve complaints, and handle return/refund requests.</li>
                <li>To improve website performance, user experience, and curated recommendations (you may opt out of promotional messages anytime).</li>
            </ul>
        </section>

        <section>
            <h2 id="sharing-with-trusted-third-parties">4. Sharing with Trusted Third Parties</h2>
            <p>
                <strong>We do not sell, rent, or trade your personal data to any third parties.</strong> Data is shared only with vetted third-party service providers essential for service delivery:
            </p>
            <ul>
                <li><strong>Payment Processors:</strong> RBI-licensed gateways (e.g. Razorpay) to process encrypted, secure transactions.</li>
                <li><strong>Logistics & Courier Partners:</strong> Delivery agencies (e.g. Shiprocket, Delhivery, Bluedart) for delivering your parcels to your doorstep.</li>
                <li><strong>Statutory Authorities:</strong> When required by Indian law, subpoena, court order, or official governmental investigation.</li>
            </ul>
        </section>

        <section>
            <h2 id="cookies-tracking-technologies">5. Cookies & Tracking Technologies</h2>
            <p>
                Our website uses cookies and similar session technologies to retain your shopping cart, remember your login preferences, and optimize loading times. You can modify your browser settings to refuse cookies, though some features of the store may operate with reduced functionality.
            </p>
        </section>

        <section>
            <h2 id="data-security-storage">6. Data Security & Storage</h2>
            <p>
                We implement industry-standard SSL (Secure Sockets Layer) 256-bit encryption for all data transfers. Sensitive information is stored behind secure firewalls with restricted access controls.
            </p>
        </section>

        <section>
            <h2 id="your-rights-grievance-redressal">7. Your Rights & Grievance Redressal</h2>
            <p>
                You have the right to access, correct, or request deletion of your personal information stored with us. For inquiries or data grievances, contact our designated Grievance Officer:
            </p>
            <div>
                <p><strong>Grievance & Privacy Officer:</strong> Nehdo Support Desk</p>
                <p><strong>Email:</strong> <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a></p>
                <p><strong>Response Timeline:</strong> Within 48 business hours</p>
            </div>
        </section>
    </>
    ),
  },
  returns: {
    slug: "returns",
    title: "Return & Refund Policy",
    subtitle: "Transparent, fair, and hassle-free returns for our valued customers.",
    lastUpdated: "November 2026",
    badge: "Customer Protection",
    sections: [
    { id: "return-window-eligibility", title: "1. Return Window & Eligibility" },
    { id: "non-returnable-non-refundable-items", title: "2. Non-Returnable & Non-Refundable Items" },
    { id: "damaged-defective-or-incorrect-items", title: "3. Damaged, Defective, or Incorrect Items" },
    { id: "how-to-request-a-return", title: "4. How to Request a Return" },
    { id: "refund-processing-timelines", title: "5. Refund Processing Timelines" },
    { id: "order-cancellation-policy", title: "6. Order Cancellation Policy" }
    ],
    body: (
      <>
        <section>
            <h2 id="return-window-eligibility">1. Return Window & Eligibility</h2>
            <p>
                We take immense pride in the quality and craftsmanship of our products. If you are not completely satisfied with your purchase, you may initiate a return request within <strong>7 days</strong> from the date of package delivery.
            </p>
            <p>To be eligible for a return and full refund, items must fulfill the following criteria:</p>
            <ul>
                <li>The item must be completely <strong>unused, unopened, and undamaged</strong>.</li>
                <li>All original seals, barcodes, and authenticity labels must remain intact.</li>
                <li>The item must be in its original brand packaging along with any accessories or freebies included.</li>
            </ul>
        </section>

        <section>
            <h2 id="non-returnable-non-refundable-items">2. Non-Returnable & Non-Refundable Items</h2>
            <p>Due to hygiene, personal care, and safety standards, the following products cannot be returned or exchanged:</p>
            <ul>
                <li>Intimate products (such as massagers, lubricants, and condoms) and lingerie or innerwear once the seal or packaging has been opened.</li>
                <li>Fragrances, cosmetics, and personal grooming/wellness goods where the security seal is opened.</li>
                <li>Items marked as "Final Sale", "Clearance", or customized/altered products.</li>
            </ul>
        </section>

        <section>
            <h2 id="damaged-defective-or-incorrect-items">3. Damaged, Defective, or Incorrect Items</h2>
            <p>
                In the rare instance that you receive a defective, damaged, or incorrect item:
            </p>
            <div>
                <p>⚠️ Mandatory Notice:</p>
                <p>
                    Please notify us within <strong>48 hours of delivery</strong> by emailing <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a> with your Order ID, clear photos of the defect, and outer courier packaging / unboxing video.
                </p>
                <p>
                    Once verified, we will arrange a complimentary priority replacement or full refund with zero additional fees.
                </p>
            </div>
        </section>

        <section>
            <h2 id="how-to-request-a-return">4. How to Request a Return</h2>
            <ol>
                <li>Log in to your account at <a href="https://nehdowellness.com">nehdowellness.com</a>, navigate to <strong>My Orders</strong>, and select the item you wish to return.</li>
                <li>Alternatively, send an email to <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a> with your <strong>Order Number</strong>, item name, and reason for return.</li>
                <li>Our support team will validate the request and schedule a doorstep reverse pickup via our logistics partner within 2-3 business days.</li>
                <li>Please securely pack the item in its original box with all seals and labels intact. Hand the package to the pickup agent.</li>
            </ol>
        </section>

        <section>
            <h2 id="refund-processing-timelines">5. Refund Processing Timelines</h2>
            <p>
                Once the returned item arrives at our fulfillment facility and passes quality inspection (usually within <strong>24 to 48 hours of receipt</strong>):
            </p>
            <ul>
                <li><strong>Prepaid Orders (Cards / Net Banking / UPI / Wallets):</strong> The refund will be credited directly back to the original source account within <strong>5 to 7 business days</strong>.</li>
                <li><strong>Cash on Delivery (COD) Orders:</strong> You will be asked for your bank account details (Account Holder Name, Account Number, IFSC code) in the return request form under My Orders. The refund will be credited via NEFT within 3 to 5 business days.</li>
            </ul>
        </section>

        <section>
            <h2 id="order-cancellation-policy">6. Order Cancellation Policy</h2>
            <p>
                You can cancel your order anytime <strong>before it is dispatched</strong> from our warehouse directly through your account dashboard or by promptly emailing <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a>. Once an order is handed over to the courier, it cannot be canceled mid-transit and must be processed under the standard return policy.
            </p>
        </section>
    </>
    ),
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    subtitle: "Prompt, secure, and reliable nationwide deliveries directly to your doorstep.",
    lastUpdated: "November 2026",
    badge: "Logistics & Delivery",
    sections: [
    { id: "order-processing-time", title: "1. Order Processing Time" },
    { id: "estimated-delivery-timelines-domestic-india", title: "2. Estimated Delivery Timelines (Domestic India)" },
    { id: "shipping-charges", title: "3. Shipping Charges" },
    { id: "real-time-order-tracking", title: "4. Real-Time Order Tracking" },
    { id: "undelivered-shipments-address-accuracy", title: "5. Undelivered Shipments & Address Accuracy" },
    { id: "shipping-inquiries-support", title: "6. Shipping Inquiries & Support" }
    ],
    body: (
      <>
        <section>
            <h2 id="order-processing-time">1. Order Processing Time</h2>
            <p>
                All orders placed on <strong>Nehdo Wellness</strong> (<a href="https://nehdowellness.com">nehdowellness.com</a>) are processed and dispatched within <strong>24 to 48 business hours</strong> (excluding Sundays and national holidays), subject to product availability and payment verification.
            </p>
            <p>
                *During major festive sales or promotional events, dispatch may take an additional 24 hours.
            </p>
        </section>

        <section>
            <h2 id="estimated-delivery-timelines-domestic-india">2. Estimated Delivery Timelines (Domestic India)</h2>
            <p>We partner with premier courier networks (including Shiprocket, Delhivery, Bluedart, and Ekart) to guarantee swift delivery:</p>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Destination</th>
                            <th>Estimated Delivery Time</th>
                            <th>Service Coverage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tier 1 Metro Cities</td>
                            <td>2 – 4 Business Days</td>
                            <td>Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad</td>
                        </tr>
                        <tr>
                            <td>Tier 2 & Tier 3 Cities</td>
                            <td>4 – 6 Business Days</td>
                            <td>State Capitals & Major Towns across India</td>
                        </tr>
                        <tr>
                            <td>Remote / Regional Areas</td>
                            <td>5 – 8 Business Days</td>
                            <td>North East, J&K, Island territories and remote pin codes</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section>
            <h2 id="shipping-charges">3. Shipping Charges</h2>
            <ul>
                <li><strong>Free Shipping:</strong> Free standard shipping across India on orders of ₹250 or more, to serviceable pin codes.</li>
                <li><strong>Orders below ₹250:</strong> The delivery charge for your pin code is calculated and shown at checkout before you pay.</li>
                <li><strong>Cash on Delivery (COD):</strong> Available on serviceable pin codes. No additional COD handling fee is currently charged.</li>
            </ul>
        </section>

        <section>
            <h2 id="real-time-order-tracking">4. Real-Time Order Tracking</h2>
            <p>
                As soon as your package is dispatched from our fulfillment facility, the following details become available under <strong>My Orders</strong> in your account:
            </p>
            <ul>
                <li>Air Waybill (AWB) / Tracking Number</li>
                <li>Direct live tracking link to monitor your parcel in real-time</li>
            </ul>
        </section>

        <section>
            <h2 id="undelivered-shipments-address-accuracy">5. Undelivered Shipments & Address Accuracy</h2>
            <p>
                Our courier partners will make up to <strong>3 delivery attempts</strong> before returning the package to our hub (Return to Origin - RTO).
            </p>
            <p>
                Please ensure that you provide complete, precise shipping address details, landmark, and a working mobile phone number at checkout. Nehdo is not responsible for delayed or failed deliveries resulting from inaccurate addresses or recipient unavailability.
            </p>
        </section>

        <section>
            <h2 id="shipping-inquiries-support">6. Shipping Inquiries & Support</h2>
            <p>
                If your package is delayed, shows delivered but not received, or if you need assistance updating your address prior to dispatch, please reach out immediately:
            </p>
            <div>
                <p><strong>Logistics Support:</strong> Nehdo Shipping Desk</p>
                <p><strong>Email:</strong> <a href="mailto:nehdoshopping@gmail.com">nehdoshopping@gmail.com</a></p>
                <p><strong>Operating Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
        </section>
    </>
    ),
  },
};
