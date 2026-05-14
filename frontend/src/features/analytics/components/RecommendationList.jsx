import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Utensils, Moon, Activity } from "lucide-react";

const categoryIcons = {
  Rest: Moon,
  Nutrition: Utensils,
  Activity: Activity,
  Wellness: Sparkles,
};

export function RecommendationList({ recommendations }) {
  return (
    <div className="space-y-4">
      <h3 className="px-1 text-lg font-semibold">
        Personalized Recommendations
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {recommendations.map((rec, idx) => {
          const Icon = categoryIcons[rec.category] || Sparkles;
          return (
            <Card key={idx} className="border-none bg-muted/30 shadow-none">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="rounded-lg bg-background p-2 text-primary">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold">
                    {rec.action}
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary/70">
                    {rec.category}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm italic text-muted-foreground">
                  "{rec.tip}"
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
