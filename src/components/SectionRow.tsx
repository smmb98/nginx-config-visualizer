import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface SectionRowProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  align?: "top" | "center";
}

export function SectionRow({
  label,
  tooltip,
  children,
  align = "top",
}: SectionRowProps) {
  return (
    <Field
      className={cn(
        "grid grid-cols-4 gap-4 w-full",
        align === "top" ? "items-start" : "items-center",
      )}
    >
      {/* Label takes exactly 1 part of the 4 (1:3 ratio) */}
      <FieldLabel className="col-span-1 min-w-0 wrap-break-word pr-2">
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1.5 cursor-help text-sm font-medium">
                {label}
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="max-w-xs text-muted-foreground glass-panel rounded-md p-2"
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm font-medium block">{label}</span>
        )}
      </FieldLabel>

      {/* Content takes the remaining 3 parts */}
      <FieldContent className="col-span-3 w-full">{children}</FieldContent>
    </Field>
  );
}
