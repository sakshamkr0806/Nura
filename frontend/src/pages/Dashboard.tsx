import { useState } from "react"
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar"
import { LoggingModal } from "@/features/cycle/components/LoggingModal"
import { TrendCharts } from "@/features/insights/components/TrendCharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Moon, Utensils, Heart } from "lucide-react"

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isLoggingOpen, setIsLoggingOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) setIsLoggingOpen(true)
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold">Hormonal Wellness</h1>
        <p className="text-muted-foreground">Log your symptoms and track your cycle.</p>
      </header>
      
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
            <p className="text-xs text-muted-foreground">-0.5h from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
            <Utensils className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1L</div>
            <p className="text-xs text-muted-foreground">Goal: 2.5L</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Calendar - 2 columns on medium screens */}
        <div className="md:col-span-2">
          <CycleCalendar 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect}
          />
        </div>

        {/* Sidebar Insights or Placeholder */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              You're in your follicular phase. High energy levels expected! Great time for high-intensity workouts.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Insights & Trends</h2>
        <TrendCharts />
      </section>

      <LoggingModal 
        date={selectedDate} 
        isOpen={isLoggingOpen} 
        onClose={() => setIsLoggingOpen(false)} 
      />
    </div>
  );
}
