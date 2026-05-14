import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
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

export function TrendCharts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const end = new Date();
    const start = subDays(end, 7);

    api
      .get(`/logs/range?start=${start.toISOString()}&end=${end.toISOString()}`)
      .then((res) => {
        const formatted = res.data.map((item) => ({
          name: format(new Date(item.date), "MMM d"),
          water: item.waterIntake || 0,
          sleep: item.sleepHours || 0,
        }));
        setData(formatted);
      });
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Water Intake</CardTitle>
          <CardDescription>Last 7 days (ml)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="water"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep Patterns</CardTitle>
          <CardDescription>Last 7 days (hours)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
