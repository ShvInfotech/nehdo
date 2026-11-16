import React from "react";
import { IoCardOutline, IoCashOutline, IoCubeOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { Container } from "../../primitives";
import { FREE_SHIPPING_ABOVE } from "../../config";

const ITEMS = [
  { icon: IoCubeOutline, title: "Discreet packaging", desc: "Plain box, no product names" },
  { icon: IoCardOutline, title: "Private billing", desc: "Neutral name on your statement" },
  { icon: IoCashOutline, title: "Cash on delivery", desc: `Free shipping above ₹${FREE_SHIPPING_ABOVE}` },
  { icon: IoShieldCheckmarkOutline, title: "100% genuine", desc: "Sealed, from authorised brands" },
];

/** v2 replacement for FeaturesSection. */
const TrustStrip: React.FC = () => (
  <section aria-label="Why shop with us" className="pb-4 pt-6 md:pt-8">
    <Container>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex flex-col items-start gap-2.5 rounded-v2-lg border border-v2-line bg-v2-surface p-4 md:flex-row md:items-center md:gap-3 md:p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-v2-lilac text-v2-plum">
              <Icon size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold leading-tight">{title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-v2-muted">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);

export default TrustStrip;
