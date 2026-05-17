import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileDown, FileText, Share2, Printer } from "lucide-react";
import { ReportPreview } from "@/features/reports/components/ReportPreview";
import { FloralDecoration } from "@/components/shared/Illustrations";
import api from "@/api/axios";
import { toast } from "sonner";

export default function Reports() {
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .get("/reports/preview")
      .then((res) => setPreviewData(res.data))
      .catch((err) => console.error("Failed to fetch preview", err));
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

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="page-hero flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-serif font-bold text-4xl"
            style={{ color: "#2D1F1A" }}
          >
            Doctor-Ready Reports 📋
          </h1>
          <p className="mt-1 text-sm font-medium" style={{ color: "#8C7B74" }}>
            Export your health data for your next clinical consultation.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-2xl"
            style={{ borderColor: "rgba(246,165,142,0.3)", color: "#F6A58E" }}
          >
            <Printer size={15} /> Print
          </Button>
          <Button
            size="sm"
            className="gap-2 rounded-2xl text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #F6A58E, #F8B6B6)",
              boxShadow: "0 4px 14px rgba(246,165,142,0.35)",
            }}
            onClick={handleExport}
            disabled={isLoading}
          >
            <FileDown size={15} />
            {isLoading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar config */}
        <div className="lg:col-span-1 space-y-5">
          {/* Report config card */}
          <div
            className="rounded-3xl p-6 border relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(248,182,182,0.08), white)",
              borderColor: "rgba(246,165,142,0.15)",
              boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
            }}
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <FloralDecoration className="w-32 h-32" />
            </div>
            <h3
              className="flex items-center gap-2 font-serif font-bold text-lg mb-4"
              style={{ color: "#2D1F1A" }}
            >
              <FileText size={18} style={{ color: "#F6A58E" }} /> Report
              Configuration
            </h3>
            <p
              className="text-xs font-medium mb-5"
              style={{ color: "#8C7B74" }}
            >
              Select the data to include in your clinical export.
            </p>
            <div className="space-y-3">
              {["Cycle History", "Symptom Intensity", "Wellness Trends"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between text-sm p-3 rounded-2xl"
                    style={{ background: "rgba(246,165,142,0.06)" }}
                  >
                    <span className="font-medium" style={{ color: "#2D1F1A" }}>
                      {item}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(221,234,215,0.5)",
                        color: "#5A8A4E",
                      }}
                    >
                      Included
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Share card */}
          <div
            className="rounded-3xl p-6 border"
            style={{
              background: "white",
              borderColor: "rgba(205,180,246,0.2)",
              boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
            }}
          >
            <h3
              className="flex items-center gap-2 font-serif font-bold text-lg mb-3"
              style={{ color: "#2D1F1A" }}
            >
              <Share2 size={18} style={{ color: "#CDB4F6" }} /> Share Securely
            </h3>
            <p
              className="text-xs font-medium leading-relaxed mb-4"
              style={{ color: "#8C7B74" }}
            >
              Generate a secure link to share this report with your doctor for
              24 hours.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-2xl"
              disabled
              style={{ borderColor: "rgba(205,180,246,0.4)", color: "#CDB4F6" }}
            >
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Report preview */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-5">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="history">Past Exports</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div
                className="rounded-3xl border p-5"
                style={{
                  background: "white",
                  borderColor: "rgba(246,165,142,0.12)",
                  boxShadow: "0 2px 20px rgba(200,150,130,0.08)",
                }}
              >
                <ReportPreview data={previewData} />
              </div>
            </TabsContent>
            <TabsContent value="history">
              <div
                className="rounded-3xl border-2 border-dashed py-20 text-center"
                style={{
                  borderColor: "rgba(246,165,142,0.2)",
                  background: "rgba(255,255,255,0.5)",
                }}
              >
                <p className="text-2xl mb-3">📂</p>
                <p className="text-sm font-medium" style={{ color: "#8C7B74" }}>
                  No past exports found.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
