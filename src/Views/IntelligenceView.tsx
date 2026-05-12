import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export function IntelligenceView() {
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section: Natural Language Summary */}
        <section>
          <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] text-primary">auto_awesome</span>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              {/* Summary Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary" data-weight="fill">
                    auto_awesome
                  </span>
                  <h2 className="font-headline-md text-headline-md text-primary">
                    Natural Language Summary
                  </h2>
                </div>

                <p className="text-on-surface-variant text-body-md leading-relaxed mb-6">
                  Your NGINX configuration is optimized for{' '}
                  <strong className="text-on-surface">high-concurrency API traffic</strong>. We've detected that 84% of your
                  upstream servers are responding within healthy latency bounds (&lt;120ms). However, the{' '}
                  <code className="bg-surface-variant px-1 rounded text-primary-fixed">nginx.conf</code>
                  file currently lacks explicit HSTS headers on the primary listener, and three upstream nodes
                  in the <code className="bg-surface-variant px-1 rounded text-primary-fixed">payment-gateway</code>{' '}
                  block are exhibiting intermittent 502 errors during peak traffic.
                </p>

                {/* Status Chips */}
                <div className="flex flex-wrap gap-4">
                  <div className="bg-primary-container/20 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                    <span className="font-body-sm text-on-primary-container">Performance: Stable</span>
                  </div>
                  <div className="bg-accent-error/20 border border-accent-error/20 px-4 py-2 rounded-lg flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-error text-sm">warning</span>
                    <span className="font-body-sm text-accent-error">Security: 3 Alerts</span>
                  </div>
                </div>
              </div>

              {/* Health Score Gauge */}
              <div className="w-full md:w-64 aspect-square glass-panel rounded-lg flex flex-col items-center justify-center border-indigo-500/30">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-variant"
                      cx="50"
                      cy="50"
                      fill="none"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                    />
                    <circle
                      className="text-primary"
                      cx="50"
                      cy="50"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="282.7"
                      strokeDashoffset="42"
                      strokeLinecap="round"
                      strokeWidth="8"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline-lg text-headline-lg">85</span>
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                      Health Score
                    </span>
                  </div>
                </div>
                <Button size="sm" className="bg-primary text-on-primary font-bold px-4 rounded-full text-body-sm">
                  View Full Insights
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Middle Section: Security Audit Checklist */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-3">
            <div className="glass-panel p-6 rounded-xl h-full flex flex-col">
              <h3 className="font-headline-md text-headline-md mb-2">Security Audit</h3>
              <p className="text-on-surface-variant text-body-sm mb-6">
                Automated scan of compliance and vulnerabilities.
              </p>
              <div className="space-y-3 flex-1">
                {/* High Risk */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-accent-error/30 bg-accent-error/5 group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-error">error</span>
                    <span className="font-body-sm font-medium">Missing HSTS</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface cursor-pointer">
                    arrow_forward
                  </span>
                </div>

                {/* Med Risk */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-tertiary-container/30 bg-tertiary-container/5 group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary">warning</span>
                    <span className="font-body-sm font-medium">Weak Cipher Suites</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface cursor-pointer">
                    arrow_forward
                  </span>
                </div>

                {/* Success */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-accent-active/30 bg-accent-active/5 group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-active">check_circle</span>
                    <span className="font-body-sm font-medium">TLS 1.3 Enforced</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface cursor-pointer">
                    arrow_forward
                  </span>
                </div>

                {/* Success */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-accent-active/30 bg-accent-active/5 group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-active">check_circle</span>
                    <span className="font-body-sm font-medium">XSS Protection Header</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-on-surface cursor-pointer">
                    arrow_forward
                  </span>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full border border-outline-variant">
                Generate Report
              </Button>
            </div>
          </div>
        </section>

        {/* Bottom Section: Optimizations & Tradeoffs */}
        <section className="max-w-7xl mx-auto pb-12">
          <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md">Optimizations &amp; Tradeoffs</h3>
              <p className="text-on-surface-variant text-body-sm">
                AI-driven recommendations for architectural tuning.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase">
                      Suggested Change
                    </th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase">
                      Benefit
                    </th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase">
                      Tradeoff
                    </th>
                    <th className="px-6 py-4 font-label-caps text-label-caps text-on-surface-variant uppercase text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {[
                    { code: 'worker_processes auto;', benefit: 'Improved CPU utilization across cores.', tradeoff: 'Slight memory overhead.' },
                    { code: 'gzip_proxied any;', benefit: 'Reduced bandwidth for proxy requests.', tradeoff: 'Higher CPU load for compression.' },
                    { code: 'proxy_buffering off;', benefit: 'Lower TTFB for streaming.', tradeoff: 'Backend connections held longer.' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="px-6 py-4 font-code-md text-code-md text-primary">{row.code}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-accent-active text-sm">bolt</span>
                          <span className="text-body-sm">{row.benefit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-tertiary text-sm">memory</span>
                          <span className="text-body-sm text-on-surface-variant">{row.tradeoff}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="link" className="text-primary font-bold text-body-sm p-0 hover:underline">
                          Apply
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
