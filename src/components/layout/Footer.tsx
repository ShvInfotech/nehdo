import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoAdd, IoLockClosedOutline, IoLogoInstagram, IoLogoWhatsapp } from "react-icons/io5";
import { cx } from "../../lib/format";
import { FOOTER_COLUMNS, INSTAGRAM_URL, PAYMENT_METHODS, SUPPORT_WHATSAPP } from "../../config";

const Column: React.FC<{ heading: string; links: { label: string; href: string }[] }> = ({ heading, links }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:py-0"
      >
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/50">{heading}</span>
        <IoAdd className={cx("text-white/60 transition-transform md:hidden", open && "rotate-45")} />
      </button>
      <ul className={cx("space-y-2.5 pb-4 md:mt-4 md:block md:pb-0", open ? "block" : "hidden")}>
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.href} className="text-[14.5px] text-white/80 transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="mt-10 bg-v2-plum-deep text-white">
    <div className="mx-auto max-w-[1320px] px-4 pb-8 pt-14 sm:px-6 md:pt-20 lg:px-10">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <img src={`${import.meta.env.BASE_URL}images/nehdo-logo.png`} alt="Nehdo Wellness" style={{ filter: "brightness(0) invert(1)" }} className="h-9 w-auto" />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">
            Sexual wellness, without the awkwardness. Genuine products, honest guidance, and packaging that keeps it
            between you and your doorstep.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href={`https://wa.me/${SUPPORT_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <IoLogoWhatsapp size={18} />
            </a>
            {/* shown once INSTAGRAM_URL is set in config.ts */}
            {INSTAGRAM_URL && (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <IoLogoInstagram size={18} />
              </a>
            )}
          </div>
        </div>
        <div className="grid md:col-span-8 md:grid-cols-4 md:gap-8">
          {FOOTER_COLUMNS.map((c) => (
            <Column key={c.heading} {...c} />
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-5 rounded-v2-lg bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
        <p className="flex items-center gap-2.5 text-[14px] text-white/80">
          <IoLockClosedOutline className="shrink-0 text-lg text-v2-coral" />
          Plain outer box. Neutral name on your bank statement. Product names never on the label.
        </p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Payment methods">
          {PAYMENT_METHODS.map((m) => (
            <li key={m} className="rounded-md border border-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white/70">
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* right padding keeps clear of the global WhatsApp button */}
      <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pr-16 pt-6 text-[12.5px] text-white/50 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Nehdo Wellness. For adults 18+ only.</p>
        <p>Made with care in India</p>
      </div>
    </div>
  </footer>
);

export default Footer;
