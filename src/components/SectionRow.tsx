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

export function SectionRow({ label, tooltip, children, align = "top" }: SectionRowProps) {
  return (
    <Field
      orientation="horizontal"
      className={cn("items-center", align === "top" && "items-start")}
    >
      <FieldLabel className="w-44 shrink-0">
        {tooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex items-center gap-1.5 cursor-help text-sm font-medium">
                {label}
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm font-medium">{label}</span>
        )}
      </FieldLabel>
      <FieldContent className="flex-1">{children}</FieldContent>
    </Field>
  );
}
