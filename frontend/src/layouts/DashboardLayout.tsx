import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, LogOut, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/api/axios';
import { toast } from 'sonner';
import { NotificationBell } from '@/features/alerts/components/NotificationBell';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      logout(); // Force logout on client even if server fails
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="text-2xl font-bold text-primary">CycleWell</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
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
        <div className="p-4 border-t">
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <div className="md:hidden font-bold text-xl">CycleWell</div>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0] || user?.email?.[0] || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
