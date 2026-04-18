import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Wrench,
  Users,
  MessageSquare,
  Newspaper,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import logo from "@/assets/resliving-logo.svg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Features", path: "/features" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

const managerNavItems = [
  { label: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
  { label: "Maintenance", path: "/manager/maintenance", icon: Wrench },
  { label: "Visitors", path: "/manager/visitors", icon: Users },
  { label: "Messages", path: "/manager/messages", icon: MessageSquare },
  { label: "Community", path: "/manager/community", icon: Newspaper },
  { label: "Settings", path: "/manager/settings", icon: SettingsIcon },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const isManagerRoute = location.pathname.startsWith("/manager");

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/");
  };

  const handleExitDashboard = () => {
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ResLiving" className="h-10 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Link to="/manager-login">
                    <Button variant="ghost" size="sm" className="text-sm font-medium">
                      Manager Login
                    </Button>
                  </Link>
                  <Link to="/get-started">
                    <Button
                      size="sm"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <Link to="/manager/dashboard">
                    <Button
                      size="sm"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-6"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && !isManagerRoute && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/manager-login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">
                        Manager Login
                      </Button>
                    </Link>
                    <Link to="/get-started" onClick={() => setMobileOpen(false)}>
                      <Button
                        className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        size="sm"
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-base font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                    <Link to="/manager/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button
                        className="w-full h-12 text-base font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && isManagerRoute && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed top-0 left-0 z-50 h-screen w-[86%] max-w-[320px] bg-[#D2042D] text-white shadow-xl"
            >
              <div className="flex h-full flex-col px-6 py-6 pt-20">
                <div className="pb-6 border-b border-white/15">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Manager Area
                  </p>
                  <p className="text-lg font-semibold mt-3 text-white">
                    {user?.user_metadata?.full_name || user?.email || "Manager"}
                  </p>
                </div>

                <nav className="mt-6 space-y-2">
                  {managerNavItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                          location.pathname === item.path
                            ? "bg-[#4169E1] text-white shadow-sm"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/15 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-base font-medium border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={handleExitDashboard}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Exit Dashboard
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full h-12 justify-start text-base font-medium text-white hover:bg-white/10 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
