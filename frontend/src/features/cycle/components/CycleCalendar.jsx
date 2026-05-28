import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, differenceInDays, startOfDay } from "date-fns";

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
}) {
  const currentPhaseInfo = getPhaseInfoForDate(
    selectedDate || new Date(),
    cycles,
    predictions,
  );
  const currentCycleDay = currentPhaseInfo.day;
  const currentPhase = currentPhaseInfo.phase;

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Cycle Calendar</CardTitle>
        <CardDescription>
          {selectedDate
            ? format(selectedDate, "PPP")
            : "Select a day to log symptoms"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
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
              getPhaseInfoForDate(date, cycles, predictions).phase === "luteal",
          }}
          components={{
            WeekNumberHeader: () => (
              <th className="w-7 text-[0.75rem] font-medium text-muted-foreground/60 select-none text-center">
                ☾
              </th>
            ),
            WeekNumber: ({ week, ...props }) => {
              const midDay = week.days[Math.floor(week.days.length / 2)]?.date;
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
              <span className="w-2 h-2 rounded-full bg-[#F8B6B6]" /> Menstrual
              (Days 1–5)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#CDB4F6]" /> Follicular
              (Days 6–13)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FCDA9B]" /> Ovulatory
              (Days 14–16)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D7C3EE]" /> Luteal
              (Days 17–28)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
