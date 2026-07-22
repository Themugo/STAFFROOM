import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 dark:bg-danger-900/40">
              <AlertTriangle size={28} className="text-danger-600 dark:text-danger-400" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              An unexpected error occurred. Try refreshing the page, or return to the dashboard.
            </p>
            {this.state.error?.message && (
              <pre className="mt-4 rounded-lg bg-gray-100 p-3 text-xs text-left text-gray-600 overflow-x-auto dark:bg-gray-800 dark:text-gray-400">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={this.handleReset} className="btn-secondary">
                <RefreshCw size={18} /> Try again
              </button>
              <a href="/dashboard" className="btn-primary">
                <Home size={18} /> Dashboard
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
