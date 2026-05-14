import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function InsightPanel({ insights }) {
  return (
    <div className="grid gap-4">
      <h3 className="px-1 text-lg font-semibold">Pattern Analysis</h3>
      {insights.map((insight, idx) => (
        <Card
          key={idx}
          className="overflow-hidden border-l-4"
          style={{
            borderLeftColor:
              insight.type === "success"
                ? "hsl(var(--primary))"
                : insight.type === "warning"
                  ? "hsl(var(--destructive))"
                  : "hsl(var(--accent))",
          }}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              {insight.type === "success" && (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              )}
              {insight.type === "warning" && (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              {insight.type === "info" && (
                <Info className="h-4 w-4 text-accent-foreground" />
              )}
              <CardTitle className="text-sm font-bold">
                {insight.title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground">
              {insight.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
