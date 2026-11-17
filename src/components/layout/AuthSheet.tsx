import React, { useState } from "react";
import { IoArrowBack, IoCloseOutline, IoLockClosedOutline, IoLogoGoogle, IoMailOutline, IoPersonOutline } from "react-icons/io5";
import { useAuthFlow } from "../../hooks/useAuthFlow";
import { Button, Field, Sheet } from "../ui";

const copy = {
  login: { title: "Welcome back", sub: "Sign in to track orders and see your saved items." },
  signup: { title: "Create your account", sub: "Faster checkout, order tracking and a private wishlist." },
  forgot: { title: "Reset your password", sub: "We’ll email you a secure link to set a new one." },
};

/** Replacement for AuthModal. All behaviour comes from useAuthFlow. */
const AuthSheet: React.FC = () => {
  const flow = useAuthFlow();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { view, busy } = flow;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (view === "forgot") {
      await flow.sendReset(email);
      return;
    }
    const ok = await flow.submit({ name, email, password });
    if (ok) {
      setName("");
      setPassword("");
    }
  };

  return (
    <Sheet open={flow.open} onClose={flow.close} side="center" hideHeader title={copy[view].title}>
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={flow.close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-v2-sunken"
        >
          <IoCloseOutline size={22} />
        </button>

        {view === "forgot" && (
          <button
            type="button"
            onClick={() => flow.switchTo("login")}
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-v2-muted hover:text-v2-ink"
          >
            <IoArrowBack /> Back to sign in
          </button>
        )}

        <h2 className="pr-8 text-[26px]">{copy[view].title}</h2>
        <p className="mt-1.5 text-[14.5px] text-v2-muted">{copy[view].sub}</p>

        {view !== "forgot" && (
          <>
            <Button
              variant="secondary"
              block
              size="lg"
              className="mt-6"
              loading={busy === "google"}
              onClick={flow.googleLogin}
            >
              <IoLogoGoogle size={18} /> Continue with Google
            </Button>
            <div className="my-5 flex items-center gap-3 text-[12px] font-medium uppercase tracking-wider text-v2-muted">
              <span className="h-px flex-1 bg-v2-line" /> or <span className="h-px flex-1 bg-v2-line" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className={view === "forgot" ? "mt-6 space-y-4" : "space-y-4"}>
          {view === "signup" && (
            <Field
              label="Name"
              icon={<IoPersonOutline />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="What should we call you?"
              required
            />
          )}
          <Field
            label="Email"
            type="email"
            icon={<IoMailOutline />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          {view !== "forgot" && (
            <div>
              <Field
                label="Password"
                type="password"
                icon={<IoLockClosedOutline />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={view === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                required
              />
              {view === "login" && (
                <button
                  type="button"
                  onClick={() => flow.switchTo("forgot")}
                  className="mt-2 text-[13px] font-semibold text-v2-plum hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          <Button type="submit" block size="lg" loading={busy === "form" || busy === "forgot"}>
            {view === "login" ? "Sign in" : view === "signup" ? "Create account" : "Send reset link"}
          </Button>
        </form>

        {view !== "forgot" && (
          <p className="mt-5 text-center text-[14px] text-v2-muted">
            {view === "login" ? "New to Nehdo? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => flow.switchTo(view === "login" ? "signup" : "login")}
              className="font-semibold text-v2-plum hover:underline"
            >
              {view === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-v2 bg-v2-sunken px-3.5 py-3 text-[12.5px] text-v2-muted">
          <IoLockClosedOutline className="mt-0.5 shrink-0 text-v2-sage" />
          Order emails never mention product names in the subject line.
        </p>
      </div>
    </Sheet>
  );
};

export default AuthSheet;
