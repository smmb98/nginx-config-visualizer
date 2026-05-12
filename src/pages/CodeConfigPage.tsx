export function CodeConfigPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-container/20 text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-on-surface">Code Configuration</h2>
        <p className="text-sm text-on-surface-variant max-w-sm">
          Monaco Editor with Nginx syntax highlighting and real-time validation. Coming in Milestone 3.
        </p>
      </div>
    </div>
  )
}
