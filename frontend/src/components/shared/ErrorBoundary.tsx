import { Component } from "react"
import type { ErrorInfo, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
    window.location.href = "/dashboard"
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-6">
          <div className="p-4 bg-destructive/10 text-destructive rounded-full">
            <AlertTriangle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              We encountered an unexpected error while rendering this page. 
              Don't worry, your data is safe.
            </p>
          </div>
          <Button onClick={this.handleReset} className="gap-2">
            <RefreshCcw size={18} />
            Return to Dashboard
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

