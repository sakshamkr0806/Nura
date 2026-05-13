import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface CycleCalendarProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  highlightedDates?: {
    period: Date[]
    prediction: Date[]
  }
}

export function CycleCalendar({ selectedDate, onDateSelect, highlightedDates }: CycleCalendarProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Cycle Calendar</CardTitle>
        <CardDescription>
          {selectedDate ? format(selectedDate, "PPP") : "Select a day to log symptoms"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md border shadow w-full flex justify-center"
          modifiers={{
            period: highlightedDates?.period || [],
            prediction: highlightedDates?.prediction || [],
          }}
          modifiersStyles={{
            period: { backgroundColor: "hsl(var(--destructive))", color: "white" },
            prediction: { backgroundColor: "hsl(var(--destructive) / 0.3)", color: "inherit" },
          }}
        />
      </CardContent>
    </Card>
  )
}
