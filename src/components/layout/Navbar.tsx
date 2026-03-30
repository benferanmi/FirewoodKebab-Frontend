import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useScrolled } from "@/hooks/useUtilHooks";
import { NAV_LINKS, APP_NAME } from "@/utils/constants";
import logoBlack from "@/assets/logo_black.png";
import logoWhite from "@/assets/logo_white.png";
import logoBlackTransparent from "@/assets/logo_black_transparent.png";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(50);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const itemCount = useCartStore((s) => s.getItemCount());
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const user = useAuthStore((s) => s.user);
  const syncFromServer = useCartStore((s) => s.syncFromServer);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [cartSyncing, setCartSyncing] = useState(false);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  useEffect(() => {
    if (isAuthenticated()) {
      setCartSyncing(true);
      syncFromServer().finally(() => setCartSyncing(false));
    }
  }, [isAuthenticated()]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-card/95 backdrop-blur-md shadow-card border-b border-border"
        }`}
      >
        <div className="container-wide flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span
              className={`font-display text-2xl md:text-3xl font-bold tracking-tight transition-colors ${
                isTransparent ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              <img
                src={isTransparent ? logoWhite : logoBlack}
                alt="FirewoodKebab Logo"
                className="h-[60px] w-auto block dark:hidden"
                height="60"
              />
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? isTransparent
                      ? "text-primary-foreground bg-primary-foreground/20"
                      : "text-primary bg-accent"
                    : isTransparent
                      ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className={`relative p-2.5 rounded-lg transition-colors ${
                isTransparent
                  ? "text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartSyncing ? (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </span>
              ) : itemCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              ) : null}
            </button>

            {user ? (
              <Link
                to="/account"
                className={`p-2.5 rounded-lg transition-colors ${
                  isTransparent
                    ? "text-primary-foreground hover:bg-primary-foreground/10"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:inline-flex"
                >
                  Sign In
                </Button>
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-lg transition-colors ${
                isTransparent
                  ? "text-primary-foreground hover:bg-primary-foreground/10"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-card pt-20 md:hidden"
          >
            <nav className="flex flex-col p-6 gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-primary bg-accent"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full mt-4" size="lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
