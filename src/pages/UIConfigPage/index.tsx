import { PerWebsiteConfigSection } from "./per-website-config";
import { GlobalConfigSection } from "./global-config";

export function UIConfigPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-headline-lg text-on-surface mb-2">
            Configuration Generator
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Optimize your NGINX environment with precise performance and
            security directives. Changes are validated in real-time against
            current schema.
          </p>
        </div>

        <PerWebsiteConfigSection />
        <GlobalConfigSection />
      </div>
    </div>
  );
}