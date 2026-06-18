import { useRef, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileTree } from "@/components/FileTree";
import { UIConfigPage } from "@/pages/UIConfigPage";
import { CodeConfigPage } from "@/pages/CodeConfigPage";
import { VisualConfigPage } from "@/pages/VisualConfigPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { cn } from "@/lib/utils";

export function Workspace() {
  const {
    activeTab,
    sidebarCollapsed,
    sidebarSizePct,
    toggleSidebar,
    setSidebarSizePct,
  } = useAppStore();

  // Debounce so we don't write to the store on every drag pixel
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLayoutChanged = useCallback(
    (layout: { [panelId: string]: number }) => {
      // layout is a map of panel id → percentage (0–100).
      // We store the percentage directly — no pixel conversion needed.
      const pct = layout["file-tree"];
      if (pct == null || pct <= 0) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSidebarSizePct(pct), 300);
    },
    [setSidebarSizePct]
  );

  const renderContent = () => {
    switch (activeTab) {
      case "ui":
        return <UIConfigPage />;
      case "code":
        return <CodeConfigPage />;
      case "visual":
        return <VisualConfigPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <UIConfigPage />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-base overflow-hidden">
      <Header />

      {/* Body — between fixed header (h-16 = 4rem) and fixed footer (h-8 = 2rem) */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingTop: "4rem", paddingBottom: "2rem" }}
      >
        <PanelGroup
          orientation="horizontal"
          className="flex-1"
          onLayoutChanged={handleLayoutChanged}
        >
          {/* ── File tree panel ── */}
          {!sidebarCollapsed && (
            <>
              <Panel
                id="file-tree"
                defaultSize={`${sidebarSizePct}%`}
                minSize="200px"
                maxSize="400px"
                className="flex flex-col"
              >
                <div className="h-full flex flex-col bg-surface-container-lowest border-r border-outline-variant rounded-tr-2xl rounded-br-2xl overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant shrink-0">
                    <span className="text-label-caps text-on-surface-variant uppercase tracking-widest">
                      Files
                    </span>
                    <button
                      onClick={toggleSidebar}
                      title="Collapse file tree"
                      className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                    >
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
                          d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <FileTree />
                  </div>
                </div>
              </Panel>

              {/* Resize handle */}
              <PanelResizeHandle className="group relative w-1 flex items-center justify-center bg-transparent hover:bg-primary/20 transition-colors duration-150 cursor-col-resize">
                <div className="w-0.5 h-12 rounded-full bg-outline-variant group-hover:bg-primary/60 transition-colors duration-150" />
              </PanelResizeHandle>
            </>
          )}

          {/* ── Main content panel ── */}
          <Panel className="flex flex-col overflow-hidden relative">
            {/* Expand button when sidebar is collapsed */}
            {sidebarCollapsed && (
              <button
                onClick={toggleSidebar}
                title="Expand file tree"
                className="absolute left-2 top-4 z-10 p-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-outline hover:text-on-surface hover:border-primary/30 transition-all shadow-md"
              >
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
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            )}
            <div
              className={cn(
                "flex-1 overflow-hidden flex flex-col",
                sidebarCollapsed && "pl-0"
              )}
            >
              {renderContent()}
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <Footer />
    </div>
  );
}
