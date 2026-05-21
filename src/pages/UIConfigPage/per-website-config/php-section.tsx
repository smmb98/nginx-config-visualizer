import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";

interface PhpSectionProps {
  site: Site;
}

export function PhpSection({ site }: PhpSectionProps) {
  const updateSiteField = useGlobalConfigStore((s) => s.updateSiteField);
  const php = site.php;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">PHP Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="PHP-FPM"
          tooltip="Enable PHP-FPM for processing PHP files on this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`php-enabled-${site.id}`}
              checked={php.enabled}
              onCheckedChange={(v) => updateSiteField(site.id, "php.enabled", v)}
            />
            <Label htmlFor={`php-enabled-${site.id}`} className="text-sm">
              Enable PHP-FPM
            </Label>
          </div>
        </SectionRow>
        {php.enabled && (
          <>
            <SectionRow
              label="WordPress"
              tooltip="WordPress preset for PHP configuration."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`wp-${site.id}`}
                  checked={php.wordpress}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.wordpress", v)}
                />
                <Label htmlFor={`wp-${site.id}`} className="text-sm">
                  WordPress preset
                </Label>
              </div>
            </SectionRow>
            <SectionRow
              label="Drupal"
              tooltip="Drupal preset for PHP configuration."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`drupal-${site.id}`}
                  checked={php.drupal}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.drupal", v)}
                />
                <Label htmlFor={`drupal-${site.id}`} className="text-sm">
                  Drupal preset
                </Label>
              </div>
            </SectionRow>
            <SectionRow
              label="Magento"
              tooltip="Magento preset for PHP configuration."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`magento-${site.id}`}
                  checked={php.magento}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.magento", v)}
                />
                <Label htmlFor={`magento-${site.id}`} className="text-sm">
                  Magento preset
                </Label>
              </div>
            </SectionRow>
            <SectionRow
              label="Joomla"
              tooltip="Joomla preset for PHP configuration."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`joomla-${site.id}`}
                  checked={php.joomla}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.joomla", v)}
                />
                <Label htmlFor={`joomla-${site.id}`} className="text-sm">
                  Joomla preset
                </Label>
              </div>
            </SectionRow>
          </>
        )}
      </div>
    </div>
  );
}