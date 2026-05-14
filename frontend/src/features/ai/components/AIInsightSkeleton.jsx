import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AIInsightSkeleton() {
  return (
    <Card className="w-full animate-pulse border-primary/20 bg-primary/5">
      <CardHeader className="space-y-2">
        <div className="h-4 w-1/4 rounded bg-primary/20"></div>
        <div className="h-3 w-1/3 rounded bg-muted"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-3/4 rounded bg-muted"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded-full bg-primary/10"></div>
          <div className="h-8 w-24 rounded-full bg-primary/10"></div>
        </div>
      </CardContent>
    </Card>
  );
}
