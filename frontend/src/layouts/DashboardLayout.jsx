import { Outlet } from "react-router-dom";
import TopNavbar from "@/components/shared/TopNavbar";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "#FFF9F7" }}
    >
      {/* Decorative background image - full page fixed */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/images/home-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
