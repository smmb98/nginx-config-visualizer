import Editor from '@monaco-editor/react';
import { useAppStore } from '../Stores/useAppStore';

export function EditorView() {
  const { configContent, setConfigContent } = useAppStore();

  return (
    <main className="flex-1 flex flex-col bg-surface pt-16 pb-8 overflow-hidden">
      {/* Editor Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: File Tree */}
        <nav className="w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-outline-variant flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-outline tracking-widest">FILESYSTEM</span>
            <span className="material-symbols-outlined text-xs text-outline">add_box</span>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="space-y-1">
              {/* Project Folder */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant font-body-sm">
                <span className="material-symbols-outlined text-lg">expand_more</span>
                <span className="material-symbols-outlined text-lg text-tertiary">folder</span>
                <span>/etc/nginx</span>
              </div>

              {/* Sub Files */}
              <div className="ml-6 space-y-0.5">
                <div className="flex items-center gap-2 px-3 py-1.5 text-primary bg-primary-container/10 border-l-2 border-primary font-body-sm cursor-pointer">
                  <span className="material-symbols-outlined text-lg">description</span>
                  <span>nginx.conf</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant hover:bg-surface-variant/30 rounded transition-colors font-body-sm cursor-pointer">
                  <span className="material-symbols-outlined text-lg">description</span>
                  <span>mime.types</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 text-on-surface-variant hover:bg-surface-variant/30 rounded transition-colors font-body-sm cursor-pointer">
                  <span className="material-symbols-outlined text-lg">folder</span>
                  <span>conf.d</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Editor Area */}
        <section className="flex-1 flex flex-col bg-background-base relative overflow-hidden">
          {/* Editor Tabs */}
          <div className="flex bg-surface-container-low h-10 border-b border-outline-variant">
            <div className="flex items-center gap-2 px-4 bg-surface border-r border-outline-variant border-t-2 border-t-primary text-on-surface text-body-sm font-medium">
              <span className="material-symbols-outlined text-base">description</span>
              nginx.conf
              <span className="material-symbols-outlined text-xs hover:bg-surface-variant rounded p-0.5">close</span>
            </div>
            <div className="flex items-center gap-2 px-4 text-on-surface-variant hover:bg-surface-variant/50 border-r border-outline-variant text-body-sm cursor-pointer">
              <span className="material-symbols-outlined text-base">settings_ethernet</span>
              ssl.inc
              <span className="material-symbols-outlined text-xs">close</span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              value={configContent}
              onChange={(value) => setConfigContent(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: '"JetBrains Mono", monospace',
                lineNumbers: 'on',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'line',
                tabSize: 2,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                contextmenu: false,
              }}
              loading={<div className="flex items-center justify-center h-full bg-surface">Loading editor...</div>}
            />

            {/* Floating Quick Fix Suggester */}
            <div className="absolute top-8 left-64 glass-panel rounded-lg p-4 shadow-2xl z-20 w-80">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent-error">lightbulb</span>
                <div className="space-y-2">
                  <p className="font-body-sm text-on-surface font-bold">
                    Security Violation: Weak Ciphers
                  </p>
                  <p className="font-body-sm text-on-surface-variant">
                    The current configuration uses RC4-SHA which is susceptible to several cryptographic attacks.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button className="px-3 py-1.5 bg-primary text-on-primary-container font-label-caps text-label-caps rounded-lg hover:opacity-90 transition-all">
                      QUICK FIX: MODERN
                    </button>
                    <button className="px-3 py-1.5 border border-outline-variant text-on-surface font-label-caps text-label-caps rounded-lg hover:bg-surface-variant/50 transition-all">
                      IGNORE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Overlay Widget */}
            <div className="absolute top-8 right-8 w-64 glass-panel p-4 rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-outline">LIVE ANALYSIS</span>
                <span className="w-2 h-2 rounded-full bg-accent-active shadow-[0_0_8px_#10b981]"></span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">Active Connections</span>
                  <span className="text-primary font-code-md">1.2k</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]"></div>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-on-surface-variant">Validation Status</span>
                  <span className="text-accent-error font-medium">Failed</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
