import { useAppStore, type FileSystemNode } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function FileTree() {
  const {
    fileSystem,
    activeFileId,
    selectFile,
    expandedDirs,
    setExpandedDirs,
  } = useAppStore();

  const toggleDir = (dirId: string) => {
    const current = new Set(expandedDirs);
    current.has(dirId) ? current.delete(dirId) : current.add(dirId);
    setExpandedDirs(Array.from(current));
  };

  if (fileSystem.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <p className="text-body-sm text-on-surface-variant">No files yet</p>
      </div>
    );
  }

  const expandedSet = new Set(expandedDirs);

  return (
    <div className="p-2 space-y-0.5">
      {fileSystem.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          activeFileId={activeFileId}
          expandedDirs={expandedSet}
          onToggleDir={toggleDir}
          onSelectFile={selectFile}
          level={0}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  node: FileSystemNode;
  activeFileId: string | null;
  expandedDirs: Set<string>;
  onToggleDir: (id: string) => void;
  onSelectFile: (id: string) => void;
  level: number;
}

function TreeNode({
  node,
  activeFileId,
  expandedDirs,
  onToggleDir,
  onSelectFile,
  level,
}: TreeNodeProps) {
  const isExpanded = expandedDirs.has(node.id);
  const isActive = activeFileId === node.id;
  const indent = level * 12 + 8;

  if (node.type === "directory") {
    return (
      <div>
        <button
          onClick={() => onToggleDir(node.id)}
          style={{ paddingLeft: `${indent}px` }}
          className="w-full flex items-center gap-1.5 pr-2 py-1.5 rounded text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          <svg
            className={cn(
              "w-3 h-3 shrink-0 transition-transform",
              isExpanded && "rotate-90"
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <svg
            className="w-4 h-4 shrink-0 text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
          <span className="truncate">{node.name}</span>
        </button>

        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                activeFileId={activeFileId}
                expandedDirs={expandedDirs}
                onToggleDir={onToggleDir}
                onSelectFile={onSelectFile}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelectFile(node.id)}
      style={{ paddingLeft: `${indent + 16}px` }}
      className={cn(
        "w-full flex items-center gap-2 pr-2 py-1.5 rounded text-body-sm transition-colors",
        isActive
          ? "bg-primary-container/10 text-primary"
          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
      )}
    >
      <svg
        className="w-4 h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>
      <span className="truncate">{node.name}</span>
    </button>
  );
}
