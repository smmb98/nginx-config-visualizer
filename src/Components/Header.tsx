import { useAppStore } from '../Stores/useAppStore';

type View = 'configuration' | 'editor' | 'visualizer' | 'intelligence';

export function Header() {
  const { currentView, setCurrentView } = useAppStore();

  const navItems: { view: View; label: string }[] = [
    { view: 'configuration', label: 'Configuration' },
    { view: 'editor', label: 'Editor' },
    { view: 'visualizer', label: 'Visualizer' },
    { view: 'intelligence', label: 'Intelligence' },
  ];

  return (
    <header className="docked full-width top-0 border-b border-outline-variant bg-surface-container-low/50 backdrop-blur-md flex justify-between items-center w-full px-gutter h-16 z-50">
      {/* Logo */}
      <div className="font-headline-md text-headline-md font-bold text-primary tracking-tighter">
        NGINX Intelligence
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <a
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`font-body-sm text-body-sm cursor-pointer transition-colors ${
              currentView === item.view
                ? 'text-primary border-b-2 border-primary pb-2 font-bold'
                : 'text-on-surface-variant font-medium hover:text-on-surface'
            }`}
            href="#"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all duration-200">
          terminal
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-variant/50 p-2 rounded-lg transition-all duration-200">
          settings
        </button>
      </div>
    </header>
  );
}
