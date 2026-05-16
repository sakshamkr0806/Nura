import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  ClipboardList,
  BookOpen,
  Sparkles,
  Sprout,
  FileText,
  Users,
  User,
  LogOut,
  Flower2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { NotificationBell } from "@/features/alerts/components/NotificationBell";
import { 
  FloralDecoration, 
  WomanTea,
  Sparkle,
  Heart
} from "@/components/shared/Illustrations";

const sidebarItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Calendar, label: "Cycle", path: "/calendar" },
  { icon: ClipboardList, label: "Log", path: "/log" },
  { icon: BookOpen, label: "Learn", path: "/education" },
  { icon: Sparkles, label: "Coach", path: "/coach", tag: "New" },
  { icon: Sprout, label: "Seeds", path: "/seeds" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (_error) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans watercolor-bg overflow-hidden relative">
      {/* Background Blobs */}
      <div className="blob w-72 h-72 bg-coral top-0 -left-20 animation-delay-2000" />
      <div className="blob w-96 h-96 bg-sage-green bottom-0 right-0 animation-delay-4000" />
      <div className="blob w-80 h-80 bg-lavender top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Sidebar */}
      <aside className="hidden w-72 flex-col bg-white/40 backdrop-blur-2xl border-r border-peach/20 md:flex relative z-10">
        <div className="p-10 relative">
          <div className="absolute top-4 left-4 opacity-20 floating">
            <Sparkle className="w-4 h-4 text-gold" />
          </div>
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-coral/10 rounded-2xl group-hover:bg-coral/20 transition-all duration-500 transform group-hover:rotate-12">
              <Flower2 className="text-coral" size={28} />
            </div>
            <span className="text-2xl font-serif font-bold text-text-primary tracking-tight">
              CycleWell
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 px-8 space-y-2 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-3.5 rounded-[20px] transition-all duration-500 group relative overflow-hidden ${
                  isActive
                    ? "bg-coral text-white premium-shadow translate-x-2"
                    : "text-text-secondary hover:bg-white/60 hover:text-text-primary"
                }`
              }
            >
              <div className="flex items-center gap-4 relative z-10">
                <item.icon size={20} className={`shrink-0 transition-transform duration-500 group-hover:scale-110`} />
                <span className="font-medium tracking-wide">{item.label}</span>
              </div>
              {item.tag && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-lavender/40 backdrop-blur-sm text-text-primary rounded-full relative z-10">
                  {item.tag}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-8 space-y-8 relative">
          {/* Daily Affirmation Card */}
          <div className="relative p-8 rounded-[32px] bg-gradient-to-br from-white/60 to-peach/30 border border-white/60 overflow-hidden group premium-shadow">
            <div className="absolute -right-4 -bottom-4 opacity-30 group-hover:opacity-50 transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-12">
              <FloralDecoration className="w-24 h-24" />
            </div>
            <div className="absolute top-2 right-4 opacity-20 floating">
              <Heart className="w-3 h-3 text-coral" />
            </div>
            <h4 className="text-sm font-serif font-bold text-text-primary mb-3">Daily Affirmation</h4>
            <p className="text-[11px] text-text-secondary leading-relaxed italic relative z-10">
              "You're doing better than you think. Keep going, beautiful 🌸"
            </p>
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-4 px-6 py-7 rounded-[20px] text-text-secondary hover:text-coral hover:bg-white/60 transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-transparent relative z-10">
        {/* Header */}
        <header className="flex h-24 items-center justify-between px-10 bg-transparent">
          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
              <span className="text-xl">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Search symptoms, questions, articles..." 
              className="w-full pl-14 pr-8 py-4 rounded-[24px] bg-white/40 backdrop-blur-md border border-white/20 premium-shadow focus:ring-4 focus:ring-coral/10 transition-all duration-500 text-sm outline-none placeholder:text-text-secondary/40"
            />
          </div>

          <div className="flex items-center gap-8">
            <NotificationBell />
            <div className="flex items-center gap-4 pl-6 border-l border-peach/30">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-text-primary">{user?.fullName || "Ananya"}</p>
                <p className="text-[10px] text-text-secondary/60 uppercase tracking-[0.2em] font-bold">Member</p>
              </div>
              <div className="h-12 w-12 rounded-[20px] bg-white p-0.5 premium-shadow overflow-hidden group cursor-pointer border-2 border-white transition-transform duration-300 hover:scale-105">
                <div className="w-full h-full rounded-[18px] bg-peach flex items-center justify-center overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-text-primary font-bold text-lg">{user?.fullName?.[0] || "A"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <div className="mx-auto max-w-[1550px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
