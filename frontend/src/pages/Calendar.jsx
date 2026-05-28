import { useState, useEffect } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const [cycles, setCycles] = useState([]);
  const [predictionData, setPredictionData] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState({
    period: [],
    prediction: [],
    logged: [],
  });

  const fetchCycleData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const [cyclesRes, predictionsRes, logsRes] = await Promise.all([
        api.get("/cycles"),
        api.get("/cycles/predictions"),
        api.get(
          `/logs/range?start=${currentYear - 2}-01-01T00:00:00.000Z&end=${currentYear + 2}-12-31T23:59:59.000Z`,
        ),
      ]);
      setCycles(cyclesRes.data || []);
      setPredictionData(predictionsRes.data || null);

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

  useEffect(() => {
    fetchCycleData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) setIsLoggingOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="page-hero">
        <h1
          className="font-serif font-bold text-4xl"
          style={{ color: "#2D1F1A" }}
        >
          Cycle Calendar 🌙
        </h1>
        <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
          Track your cycle phases and log daily health metrics.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div
          className="lg:col-span-2 rounded-3xl overflow-hidden border"
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
            predictions={predictionData}
          />
        </div>

        {/* Legend + Tips */}
        <div className="space-y-5">
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
              Legend
            </h3>

            <div className="space-y-4">
              {/* Day Statuses */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C7B74] mb-1">
                  Day Status
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: "#F8B6B6" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    Period Days
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-dashed"
                    style={{ borderColor: "#F8B6B6" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    Predicted Period
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    Selected Day
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: "#CDB4F6" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    Logged Day
                  </span>
                </div>
              </div>

              <hr className="border-peach/10" />

              {/* Cycle Phases */}
              <div className="space-y-2.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C7B74] mb-1">
                  Cycle Phases
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "rgba(248, 182, 182, 0.4)",
                      border: "1px solid rgba(248, 182, 182, 0.8)",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    🔴 Menstrual (rose)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "rgba(234, 220, 248, 0.5)",
                      border: "1px solid rgba(234, 220, 248, 0.9)",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    🟣 Follicular (lavender)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "rgba(254, 237, 202, 0.7)",
                      border: "1px solid rgba(254, 237, 202, 0.9)",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    🟠 Ovulatory (peach)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      background: "rgba(226, 210, 245, 0.45)",
                      border: "1px solid rgba(226, 210, 245, 0.85)",
                    }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2D1F1A" }}
                  >
                    🟤 Luteal (mauve)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-6 border relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,182,182,0.1), rgba(234,220,248,0.1))",
              borderColor: "rgba(205,180,246,0.2)",
              boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
            }}
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <FloralDecoration className="w-32 h-32" />
            </div>
            <h3
              className="font-serif font-bold text-lg mb-3"
              style={{ color: "#2D1F1A" }}
            >
              Tap a day
            </h3>
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: "#8C7B74" }}
            >
              Select any date to log symptoms, sleep, water intake, period days,
              and predicted period for that day.
            </p>
          </div>
        </div>
      </div>

      <LoggingModal
        date={selectedDate}
        isOpen={isLoggingOpen}
        onClose={() => setIsLoggingOpen(false)}
        onSave={fetchCycleData}
      />
    </div>
  );
}
