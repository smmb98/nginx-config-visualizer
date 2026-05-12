export function Footer() {
  return (
    <footer className="flex items-center justify-between px-4 w-full z-50 fixed bottom-0 h-8 bg-surface-container-low border-t border-outline-variant">
      <div className="font-code-md text-code-md text-on-surface">
        Syntax: <span className="text-accent-active font-bold">Valid</span> | Security: <span className="text-accent-active font-bold">High</span> | 1.24.0
      </div>
      <div className="flex items-center space-x-6">
        <a
          className="font-code-md text-code-md text-on-surface-variant hover:text-primary transition-colors"
          href="#"
        >
          Documentation
        </a>
        <a
          className="font-code-md text-code-md text-on-surface-variant hover:text-primary transition-colors"
          href="#"
        >
          Changelog
        </a>
      </div>
    </footer>
  );
}
