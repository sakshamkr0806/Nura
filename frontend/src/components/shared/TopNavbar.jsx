import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { FlowerLogo } from "@/components/shared/Illustrations";
import { NotificationBell } from "@/features/alerts/components/NotificationBell";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Cycle", path: "/calendar" },
  { label: "Log", path: "/log" },
  { label: "Learn", path: "/education" },
  { label: "Coach", path: "/coach" },
  { label: "Seeds", path: "/seeds" },
  { label: "Reports", path: "/reports" },
  { label: "Community", path: "/community" },
];

export default function TopNavbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      /* silent */
    }
    logout();
    toast.success("See you soon! 🌸");
    navigate("/login");
    setOpen(false);
  };

  return (
    <header className="nura-navbar sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="transition-transform duration-300 group-hover:rotate-12">
              <FlowerLogo className="w-9 h-9" />
            </div>
            <span
              className="text-2xl font-serif font-bold"
              style={{ color: "#2D1F1A" }}
            >
              Nura
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `px-3 lg:px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive ? "nav-link-active" : "nav-link-idle"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <NotificationBell />
                <Link to="/profile">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm text-white transition-transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                      boxShadow: "0 2px 8px rgba(246,165,142,0.4)",
                    }}
                  >
                    {(
                      user.fullName?.[0] ||
                      user.email?.[0] ||
                      "U"
                    ).toUpperCase()}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-full text-[#8C7B74] hover:text-[#F6A58E] hover:bg-[rgba(246,165,142,0.1)] transition-all"
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="rounded-full border-[rgba(246,165,142,0.5)] text-[#F6A58E] hover:bg-[rgba(246,165,142,0.08)] h-9 px-5 text-sm font-semibold"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="rounded-full h-9 px-5 text-sm font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                      boxShadow: "0 2px 12px rgba(246,165,142,0.35)",
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell />}
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl text-[#8C7B74] hover:bg-[rgba(246,165,142,0.1)] transition-colors"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-[rgba(246,165,142,0.12)] bg-[rgba(255,249,247,0.97)] backdrop-blur-xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-white"
                      : "text-[#8C7B74] hover:bg-[rgba(246,165,142,0.08)] hover:text-[#2D1F1A]"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                      }
                    : {}
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="h-px bg-[rgba(246,165,142,0.12)] my-3" />

            {user ? (
              <div className="flex items-center justify-between px-2 py-2">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                    }}
                  >
                    {(user.fullName?.[0] || "U").toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-[#2D1F1A]">
                    {user.fullName || "Profile"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-[#F6A58E]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-[rgba(246,165,142,0.5)] text-[#F6A58E]"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button
                    className="w-full rounded-2xl text-white"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
