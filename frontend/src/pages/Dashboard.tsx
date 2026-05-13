import { useEffect, useState } from "react"
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar"
import { LoggingModal } from "@/features/cycle/components/LoggingModal"
import { TrendCharts } from "@/features/insights/components/TrendCharts"
import { WellnessGauge } from "@/features/analytics/components/WellnessGauge"
import { InsightPanel } from "@/features/analytics/components/InsightPanel"
import { RecommendationList } from "@/features/analytics/components/RecommendationList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Moon, Utensils, Heart } from "lucide-react"
import api from "@/api/axios"

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isLoggingOpen, setIsLoggingOpen] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    api.get('/analytics/summary')
      .then(res => setAnalytics(res.data))
      .catch(err => console.error("Failed to fetch analytics", err))
  }, [])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) setIsLoggingOpen(true)
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Body Literacy Overview</h1>
          <p className="text-muted-foreground">Understanding your cycle through data.</p>
        </div>
      </header>
      
      {/* Analytics Hero Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
          <CardContent className="pt-6">
            <WellnessGauge score={analytics?.score?.score || 0} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="font-semibold text-primary">Sleep</p>
                <p className="font-bold">{analytics?.score?.factors?.sleep || 0}%</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="font-semibold text-primary">Cycle</p>
                <p className="font-bold">{analytics?.score?.factors?.cycle || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <InsightPanel insights={analytics?.insights || []} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <RecommendationList recommendations={analytics?.recommendations || []} />
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cycle Day</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Day 14</div>
            <p className="text-xs text-muted-foreground">Follicular Phase</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Period</CardTitle>
            <Heart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 Days</div>
            <p className="text-xs text-muted-foreground">Predicted: May 28</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
            <Moon className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.5h</div>
            <p className="text-xs text-muted-foreground">Weekly average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Utensils className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1L</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
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
        <div className="md:col-span-1 space-y-4">
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
