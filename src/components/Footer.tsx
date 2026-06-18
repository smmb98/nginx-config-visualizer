import { useAppStore } from "@/store/useAppStore";

export function Footer() {
  const { syntaxErrors, healthScore } = useAppStore();

  const syntaxValid = syntaxErrors.length === 0;
  const securityLabel =
    healthScore >= 80 ? "High" : healthScore >= 60 ? "Medium" : "Low";
  const securityColor =
    healthScore >= 80
      ? "text-accent-active"
      : healthScore >= 60
        ? "text-tertiary"
        : "text-accent-error";

  return (
    <footer className="fixed bottom-0 w-full h-8 flex items-center px-6 z-50 border-t border-outline-variant bg-surface-container-low text-code-md">
      <div className="flex items-center gap-4">
        <span className="text-on-surface-variant">
          Syntax:{" "}
          <span
            className={
              syntaxValid
                ? "text-accent-active font-bold"
                : "text-accent-error font-bold"
            }
          >
            {syntaxValid ? "Valid" : "Invalid"}
          </span>
        </span>
        <span className="text-outline-variant select-none">|</span>
        <span className="text-on-surface-variant">
          Security:{" "}
          <span className={`${securityColor} font-bold`}>{securityLabel}</span>
        </span>
        <span className="text-outline-variant select-none">|</span>
      </div>
    </footer>
  );
}
