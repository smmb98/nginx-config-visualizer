import { useAppStore } from '@/store/useAppStore'
import { Upload, Sparkles, Shield, Zap, FileCode } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function LandingPage() {
  const { createNewConfig, importFiles } = useAppStore()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      importFiles(files)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-base">
      {/* Main Content */}
      <main className="flex-1 pt-16 pb-16 px-6 md:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center mb-16 space-y-6">
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-active opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-active"></span>
            </span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest" style={{ fontFamily: 'Geist, sans-serif', letterSpacing: '0.05em' }}>
              Version 1.0.0
            </span>
          </div>

          {/* Headline - White main text, primary keyword */}
          <h1 className="font-headline-lg font-extrabold tracking-tighter text-white max-w-4xl mx-auto leading-[1.1] text-6xl md:text-7xl">
            Master Your <span className="text-primary">Nginx</span> Configurations
          </h1>

          {/* Subheadline - body-md from design spec */}
          <p 
            className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'Geist, sans-serif',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: '400'
            }}
          >
            Upload your Nginx configurations to generate instant interactive visualizations.
            Identify complex proxy paths, optimize traffic routing, and audit syntax with engineered precision.
          </p>
        </section>

        {/* Two-Card Action Layout */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {/* Create New Config Card */}
          <button
            onClick={createNewConfig}
            className="group relative flex flex-col items-start p-8 rounded-xl border border-surface-variant bg-surface hover:bg-surface-container-low transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary-container/20">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <span 
                className="text-xl font-semibold text-on-surface"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: '600'
                }}
              >
                Create New Config
              </span>
            </div>
            <p 
              className="text-on-surface-variant leading-relaxed"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '400'
              }}
            >
              Start with a fresh default Nginx configuration template. Perfect for new projects and learning.
            </p>
            <div className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>

          {/* Import Existing Config Card */}
          <label className="group cursor-pointer flex flex-col items-start p-8 rounded-xl border border-surface-variant bg-surface hover:bg-surface-container-low transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-accent-active/20">
                <Upload className="w-6 h-6 text-accent-active" />
              </div>
              <span 
                className="text-xl font-semibold text-on-surface"
                style={{
                  fontFamily: 'Geist, sans-serif',
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: '600'
                }}
              >
                Import Existing Config
              </span>
            </div>
            <p 
              className="text-on-surface-variant leading-relaxed"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '400'
              }}
            >
              Upload your existing .conf files to visualize, edit, and audit your current Nginx setup.
            </p>
            <input
              type="file"
              multiple
              accept=".conf,.inc"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <div className="absolute inset-0 rounded-xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </label>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <Card className="glass-panel p-8 rounded-xl border border-outline-variant hover:border-primary/40 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
              <FileCode className="w-6 h-6" />
            </div>
            <h4 
              className="font-semibold text-white mb-3"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '24px',
                lineHeight: '32px',
                fontWeight: '600'
              }}
            >
              Hierarchical Logic
            </h4>
            <p 
              className="text-on-surface-variant leading-relaxed"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '400'
              }}
            >
              Trace every proxy_pass and upstream directive across included files. Visualize cascading server blocks.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="glass-panel p-8 rounded-xl border border-outline-variant hover:border-accent-active/40 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-accent-active/10 border border-accent-active/20 flex items-center justify-center text-accent-active mb-6 group-hover:bg-accent-active/20 transition-colors">
              <Shield className="w-6 h-6" />
            </div>
            <h4 
              className="font-semibold text-white mb-3"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '24px',
                lineHeight: '32px',
                fontWeight: '600'
              }}
            >
              Syntax Validation
            </h4>
            <p 
              className="text-on-surface-variant leading-relaxed"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '400'
              }}
            >
              Real-time linting for Nginx syntax errors. Detect misconfigured semicolons, unclosed braces, and invalid contexts.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="glass-panel p-8 rounded-xl border border-outline-variant hover:border-tertiary/40 transition-colors group">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary mb-6 group-hover:bg-tertiary/20 transition-colors">
              <Zap className="w-6 h-6" />
            </div>
            <h4 
              className="font-semibold text-white mb-3"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '24px',
                lineHeight: '32px',
                fontWeight: '600'
              }}
            >
              Load Analysis
            </h4>
            <p 
              className="text-on-surface-variant leading-relaxed"
              style={{
                fontFamily: 'Geist, sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: '400'
              }}
            >
              Simulate traffic routing through upstream groups. Identify single points of failure before production.
            </p>
          </Card>
        </section>
      </main>
    </div>
  )
}
