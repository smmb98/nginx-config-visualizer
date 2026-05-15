import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";

export function PythonSection() {
  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Python Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Python server"
          tooltip="Unix socket path used by the Python WSGI/uWSGI server process."
        >
          <Input placeholder="/tmp/uwsgi.sock" />
        </SectionRow>
      </div>
    </div>
  );
}
