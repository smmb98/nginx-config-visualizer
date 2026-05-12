import { useState } from 'react'
import { useAppStore, type FileSystemNode } from '@/store/useAppStore'
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FileTree() {
  const { fileSystem, activeFileId, selectFile } = useAppStore()
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['/etc/nginx']))

  const toggleDir = (dirId: string) => {
    const newExpanded = new Set(expandedDirs)
    if (newExpanded.has(dirId)) {
      newExpanded.delete(dirId)
    } else {
      newExpanded.add(dirId)
    }
    setExpandedDirs(newExpanded)
  }

  return (
    <div className="p-2 space-y-1">
      {fileSystem.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          activeFileId={activeFileId}
          expandedDirs={expandedDirs}
          onToggleDir={toggleDir}
          onSelectFile={selectFile}
          level={0}
        />
      ))}
      {fileSystem.length === 0 && (
        <div className="px-3 py-4 text-sm text-muted-foreground text-center">
          No files uploaded yet
        </div>
      )}
    </div>
  )
}

interface TreeNodeProps {
  node: FileSystemNode
  activeFileId: string | null
  expandedDirs: Set<string>
  onToggleDir: (id: string) => void
  onSelectFile: (id: string) => void
  level: number
}

function TreeNode({ node, activeFileId, expandedDirs, onToggleDir, onSelectFile, level }: TreeNodeProps) {
  const isExpanded = expandedDirs.has(node.id)
  const isActive = activeFileId === node.id
  const paddingLeft = level * 12 + 8

  if (node.type === 'directory') {
    return (
      <div>
        <button
          onClick={() => onToggleDir(node.id)}
          className={cn(
            'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm transition-colors',
            'hover:bg-surface-container-low text-on-surface',
            isActive && 'bg-primary-container/10 text-primary'
          )}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          ) : (
            <Folder className="w-4 h-4 text-yellow-500" />
          )}
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
    )
  }

  return (
    <button
      onClick={() => onSelectFile(node.id)}
      className={cn(
        'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
        'hover:bg-surface-container-low text-on-surface-variant',
        isActive && 'bg-primary-container/10 text-primary'
      )}
      style={{ paddingLeft: `${paddingLeft + 16}px` }}
    >
      <FileCode className="w-4 h-4" />
      <span className="truncate">{node.name}</span>
    </button>
  )
}
