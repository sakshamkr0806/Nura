import { useState, useEffect } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/api/axios";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [highlightedDates, setHighlightedDates] = useState({
    period: [],
    prediction: [],
  });

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const [cyclesRes, predictionsRes] = await Promise.all([
          api.get("/cycles"),
          api.get("/cycles/predictions"),
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
          // Highlight 5 days of prediction
          for (let i = 0; i < 5; i++) {
            const d = new Date(predStart);
            d.setDate(d.getDate() + i);
            predictions.push(d);
          }
        }

        setHighlightedDates({
          period: periods,
          prediction: predictions,
        });
      } catch (err) {
        console.error("Failed to fetch cycle data", err);
      }
    };

    fetchCycleData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) setIsLoggingOpen(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Cycle Calendar</h1>
        <p className="text-muted-foreground">
          Track your cycle and log daily health metrics.
        </p>
      </header>

      <div className="grid gap-6">
        <CycleCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          highlightedDates={highlightedDates}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive" />
              <span className="text-sm">Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-destructive/30" />
              <span className="text-sm">Prediction</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <LoggingModal
        date={selectedDate}
        isOpen={isLoggingOpen}
        onClose={() => setIsLoggingOpen(false)}
      />
    </div>
  );
}
