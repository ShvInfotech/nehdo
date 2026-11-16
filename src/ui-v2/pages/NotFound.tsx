import React from "react";
import { ButtonLink, Container } from "../primitives";

const NotFound: React.FC = () => (
  <Container className="py-24 text-center md:py-32">
    <p className="font-v2-display text-[80px] font-semibold leading-none text-v2-plum/20 md:text-[120px]">404</p>
    <h1 className="mt-4 text-[30px] md:text-[38px]">This page doesn’t exist</h1>
    <p className="mx-auto mt-2 max-w-sm text-[15px] text-v2-muted">The link may be old or mistyped. Let’s get you somewhere useful.</p>
    <div className="mt-7 flex flex-wrap justify-center gap-2.5">
      <ButtonLink to="/" size="lg">
        Go home
      </ButtonLink>
      <ButtonLink to="/shop" size="lg" variant="secondary">
        Browse the shop
      </ButtonLink>
    </div>
  </Container>
);

export default NotFound;
