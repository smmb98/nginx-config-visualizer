import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UIConfigPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-background-base p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="mb-8">
          <div>
            <h1 className="text-headline-lg text-on-surface mb-2">
              Configuration Generator
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              Optimize your NGINX environment with precise performance and
              security directives. Changes are validated in real-time against
              current schema.
            </p>
          </div>
        </div>

        {/* Per-Website Config heading */}
        <h2 className="text-headline-md text-on-surface">Per-Website Config</h2>

        {/* Site Selector */}
        <div className="w-full border-b border-outline-variant flex justify-center">
          {/* Site tabs */}
          <Tabs defaultValue="example.com">
            <TabsList variant="line">
              <TabsTrigger value="example.com">example.com</TabsTrigger>
              <TabsTrigger value="add-site">+ Add Site</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Empty card */}
        <div className="glass-panel rounded-xl p-6 min-h-[400px]" />
      </div>
    </div>
  );
}
