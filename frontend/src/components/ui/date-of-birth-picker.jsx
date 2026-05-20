import React, { useState, useEffect } from "react";
import { format, subYears, isAfter } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DateOfBirthPicker({
  value,
  onChange,
  className,
  error,
  ...props
}) {
  const today = new Date();
  // Minimum age 13 -> max selectable date is 13 years ago today
  const maxDate = subYears(today, 13);
  const minDate = subYears(today, 120);

  const [isOpen, setIsOpen] = useState(false);
  // Track which month/year the calendar sheet is currently showing
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value && !isAfter(value, maxDate)) {
      return value;
    }
    return maxDate;
  });

  // Keep currentMonth in sync when value changes externally
  useEffect(() => {
    if (value) {
      setCurrentMonth(value);
    }
  }, [value]);

  const currentYearVal = currentMonth.getFullYear();
  const currentMonthVal = currentMonth.getMonth();

  // Generate years from minDate (e.g. 1906) to maxDate (e.g. 2013)
  const years = React.useMemo(() => {
    const list = [];
    const startYear = minDate.getFullYear();
    const endYear = maxDate.getFullYear();
    for (let y = endYear; y >= startYear; y--) {
      list.push(y);
    }
    return list;
  }, [minDate, maxDate]);

  const handleYearChange = (yearStr) => {
    const year = parseInt(yearStr, 10);
    const updated = new Date(currentMonth);
    updated.setFullYear(year);

    // If the updated date exceeds the max valid date, adjust it
    if (isAfter(updated, maxDate)) {
      setCurrentMonth(maxDate);
      onChange?.(maxDate);
    } else {
      setCurrentMonth(updated);
      // If we already have a selected date, update its year too
      if (value) {
        const nextValue = new Date(value);
        nextValue.setFullYear(year);
        if (isAfter(nextValue, maxDate)) {
          onChange?.(maxDate);
        } else {
          onChange?.(nextValue);
        }
      }
    }
  };

  const handleMonthChange = (monthStr) => {
    const month = parseInt(monthStr, 10);
    const updated = new Date(currentMonth);
    updated.setMonth(month);

    if (isAfter(updated, maxDate)) {
      setCurrentMonth(maxDate);
      onChange?.(maxDate);
    } else {
      setCurrentMonth(updated);
      if (value) {
        const nextValue = new Date(value);
        nextValue.setMonth(month);
        if (isAfter(nextValue, maxDate)) {
          onChange?.(maxDate);
        } else {
          onChange?.(nextValue);
        }
      }
    }
  };

  const handleSelect = (date) => {
    if (date && !isAfter(date, maxDate)) {
      onChange?.(date);
      setIsOpen(false);
    }
  };

  const inputClass =
    "w-full h-11 px-4 rounded-xl text-sm border flex items-center justify-between transition-all focus:outline-none focus:ring-2 focus:ring-[rgba(246,165,142,0.3)] disabled:cursor-not-allowed disabled:opacity-50";

  const inputStyle = {
    borderColor: error ? "#EF4444" : "rgba(246,165,142,0.2)",
    background: "#FFFAF8",
    color: value ? "#2D1F1A" : "#8C7B74",
  };

  return (
    <div className={cn("relative flex flex-col gap-1 w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={inputClass}
            style={inputStyle}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            {...props}
          >
            <span className="font-medium">
              {value ? format(value, "PPP") : "Select date of birth"}
            </span>
            <CalendarIcon
              className="h-4 w-4 shrink-0 transition-transform duration-200"
              style={{ color: "#F6A58E" }}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 rounded-2xl shadow-xl border bg-white flex flex-col gap-3 animate-in fade-in-50 zoom-in-95 duration-200"
          style={{ borderColor: "rgba(246,165,142,0.15)" }}
          align="start"
        >
          {/* Custom Selects Header */}
          <div className="flex items-center gap-2 pb-1 border-b border-rose-50">
            {/* Month Select */}
            <Select
              value={currentMonthVal.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger
                size="sm"
                className="w-[125px] h-9 rounded-lg border border-rose-100 bg-[#FFFAF8] text-xs font-semibold text-[#8C7B74] focus:ring-1 focus:ring-[#F6A58E]"
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-auto bg-white rounded-lg border shadow-lg">
                {MONTHS.map((m, idx) => (
                  <SelectItem
                    key={m}
                    value={idx.toString()}
                    className="text-xs hover:bg-[#FFF9F7] text-[#8C7B74]"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Select */}
            <Select
              value={currentYearVal.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger
                size="sm"
                className="w-[90px] h-9 rounded-lg border border-rose-100 bg-[#FFFAF8] text-xs font-semibold text-[#8C7B74] focus:ring-1 focus:ring-[#F6A58E]"
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="max-h-56 overflow-y-auto bg-white rounded-lg border shadow-lg">
                {years.map((y) => (
                  <SelectItem
                    key={y}
                    value={y.toString()}
                    className="text-xs hover:bg-[#FFF9F7] text-[#8C7B74]"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={(date) =>
              isAfter(date, maxDate) || date < minDate
            }
            initialFocus
            className="p-0 border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
