import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Calendar,
  Activity,
  Brain,
  Bell,
  BookOpen,
  FileText,
  ArrowRight,
  Flower
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  // Redirect authenticated users to the dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: "Cycle Tracking",
      description: "Log dates, track symptoms, and predict your next cycle with precision.",
      icon: Calendar,
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    },
    {
      title: "Daily Health Logs",
      description: "Keep a detailed journal of your mood, sleep, water intake, and physical symptoms.",
      icon: Activity,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "AI Insights",
      description: "Get personalized wellness recommendations based on your unique patterns.",
      icon: Brain,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Smart Alerts",
      description: "Receive medical suggestions and attention alerts when anomalies are detected.",
      icon: Bell,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
    {
      title: "Educational Hub",
      description: "Learn about your body with curated, science-backed articles and guides.",
      icon: BookOpen,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Health Reports",
      description: "Export beautiful PDF reports to share with your healthcare provider.",
      icon: FileText,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 selection:bg-purple-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-full duration-500">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl">
            <Flower className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            CycleWell
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-full transition-all shadow-md hover:shadow-lg shadow-purple-500/20"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse"></span>
            Your intelligent health companion
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
            Understand your body,<br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              empower your health.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            CycleWell is an AI-powered platform designed to help you track your cycle, understand your symptoms, and gain actionable insights into your overall wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:scale-105 rounded-full transition-transform"
            >
              Get started for free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 space-y-12">
          <div className="text-center animate-in fade-in duration-700 delay-300 fill-mode-both">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Everything you need</h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">Comprehensive tools for a healthier you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-900/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className={`inline-flex p-3 rounded-2xl ${feature.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flower className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-zinc-900 dark:text-white">CycleWell</span>
          </div>
          <p className="text-sm text-zinc-500">© 2026 CycleWell. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
