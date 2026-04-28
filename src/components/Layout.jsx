import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // no animation, immediate jump
    });
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ✅ this fixes your issue */}
      <ScrollToTop />

      <main className="flex-1 pt-16 lg:pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
