export function ConfigurationView() {
  return (
    <main className="flex-1 overflow-y-auto custom-scrollbar bg-surface pt-16 pb-8">
      <div className="max-w-4xl mx-auto mb-10 px-gutter md:px-container-padding-desktop">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-2">
              Configuration Generator
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-lg">
              Optimize your NGINX environment with precise performance and security directives.
              Changes are validated in real-time against current schema.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 bg-surface-container-high p-1 rounded-lg border border-outline-variant">
            <button className="px-4 py-1.5 rounded text-label-caps font-label-caps bg-primary text-on-primary">
              Server
            </button>
            <button className="px-4 py-1.5 rounded text-label-caps font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              HTTPS
            </button>
            <button className="px-4 py-1.5 rounded text-label-caps font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              PHP
            </button>
            <button className="px-4 py-1.5 rounded text-label-caps font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              Security
            </button>
            <button className="px-4 py-1.5 rounded text-label-caps font-label-caps text-on-surface-variant hover:text-on-surface transition-colors">
              Caching
            </button>
          </div>
        </div>

        {/* Configuration Panels */}
        <div className="space-y-panel-gap">
          {/* Compression & Performance */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-primary" data-icon="bolt">
                  bolt
                </span>
                Compression &amp; Performance
              </h3>
            </div>

            <div className="space-y-6">
              {/* Toggle items */}
              {[
                { name: 'Enable Brotli Compression', desc: 'Superior compression for modern browsers.', checked: true },
                { name: 'Gzip Compression', desc: 'Legacy compression fallback for older clients.', checked: true },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-all group"
                >
                  <div>
                    <p className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="sr-only peer"
                      readOnly
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </label>
                </div>
              ))}

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Compression Level
                  </label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                    <option>Level 5 (Balanced)</option>
                    <option>Level 9 (Maximum)</option>
                    <option>Level 1 (Fastest)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-label-caps font-label-caps text-on-surface-variant">
                    Worker Processes
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2 text-body-sm font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="auto"
                    type="number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FastCGI & Proxy Caching */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center">
                <span className="material-symbols-outlined mr-2 text-tertiary" data-icon="memory">
                  memory
                </span>
                FastCGI &amp; Proxy Caching
              </h3>
            </div>

            <div className="space-y-4">
              {/* Cache enable */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 transition-all">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3" data-icon="database">
                    database
                  </span>
                  <p className="font-body-md text-body-md text-on-surface">Enable FastCGI Caching</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" readOnly />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                </label>
              </div>

              {/* Cache path display */}
              <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    Cache Path
                  </span>
                  <span className="text-code-md font-code-md text-accent-active">/var/run/nginx-cache</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-active h-full w-2/3"></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-outline">Used: 64.2GB</span>
                  <span className="text-[10px] text-outline">Total: 100GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generator Health */}
          <div className="glass-panel p-6 rounded-xl">
            <h4 className="text-label-caps font-label-caps text-on-surface-variant mb-4">
              Generator Health
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent-active mr-3"></div>
                  <span className="font-body-sm text-body-sm text-on-surface">Syntax Validity</span>
                </div>
                <span className="text-accent-active font-code-md text-code-md">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent-active mr-3 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="font-body-sm text-body-sm text-on-surface">Compliance Score</span>
                </div>
                <span className="text-accent-active font-code-md text-code-md">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
