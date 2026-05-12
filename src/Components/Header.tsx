import { Button } from '@/components/ui/button';
import { useAppStore } from '@/Stores/useAppStore';

export function Header() {
  const { setCurrentView, currentView } = useAppStore();

  const navItems: { view: string; label: string }[] = [
    { view: 'configuration', label: 'Configuration' },
    { view: 'editor', label: 'Editor' },
    { view: 'visualizer', label: 'Visualizer' },
    { view: 'intelligence', label: 'Intelligence' },
  ];

  return (
    <header className="docked full-width top-0 border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-md flex justify-between items-center w-full px-4 h-16 z-50">
      {/* Logo */}
      <div className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">
        NGINX Intelligence
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Button
            key={item.view}
            onClick={() => setCurrentView(item.view as any)}
            variant="ghost"
            className={`font-body-sm text-body-sm cursor-pointer transition-colors h-auto p-0 hover:bg-transparent ${
              currentView === item.view
                ? 'text-primary border-b-2 border-primary pb-2 font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <span className="material-symbols-outlined text-on-surface-variant">terminal</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <span className="material-symbols-outlined text-on-surface-variant">settings</span>
        </Button>
      </div>
    </header>
  );
}
