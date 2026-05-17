import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import {
  PottedPlant,
  HeartDoodle,
  StarDoodle,
  FloralDecoration,
} from "@/components/shared/Illustrations";

export default function PlaceholderPage({
  title = "Coming Soon",
  description = "We're handcrafting this wellness experience for you. Stay tuned!",
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="max-w-md w-full text-center space-y-8 relative">
        {/* Floating doodles */}
        <div
          className="absolute -top-8 -left-8 opacity-25 floating pointer-events-none"
          style={{ color: "#F8B6B6" }}
        >
          <HeartDoodle className="w-7 h-7" />
        </div>
        <div
          className="absolute -top-6 -right-6 opacity-20 floating pointer-events-none"
          style={{ animationDelay: "2s", color: "#D4A843" }}
        >
          <StarDoodle className="w-7 h-7" />
        </div>

        {/* Card */}
        <div
          className="relative rounded-[40px] border p-12 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(246,165,142,0.15)",
            boxShadow: "0 8px 48px rgba(200,150,130,0.12)",
          }}
        >
          <div className="absolute -right-8 -bottom-8 opacity-8 pointer-events-none">
            <FloralDecoration className="w-48 h-48" />
          </div>

          {/* Plant illustration */}
          <div className="flex justify-center mb-6">
            <PottedPlant className="w-20 h-24" />
          </div>

          <div className="space-y-4">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(246,165,142,0.1)", color: "#F6A58E" }}
            >
              <Sparkles size={11} className="animate-pulse" />
              Under Construction
            </span>

            <h1
              className="font-serif font-bold text-4xl leading-tight"
              style={{ color: "#2D1F1A" }}
            >
              {title}
            </h1>

            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: "#8C7B74" }}
            >
              {description}
            </p>
          </div>

          <div className="my-8 text-5xl animate-bounce">🌸</div>

          <Link to="/dashboard">
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 group"
              style={{
                background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                boxShadow: "0 4px 16px rgba(246,165,142,0.35)",
              }}
            >
              <ArrowLeft
                size={15}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to Sanctuary
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
