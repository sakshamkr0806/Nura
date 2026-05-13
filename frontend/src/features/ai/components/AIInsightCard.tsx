import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Sparkles, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    <Card className="group relative w-full overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Decorative gradient flare */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl transition-colors group-hover:bg-primary/30" />

      <CardHeader>
        <div className="mb-1 flex items-center gap-2">
          <div className="rounded-md bg-primary p-1 text-primary-foreground">
            <Sparkles size={16} />
          </div>
          <CardTitle className="text-xl">AI Wellness Summary</CardTitle>
        </div>
        <CardDescription className="font-medium text-primary/70">
          Personalized insights based on your recent activity
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <p className="text-base leading-relaxed text-foreground/90">
          {insight.summary}
        </p>

        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Suggested Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {insight.recommendations.map((rec, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="border-none bg-primary/10 px-3 py-1 text-sm text-primary hover:bg-primary/20"
              >
                {rec}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/40 p-4">
          <div className="mt-1 text-primary">
            <Info size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Educational Note
            </p>
            <p className="text-sm leading-snug text-muted-foreground">
              {insight.educationalNote}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
