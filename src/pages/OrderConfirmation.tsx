import React from "react";
import { motion } from "framer-motion";
import { IoArrowForward, IoCheckmark, IoCubeOutline, IoReceiptOutline, IoSearchOutline } from "react-icons/io5";
import { useLastOrder } from "../hooks/useCheckout";
import { ButtonLink, Container } from "../components/ui";

/*
 * old claimed "We've sent a confirmation email" — the magic-checkout completion
 * handler on the server sends no email, so v2 doesn't promise one.
 */
const NEXT = [
  { icon: IoReceiptOutline, title: "Order confirmed", desc: "Your order is saved to your account." },
  { icon: IoCubeOutline, title: "Packed discreetly", desc: "Plain outer box, no product names on the label." },
  { icon: IoSearchOutline, title: "Track anytime", desc: "Follow progress from My Orders." },
];

const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useLastOrder();
  return (
    <Container className="py-14 text-center md:py-20">
      <div className="mx-auto max-w-[760px]">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-v2-sage text-white shadow-v2"
      >
        <IoCheckmark size={40} />
      </motion.span>
      <h1 className="mt-7 text-[34px] md:text-[46px]">Thank you — order placed</h1>
      <p className="mx-auto mt-3 max-w-md text-[15.5px] text-v2-muted">
        {orderNumber ? (
          <>
            Your order number is <span className="font-semibold text-v2-ink">#{orderNumber}</span>. Keep it handy if you
            contact us.
          </>
        ) : (
          "Your order has been received. You’ll find it in My Orders."
        )}
      </p>

      <ol className="mt-10 grid gap-3 text-left sm:grid-cols-3">
        {NEXT.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="rounded-v2-lg border border-v2-line bg-v2-surface p-5">
            <Icon className="text-v2-plum" size={22} />
            <p className="mt-3 text-[15px] font-semibold">{title}</p>
            <p className="mt-1 text-[13.5px] text-v2-muted">{desc}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-col justify-center gap-2.5 sm:flex-row">
        <ButtonLink to="/orders" size="lg">
          View my orders
        </ButtonLink>
        <ButtonLink to="/shop" size="lg" variant="secondary">
          Continue shopping <IoArrowForward />
        </ButtonLink>
      </div>
      </div>
    </Container>
  );
};

export default OrderConfirmationPage;
