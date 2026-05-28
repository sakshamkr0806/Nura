import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

export function TrendCharts() {
  const [viewMode, setViewMode] = useState("weekly"); // "daily" | "weekly" | "monthly"
  const [data, setData] = useState([]);

  useEffect(() => {
    const end = new Date();
    let start;
    if (viewMode === "daily" || viewMode === "weekly") {
      start = subDays(end, 7);
    } else {
      // Monthly: start of current month
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    }

    api
      .get(`/logs/range?start=${start.toISOString()}&end=${end.toISOString()}`)
      .then((res) => {
        const logs = res.data || [];
        if (viewMode === "weekly") {
          // Keep as is: map whatever logs the API returns
          const formatted = logs.map((item) => ({
            name: format(new Date(item.date), "MMM d"),
            water: item.waterIntake || 0,
            sleep: item.sleepHours || 0,
          }));
          setData(formatted);
        } else if (viewMode === "daily") {
          // Daily View: pad missing days with 0, show last 7 days
          const list = [];
          for (let i = 6; i >= 0; i--) {
            const d = subDays(end, i);
            const name = format(d, "MMM d");
            const key = format(d, "yyyy-MM-dd");
            const match = logs.find(
              (log) => format(new Date(log.date), "yyyy-MM-dd") === key,
            );
            list.push({
              name,
              water: match?.waterIntake || 0,
              sleep: match?.sleepHours || 0,
            });
          }
          setData(list);
        } else if (viewMode === "monthly") {
          // Monthly View: show all days of the current month on x-axis
          const list = [];
          const year = end.getFullYear();
          const month = end.getMonth();
          const daysInMonth = new Date(year, month + 1, 0).getDate();

          for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const name = format(d, "d");
            const key = format(d, "yyyy-MM-dd");
            const match = logs.find(
              (log) => format(new Date(log.date), "yyyy-MM-dd") === key,
            );
            list.push({
              name,
              water: match?.waterIntake || 0,
              sleep: match?.sleepHours || 0,
            });
          }
          setData(list);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch logs for charts", err);
      });
  }, [viewMode]);

  return (
    <div className="flex flex-col gap-6">
      {/* Pill-style Switcher Toggle */}
      <div className="flex bg-[#FAF2EA] p-1 rounded-full border border-peach/10 w-fit self-end shadow-sm">
        <button
          onClick={() => setViewMode("daily")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200",
            viewMode === "daily"
              ? "bg-gradient-to-r from-[#F6A58E] to-[#F8B6B6] text-white shadow-sm"
              : "text-[#8C7B74] hover:text-[#2D1F1A]",
          )}
        >
          Daily
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Water Intake Graph */}
        <Card
          id="chart-water"
          className="border transition-all duration-300"
          style={{
            background: "#FFF9F6",
            borderColor: "rgba(246,165,142,0.15)",
            boxShadow: "0 2px 12px rgba(200,150,130,0.04)",
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-[#2D1F1A]">
              Water Intake
            </CardTitle>
            <CardDescription className="text-xs text-[#8C7B74]">
              {viewMode === "daily" && "Daily logs (last 7 days)"}
              {viewMode === "weekly" && "Last 7 days (ml)"}
              {viewMode === "monthly" && "Monthly logs (current month)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="waterGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(140, 123, 116, 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8C7B74", fontSize: 9, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8C7B74", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFDFB",
                    border: "1px solid rgba(246,165,142,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(200,150,130,0.08)",
                  }}
                  labelStyle={{
                    color: "#2D1F1A",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                  itemStyle={{ color: "#0ea5e9", fontSize: "11px" }}
                />
                <Bar
                  dataKey="water"
                  fill="url(#waterGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={viewMode === "monthly" ? 6 : 30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sleep Patterns Graph */}
        <Card
          id="chart-sleep"
          className="border transition-all duration-300"
          style={{
            background: "#FFF9F6",
            borderColor: "rgba(246,165,142,0.15)",
            boxShadow: "0 2px 12px rgba(200,150,130,0.04)",
          }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg text-[#2D1F1A]">
              Sleep Patterns
            </CardTitle>
            <CardDescription className="text-xs text-[#8C7B74]">
              {viewMode === "daily" && "Daily logs (last 7 days)"}
              {viewMode === "weekly" && "Last 7 days (hours)"}
              {viewMode === "monthly" && "Monthly logs (current month)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="sleepGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#CDB4F6" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#F8B6B6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(140, 123, 116, 0.15)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8C7B74", fontSize: 9, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8C7B74", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#FFFDFB",
                    border: "1px solid rgba(246,165,142,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(200,150,130,0.08)",
                  }}
                  labelStyle={{
                    color: "#2D1F1A",
                    fontWeight: "bold",
                    fontSize: "11px",
                  }}
                  itemStyle={{ color: "#9B6FD4", fontSize: "11px" }}
                />
                <Area
                  type="monotone"
                  dataKey="sleep"
                  stroke="#9B6FD4"
                  strokeWidth={2}
                  fill="url(#sleepGradient)"
                  dot={{ fill: "#9B6FD4", r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
