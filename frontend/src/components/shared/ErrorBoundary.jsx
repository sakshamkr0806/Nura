import { Component } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/dashboard";
  };

  render() {
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
      );
    }

    return this.props.children;
  }
}
