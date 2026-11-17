import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IoChevronDown, IoLogoWhatsapp, IoMailOutline, IoSearchOutline } from "react-icons/io5";
import { Breadcrumbs, Container } from "../components/ui";
import { FREE_SHIPPING_ABOVE, SUPPORT_EMAIL, SUPPORT_WHATSAPP } from "../config";
import { cx } from "../lib/format";

/*
 * old FAQ was fashion-store placeholder copy (30-day returns, "unworn with tags",
 * PayPal/Apple Pay, international shipping). Every answer below is based on
 * what the code actually does, or quotes the site's own policy pages.
 */
interface QA {
  q: string;
  a: React.ReactNode;
  text: string; // plain text for search
}

const L: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="font-semibold text-v2-plum underline underline-offset-2">
    {children}
  </Link>
);

const FAQS: { category: string; items: QA[] }[] = [
  {
    category: "Privacy & packaging",
    items: [
      {
        q: "Will anyone know what I ordered?",
        a: "Orders ship in a plain outer box with no product names on the label, and the charge appears under a neutral name on your statement.",
        text: "discreet plain box label neutral name statement packaging privacy",
      },
      {
        q: "Do you share or sell my data?",
        a: (
          <>
            Our <L to="/privacy">Privacy Policy</L> states that we do not sell, rent or trade your personal data. It lists the
            only partners data is shared with: payment processing, couriers, and authorities where the law requires it.
          </>
        ),
        text: "data privacy sell share third party",
      },
      {
        q: "Do I need to be 18?",
        a: "Yes. Nehdo sells sexual wellness products for adults, and you’ll be asked to confirm you’re 18 or older.",
        text: "age 18 adult",
      },
    ],
  },
  {
    category: "Orders & payment",
    items: [
      {
        q: "Do I need an account to order?",
        a: "No. You can add items to your cart and check out without signing up first. An account lets you save a wishlist and see your order history.",
        text: "account sign up guest checkout",
      },
      {
        q: "Which payment methods can I use?",
        a: "Checkout is handled securely by Razorpay: UPI, debit and credit cards, and net banking. Cash on delivery is offered where it’s available for your pincode.",
        text: "payment upi card net banking razorpay cod cash on delivery",
      },
      {
        q: "Where do I apply a coupon?",
        a: "Eligible coupons are shown inside the secure checkout window, before you pay.",
        text: "coupon discount code promo",
      },
      {
        q: "Can I cancel my order?",
        a: (
          <>
            Yes, while it’s still processing. Go to <L to="/orders">My Orders</L>, open the order and choose “Cancel order”. Once
            it has shipped, it can’t be cancelled and is handled as a return.
          </>
        ),
        text: "cancel order processing shipped",
      },
    ],
  },
  {
    category: "Shipping & tracking",
    items: [
      {
        q: "Is shipping free?",
        a: `Shipping is free on orders of ₹${FREE_SHIPPING_ABOVE} or more to serviceable pincodes. Below that, the delivery charge for your pincode is shown at checkout before you pay.`,
        text: "free shipping delivery charge cost",
      },
      {
        q: "How long will delivery take?",
        a: (
          <>
            The estimate for your pincode is shown at checkout. Typical timelines by region are listed in our{" "}
            <L to="/shipping">Shipping Policy</L>.
          </>
        ),
        text: "delivery time days how long",
      },
      {
        q: "How do I track my order?",
        a: (
          <>
            Open <L to="/orders">My Orders</L>. Each order shows its status, and a tracking number and link appear once it has
            shipped.
          </>
        ),
        text: "track tracking status shipped",
      },
    ],
  },
  {
    category: "Returns & refunds",
    items: [
      {
        q: "Can I return something?",
        a: (
          <>
            For hygiene reasons, opened personal-care and wellness products generally can’t be returned. Eligibility and the
            return window are set out in our <L to="/returns">Return & Refund Policy</L>.
          </>
        ),
        text: "return refund hygiene opened eligible window",
      },
      {
        q: "What if my item arrives damaged or wrong?",
        a: (
          <>
            Our <L to="/returns">Return Policy</L> asks you to email us within 48 hours of delivery with your order number and
            photos of the issue, so we can arrange a replacement or refund.
          </>
        ),
        text: "damaged wrong defective broken",
      },
      {
        q: "How do I request a return?",
        a: (
          <>
            After delivery, open the order in <L to="/orders">My Orders</L> and choose “Request a return”. If you paid cash on
            delivery, the form asks for a bank account for your refund.
          </>
        ),
        text: "request return how refund cod bank",
      },
    ],
  },
];

const FaqPage: React.FC = () => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("0-0");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.map((c) => ({
      ...c,
      items: c.items.filter((i) => `${i.q} ${i.text}`.toLowerCase().includes(term)),
    })).filter((c) => c.items.length);
  }, [q]);

  return (
    <Container className="pb-16 pt-5 md:pt-8">
      <div className="mx-auto max-w-[860px]">
        <Breadcrumbs items={[{ label: "Help" }]} />
        <div className="mt-8 text-center">
          <h1 className="text-[34px] md:text-[48px]">How can we help?</h1>
          <p className="mt-2 text-[15.5px] text-v2-muted">Quick answers about orders, privacy and delivery.</p>
          <label className="mx-auto mt-6 flex h-14 max-w-lg items-center gap-3 rounded-full border border-v2-line bg-v2-surface px-5 focus-within:border-v2-plum focus-within:ring-4 focus-within:ring-v2-plum/10">
            <IoSearchOutline className="text-v2-muted" size={19} />
            <span className="sr-only">Search help</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search, e.g. “cancel” or “packaging”"
              className="h-full flex-1 bg-transparent text-[16px] outline-none focus-visible:outline-none md:text-[15px]"
            />
          </label>
        </div>

        <div className="mt-12 space-y-10">
          {filtered.length === 0 && (
            <p className="rounded-v2-lg bg-v2-sunken px-5 py-8 text-center text-[15px] text-v2-muted">
              No answers match “{q.trim()}”. Try another word, or contact us below.
            </p>
          )}
          {filtered.map((c, ci) => (
            <section key={c.category}>
              <h2 className="mb-4 text-[20px]">{c.category}</h2>
              <div className="divide-y divide-v2-line overflow-hidden rounded-v2-lg border border-v2-line bg-v2-surface">
                {c.items.map((item, qi) => {
                  const id = `${ci}-${qi}`;
                  const isOpen = open === id || !!q.trim();
                  return (
                    <div key={item.q}>
                      <h3>
                        <button
                          type="button"
                          onClick={() => setOpen(open === id ? null : id)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-${id}`}
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15.5px] font-semibold hover:bg-v2-sunken/40"
                        >
                          {item.q}
                          <IoChevronDown className={cx("shrink-0 text-v2-muted transition-transform", isOpen && "rotate-180")} />
                        </button>
                      </h3>
                      {isOpen && (
                        <div id={`faq-${id}`} className="px-5 pb-5 text-[14.5px] leading-relaxed text-v2-ink/80">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-v2-xl bg-v2-plum-deep p-7 text-white md:p-9">
          <h2 className="text-[24px]">Still have a question?</h2>
          <p className="mt-1.5 text-[15px] text-white/70">Message us — we’re happy to help, discreetly.</p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-v2-plum-deep hover:bg-v2-blush"
            >
              <IoLogoWhatsapp size={18} className="text-[#25D366]" /> Chat on WhatsApp
            </a>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold hover:bg-white/10"
            >
              <IoMailOutline size={18} /> Contact options
            </Link>
          </div>
          <p className="mt-4 text-[13px] text-white/50">Or email {SUPPORT_EMAIL}</p>
        </div>
      </div>
    </Container>
  );
};

export default FaqPage;
