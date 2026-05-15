import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SectionRow } from "@/components/SectionRow";

export function NginxSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">NGINX Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Config Directory"
          tooltip="Directory where NGINX is installed, e.g. /etc/nginx/"
        >
          <Input placeholder="/etc/nginx/" />
        </SectionRow>
        <SectionRow
          label="worker_processes"
          tooltip="Determines how many NGINX worker processes are spawned. Set to auto to match your CPU core count."
        >
          <Select defaultValue="auto">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="auto" />
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
          <Input placeholder="www-data" />
        </SectionRow>
        <SectionRow
          label="pid"
          tooltip="Location of the NGINX process ID file, used by the master process."
        >
          <Input placeholder="/run/nginx.pid" />
        </SectionRow>
        <SectionRow
          label="client_max_body_size"
          tooltip="Sets the maximum allowed body size of a client request. Use mb suffix for megabytes."
        >
          <div className="flex items-center gap-2">
            <Input type="number" min={0} placeholder="16" className="w-28" />
            <span className="text-sm text-muted-foreground">MB</span>
          </div>
        </SectionRow>
        <SectionRow
          label="types_hash_max_size"
          tooltip="Sets the maximum size of the types hash table. Larger values consume more memory."
        >
          <Select defaultValue="2048">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="2048" />
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
          <Select defaultValue="64">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="64" />
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
