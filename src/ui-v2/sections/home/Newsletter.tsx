import React, { useState } from "react";
import { IoCheckmarkCircle, IoMailOutline } from "react-icons/io5";
import { Button, Container, Section } from "../../primitives";
import { inputClasses } from "../../primitives/Field";
import { cx } from "../../lib/format";

/*
 * v1 NewsletterSection only set local state — there is no subscribe API yet.
 * Same behaviour here; wire `onSubscribe` to a real endpoint when it exists.
 */
const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <Section tight>
      <Container>
        <div className="relative overflow-hidden rounded-v2-xl bg-v2-plum px-6 py-12 text-white sm:px-12 md:py-16">
          <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-v2-coral/40 blur-3xl" />
          <div aria-hidden className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-[30px] md:text-[40px]">Private offers, straight to your inbox</h2>
              <p className="mt-3 max-w-md text-[15px] text-white/75">
                Early access to sales and new launches. Plain subject lines, unsubscribe anytime.
              </p>
            </div>
            {done ? (
              <p className="flex items-center gap-3 rounded-v2-lg bg-white/10 p-5 text-[15px] font-medium" role="status">
                <IoCheckmarkCircle size={24} className="shrink-0 text-v2-butter" />
                You’re on the list. Watch for a discreet hello from us.
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="flex flex-col gap-2.5 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Email address</span>
                  <IoMailOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-v2-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cx(inputClasses, "h-14 rounded-full border-transparent pl-11")}
                  />
                </label>
                <Button type="submit" size="lg" variant="accent">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Newsletter;
