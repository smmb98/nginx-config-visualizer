export function VisualConfigPage() {
  return (
    <div className="flex-1 relative bg-background-base dot-grid overflow-hidden flex items-center justify-center">
      {/* SVG edges simulation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#8083ff" />
          </marker>
        </defs>
        <path
          d="M 400 300 Q 550 300, 700 150"
          fill="none"
          stroke="#8083ff"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="opacity-60"
        />
        <path
          d="M 400 350 Q 550 350, 700 500"
          fill="none"
          stroke="#8083ff"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className="bezier-path opacity-40"
        />
      </svg>

      {/* Server node */}
      <div className="absolute left-40 top-1/2 -translate-y-1/2 glass-panel rounded-xl p-6 w-80 shadow-2xl border border-indigo-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
              />
            </svg>
            <span className="text-label-caps text-primary tracking-widest">
              SERVER
            </span>
          </div>
          <span className="text-code-md text-outline">80/443</span>
        </div>
        <h3
          className="text-headline-md text-on-surface mb-4"
          style={{ fontSize: "18px" }}
        >
          server_block: primary
        </h3>
        <div className="space-y-3">
          {[
            { path: "/api", upstream: "upstream_api" },
            { path: "/auth", upstream: "upstream_auth" },
          ].map(({ path, upstream }) => (
            <div
              key={path}
              className="glass-panel p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-accent-active/50 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-code-md text-xs text-accent-active">
                  location {path}
                </span>
                <span className="text-[10px] text-outline">
                  proxy_pass {upstream}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upstream nodes */}
      <div className="absolute right-40 top-20 glass-panel rounded-xl p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-4 h-4 text-outline"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <span className="text-label-caps text-outline">UPSTREAM</span>
        </div>
        <div className="text-code-md text-sm text-on-surface mb-3">
          upstream_api
        </div>
        <div className="space-y-1">
          {[
            "server 10.0.1.4:8080 weight=3",
            "server 10.0.1.5:8080 max_fails=2",
          ].map((s) => (
            <div key={s} className="text-[10px] text-outline">
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-40 bottom-20 glass-panel rounded-xl p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <svg
            className="w-4 h-4 text-outline"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <span className="text-label-caps text-outline">UPSTREAM</span>
        </div>
        <div className="text-code-md text-sm text-on-surface mb-3">
          upstream_auth
        </div>
        <div className="text-[10px] text-outline">
          server auth-svc-01:9000 fail_timeout=30s
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-12 right-8 flex flex-col gap-2">
        <div className="bg-surface-container-high rounded-lg p-1 border border-outline-variant flex flex-col shadow-xl">
          <button className="p-2 hover:bg-surface-variant transition-colors rounded text-on-surface-variant">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <div className="h-px bg-outline-variant mx-2" />
          <button className="p-2 hover:bg-surface-variant transition-colors rounded text-on-surface-variant">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
        </div>
        <button className="p-3 bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant shadow-xl hover:text-primary transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </button>
      </div>

      {/* Coming soon overlay hint */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 glass-panel rounded-full text-body-sm text-on-surface-variant">
        ReactFlow canvas —{" "}
        <span className="text-primary">Coming in Milestone 5</span>
      </div>
    </div>
  );
}
