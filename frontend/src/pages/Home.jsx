import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNavbar from "@/components/shared/TopNavbar";
import Footer from "@/components/shared/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  CalmWomanIllustration,
  WomenSupportingIllustration,
  CycleTrackerIllustration,
  SymptomLoggerIllustration,
  InsightsIllustration,
  RemindersIllustration,
  CommunityIllustration,
  WaterCup,
  HealthyFoodBowl,
  RunningShoes,
  MoonStars,
  EnvelopeIllustration,
  PottedPlant,
  HeartDoodle,
  StarDoodle,
  CloudDoodle,
  FloralDecoration,
} from "@/components/shared/Illustrations";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

const TOOLS = [
  {
    title: "Cycle Tracker",
    desc: "Track your cycle with ease",
    Icon: CycleTrackerIllustration,
    bg: "#FFF0ED",
  },
  {
    title: "Symptom Logger",
    desc: "Log symptoms and moods",
    Icon: SymptomLoggerIllustration,
    bg: "#F7F3FF",
  },
  {
    title: "Insights",
    desc: "Get personalised health insights",
    Icon: InsightsIllustration,
    bg: "#FFFBF0",
  },
  {
    title: "Reminders",
    desc: "Never miss what matters",
    Icon: RemindersIllustration,
    bg: "#F0FFF4",
  },
  {
    title: "Community",
    desc: "Connect and share support",
    Icon: CommunityIllustration,
    bg: "#FFF5F8",
  },
];

const CARE = [
  { label: "Drink Water", Icon: WaterCup },
  { label: "Eat Healthy", Icon: HealthyFoodBowl },
  { label: "Move More", Icon: RunningShoes },
  { label: "Rest Well", Icon: MoonStars },
];

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're in! Welcome to the Nura sanctuary 🌸");
    setEmail("");
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "#FFF9F7", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Decorative background image */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/home-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      <div className="relative z-10">
      <TopNavbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Floating doodles */}
          <div
            className="absolute top-12 left-6 opacity-25 floating pointer-events-none"
            style={{ color: "#F8B6B6" }}
          >
            <HeartDoodle className="w-7 h-7" />
          </div>
          <div
            className="absolute top-20 right-1/4 opacity-20 floating pointer-events-none"
            style={{ animationDelay: "2s", color: "#CDB4F6" }}
          >
            <StarDoodle className="w-8 h-8" />
          </div>
          <div
            className="absolute bottom-16 left-1/4 opacity-15 floating pointer-events-none"
            style={{ animationDelay: "4s", color: "#EADCF8" }}
          >
            <CloudDoodle className="w-16 h-10" />
          </div>

          {/* Left column */}
          <div className="space-y-7 z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(246,165,142,0.12)", color: "#F6A58E" }}
            >
              <Sparkles size={12} className="animate-pulse" />
              Hormonal Wellness Companion
            </div>

            <h1
              className="font-serif font-bold leading-tight"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
                color: "#2D1F1A",
              }}
            >
              Smarter{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hormonal Health
              </span>{" "}
              Companion
            </h1>

            <p
              className="text-base leading-relaxed font-medium"
              style={{ color: "#8C7B74", maxWidth: "460px" }}
            >
              Understand your cycle. Balance your hormones.
              <br />
              Live your <em style={{ color: "#F6A58E" }}>best you.</em>
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to={user ? "/dashboard" : "/signup"}>
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:-translate-y-0.5 group"
                  style={{
                    background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                    boxShadow: "0 4px 18px rgba(246,165,142,0.4)",
                  }}
                >
                  Get Started
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <Link to="/education">
                <button
                  className="px-7 py-3.5 rounded-2xl text-sm font-bold border-2 transition-all hover:bg-[rgba(234,220,248,0.15)]"
                  style={{
                    borderColor: "rgba(205,180,246,0.5)",
                    color: "#9B6FD4",
                  }}
                >
                  Explore Features
                </button>
              </Link>
            </div>
          </div>

          {/* Right column — empty to maintain grid layout, illustration removed as requested */}
          <div className="relative flex justify-center lg:justify-end z-0">
          </div>
        </div>
      </section>

      {/* ─── FEATURED TOOLS ─── */}
      <section
        className="py-20"
        style={{
          background: "rgba(255,255,255,0.5)",
          borderTop: "1px solid rgba(246,165,142,0.08)",
          borderBottom: "1px solid rgba(246,165,142,0.08)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
          <div className="space-y-3">
            <h2
              className="font-serif font-bold text-4xl"
              style={{ color: "#2D1F1A" }}
            >
              Featured Tools <span style={{ color: "#F6A58E" }}>✦</span>
            </h2>
            <p className="text-sm font-medium" style={{ color: "#8C7B74" }}>
              Everything you need for your hormonal wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="group p-6 rounded-3xl border border-[rgba(246,165,142,0.1)] flex flex-col gap-5 cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: tool.bg,
                  boxShadow: "0 2px 16px rgba(200,150,130,0.08)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(200,150,130,0.18)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 16px rgba(200,150,130,0.08)")
                }
              >
                <tool.Icon className="w-14 h-14" />
                <div>
                  <h3
                    className="font-serif font-bold text-base"
                    style={{ color: "#2D1F1A" }}
                  >
                    {tool.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "#8C7B74" }}>
                    {tool.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DAILY CARE ─── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-[40px] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,249,247,1) 0%, rgba(250,242,234,0.6) 100%)",
              border: "1.5px solid rgba(246,165,142,0.12)",
              boxShadow: "0 4px 32px rgba(200,150,130,0.1)",
            }}
          >
            {/* Floral bg */}
            <div className="absolute right-0 bottom-0 opacity-8 pointer-events-none">
              <FloralDecoration className="w-80 h-80" />
            </div>

            <div className="max-w-xs space-y-5 z-10">
              <h2
                className="font-serif font-bold text-3xl md:text-4xl"
                style={{ color: "#2D1F1A" }}
              >
                Daily Care For You <span style={{ color: "#F8B6B6" }}>♡</span>
              </h2>
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: "#8C7B74" }}
              >
                Small steps every day lead to big changes over time.
              </p>
              <Link to="/education">
                <button
                  className="mt-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                    boxShadow: "0 4px 14px rgba(246,165,142,0.35)",
                  }}
                >
                  Learn More
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-6 z-10 flex-1">
              {CARE.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-white/80 transition-transform hover:-translate-y-1.5"
                  style={{ boxShadow: "0 2px 12px rgba(200,150,130,0.08)" }}
                >
                  <item.Icon className="w-16 h-16" />
                  <span
                    className="text-xs font-bold text-center"
                    style={{ color: "#2D1F1A" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ABOUT + TESTIMONIAL ─── */}
      <section className="py-4 pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About card */}
          <div
            className="relative overflow-hidden rounded-[36px] p-10 min-h-[320px] flex flex-col justify-between transition-transform hover:-translate-y-1.5"
            style={{
              background: "linear-gradient(135deg, #FFFDF9, #FAF2EA)",
              border: "1.5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 24px rgba(200,150,130,0.1)",
            }}
          >
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <FloralDecoration className="w-56 h-56" />
            </div>
            <div className="space-y-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(221,234,215,0.5)",
                  color: "#5A8A4E",
                }}
              >
                Our Approach
              </span>
              <h3
                className="font-serif font-bold text-3xl"
                style={{ color: "#2D1F1A" }}
              >
                About Our Approach
              </h3>
              <p
                className="text-sm leading-relaxed font-medium"
                style={{ color: "#8C7B74" }}
              >
                We combine science, self-care, and community to help you
                understand your body better — through every phase of your cycle.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-6 group"
              style={{ color: "#F6A58E" }}
            >
              Discover Our Mission{" "}
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Testimonial card */}
          <div
            className="relative overflow-hidden rounded-[36px] p-10 min-h-[320px] flex flex-col justify-between transition-transform hover:-translate-y-1.5"
            style={{
              background:
                "linear-gradient(135deg, #FCF8FF, rgba(234,220,248,0.3))",
              border: "1.5px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 24px rgba(200,150,130,0.1)",
            }}
          >
            <div className="absolute right-0 bottom-0 w-48 h-36 opacity-25 pointer-events-none">
              <WomenSupportingIllustration className="w-full h-full" />
            </div>
            <div className="space-y-4">
              <span
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(246,165,142,0.15)",
                  color: "#F6A58E",
                }}
              >
                You're Not Alone
              </span>
              <p
                className="font-serif text-lg font-semibold leading-relaxed"
                style={{ color: "#2D1F1A" }}
              >
                "CycleWell helped me understand my cycle and feel in control
                like never before."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #F6A58E, #CDB4F6)",
                }}
              >
                A
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2D1F1A" }}>
                  — Ananya, 24
                </p>
                <p className="text-[10px]" style={{ color: "#8C7B74" }}>
                  Community Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className="relative overflow-hidden rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background:
                "linear-gradient(135deg, #FDFBFD, rgba(234,220,248,0.25))",
              border: "1.5px solid rgba(205,180,246,0.2)",
              boxShadow: "0 4px 32px rgba(200,150,130,0.08)",
            }}
          >
            <div className="absolute left-4 bottom-0 opacity-20 pointer-events-none">
              <PottedPlant className="w-16 h-20" />
            </div>
            <div
              className="absolute top-4 right-12 opacity-20 floating pointer-events-none"
              style={{ color: "#D4A843" }}
            >
              <StarDoodle className="w-5 h-5" />
            </div>

            <div className="space-y-3 z-10 text-center md:text-left">
              <h2
                className="font-serif font-bold text-3xl md:text-4xl"
                style={{ color: "#2D1F1A" }}
              >
                Stay in the loop
              </h2>
              <p
                className="text-sm font-medium"
                style={{ color: "#8C7B74", maxWidth: "340px" }}
              >
                Get tips, updates, and special offers straight to your inbox.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-3 w-full max-w-md z-10"
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={16}
                  style={{ color: "#F6A58E" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm font-medium outline-none border"
                  style={{
                    background: "white",
                    borderColor: "rgba(246,165,142,0.2)",
                    color: "#2D1F1A",
                    boxShadow: "0 2px 8px rgba(200,150,130,0.08)",
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl text-sm font-bold text-white shrink-0 transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                  boxShadow: "0 4px 14px rgba(246,165,142,0.35)",
                }}
              >
                Subscribe
              </button>
            </form>

            <div className="hidden lg:block shrink-0 z-10">
              <EnvelopeIllustration className="w-24 h-20" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
}
