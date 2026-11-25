import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../../styles/theme.css";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import AuthSheet from "./AuthSheet";
import AgeGate from "./AgeGate";
import MobileTabBar from "./MobileTabBar";

/** Storefront layout: announcement bar, header, footer, mobile tab bar, overlays. */
const AppShell: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // opt out of the admin/global body styles in index.css (grain overlay, fonts)
  useEffect(() => {
    document.body.classList.add("v2-active");
    return () => document.body.classList.remove("v2-active");
  }, []);

  return (
    <div className="v2 flex min-h-screen flex-col">
      <a
        href="#v2-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[999] focus:rounded-full focus:bg-v2-plum focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="v2-main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileTabBar />
      <AuthSheet />
      <AgeGate />
    </div>
  );
};

export default AppShell;
