import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoArrowForward, IoLogoWhatsapp, IoMailOutline, IoTimeOutline } from "react-icons/io5";
import { Breadcrumbs, Button, Container, Field } from "../components/ui";
import { inputClasses } from "../components/ui/Field";
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP } from "../config";
import { cx } from "../lib/format";

/*
 * the old UI's contact form only faked a submit ("Simulate API call"), so messages were
 * lost, and it listed placeholder phone numbers and a "123 Fashion Street"
 * address. There is no contact API, so v2 opens a pre-filled email to the real
 * support address instead and shows WhatsApp. Swap `send` for an API call when
 * one exists.
 */
const TOPICS = ["An existing order", "Product question", "Returns & refunds", "Something else"];

const ContactPage: React.FC = () => {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${topic}${order.trim() ? ` — order #${order.trim().replace(/^#/, "")}` : ""}`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <Container className="pb-16 pt-5 md:pt-8">
      <Breadcrumbs items={[{ label: "Help", to: "/faq" }, { label: "Contact" }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-[34px] md:text-[48px]">Talk to us</h1>
        <p className="mt-2 text-[15.5px] text-v2-muted">
          Questions about a product or an order? Reach us however is most comfortable for you. Many answers are already in{" "}
          <Link to="/faq" className="font-semibold text-v2-plum underline underline-offset-2">
            Help
          </Link>
          .
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
        <div className="space-y-3">
          <a
            href={`https://wa.me/${SUPPORT_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-v2-xl border border-v2-line bg-v2-surface p-5 transition-shadow hover:shadow-v2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-v2 bg-[#25D366]/15 text-[#1a9c4b]">
              <IoLogoWhatsapp size={24} />
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-semibold">WhatsApp</span>
              <span className="block text-[13.5px] text-v2-muted">Chat with our team</span>
            </span>
            <IoArrowForward className="text-v2-muted transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="group flex items-center gap-4 rounded-v2-xl border border-v2-line bg-v2-surface p-5 transition-shadow hover:shadow-v2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-v2 bg-v2-lilac text-v2-plum">
              <IoMailOutline size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-semibold">Email</span>
              <span className="block truncate text-[13.5px] text-v2-muted">{SUPPORT_EMAIL}</span>
            </span>
            <IoArrowForward className="text-v2-muted transition-transform group-hover:translate-x-0.5" />
          </a>
          <div className="flex items-start gap-4 rounded-v2-xl bg-v2-sunken/70 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-v2 bg-v2-surface text-v2-plum">
              <IoTimeOutline size={22} />
            </span>
            <span className="text-[14px]">
              <span className="block font-semibold">Support hours</span>
              <span className="block text-v2-muted">Monday – Saturday, 10:00 AM – 7:00 PM IST</span>
              <span className="mt-1 block text-[12.5px] text-v2-muted">As listed in our Shipping Policy.</span>
            </span>
          </div>
        </div>

        <form onSubmit={send} className="rounded-v2-xl bg-v2-surface p-6 shadow-v2-sm md:p-8">
          <h2 className="text-[22px]">Write to us</h2>
          <p className="mt-1 text-[14px] text-v2-muted">This opens your email app with your message ready to send.</p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-[13px] font-semibold">What’s it about?</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={topic === t}
                  onClick={() => setTopic(t)}
                  className={cx(
                    "inline-flex min-h-11 items-center rounded-full md:min-h-0 px-3.5 py-2 text-[13px] font-semibold transition-colors",
                    topic === t ? "bg-v2-ink text-white" : "border border-v2-line bg-v2-surface hover:border-v2-ink/30",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 space-y-4">
            <Field label="Order number (optional)" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="e.g. NEH10482" />
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">Message</span>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className={cx(inputClasses, "h-auto resize-y py-3")}
              />
            </label>
          </div>
          <Button type="submit" size="lg" block className="mt-6">
            <IoMailOutline size={18} /> Open email to send
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ContactPage;
