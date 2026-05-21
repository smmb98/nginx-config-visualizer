import { Input } from "@/components/ui/input";
import { SectionRow } from "@/components/SectionRow";
import { useGlobalConfigStore } from "../store";

export function PythonSection() {
  const updateField = useGlobalConfigStore((s) => s.updateField);
  const pythonSocket = useGlobalConfigStore((s) => s.pythonSocket) as string;

  return (
    <div className="mt-6">
      <h3 className="text-title-md mb-4">Python Configuration</h3>
      <div className="space-y-4">
        <SectionRow
          label="Python server"
          tooltip="Unix socket path used by the Python WSGI/uWSGI server process."
        >
          <Input
            value={pythonSocket}
            onChange={(e) =>
              updateField("pythonSocket", e.target.value)
            }
            placeholder="/tmp/uwsgi.sock"
          />
        </SectionRow>
      </div>
    </div>
  );
}
