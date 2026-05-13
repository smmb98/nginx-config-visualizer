export function UIConfigPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              Configuration Generator
            </h1>
            <p className="text-body-sm text-on-surface-variant max-w-lg">
              Optimize your NGINX environment with precise performance and
              security directives. Changes are validated in real-time against
              current schema.
            </p>
          </div>
          {/* Segmented control */}
          <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-lg border border-outline-variant shrink-0">
            {["Server", "HTTPS", "PHP", "Security", "Caching"].map(
              (label, i) => (
                <button
                  key={label}
                  className={
                    i === 0
                      ? "px-4 py-1.5 rounded text-label-caps bg-primary text-on-primary"
                      : "px-4 py-1.5 rounded text-label-caps text-on-surface-variant hover:text-on-surface transition-colors"
                  }
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Compression & Performance panel */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-headline-md text-on-surface flex items-center gap-2 mb-6">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
            Compression &amp; Performance
          </h3>

          <div className="space-y-4">
            {/* Toggle row */}
            {[
              {
                label: "Enable Brotli Compression",
                desc: "Superior compression for modern browsers.",
                checked: true,
              },
              {
                label: "Gzip Compression",
                desc: "Legacy compression fallback for older clients.",
                checked: true,
              },
            ].map(({ label, desc, checked }) => (
              <div
                key={label}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div>
                  <p className="text-body-md text-on-surface group-hover:text-primary transition-colors">
                    {label}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">{desc}</p>
                </div>
                {/* Toggle switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={checked}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
                </label>
              </div>
            ))}

            {/* Input row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">
                  Compression Level
                </label>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                  <option>Level 5 (Balanced)</option>
                  <option>Level 9 (Maximum)</option>
                  <option>Level 1 (Fastest)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-label-caps text-on-surface-variant">
                  Worker Processes
                </label>
                <input
                  type="number"
                  placeholder="auto"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FastCGI & Proxy Caching panel */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-headline-md text-on-surface flex items-center gap-2 mb-6">
            <svg
              className="w-5 h-5 text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
            FastCGI &amp; Proxy Caching
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-on-surface-variant"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125m16.5 2.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                <p className="text-body-md text-on-surface">
                  Enable FastCGI Caching
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container" />
              </label>
            </div>

            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <div className="flex items-center justify-between mb-3">
                <span className="text-label-caps text-on-surface-variant">
                  Cache Path
                </span>
                <span className="text-code-md text-accent-active">
                  /var/run/nginx-cache
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div className="bg-accent-active h-full w-2/3" />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-outline">Used: 64.2 GB</span>
                <span className="text-[10px] text-outline">Total: 100 GB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Health */}
        <div className="glass-panel p-6 rounded-xl">
          <h4 className="text-label-caps text-on-surface-variant mb-4">
            Generator Health
          </h4>
          <div className="space-y-4">
            {[
              {
                label: "Syntax Validity",
                value: "PASSED",
                color: "text-accent-active",
              },
              {
                label: "Compliance Score",
                value: "100%",
                color: "text-accent-active",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-active shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-body-sm text-on-surface">{label}</span>
                </div>
                <span className={`text-code-md ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
