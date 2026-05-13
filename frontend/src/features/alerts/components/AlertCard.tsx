import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Info, Stethoscope, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type AlertLevel = 'INFO' | 'ATTENTION' | 'MEDICAL_SUGGESTION'

interface Alert {
  id: string
  title: string
  message: string
  level: AlertLevel
  isRead: boolean
  createdAt: string
}

interface AlertCardProps {
  alert: Alert
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export function AlertCard({ alert, onMarkAsRead, onDelete }: AlertCardProps) {
  const levelStyles: Record<AlertLevel, { icon: any, color: string, badge: string }> = {
    INFO: { icon: Info, color: 'text-blue-500', badge: 'bg-blue-500/10 text-blue-500' },
    ATTENTION: { icon: AlertCircle, color: 'text-orange-500', badge: 'bg-orange-500/10 text-orange-500' },
    MEDICAL_SUGGESTION: { icon: Stethoscope, color: 'text-destructive', badge: 'bg-destructive/10 text-destructive' },
  }

  const { icon: Icon, color, badge } = levelStyles[alert.level]

  return (
    <Card className={cn("relative overflow-hidden transition-all", !alert.isRead && "border-primary/40 bg-primary/5 shadow-sm")}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline" className={cn("border-none", badge)}>
            {alert.level.replace('_', ' ')}
          </Badge>
          <div className="flex gap-1">
            {!alert.isRead && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onMarkAsRead(alert.id)}>
                <Check size={14} />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDelete(alert.id)}>
              <X size={14} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Icon className={cn("h-4 w-4", color)} />
          <CardTitle className="text-sm font-bold">{alert.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {alert.message}
        </p>
      </CardContent>
    </Card>
  )
}
