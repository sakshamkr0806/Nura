import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Nura theme consistent soft pastel palette
const COLORS = ["#F8B6B6", "#CDB4F6", "#F6A58E", "#BDD7B3", "#EADCF8"];

export function ReportPreview({ data }) {
  if (!data) return null;

  return (
    <Card className="w-full border-none bg-background shadow-none p-0">
      <CardHeader className="text-center p-3 sm:p-5 pb-1 sm:pb-3">
        <CardTitle className="text-lg sm:text-2xl font-serif font-bold text-[#2D1F1A]">
          Clinical Report Preview
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-[#8C7B74] font-medium">
          Generated for the last 90 days
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-5 pt-0 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-[#FFFAF9] border border-[#F6A58E]/12 p-3 sm:p-4 text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
              Days Logged
            </p>
            <p className="text-xl sm:text-3xl font-serif font-bold text-[#2D1F1A] mt-1">
              {data.totalDaysLogged}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FAF6FF] border border-[#CDB4F6]/15 p-3 sm:p-4 text-center sm:text-left">
            <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
              Avg. Sleep
            </p>
            <p className="text-xl sm:text-3xl font-serif font-bold text-[#2D1F1A] mt-1">
              {data.averages?.sleep?.toFixed(1) || "0.0"}h
            </p>
          </div>
        </div>

        <Separator className="opacity-40" />

        <div className="space-y-4">
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#2D1F1A]">
            Symptom Frequency
          </h4>
          <div className="h-[200px] sm:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.symptomFrequency}
                layout="vertical"
                margin={{ left: -15, right: 10 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={75}
                  tick={{ fontSize: 10, fill: "#8C7B74", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid rgba(246,165,142,0.2)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={14}>
                  {data.symptomFrequency.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Separator className="opacity-40" />

        <div
          className="rounded-2xl border p-4 sm:p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(248,182,182,0.06), rgba(234,220,248,0.06))",
            borderColor: "rgba(246,165,142,0.15)",
          }}
        >
          <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#C87B74]">
            Clinical Note
          </p>
          <p className="text-xs sm:text-sm italic leading-relaxed text-[#5C4D47] font-medium">
            &ldquo;Your symptom frequency has remained stable compared to the
            previous quarter. Ensure you discuss the clusters of heavy bleeding
            logged in late April with your provider.&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
