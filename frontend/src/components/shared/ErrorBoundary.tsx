import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
    window.location.href = '/dashboard'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-6 text-center">
          <div className="rounded-full bg-destructive/10 p-4 text-destructive">
            <AlertTriangle size={48} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mx-auto max-w-md text-muted-foreground">
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
