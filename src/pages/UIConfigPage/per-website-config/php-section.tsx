import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";
import type { Site } from "../store/types";
import { Label } from "@/components/ui/label";

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
          label="PHP"
          tooltip="Enable PHP-FPM for processing PHP files on this site."
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id={`php-enabled-${site.id}`}
              checked={php.php}
              onCheckedChange={(v) => updateSiteField(site.id, "php.php", v)}
            />
            <Label htmlFor={`php-enabled-${site.id}`} className="text-sm">
              Enable PHP
            </Label>
          </div>
        </SectionRow>
        
        {php.php && (
          <>
            <SectionRow
              label="PHP-FPM Server"
              tooltip="PHP-FPM socket or connection method"
            >
              <select
                value={php.phpServer}
                onChange={(e) => updateSiteField(site.id, "php.phpServer", e.target.value)}
                className="w-[200px] h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="unix:/var/run/php/php7.4-fpm.sock">
                  PHP-FPM 7.4
                </option>
                <option value="unix:/var/run/php/php8.0-fpm.sock">
                  PHP-FPM 8.0
                </option>
                <option value="unix:/var/run/php/php8.1-fpm.sock">
                  PHP-FPM 8.1
                </option>
                <option value="unix:/var/run/php/php8.2-fpm.sock">
                  PHP-FPM 8.2
                </option>
                <option value="unix:/var/run/php/php8.3-fpm.sock">
                  PHP-FPM 8.3
                </option>
                <option value="unix:/var/run/hhvm/hhvm.sock">HHVM</option>
                <option value="custom">Custom</option>
              </select>
            </SectionRow>
            
            {php.phpServer === "custom" && (
              <SectionRow
                label="Custom PHP-FPM Server"
                tooltip="Custom path to PHP-FPM socket or host:port"
              >
                <Input
                  value={php.phpServerCustom}
                  onChange={(e) => updateSiteField(site.id, "php.phpServerCustom", e.target.value)}
                  placeholder="/run/php/php8.1-fpm.sock"
                />
              </SectionRow>
            )}
            
            <SectionRow
              label="Backup PHP-FPM Server"
              tooltip="Backup PHP-FPM socket or connection method"
            >
              <select
                value={php.phpBackupServer}
                onChange={(e) => updateSiteField(site.id, "php.phpBackupServer", e.target.value)}
                className="w-[200px] h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
              >
                <option value="">None</option>
                <option value="unix:/var/run/php/php7.4-fpm.sock">
                  PHP-FPM 7.4
                </option>
                <option value="unix:/var/run/php/php8.0-fpm.sock">
                  PHP-FPM 8.0
                </option>
                <option value="unix:/var/run/php/php8.1-fpm.sock">
                  PHP-FPM 8.1
                </option>
                <option value="unix:/var/run/php/php8.2-fpm.sock">
                  PHP-FPM 8.2
                </option>
                <option value="unix:/var/run/php/php8.3-fpm.sock">
                  PHP-FPM 8.3
                </option>
                <option value="unix:/var/run/hhvm/hhvm.sock">HHVM</option>
                <option value="custom">Custom</option>
              </select>
            </SectionRow>
            
            {php.phpBackupServer === "custom" && (
              <SectionRow
                label="Custom Backup PHP-FPM Server"
                tooltip="Custom path to backup PHP-FPM socket or host:port"
              >
                <Input
                  value={php.phpBackupServerCustom}
                  onChange={(e) => updateSiteField(site.id, "php.phpBackupServerCustom", e.target.value)}
                  placeholder="/run/php/php8.1-fpm.sock"
                />
              </SectionRow>
            )}
            
            <SectionRow
              label="WordPress"
              tooltip="WordPress preset for PHP configuration."
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`wp-${site.id}`}
                  checked={php.wordPressRules}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.wordPressRules", v)}
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
                  checked={php.drupalRules}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.drupalRules", v)}
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
                  checked={php.magentoRules}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.magentoRules", v)}
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
                  checked={php.joomlaRules}
                  onCheckedChange={(v) => updateSiteField(site.id, "php.joomlaRules", v)}
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