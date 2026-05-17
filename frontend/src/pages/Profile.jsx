import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Shield, LogOut } from "lucide-react";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
      toast.success("See you soon! 🌸");
      navigate("/login");
    } catch (_error) {
      logout();
      navigate("/login");
    }
  };

  if (!user) return null;

  const infoRows = [
    { icon: Mail, label: "Email Address", value: user.email },
    {
      icon: Phone,
      label: "Phone Number",
      value: user.phoneNumber || "Not provided",
    },
    { icon: Shield, label: "Account Role", value: user.role },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Hero */}
      <div className="page-hero">
        <h1
          className="font-serif font-bold text-4xl"
          style={{ color: "#2D1F1A" }}
        >
          Your Profile 🌸
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
          Manage your account and wellness preferences.
        </p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-3xl border overflow-hidden relative"
        style={{
          background: "white",
          borderColor: "rgba(246,165,142,0.12)",
          boxShadow: "0 4px 32px rgba(200,150,130,0.1)",
        }}
      >
        {/* Coloured header strip */}
        <div
          className="h-28 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,182,182,0.3), rgba(234,220,248,0.3))",
          }}
        >
          <div className="absolute -right-8 -top-8 opacity-15 pointer-events-none">
            <FloralDecoration className="w-40 h-40" />
          </div>
        </div>

        {/* Avatar overlapping strip */}
        <div className="px-8 pb-8 -mt-12 space-y-6">
          <div className="flex items-end gap-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-serif font-bold text-white border-4 border-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #F6A58E, #CDB4F6)",
                boxShadow: "0 4px 16px rgba(246,165,142,0.35)",
              }}
            >
              {(user.fullName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="pb-2">
              <h2
                className="font-serif font-bold text-2xl"
                style={{ color: "#2D1F1A" }}
              >
                {user.fullName || "Wellness Member"}
              </h2>
              <p className="text-xs font-medium" style={{ color: "#8C7B74" }}>
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 rounded-2xl border"
                style={{
                  borderColor: "rgba(246,165,142,0.12)",
                  background: "rgba(255,249,247,0.5)",
                }}
              >
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: "rgba(246,165,142,0.1)" }}
                >
                  <Icon size={16} style={{ color: "#F6A58E" }} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "#8C7B74" }}
                  >
                    {label}
                  </p>
                  <p
                    className="text-sm font-semibold capitalize"
                    style={{ color: "#2D1F1A" }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sign out */}
          <Button
            className="w-full gap-2 rounded-2xl font-bold text-sm"
            style={{
              background: "rgba(248,182,182,0.15)",
              color: "#D9534F",
              border: "1.5px solid rgba(248,182,182,0.4)",
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
