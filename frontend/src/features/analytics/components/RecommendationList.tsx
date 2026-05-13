import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Utensils, Moon, Activity } from "lucide-react"

interface Recommendation {
  category: string
  action: string
  tip: string
}

interface RecommendationListProps {
  recommendations: Recommendation[]
}

const categoryIcons: Record<string, any> = {
  Rest: Moon,
  Nutrition: Utensils,
  Activity: Activity,
  Wellness: Sparkles,
}

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold px-1">Personalized Recommendations</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {recommendations.map((rec, idx) => {
          const Icon = categoryIcons[rec.category] || Sparkles
          return (
            <Card key={idx} className="bg-muted/30 border-none shadow-none">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <div className="p-2 bg-background rounded-lg text-primary">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-sm font-bold">{rec.action}</CardTitle>
                  <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary/70">
                    {rec.category}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground italic">"{rec.tip}"</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
