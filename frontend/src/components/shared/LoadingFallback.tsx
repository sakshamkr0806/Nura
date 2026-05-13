import { Loader2 } from "lucide-react"

export function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">
        Loading CycleWell...
      </p>
    </div>
  )
}
