export function CodeConfigPage() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-background-base">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant bg-surface-container-low shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-label-caps text-on-surface-variant uppercase">
            nginx.conf
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-accent-active/10 text-accent-active border border-accent-active/20">
            Valid
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-body-sm text-on-surface-variant hover:bg-surface-variant transition-colors">
            Format
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-body-sm font-bold hover:opacity-90 transition-opacity">
            Save
          </button>
        </div>
      </div>

      {/* Editor placeholder */}
      <div className="flex-1 flex items-center justify-center bg-background-base">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-container/10 border border-primary/20 text-primary">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </div>
          <h2 className="text-headline-md text-on-surface">Code Editor</h2>
          <p className="text-body-sm text-on-surface-variant max-w-sm">
            Monaco Editor with Nginx syntax highlighting and real-time
            validation.
            <br />
            <span className="text-primary">Coming in Milestone 3.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
