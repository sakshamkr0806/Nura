import { useEffect, useState } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { TrendCharts } from "@/features/insights/components/TrendCharts";
import { WellnessGauge } from "@/features/analytics/components/WellnessGauge";
import {
  Droplets,
  Moon,
  Utensils,
  Heart,
  RefreshCcw,
  Sparkles,
  Award,
  Zap,
  Target,
  Smile,
  CheckSquare,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/api/axios";
import { toast } from "sonner";

const PHASE_DETAILS = {
  "Menstrual Phase": {
    title: "Menstrual Phase 🌸",
    description:
      "Energy may feel lower today. Be gentle with yourself and prioritize rest.",
    accentColor: "#F8B6B6",
    textColor: "#C87B7B",
  },
  "Follicular Phase": {
    title: "Follicular Phase 🌱",
    description:
      "Your energy is rising! A perfect time to plan, create, and start new projects.",
    accentColor: "#BDD7B3",
    textColor: "#5A8A4E",
  },
  "Ovulatory Phase": {
    title: "Ovulatory Phase ☀️",
    description:
      "You are at your peak communication and social energy today. Glow and connect!",
    accentColor: "#F6A58E",
    textColor: "#C86A4E",
  },
  "Luteal Phase": {
    title: "Luteal Phase 🌙",
    description:
      "Time to slow down, reflect, and turn inward. Focus on comforting and nurturing self-care.",
    accentColor: "#CDB4F6",
    textColor: "#7B5EA7",
  },
  "No Active Cycle": {
    title: "Cycle Sanctuary ✨",
    description:
      "Log your last period to start tracking your natural biological rhythms.",
    accentColor: "#F6A58E",
    textColor: "#C86A4E",
  },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState({
    period: [],
    prediction: [],
    logged: [],
  });
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState({});

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics/summary");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const DEFAULT_PROFILE = {
    wellnessScore: 0,
    cycleHealthScore: 0,
    sleepScore: 0,
    stressScore: 0,
    stressIndicator: "Unknown",
    sleepAnalysis:
      "Start logging your daily data so we can analyze your sleep patterns.",
    stressAnalysis:
      "Log your moods and symptoms daily to get a personalized stress analysis.",
    cycleInsights:
      "Track your cycle and symptoms consistently to unlock AI-powered insights.",
    hydrationRecs: [
      "Aim for 2-3 liters of water daily",
      "Start your morning with a glass of warm water",
    ],
    nutritionRecs: [
      "Eat a balanced diet rich in whole foods",
      "Include iron-rich foods during your period",
    ],
    actionPlan: [
      "Log your symptoms daily in the calendar",
      'Click "Refresh AI Insights" after a few days of logging',
    ],
    dailyRecs: [
      "Drink a glass of water first thing in the morning",
      "Take a 5-minute breathing break",
    ],
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/ai/profile");
      setProfile(
        res.data && Object.keys(res.data).length > 0
          ? res.data
          : DEFAULT_PROFILE,
      );
    } catch (err) {
      console.error("Failed to fetch AI health profile", err);
      setProfile(DEFAULT_PROFILE);
    }
  };

  const fetchCycleData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const [cyclesRes, predictionsRes, logsRes] = await Promise.all([
        api.get("/cycles"),
        api.get("/cycles/predictions"),
        api.get(
          `/logs/range?start=${currentYear - 2}-01-01&end=${currentYear + 2}-12-31`,
        ),
      ]);
      const periods = [];
      cyclesRes.data.forEach((cycle) => {
        const start = new Date(cycle.startDate);
        const end = cycle.endDate ? new Date(cycle.endDate) : new Date();
        let current = new Date(start);
        while (current <= end) {
          periods.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
      });
      const predictions = [];
      if (predictionsRes.data?.predictedNextPeriod) {
        const predStart = new Date(predictionsRes.data.predictedNextPeriod);
        for (let i = 0; i < 5; i++) {
          const d = new Date(predStart);
          d.setDate(d.getDate() + i);
          predictions.push(d);
        }
      }
      const logged = [];
      logsRes.data?.forEach((log) => {
        const d = new Date(log.date);
        logged.push(d);
        if (log.symptoms?.includes("Period Day")) periods.push(d);
        if (log.symptoms?.includes("Predicted Period")) predictions.push(d);
      });
      setHighlightedDates({ period: periods, prediction: predictions, logged });
    } catch (err) {
      console.error("Failed to fetch cycle data", err);
    }
  };

  const handleRefreshAI = async () => {
    setIsAiLoading(true);
    try {
      await api.post("/ai/re-analyze");
      toast.success("AI Profile updated successfully! ✨");
      await Promise.all([fetchProfile(), fetchAnalytics(), fetchCycleData()]);
    } catch (err) {
      console.error("Failed to refresh AI profile", err);
      toast.error("Failed to refresh insights. Log more daily data first!");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProfile();
    fetchCycleData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) setIsLoggingOpen(true);
  };

  const toggleTask = (task) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [task]: !prev[task],
    }));
  };

  const firstName = user?.fullName?.split(" ")[0] || "Lovely";

  const metricCards = [
    {
      label: "Cycle Day",
      value: analytics?.metrics?.cycleDay
        ? `Day ${analytics.metrics.cycleDay}`
        : "Day 0",
      sub: analytics?.metrics?.cyclePhase || "No Active Cycle",
      Icon: Droplets,
      color: "#F8B6B6",
      bg: "#FFF0ED",
    },
    {
      label: "Next Period",
      value: analytics?.metrics?.nextPeriodDays
        ? `${analytics.metrics.nextPeriodDays} Days`
        : "0 Days",
      sub: analytics?.metrics?.predictedDate || "No prediction",
      Icon: Heart,
      color: "#CDB4F6",
      bg: "#F7F3FF",
    },
    {
      label: "Log Streak",
      value: `${user?.currentStreak || 0} Days`,
      sub: `Best: ${user?.longestStreak || 0} days`,
      Icon: Zap,
      color: "#F6A58E",
      bg: "#FFF5F2",
    },
    {
      label: "Avg Sleep",
      value: analytics?.metrics?.avgSleep
        ? `${analytics.metrics.avgSleep}h`
        : "0h",
      sub: "Weekly average",
      Icon: Moon,
      color: "#EADCF8",
      bg: "#F3ECF9",
    },
    {
      label: "Water Intake",
      value: analytics?.metrics?.avgWater
        ? `${(analytics.metrics.avgWater / 1000).toFixed(1)}L`
        : "0L",
      sub: "Daily average",
      Icon: Utensils,
      color: "#DDEAD7",
      bg: "#F0FFF4",
    },
  ];

  const cycleDay = analytics?.metrics?.cycleDay || 0;
  const cyclePhase = analytics?.metrics?.cyclePhase || "No Active Cycle";
  const nextPeriodDays = analytics?.metrics?.nextPeriodDays || 0;
  const phaseInfo =
    PHASE_DETAILS[cyclePhase] || PHASE_DETAILS["No Active Cycle"];

  return (
    <div className="space-y-8 pb-12">
      {/* ── PAGE HEADER / HERO BANNER ── */}
      <div
        className="relative overflow-hidden rounded-[2rem] border transition-all duration-300 shadow-md"
        style={{
          backgroundImage: "url('/images/botanical_banner_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderColor: "rgba(246, 165, 142, 0.25)",
        }}
      >
        {/* Soft glassmorphic overlay for readable text */}
        <div
          className="w-full h-full p-6 md:p-8 flex flex-col gap-6"
          style={{
            background: "rgba(255, 253, 252, 0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Top Row: Greeting & Refresh AI Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            <div>
              <h1
                className="font-serif font-bold text-3xl md:text-4xl leading-tight"
                style={{ color: "#2D1F1A" }}
              >
                Welcome, {firstName} 🌸
              </h1>
              <p
                className="mt-1 text-xs md:text-sm font-medium"
                style={{ color: "#8C7B74" }}
              >
                Your personalized AI hormonal health sanctuary.
              </p>
            </div>

            <Button
              onClick={handleRefreshAI}
              disabled={isAiLoading}
              className="btn-primary-nura flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200 self-start sm:self-auto"
            >
              <RefreshCcw
                size={15}
                className={isAiLoading ? "animate-spin" : ""}
              />
              <span>Refresh AI Insights</span>
            </Button>
          </div>

          {/* Middle Row: Phase Callout */}
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border"
                style={{
                  backgroundColor: `${phaseInfo.accentColor}22`,
                  borderColor: `${phaseInfo.accentColor}44`,
                  color: phaseInfo.textColor,
                }}
              >
                {phaseInfo.title}
              </span>
            </div>

            <p
              className="text-sm md:text-base font-semibold leading-relaxed"
              style={{ color: "#4A4A4A" }}
            >
              {phaseInfo.description}
            </p>
          </div>

          {/* Bottom Row: Inline Quick Stats */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-2 z-10">
            {/* Stat 1: Cycle Day */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-peach/10 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7B74]">
                Day of Cycle
              </span>
              <span className="text-xs font-extrabold text-[#2D1F1A]">
                Day {cycleDay}
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-peach/25" />

            {/* Stat 2: Days Until Next Period */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-peach/10 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7B74]">
                Next Period
              </span>
              <span className="text-xs font-extrabold text-[#2D1F1A]">
                {nextPeriodDays} Days
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-peach/25" />

            {/* Stat 3: Current Phase */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 border border-peach/10 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7B74]">
                Current Phase
              </span>
              <span
                className="text-xs font-extrabold"
                style={{ color: phaseInfo.textColor }}
              >
                {cyclePhase}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="metric-card rounded-3xl p-5 border border-transparent shadow-sm flex flex-col justify-between"
            style={{ background: card.bg }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: "#8C7B74" }}
              >
                {card.label}
              </span>
              <div
                className="p-1.5 rounded-xl"
                style={{ background: `${card.color}30` }}
              >
                <card.Icon size={14} style={{ color: card.color }} />
              </div>
            </div>
            <p
              className="text-2xl font-serif font-bold"
              style={{ color: "#2D1F1A" }}
            >
              {card.value}
            </p>
            <p
              className="text-[11px] mt-1 font-medium"
              style={{ color: "#8C7B74" }}
            >
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── HEALTH PROFILE SCORES ── */}
      {profile && (
        <section
          className="rounded-3xl p-6 border"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,182,182,0.08), rgba(255,255,255,1))",
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <h2 className="font-serif font-bold text-xl mb-6 text-[#2D1F1A]">
            AI Health Profile Analysis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <WellnessGauge
              score={profile.wellnessScore || 0}
              label="Wellness Score"
            />
            <WellnessGauge
              score={profile.cycleHealthScore || 0}
              label="Cycle Health"
            />
            <WellnessGauge
              score={profile.sleepScore || 0}
              label="Sleep Quality"
            />
            <WellnessGauge
              score={profile.stressScore || 0}
              label="Stress Balance"
            />
          </div>
        </section>
      )}

      {/* ── DUAL COLUMN LAYOUT ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Daily Checklist & Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Checklist */}
          {profile?.dailyRecs && (
            <div
              className="rounded-3xl p-6 border bg-white"
              style={{
                borderColor: "rgba(246,165,142,0.12)",
                boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-4 text-[#2D1F1A] flex items-center gap-2">
                <CheckSquare className="text-[#8BC0D0]" size={20} />
                My Daily Wellness Checklist
              </h3>
              <div className="space-y-3">
                {profile.dailyRecs.map((rec) => {
                  const isChecked = !!checkedTasks[rec];
                  return (
                    <button
                      key={rec}
                      type="button"
                      onClick={() => toggleTask(rec)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border border-rose-50 text-left transition-all hover:bg-[#FFFAF8]"
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? "bg-[#8BC0D0] border-[#8BC0D0] text-white"
                            : "border-zinc-300"
                        }`}
                      >
                        {isChecked && <Sparkles size={12} />}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          isChecked
                            ? "line-through text-zinc-400"
                            : "text-[#2D1F1A]"
                        }`}
                      >
                        {rec}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Plan */}
          {profile?.actionPlan && (
            <div
              className="rounded-3xl p-6 border bg-white"
              style={{
                borderColor: "rgba(246,165,142,0.12)",
                boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-4 text-[#2D1F1A] flex items-center gap-2">
                <Target className="text-[#F6A58E]" size={20} />
                Hormonal Action Plan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.actionPlan.map((action, idx) => (
                  <div
                    key={action}
                    className="p-4 rounded-2xl border border-[#FFF0ED] bg-[#FFF9F7] flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#FFF0ED] text-[#F6A58E] flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#2D1F1A] leading-relaxed">
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cycle Insights Analysis */}
          {profile && (
            <div
              className="rounded-3xl p-6 border bg-[#FFFAF8]"
              style={{
                borderColor: "rgba(246,165,142,0.15)",
                boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-4 text-[#2D1F1A] flex items-center gap-2">
                <BookOpen className="text-[#F6A58E]" size={20} />
                AI Cycle & Symptom Insights
              </h3>
              <p className="text-xs font-medium text-[#8C7B74] leading-relaxed">
                {profile.cycleInsights}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2D1F1A] mb-2 flex items-center gap-1.5">
                    <Moon size={12} className="text-[#CDB4F6]" /> Sleep Analysis
                  </h4>
                  <p className="text-[11px] text-[#8C7B74] leading-relaxed bg-white border p-3 rounded-2xl">
                    {profile.sleepAnalysis}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#2D1F1A] mb-2 flex items-center gap-1.5">
                    <Smile size={12} className="text-[#F8B6B6]" /> Stress
                    Analysis
                  </h4>
                  <p className="text-[11px] text-[#8C7B74] leading-relaxed bg-white border p-3 rounded-2xl">
                    {profile.stressAnalysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Nutrition, Hydration & Alerts */}
        <div className="space-y-6">
          {/* Nutrition recommendations */}
          {profile?.nutritionRecs && (
            <div
              className="rounded-3xl p-6 border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(221,234,215,0.15), white)",
                borderColor: "rgba(221,234,215,0.3)",
                boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-4 text-[#2D1F1A] flex items-center gap-2">
                <Award className="text-green-600" size={20} />
                Nutrition Recommendations
              </h3>
              <ul className="space-y-3">
                {profile.nutritionRecs.map((rec) => (
                  <li
                    key={rec}
                    className="text-xs font-semibold text-[#8C7B74] flex items-start gap-2.5"
                  >
                    <span className="text-green-500 mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hydration recommendations */}
          {profile?.hydrationRecs && (
            <div
              className="rounded-3xl p-6 border bg-[#F0FFF4]/20"
              style={{
                borderColor: "rgba(221,234,215,0.4)",
                boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-4 text-[#2D1F1A] flex items-center gap-2">
                <Droplets className="text-blue-500" size={20} />
                Hydration Insights
              </h3>
              <ul className="space-y-3">
                {profile.hydrationRecs.map((rec) => (
                  <li
                    key={rec}
                    className="text-xs font-semibold text-[#8C7B74] flex items-start gap-2.5"
                  >
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── CALENDAR + CHARTS ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="rounded-3xl overflow-hidden border bg-white"
          style={{
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <CycleCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            highlightedDates={highlightedDates}
          />
        </div>
        <div
          className="rounded-3xl p-6 border bg-white"
          style={{
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <h2
            className="font-serif font-bold text-xl mb-4"
            style={{ color: "#2D1F1A" }}
          >
            Health Trends
          </h2>
          <TrendCharts />
        </div>
      </div>

      <LoggingModal
        date={selectedDate}
        isOpen={isLoggingOpen}
        onClose={() => setIsLoggingOpen(false)}
        onSave={() => {
          fetchCycleData();
          fetchAnalytics();
        }}
      />
    </div>
  );
}
