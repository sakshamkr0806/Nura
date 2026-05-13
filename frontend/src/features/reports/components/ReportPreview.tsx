import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ReportPreviewProps {
  data: any
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']

export function ReportPreview({ data }: ReportPreviewProps) {
  if (!data) return null

  return (
    <Card className="w-full border-none bg-background shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Clinical Report Preview</CardTitle>
        <CardDescription>Generated for the last 90 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-muted-foreground">Days Logged</p>
            <p className="text-2xl font-bold">{data.totalDaysLogged}</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-semibold text-muted-foreground">Avg. Sleep</p>
            <p className="text-2xl font-bold">
              {data.averages?.sleep?.toFixed(1) || '0.0'}h
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-bold">Symptom Frequency</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.symptomFrequency} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.symptomFrequency.map((_: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Separator />

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <p className="mb-1 text-xs font-bold uppercase text-primary">
            Clinical Note
          </p>
          <p className="text-sm italic leading-relaxed text-muted-foreground">
            "Your symptom frequency has remained stable compared to the previous
            quarter. Ensure you discuss the clusters of heavy bleeding logged in
            late April with your provider."
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
