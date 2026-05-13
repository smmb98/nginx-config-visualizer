import { useAppStore } from "@/store/useAppStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles } from "lucide-react";

export function LandingPage() {
  const { createNewConfig, importFiles } = useAppStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      importFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      importFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-base text-on-surface">
      <Header />

      <main className="relative pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* ── Hero ── */}
        <div className="text-center mb-16 space-y-6">
          {/* Live badge */}
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-label-caps uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-active opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-active" />
            </span>
            Version 1.0.0 Live
          </div> */}

          <h1 className="tracking-tighter text-white max-w-4xl mx-auto leading-[1.1] text-6xl md:text-7xl">
            Master Your <span className="text-primary">Nginx</span>{" "}
            Configurations
          </h1>

          <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Upload your Nginx configurations to generate instant interactive
            visualizations. Identify complex proxy paths, optimize traffic
            routing, and audit syntax with engineered precision.
          </p>
        </div>

        {/* ── Drop zone + OR + Create New Config — unified action block ── */}
        <div className="w-full max-w-3xl flex flex-col md:flex-row items-stretch gap-0 mb-12">
          {/* Drop zone */}
          <div
            className="flex-1 glass-panel rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 glow-indigo group cursor-pointer hover:border-primary/50 transition-all duration-300 py-12 px-8"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() =>
              document.getElementById("file-upload-input")?.click()
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              document.getElementById("file-upload-input")?.click()
            }
          >
            <input
              id="file-upload-input"
              type="file"
              multiple
              accept=".conf,.inc"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary border border-outline-variant group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-headline-md text-white mb-1">
                Drop your Nginx .conf files here
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Upload your existing .conf files to visualize, edit, and audit
                your current Nginx setup.
              </p>
            </div>
          </div>

          {/* ── OR divider — vertical on desktop, horizontal on mobile ── */}
          <div className="flex md:flex-col items-center justify-center px-0 py-4 md:py-0 md:px-4 gap-2 md:gap-3 shrink-0">
            {/* Top line */}
            <div className="flex-1 md:w-px md:h-full w-full h-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-outline-variant to-outline-variant/40" />
            {/* OR badge */}
            <div className="shrink-0 w-8 h-8 rounded-full border border-outline-variant bg-surface-container-low flex items-center justify-center shadow-[0_0_12px_rgba(192,193,255,0.08)]">
              <span className="text-[10px] font-bold text-on-surface-variant tracking-widest select-none">
                OR
              </span>
            </div>
            {/* Bottom line */}
            <div className="flex-1 md:w-px md:h-full w-full h-px bg-gradient-to-l md:bg-gradient-to-t from-transparent via-outline-variant to-outline-variant/40" />
          </div>

          {/* Create New Config card */}
          <button
            onClick={createNewConfig}
            className="flex-1 group relative flex flex-col items-start justify-center p-8 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-left"
          >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-200">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span className="text-headline-md text-on-surface">
                Create New Config
              </span>
            </div>
            <p className="relative text-body-md text-on-surface-variant leading-relaxed">
              Start with a fresh default Nginx configuration template. Perfect
              for new projects and learning.
            </p>

            {/* Arrow hint */}
            <div className="relative mt-6 flex items-center gap-1.5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-0 group-hover:translate-x-1">
              <span className="text-body-sm font-medium">Get started</span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </button>
        </div>
        {/* ── Feature grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {/* Hierarchical Logic */}
          <div className="glass-panel p-8 rounded-xl hover:border-primary/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
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
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
            </div>
            <h4 className="text-headline-md text-white mb-3">
              Hierarchical Logic
            </h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Trace every proxy_pass and upstream directive across included
              files. Visualize the cascading logic of your server blocks in a
              unified canvas.
            </p>
          </div>

          {/* Syntax Validation */}
          <div className="glass-panel p-8 rounded-xl hover:border-accent-active/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-accent-active/10 border border-accent-active/20 flex items-center justify-center text-accent-active mb-6 group-hover:bg-accent-active/20 transition-colors">
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
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h4 className="text-headline-md text-white mb-3">
              Syntax Validation
            </h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Real-time linting for Nginx syntax errors. Automatically detects
              misconfigured semicolons, unclosed braces, and invalid directive
              contexts.
            </p>
          </div>

          {/* Load Analysis */}
          <div className="glass-panel p-8 rounded-xl hover:border-tertiary/40 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary mb-6 group-hover:bg-tertiary/20 transition-colors">
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
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <h4 className="text-headline-md text-white mb-3">Load Analysis</h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Simulate traffic routing through your upstream groups. Identify
              single points of failure and bottlenecks before they impact
              production.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
