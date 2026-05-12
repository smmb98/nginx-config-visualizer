import { useAppStore, type TabType } from '@/store/useAppStore'
import { Settings, Code2, GitBranch, BarChart3, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TabItem {
  id: TabType
  label: string
  icon: React.ReactNode
}

const tabs: TabItem[] = [
  { id: 'ui', label: 'UI Config', icon: <Settings className="w-4 h-4" /> },
  { id: 'code', label: 'Code', icon: <Code2 className="w-4 h-4" /> },
  { id: 'visual', label: 'Visual', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> }
]

export function Header() {
  const { activeTab, switchTab, resetWorkspace, isInitialized } = useAppStore()

  if (!isInitialized) return null

  return (
    <header className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary-container/20">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <span className="font-semibold text-on-surface">Nginx Viz</span>
      </div>

      {/* Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={resetWorkspace}
          className="h-9 w-9 text-on-surface-variant hover:text-accent-error hover:bg-accent-error/10"
          title="Reset Workspace"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
