import { BookOpen, Coffee } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function Footer() {
  const { syntaxErrors, healthScore, isInitialized } = useAppStore();

  if (!isInitialized) return null;

  const syntaxValid = syntaxErrors.length === 0;

  return (
    <footer className="h-12 border-t border-border bg-surface px-4 flex items-center justify-between">
      {/* Left - Status Indicators */}
      <div className="flex items-center gap-4">
        {/* Syntax Status */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              syntaxValid ? "bg-accent-active" : "bg-accent-error",
            )}
          />
          <span className="text-xs text-on-surface-variant">
            Syntax: {syntaxValid ? "Valid" : "Invalid"}
          </span>
        </div>

        {/* Health Score */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant">Health:</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 rounded-full bg-surface-variant overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  healthScore >= 80
                    ? "bg-accent-active"
                    : healthScore >= 60
                      ? "bg-yellow-500"
                      : "bg-accent-error",
                )}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <span className="text-xs text-on-surface w-8">{healthScore}</span>
          </div>
        </div>
      </div>

      {/* Right - Monetization Links */}
      <div className="flex items-center gap-3">
        {/* Temporarily disabled - GitHub icon not available in lucide-react
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
          title="View on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
        */}
        <a
          href="https://buymeacoffee.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-active/10 text-accent-active hover:bg-accent-active/20 transition-colors text-xs font-medium"
          title="Support development"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Donate</span>
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
          title="Documentation"
        >
          <BookOpen className="w-4 h-4" />
        </a>
      </div>
    </footer>
  );
}
