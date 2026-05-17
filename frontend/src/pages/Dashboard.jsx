import { useEffect, useState } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { TrendCharts } from "@/features/insights/components/TrendCharts";
import { WellnessGauge } from "@/features/analytics/components/WellnessGauge";
import { InsightPanel } from "@/features/analytics/components/InsightPanel";
import { RecommendationList } from "@/features/analytics/components/RecommendationList";
import { AIInsightCard } from "@/features/ai/components/AIInsightCard";
import { AIInsightSkeleton } from "@/features/ai/components/AIInsightSkeleton";
import {
  Droplets,
  Moon,
  Utensils,
  Heart,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics/summary");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    }
  };

  const fetchAIInsights = async () => {
    setIsAiLoading(true);
    try {
      const res = await api.get("/ai/insights");
      setAiInsight(res.data);
    } catch (err) {
      console.error("Failed to fetch AI insights", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchAIInsights();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) setIsLoggingOpen(true);
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
    {
      label: "Wellness",
      value: `${analytics?.score?.score ?? 0}%`,
      sub: "Body score",
      Icon: Sparkles,
      color: "#F6A58E",
      bg: "#FFF5F2",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── PAGE HEADER ── */}
      <div className="page-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <FloralDecoration className="w-40 h-40" />
        </div>
        <div>
          <h1
            className="font-serif font-bold text-4xl"
            style={{ color: "#2D1F1A" }}
          >
            Welcome back, {firstName} 🌸
          </h1>
          <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
            Your personalised hormonal wellness overview for today.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-2xl shrink-0"
          style={{ borderColor: "rgba(246,165,142,0.3)", color: "#F6A58E" }}
          onClick={fetchAIInsights}
          disabled={isAiLoading}
        >
          <RefreshCcw size={15} className={isAiLoading ? "animate-spin" : ""} />
          Refresh AI
        </Button>
      </div>

      {/* ── AI INSIGHT CARD ── */}
      <section>
        {isAiLoading ? (
          <AIInsightSkeleton />
        ) : aiInsight ? (
          <AIInsightCard insight={aiInsight} />
        ) : (
          <div
            className="rounded-3xl border-2 border-dashed p-10 text-center"
            style={{
              borderColor: "rgba(246,165,142,0.2)",
              background: "rgba(255,255,255,0.5)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "#8C7B74" }}>
              No AI insights yet — log more data to unlock personalised coaching
              🌱
            </p>
          </div>
        )}
      </section>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="metric-card"
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

      {/* ── ANALYTICS GRID ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wellness Gauge */}
        <div
          className="rounded-3xl p-6 border"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,182,182,0.08), rgba(255,255,255,1))",
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <h3
            className="font-serif font-bold text-lg mb-4"
            style={{ color: "#2D1F1A" }}
          >
            Wellness Score
          </h3>
          <WellnessGauge score={analytics?.score?.score || 0} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              {
                key: "sleep",
                label: "Sleep",
                val: analytics?.score?.factors?.sleep || 0,
                color: "#CDB4F6",
              },
              {
                key: "cycle",
                label: "Cycle",
                val: analytics?.score?.factors?.cycle || 0,
                color: "#F8B6B6",
              },
              {
                key: "hydration",
                label: "Hydration",
                val: analytics?.score?.factors?.hydration || 0,
                color: "#DDEAD7",
              },
              {
                key: "symptoms",
                label: "Symptoms",
                val: analytics?.score?.factors?.symptoms || 0,
                color: "#F6A58E",
              },
            ].map((f) => (
              <div
                key={f.key}
                className="rounded-2xl p-3 text-center"
                style={{ background: `${f.color}25` }}
              >
                <p
                  className="text-[10px] font-bold"
                  style={{ color: "#8C7B74" }}
                >
                  {f.label}
                </p>
                <p
                  className="text-lg font-serif font-bold"
                  style={{ color: "#2D1F1A" }}
                >
                  {f.val}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Panel */}
        <div
          className="rounded-3xl p-6 border"
          style={{
            background: "white",
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <h3
            className="font-serif font-bold text-lg mb-4"
            style={{ color: "#2D1F1A" }}
          >
            Metric Trends
          </h3>
          <InsightPanel insights={analytics?.insights || []} />
        </div>

        {/* Recommendations */}
        <div
          className="rounded-3xl p-6 border"
          style={{
            background:
              "linear-gradient(135deg, rgba(221,234,215,0.15), white)",
            borderColor: "rgba(221,234,215,0.3)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <h3
            className="font-serif font-bold text-lg mb-4"
            style={{ color: "#2D1F1A" }}
          >
            Recommendations
          </h3>
          <RecommendationList
            recommendations={analytics?.recommendations || []}
          />
        </div>
      </div>

      {/* ── CALENDAR + CHARTS ── */}
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="rounded-3xl overflow-hidden border"
          style={{
            borderColor: "rgba(246,165,142,0.12)",
            boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
          }}
        >
          <CycleCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div
          className="rounded-3xl p-6 border"
          style={{
            background: "white",
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
      />
    </div>
  );
}
