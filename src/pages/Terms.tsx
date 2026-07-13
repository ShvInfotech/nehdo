import React from "react";
import Breadcrumb from "../components/Breadcrumb";

const LegalPage = ({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: React.ReactNode }) => (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-12 pb-24">
        <div className="mb-8"><Breadcrumb items={[{ label: title }]} /></div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-10">Last Updated: {lastUpdated}</p>
        <div className="prose prose-brand max-w-none text-muted leading-relaxed prose-headings:font-heading prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4">
            {children}
        </div>
    </div>
);

export const Terms = () => (
    <LegalPage title="Terms & Conditions" lastUpdated="July 1, 2026">
        <p>Welcome to Nehdo. These terms and conditions outline the rules and regulations for the use of Nehdo's Website.</p>
        <h2>1. Introduction</h2>
        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Nehdo if you do not agree to take all of the terms and conditions stated on this page.</p>
        <h2>2. Cookies</h2>
        <p>We employ the use of cookies. By accessing Nehdo, you agreed to use cookies in agreement with the Nehdo's Privacy Policy.</p>
        <h2>3. License</h2>
        <p>Unless otherwise stated, Nehdo and/or its licensors own the intellectual property rights for all material on Nehdo. All intellectual property rights are reserved.</p>
        <h2>4. User Accounts</h2>
        <p>If you create an account on the Website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account.</p>
    </LegalPage>
);

export const Privacy = () => (
    <LegalPage title="Privacy Policy" lastUpdated="July 1, 2026">
        <p>Your privacy is important to us. It is Nehdo's policy to respect your privacy regarding any information we may collect from you across our website.</p>
        <h2>1. Information We Collect</h2>
        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, to process your transactions, and to communicate with you.</p>
        <h2>3. Information Sharing</h2>
        <p>We don't share any personally identifying information publicly or with third-parties, except when required to by law or with necessary payment processors.</p>
        <h2>4. Data Security</h2>
        <p>We use commercially reasonable safeguards to preserve the integrity and security of all information collected through the Service.</p>
    </LegalPage>
);

export const Returns = () => (
    <LegalPage title="Return & Refund Policy" lastUpdated="June 15, 2026">
        <p>We want you to be completely satisfied with your purchase. If you are not, our return policy is simple and straightforward.</p>
        <h2>30-Day Return Policy</h2>
        <p>We accept returns within 30 days of the delivery date. Items must be returned in their original condition: unworn, unwashed, with all original tags and packaging intact.</p>
        <h2>How to Return an Item</h2>
        <ol>
            <li>Log into your Nehdo account and navigate to 'Order History'.</li>
            <li>Select the order containing the item you wish to return and click 'Initiate Return'.</li>
            <li>Print the prepaid shipping label provided.</li>
            <li>Pack the item securely and drop it off at any authorized shipping location.</li>
        </ol>
        <h2>Refunds</h2>
        <p>Once we receive and inspect your return (usually within 3-5 business days), we will process your refund. The refund will be credited to your original method of payment within 5-10 business days, depending on your bank.</p>
        <h2>Non-Returnable Items</h2>
        <p>Intimates, swimwear (if the hygiene liner has been removed), and final sale items are not eligible for return or exchange.</p>
    </LegalPage>
);

export const Shipping = () => (
    <LegalPage title="Shipping Information" lastUpdated="May 10, 2026">
        <p>We ship globally. Below you will find information regarding our shipping options, rates, and delivery times.</p>
        <h2>Domestic Shipping (India)</h2>
        <ul>
            <li><strong>Standard Shipping:</strong> ₹9.99 (Free on orders over ₹250). Delivery in 5-7 business days.</li>
            <li><strong>Express Shipping:</strong> ₹14.99. Delivery in 2-3 business days.</li>
            <li><strong>Next Day Delivery:</strong> ₹24.99. Available in select metro areas. Order before 2 PM.</li>
        </ul>
        <h2>International Shipping</h2>
        <p>We ship to over 100 countries worldwide. International shipping rates are calculated at checkout based on destination and package weight.</p>
        <p>Please note that international orders may be subject to import duties, taxes, and customs fees levied by the destination country. These charges are the responsibility of the recipient.</p>
        <h2>Order Tracking</h2>
        <p>Once your order has been dispatched, you will receive a shipping confirmation email containing a tracking link. You can track your parcel's journey right to your door.</p>
    </LegalPage>
);

export default Terms;
