import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";

export function NginxSection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const nginxConfigDirectory = useGlobalConfigStore(
    (s) => s.nginxConfigDirectory,
  ) as string;
  const workerProcesses = useGlobalConfigStore(
    (s) => s.workerProcesses,
  ) as string;
  const user = useGlobalConfigStore((s) => s.user) as string;
  const pid = useGlobalConfigStore((s) => s.pid) as string;
  const clientMaxBodySize = useGlobalConfigStore(
    (s) => s.clientMaxBodySize,
  ) as number;
  const typesHashMaxSize = useGlobalConfigStore(
    (s) => s.typesHashMaxSize,
  ) as number;
  const typesHashBucketSize = useGlobalConfigStore(
    (s) => s.typesHashBucketSize,
  ) as number;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">NGINX Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Config Directory"
          tooltip="Directory where NGINX is installed, e.g. /etc/nginx/"
        >
          <Input
            value={nginxConfigDirectory}
            onChange={(e) =>
              updateField("nginxConfigDirectory", e.target.value)
            }
            placeholder="/etc/nginx/"
          />
        </SectionRow>
        <SectionRow
          label="worker_processes"
          tooltip="Determines how many NGINX worker processes are spawned. Set to auto to match your CPU core count."
        >
          <Select
            value={workerProcesses}
            onValueChange={(v) =>
              updateField("workerProcesses", v)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">auto</SelectItem>
              {Array.from({ length: 16 }, (_, i) => i + 1).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SectionRow>
        <SectionRow
          label="user"
          tooltip="UNIX user and group that the worker processes will run as. Set to www-data for the default NGINX user."
        >
          <Input
            value={user}
            onChange={(e) =>
              updateField("user", e.target.value)
            }
            placeholder="www-data"
          />
        </SectionRow>
        <SectionRow
          label="pid"
          tooltip="Location of the NGINX process ID file, used by the master process."
        >
          <Input
            value={pid}
            onChange={(e) =>
              updateField("pid", e.target.value)
            }
            placeholder="/run/nginx.pid"
          />
        </SectionRow>
        <SectionRow
          label="client_max_body_size"
          tooltip="Sets the maximum allowed body size of a client request. Use mb suffix for megabytes."
        >
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={clientMaxBodySize}
              onChange={(e) =>
                updateField("clientMaxBodySize", parseFloat(e.target.value))
              }
              className="w-28"
            />
            <span className="text-sm text-muted-foreground">MB</span>
          </div>
        </SectionRow>
        <SectionRow
          label="types_hash_max_size"
          tooltip="Sets the maximum size of the types hash table. Larger values consume more memory."
        >
          <Select
            value={String(typesHashMaxSize)}
            onValueChange={(v) =>
              updateField("typesHashMaxSize", parseFloat(v))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 8 }, (_, i) => Math.pow(2, i + 6)).map(
                (n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </SectionRow>
        <SectionRow
          label="types_hash_bucket_size"
          tooltip="Sets the bucket size for the server names hash table."
        >
          <Select
            value={String(typesHashBucketSize)}
            onValueChange={(v) =>
              updateField("typesHashBucketSize", parseFloat(v))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => Math.pow(2, i + 4)).map(
                (n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </SectionRow>
      </div>
    </div>
  );
}
