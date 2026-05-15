import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";

export function PerformanceSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Performance Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Disable HTML caching"
          tooltip="Disables the sending of the ETag and Last-Modified headers for HTML files, preventing browser caching."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="disable-html-caching" />
            <Label htmlFor="disable-html-caching" className="text-sm">
              Disable HTML caching
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Gzip compression"
          tooltip="Enables gzip compression to reduce the size of transmitted data for text-based assets."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="gzip-compression" defaultChecked />
            <Label htmlFor="gzip-compression" className="text-sm">
              Enable gzip compression
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Brotli compression"
          tooltip="Enables Brotli compression. Brotli is a newer, more efficient lossless compression algorithm."
        >
          <div className="flex items-center gap-2">
            <Checkbox id="brotli-compression" />
            <Label htmlFor="brotli-compression" className="text-sm">
              Enable Brotli compression
            </Label>
          </div>
        </SectionRow>
        <SectionRow
          label="Expiration for assets"
          tooltip="Set the Cache-Control max-age for JS and CSS assets (e.g. 7d for 7 days)."
        >
          <Input placeholder="7d" className="w-32" />
        </SectionRow>
        <SectionRow
          label="Expiration for media"
          tooltip="Set the Cache-Control max-age for image and media files (e.g. 7d for 7 days)."
        >
          <Input placeholder="7d" className="w-32" />
        </SectionRow>
        <SectionRow
          label="Expiration for SVGs"
          tooltip="Set the Cache-Control max-age for SVG files (e.g. 7d for 7 days)."
        >
          <Input placeholder="7d" className="w-32" />
        </SectionRow>
        <SectionRow
          label="Expiration for fonts"
          tooltip="Set the Cache-Control max-age for font files (e.g. 7d for 7 days)."
        >
          <Input placeholder="7d" className="w-32" />
        </SectionRow>
      </div>
    </div>
  );
}
