import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Info, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AIInsight {
  summary: string
  recommendations: string[]
  educationalNote: string
}

interface AIInsightCardProps {
  insight: AIInsight
}

export function AIInsightCard({ insight }: AIInsightCardProps) {
  return (
    <Card className="w-full border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background relative overflow-hidden group">
      {/* Decorative gradient flare */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
      
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1 bg-primary text-primary-foreground rounded-md">
            <Sparkles size={16} />
          </div>
          <CardTitle className="text-xl">AI Wellness Summary</CardTitle>
        </div>
        <CardDescription className="text-primary/70 font-medium">
          Personalized insights based on your recent activity
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 relative">
        <p className="text-base leading-relaxed text-foreground/90">
          {insight.summary}
        </p>

        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Suggested Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {insight.recommendations.map((rec, idx) => (
              <Badge key={idx} variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-none">
                {rec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 bg-muted/40 rounded-xl border border-border/50 flex gap-3 items-start">
          <div className="text-primary mt-1">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-muted-foreground">Educational Note</p>
            <p className="text-sm text-muted-foreground leading-snug">
              {insight.educationalNote}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
