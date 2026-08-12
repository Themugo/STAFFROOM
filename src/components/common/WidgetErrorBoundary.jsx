import React, { Component } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Widget Error Boundary caught error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-xs flex flex-col items-center justify-center text-center space-y-3 min-h-[160px]">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-[#102A43] dark:text-white">
              {this.props.title || 'Widget Temporarily Unavailable'}
            </h4>
            <p className="text-[11px] text-[#52677F] dark:text-slate-400 max-w-xs leading-relaxed">
              This widget encountered a temporary rendering issue. Other parts of StaffRoom continue to work normally.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] text-[#2563EB] text-xs font-bold border border-[#DCE6F2] transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reload Widget</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default WidgetErrorBoundary
