import { useAppStore, type TabType } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Settings, Code2, GitBranch, BarChart3 } from "lucide-react";

interface TabItem {
  id: TabType;
  label: string;
  icon: ReactNode;
}

const tabs: TabItem[] = [
  { id: "ui", label: "UI Config", icon: <Settings className="w-4 h-4" /> },
  { id: "code", label: "Code", icon: <Code2 className="w-4 h-4" /> },
  { id: "visual", label: "Visual", icon: <GitBranch className="w-4 h-4" /> },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

export function Header() {
  const { activeTab, switchTab, resetWorkspace, isInitialized } = useAppStore();

  return (
    <header className="fixed top-0 w-full h-16 flex items-center px-6 z-50 border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-md">
      {/* Logo */}
      <div className="w-36 shrink-0">
        <span className="text-headline-md font-bold text-primary tracking-tighter select-none">
          NGINX VIZ
        </span>
      </div>

      {/* Tabs */}
      {isInitialized && (
        <nav className="flex-1 flex items-center justify-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-body-sm font-medium transition-all duration-150",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-b-2 border-primary/30"
                  : "text-on-surface-variant hover:text-primary hover:border-primary/30 hover:bg-primary/20 hover:border-b-2",
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Spacer when not initialized so logo stays left */}
      {!isInitialized && <div className="flex-1" />}

      {/* Reset button — fixed width matching logo side for balance */}
      <div className="w-36 shrink-0 flex justify-end">
        {isInitialized && (
          <button
            onClick={resetWorkspace}
            title="Back to home"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-body-sm text-accent-error bg-accent-error/10 border  border-accent-error hover:bg-accent-error/20 transition-all duration-150"
          >
            {/* home / reset icon */}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Reset
          </button>
        )}
      </div>
    </header>
  );
}
