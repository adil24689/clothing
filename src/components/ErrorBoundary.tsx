import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-center">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-primary text-primary-foreground px-6 py-2 rounded-lg inline-block">
                <span className="font-bold text-xl">AmarShop</span>
              </div>
              <p className="text-muted-foreground">
                We're having trouble loading the app. Please try refreshing the page.
              </p>
              <Button onClick={this.handleReload} className="w-full">
                Refresh Page
              </Button>
              {typeof window !== 'undefined' && window.location.hostname === 'localhost' && this.state.error && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
