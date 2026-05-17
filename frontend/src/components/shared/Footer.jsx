import React from "react";
import { Link } from "react-router-dom";
import {
  FlowerLogo,
  FloralDecoration,
} from "@/components/shared/Illustrations";
import { Globe, Send, Share2, Heart } from "lucide-react";

const EXPLORE = [
  { label: "Cycle Calendar", path: "/calendar" },
  { label: "Symptom Logger", path: "/log" },
  { label: "Education Hub", path: "/education" },
  { label: "AI Coach", path: "/coach" },
  { label: "Seed Cycling", path: "/seeds" },
  { label: "Doctor Reports", path: "/reports" },
];
const COMPANY = [
  { label: "About Us", path: "/" },
  { label: "Our Philosophy", path: "/" },
  { label: "Privacy Policy", path: "/" },
  { label: "Terms of Service", path: "/" },
];
const SUPPORT = [
  { label: "Help Center", path: "/" },
  { label: "FAQ", path: "/" },
  { label: "Contact Support", path: "/" },
  { label: "Doctor Partnership", path: "/" },
];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t"
      style={{ background: "#FFF5F2", borderColor: "rgba(246,165,142,0.12)" }}
    >
      {/* Floral doodles */}
      <div className="absolute -left-8 bottom-0 opacity-10 pointer-events-none">
        <FloralDecoration className="w-52 h-52" />
      </div>
      <div className="absolute -right-8 top-0 opacity-10 pointer-events-none rotate-180">
        <FloralDecoration className="w-52 h-52" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-10">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b"
          style={{ borderColor: "rgba(246,165,142,0.12)" }}
        >
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-2.5">
              <FlowerLogo className="w-9 h-9" />
              <span
                className="text-2xl font-serif font-bold"
                style={{ color: "#2D1F1A" }}
              >
                Nura
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed italic"
              style={{ color: "#8C7B74", maxWidth: "300px" }}
            >
              Your elegant sanctuary for hormonal health — empowering women
              through cycle literacy, AI coaching, and community.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Send, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 bg-white rounded-full transition-transform hover:scale-110"
                  style={{
                    boxShadow: "0 2px 8px rgba(200,150,130,0.12)",
                    color: "#F6A58E",
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { title: "Explore", links: EXPLORE },
              { title: "Company", links: COMPANY },
              { title: "Support", links: SUPPORT },
            ].map((col) => (
              <div key={col.title} className="space-y-4">
                <h4
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(246,165,142,0.8)" }}
                >
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.path}
                        className="text-sm font-medium transition-colors hover:text-[#F6A58E]"
                        style={{ color: "#8C7B74" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs font-semibold uppercase tracking-[0.1em]"
          style={{ color: "rgba(140,123,116,0.5)" }}
        >
          <span>
            &copy; {new Date().getFullYear()} Nura Wellness. All Rights
            Reserved.
          </span>
          <div
            className="flex items-center gap-1.5 normal-case"
            style={{ color: "rgba(246,165,142,0.7)" }}
          >
            Made with{" "}
            <Heart size={11} className="fill-current animate-pulse mx-0.5" />{" "}
            for women worldwide
          </div>
        </div>
      </div>
    </footer>
  );
}
