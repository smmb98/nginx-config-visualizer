import { FieldGroup } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";

export function DockerSection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const dockerTweaks = useGlobalConfigStore(
    (s) => s.dockerTweaks,
  ) as boolean;
  const dockerfile = useGlobalConfigStore((s) => s.dockerfile) as boolean;
  const dockerCompose = useGlobalConfigStore(
    (s) => s.dockerCompose,
  ) as boolean;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Docker Configuration</h3>
      <div className="space-y-4">
        <SectionRow label="Docker" align="top">
          <FieldGroup>
            <div className="flex items-center gap-3 pb-3">
              <Button
                variant="default"
                size="lg"
                className="text-primary bg-primary/10! border  border-primary hover:bg-primary/20! transition-all duration-150"
                onClick={() => updateField("dockerTweaks", !dockerTweaks)}
              >
                Apply Docker Tweaks
              </Button>
              <span className="text-sm text-muted-foreground">
                Apply configuration tweaks for running NGINX with Docker.
                <br />
                <small>
                  Updates the NGINX user to <code className="slim">nginx</code>{" "}
                  and the pid to{" "}
                  <code className="slim">/var/run/nginx.pid</code>.
                </small>
              </span>
            </div>
          </FieldGroup>
        </SectionRow>
        <SectionRow label="Dockerfile">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dockerfile"
              checked={dockerfile}
              onCheckedChange={(v) =>
                updateField("dockerfile", v)
              }
            />
            <Label htmlFor="dockerfile" className="text-sm">
              Include Dockerfile to run NGINX with Docker
            </Label>
          </div>
        </SectionRow>
        <SectionRow label="Docker Compose">
          <div className="flex items-center gap-2">
            <Checkbox
              id="docker-compose"
              checked={dockerCompose}
              onCheckedChange={(v) =>
                updateField("dockerCompose", v)
              }
            />
            <Label htmlFor="docker-compose" className="text-sm">
              Include docker-compose to run NGINX with docker-compose
            </Label>
          </div>
        </SectionRow>
      </div>
    </div>
  );
}
