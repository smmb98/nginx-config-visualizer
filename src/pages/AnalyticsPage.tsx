export function AnalyticsPage() {
  const healthScore = 85;
  // stroke-dasharray = 2πr = 2 * π * 45 ≈ 282.7
  const circumference = 282.7;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Natural Language Summary ── */}
        <section>
          <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
            {/* Background icon */}
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <svg
                className="w-32 h-32 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
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
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                  <h2 className="text-headline-md text-primary">
                    Natural Language Summary
                  </h2>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed mb-6">
                  Your NGINX configuration is optimized for{" "}
                  <strong className="text-on-surface">
                    high-concurrency API traffic
                  </strong>
                  . We've detected that 84% of your upstream servers are
                  responding within healthy latency bounds (&lt;120ms). However,
                  the{" "}
                  <code className="bg-surface-variant px-1 rounded text-primary-fixed">
                    nginx.conf
                  </code>{" "}
                  file currently lacks explicit HSTS headers on the primary
                  listener.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-primary-container/20 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
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
                        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                      />
                    </svg>
                    <span className="text-body-sm text-on-primary-container">
                      Performance: Stable
                    </span>
                  </div>
                  <div className="bg-accent-error/20 border border-accent-error/20 px-4 py-2 rounded-lg flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-accent-error"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                    <span className="text-body-sm text-accent-error">
                      Security: 3 Alerts
                    </span>
                  </div>
                </div>
              </div>

              {/* Health score gauge */}
              <div className="w-full md:w-64 aspect-square glass-panel rounded-lg flex flex-col items-center justify-center border border-indigo-500/30">
                <div className="relative w-32 h-32 mb-4">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-surface-variant"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      className="text-primary transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-headline-lg">{healthScore}</span>
                    <span
                      className="text-label-caps text-on-surface-variant uppercase"
                      style={{ fontSize: "10px" }}
                    >
                      Health Score
                    </span>
                  </div>
                </div>
                <button className="bg-primary text-on-primary font-bold px-4 py-2 rounded-full text-body-sm hover:opacity-90 transition-all active:scale-95">
                  View Full Insights
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Security Audit ── */}
        <section>
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-headline-md mb-1">Security Audit</h3>
            <p className="text-body-sm text-on-surface-variant mb-6">
              Automated scan of compliance and vulnerabilities.
            </p>

            <div className="space-y-3">
              {/* High risk */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-accent-error/30 bg-accent-error/5 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-accent-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <span className="text-body-sm font-medium">Missing HSTS</span>
                </div>
                <svg
                  className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>

              {/* Medium risk */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-tertiary-container/30 bg-tertiary-container/5 group cursor-pointer">
                <div className="flex items-center gap-3">
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
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                  <span className="text-body-sm font-medium">
                    Weak Cipher Suites
                  </span>
                </div>
                <svg
                  className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>

              {/* Pass */}
              {["TLS 1.3 Enforced", "XSS Protection Header"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-lg border border-accent-active/30 bg-accent-active/5 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-accent-active"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-body-sm font-medium">{label}</span>
                  </div>
                  <svg
                    className="w-4 h-4 text-outline group-hover:text-on-surface transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-2 border border-outline-variant rounded-lg text-body-sm hover:bg-surface-variant transition-colors">
              Generate Report
            </button>
          </div>
        </section>

        {/* ── Optimizations table ── */}
        <section className="pb-4">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="text-headline-md">
                Optimizations &amp; Tradeoffs
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                AI-driven recommendations for architectural tuning.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    {["Suggested Change", "Benefit", "Tradeoff", "Action"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-label-caps text-on-surface-variant uppercase ${i === 3 ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {[
                    {
                      directive: "worker_processes auto;",
                      benefit: "Improved CPU utilization across cores.",
                      tradeoff: "Slight increase in resident memory overhead.",
                    },
                    {
                      directive: "gzip_proxied any;",
                      benefit:
                        "Reduced bandwidth usage for all proxy requests.",
                      tradeoff: "Higher CPU load for on-the-fly compression.",
                    },
                    {
                      directive: "proxy_buffering off;",
                      benefit: "Lower Time To First Byte (TTFB) for streaming.",
                      tradeoff:
                        "Backend connections held longer under high load.",
                    },
                  ].map(({ directive, benefit, tradeoff }) => (
                    <tr
                      key={directive}
                      className="hover:bg-surface-variant/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-code-md text-primary">
                        {directive}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-accent-active shrink-0"
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
                          <span className="text-body-sm">{benefit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-tertiary shrink-0"
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
                          <span className="text-body-sm text-on-surface-variant">
                            {tradeoff}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-primary font-bold text-body-sm hover:underline">
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
