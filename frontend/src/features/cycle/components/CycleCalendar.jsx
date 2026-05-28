import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  format,
  differenceInDays,
  startOfDay,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";

// Custom illustrated moon icons matching Nura's aesthetic
function MoonNew() {
  return (
    <svg
      className="w-5 h-5 text-[#8C7B74]/70 transition-transform hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8" stroke="rgba(140, 123, 116, 0.4)" />
      <circle cx="12" cy="12" r="5" fill="rgba(140, 123, 116, 0.15)" />
    </svg>
  );
}

function MoonWaxing() {
  return (
    <svg
      className="w-5 h-5 text-[#8C7B74]/70 transition-transform hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8" stroke="rgba(140, 123, 116, 0.4)" />
      <path
        d="M12 4a8 8 0 0 1 0 16 8 8 0 0 0 0-16z"
        fill="rgba(140, 123, 116, 0.35)"
      />
    </svg>
  );
}

function MoonFull() {
  return (
    <svg
      className="w-5 h-5 text-[#F6A58E] transition-transform hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8" stroke="rgba(246, 165, 142, 0.6)" />
      <circle cx="12" cy="12" r="7.5" fill="rgba(252, 218, 155, 0.35)" />
    </svg>
  );
}

function MoonWaning() {
  return (
    <svg
      className="w-5 h-5 text-[#8C7B74]/70 transition-transform hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="8" stroke="rgba(140, 123, 116, 0.4)" />
      <path
        d="M12 4a8 8 0 0 0 0 16 8 8 0 0 1 0-16z"
        fill="rgba(140, 123, 116, 0.35)"
      />
    </svg>
  );
}

function renderMoonIcon(phase) {
  switch (phase) {
    case "menstrual":
      return <MoonNew />;
    case "follicular":
      return <MoonWaxing />;
    case "ovulatory":
      return <MoonFull />;
    case "luteal":
      return <MoonWaning />;
    default:
      return <MoonNew />;
  }
}

// Calculate which cycle phase day a given date belongs to
function getPhaseInfoForDate(date, cycles = [], predictions = null) {
  if (!date) return { day: 0, phase: "unknown" };

  const starts = [];

  // Add actual cycle starts
  cycles.forEach((c) => {
    if (c.startDate) {
      starts.push({
        date: startOfDay(new Date(c.startDate)),
        isPredicted: false,
      });
    }
  });

  const avgLength = predictions?.averageCycleLength || 28;

  // Add predicted cycle start
  if (predictions?.predictedNextPeriod) {
    const nextPred = startOfDay(new Date(predictions.predictedNextPeriod));
    starts.push({
      date: nextPred,
      isPredicted: true,
    });

    // Project future predicted cycles
    for (let i = 1; i <= 6; i++) {
      const futurePred = new Date(nextPred);
      futurePred.setDate(futurePred.getDate() + i * avgLength);
      starts.push({
        date: startOfDay(futurePred),
        isPredicted: true,
      });
    }
  }

  // If there are no starts at all, fallback to a hypothetical cycle
  if (starts.length === 0) {
    const fallbackStart = new Date(date.getFullYear(), date.getMonth(), 1);
    starts.push({ date: startOfDay(fallbackStart), isPredicted: true });
  }

  // Sort ascending
  starts.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Find latest start <= target date
  const targetDate = startOfDay(new Date(date));
  let latestStart = null;

  for (let i = starts.length - 1; i >= 0; i--) {
    if (starts[i].date.getTime() <= targetDate.getTime()) {
      latestStart = starts[i];
      break;
    }
  }

  if (!latestStart) {
    latestStart = starts[0];
  }

  const diffDays = differenceInDays(targetDate, latestStart.date);
  const cycleDay = (((diffDays % avgLength) + avgLength) % avgLength) + 1;

  let phase = "luteal";
  if (cycleDay <= 5) {
    phase = "menstrual";
  } else if (cycleDay <= 13) {
    phase = "follicular";
  } else if (cycleDay <= 16) {
    phase = "ovulatory";
  }

  return { day: cycleDay, phase };
}

export function CycleCalendar({
  selectedDate,
  onDateSelect,
  highlightedDates,
  cycles = [],
  predictions = null,
  dailyLogs = [],
}) {
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" or "weekly"

  const currentPhaseInfo = getPhaseInfoForDate(
    selectedDate || new Date(),
    cycles,
    predictions,
  );
  const currentCycleDay = currentPhaseInfo.day;
  const currentPhase = currentPhaseInfo.phase;

  // Calculate days for the weekly view
  const startOfSelectedWeek = startOfWeek(selectedDate || new Date(), {
    weekStartsOn: 0,
  });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfSelectedWeek, i),
  );

  const getSymptomsForDate = (date) => {
    const target = startOfDay(new Date(date)).getTime();
    const log = dailyLogs.find(
      (l) => startOfDay(new Date(l.date)).getTime() === target,
    );
    return (
      log?.symptoms?.filter(
        (s) => s !== "Period Day" && s !== "Predicted Period",
      ) || []
    );
  };

  // Calculate highlighted spans of this week on the cycle progress bar
  const getWeekSpans = () => {
    const avgLen = predictions?.averageCycleLength || 28;
    const spans = [];
    const cycleDays = daysOfWeek.map(
      (d) => getPhaseInfoForDate(d, cycles, predictions).day,
    );

    let currentSpan = [cycleDays[0]];
    for (let i = 1; i < cycleDays.length; i++) {
      if (cycleDays[i] === currentSpan[currentSpan.length - 1] + 1) {
        currentSpan.push(cycleDays[i]);
      } else {
        spans.push(currentSpan);
        currentSpan = [cycleDays[i]];
      }
    }
    spans.push(currentSpan);

    return spans.map((span) => {
      const start = span[0];
      const end = span[span.length - 1];
      const left = ((start - 1) / avgLen) * 100;
      const width = (span.length / avgLen) * 100;
      return { left, width, start, end };
    });
  };

  const weekSpans = getWeekSpans();

  return (
    <Card className="h-full w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <CardTitle>Cycle Calendar</CardTitle>
          <CardDescription>
            {selectedDate
              ? format(selectedDate, "PPP")
              : "Select a day to log symptoms"}
          </CardDescription>
        </div>

        {/* Pill-style Switcher Toggle */}
        <div className="flex bg-[#FAF2EA] p-1 rounded-full border border-peach/10 w-fit self-start sm:self-center">
          <button
            onClick={() => setViewMode("monthly")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
              viewMode === "monthly"
                ? "bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] text-white shadow-sm"
                : "text-[#8C7B74] hover:text-[#2D1F1A]",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode("weekly")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
              viewMode === "weekly"
                ? "bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] text-white shadow-sm"
                : "text-[#8C7B74] hover:text-[#2D1F1A]",
            )}
          >
            Weekly
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {viewMode === "monthly" ? (
          <>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              className="flex w-full justify-center rounded-md border shadow"
              showWeekNumber={true}
              modifiers={{
                period: highlightedDates?.period || [],
                prediction: highlightedDates?.prediction || [],
                logged: highlightedDates?.logged || [],
                menstrual: (date) =>
                  getPhaseInfoForDate(date, cycles, predictions).phase ===
                  "menstrual",
                follicular: (date) =>
                  getPhaseInfoForDate(date, cycles, predictions).phase ===
                  "follicular",
                ovulatory: (date) =>
                  getPhaseInfoForDate(date, cycles, predictions).phase ===
                  "ovulatory",
                luteal: (date) =>
                  getPhaseInfoForDate(date, cycles, predictions).phase ===
                  "luteal",
              }}
              components={{
                WeekNumberHeader: () => (
                  <th className="w-7 text-[0.75rem] font-medium text-muted-foreground/60 select-none text-center">
                    ☾
                  </th>
                ),
                WeekNumber: ({ week, ...props }) => {
                  const midDay =
                    week.days[Math.floor(week.days.length / 2)]?.date;
                  const phase = getPhaseInfoForDate(
                    midDay,
                    cycles,
                    predictions,
                  ).phase;
                  return (
                    <td className="text-center align-middle p-0" {...props}>
                      <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
                        {renderMoonIcon(phase)}
                      </div>
                    </td>
                  );
                },
              }}
            />

            {/* Cycle Phase Timeline Strip */}
            <div className="mt-2 border-t border-peach/10 pt-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-semibold text-[#2D1F1A]">
                  Selected Day Phase Status
                </span>
                {selectedDate && (
                  <span className="text-xs font-bold text-coral/80 bg-peach/10 px-2 py-0.5 rounded-full capitalize">
                    {currentPhase} Phase • Day {currentCycleDay} of{" "}
                    {predictions?.averageCycleLength || 28}
                  </span>
                )}
              </div>

              <div className="relative w-full">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/40 p-0.5 border border-peach/10 relative">
                  <div
                    className="h-full rounded-l-full transition-all"
                    style={{
                      width: "18%",
                      backgroundColor: "rgba(248, 182, 182, 0.7)",
                    }}
                    title="Menstrual: Days 1-5"
                  />
                  <div
                    className="h-full transition-all"
                    style={{
                      width: "29%",
                      backgroundColor: "rgba(234, 220, 248, 0.7)",
                    }}
                    title="Follicular: Days 6-13"
                  />
                  <div
                    className="h-full transition-all"
                    style={{
                      width: "11%",
                      backgroundColor: "rgba(254, 237, 202, 0.9)",
                    }}
                    title="Ovulatory: Days 14-16"
                  />
                  <div
                    className="h-full rounded-r-full transition-all"
                    style={{
                      width: "42%",
                      backgroundColor: "rgba(215, 195, 238, 0.7)",
                    }}
                    title="Luteal: Days 17-28"
                  />
                </div>

                {/* Timeline Dot Indicator */}
                {selectedDate && currentCycleDay > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-white border-2 border-[#F6A58E] flex items-center justify-center shadow-lg transition-all duration-300"
                    style={{
                      left: `${Math.min(99.5, Math.max(0.5, ((currentCycleDay - 1) / (predictions?.averageCycleLength || 28)) * 100))}%`,
                      boxShadow: "0 2px 8px rgba(246, 165, 142, 0.4)",
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F6A58E] animate-ping absolute" />
                    <div className="w-2 h-2 rounded-full bg-[#F6A58E]" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-between text-[9px] sm:text-[10px] text-[#8C7B74] mt-2 font-bold gap-y-1.5 tracking-wide">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F8B6B6]" />{" "}
                  Menstrual (Days 1–5)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#CDB4F6]" />{" "}
                  Follicular (Days 6–13)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FCDA9B]" />{" "}
                  Ovulatory (Days 14–16)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D7C3EE]" /> Luteal
                  (Days 17–28)
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Weekly View */
          <div className="flex flex-col gap-6">
            {/* Week cycle span progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#2D1F1A]">
                  Weekly Cycle Span
                </span>
                <span className="text-[10px] font-extrabold text-[#8C7B74]">
                  Cycle Days {weekSpans[0]?.start} to{" "}
                  {weekSpans[weekSpans.length - 1]?.end}
                </span>
              </div>
              <div className="relative h-3 w-full bg-muted/40 rounded-full border border-peach/10 overflow-hidden">
                {/* Underlay representing phases */}
                <div className="absolute inset-0 flex">
                  <div
                    style={{
                      width: "18%",
                      backgroundColor: "rgba(248, 182, 182, 0.2)",
                    }}
                  />
                  <div
                    style={{
                      width: "29%",
                      backgroundColor: "rgba(234, 220, 248, 0.2)",
                    }}
                  />
                  <div
                    style={{
                      width: "11%",
                      backgroundColor: "rgba(254, 237, 202, 0.2)",
                    }}
                  />
                  <div
                    style={{
                      width: "42%",
                      backgroundColor: "rgba(215, 195, 238, 0.2)",
                    }}
                  />
                </div>
                {/* Highlighted week span(s) */}
                {weekSpans.map((span, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 h-full bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] opacity-80 rounded-full border-l border-r border-[#F6A58E]/40"
                    style={{ left: `${span.left}%`, width: `${span.width}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Weekly Grid Days */}
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {daysOfWeek.map((dayDate) => {
                const isSelected = isSameDay(dayDate, selectedDate);
                const { phase } = getPhaseInfoForDate(
                  dayDate,
                  cycles,
                  predictions,
                );

                const isPeriod = highlightedDates?.period?.some((d) =>
                  isSameDay(d, dayDate),
                );
                const isLogged = highlightedDates?.logged?.some((d) =>
                  isSameDay(d, dayDate),
                );

                const symptoms = getSymptomsForDate(dayDate);

                // Background colors for the phase
                const phaseColors = {
                  menstrual:
                    "bg-[rgba(248,182,182,0.12)] border-[rgba(248,182,182,0.3)] text-[#2D1F1A]",
                  follicular:
                    "bg-[rgba(234,220,248,0.15)] border-[rgba(234,220,248,0.35)] text-[#2D1F1A]",
                  ovulatory:
                    "bg-[rgba(254,237,202,0.22)] border-[rgba(254,237,202,0.45)] text-[#2D1F1A]",
                  luteal:
                    "bg-[rgba(226,210,245,0.12)] border-[rgba(226,210,245,0.3)] text-[#2D1F1A]",
                };

                return (
                  <div
                    key={dayDate.toString()}
                    onClick={() => onDateSelect(dayDate)}
                    className={cn(
                      "flex flex-col items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1 min-h-[160px]",
                      phaseColors[phase],
                      isSelected
                        ? "ring-2 ring-[#F6A58E] ring-offset-2 border-transparent scale-105 shadow-md"
                        : "shadow-sm",
                      isPeriod && "border-l-4 border-l-[#F8B6B6]",
                      isLogged && "border-r-4 border-r-[#CDB4F6]",
                    )}
                  >
                    {/* Day Name */}
                    <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-60">
                      {format(dayDate, "eee")}
                    </span>

                    {/* Date and Moon */}
                    <div className="flex flex-col items-center my-2 gap-1">
                      <span
                        className={cn(
                          "text-2xl font-serif font-black",
                          isPeriod && "text-[#E5989B]",
                          isLogged && "text-[#9B6FD4]",
                        )}
                      >
                        {format(dayDate, "d")}
                      </span>
                      <div className="opacity-80">{renderMoonIcon(phase)}</div>
                    </div>

                    {/* Phase Label & Symptoms */}
                    <div className="w-full flex flex-col items-center gap-1.5 mt-auto">
                      <span
                        className={cn(
                          "text-[9px] font-bold px-2 py-0.5 rounded-full capitalize text-center leading-none",
                          phase === "menstrual" &&
                            "bg-[#F8B6B6]/30 text-[#E5989B]",
                          phase === "follicular" &&
                            "bg-[#CDB4F6]/20 text-[#9B6FD4]",
                          phase === "ovulatory" &&
                            "bg-[#FCDA9B]/30 text-[#D4A843]",
                          phase === "luteal" &&
                            "bg-[#D7C3EE]/30 text-[#7b5ea7]",
                        )}
                      >
                        {phase}
                      </span>

                      {/* Symptoms tags */}
                      {symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center w-full mt-1">
                          {symptoms.slice(0, 2).map((symptom, idx) => (
                            <span
                              key={idx}
                              className="text-[8px] font-extrabold bg-white/70 text-text-secondary px-1 py-0.5 rounded border border-peach/5 leading-none truncate max-w-[50px]"
                              title={symptom}
                            >
                              {symptom}
                            </span>
                          ))}
                          {symptoms.length > 2 && (
                            <span className="text-[8px] font-extrabold bg-white/70 text-text-secondary px-1 py-0.5 rounded border border-peach/5 leading-none">
                              +{symptoms.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
