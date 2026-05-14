import { useEffect, useState } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { TrendCharts } from "@/features/insights/components/TrendCharts";
import { WellnessGauge } from "@/features/analytics/components/WellnessGauge";
import { InsightPanel } from "@/features/analytics/components/InsightPanel";
import { RecommendationList } from "@/features/analytics/components/RecommendationList";
import { AIInsightCard } from "@/features/ai/components/AIInsightCard";
import { AIInsightSkeleton } from "@/features/ai/components/AIInsightSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Moon, Utensils, Heart, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";

export default function Dashboard() {
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

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            CycleWell Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personalized hormonal wellness overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={fetchAIInsights}
            disabled={isAiLoading}
          >
            <RefreshCcw
              size={16}
              className={isAiLoading ? "animate-spin" : ""}
            />
            Refresh AI
          </Button>
        </div>
      </header>

      {/* AI Smart Summary Hero */}
      <section className="relative">
        {isAiLoading ? (
          <AIInsightSkeleton />
        ) : aiInsight ? (
          <AIInsightCard insight={aiInsight} />
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 p-10 text-center text-muted-foreground">
            No AI insights available. Log more data to unlock personalized
            coaching.
          </div>
        )}
      </section>

      {/* Analytics Hero Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm lg:col-span-1">
          <CardContent className="pt-6">
            <WellnessGauge score={analytics?.score?.score || 0} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="font-semibold text-primary/80">Sleep</p>
                <p className="text-lg font-bold">
                  {analytics?.score?.factors?.sleep || 0}%
                </p>
              </div>
              <div className="rounded-lg bg-muted/30 p-2">
                <p className="font-semibold text-primary/80">Cycle</p>
                <p className="text-lg font-bold">
                  {analytics?.score?.factors?.cycle || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Metric Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <InsightPanel insights={analytics?.insights || []} />
          </CardContent>
        </Card>

        <Card className="border-none bg-transparent shadow-none lg:col-span-1">
          <CardContent className="p-0">
            <RecommendationList
              recommendations={analytics?.recommendations || []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cycle Day</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day 14</div>
            <p className="text-xs font-medium text-muted-foreground">
              Follicular Phase
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Period</CardTitle>
            <Heart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs font-medium text-muted-foreground">
              Predicted: May 28
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
            <Moon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5h</div>
            <p className="text-xs font-medium text-muted-foreground">
              Weekly average
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Utensils className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1L</div>
            <p className="text-xs font-medium text-muted-foreground">
              Daily average
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-1">
          <CycleCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div className="space-y-4 md:col-span-1">
          <h2 className="text-2xl font-bold">Health Trends</h2>
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
