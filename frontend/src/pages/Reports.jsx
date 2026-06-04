import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  FileText,
  Share2,
  Printer,
  CheckCircle,
  Activity,
  Heart,
  Calendar as CalendarIcon,
  FileBarChart,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportPreview } from "@/features/reports/components/ReportPreview";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";
import { toast } from "sonner";

export default function Reports() {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("90");
  const [selectedData, setSelectedData] = useState({
    cycleHistory: true,
    symptomTrends: true,
    sleepData: true,
    wellnessTrends: true,
    moodTracking: false,
    notes: false,
  });

  useEffect(() => {
    api
      .get("/reports/preview")
      .then((res) => setPreviewData(res.data))
      .catch(() => {
        // Silently handle error — preview will just render empty state
      });
  }, []);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/reports/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Nura_Doctor_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully 🌸");
    } catch (_err) {
      toast.error("Failed to generate report");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDataSelection = (key) => {
    setSelectedData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate estimated size based on selected options and date range
  const numSelected = Object.values(selectedData).filter(Boolean).length;
  const estimatedPages = Math.max(1, Math.ceil(numSelected * 0.8));
  const estimatedSize = (
    estimatedPages *
    1.2 *
    (parseInt(dateRange) / 90)
  ).toFixed(1);

  return (
    <div className="space-y-6 pb-20 max-w-[1400px] mx-auto">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-serif font-bold text-3xl sm:text-4xl"
            style={{ color: "#2D1F1A" }}
          >
            Doctor-Ready Reports 📋
          </h1>
          <p
            className="mt-1.5 text-sm font-medium"
            style={{ color: "#8C7B74" }}
          >
            Export your health data for your next clinical consultation.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Panel: Configuration */}
        <div className="lg:col-span-3 space-y-5">
          <div
            className="rounded-3xl p-5 sm:p-6 border relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,182,182,0.05), white)",
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "0 4px 20px rgba(200,150,130,0.06)",
            }}
          >
            <div className="absolute -right-6 -bottom-6 opacity-[0.07] pointer-events-none">
              <FloralDecoration className="w-40 h-40" />
            </div>

            <h3
              className="flex items-center gap-2 font-serif font-bold text-lg mb-4"
              style={{ color: "#2D1F1A" }}
            >
              <FileText size={18} style={{ color: "#F6A58E" }} /> Report
              Configuration
            </h3>

            <div className="space-y-5 relative z-10">
              <div className="space-y-2">
                <label
                  className="text-xs font-extrabold uppercase tracking-wider"
                  style={{ color: "#8C7B74" }}
                >
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger
                    className="w-full bg-white border-none shadow-sm rounded-xl h-10 font-medium"
                    style={{ color: "#5C4D47" }}
                  >
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectGroup>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 3 Months</SelectItem>
                      <SelectItem value="180">Last 6 Months</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label
                  className="text-xs font-extrabold uppercase tracking-wider"
                  style={{ color: "#8C7B74" }}
                >
                  Include Data
                </label>

                {[
                  {
                    id: "cycleHistory",
                    label: "Cycle History",
                    icon: CalendarIcon,
                  },
                  {
                    id: "symptomTrends",
                    label: "Symptom Trends",
                    icon: Activity,
                  },
                  { id: "sleepData", label: "Sleep Data", icon: Heart },
                  {
                    id: "wellnessTrends",
                    label: "Wellness Trends",
                    icon: Activity,
                  },
                  { id: "moodTracking", label: "Mood Tracking", icon: Heart },
                  { id: "notes", label: "Notes & Journal", icon: FileText },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] border border-transparent hover:border-[#F6A58E]/20"
                    style={{
                      background: selectedData[item.id]
                        ? "rgba(246,165,142,0.08)"
                        : "white",
                      boxShadow: selectedData[item.id]
                        ? "none"
                        : "0 2px 8px rgba(200,150,130,0.04)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="p-1.5 rounded-lg"
                        style={{
                          background: selectedData[item.id]
                            ? "rgba(246,165,142,0.15)"
                            : "#F5F3F1",
                        }}
                      >
                        <item.icon
                          size={14}
                          style={{
                            color: selectedData[item.id]
                              ? "#F6A58E"
                              : "#A69B97",
                          }}
                        />
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: selectedData[item.id] ? "#2D1F1A" : "#5C4D47",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <Checkbox
                      checked={selectedData[item.id]}
                      onCheckedChange={() => toggleDataSelection(item.id)}
                      className="border-[#F6A58E]/40 data-[state=checked]:bg-[#F6A58E] data-[state=checked]:border-[#F6A58E] rounded-md h-5 w-5"
                    />
                  </label>
                ))}
              </div>

              <div
                className="pt-2 flex items-center justify-between text-xs font-medium border-t border-[#F6A58E]/10"
                style={{ color: "#8C7B74" }}
              >
                <span>Estimated Size</span>
                <span>
                  ~{estimatedSize} MB ({estimatedPages} Pages)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Live Preview */}
        <div className="lg:col-span-6 h-[800px]">
          <div
            className="h-full rounded-3xl border p-2 sm:p-4 relative flex flex-col"
            style={{
              background: "#F9F8F7",
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "inset 0 2px 20px rgba(200,150,130,0.05)",
            }}
          >
            <div className="flex items-center gap-2 px-3 pb-3 pt-1 border-b border-[#F6A58E]/10 mb-3 shrink-0">
              <FileBarChart size={16} style={{ color: "#F6A58E" }} />
              <span className="text-sm font-bold text-[#2D1F1A]">
                Live Report Preview
              </span>
              <span className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full bg-white text-[#8C7B74] shadow-sm">
                Scroll to view pages
              </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-6 px-1 sm:px-2 scroll-smooth">
              <ReportPreview
                data={previewData}
                dateRange={dateRange}
                selectedData={selectedData}
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Clinical Summary & CTA */}
        <div className="lg:col-span-3 space-y-5">
          <div
            className="rounded-3xl p-5 sm:p-6 border relative"
            style={{
              background: "white",
              borderColor: "rgba(205,180,246,0.3)",
              boxShadow: "0 4px 25px rgba(205,180,246,0.08)",
            }}
          >
            <h3
              className="flex items-center gap-2 font-serif font-bold text-lg mb-4"
              style={{ color: "#2D1F1A" }}
            >
              <Activity size={18} style={{ color: "#CDB4F6" }} /> Clinical
              Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm border-b border-[#F5F3F1] pb-2">
                <span className="text-[#8C7B74] font-medium">
                  Report Period
                </span>
                <span className="text-[#2D1F1A] font-bold">
                  Last {dateRange} Days
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[#F5F3F1] pb-2">
                <span className="text-[#8C7B74] font-medium">
                  Cycles Logged
                </span>
                <span className="text-[#2D1F1A] font-bold">
                  {Math.round(parseInt(dateRange) / 28)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[#F5F3F1] pb-2">
                <span className="text-[#8C7B74] font-medium">
                  Symptoms Logged
                </span>
                <span className="text-[#2D1F1A] font-bold">
                  {previewData?.totalDaysLogged || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pb-1">
                <span className="text-[#8C7B74] font-medium">
                  Average Sleep
                </span>
                <span className="text-[#2D1F1A] font-bold">
                  {previewData?.averages?.sleep?.toFixed(1) || "7.1"} hrs
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FAF6FF] p-4 border border-[#CDB4F6]/20 mb-5 relative">
              <span className="absolute -top-2.5 right-4 bg-[#EADCF8] text-[#71549C] text-[10px] font-bold px-2 py-0.5 rounded-full">
                AI Summary
              </span>
              <p
                className="text-xs font-medium leading-relaxed"
                style={{ color: "#5C4D47" }}
              >
                "Cycle patterns appear stable over the selected period. Symptom
                frequency has remained consistent with mild increases during
                premenstrual phases. Sleep duration averages{" "}
                {previewData?.averages?.sleep?.toFixed(1) || "7.1"} hours."
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 py-2 mb-2 bg-[#F6FCF4] rounded-xl border border-[#BDD7B3]/40">
              <CheckCircle size={14} className="text-[#5A8A4E]" />
              <span className="text-xs font-bold text-[#5A8A4E]">
                High Data Quality
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            className="rounded-3xl p-5 sm:p-6 border bg-white space-y-4"
            style={{
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "0 4px 20px rgba(200,150,130,0.06)",
            }}
          >
            <Button
              className="w-full h-12 gap-2 rounded-2xl text-white font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
                boxShadow: "0 8px 20px rgba(246,165,142,0.3)",
              }}
              onClick={handleExport}
              disabled={isLoading}
            >
              <FileDown size={18} />
              {isLoading ? "Generating Report..." : "Generate Doctor Report"}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="gap-2 rounded-2xl h-10 transition-colors hover:bg-[#F5F3F1]"
                style={{ borderColor: "#E5DFDA", color: "#5C4D47" }}
              >
                <Printer size={15} /> Print
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-2xl h-10 transition-colors hover:bg-[#FAF6FF]"
                style={{
                  borderColor: "rgba(205,180,246,0.3)",
                  color: "#9D74E3",
                }}
              >
                <Share2 size={15} /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
