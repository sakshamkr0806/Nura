import { Outlet } from "react-router-dom";
import TopNavbar from "@/components/shared/TopNavbar";

export default function DashboardLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FFF9F7" }}
    >
      <TopNavbar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
