# Nginx Visualizer: Design Principles

## 1. Layout Architecture (4-Tab System)

### 1.1 Header Navigation
- **4 Primary Tabs:**
  1. **UI Configuration** - Form-based interface with categorized sections
  2. **Code Configuration** - Monaco Editor with Nginx syntax highlighting
  3. **Visual Configuration** - ReactFlow canvas for node-based visualization
  4. **Analytics/Intelligent Auditor** - Dashboard with security/health metrics
- **Reset Button:** Circular icon button (refresh/clear icon) that clears all state and returns to landing page

### 1.2 Main Workspace
- **Two-pane layout:**
  - **Left (collapsible):** File Tree showing virtual `/etc/nginx/` structure
  - **Right:** Dynamic content area that adapts to active tab
- **Focus Mode:** Collapse sidebars to maximize content area

### 1.3 Footer
- Status indicators (Syntax: Valid/Invalid, Security: Score)
- Version display
- Monetization: Donate button, Documentation link

## 2. Color Palette (Modern Dark Theme)

| Color | Value | Usage |
|-------|-------|-------|
| background-base | `#020617` | Main background |
| background | `#13131b` | Panel backgrounds |
| surface | `#13131b` | Card/surface elements |
| surface-variant | `#34343d` | Sidebar, secondary panels |
| surface-container-lowest | `#0d0d15` | Deepest level containers |
| surface-container-low | `#1b1b23` | Low elevation surfaces |
| surface-container | `#1f1f27` | Default container |
| surface-container-high | `#292932` | Elevated containers |
| surface-container-highest | `#34343d` | Highest elevation |
| primary | `#c0c1ff` | Primary actions, accents |
| on-primary | `#1000a9` | Text on primary |
| primary-container | `#8083ff` | Primary element backgrounds |
| on-primary-container | `#0d0096` | Text on primary container |
| secondary | `#bec6e0` | Secondary text |
| on-surface | `#e4e1ed` | Primary text |
| on-surface-variant | `#c7c4d7` | Secondary text |
| outline | `#908fa0` | Borders, dividers |
| outline-variant | `#464554` | Subtle borders |
| accent-active | `#10b981` | Success/valid states |
| accent-error | `#f43f5e` | Errors/invalid states |
| error | `#ffb4ab` | Error backgrounds |
| error-container | `#93000a` | Error containers |
| glass-fill | `rgba(255, 255, 255, 0.05)` | Glassmorphism effects |

## 3. Typography

| Style | Font | Size | Line Height | Weight |
|-------|------|------|-------------|--------|
| headline-lg | Geist | 30px | 38px | 600 |
| headline-md | Geist | 24px | 32px | 600 |
| body-md | Geist | 16px | 24px | 400 |
| body-sm | Geist | 14px | 20px | 400 |
| code-md | JetBrains Mono | 14px | 22px | 400 |
| label-caps | Geist | 12px | 16px | 600 |

## 4. Component Styling

### 4.1 Glassmorphism Panels
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### 4.2 Nodes (ReactFlow)
- Rounded corners (rounded-xl)
- Subtle borders (border-slate-800)
- Glassmorphism effect
- Hover states with accent-active border

### 4.3 Connectors
- Bezier curves with animated flow for valid configs
- Color: primary (#c0c1ff) for active paths
- Color: accent-error (#f43f5e) for error paths

## 5. Interaction Model

### 5.1 State-Driven Navigation
- URL hash routing for tabs: `#/ui`, `#/code`, `#/visual`, `#/analytics`
- Landing page blocks access until config is initialized
- File selection hydrates the appropriate tab state

### 5.2 Non-Blocking Operations
- Web Worker for nginx parsing
- Debounced editor updates (300ms)
- Virtual scrolling for large configs

### 5.3 Bi-directional Sync
- Clicking a node highlights corresponding code lines
- Code selection highlights flow nodes
- File tree selection loads content into active tab

## 6. File Tree Structure

### 6.1 Virtual Directory Layout
```
/etc/nginx/
├── nginx.conf
├── mime.types
├── fastcgi_params
├── sites-available/
│   ├── default
│   └── *.conf
├── sites-enabled/
│   └── symlinks to sites-available
├── conf.d/
│   ├── ssl.inc
│   └── proxy.inc
├── ssl/
│   ├── *.crt
│   └── *.key
└── snippets/
    └── *.conf
```

### 6.2 Include Directive Handling
- Parse `include /path/*.conf;` patterns
- Show file relationships in tree
- Support nested includes (max 3 levels)

## 7. Tab-Specific Requirements

### 7.1 UI Configuration
- Cascaded form sections with expand/collapse
- Toggle switches for boolean directives
- Real-time config generation preview
- Section: Global, Sites, Security, Advanced

### 7.2 Code Configuration
- Monaco Editor with custom nginx theme
- Line numbers, minimap, folding
- Error markers in gutter
- Quick fix lightbulb actions

### 7.3 Visual Configuration
- ReactFlow with custom node types
- Server/Location/Upstream node components
- Interactive edges with path visualization
- Zoom controls, fit-to-screen, focus mode

### 7.4 Analytics
- Health score circular gauge (SVG)
- Security audit checklist with severity levels
- Performance metrics cards
- Natural language summary panel
- Optimization recommendations table