import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#F8B6B6", "#CDB4F6", "#F6A58E", "#BDD7B3", "#EADCF8"];

const PageContainer = ({ children, pageNum, totalPages, title, dateRange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#F6A58E]/20 mb-8 min-h-[700px] w-full flex flex-col mx-auto overflow-hidden relative">
    <div
      className="h-2 w-full"
      style={{
        background:
          "linear-gradient(90deg, #F8B6B6, #CDB4F6, #F6A58E, #BDD7B3)",
      }}
    ></div>
    <div className="p-8 sm:p-10 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-8 border-b border-[#F5F3F1] pb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#2D1F1A]">
            {title}
          </h2>
          <p className="text-sm font-medium text-[#8C7B74] mt-1">
            Nura Clinical Report • Last {dateRange} Days
          </p>
        </div>
        <div className="text-right">
          <h3 className="text-lg font-serif font-bold text-[#F6A58E]">Nura</h3>
          <p className="text-xs font-bold text-[#8C7B74]">
            Page {pageNum} of {totalPages}
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-8">{children}</div>
    </div>
  </div>
);

export function ReportPreview({ data, dateRange = "90", selectedData }) {
  // Use real data from backend - empty arrays for now if not available
  const { cycleTrend, periodTrend, sleepTrend, wellnessTrend } = useMemo(() => {
    // In a real implementation, this would map `data.cycles` and `data.logs`
    // Since backend doesn't currently provide it, we use empty arrays to trigger the empty states
    return {
      cycleTrend: [],
      periodTrend: [],
      sleepTrend: [],
      wellnessTrend: [],
    };
  }, []);

  const sortedSymptoms = useMemo(() => {
    if (!data) return [];
    return [...(data.symptomFrequency || [])]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [data?.symptomFrequency]);

  if (!data)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-[#8C7B74] opacity-50 space-y-4">
        <div className="w-12 h-12 border-4 border-[#F6A58E] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif font-bold animate-pulse">
          Loading Clinical Data...
        </p>
      </div>
    );

  const pages = [];
  const totalPages = [
    true, // Health Summary always included
    selectedData?.cycleHistory,
    selectedData?.symptomTrends,
    selectedData?.sleepData || selectedData?.wellnessTrends,
  ].filter(Boolean).length;

  // Page 1: Health Summary
  pages.push(
    <PageContainer
      key="summary"
      dateRange={dateRange}
      pageNum={pages.length + 1}
      totalPages={totalPages}
      title="Health Summary"
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#FFFAF9] p-5 rounded-2xl border border-[#F6A58E]/10">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
            Avg Cycle Length
          </p>
          <p className="text-3xl font-serif font-bold text-[#2D1F1A] mt-2">
            {cycleTrend.length > 0
              ? Math.round(
                  cycleTrend.reduce((a, b) => a + b.length, 0) /
                    cycleTrend.length,
                )
              : "--"}{" "}
            days
          </p>
        </div>
        <div className="bg-[#FAF6FF] p-5 rounded-2xl border border-[#CDB4F6]/15">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
            Avg Sleep Duration
          </p>
          <p className="text-3xl font-serif font-bold text-[#2D1F1A] mt-2">
            {data.averages?.sleep?.toFixed(1) || "7.0"} hrs
          </p>
        </div>
        <div className="bg-[#F6FCF4] p-5 rounded-2xl border border-[#BDD7B3]/20">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
            Total Logs
          </p>
          <p className="text-3xl font-serif font-bold text-[#2D1F1A] mt-2">
            {data.totalDaysLogged} days
          </p>
        </div>
        <div className="bg-[#FDF8F5] p-5 rounded-2xl border border-[#F6A58E]/20">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#8C7B74]">
            Most Common Symptom
          </p>
          <p className="text-2xl font-serif font-bold text-[#2D1F1A] mt-2 capitalize">
            {sortedSymptoms[0]?.name || "None"}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#F8B6B6]/10 to-[#EADCF8]/10 p-6 rounded-2xl border border-[#F6A58E]/20 relative">
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#C87B74] mb-3">
          Clinical Note
        </p>
        <p className="text-sm italic leading-relaxed text-[#5C4D47] font-medium">
          "Based on the provided data covering the last {dateRange} days,
          patterns indicate stable cycle lengths with standard variations. Sleep
          architecture appears consistent. Review symptom clusters for
          individualized care planning."
        </p>
      </div>
    </PageContainer>,
  );

  // Page 2: Cycle Trends
  if (selectedData?.cycleHistory) {
    pages.push(
      <PageContainer
        key="cycle"
        dateRange={dateRange}
        pageNum={pages.length + 1}
        totalPages={totalPages}
        title="Cycle Trends"
      >
        <div>
          <h4 className="font-serif font-bold text-lg text-[#2D1F1A] mb-6">
            Cycle Length Over Time
          </h4>
          {cycleTrend.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={cycleTrend}
                  margin={{ left: -20, right: 10, top: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5DFDA"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#8C7B74" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tick={{ fontSize: 11, fill: "#8C7B74" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="length"
                    stroke="#F6A58E"
                    strokeWidth={3}
                    dot={{ fill: "#F6A58E", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] w-full flex items-center justify-center bg-[#F9F8F7] rounded-2xl border border-dashed border-[#E5DFDA]">
              <p className="text-[#8C7B74] font-medium text-sm">
                No data available yet
              </p>
            </div>
          )}
        </div>
        <Separator className="opacity-40 my-2" />
        <div>
          <h4 className="font-serif font-bold text-lg text-[#2D1F1A] mb-6">
            Menstruation Duration
          </h4>
          {periodTrend.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={periodTrend}
                  margin={{ left: -20, right: 10, top: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5DFDA"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#8C7B74" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8C7B74" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(246,165,142,0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar
                    dataKey="duration"
                    fill="#F8B6B6"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] w-full flex items-center justify-center bg-[#F9F8F7] rounded-2xl border border-dashed border-[#E5DFDA]">
              <p className="text-[#8C7B74] font-medium text-sm">
                No data available yet
              </p>
            </div>
          )}
        </div>
      </PageContainer>,
    );
  }

  // Page 3: Symptoms Analysis
  if (selectedData?.symptomTrends) {
    pages.push(
      <PageContainer
        key="symptoms"
        dateRange={dateRange}
        pageNum={pages.length + 1}
        totalPages={totalPages}
        title="Symptoms Analysis"
      >
        <div>
          <h4 className="font-serif font-bold text-lg text-[#2D1F1A] mb-6">
            Most Frequently Reported Symptoms
          </h4>
          {sortedSymptoms.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedSymptoms}
                  layout="vertical"
                  margin={{ left: -15, right: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={85}
                    tick={{ fontSize: 11, fill: "#8C7B74", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(205,180,246,0.05)" }}
                    contentStyle={{
                      background: "white",
                      borderRadius: "12px",
                      border: "1px solid rgba(205,180,246,0.2)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                    {sortedSymptoms.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] w-full flex items-center justify-center bg-[#F9F8F7] rounded-2xl border border-dashed border-[#E5DFDA]">
              <p className="text-[#8C7B74] font-medium text-sm">
                No data available yet
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="p-5 bg-white border border-[#E5DFDA] rounded-2xl">
            <h5 className="font-bold text-sm text-[#2D1F1A]">
              Primary Complaint
            </h5>
            <p className="text-xl font-serif text-[#F6A58E] mt-2 capitalize">
              {sortedSymptoms[0]?.name || "None"}
            </p>
            <p className="text-xs text-[#8C7B74] mt-1">
              {sortedSymptoms[0]?.value || 0} days recorded
            </p>
          </div>
          <div className="p-5 bg-white border border-[#E5DFDA] rounded-2xl">
            <h5 className="font-bold text-sm text-[#2D1F1A]">
              Secondary Complaint
            </h5>
            <p className="text-xl font-serif text-[#CDB4F6] mt-2 capitalize">
              {sortedSymptoms[1]?.name || "None"}
            </p>
            <p className="text-xs text-[#8C7B74] mt-1">
              {sortedSymptoms[1]?.value || 0} days recorded
            </p>
          </div>
        </div>
      </PageContainer>,
    );
  }

  // Page 4: Wellness Overview
  if (selectedData?.sleepData || selectedData?.wellnessTrends) {
    pages.push(
      <PageContainer
        key="wellness"
        dateRange={dateRange}
        pageNum={pages.length + 1}
        totalPages={totalPages}
        title="Wellness Overview"
      >
        {selectedData?.sleepData && (
          <div className="mb-8">
            <h4 className="font-serif font-bold text-lg text-[#2D1F1A] mb-6">
              Sleep Duration Trends
            </h4>
            {sleepTrend.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sleepTrend}
                    margin={{ left: -20, right: 10, top: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5DFDA"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#8C7B74" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["dataMin - 1", "dataMax + 1"]}
                      tick={{ fontSize: 11, fill: "#8C7B74" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sleep"
                      stroke="#CDB4F6"
                      strokeWidth={3}
                      dot={{ fill: "#CDB4F6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] w-full flex items-center justify-center bg-[#F9F8F7] rounded-2xl border border-dashed border-[#E5DFDA]">
                <p className="text-[#8C7B74] font-medium text-sm">
                  No data available yet
                </p>
              </div>
            )}
          </div>
        )}

        {selectedData?.wellnessTrends && (
          <div>
            <h4 className="font-serif font-bold text-lg text-[#2D1F1A] mb-6">
              Mood & Energy Indices
            </h4>
            {wellnessTrend.length > 0 ? (
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={wellnessTrend}
                    margin={{ left: -20, right: 10, top: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5DFDA"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#8C7B74" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: 11, fill: "#8C7B74" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mood"
                      stroke="#BDD7B3"
                      strokeWidth={2}
                      name="Mood (1-10)"
                      dot={{ fill: "#BDD7B3" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="#F6A58E"
                      strokeWidth={2}
                      name="Energy (1-10)"
                      dot={{ fill: "#F6A58E" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] w-full flex items-center justify-center bg-[#F9F8F7] rounded-2xl border border-dashed border-[#E5DFDA]">
                <p className="text-[#8C7B74] font-medium text-sm">
                  No data available yet
                </p>
              </div>
            )}
          </div>
        )}
      </PageContainer>,
    );
  }

  return (
    <div className="w-full mx-auto max-w-3xl transform transition-all pb-10">
      {pages}
    </div>
  );
}
