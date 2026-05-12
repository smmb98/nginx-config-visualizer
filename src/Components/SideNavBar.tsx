import { useAppStore } from '../Stores/useAppStore';

export function SideNavBar() {
  const { setCurrentView } = useAppStore();

  return (
    <aside className="docked left-0 h-full w-16 border-r border-outline-variant bg-surface-container-lowest flex flex-col items-center py-4 space-y-6 shrink-0">
      {/* Top Navigation */}
      <div className="space-y-4 w-full flex flex-col items-center">
        {/* Files - Active, goes to Configuration */}
        <button
          onClick={() => setCurrentView('configuration')}
          className="flex flex-col items-center w-full py-3 text-primary bg-primary-container/10 border-l-2 border-primary transition-all duration-150"
        >
          <span className="material-symbols-outlined">folder_open</span>
          <span className="font-label-caps text-label-caps mt-1">Files</span>
        </button>

        {/* Search */}
        <button className="flex flex-col items-center w-full py-3 text-outline hover:text-on-surface hover:bg-surface-variant transition-all duration-150">
          <span className="material-symbols-outlined">search</span>
          <span className="font-label-caps text-label-caps mt-1">Search</span>
        </button>

        {/* Git */}
        <button className="flex flex-col items-center w-full py-3 text-outline hover:text-on-surface hover:bg-surface-variant transition-all duration-150">
          <span className="material-symbols-outlined">account_tree</span>
          <span className="font-label-caps text-label-caps mt-1">Git</span>
        </button>

        {/* Logs - goes to Editor */}
        <button
          onClick={() => setCurrentView('editor')}
          className="flex flex-col items-center w-full py-3 text-outline hover:text-on-surface hover:bg-surface-variant transition-all duration-150"
        >
          <span className="material-symbols-outlined">list_alt</span>
          <span className="font-label-caps text-label-caps mt-1">Logs</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-4 w-full flex flex-col items-center border-t border-outline-variant pt-4">
        {/* Security - goes to Intelligence */}
        <button
          onClick={() => setCurrentView('intelligence')}
          className="flex flex-col items-center w-full py-3 text-outline hover:text-on-surface hover:bg-surface-variant transition-all duration-150"
        >
          <span className="material-symbols-outlined">shield</span>
          <span className="font-label-caps text-label-caps mt-1">Security</span>
        </button>

        {/* Status - active indicator */}
        <div className="w-8 h-8 rounded-full bg-accent-active/20 flex items-center justify-center border border-accent-active/50">
          <span className="material-symbols-outlined text-[14px] text-accent-active">check_circle</span>
        </div>
      </div>
    </aside>
  );
}
