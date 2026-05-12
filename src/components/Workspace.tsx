import { useAppStore } from '@/store/useAppStore'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { FileTree } from '@/components/FileTree'
import { UIConfigPage } from '@/pages/UIConfigPage'
import { CodeConfigPage } from '@/pages/CodeConfigPage'
import { VisualConfigPage } from '@/pages/VisualConfigPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Workspace() {
  const { sidebarCollapsed, toggleSidebar, activeTab } = useAppStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'ui':
        return <UIConfigPage />
      case 'code':
        return <CodeConfigPage />
      case 'visual':
        return <VisualConfigPage />
      case 'analytics':
        return <AnalyticsPage />
      default:
        return <UIConfigPage />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background-base">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            'absolute left-4 top-16 z-10 h-8 w-8 rounded-full border border-border',
            'bg-surface shadow-md transition-all',
            sidebarCollapsed && 'left-0 translate-x-0'
          )}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>

        {/* Left Sidebar - File Tree */}
        <aside
          className={cn(
            'border-r border-border bg-surface flex flex-col transition-all duration-300',
            sidebarCollapsed ? 'w-0' : 'w-64'
          )}
        >
          <div className="p-2 border-b border-border">
            <h3 className="text-xs font-caps text-on-surface-variant px-2">
              File Explorer
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <FileTree />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}
