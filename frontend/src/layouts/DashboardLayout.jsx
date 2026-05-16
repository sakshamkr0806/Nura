import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  User,
  LogOut,
  FileText,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";
import { toast } from "sonner";
import { NotificationBell } from "@/features/alerts/components/NotificationBell";

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
      logout(); // Force logout on client even if server fails
      navigate("/login");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-card md:flex">
          <div className="border-b p-6">
            <Link to="/" className="text-2xl font-bold text-primary">
              CycleWell
            </Link>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <LayoutDashboard size={20} />
                Dashboard
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Calendar size={20} />
                Cycle Calendar
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <FileText size={20} />
                Doctor Reports
              </Button>
            </Link>
            <Link to="/education">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <BookOpen size={20} />
                Education Hub
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User size={20} />
                Profile
              </Button>
            </Link>
          </nav>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="text-xl font-bold md:hidden">CycleWell</div>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <NotificationBell />
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {user?.fullName?.[0] || user?.email?.[0] || "U"}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-muted/30">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
