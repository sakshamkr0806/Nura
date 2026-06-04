import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { TrendCharts } from "@/features/insights/components/TrendCharts";
import { WellnessGauge } from "@/features/analytics/components/WellnessGauge";
import { useCycleData } from "@/hooks/useCycleData";
import {
  SketchyHeart,
  SketchyFlower,
  SketchyLeaf,
  SketchyCloud,
  SketchySwirl,
  SketchySparkles,
  DailyChecklistDoodle,
  CycleDayIllust,
  NextPeriodIllust,
  LogStreakIllust,
  AvgSleepIllust,
  WaterIntakeIllust,
} from "@/components/shared/Illustrations";
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
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from "@/api/axios";
import { toast } from "sonner";

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

const PHASE_TASKS = {
  "Menstrual Phase": [
    { text: "Drink warm ginger tea", emoji: "🍵" },
    { text: "Do gentle yoga or rest", emoji: "🧘" },
    { text: "Take iron-rich foods", emoji: "🥗" },
    { text: "Apply heat for cramps", emoji: "🔥" },
    { text: "Sleep by 10pm", emoji: "😴" },
    { text: "Journal your feelings", emoji: "✍️" },
  ],
  "Follicular Phase": [
    { text: "Drink 2L water", emoji: "💧" },
    { text: "Try a new workout", emoji: "💪" },
    { text: "Eat leafy greens", emoji: "🥬" },
    { text: "Take flax seeds", emoji: "🌱" },
    { text: "Get morning sunlight", emoji: "☀️" },
    { text: "Plan your week", emoji: "📅" },
  ],
  "Ovulatory Phase": [
    { text: "Drink coconut water", emoji: "🥥" },
    { text: "High intensity workout", emoji: "⚡" },
    { text: "Eat colourful antioxidants", emoji: "🫐" },
    { text: "Take sesame seeds", emoji: "🌱" },
    { text: "Connect with someone", emoji: "👭" },
    { text: "Practice gratitude", emoji: "🙏" },
  ],
  "Luteal Phase": [
    { text: "Drink chamomile tea", emoji: "🍵" },
    { text: "Take a walk", emoji: "🚶‍♀️" },
    { text: "Eat dark chocolate (70%+)", emoji: "🍫" },
    { text: "Take sunflower seeds", emoji: "🌻" },
    { text: "Limit caffeine", emoji: "☕" },
    { text: "Wind down 1hr before bed", emoji: "🌙" },
  ],
  "No Active Cycle": [
    { text: "Drink a glass of water first thing in the morning", emoji: "💧" },
    { text: "Take a 5-minute breathing break", emoji: "🧘" },
    { text: "Log your energy levels", emoji: "⚡" },
    { text: "Go for a short morning walk", emoji: "🚶‍♀️" },
    { text: "Set a positive daily intention", emoji: "✨" },
    { text: "Sleep by 10:30pm", emoji: "😴" },
  ],
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activePopover, setActivePopover] = useState(null); // 'period' | 'streak' | null
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState(() => {
    try {
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const saved = localStorage.getItem("nura_checklist_tasks");
      if (saved) {
        const { date, tasks } = JSON.parse(saved);
        if (date === todayKey) {
          return tasks || {};
        }
      }
    } catch (e) {
      console.error("Failed to load checklist from localStorage", e);
    }
    return {};
  });
  const { highlightedDates, cycles, predictions, refetchCycleData, dailyLogs } =
    useCycleData();

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await api.get("/analytics/summary");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Failed to fetch analytics summary:", error);
      // Analytics unavailable — metric cards will show defaults
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/ai/profile");
      setProfile(
        res.data && Object.keys(res.data).length > 0
          ? res.data
          : DEFAULT_PROFILE,
      );
    } catch (error) {
      console.error("Failed to fetch AI profile:", error);
      setProfile(DEFAULT_PROFILE);
    }
  }, []);

  const handleRefreshAI = async () => {
    setIsAiLoading(true);
    try {
      await api.post("/ai/re-analyze");
      toast.success("AI Profile updated successfully! ✨");
      await Promise.all([fetchProfile(), fetchAnalytics(), refetchCycleData()]);
    } catch {
      toast.error("Failed to refresh insights. Log more daily data first!");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProfile();
  }, [fetchAnalytics, fetchProfile]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) setIsLoggingOpen(true);
  };

  const toggleTask = (task) => {
    setCheckedTasks((prev) => {
      const updated = {
        ...prev,
        [task]: !prev[task],
      };
      try {
        const todayKey = format(new Date(), "yyyy-MM-dd");
        localStorage.setItem(
          "nura_checklist_tasks",
          JSON.stringify({ date: todayKey, tasks: updated }),
        );
      } catch (e) {
        console.error("Failed to save checklist to localStorage", e);
      }
      return updated;
    });
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
      IllustComponent: CycleDayIllust,
      doodleType: "flower",
      onClick: () => navigate("/calendar"),
      color: "#F8B6B6",
      doodleColor: "#F8B6B6",
      bg: "#FFF0ED",
      id: "period",
    },
    {
      label: "Next Period",
      value: analytics?.metrics?.nextPeriodDays
        ? `${analytics.metrics.nextPeriodDays} Days`
        : "0 Days",
      sub: analytics?.metrics?.predictedDate || "No prediction",
      Icon: Heart,
      IllustComponent: NextPeriodIllust,
      doodleType: "heart",
      onClick: () =>
        setActivePopover(activePopover === "period" ? null : "period"),
      color: "#CDB4F6",
      doodleColor: "#CDB4F6",
      bg: "#F7F3FF",
      id: "next-period",
    },
    {
      label: "Log Streak",
      value: `${user?.currentStreak || 0} Days`,
      sub: `Best: ${user?.longestStreak || 0} days`,
      Icon: Zap,
      IllustComponent: LogStreakIllust,
      doodleType: "sparkles",
      onClick: () =>
        setActivePopover(activePopover === "streak" ? null : "streak"),
      color: "#F6A58E",
      doodleColor: "#F6A58E",
      bg: "#FFF5F2",
      id: "streak",
    },
    {
      label: "Avg Sleep",
      value: analytics?.metrics?.avgSleep
        ? `${analytics.metrics.avgSleep}h`
        : "0h",
      sub: "Weekly average",
      Icon: Moon,
      IllustComponent: AvgSleepIllust,
      doodleType: "cloud",
      onClick: () => {
        document
          .getElementById("chart-sleep")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      color: "#EADCF8",
      doodleColor: "#CDB4F6",
      bg: "#F3ECF9",
      id: "sleep",
    },
    {
      label: "Water Intake",
      value: analytics?.metrics?.avgWater
        ? `${(analytics.metrics.avgWater / 1000).toFixed(1)}L`
        : "0L",
      sub: "Daily average",
      Icon: Utensils,
      IllustComponent: WaterIntakeIllust,
      doodleType: "leaf",
      onClick: () => {
        document
          .getElementById("chart-water")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      color: "#DDEAD7",
      doodleColor: "#BDD7B3",
      bg: "#F0FFF4",
      id: "water",
    },
  ];

  const cycleDay = analytics?.metrics?.cycleDay || 0;
  const cyclePhase = analytics?.metrics?.cyclePhase || "No Active Cycle";
  const nextPeriodDays = analytics?.metrics?.nextPeriodDays || 0;
  const phaseInfo =
    PHASE_DETAILS[cyclePhase] || PHASE_DETAILS["No Active Cycle"];

  // Sleep analysis calculations
  const sleepLogs = (dailyLogs || [])
    .filter((log) => log.sleepHours > 0)
    .slice(-7);
  const hasSleepData = sleepLogs.length >= 2;
  const sleepChartData = sleepLogs.map((log) => ({
    day: format(new Date(log.date), "d"),
    hours: log.sleepHours,
  }));

  // Stress analysis calculations
  const stressLogs = (dailyLogs || [])
    .filter((log) => log.stressLevel > 0)
    .slice(-7);
  const hasStressData = stressLogs.length >= 2;
  const stressChartData = stressLogs.map((log) => ({
    day: format(new Date(log.date), "d"),
    stress: log.stressLevel,
  }));

  // Hydration calculations
  const waterLogs = (dailyLogs || []).filter((log) => log.waterIntake > 0);
  const avgWater =
    waterLogs.length > 0
      ? Math.round(
          waterLogs.reduce((acc, log) => acc + log.waterIntake, 0) /
            waterLogs.length,
        )
      : 0;

  // Cycle regularity calculation
  const hasCycles = cycles && cycles.length > 0;
  const isRegular =
    predictions?.averageCycleLength >= 25 &&
    predictions?.averageCycleLength <= 35;

  // Dynamic Health Score calculations
  const validSleepLogs = (dailyLogs || []).filter((log) => log.sleepHours > 0);
  const avgSleepHours =
    validSleepLogs.length > 0
      ? validSleepLogs.reduce((acc, log) => acc + log.sleepHours, 0) /
        validSleepLogs.length
      : 0;

  const calculatedSleepScore =
    avgSleepHours >= 8
      ? 100
      : avgSleepHours >= 7
        ? 85
        : avgSleepHours >= 6
          ? 70
          : avgSleepHours >= 5
            ? 50
            : avgSleepHours >= 4
              ? 30
              : avgSleepHours > 0
                ? 10
                : 0;

  const validWaterLogs = (dailyLogs || []).filter((log) => log.waterIntake > 0);
  const avgWaterIntake =
    validWaterLogs.length > 0
      ? validWaterLogs.reduce((acc, log) => acc + log.waterIntake, 0) /
        validWaterLogs.length
      : 0;

  const totalLogsCount = (dailyLogs || []).length;
  const totalSymptomsCount = (dailyLogs || []).reduce(
    (acc, log) =>
      acc +
      (log.symptoms || []).filter(
        (s) => s !== "Period Day" && s !== "Predicted Period",
      ).length,
    0,
  );
  const avgSymptomsCount =
    totalLogsCount > 0 ? totalSymptomsCount / totalLogsCount : 0;
  const calculatedStressScore =
    totalLogsCount > 0
      ? avgSymptomsCount === 0
        ? 100
        : avgSymptomsCount <= 2
          ? 75
          : avgSymptomsCount <= 4
            ? 50
            : 25
      : 0;

  const avgCycleLength = predictions?.averageCycleLength || 0;
  let calculatedCycleHealthScore = 0;
  if (hasCycles) {
    if (avgCycleLength >= 28 && avgCycleLength <= 32)
      calculatedCycleHealthScore = 100;
    else if (avgCycleLength >= 25 && avgCycleLength <= 35)
      calculatedCycleHealthScore = 85;
    else if (avgCycleLength >= 21 && avgCycleLength <= 40)
      calculatedCycleHealthScore = 70;
    else calculatedCycleHealthScore = 50;
  }

  // Wellness score averages the active components
  const wellnessComponents = [];
  if (avgSleepHours > 0) {
    wellnessComponents.push(
      avgSleepHours >= 8
        ? 100
        : avgSleepHours >= 6
          ? 75
          : avgSleepHours >= 4
            ? 50
            : 25,
    );
  }
  if (avgWaterIntake > 0) {
    wellnessComponents.push(
      avgWaterIntake >= 2000
        ? 100
        : avgWaterIntake >= 1500
          ? 75
          : avgWaterIntake >= 1000
            ? 50
            : 25,
    );
  }
  if (totalLogsCount > 0) {
    wellnessComponents.push(
      avgSymptomsCount === 0
        ? 100
        : avgSymptomsCount <= 2
          ? 75
          : avgSymptomsCount <= 4
            ? 50
            : 25,
    );
  }
  if (hasCycles) {
    const isReg = avgCycleLength >= 25 && avgCycleLength <= 35;
    wellnessComponents.push(isReg ? 100 : 70);
  }

  const calculatedWellnessScore =
    wellnessComponents.length > 0
      ? Math.round(
          wellnessComponents.reduce((acc, s) => acc + s, 0) /
            wellnessComponents.length,
        )
      : 0;

  const handleLogToday = () => {
    setSelectedDate(new Date());
    setIsLoggingOpen(true);
  };

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
          className="w-full h-full p-6 md:p-8 flex flex-col gap-6 relative"
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

      {/* Invisible overlay backdrop for click-away popovers */}
      {activePopover && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => setActivePopover(null)}
        />
      )}

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((card) => {
          // Calculate last 7 days of logging for streak popover dynamically
          const last7DaysInfo = Array.from({ length: 7 })
            .map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              const dateKey = format(d, "yyyy-MM-dd");
              const hasLog = (dailyLogs || []).some((log) => {
                return format(new Date(log.date), "yyyy-MM-dd") === dateKey;
              });
              return {
                dayName: format(d, "EEE"), // e.g. Mon, Tue
                dayNum: format(d, "d"), // e.g. 28
                hasLog,
              };
            })
            .reverse();

          return (
            <div
              key={card.label}
              onClick={card.onClick}
              role="button"
              tabIndex={0}
              className="metric-card rounded-3xl p-5 border border-transparent shadow-sm flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] relative overflow-visible text-left select-none outline-none"
              style={{ background: card.bg }}
            >
              {/* Illustrated Icon floating in top-right */}
              <div className="absolute top-3 right-3 pointer-events-none select-none">
                <card.IllustComponent className="w-12 h-12" />
              </div>

              {/* Hand-Drawn Doodle in background corner */}
              <div className="absolute bottom-2 right-2 opacity-35 pointer-events-none select-none">
                {card.doodleType === "flower" && (
                  <SketchyFlower
                    className="w-8 h-8"
                    style={{ color: card.doodleColor }}
                  />
                )}
                {card.doodleType === "heart" && (
                  <SketchyHeart
                    className="w-7 h-7"
                    style={{ color: card.doodleColor }}
                  />
                )}
                {card.doodleType === "sparkles" && (
                  <SketchySparkles
                    className="w-7 h-7"
                    style={{ color: card.doodleColor }}
                  />
                )}
                {card.doodleType === "cloud" && (
                  <SketchyCloud
                    className="w-8 h-6"
                    style={{ color: card.doodleColor }}
                  />
                )}
                {card.doodleType === "leaf" && (
                  <SketchyLeaf
                    className="w-7 h-7"
                    style={{ color: card.doodleColor }}
                  />
                )}
              </div>

              <div className="mb-3 pr-8">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#8C7B74" }}
                >
                  {card.label}
                </span>
              </div>

              <div>
                <p
                  className="text-2xl font-serif font-bold leading-none mb-1"
                  style={{ color: "#2D1F1A" }}
                >
                  {card.value}
                </p>
                <p
                  className="text-[11px] font-medium"
                  style={{ color: "#8C7B74" }}
                >
                  {card.sub}
                </p>
              </div>

              {/* Popover for Predicted Next Period */}
              {card.id === "next-period" && activePopover === "period" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[105%] left-1/2 -translate-x-1/2 z-50 w-72 md:w-80 p-5 rounded-2xl bg-white border border-[#CDB4F6]/20 shadow-xl animate-fade-in text-left text-[#2D1F1A]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <NextPeriodIllust className="w-8 h-8" />
                    <h4 className="font-serif font-bold text-sm text-[#4E3E5C]">
                      Next Period Prediction
                    </h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F7F3FF] border border-[#CDB4F6]/10">
                      <p className="text-[#8C7B74] font-medium mb-1 uppercase tracking-wider text-[9px]">
                        Predicted Start Date
                      </p>
                      <p className="font-extrabold text-sm text-[#4E3E5C]">
                        {predictions?.predictedNextPeriod
                          ? format(
                              new Date(predictions?.predictedNextPeriod),
                              "MMMM d, yyyy",
                            )
                          : "No prediction data"}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F7F3FF] border border-[#CDB4F6]/10">
                      <p className="text-[#8C7B74] font-medium mb-1 uppercase tracking-wider text-[9px]">
                        Average Cycle Length
                      </p>
                      <p className="font-extrabold text-sm text-[#4E3E5C]">
                        {predictions?.averageCycleLength
                          ? `${Math.round(predictions?.averageCycleLength)} Days`
                          : "28 Days"}
                      </p>
                    </div>
                    <p className="text-[10px] text-[#8C7B74] leading-relaxed">
                      🌸 Predictions are calculated dynamically based on your
                      logged cycles. Consistent daily logs help improve
                      prediction accuracy!
                    </p>
                  </div>
                </div>
              )}

              {/* Popover for Log Streak Details */}
              {card.id === "streak" && activePopover === "streak" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-[105%] left-1/2 -translate-x-1/2 z-50 w-80 p-5 rounded-2xl bg-white border border-[#F6A58E]/20 shadow-xl animate-fade-in text-left text-[#2D1F1A]"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <LogStreakIllust className="w-8 h-8" />
                    <h4 className="font-serif font-bold text-sm text-[#C86A4E]">
                      Your Logging Streak
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#8C7B74] mb-4">
                    Log your symptoms daily to keep your streak glowing! Here is
                    your activity over the last 7 days:
                  </p>

                  {/* 7 Circles Track */}
                  <div className="flex justify-between items-center gap-1 mb-4">
                    {last7DaysInfo.map((day, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1.5 flex-1"
                      >
                        <span className="text-[9px] font-bold text-[#8C7B74] uppercase">
                          {day.dayName.substring(0, 2)}
                        </span>
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                            day.hasLog
                              ? "bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] text-white shadow-sm"
                              : "border border-[#F6A58E]/20 bg-[#FFFBF9] text-[#8C7B74]",
                          )}
                        >
                          {day.hasLog ? "✓" : day.dayNum}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Streak Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#F6A58E]/10 pt-3">
                    <div>
                      <span className="text-[#8C7B74] block text-[9px] uppercase font-bold">
                        Current Streak
                      </span>
                      <span className="text-sm font-extrabold text-[#C86A4E]">
                        🔥 {user?.currentStreak || 0} Days
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8C7B74] block text-[9px] uppercase font-bold">
                        Longest Streak
                      </span>
                      <span className="text-sm font-extrabold text-[#C86A4E]">
                        🏆 {user?.longestStreak || 0} Days
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
              score={calculatedWellnessScore}
              label="Wellness Score"
            />
            <WellnessGauge
              score={calculatedCycleHealthScore}
              label="Cycle Health"
            />
            <WellnessGauge score={calculatedSleepScore} label="Sleep Quality" />
            <WellnessGauge
              score={calculatedStressScore}
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
          {profile && (
            <div className="relative">
              {/* Decorative Doodles around Daily Checklist Card */}
              <div className="absolute -top-6 -left-6 opacity-30 pointer-events-none text-[#F8B6B6] floating">
                <SketchyFlower className="w-12 h-12" />
              </div>
              <div
                className="absolute -bottom-6 -right-6 opacity-30 pointer-events-none text-[#F8B6B6] floating"
                style={{ animationDelay: "1.5s" }}
              >
                <SketchyFlower className="w-10 h-10 rotate-45" />
              </div>
              <div
                className="absolute top-1/2 -left-8 opacity-25 pointer-events-none text-[#EADCF8] floating"
                style={{ animationDelay: "3s" }}
              >
                <SketchySwirl className="w-16 h-8" />
              </div>
              <div
                className="absolute -top-8 right-12 opacity-25 pointer-events-none text-[#FAF2EA] floating"
                style={{ animationDelay: "2s" }}
              >
                <SketchyCloud className="w-14 h-9" />
              </div>
              <div
                className="absolute bottom-1/3 -right-6 opacity-35 pointer-events-none text-[#CDB4F6] floating"
                style={{ animationDelay: "4s" }}
              >
                <SketchySparkles className="w-8 h-8" />
              </div>
              <div
                className="absolute -bottom-8 left-12 opacity-30 pointer-events-none text-[#EADCF8] floating"
                style={{ animationDelay: "2.5s" }}
              >
                <SketchyLeaf className="w-8 h-8 -rotate-45" />
              </div>
              <div
                className="absolute top-4 -right-6 opacity-25 pointer-events-none text-[#F8B6B6] floating"
                style={{ animationDelay: "1s" }}
              >
                <SketchyHeart className="w-6 h-6 rotate-12" />
              </div>

              <div
                className="rounded-[32px] p-6 border transition-all duration-300 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #FFF9F6 0%, #FFFDFD 100%)",
                  borderColor: "rgba(246,165,142,0.15)",
                  boxShadow: "0 2px 20px rgba(200,150,130,0.06)",
                }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  {/* Left Column: Checklist & Goals */}
                  <div className="flex-1 min-w-0">
                    {/* Header Title with CheckSquare and Streak Badge */}
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C86A4E] bg-[#FFF0ED] px-2.5 py-0.5 rounded-full border border-[#FFF0ED]">
                          {cyclePhase === "No Active Cycle"
                            ? "Daily Checklist"
                            : `${cyclePhase} Tasks`}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#2D1F1A] flex items-center gap-2 mt-1">
                          <CheckSquare className="text-[#F6A58E]" size={20} />
                          My Daily Wellness Checklist
                        </h3>
                      </div>

                      {/* Streak Counter Badge */}
                      <span className="flex items-center gap-1 text-[10px] font-extrabold bg-[#FFF0ED] text-[#F6A58E] px-2.5 py-1 rounded-full border border-[#FFE0D9] shadow-sm shrink-0">
                        🔥 {user?.currentStreak || 0} day streak
                      </span>
                    </div>

                    {/* Progress Bar & Congratulations */}
                    {(() => {
                      const currentTasks =
                        PHASE_TASKS[cyclePhase] ||
                        PHASE_TASKS["No Active Cycle"];
                      const completedCount = currentTasks.filter(
                        (task) => !!checkedTasks[task.text],
                      ).length;
                      const progressPercent =
                        (completedCount / currentTasks.length) * 100;
                      const allCompleted =
                        completedCount === currentTasks.length;

                      return (
                        <>
                          <div className="space-y-2 mb-5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-[#8C7B74]">
                                {allCompleted ? (
                                  <span className="text-[#E56A54] animate-bounce inline-block">
                                    🌸 Amazing! You completed today’s wellness
                                    routine!
                                  </span>
                                ) : (
                                  `${completedCount} / ${currentTasks.length} completed today`
                                )}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-[#FAF2EA] rounded-full overflow-hidden border border-peach/5">
                              <div
                                className="h-full bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Task Checklist Items */}
                          <div className="space-y-3">
                            {currentTasks.map((task) => {
                              const isChecked = !!checkedTasks[task.text];
                              return (
                                <button
                                  key={task.text}
                                  type="button"
                                  onClick={() => toggleTask(task.text)}
                                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#FFF5F2]/40 bg-white/70 text-left transition-all duration-200 hover:bg-[#FFF5F2]/60 hover:translate-x-1 shadow-sm"
                                >
                                  {/* Emoji Icon before text */}
                                  <span className="text-base select-none shrink-0">
                                    {task.emoji}
                                  </span>

                                  {/* Task text with strike-through and fade */}
                                  <span
                                    className={cn(
                                      "text-xs font-semibold flex-1 leading-normal transition-all duration-200",
                                      isChecked
                                        ? "line-through text-zinc-400 opacity-60"
                                        : "text-[#2D1F1A]",
                                    )}
                                  >
                                    {task.text}
                                  </span>

                                  {/* Pink / Salmon rounded checkbox with soft checkmark */}
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm",
                                      isChecked
                                        ? "bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] border-transparent text-white"
                                        : "border-[#F8B6B6]/60 bg-white",
                                    )}
                                  >
                                    {isChecked && (
                                      <Check size={10} strokeWidth={3} />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Right Column: Beautiful Hand-Drawn Doodle Panel */}
                  <div className="hidden md:flex w-32 shrink-0 flex-col items-center justify-center border-l border-[#F6A58E]/10 pl-6 select-none pointer-events-none">
                    <DailyChecklistDoodle className="w-full h-[360px] opacity-95" />
                  </div>
                </div>
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
              className="rounded-[32px] p-6 border transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FFF5F5 0%, #F5ECFF 100%)",
                borderColor: "rgba(246,165,142,0.18)",
                boxShadow: "0 4px 24px rgba(200,150,130,0.1)",
              }}
            >
              <h3 className="font-serif font-bold text-lg mb-2 text-[#2D1F1A] flex items-center gap-2">
                <Sparkles className="text-[#F6A58E] animate-pulse" size={20} />
                AI Cycle & Symptom Insights
              </h3>
              <p className="text-xs font-semibold text-[#8C7B74] leading-relaxed mb-6">
                {profile.cycleInsights}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sleep Analysis Card */}
                <div className="rounded-2xl p-4 border bg-[#F0F4FF] border-[#DDE6FF] flex flex-col justify-between min-h-[190px] shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
                      <span className="text-sm">🌙</span> Sleep Analysis
                    </h4>
                    {!hasSleepData ? (
                      <div className="flex flex-col items-center justify-center py-4 text-center my-auto">
                        <div className="w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center text-blue-500 mb-2">
                          <Moon size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-[#6E7B95] leading-relaxed">
                          Log a few days of sleep to unlock your sleep patterns
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="h-[70px] w-full my-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={sleepChartData}>
                              <defs>
                                <linearGradient
                                  id="sleepMiniGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" hide />
                              <YAxis
                                hide
                                domain={["dataMin - 1", "dataMax + 1"]}
                              />
                              <Area
                                type="monotone"
                                dataKey="hours"
                                stroke="#3b82f6"
                                strokeWidth={1.5}
                                fill="url(#sleepMiniGrad)"
                                dot={{ fill: "#3b82f6", r: 2.5 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[11px] font-semibold text-[#4A5568] leading-relaxed mt-1">
                          {profile.sleepAnalysis}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Stress Analysis Card */}
                <div className="rounded-2xl p-4 border bg-[#F2FAF5] border-[#DEF2E6] flex flex-col justify-between min-h-[190px] shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B] mb-2 flex items-center gap-1.5">
                      <span className="text-sm">🧘</span> Stress Analysis
                    </h4>
                    {!hasStressData ? (
                      <div className="flex flex-col items-center justify-center py-4 text-center my-auto">
                        <div className="w-10 h-10 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 mb-2">
                          <Smile size={18} />
                        </div>
                        <p className="text-[10px] font-bold text-[#5F7A6A] leading-relaxed">
                          Log your moods daily to get a personalized stress
                          analysis
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="h-[70px] w-full my-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stressChartData}>
                              <defs>
                                <linearGradient
                                  id="stressMiniGrad"
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="0%"
                                    stopColor="#10b981"
                                    stopOpacity={0.5}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor="#10b981"
                                    stopOpacity={0.1}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="day" hide />
                              <YAxis hide domain={[0, 5]} />
                              <Bar
                                dataKey="stress"
                                fill="url(#stressMiniGrad)"
                                radius={[3, 3, 0, 0]}
                                maxBarSize={12}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-[11px] font-semibold text-[#4A5568] leading-relaxed mt-1">
                          {profile.stressAnalysis}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Cycle Regularity Card */}
                <div className="rounded-2xl p-4 border bg-[#FFF6F3] border-[#FFE8E0] flex flex-col justify-between min-h-[190px] shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B] mb-3 flex items-center gap-1.5">
                      <span className="text-sm">🩸</span> Cycle Regularity
                    </h4>
                    <div className="mt-2 mb-3">
                      <span
                        className={cn(
                          "text-lg font-serif font-black px-3 py-1 rounded-full text-center leading-none inline-block",
                          hasCycles
                            ? isRegular
                              ? "bg-orange-100/60 text-[#E56A54]"
                              : "bg-red-100/60 text-[#C94A4A]"
                            : "bg-peach/10 text-[#C86A4E]",
                        )}
                      >
                        {hasCycles
                          ? isRegular
                            ? "Regular Cycle"
                            : "Irregular Cycle"
                          : "No Logged Cycles"}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#5C4D4A] leading-relaxed">
                      {hasCycles
                        ? `Your average cycle length is ${Math.round(predictions?.averageCycleLength || 28)} days. This falls within the expected hormonal regularity range.`
                        : "Log your next period starting day in the calendar to start analyzing your cycle regularity."}
                    </p>
                  </div>
                </div>

                {/* Hydration Pattern Card */}
                <div className="rounded-2xl p-4 border bg-[#F0FAFA] border-[#DDF5F5] flex flex-col justify-between min-h-[190px] shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-[#1E293B] mb-3 flex items-center gap-1.5">
                      <span className="text-sm">💧</span> Hydration Pattern
                    </h4>
                    <div className="mt-2 mb-3">
                      <span className="text-lg font-serif font-black px-3 py-1 rounded-full text-center leading-none inline-block bg-teal-100/60 text-[#0E7A7D]">
                        {avgWater > 0
                          ? `${avgWater} ml / day`
                          : "No water logged"}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#4A5D5E] leading-relaxed">
                      {avgWater === 0
                        ? "Log your water intake daily in the calendar to track your hydration pattern and cycle correlations."
                        : avgWater < 2000
                          ? "Slightly below target (2,000 ml). Try keeping a hydration tracker active today."
                          : "Excellent hydration pattern! You are consistently hitting your daily water intake goals."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleLogToday}
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 text-white bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] hover:opacity-95 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Log Today to Unlock More Insights →
                </Button>
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
                  "linear-gradient(135deg, rgba(221,234,215,0.8), rgba(255, 255, 255, 0.95))",
                borderColor: "rgba(221,234,215,0.4)",
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
              className="rounded-3xl p-6 border"
              style={{
                background:
                  "linear-gradient(135deg, rgba(240,255,244,0.85), rgba(255, 255, 255, 0.95))",
                borderColor: "rgba(221,234,215,0.45)",
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
            cycles={cycles}
            predictions={predictions}
            dailyLogs={dailyLogs}
          />
        </div>

        <div className="relative">
          {/* Decorative Doodles around Health Trends Card */}
          <div className="absolute -top-6 -left-6 opacity-30 pointer-events-none text-[#F8B6B6] floating">
            <SketchyFlower className="w-12 h-12" />
          </div>
          <div
            className="absolute -bottom-6 -right-6 opacity-30 pointer-events-none text-[#F8B6B6] floating"
            style={{ animationDelay: "1.5s" }}
          >
            <SketchyFlower className="w-10 h-10 rotate-45" />
          </div>
          <div
            className="absolute top-1/2 -left-8 opacity-25 pointer-events-none text-[#EADCF8] floating"
            style={{ animationDelay: "3s" }}
          >
            <SketchySwirl className="w-16 h-8" />
          </div>
          <div
            className="absolute -top-8 right-12 opacity-25 pointer-events-none text-[#FAF2EA] floating"
            style={{ animationDelay: "2s" }}
          >
            <SketchyCloud className="w-14 h-9" />
          </div>
          <div
            className="absolute bottom-1/3 -right-6 opacity-35 pointer-events-none text-[#CDB4F6] floating"
            style={{ animationDelay: "4s" }}
          >
            <SketchySparkles className="w-8 h-8" />
          </div>
          <div
            className="absolute -bottom-8 left-12 opacity-30 pointer-events-none text-[#EADCF8] floating"
            style={{ animationDelay: "2.5s" }}
          >
            <SketchyLeaf className="w-8 h-8 -rotate-45" />
          </div>
          <div
            className="absolute top-4 -right-6 opacity-25 pointer-events-none text-[#F8B6B6] floating"
            style={{ animationDelay: "1s" }}
          >
            <SketchyHeart className="w-6 h-6 rotate-12" />
          </div>

          <div
            className="rounded-3xl p-6 border bg-white h-full"
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
      </div>

      <LoggingModal
        date={selectedDate}
        isOpen={isLoggingOpen}
        onClose={() => setIsLoggingOpen(false)}
        onSave={() => {
          refetchCycleData();
          fetchAnalytics();
        }}
      />
    </div>
  );
}
