import { useState } from "react";
import { CycleCalendar } from "@/features/cycle/components/CycleCalendar";
import { LoggingModal } from "@/features/cycle/components/LoggingModal";
import {
  FloralDecoration,
  SketchyHeart,
  SketchyFlower,
  SketchyLeaf,
  SketchyCloud,
  SketchySwirl,
  SketchySparkles,
} from "@/components/shared/Illustrations";
import { useCycleData } from "@/hooks/useCycleData";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoggingOpen, setIsLoggingOpen] = useState(false);
  const { highlightedDates, cycles, predictions, refetchCycleData, dailyLogs } =
    useCycleData();

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
        <div className="lg:col-span-2 relative">
          {/* Decorative Doodles around Card */}
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
            className="rounded-3xl overflow-hidden border bg-white"
            style={{
              borderColor: "rgba(246,165,142,0.12)",
              boxShadow: "0 2px 20px rgba(200, 150, 130, 0.08)",
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
                    style={{ background: "#E8727A" }}
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
                    style={{ borderColor: "#B89FD8", background: "#E8D5F5" }}
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
                    style={{ background: "#F4956A" }}
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
                    style={{ background: "#C3A6D4" }}
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
        onSave={refetchCycleData}
      />
    </div>
  );
}
