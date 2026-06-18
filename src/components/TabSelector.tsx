import type { MouseEvent } from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  onCloseTab?: (key: string, e: MouseEvent) => void;
  onAddTab?: () => void;
  addLabel?: string;
  showAddButton?: boolean;
}

export function TabSelector({
  tabs,
  activeTab,
  onTabChange,
  onCloseTab,
  onAddTab,
  addLabel = "Add",
  showAddButton = false,
}: TabSelectorProps) {
  return (
    <div className="w-full overflow-x-auto pb-6 -mb-px">
      <div className="w-full border-b-3 border-outline-variant">
        <ul className="flex w-max mx-auto relative top-0.75">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "cursor-pointer flex items-center gap-2 px-4 py-3 border-b-3 whitespace-nowrap transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary/80 hover:border-primary/70",
              )}
            >
              {tab.label}

              {onCloseTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.key, e);
                  }}
                  className="
                    flex items-center justify-center
                    h-5 w-5
                    rounded-full
                    opacity-50
                    hover:opacity-100
                    hover:text-red-500
                    hover:bg-accent-error/20
                    hover:border-accent-error/40
                    transition
                    duration-150
                  "
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </li>
          ))}

          {showAddButton && (
            <li className="flex items-center px-4 py-3 whitespace-nowrap">
              <button
                onClick={onAddTab}
                className="
                  cursor-pointer
                  flex items-center gap-1
                  text-on-surface-variant
                  hover:text-primary
                  transition-colors
                "
              >
                <Plus className="h-4 w-4" />
                {addLabel}
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
