import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export function CycleCalendar({
  selectedDate,
  onDateSelect,
  highlightedDates,
}) {
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
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="flex w-full justify-center rounded-md border shadow"
          modifiers={{
            period: highlightedDates?.period || [],
            prediction: highlightedDates?.prediction || [],
          }}
          modifiersStyles={{
            period: {
              backgroundColor: "hsl(var(--destructive))",
              color: "white",
            },
            prediction: {
              backgroundColor: "hsl(var(--destructive) / 0.3)",
              color: "inherit",
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
