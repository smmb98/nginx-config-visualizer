export function VisualConfigPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-container/20 text-primary">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-on-surface">Visual Configuration</h2>
        <p className="text-sm text-on-surface-variant max-w-sm">
          Interactive flow diagram of server blocks, locations, and upstream relationships using ReactFlow. Coming in Milestone 5.
        </p>
      </div>
    </div>
  )
}
